"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useXP } from "@/context/XPProvider";
import ProjectModal from "@/components/ProjectModal";

export interface Project {
    id: string;
    name: string;
    icon: string;
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
    description: string;
    techStack: string[];
    github?: string;
    mob: string;
    mobIcon: string;
    loot: string[];
}

const RARITY_COLORS: Record<string, string> = {
    common: "#aaa",
    uncommon: "#55ff55",
    rare: "#5555ff",
    epic: "#aa00aa",
    legendary: "#ffaa00",
};

const PROJECTS: Project[] = [
    {
        id: "p1",
        name: "Data Engine",
        icon: "⚙️",
        rarity: "legendary",
        description: "High-performance data processing engine built in C++ for real-time analytics. Handles millions of events per second.",
        techStack: ["C++", "CMake", "gRPC", "Protobuf"],
        github: "https://github.com",
        mob: "Lag Ghast",
        mobIcon: "👻",
        loot: ["Throughput: 2M events/sec", "Latency reduced by 60%", "Zero-downtime processing"],
    },
    {
        id: "p2",
        name: "Cloud Deploy",
        icon: "☁️",
        rarity: "epic",
        description: "Automated cloud deployment pipeline with infrastructure-as-code. Multi-region, auto-scaling architecture.",
        techStack: ["AWS", "Terraform", "Docker", "Python"],
        github: "https://github.com",
        mob: "Configuration Phantom",
        mobIcon: "👁️",
        loot: ["Deploy time: 30min → 3min", "99.99% uptime SLA", "Infra-as-code coverage: 100%"],
    },
    {
        id: "p3",
        name: "Web Portal",
        icon: "🌐",
        rarity: "rare",
        description: "Full-stack web application with real-time collaboration features and responsive design.",
        techStack: ["React", "Node.js", "PostgreSQL", "WebSocket"],
        github: "https://github.com",
        mob: "Spaghetti Code Creeper",
        mobIcon: "💥",
        loot: ["Real-time multi-user editing", "60fps responsive UI", "100% test coverage"],
    },
    {
        id: "p4",
        name: "ML Pipeline",
        icon: "🤖",
        rarity: "epic",
        description: "End-to-end machine learning pipeline for predictive analytics with automated model training and deployment.",
        techStack: ["Python", "TensorFlow", "Kubernetes", "MLflow"],
        github: "https://github.com",
        mob: "Overfitting Enderman",
        mobIcon: "🟣",
        loot: ["Model accuracy: 94%", "Auto-retraining pipeline", "Inference latency < 50ms"],
    },
    {
        id: "p5",
        name: "Mobile App",
        icon: "📱",
        rarity: "uncommon",
        description: "Cross-platform mobile application with offline-first architecture and native performance.",
        techStack: ["Java", "Kotlin", "Firebase", "SQLite"],
        github: "https://github.com",
        mob: "Null Pointer Zombie",
        mobIcon: "🧟",
        loot: ["Offline-first architecture", "Cross-platform parity", "4.5★ app store rating"],
    },
    {
        id: "p6",
        name: "Game Engine",
        icon: "🎮",
        rarity: "legendary",
        description: "Custom 2D game engine with physics simulation, particle systems, and sprite rendering.",
        techStack: ["C++", "OpenGL", "SDL2", "Lua"],
        github: "https://github.com",
        mob: "Memory Leak Wither",
        mobIcon: "💀",
        loot: ["60fps physics sim", "Custom particle engine", "Lua scripting hotreload"],
    },
    {
        id: "p7",
        name: "API Gateway",
        icon: "🔗",
        rarity: "rare",
        description: "Microservices API gateway with rate limiting, authentication, and request routing.",
        techStack: ["Go", "Redis", "Docker", "Nginx"],
        github: "https://github.com",
        mob: "DDoS Blaze",
        mobIcon: "🔥",
        loot: ["10K req/s rate limiting", "JWT auth with refresh", "Sub-5ms routing"],
    },
    {
        id: "p8",
        name: "CLI Tool",
        icon: "💻",
        rarity: "uncommon",
        description: "Developer productivity CLI tool for automating repetitive tasks and project scaffolding.",
        techStack: ["Rust", "Clap", "Tokio"],
        github: "https://github.com",
        mob: "Boilerplate Slime",
        mobIcon: "🟢",
        loot: ["Scaffold in < 5 sec", "100+ templates", "Async task runner"],
    },
    {
        id: "p9",
        name: "Dashboard",
        icon: "📊",
        rarity: "common",
        description: "Admin dashboard with real-time data visualization, charts, and monitoring widgets.",
        techStack: ["TypeScript", "Next.js", "Chart.js", "Tailwind"],
        github: "https://github.com",
        mob: "Callback Skeleton",
        mobIcon: "💀",
        loot: ["Real-time WebSocket charts", "15+ widget types", "Role-based access"],
    },
];

// Fill remaining cells to make a 9x6 double-chest grid (we'll show 9 cols × 3 rows for each half)
const TOTAL_SLOTS = 54; // 9×6 double chest

export default function ChestInventory() {
    const sectionRef = useRef<HTMLElement>(null);
    const { sectionViewed } = useXP();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) sectionViewed("projects");
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [sectionViewed]);

    const emptySlots = TOTAL_SLOTS - PROJECTS.length;

    return (
        <section
            id="projects"
            ref={sectionRef}
            className="py-20 px-4 md:px-8 max-w-5xl mx-auto scroll-mt-8"
        >
            <h2 className="text-xl md:text-2xl text-center text-white drop-shadow-[2px_2px_0_#000] mb-4">
                📦 Projects Chest
            </h2>
            <p className="text-center text-[10px] text-white/50 mb-10">
                Click an item to inspect
            </p>

            {/* Double Chest */}
            <div
                className="pixel-border p-3 md:p-4 mx-auto max-w-[680px]"
                style={{ background: "#c6c6c6" }}
            >
                {/* Top chest label */}
                <p className="text-[9px] text-[#444] mb-2">Large Chest</p>

                {/* Grid: 9 columns */}
                <div className="grid grid-cols-9 gap-[2px]">
                    {PROJECTS.map((project, i) => (
                        <motion.button
                            key={project.id}
                            whileHover={{ scale: 1.1, zIndex: 10 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            viewport={{ once: true }}
                            onClick={() => setSelectedProject(project)}
                            className="relative aspect-square pixel-border-dark flex items-center justify-center cursor-pointer hover:brightness-125 transition-all group"
                            style={{ background: "#8b8b8b" }}
                        >
                            <span className="text-lg md:text-2xl">{project.icon}</span>
                            {/* Rarity indicator */}
                            <div
                                className="absolute bottom-0 left-0 right-0 h-[2px]"
                                style={{ background: RARITY_COLORS[project.rarity] }}
                            />
                            {/* Name tooltip on hover */}
                            <div className="mc-tooltip absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-20"
                                style={{ color: RARITY_COLORS[project.rarity] }}
                            >
                                {project.name}
                            </div>
                        </motion.button>
                    ))}

                    {/* Empty slots */}
                    {[...Array(emptySlots)].map((_, i) => (
                        <div
                            key={`empty-${i}`}
                            className="aspect-square pixel-border-dark"
                            style={{ background: "#8b8b8b" }}
                        />
                    ))}
                </div>
            </div>

            {/* Project Modal */}
            <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </section>
    );
}
