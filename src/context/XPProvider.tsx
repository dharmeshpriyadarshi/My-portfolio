"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

interface XPContextType {
    xp: number;
    level: number;
    maxXP: number;
    addXP: (amount: number) => void;
    levelUpVisible: boolean;
    dismissLevelUp: () => void;
    sectionViewed: (sectionId: string) => void;
}

const XP_PER_LEVEL = 100;
const MAX_LEVEL = 30;

const XPContext = createContext<XPContextType>({
    xp: 0,
    level: 1,
    maxXP: XP_PER_LEVEL,
    addXP: () => { },
    levelUpVisible: false,
    dismissLevelUp: () => { },
    sectionViewed: () => { },
});

export function useXP() {
    return useContext(XPContext);
}

export function XPProvider({ children }: { children: React.ReactNode }) {
    const [xp, setXP] = useState(0);
    const [level, setLevel] = useState(1);
    const [levelUpVisible, setLevelUpVisible] = useState(false);
    const viewedSections = useRef<Set<string>>(new Set());

    const addXP = useCallback((amount: number) => {
        setXP((prev) => {
            const newXP = prev + amount;
            if (newXP >= XP_PER_LEVEL && level < MAX_LEVEL) {
                // Level up!
                setLevel((l) => l + 1);
                setLevelUpVisible(true);
                // Try to play level-up sound
                try {
                    const audio = new Audio("/sounds/levelup.mp3");
                    audio.volume = 0.4;
                    audio.play().catch(() => { });
                } catch { }
                return newXP - XP_PER_LEVEL;
            }
            return Math.min(newXP, XP_PER_LEVEL);
        });
    }, [level]);

    const dismissLevelUp = useCallback(() => {
        setLevelUpVisible(false);
    }, []);

    const sectionViewed = useCallback(
        (sectionId: string) => {
            if (!viewedSections.current.has(sectionId)) {
                viewedSections.current.add(sectionId);
                addXP(20);
            }
        },
        [addXP]
    );

    // Auto-dismiss level up after 2 seconds
    useEffect(() => {
        if (levelUpVisible) {
            const t = setTimeout(() => setLevelUpVisible(false), 2000);
            return () => clearTimeout(t);
        }
    }, [levelUpVisible]);

    return (
        <XPContext.Provider
            value={{
                xp,
                level,
                maxXP: XP_PER_LEVEL,
                addXP,
                levelUpVisible,
                dismissLevelUp,
                sectionViewed,
            }}
        >
            {children}
        </XPContext.Provider>
    );
}
