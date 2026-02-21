"use client";

import { useXP } from "@/context/XPProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function XPBar() {
    const { xp, level, maxXP, levelUpVisible } = useXP();
    const pct = Math.min((xp / maxXP) * 100, 100);

    return (
        <>
            {/* Level Up overlay */}
            <AnimatePresence>
                {levelUpVisible && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 2, opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
                    >
                        <div className="text-center">
                            <div className="text-[--color-mc-xp-green] text-2xl md:text-4xl drop-shadow-[0_2px_0_#000] level-up-burst">
                                ⬆ Level {level} ⬆
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* XP Bar */}
            <div className="fixed bottom-[68px] left-1/2 -translate-x-1/2 z-[100] w-[min(90vw,720px)]">
                {/* Level badge */}
                <div className="flex justify-center mb-1">
                    <span className="text-[--color-mc-xp-green] text-[10px] drop-shadow-[0_1px_0_#000]">
                        {level}
                    </span>
                </div>
                {/* Bar track */}
                <div className="h-[10px] bg-[--color-mc-xp-bg] pixel-border-dark rounded-none overflow-hidden">
                    <motion.div
                        className="h-full"
                        style={{
                            background: "linear-gradient(180deg, #80ff20 0%, #4dd012 50%, #32a80e 100%)",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                </div>
            </div>
        </>
    );
}
