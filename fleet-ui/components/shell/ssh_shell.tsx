"use client";
import { useEffect, useRef, useContext } from "react";
import { Terminal } from "xterm";
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
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            cols: 120,
            rows: 35,
            theme: {
                background: "#020617", // slate-950
                foreground: "#f8fafc", // slate-50
                cursor: "#38bdf8", // sky-400
            },
        });

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
            <div className="flex flex-col items-center justify-center h-[600px] bg-slate-950 rounded-lg border border-slate-800 text-slate-400">
                <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                <p>Please select a node to access the terminal</p>
            </div>
        );
    }

    return (
        <Card className="bg-slate-950 border-slate-800 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border-b border-slate-800">
                <TerminalIcon className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-mono text-slate-400">
                    {selectedNode?.hostname || "unknown"}@
                    {selectedNode?.ip || "0.0.0.0"}
                </span>
            </div>
            <div className="p-2 h-[600px] overflow-y-hidden overflow-x-auto">
                <div ref={terminalRef} className="w-fit mx-auto" />
            </div>
        </Card>
    );
}

export default SSHShell;
