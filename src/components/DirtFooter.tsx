"use client";

import { useTheme } from "@/context/ThemeContext";

export default function DirtFooter() {
    const { dimension, cycleDimension } = useTheme();

    return (
        <footer className="relative w-full">
            {/* Grass strip */}
            <div className="h-3 grass-strip" />

            {/* Dirt body */}
            <div className="dirt-pattern py-12 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Wooden sign links */}
                    <div className="flex flex-wrap justify-center gap-6">
                        {[
                            { label: "GitHub", url: "https://github.com/dharmeshpriyadarshi" },
                            { label: "LinkedIn", url: "http://www.linkedin.com/in/dharmesh-priyadarshi" },
                            { label: "Email", url: "mailto:dharmeshoff016@gmail.com" },
                        ].map((link) => (
                            <a
                                key={link.label}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative"
                            >
                                {/* Sign body */}
                                <div className="bg-[#b08050] pixel-border px-6 py-3 text-[10px] text-white drop-shadow-[1px_1px_0_#000] hover:bg-[#c49060] transition-colors">
                                    {link.label}
                                </div>
                                {/* Post */}
                                <div className="w-2 h-4 bg-[#6b4f10] mx-auto" />
                            </a>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-[8px] text-white/50 drop-shadow-[1px_1px_0_#000]">
                        <p>
                            © 2026 Dharm&apos;s Portfolio — Crafted with ❤ and blocks
                        </p>
                        <button
                            onClick={cycleDimension}
                            className="mt-4 md:mt-0 hover:text-white transition-colors cursor-pointer"
                        >
                            Seed: 16112002 [{dimension}]
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
