"use client";

export default function DirtFooter() {
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

                    <p className="text-center mt-8 text-[8px] text-white/50 drop-shadow-[1px_1px_0_#000]">
                        © 2026 Dharm&apos;s Portfolio — Crafted with ❤ and blocks
                    </p>
                </div>
            </div>
        </footer>
    );
}
