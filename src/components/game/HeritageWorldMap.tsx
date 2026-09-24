"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { City } from "@/data/gameContent";
import { useRouter } from "next/navigation";

const TRAVEL_MS = 900;

/** Flies the camera to a target before the parent navigates away — gives
 * marker selection a "travelling there" feel instead of an instant cut. */
function TravelCamera({
  target,
  onArrive,
}: {
  target: [number, number] | null;
  onArrive: () => void;
}) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo(target, 7, { duration: TRAVEL_MS / 1000 });
    const timer = setTimeout(onArrive, TRAVEL_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return null;
}

// Nalanda lives as its own standalone quest (not a City record), but it is
// DHARA's master vertical slice and must appear on the real map too.
const NALANDA_MARKER = {
  id: "nalanda",
  name: "Nalanda",
  latLng: [25.1358, 85.4429] as [number, number],
  region: "Magadha (Bihar)",
};

function createSiteIcon(name: string, status: "playable" | "locked" | "master") {
  const boxStyle =
    status === "master"
      ? "bg-gradient-to-tr from-forest-800 to-forest-900 border-gold-400 text-gold-300"
      : status === "playable"
      ? "bg-earth-900 border-gold-500/70 text-gold-400"
      : "bg-stone-900/80 border-stone-700 text-stone-400 opacity-70";

  return L.divIcon({
    className: "bg-transparent border-0",
    html: `
      <div class="flex flex-col items-center cursor-pointer group">
        <div class="w-3.5 h-3.5 rounded-full border-2 ${boxStyle} shadow-md group-hover:scale-125 transition-transform"></div>
        <div class="mt-1 px-2 py-0.5 rounded-md bg-earth-950/90 border border-gold-500/30 text-parchment-200 text-[10px] font-serif tracking-wide whitespace-nowrap shadow">
          ${name}
        </div>
      </div>
    `,
    iconSize: [1, 1],
    iconAnchor: [7, 7],
  });
}

interface HeritageWorldMapProps {
  cities: City[];
  isCityUnlocked: (id: string) => boolean;
  onSelectCity: (city: City) => void;
  onLockedCity: (city: City) => void;
}

export default function HeritageWorldMap({
  cities,
  isCityUnlocked,
  onSelectCity,
  onLockedCity,
}: HeritageWorldMapProps) {
  const router = useRouter();
  const [travelTarget, setTravelTarget] = useState<[number, number] | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const beginTravel = (latLng: [number, number], action: () => void) => {
    setTravelTarget(latLng);
    setPendingAction(() => action);
  };

  const handleArrive = () => {
    pendingAction?.();
    setTravelTarget(null);
    setPendingAction(null);
  };

  return (
    <div className="relative w-full aspect-[16/9] min-h-[440px] sm:min-h-[560px] md:min-h-[620px] rounded-3xl overflow-hidden border-2 border-gold-500/50 shadow-xl bg-[#1e140d]">
      <MapContainer
        center={[22.5, 79.5]}
        zoom={5}
        minZoom={4}
        maxZoom={9}
        scrollWheelZoom={false}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          className="dhara-map-tiles"
        />
        <style jsx global>{`
          .dhara-map-tiles {
            filter: brightness(0.55) sepia(0.5) hue-rotate(345deg) saturate(1.2);
          }
          .leaflet-control-attribution {
            background: rgba(20, 14, 9, 0.7) !important;
            color: #cb9f79 !important;
            font-size: 9px !important;
          }
          .leaflet-control-attribution a {
            color: #d4af37 !important;
          }
        `}</style>

        <TravelCamera target={travelTarget} onArrive={handleArrive} />

        {/* Nalanda — the master vertical slice, always playable */}
        <Marker
          position={NALANDA_MARKER.latLng}
          icon={createSiteIcon(NALANDA_MARKER.name, "master")}
          eventHandlers={{
            click: () => beginTravel(NALANDA_MARKER.latLng, () => router.push("/quest/nalanda")),
          }}
        />

        {cities.map((city) => {
          const unlocked = isCityUnlocked(city.id);
          return (
            <Marker
              key={city.id}
              position={city.latLng}
              icon={createSiteIcon(city.name, unlocked ? "playable" : "locked")}
              eventHandlers={{
                click: () =>
                  unlocked
                    ? beginTravel(city.latLng, () => onSelectCity(city))
                    : onLockedCity(city),
              }}
            />
          );
        })}
      </MapContainer>

      {travelTarget && (
        <div className="absolute inset-0 z-[400] flex items-end justify-center pb-6 bg-black/0 pointer-events-none">
          <div className="px-4 py-2 rounded-full bg-earth-950/90 border border-gold-500/40 text-gold-300 text-xs font-mono tracking-widest uppercase animate-pulse">
            Travelling…
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-[400] pointer-events-none hidden sm:flex items-center gap-2 bg-earth-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gold-500/40 text-[11px] font-mono text-gold-300 shadow-md">
        <span>Real geography · verified site coordinates</span>
      </div>
    </div>
  );
}
