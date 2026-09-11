"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Send, Bot, User, Loader2 } from "lucide-react";
import {apiClient} from "@/lib/api-client";

interface AlexCopilotPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    id: string;
    sender: "user" | "alex";
    text: string;
}

interface UserContext {
    name: string;
    role: string;
    email: string;
    orgId: string;
    orgName: string;
}

export function AlexCopilotPanel({ isOpen, onClose }: AlexCopilotPanelProps) {
    const pathname = usePathname();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [userContext, setUserContext] = useState<UserContext>({
        name: "",
        role: "",
        email: "",
        orgId: "",
        orgName: "",
    });

    // Resolve page context metadata
    const getContextMetadata = (path: string) => {
        if (path.includes("/loans"))
            return { title: "Active Loans", icon: "💵", dbNode: "Track & Manage Loans" };
        if (path.includes("/analytics"))
            return { title: "LMS Analytics Node", icon: "📈", dbNode: "Aggregate_Yields" };
        if (path.includes("/settings"))
            return { title: "Security Protocols", icon: "🛡️", dbNode: "System_Config" };
        if (path.includes("/clients"))
            return { title: "Clients Overview", icon: "👥", dbNode: "All Borrowers" };
        if (path.includes("/users"))
            return { title: "Users Overview", icon: "👥", dbNode: "System Users" };
        if (path.includes("/organizations"))
            return { title: "Organizations Overview", icon: "🏢", dbNode: "Onboarded Organizations" };
        if (path.includes("/audit"))
            return { title: "System Audit & Security Guard", icon: "🛡️", dbNode: "System Audit Logs" };
        return { title: "Dashboard Overview", icon: "🌐", dbNode: "User_Session_Map" };
    };

    const context = getContextMetadata(pathname);

    // Safely read localStorage client-side
    useEffect(() => {
        if (typeof window !== "undefined") {
            setUserContext({
                name: localStorage.getItem("lms_user_name") || "User",
                role: localStorage.getItem("lms_user_role") || "Member",
                email: localStorage.getItem("lms_user_email") || "",
                orgId: localStorage.getItem("lms_org_id") || "0",
                orgName: localStorage.getItem("organizationName") || "Workspace",
            });
        }
    }, []);

    // Initialize initial welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeName = userContext.name ? userContext.name : "there";
            setMessages([
                {
                    id: "welcome-msg",
                    sender: "alex",
                    text: `Hi ${welcomeName}! 👋 I'm Alex , your AI Assistant. You're currently viewing ${context.title}. How can I assist with your loan operations or workspace queries today?`,
                },
            ]);
        }
    }, [isOpen, context.title, userContext.name, messages.length]);

    // Auto-scroll chat feed to the latest token
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isGenerating]);

    // Submit prompt and stream Ollama response
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isGenerating) return;

        const userPrompt = input.trim();
        setInput("");

        // 1. Construct messages
        const userMessage: Message = {
            id: Date.now().toString(),
            sender: "user",
            text: userPrompt,
        };

        const alexMessageId = (Date.now() + 1).toString();
        const initialAlexMessage: Message = {
            id: alexMessageId,
            sender: "alex",
            text: "",
        };

        const updatedMessages = [...messages, userMessage];
        setMessages((prev) => [...prev, userMessage, initialAlexMessage]);
        setIsGenerating(true);

        try {
            // Track response text length to compute incremental stream deltas
            let accumulatedLength = 0;

            // 2. Stream using apiClient.post
            await apiClient.post(
                "/Copilot/stream",
                {
                    prompt: userPrompt,
                    messages: updatedMessages,
                    userContext,
                    pageContext: context,
                },
                {
                    responseType: "text",
                    onDownloadProgress: (progressEvent) => {
                        const chunkText = progressEvent.event.target.responseText;
                        const newChunk = chunkText.slice(accumulatedLength);
                        accumulatedLength = chunkText.length;

                        // Append newly streamed chunk to state
                        setMessages((prevMessages) =>
                            prevMessages.map((msg) =>
                                msg.id === alexMessageId
                                    ? { ...msg, text: msg.text + newChunk }
                                    : msg
                            )
                        );
                    },
                }
            );
        } catch (error) {
            console.error("Copilot Streaming Error:", error);
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === alexMessageId
                        ? {
                            ...msg,
                            text: "⚠️ Sorry, I encountered an issue reaching the LLM server.",
                        }
                        : msg
                )
            );
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] p-4 h-full flex flex-col pointer-events-none">
            <div className="flex flex-col h-full w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl shadow-2xl pointer-events-auto overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between bg-white/50 dark:bg-neutral-900/50">
                    <div className="flex items-center gap-2.5">
                        <span className="text-lg">🤖</span>
                        <div>
                            <h3 className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                                Alex Copilot
                            </h3>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active Session
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Page Context Badge */}
                <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                        <span>{context.icon}</span>
                        <span className="font-semibold tracking-wide">{context.title}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800 text-[10px] text-neutral-600 dark:text-neutral-400 font-sans">
            {context.dbNode}
          </span>
                </div>

                {/* Chat Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-2.5 ${
                                msg.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                            {msg.sender === "alex" && (
                                <div className="h-6 w-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 shrink-0 mt-0.5">
                                    <Bot size={13} />
                                </div>
                            )}

                            <div
                                className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-sm whitespace-pre-wrap ${
                                    msg.sender === "user"
                                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-tr-none font-medium"
                                        : "bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800/60 text-neutral-800 dark:text-neutral-200 rounded-tl-none"
                                }`}
                            >
                                {msg.text || (
                                    <span className="inline-flex items-center gap-1 text-neutral-400 italic">
                    <Loader2 size={12} className="animate-spin" /> Thinking...
                  </span>
                                )}
                            </div>

                            {msg.sender === "user" && (
                                <div className="h-6 w-6 rounded-lg bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-900 shrink-0 mt-0.5">
                                    <User size={13} />
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="p-4 border-t border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Ask Alex about ${context.title.toLowerCase()}...`}
                            disabled={isGenerating}
                            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isGenerating}
                            className="px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1.5"
                        >
                            {isGenerating ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Send size={14} />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}