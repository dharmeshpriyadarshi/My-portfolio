"use client";

import { XPProvider } from "@/context/XPProvider";
import SkyboxHeader from "@/components/SkyboxHeader";
import Hotbar from "@/components/Hotbar";
import XPBar from "@/components/XPBar";
import DirtFooter from "@/components/DirtFooter";
import CharacterMenu from "@/components/sections/CharacterMenu";
import ChestInventory from "@/components/sections/ChestInventory";
import CraftingTable from "@/components/sections/CraftingTable";
import TimelineSection from "@/components/sections/TimelineSection";
import AdvancementTree from "@/components/sections/AdvancementTree";
import ChatLog from "@/components/ChatLog";

export default function Home() {
  return (
    <XPProvider>
      <main className="relative min-h-screen">
        {/* Scrollable Content */}
        <SkyboxHeader />

        <div className="relative">
          {/* ── Biome: The Plains (About) ── */}
          <div className="biome-plains">
            <CharacterMenu />
          </div>

          <div className="biome-transition plains-to-jungle" />

          {/* ── Biome: The Jungle (Projects) ── */}
          <div className="biome-jungle">
            <ChestInventory />
          </div>

          <div className="biome-transition jungle-to-stronghold" />

          {/* ── Biome: The Stronghold (Skills) ── */}
          <div className="biome-stronghold">
            <CraftingTable />
          </div>

          <div className="biome-transition stronghold-to-end" />

          {/* ── Biome: The End (Timeline & Advancements) ── */}
          <div className="biome-end">
            <TimelineSection />

            <div className="max-w-3xl mx-auto px-8">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            </div>

            <AdvancementTree />
          </div>
        </div>

        <DirtFooter />

        {/* Fixed UI Layer - moved to bottom of DOM for better z-index stacking */}
        <ChatLog />
        <Hotbar />
        <XPBar />
      </main>
    </XPProvider>
  );
}
