'use client'

import { useState } from 'react'
import Image from 'next/image'

// Map regions for Greek cities only (excluding foreign cities)
const greekRegions = {
  thessaloniki: {
    name: 'ΘΕΣΣΑΛΟΝΙΚΗ',
    position: { top: '15%', left: '58%', width: '15%', height: '12%' },
    type: 'region'
  },
  attiki: {
    name: 'ΑΤΤΙΚΗ',
    position: { top: '48%', left: '52%', width: '12%', height: '10%' },
    type: 'region'
  },
  athens: {
    name: 'ΑΘΗΝΑ',
    position: { top: '48%', left: '52%', width: '12%', height: '10%' },
    type: 'region'
  },
  chios: {
    name: 'ΧΙΟΣ',
    position: { top: '35%', left: '80%', width: '8%', height: '6%' },
    type: 'island'
  },
  kalamata: {
    name: 'ΚΑΛΑΜΑΤΑ',
    position: { top: '62%', left: '42%', width: '14%', height: '12%' },
    type: 'region'
  },
  syros: {
    name: 'ΣΥΡΟΣ',
    position: { top: '52%', left: '68%', width: '6%', height: '5%' },
    type: 'island'
  },
  volos: {
    name: 'ΒΟΛΟΣ',
    position: { top: '32%', left: '54%', width: '10%', height: '8%' },
    type: 'region'
  },
  messolonghi: {
    name: 'ΜΕΣΟΛΟΓΓΙ',
    position: { top: '42%', left: '38%', width: '10%', height: '8%' },
    type: 'region'
  },
  skopelos: {
    name: 'ΣΚΟΠΕΛΟΣ',
    position: { top: '28%', left: '64%', width: '6%', height: '5%' },
    type: 'island'
  },
  preveza: {
    name: 'ΠΡΕΒΕΖΑ',
    position: { top: '35%', left: '35%', width: '10%', height: '8%' },
    type: 'region'
  },
  crete: {
    name: 'ΚΡΗΤΗ/ΗΡΑΚΛΕΙΟ',
    position: { top: '82%', left: '48%', width: '28%', height: '12%' },
    type: 'region'
  }
}

// City lists with region mappings
const cities = {
  left: [
    { name: 'ΑΤΤΙΚΗ', region: 'attiki' },
    { name: 'ΧΙΟΣ', region: 'chios' },
    { name: 'ΚΑΛΑΜΑΤΑ', region: 'kalamata' },
    { name: 'ΒΡΥΣΕΛΛΕΣ', region: null }, // Foreign city
    { name: 'ΛΙΣΑΒΟΝΑ', region: null }, // Foreign city
    { name: 'ΚΥΠΡΟΣ', region: null }, // Foreign/not on map
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
    { name: 'ΠΟΡΤΟΓΑΛΙΑ', region: null }, // Foreign city
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

              {/* Interactive Region Overlays */}
              {Object.entries(greekRegions).map(([regionKey, region]) => (
                <div
                  key={regionKey}
                  className="absolute cursor-pointer transition-all duration-300"
                  style={{
                    top: region.position.top,
                    left: region.position.left,
                    width: region.position.width,
                    height: region.position.height,
                    backgroundColor: isRegionActive(regionKey) ? 'rgba(255, 107, 74, 0.5)' : 'transparent',
                    borderRadius: region.type === 'island' ? '50%' : '8px',
                  }}
                  onMouseEnter={() => handleCityHover(regionKey)}
                  onMouseLeave={() => handleCityHover(null)}
                  onClick={() => handleRegionClick(regionKey)}
                />
              ))}

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
