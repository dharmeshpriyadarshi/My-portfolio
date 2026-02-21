"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeDimension = "overworld" | "nether" | "end";

interface ThemeContextType {
    dimension: ThemeDimension;
    cycleDimension: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [dimension, setDimension] = useState<ThemeDimension>("overworld");

    // On mount, check if there's a saved dimension
    useEffect(() => {
        const saved = localStorage.getItem("mc-dimension") as ThemeDimension;
        if (saved && ["overworld", "nether", "end"].includes(saved)) {
            setDimension(saved);
        }
    }, []);

    // Update HTML class when dimension changes
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("theme-overworld", "theme-nether", "theme-end");
        root.classList.add(`theme-${dimension}`);
        localStorage.setItem("mc-dimension", dimension);
    }, [dimension]);

    const cycleDimension = () => {
        setDimension((prev) => {
            if (prev === "overworld") return "nether";
            if (prev === "nether") return "end";
            return "overworld";
        });
    };

    return (
        <ThemeContext.Provider value={{ dimension, cycleDimension }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
