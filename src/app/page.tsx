"use client";

import { XPProvider } from "@/context/XPProvider";
import SkyboxHeader from "@/components/SkyboxHeader";
import Hotbar from "@/components/Hotbar";
import XPBar from "@/components/XPBar";
import DirtFooter from "@/components/DirtFooter";
import CharacterMenu from "@/components/sections/CharacterMenu";
import ChestInventory from "@/components/sections/ChestInventory";
import SkillsSection from "@/components/sections/SkillsSection";
import TimelineSection from "@/components/sections/TimelineSection";
import AdvancementTree from "@/components/sections/AdvancementTree";

export default function Home() {
  return (
    <XPProvider>
      <main className="relative min-h-screen">
        {/* Fixed UI Layer */}
        <Hotbar />
        <XPBar />

        {/* Scrollable Content */}
        <SkyboxHeader />

        <div className="relative z-10" style={{ background: "#1a1a2e" }}>
          <CharacterMenu />

          {/* Section divider */}
          <div className="max-w-3xl mx-auto px-8">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[--color-mc-gui-border-dark] to-transparent" />
          </div>

          <ChestInventory />

          <div className="max-w-3xl mx-auto px-8">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[--color-mc-gui-border-dark] to-transparent" />
          </div>

          <SkillsSection />

          <div className="max-w-3xl mx-auto px-8">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[--color-mc-gui-border-dark] to-transparent" />
          </div>

          <TimelineSection />

          <div className="max-w-3xl mx-auto px-8">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[--color-mc-gui-border-dark] to-transparent" />
          </div>

          <AdvancementTree />
        </div>

        <DirtFooter />
      </main>
    </XPProvider>
  );
}
