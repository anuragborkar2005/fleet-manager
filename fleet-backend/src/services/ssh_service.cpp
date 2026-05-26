#include "services/ssh_service.hpp"

SSHService::SSHService(const std::string &host, const int &port, const std::string &user, const std::string &pass)
{
    session = ssh_new();
    if (!session)
    {
        throw std::runtime_error("Failed to create session");
    }

    int verbosity = SSH_LOG_PROTOCOL;
    ssh_options_set(session, SSH_OPTIONS_HOST, host.c_str());
    ssh_options_set(session, SSH_OPTIONS_PORT, &port);
    ssh_options_set(session, SSH_OPTIONS_USER, user.c_str());
    ssh_options_set(session, SSH_OPTIONS_LOG_VERBOSITY, &verbosity);

    if (ssh_connect(session) != SSH_OK)
    {
        throw std::runtime_error(std::string("SSH connect") + ssh_get_error(session));
    }
    if (ssh_userauth_password(session, nullptr, pass.c_str()) != SSH_AUTH_SUCCESS)
    {
        throw std::runtime_error(std::string("Authentication failed: ") + ssh_get_error(session));
    }
    channel = ssh_channel_new(session);
    if (!channel)
        throw std::runtime_error("ssh_channel_new failed");

    if (ssh_channel_open_session(channel) != SSH_OK)
    {
        throw std::runtime_error(std::string("channel open failed: ") + ssh_get_error(session));
    }

    int rc = ssh_channel_request_pty_size(channel, "xterm-256color", 120, 35);
    if (rc != SSH_OK)
    {
        std::cerr << "pty request failed: " << ssh_get_error(session) << "\n";
    }

    ssh_channel_request_env(channel, "TERM", "xterm-256color");

    if (ssh_channel_request_shell(channel) != SSH_OK)
    {
        throw std::runtime_error(std::string("request shell failed: ") + ssh_get_error(session));
    }
}

SSHService::~SSHService()
{
    if (channel)
    {
        ssh_channel_close(channel);
        ssh_channel_free(channel);
    }
    if (session)
    {
        ssh_disconnect(session);
        ssh_free(session);
    }
}
void SSHService::send(const std::string &data)
{
    if (!channel || data.empty())
        return;
    ssh_channel_write(channel, data.data(), data.size());
}
std::string SSHService::read_available()
{
    std::string output;
    char buffer[8192];

    while (true)
    {
        int n = ssh_channel_read_nonblocking(channel, buffer, sizeof(buffer), 0);
        if (n <= 0)
            break;
        output.append(buffer, n);
    }

    while (true)
    {
        int n = ssh_channel_read_nonblocking(channel, buffer, sizeof(buffer), 1);
        if (n <= 0)
            break;
        output.append(buffer, n);
    }

    return output;
}

bool SSHService::is_connected() const
{
    return channel && !ssh_channel_is_closed(channel);
}