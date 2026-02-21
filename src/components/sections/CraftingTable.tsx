"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useXP } from "@/context/XPProvider";

/* ═══════════ Types ═══════════ */
interface Ingredient {
    id: string;
    name: string;
    icon: string;
    lore: string[];            // Minecraft enchantment-style flavor text
    category: string;
}

interface Recipe {
    id: string;
    /** 9-element array of ingredient IDs (empty string = empty slot) */
    pattern: string[];
    resultName: string;
    resultIcon: string;
    resultRarity: "uncommon" | "rare" | "epic" | "legendary";
    resultDescription: string;
}

const RARITY_COLORS: Record<string, string> = {
    uncommon: "#55ff55",
    rare: "#5555ff",
    epic: "#aa00aa",
    legendary: "#ffaa00",
};

/* ═══════════ Ingredients ═══════════ */
const INGREDIENTS: Ingredient[] = [
    // Languages
    { id: "cpp", name: "C++", icon: "⚔️", lore: ["Sharpness V", "Efficiency IV", "Unbreaking III"], category: "Languages" },
    { id: "java", name: "Java", icon: "☕", lore: ["Efficiency IV", "Unbreaking III", "Mending"], category: "Languages" },
    { id: "python", name: "Python", icon: "🐍", lore: ["Efficiency V", "Silk Touch", "Fortune III"], category: "Languages" },
    { id: "typescript", name: "TypeScript", icon: "📘", lore: ["Protection IV", "Thorns II", "Swift Sneak"], category: "Languages" },
    { id: "go", name: "Go", icon: "🐹", lore: ["Speed II", "Efficiency III"], category: "Languages" },
    // Frameworks
    { id: "react", name: "React", icon: "⚛️", lore: ["Sharpness III", "Looting II", "Fire Aspect"], category: "Frameworks" },
    { id: "nextjs", name: "Next.js", icon: "▲", lore: ["Protection III", "Blast Protection IV"], category: "Frameworks" },
    { id: "node", name: "Node.js", icon: "🟢", lore: ["Efficiency III", "Unbreaking II"], category: "Frameworks" },
    { id: "spring", name: "Spring Boot", icon: "🍃", lore: ["Protection IV", "Thorns III", "Mending"], category: "Frameworks" },
    // Cloud & DevOps
    { id: "aws", name: "AWS", icon: "☁️", lore: ["Infinity", "Power V", "Multishot"], category: "Cloud" },
    { id: "docker", name: "Docker", icon: "🐳", lore: ["Efficiency IV", "Aqua Affinity"], category: "Cloud" },
    { id: "k8s", name: "Kubernetes", icon: "☸️", lore: ["Protection V", "Unbreaking III"], category: "Cloud" },
    { id: "terraform", name: "Terraform", icon: "🏗️", lore: ["Efficiency III", "Fortune II"], category: "Cloud" },
    // Tools
    { id: "git", name: "Git", icon: "📂", lore: ["Loyalty III", "Riptide"], category: "Tools" },
    { id: "postgres", name: "PostgreSQL", icon: "🐘", lore: ["Efficiency IV", "Unbreaking III"], category: "Tools" },
    { id: "redis", name: "Redis", icon: "🔴", lore: ["Speed III", "Quick Charge III"], category: "Tools" },
    { id: "linux", name: "Linux", icon: "🐧", lore: ["Protection IV", "Depth Strider III"], category: "Tools" },
    { id: "tensorflow", name: "TensorFlow", icon: "🧠", lore: ["Sharpness IV", "Smite V", "Channeling"], category: "Tools" },
];

const ingredientMap = new Map(INGREDIENTS.map((i) => [i.id, i]));

/* ═══════════ Recipes ═══════════ */
// Pattern uses a 3×3 grid, top-left to bottom-right. Empty = ""
const RECIPES: Recipe[] = [
    {
        id: "r1",
        pattern: ["cpp", "aws", "docker", "", "", "", "", "", ""],
        resultName: "Cloud Systems Engineer",
        resultIcon: "💎",
        resultRarity: "legendary",
        resultDescription: "Master of high-performance cloud infrastructure. Forged in the fires of production.",
    },
    {
        id: "r2",
        pattern: ["react", "nextjs", "node", "", "", "", "", "", ""],
        resultName: "Full-Stack Web Dev",
        resultIcon: "🌐",
        resultRarity: "epic",
        resultDescription: "End-to-end web development. From pixel to server and back again.",
    },
    {
        id: "r3",
        pattern: ["python", "tensorflow", "", "", "", "", "", "", ""],
        resultName: "ML Engineer",
        resultIcon: "🤖",
        resultRarity: "epic",
        resultDescription: "Trains models that see patterns humans miss. Data is the new diamond ore.",
    },
    {
        id: "r4",
        pattern: ["java", "spring", "postgres", "", "", "", "", "", ""],
        resultName: "Backend Architect",
        resultIcon: "🏰",
        resultRarity: "legendary",
        resultDescription: "Builds fortresses of scalable, enterprise-grade backend systems.",
    },
    {
        id: "r5",
        pattern: ["docker", "k8s", "terraform", "", "", "", "", "", ""],
        resultName: "DevOps Wizard",
        resultIcon: "🧙",
        resultRarity: "rare",
        resultDescription: "Automates everything. Infrastructure bends to their will.",
    },
    {
        id: "r6",
        pattern: ["typescript", "react", "aws", "", "", "", "", "", ""],
        resultName: "Cloud Full-Stack Dev",
        resultIcon: "⚡",
        resultRarity: "legendary",
        resultDescription: "The ultimate combo — frontend finesse meets cloud-scale power.",
    },
];

