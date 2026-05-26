#pragma once

#include <string>
#include <iostream>
#include <stdexcept>
#include <libssh/libssh.h>

class SSHService
{
private:
    ssh_session session = nullptr;
    ssh_channel channel = nullptr;

public:
    SSHService(const std::string &host, const int &port, const std::string &user, const std::string &password);
    ~SSHService();

    void send(const std::string &command);
    std::string read_available();
    bool is_connected() const;
};
