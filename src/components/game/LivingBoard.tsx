"use client";

import { useGameStore, WORLD_SLOTS, WorldSlot, Element, InventoryItem, Synergy, HeritageDNA } from "@/store/gameState";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Play, Link2, Lock, Compass, Info, X } from "lucide-react";

// Helper component to smoothly animate camera to target coordinates
function MapCameraController({ target }: { target: [number, number] | null }) {
  const map = useMap();
  const { setFlyToTarget } = useGameStore();

  useEffect(() => {
    if (target) {
      map.flyTo(target, 7, { duration: 2.5 });
      const timer = setTimeout(() => {
        setFlyToTarget(null);
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [target, map, setFlyToTarget]);

  return null;
}

const createNodeIcon = (
  iconStr: string,
  name: string,
  status: "placed" | "available" | "locked"
) => {
  let badgeStyle = "bg-earth-950/90 text-parchment-200 border-gold-500/50";
  let boxStyle = "bg-gradient-to-tr from-earth-900 via-earth-850 to-earth-950 border-2 border-gold-500 text-gold-400 shadow-[0_4px_20px_rgba(0,0,0,0.8)]";

  if (status === "available") {
    boxStyle = "bg-black/60 border-2 border-dashed border-gold-400/80 text-gold-300 animate-pulse";
    badgeStyle = "bg-earth-900/90 text-gold-300 border-gold-400/40";
  } else if (status === "locked") {
    boxStyle = "bg-stone-900/70 border border-stone-600 text-stone-400 opacity-60";
    badgeStyle = "bg-stone-900/90 text-stone-400 border-stone-600 opacity-70";
  }

  return L.divIcon({
    className: "custom-leaflet-icon bg-transparent border-0",
    html: `
      <div class="flex flex-col items-center justify-end group transition-transform duration-300 ${
        status === "placed" ? "scale-100 hover:scale-110" : status === "available" ? "scale-90 hover:scale-105" : "scale-80 hover:scale-95"
      } cursor-pointer">
        <div class="w-14 h-14 ${boxStyle} rounded-2xl flex items-center justify-center text-2xl relative transition-all">
          ${
            status === "placed"
              ? iconStr
              : status === "available"
              ? '<span class="text-gold-400 text-xl font-bold">+</span>'
              : '<span class="text-xs">🔒</span>'
          }
        </div>
        <div class="${badgeStyle} text-[10px] font-serif font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mt-1.5 border shadow-lg whitespace-nowrap">
          ${name}
        </div>
      </div>
    `,
    iconSize: [80, 90],
    iconAnchor: [40, 90],
  });
};

export default function LivingBoard() {
  const {
    placedNodes,
    inventory,
    placeNode,
    markPlaced,
    connections,
    addConnection,
    flyToTarget,
  } = useGameStore();

  const [selectedSlot, setSelectedSlot] = useState<WorldSlot | null>(null);
  const [selectedPlacedNode, setSelectedPlacedNode] = useState<Element | null>(null);
  const [selectedLockedSlot, setSelectedLockedSlot] = useState<WorldSlot | null>(null);
  const [connectingNode, setConnectingNode] = useState<Element | null>(null);
  const [connectionNotice, setConnectionNotice] = useState<string | null>(null);
  const [activeSynergyModal, setActiveSynergyModal] = useState<{
    from: Element;
    to: Element;
    synergy: Synergy;
  } | null>(null);

  const handlePlace = (slot: WorldSlot, item: InventoryItem) => {
    const success = placeNode({
      id: item.id,
      name: item.name,
      type: item.category,
      lat: slot.lat,
      lng: slot.lng,
      region: slot.region,
      era: slot.era,
      description: item.description,
      historicalContext: item.historicalContext,
      dnaInfluence: [
        { trait: "history", value: 20 },
        { trait: "strategy", value: 15 },
      ],
    });

    if (success) {
      markPlaced(item.id);
      setSelectedSlot(null);
    }
  };

  const handleNodeClick = (node: Element) => {
    if (connectingNode) {
      if (connectingNode.id === node.id) {
        setConnectingNode(null);
        return;
      }

      // Attempt to form Sangam
      const result = addConnection(connectingNode.id, node.id);

      if (!result.success) {
        setConnectionNotice(result.message);
        setTimeout(() => setConnectionNotice(null), 3000);
      } else {
        if (result.synergy) {
          setActiveSynergyModal({
            from: connectingNode,
            to: node,
            synergy: result.synergy,
          });
        } else {
          setConnectionNotice("Sangam Connection Formed (+50 XP)");
          setTimeout(() => setConnectionNotice(null), 3000);
        }
      }

      setConnectingNode(null);
    } else {
      setSelectedPlacedNode(node);
    }
  };

  return (
    <div className="absolute inset-0 z-0 bg-[#0f0c08] overflow-hidden">
      <MapContainer
        center={[22.5, 79.0]} // Center of India
        zoom={5}
        minZoom={4}
        maxZoom={10}
        className="w-full h-full bg-[#130f0a]"
        zoomControl={false}
      >
        <MapCameraController target={flyToTarget} />

        {/* Tile Layer: OpenStreetMap styled with rich cartographic antique dark parchment palette */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors | DHARA Cartography"
          className="map-tiles-manuscript-theme"
        />

        <style jsx global>{`
          .map-tiles-manuscript-theme {
            filter: brightness(0.4) invert(1) contrast(2.2) sepia(0.85) hue-rotate(345deg) saturate(1.8) brightness(0.75);
          }
        `}</style>

        {/* Render Connection Lines (Sangam) */}
        {connections.map((conn) => {
          const fromNode = placedNodes.find((n) => n.id === conn.from);
          const toNode = placedNodes.find((n) => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          const isSynergy = !!conn.synergyId;

          return (
            <Polyline
              key={conn.id}
              positions={[
                [fromNode.lat, fromNode.lng],
                [toNode.lat, toNode.lng],
              ]}
              pathOptions={{
                color: isSynergy ? "#f4db6c" : "#d4af37",
                weight: isSynergy ? 4 : 3,
                dashArray: isSynergy ? "6, 6" : "8, 8",
                opacity: 0.85,
              }}
            />
          );
        })}

        {/* Render Available & Locked World Slots */}
        {WORLD_SLOTS.map((slot) => {
          const isOccupied = placedNodes.some(
            (n) => Math.abs(n.lat - slot.lat) < 0.05 && Math.abs(n.lng - slot.lng) < 0.05
          );
          if (isOccupied) return null;

          const isAvailable = slot.status === "unlocked" || slot.status === "available";

          return (
            <Marker
              key={slot.id}
              position={[slot.lat, slot.lng]}
              icon={createNodeIcon("", slot.name, isAvailable ? "available" : "locked")}
              eventHandlers={{
                click: () => {
                  if (isAvailable) {
                    setSelectedSlot(slot);
                  } else {
                    setSelectedLockedSlot(slot);
                  }
                },
              }}
            />
          );
        })}

        {/* Render Placed Living Nodes */}
        {placedNodes.map((node) => {
          const icon = node.type === "monument" ? "🏛️" : node.type === "trade" ? "🗺️" : "📜";
          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={createNodeIcon(icon, node.name, "placed")}
              eventHandlers={{
                click: () => handleNodeClick(node),
              }}
            />
          );
        })}
      </MapContainer>

      {/* Top Cartographic Watermark & Notice */}
      <div className="absolute top-20 left-8 z-30 pointer-events-none hidden sm:block">
        <div className="bg-earth-950/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-gold-500/30 text-parchment-200 shadow-xl">
          <div className="flex items-center gap-2 text-gold-400 text-xs font-serif font-bold uppercase tracking-widest">
            <Compass className="w-4 h-4" /> Living India Board
          </div>
          <p className="text-[11px] text-parchment-300/80 mt-0.5">
            Placed Elements: {placedNodes.length} · Sangam Connections: {connections.length}
          </p>
        </div>
      </div>

      {/* Floating Sangam Connection Mode Banner */}
      <AnimatePresence>
        {connectingNode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-[500] bg-earth-950/95 backdrop-blur-md border-2 border-gold-500 px-6 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center gap-4 text-parchment-100"
          >
            <Link2 className="text-gold-400 w-5 h-5 animate-pulse" />
            <div>
              <div className="text-gold-400 font-serif font-bold text-xs uppercase tracking-widest">
                Forming Sangam
              </div>
              <div className="text-xs text-parchment-200">
                Select another node on the map to connect with{" "}
                <strong className="text-gold-300 font-serif">{connectingNode.name}</strong>
              </div>
            </div>
            <button
              onClick={() => setConnectingNode(null)}
              className="ml-2 px-3 py-1.5 bg-earth-800 hover:bg-earth-700 border border-gold-500/40 text-parchment-200 rounded-xl text-xs font-serif font-bold uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duplicate / In-Game Notification Toast */}
      <AnimatePresence>
        {connectionNotice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[500] bg-earth-950/90 backdrop-blur-md border border-gold-500/60 px-5 py-2.5 rounded-full shadow-2xl text-xs font-serif tracking-wider text-gold-300 flex items-center gap-2"
          >
            <Info className="w-4 h-4 text-gold-400" />
            <span>{connectionNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State / Nalanda Quest CTA if Nalanda not yet placed */}
      {!placedNodes.some((n) => n.id.includes("nalanda")) && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
          <Link href="/quest/nalanda" className="pointer-events-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-earth-950 font-serif font-bold text-xs uppercase tracking-widest rounded-full shadow-[0_0_35px_rgba(212,175,55,0.6)] border border-white/40"
            >
              <Play className="w-4 h-4" fill="currentColor" />
              <span>Begin Quest: The Lost Library of Nalanda</span>
            </motion.div>
          </Link>
          <div className="text-[11px] text-parchment-300 font-serif italic mt-2 bg-black/60 px-3 py-1 rounded-md backdrop-blur-sm border border-white/10">
            Uncover your first ancient knowledge hub in Magadha
          </div>
        </div>
      )}

      {/* Placement Modal for Available World Slot */}
      <AnimatePresence>
        {selectedSlot && (
          <div
            className="fixed inset-0 bg-black/75 z-[550] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedSlot(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-parchment-100 p-6 sm:p-8 rounded-3xl border-2 border-gold-500 shadow-2xl max-w-md w-full relative overflow-hidden text-earth-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 border-b border-parchment-300 pb-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-terracotta-600">
                    Construct On DHARA
                  </div>
                  <h3 className="font-serif text-2xl font-bold">{selectedSlot.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="p-1 rounded-full text-earth-500 hover:text-earth-900"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-earth-700 text-xs sm:text-sm leading-relaxed mb-6 font-medium bg-parchment-200 p-3.5 rounded-xl border border-parchment-300">
                {selectedSlot.historicalContext}
              </p>

              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 mb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-earth-600 mb-2">
                  Select item from your Heritage Chest:
                </div>
                {inventory
                  .filter((i) => !i.isPlaced)
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handlePlace(selectedSlot, item)}
                      className="w-full flex items-center gap-4 p-3.5 bg-white border-2 border-parchment-300 hover:border-gold-500 rounded-2xl text-left shadow-sm hover:shadow transition-all group"
                    >
                      <span className="text-3xl p-2 bg-parchment-200 rounded-xl group-hover:bg-gold-100 transition-colors">
                        {item.icon}
                      </span>
                      <div className="flex-1">
                        <div className="font-serif font-bold text-earth-900 text-base leading-tight">
                          {item.name}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600 mt-1">
                          {item.rarity} · {item.category}
                        </div>
                      </div>
                    </button>
                  ))}

                {inventory.filter((i) => !i.isPlaced).length === 0 && (
                  <div className="text-center p-6 bg-parchment-200/60 rounded-xl border border-dashed border-parchment-300 text-xs text-earth-600 space-y-3">
                    <p>No unplaced heritage tokens currently in your chest.</p>
                    <Link href="/quest/nalanda" className="inline-block">
                      <span className="text-gold-700 hover:text-gold-900 font-bold underline">
                        Complete Nalanda Quest to earn your first token →
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              <button
                className="w-full text-center text-xs font-serif font-bold text-earth-600 uppercase tracking-widest hover:text-earth-900"
                onClick={() => setSelectedSlot(null)}
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Locked World Slot Info Drawer */}
      <AnimatePresence>
        {selectedLockedSlot && (
          <div
            className="fixed inset-0 bg-black/75 z-[550] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedLockedSlot(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-parchment-100 p-6 sm:p-8 rounded-3xl border-2 border-stone-400 shadow-2xl max-w-md w-full relative overflow-hidden text-earth-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 border-b border-parchment-300 pb-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked Civilizational Node
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-earth-900">
                    {selectedLockedSlot.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedLockedSlot(null)}
                  className="p-1 rounded-full text-earth-500 hover:text-earth-900"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-6 text-xs sm:text-sm">
                <div className="flex justify-between text-xs py-1 border-b border-parchment-200">
                  <span className="text-earth-600 font-medium">Region:</span>
                  <span className="font-bold text-earth-900">{selectedLockedSlot.region}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-parchment-200">
                  <span className="text-earth-600 font-medium">Era:</span>
                  <span className="font-bold text-earth-900">{selectedLockedSlot.era}</span>
                </div>
                <p className="text-earth-800 leading-relaxed font-medium bg-parchment-200/70 p-3.5 rounded-xl border border-parchment-300 text-xs">
                  {selectedLockedSlot.historicalContext}
                </p>

                <div className="p-3.5 bg-stone-200/80 rounded-xl border border-stone-300 text-xs text-stone-700">
                  <div className="font-bold uppercase tracking-wider text-[10px] text-stone-600 mb-1">
                    Unlock Requirement
                  </div>
                  Complete current active quest and expand your cultural network to reveal this node.
                </div>
              </div>

              <button
                className="w-full text-center text-xs font-serif font-bold text-earth-600 uppercase tracking-widest hover:text-earth-900"
                onClick={() => setSelectedLockedSlot(null)}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Placed Node Detail Modal */}
      <AnimatePresence>
        {selectedPlacedNode && (
          <div
            className="fixed inset-0 bg-black/75 z-[550] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedPlacedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-parchment-100 p-6 sm:p-8 rounded-3xl border-2 border-gold-500 shadow-2xl max-w-lg w-full relative overflow-hidden text-earth-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 border-b border-parchment-300 pb-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-terracotta-600">
                    Constructed Heritage Node
                  </div>
                  <h3 className="font-serif text-3xl font-bold">{selectedPlacedNode.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedPlacedNode(null)}
                  className="p-1 rounded-full text-earth-500 hover:text-earth-900"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-parchment-200 rounded-2xl border border-parchment-300 text-xs leading-relaxed text-earth-800">
                  <div className="font-bold text-earth-900 mb-1 text-sm">Civilizational Role</div>
                  {selectedPlacedNode.description ||
                    "This node forms a permanent cornerstone on your Living Board, anchoring trade or learning networks across ancient India."}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-parchment-300">
                    <span className="text-earth-500 uppercase tracking-wider text-[10px] font-bold block">
                      Region
                    </span>
                    <span className="font-serif font-bold text-earth-900">{selectedPlacedNode.region}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-parchment-300">
                    <span className="text-earth-500 uppercase tracking-wider text-[10px] font-bold block">
                      Era
                    </span>
                    <span className="font-serif font-bold text-earth-900">{selectedPlacedNode.era}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={selectedPlacedNode.id.includes("nalanda") ? "/quest/nalanda" : "#"}
                  className="flex-1"
                >
                  <button className="w-full py-3.5 px-4 bg-earth-900 text-parchment-100 hover:bg-earth-800 rounded-xl font-serif font-bold text-xs uppercase tracking-wider transition-colors shadow">
                    Re-Enter Simulation
                  </button>
                </Link>
                <button
                  onClick={() => {
                    setConnectingNode(selectedPlacedNode);
                    setSelectedPlacedNode(null);
                  }}
                  className="flex-1 py-3.5 px-4 bg-gold-500 text-earth-950 hover:bg-gold-600 rounded-xl font-serif font-bold text-xs uppercase tracking-wider transition-colors shadow flex items-center justify-center gap-1.5"
                >
                  <Link2 className="w-4 h-4" />
                  <span>Form Sangam</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cultural Synergy Modal */}
      <AnimatePresence>
        {activeSynergyModal && (
          <div
            className="fixed inset-0 bg-black/85 z-[650] flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setActiveSynergyModal(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-earth-900 via-earth-850 to-earth-950 border-2 border-gold-500 text-parchment-100 p-8 rounded-3xl max-w-lg w-full text-center shadow-[0_0_60px_rgba(212,175,55,0.5)] relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-16 h-16 rounded-full bg-gold-500/20 border-2 border-gold-400 mx-auto flex items-center justify-center mb-4 text-3xl shadow-[0_0_20px_rgba(212,175,55,0.8)]">
                ✨
              </div>

              <div className="text-xs font-bold uppercase tracking-[0.3em] text-gold-400 mb-1">
                New Cultural Synergy Discovered
              </div>
              <h3 className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 mb-3">
                {activeSynergyModal.synergy.title}
              </h3>

              <p className="text-parchment-200/90 text-sm leading-relaxed mb-6 font-sans">
                {activeSynergyModal.synergy.description}
              </p>

              <div className="p-4 bg-earth-950/80 rounded-2xl border border-gold-500/30 mb-6 flex justify-around text-xs">
                <div>
                  <span className="text-gold-400 text-lg font-serif font-bold block">
                    +{activeSynergyModal.synergy.bonusXP}
                  </span>
                  <span className="text-parchment-400 text-[10px] uppercase tracking-wider">
                    Bonus XP
                  </span>
                </div>
                {activeSynergyModal.synergy.bonusDNA.map((d: { trait: keyof HeritageDNA; value: number }, i: number) => (
                  <div key={i}>
                    <span className="text-gold-400 text-lg font-serif font-bold block">
                      +{d.value}
                    </span>
                    <span className="text-parchment-400 text-[10px] uppercase tracking-wider capitalize">
                      {d.trait}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveSynergyModal(null)}
                className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 text-earth-950 font-serif font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg hover:brightness-110"
              >
                Continue Building India
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
