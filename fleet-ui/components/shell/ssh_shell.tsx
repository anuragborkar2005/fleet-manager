"use client";
import { useEffect, useRef, useContext } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "xterm/css/xterm.css";
import { NodeContext } from "@/providers/node-provider";
import { Card } from "@/components/ui/card";
import { AlertCircle, TerminalIcon } from "lucide-react";

function SSHShell() {
    const { nodeId, nodes } = useContext(NodeContext)!;
    const socketRef = useRef<WebSocket | null>(null);
    const terminalRef = useRef<HTMLDivElement | null>(null);
    const xtermRef = useRef<Terminal | null>(null);

    const selectedNode = nodes.find((n) => n.id === nodeId);

    useEffect(() => {
        if (!nodeId || !terminalRef.current) return;

        const term = new Terminal({
            cursorBlink: true,
            fontFamily: "'FiraCode Nerd Font', monospace",
            fontSize: 14,
            cols: 120,
            rows: 35,
            theme: {
                background: "#020617", // slate-950
                foreground: "#f8fafc", // slate-50
                cursor: "#38bdf8", // sky-400
            },
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.loadAddon(new WebLinksAddon());
        xtermRef.current = term;
        term.open(terminalRef.current);

        // Connect WebSocket
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//localhost:8080/ssh`;
        const newSocket = new WebSocket(wsUrl);
        socketRef.current = newSocket;

        newSocket.onopen = () => {
            term.writeln(
                `\x1b[1;34m[*] Connection opened, initializing for ${selectedNode?.hostname || nodeId}...\x1b[0m`,
            );
            newSocket.send(JSON.stringify({ node_id: nodeId }));
        };

        newSocket.onmessage = (msg) => {
            term.write(msg.data);
        };

        newSocket.onerror = () => {
            term.writeln("\r\n\x1b[1;31m[!] WebSocket Connection Error\x1b[0m");
        };

        newSocket.onclose = () => {
            term.writeln("\r\n\x1b[1;31m[!] Connection Closed\x1b[0m");
        };

        term.onData((data: string) => {
            if (newSocket.readyState === WebSocket.OPEN) {
                newSocket.send(data);
            }
        });

        return () => {
            newSocket.close();
            term.dispose();
        };
    }, [nodeId, selectedNode?.hostname]);

    if (!nodeId) {
        return (
            <Card className="flex flex-col items-center justify-center h-[300px] bg-slate-950 border border-slate-800 rounded-lg text-slate-400 shadow-inner">
                <AlertCircle className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-sm">
                    Please select a node to access the terminal
                </p>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-950 border border-slate-800 overflow-hidden shadow-xl rounded-lg">
            <div className="p-2">
                <div
                    ref={terminalRef}
                    className="w-full h-[500px] overflow-auto no-scrollbar rounded-b-lg"
                ></div>
            </div>
        </Card>
    );
}

export default SSHShell;
