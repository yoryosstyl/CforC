'use client'

import { useState } from 'react'
import Image from 'next/image'

// Map regions for Greek cities with SVG path coordinates
const greekRegions = {
  thessaloniki: {
    name: 'ΘΕΣΣΑΛΟΝΙΚΗ',
    // Northern Macedonia region
    path: 'M 200,40 L 350,40 L 360,80 L 340,120 L 280,130 L 200,120 Z',
  },
  attiki: {
    name: 'ΑΤΤΙΚΗ',
    // Attica region around Athens
    path: 'M 220,240 L 280,240 L 290,280 L 270,300 L 210,290 Z',
  },
  athens: {
    name: 'ΑΘΗΝΑ',
    // Same as Attiki
    path: 'M 220,240 L 280,240 L 290,280 L 270,300 L 210,290 Z',
  },
  kalamata: {
    name: 'ΚΑΛΑΜΑΤΑ',
    // Southern Peloponnese
    path: 'M 150,320 L 240,330 L 250,380 L 230,420 L 180,430 L 140,400 L 130,360 Z',
  },
  volos: {
    name: 'ΒΟΛΟΣ',
    // Central Greece / Thessaly
    path: 'M 230,150 L 290,160 L 300,200 L 280,220 L 220,210 L 210,170 Z',
  },
  messolonghi: {
    name: 'ΜΕΣΟΛΟΓΓΙ',
    // Western Central Greece
    path: 'M 140,200 L 200,210 L 210,250 L 190,270 L 130,260 L 120,230 Z',
  },
  preveza: {
    name: 'ΠΡΕΒΕΖΑ',
    // Epirus / Northwest
    path: 'M 120,140 L 180,150 L 190,190 L 170,210 L 110,200 L 100,170 Z',
  },
  crete: {
    name: 'ΚΡΗΤΗ/ΗΡΑΚΛΕΙΟ',
    // Crete island
    path: 'M 180,480 L 360,470 L 370,510 L 360,540 L 180,530 L 170,500 Z',
  },
}

// Island regions (will use circles)
const islandRegions = {
  chios: {
    name: 'ΧΙΟΣ',
    cx: '420',
    cy: '180',
    r: '25',
  },
  syros: {
    name: 'ΣΥΡΟΣ',
    cx: '340',
    cy: '260',
    r: '18',
  },
  skopelos: {
    name: 'ΣΚΟΠΕΛΟΣ',
    cx: '310',
    cy: '130',
    r: '18',
  },
}

// City lists with region mappings
const cities = {
  left: [
    { name: 'ΑΤΤΙΚΗ', region: 'attiki' },
    { name: 'ΧΙΟΣ', region: 'chios' },
    { name: 'ΚΑΛΑΜΑΤΑ', region: 'kalamata' },
    { name: 'ΒΡΥΣΕΛΛΕΣ', region: null },
    { name: 'ΛΙΣΑΒΟΝΑ', region: null },
    { name: 'ΚΥΠΡΟΣ', region: null },
    { name: 'ΣΥΡΟΣ', region: 'syros' },
    { name: 'ΒΟΛΟΣ', region: 'volos' },
  ],
  right: [
    { name: 'ΘΕΣΣΑΛΟΝΙΚΗ', region: 'thessaloniki' },
    { name: 'ΜΕΣΟΛΟΓΓΙ', region: 'messolonghi' },
    { name: 'ΣΚΟΠΕΛΟΣ', region: 'skopelos' },
    { name: 'ΠΡΕΒΕΖΑ', region: 'preveza' },
    { name: 'ΚΡΗΤΗ/ΗΡΑΚΛΕΙΟ', region: 'crete' },
    { name: 'ΘΕΣΣΑΛΟΝΙΚΗ', region: 'thessaloniki' },
    { name: 'ΑΘΗΝΑ', region: 'athens' },
    { name: 'ΠΟΡΤΟΓΑΛΙΑ', region: null },
  ],
}