/** Check if the current grid matches any recipe (order-sensitive for placed items, ignores empty slot positions) */
function findMatchingRecipe(grid: (string | null)[]): Recipe | null {
    // Collect the non-null ingredients in order
    const placed = grid.map((g) => g ?? "");

    for (const recipe of RECIPES) {
        // Normalize: collect non-empty items from both in order
        const recipeFilled = recipe.pattern.filter((p) => p !== "");
        const gridFilled = placed.filter((p) => p !== "");

        if (recipeFilled.length !== gridFilled.length) continue;

        // Check if sets match (order-insensitive within the filled slots)
        const recipeSorted = [...recipeFilled].sort();
        const gridSorted = [...gridFilled].sort();
        if (recipeSorted.every((v, i) => v === gridSorted[i])) {
            return recipe;
        }
    }
    return null;
}

/* ═══════════ Sub-Components ═══════════ */
function LoreTooltip({ ingredient, visible }: { ingredient: Ingredient; visible: boolean }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="mc-tooltip absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-50 min-w-[140px]"
                >
                    <p className="text-[--color-mc-aqua] text-[9px] mb-1">{ingredient.name}</p>
                    {ingredient.lore.map((line) => (
                        <p key={line} className="text-[--color-mc-enchant] text-[8px] italic">
                            {line}
                        </p>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ═══════════ Main Component ═══════════ */
export default function CraftingTable() {
    const sectionRef = useRef<HTMLElement>(null);
    const { sectionViewed } = useXP();
    const [grid, setGrid] = useState<(string | null)[]>(Array(9).fill(null));
    const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
    const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
    const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
    const [resultFlash, setResultFlash] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) sectionViewed("skills");
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [sectionViewed]);

    const matchedRecipe = findMatchingRecipe(grid);

    // Flash the result when recipe matches
    useEffect(() => {
        if (matchedRecipe) {
            setResultFlash(true);
            const t = setTimeout(() => setResultFlash(false), 600);
            return () => clearTimeout(t);
        }
    }, [matchedRecipe?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSlotClick = useCallback(
        (slotIdx: number) => {
            if (grid[slotIdx] !== null) {
                // Remove ingredient from slot
                setGrid((prev) => {
                    const next = [...prev];
                    next[slotIdx] = null;
                    return next;
                });
            } else if (selectedIngredient) {
                // Place ingredient
                setGrid((prev) => {
                    const next = [...prev];
                    next[slotIdx] = selectedIngredient;
                    return next;
                });
                setSelectedIngredient(null);
            }
        },
        [grid, selectedIngredient]
    );

    const handleIngredientClick = useCallback((id: string) => {
        setSelectedIngredient((prev) => (prev === id ? null : id));
    }, []);

    const clearGrid = useCallback(() => {
        setGrid(Array(9).fill(null));
        setSelectedIngredient(null);
    }, []);

    // Group ingredients by category
    const categories = [...new Set(INGREDIENTS.map((i) => i.category))];

    return (
        <section
            id="skills"
            ref={sectionRef}
            className="py-20 px-4 md:px-8 max-w-5xl mx-auto scroll-mt-8"
        >
            <h2 className="text-xl md:text-2xl text-center text-white drop-shadow-[2px_2px_0_#000] mb-4">
                🛠️ Crafting Table
            </h2>
            <p className="text-center text-[10px] text-white/50 mb-10">
                Select ingredients below, then click a grid slot to place them.
                Discover valid recipes!
            </p>

            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                {/* ── LEFT: Ingredient Palette ── */}
                <div className="w-full lg:w-auto lg:min-w-[260px]">
                    {categories.map((cat) => (
                        <div key={cat} className="mb-4">
                            <p className="text-[9px] text-[--color-mc-enchant] mb-2">{cat}</p>
                            <div className="flex flex-wrap gap-[3px]">
                                {INGREDIENTS.filter((i) => i.category === cat).map((ing) => {
                                    const isSelected = selectedIngredient === ing.id;
                                    const isOnGrid = grid.includes(ing.id);
                                    return (
                                        <div key={ing.id} className="relative">
                                            <LoreTooltip
                                                ingredient={ing}
                                                visible={hoveredIngredient === ing.id}
                                            />
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleIngredientClick(ing.id)}
                                                onMouseEnter={() => setHoveredIngredient(ing.id)}
                                                onMouseLeave={() => setHoveredIngredient(null)}
                                                className={`
                          w-12 h-12 pixel-border-dark flex flex-col items-center justify-center
                          transition-all cursor-pointer
                          ${isSelected ? "ring-2 ring-[--color-mc-xp-green] brightness-125" : ""}
                          ${isOnGrid ? "opacity-40" : ""}
                        `}
                                                style={{ background: isSelected ? "#3a5a2a" : "#8b8b8b" }}
                                                disabled={isOnGrid}
                                            >
                                                <span className="text-lg">{ing.icon}</span>
                                                <span className="text-[6px] text-[#222] truncate w-full text-center px-0.5">
                                                    {ing.name}
                                                </span>
                                            </motion.button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── RIGHT: Crafting Grid ── */}
                <div className="flex flex-col items-center">
                    <div
                        className="pixel-border p-4 md:p-6"
                        style={{ background: "#c6c6c6" }}
                    >
                        <p className="text-[9px] text-[#444] mb-3">Crafting</p>

                        <div className="flex items-center gap-4 md:gap-6">
                            {/* 3×3 grid */}
                            <div className="grid grid-cols-3 gap-[3px]">
                                {grid.map((slotId, idx) => {
                                    const ing = slotId ? ingredientMap.get(slotId) : null;
                                    return (
                                        <motion.button
                                            key={idx}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleSlotClick(idx)}
                                            onMouseEnter={() => {
                                                setHoveredSlot(idx);
                                                if (slotId) setHoveredIngredient(slotId);
                                            }}
                                            onMouseLeave={() => {
                                                setHoveredSlot(null);
                                                setHoveredIngredient(null);
                                            }}
                                            className={`
                        w-14 h-14 md:w-16 md:h-16 pixel-border-dark flex items-center justify-center
                        cursor-pointer transition-all relative
                        ${selectedIngredient && !slotId ? "hover:bg-[#aaa]" : ""}
                        ${hoveredSlot === idx && selectedIngredient && !slotId ? "ring-1 ring-[--color-mc-xp-green]" : ""}
                      `}
                                            style={{ background: "#8b8b8b" }}
                                        >
                                            {ing && (
                                                <motion.span
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-2xl"
                                                >
                                                    {ing.icon}
                                                </motion.span>
                                            )}
                                            {/* Show lore tooltip for placed ingredients */}
                                            {ing && hoveredSlot === idx && (
                                                <LoreTooltip ingredient={ing} visible={true} />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Arrow */}
                            <div className="text-2xl text-[#555] select-none">→</div>

                            {/* Output slot */}
                            <motion.div
                                animate={
                                    resultFlash
                                        ? {
                                            boxShadow: [
                                                "0 0 0px transparent",
                                                "0 0 20px #ffaa00",
                                                "0 0 0px transparent",
                                            ],
                                        }
                                        : {}
                                }
                                transition={{ duration: 0.6 }}
                                className="w-16 h-16 md:w-20 md:h-20 pixel-border flex items-center justify-center relative"
                                style={{
                                    background: matchedRecipe ? "#3a5a2a" : "#8b8b8b",
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {matchedRecipe ? (
                                        <motion.div
                                            key={matchedRecipe.id}
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0 }}
                                            transition={{ type: "spring", stiffness: 200 }}
                                            className="flex flex-col items-center"
                                        >
                                            <span className="text-3xl">{matchedRecipe.resultIcon}</span>
                                        </motion.div>
                                    ) : (
                                        <motion.span
                                            key="empty"
                                            className="text-[#555] text-[8px] text-center px-1"
                                        >
                                            ?
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        {/* Clear button */}
                        <button
                            onClick={clearGrid}
                            className="mt-3 pixel-border px-3 py-1 text-[8px] text-[#333] hover:bg-[#ddd] transition-colors"
                            style={{ background: "#aaa" }}
                        >
                            Clear Grid
                        </button>
                    </div>

                    {/* Result description */}
                    <AnimatePresence mode="wait">
                        {matchedRecipe && (
                            <motion.div
                                key={matchedRecipe.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-4 pixel-border p-4 w-full max-w-xs text-center"
                                style={{ background: "#2a2a3e" }}
                            >
                                <p
                                    className="text-xs mb-1"
                                    style={{ color: RARITY_COLORS[matchedRecipe.resultRarity] }}
                                >
                                    {matchedRecipe.resultIcon} {matchedRecipe.resultName}
                                </p>
                                <p className="text-[8px] text-white/50 italic capitalize mb-2">
                                    {matchedRecipe.resultRarity}
                                </p>
                                <p className="text-[8px] text-white/70 leading-relaxed">
                                    {matchedRecipe.resultDescription}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Hint: available recipes */}
                    <div className="mt-6 text-center">
                        <p className="text-[8px] text-white/30 mb-2">
                            Recipes to discover: {RECIPES.length}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {RECIPES.map((r) => {
                                const ingredients = r.pattern
                                    .filter((p) => p !== "")
                                    .map((p) => ingredientMap.get(p)?.icon)
                                    .join(" + ");
                                return (
                                    <div
                                        key={r.id}
                                        className="text-[7px] text-white/20 px-2 py-1 pixel-border-dark"
                                        style={{ background: "#1a1a2e" }}
                                    >
                                        {ingredients} → {r.resultIcon}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
