"use client";

import { motion } from "framer-motion";

export default function SkyboxHeader() {
    return (
        <header
            className="relative w-full min-h-[100vh] flex flex-col items-center justify-center overflow-hidden"
            style={{
                background: "linear-gradient(180deg, #1a1a4e 0%, #2a3a7e 30%, #7ba4d8 70%, #b3d4fc 100%)",
            }}
        >
            {/* Stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(40)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white"
                        style={{
                            width: i % 3 === 0 ? 3 : 2,
                            height: i % 3 === 0 ? 3 : 2,
                            left: `${(i * 37 + 13) % 100}%`,
                            top: `${(i * 23 + 7) % 50}%`,
                            imageRendering: "pixelated",
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 2 + (i % 3),
                            repeat: Infinity,
                            delay: i * 0.1,
                        }}
                    />
                ))}
            </div>

            {/* Pixel Sun */}
            <div className="absolute top-12 right-16 md:top-16 md:right-24">
                <div className="relative">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-300" style={{ imageRendering: "pixelated" }}>
                        <div className="absolute inset-1 bg-yellow-200" />
                        <div className="absolute inset-3 bg-yellow-100" />
                    </div>
                </div>
            </div>

            {/* Clouds */}
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="absolute pointer-events-none"
                    style={{
                        top: `${20 + i * 12}%`,
                        left: 0,
                        animation: `cloudDrift ${25 + i * 10}s linear infinite`,
                        animationDelay: `${i * -8}s`,
                    }}
                >
                    <div className="flex gap-0" style={{ imageRendering: "pixelated" }}>
                        <div className="w-8 h-4 bg-white/90 mt-2" />
                        <div className="w-12 h-8 bg-white/90" />
                        <div className="w-16 h-6 bg-white/90 mt-1" />
                        <div className="w-8 h-4 bg-white/90 mt-2" />
                    </div>
                </div>
            ))}

            {/* Hero Text */}
            <motion.div
                className="relative z-10 text-center px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <h1 className="text-3xl md:text-5xl lg:text-6xl text-white drop-shadow-[2px_2px_0_#000] mb-6 leading-tight">
                    Dharmesh Priyadarshi
                </h1>
                <motion.p
                    className="text-sm md:text-base text-yellow-300 drop-shadow-[1px_1px_0_#000] max-w-[600px] mx-auto leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    Software Developer • Problem Solver • Builder
                </motion.p>

                {/* Blinking cursor prompt */}
                <motion.div
                    className="mt-12 text-[10px] md:text-xs text-white/60"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    ▼ Scroll down to begin your adventure ▼
                </motion.div>
            </motion.div>

            {/* Bottom grass edge */}
            <div className="absolute bottom-0 left-0 right-0 h-3 grass-strip" />
        </header>
    );
}
