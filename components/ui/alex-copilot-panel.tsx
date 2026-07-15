"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface AlexCopilotPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AlexCopilotPanel({ isOpen, onClose }: AlexCopilotPanelProps) {
    const pathname = usePathname();
    const [messages, setMessages] = useState<Array<{ sender: "user" | "alex"; text: string }>>([]);
    const [input, setInput] = useState("");

    // Map route names to friendly context targets for the RAG prompt engine
    const getContextMetadata = (path: string) => {
        if (path.includes("/loans")) return { title: "Active Loans Schema", icon: "💵", dbNode: "Tenant_Loan_Ledgers" };
        if (path.includes("/analytics")) return { title: "LMS Analytics Node", icon: "📈", dbNode: "Aggregate_Yields" };
        if (path.includes("/settings")) return { title: "Security Protocols", icon: "🛡️", dbNode: "System_Config" };
        return { title: "Dashboard Overview", icon: "🌐", dbNode: "User_Session_Map" };
    };

    const context = getContextMetadata(pathname);

    // Auto-inject system greeting when panel opens with page context
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    sender: "alex",
                    text: `Hi Themba! 👋 I've mapped to your current view: **${context.title}**. Ask me to trace loans, check risk rules, or parse system parameters for this node.`
                }
            ]);
        }
    }, [isOpen, pathname, context.title]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] p-4 h-full flex flex-col pointer-events-none">

            {/* 
        GLASSMORPHIC PANEL CONTAINMENT:
        Combines background opacity, high-level backdrop-blur, and translucent borders
        to create the ultimate frosting depth effect.
      */}
            <div className="flex flex-col h-full w-full rounded-2xl border border-white/20 dark:border-neutral-800/40 bg-white/70 dark:bg-neutral-950/60 backdrop-blur-xl shadow-2xl pointer-events-auto overflow-hidden animate-pulse-glow">

                {/* Header */}
                <div className="p-4 border-b border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-between bg-white/40 dark:bg-neutral-900/40">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">🤖</span>
                        <div>
                            <h3 className="font-bold text-sm tracking-tight text-neutral-800 dark:text-neutral-100">Alex Co-Pilot</h3>
                            <p className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active Session Bound
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Dynamic Context Scope Banner */}
                <div className="p-3 bg-blue-500/10 dark:bg-blue-500/5 border-b border-blue-500/20 dark:border-blue-500/10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                        <span>{context.icon}</span>
                        <span className="font-semibold tracking-wide">{context.title}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 dark:bg-blue-500/30 text-[9px] text-blue-600 dark:text-blue-300">
            {context.dbNode}
          </span>
                </div>

                {/* Chat Feed Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-thin">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-sm ${
                                    msg.sender === "user"
                                        ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                                        : "bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800/60 text-neutral-700 dark:text-neutral-300"
                                }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Bar */}
                <div className="p-4 border-t border-neutral-200/50 dark:border-neutral-800/50 bg-white/30 dark:bg-neutral-900/30">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!input.trim()) return;
                            setMessages(prev => [...prev, { sender: "user", text: input }]);
                            setInput("");
                        }}
                        className="flex gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Ask about this page...`}
                            className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                        <button
                            type="submit"
                            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-950 hover:opacity-90 transition-opacity"
                        >
                            Ask
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}