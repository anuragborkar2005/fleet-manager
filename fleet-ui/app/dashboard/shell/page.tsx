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
            <div className="border rounded-md shadow-md">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-4">
                    <div className="flex items-center gap-3">
                        <MonitorIcon className="w-5 h-5 " />
                        <div>
                            <h1 className="text-base font-semibold ">
                                Shell Terminal
                            </h1>
                            <p className="text-xs ">
                                Pseudo-terminal access for managed nodes
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Node:</span>
                        <Select value={nodeId} onValueChange={setNodeId}>
                            <SelectTrigger className="w-50">
                                <SelectValue placeholder="Select a node" />
                            </SelectTrigger>
                            <SelectContent>
                                {nodes.map((node) => (
                                    <SelectItem key={node.id} value={node.id}>
                                        {node.hostname} ({node.ip})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xs overflow-hidden h-150 relative no-scrollbar">
                    <div className="flex gap-2 p-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    </div>
                    <div className="h-full no-scrollbar">
                        <SSHShell />
                    </div>
                </div>
            </div>
        </div>
    );
}