export default function AboutMapSection() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  const handleCityHover = (region: string | null) => {
    setHoveredRegion(region)
  }

  const handleRegionClick = (region: string) => {
    setSelectedRegion(selectedRegion === region ? null : region)
  }

  const isRegionActive = (region: string) => {
    return hoveredRegion === region || selectedRegion === region
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-coral text-sm font-medium mb-4">ΣΧΕΤΙΚΑ ΜΕ ΕΜΑΣ</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            ΠΡΟΩΘΟΥΜΕ ΕΝΕΡΓΑ ΤΗΝ ΠΟΛΙΤΙΣΤΙΚΗ<br />
            ΑΛΛΑΓΗ ΣΕ ΟΛΟΚΛΗΡΗ ΤΗΝ ΕΛΛΑΔΑ
          </h2>
        </div>

        {/* Map and Cities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left Cities List */}
          <div className="space-y-4">
            {cities.left.map((city, idx) => (
              <div
                key={`${city.name}-${idx}`}
                className={`pb-3 border-b border-gray-300 ${
                  city.region
                    ? `cursor-pointer transition-colors duration-300 ${
                        isRegionActive(city.region)
                          ? 'text-coral border-coral'
                          : 'text-charcoal hover:text-coral hover:border-coral'
                      }`
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                onMouseEnter={() => city.region && handleCityHover(city.region)}
                onMouseLeave={() => city.region && handleCityHover(null)}
                onClick={() => city.region && handleRegionClick(city.region)}
              >
                <span className="text-sm font-medium">{city.name}</span>
              </div>
            ))}
          </div>

          {/* Map in Center */}
          <div className="flex items-center justify-center relative">
            <div className="relative w-full max-w-md aspect-[3/4]">
              {/* Greece Map Background */}
              <Image
                src="/map-of-greece.jpg"
                alt="Map of Greece"
                fill
                className="object-contain"
              />

              {/* SVG Overlay for Interactive Regions */}
              <svg
                viewBox="0 0 500 600"
                className="absolute inset-0 w-full h-full"
                style={{ pointerEvents: 'none' }}
              >
                {/* Mainland regions with path outlines */}
                {Object.entries(greekRegions).map(([regionKey, region]) => (
                  <path
                    key={regionKey}
                    d={region.path}
                    fill={isRegionActive(regionKey) ? 'rgba(255, 107, 74, 0.5)' : 'transparent'}
                    stroke="transparent"
                    strokeWidth="0"
                    className="cursor-pointer transition-all duration-300"
                    style={{ pointerEvents: 'auto' }}
                    onMouseEnter={() => handleCityHover(regionKey)}
                    onMouseLeave={() => handleCityHover(null)}
                    onClick={() => handleRegionClick(regionKey)}
                  />
                ))}

                {/* Island regions with circles */}
                {Object.entries(islandRegions).map(([regionKey, island]) => (
                  <circle
                    key={regionKey}
                    cx={island.cx}
                    cy={island.cy}
                    r={island.r}
                    fill={isRegionActive(regionKey) ? 'rgba(255, 107, 74, 0.5)' : 'transparent'}
                    stroke="transparent"
                    strokeWidth="0"
                    className="cursor-pointer transition-all duration-300"
                    style={{ pointerEvents: 'auto' }}
                    onMouseEnter={() => handleCityHover(regionKey)}
                    onMouseLeave={() => handleCityHover(null)}
                    onClick={() => handleRegionClick(regionKey)}
                  />
                ))}
              </svg>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button className="pointer-events-auto w-16 h-16 rounded-full bg-charcoal/80 hover:bg-charcoal flex items-center justify-center transition-colors group">
                  <svg
                    className="w-8 h-8 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Cities List */}
          <div className="space-y-4">
            {cities.right.map((city, idx) => (
              <div
                key={`${city.name}-${idx}`}
                className={`pb-3 border-b border-gray-300 text-right ${
                  city.region
                    ? `cursor-pointer transition-colors duration-300 ${
                        isRegionActive(city.region)
                          ? 'text-coral border-coral'
                          : 'text-charcoal hover:text-coral hover:border-coral'
                      }`
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                onMouseEnter={() => city.region && handleCityHover(city.region)}
                onMouseLeave={() => city.region && handleCityHover(null)}
                onClick={() => city.region && handleRegionClick(city.region)}
              >
                <span className="text-sm font-medium">{city.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
