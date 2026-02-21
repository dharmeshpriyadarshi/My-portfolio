"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
    id: number;
    sender: string;
    text: string;
    color: string;
    isSystem?: boolean;
}

const ALL_MESSAGES: ChatMessage[] = [
    { id: 1, sender: "Server", text: "Welcome to Dharmesh's World.", color: "#ffff55", isSystem: true },
    { id: 2, sender: "Professor_X", text: "Dharmesh just leveled up in Pattern Recognition!", color: "#55ffff" },
    { id: 3, sender: "TechLead_Bob", text: "Incredible work on the Veridian project.", color: "#55ff55" },
    { id: 4, sender: "Server", text: "Saving level data...", color: "#ffaa00", isSystem: true },
    { id: 5, sender: "Client_Corp", text: "The AWS deployment is running 3x faster now, thanks!", color: "#ff55ff" },
    { id: 6, sender: "Mentor_Dan", text: "Your C++ engine's memory management is flawless.", color: "#55ffff" },
    { id: 7, sender: "Server", text: "Achievement unlocked: Full-Stack Mastery", color: "#ffff55", isSystem: true },
];

export default function ChatLog() {
    const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
    const [msgIndex, setMsgIndex] = useState(0);

    // Add messages sequentially
    useEffect(() => {
        if (msgIndex < ALL_MESSAGES.length) {
            const timer = setTimeout(() => {
                setVisibleMessages((prev) => {
                    const next = [...prev, ALL_MESSAGES[msgIndex]];
                    // Keep only the last 5 messages visible to mimic a short chat window
                    if (next.length > 5) return next.slice(next.length - 5);
                    return next;
                });
                setMsgIndex((i) => i + 1);
            }, Math.random() * 2500 + 2000); // Random delay between 2 and 4.5 seconds

            return () => clearTimeout(timer);
        } else {
            // Loop back after a long pause
            const timer = setTimeout(() => {
                setVisibleMessages([]);
                setMsgIndex(0);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [msgIndex]);

    return (
        <div className="fixed bottom-24 left-4 z-[90] w-[min(90vw,350px)] pointer-events-none font-minecraft">
            {/* Chat background fades in only when there are messages */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: visibleMessages.length > 0 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="bg-black/40 p-2 md:p-3 rounded-sm flex flex-col justify-end min-h-[120px]"
            >
                <AnimatePresence initial={false}>
                    {visibleMessages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="text-[10px] md:text-xs mb-1.5 drop-shadow-[1px_1px_0_#000]"
                        >
                            {msg.isSystem ? (
                                <span style={{ color: msg.color }}>{msg.text}</span>
                            ) : (
                                <>
                                    <span style={{ color: msg.color }}>&lt;{msg.sender}&gt;</span>{" "}
                                    <span className="text-white">{msg.text}</span>
                                </>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
