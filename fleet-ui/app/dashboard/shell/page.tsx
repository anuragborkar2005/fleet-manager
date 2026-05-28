"use client";
import dynamic from "next/dynamic";
import { useContext } from "react";
import { NodeContext } from "@/providers/node-provider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MonitorIcon } from "lucide-react";

const SSHShell = dynamic(() => import("@/components/shell/ssh_shell"), {
    ssr: false,
});

export default function ShellPage() {
    const { nodeId, nodes, setNodeId } = useContext(NodeContext)!;

    return (
        <div className="p-6">
            <div className="border rounded-lg shadow-lg bg-slate-950">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
                    <div className="flex items-center gap-3">
                        <MonitorIcon className="w-5 h-5 text-sky-400" />
                        <div>
                            <h1 className="text-base font-semibold text-slate-100">
                                Shell Terminal
                            </h1>
                            <p className="text-xs text-slate-400">
                                Pseudo-terminal access for managed nodes
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-300">
                            Node:
                        </span>
                        <Select value={nodeId} onValueChange={setNodeId}>
                            <SelectTrigger className="w-48 rounded-none bg-slate-950 border border-slate-700 text-slate-200 focus:ring-2 focus:ring-sky-400">
                                <SelectValue placeholder="Select a node" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-950 border border-slate-700 text-slate-200">
                                {nodes.map((node) => (
                                    <SelectItem
                                        key={node.id}
                                        value={node.id}
                                        className="rounded-xs"
                                    >
                                        {node.hostname} ({node.ip})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Terminal */}
                <div className="relative h-[500px] overflow-hidden">
                    {/* macOS-style dots */}
                    <div className="flex gap-2 p-2 bg-slate-900 border-b border-slate-800">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    </div>
                    <div className="h-full overflow-auto">
                        <SSHShell />
                    </div>
                </div>
            </div>
        </div>
    );
}
