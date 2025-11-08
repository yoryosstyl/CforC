'use client'

import { useState } from 'react'
import Image from 'next/image'

// All city regions as circles with positions based on actual map
const cityCircles = {
  thessaloniki: {
    name: 'ΘΕΣΣΑΛΟΝΙΚΗ',
    cx: '250',
    cy: '100',
    r: '20',
  },
  attiki: {
    name: 'ΑΤΤΙΚΗ',
    cx: '270',
    cy: '280',
    r: '20',
  },
  athens: {
    name: 'ΑΘΗΝΑ',
    cx: '270',
    cy: '280',
    r: '20',
  },
  kalamata: {
    name: 'ΚΑΛΑΜΑΤΑ',
    cx: '180',
    cy: '370',
    r: '20',
  },
  volos: {
    name: 'ΒΟΛΟΣ',
    cx: '270',
    cy: '200',
    r: '20',
  },
  messolonghi: {
    name: 'ΜΕΣΟΛΟΓΓΙ',
    cx: '160',
    cy: '250',
    r: '20',
  },
  preveza: {
    name: 'ΠΡΕΒΕΖΑ',
    cx: '130',
    cy: '200',
    r: '20',
  },
  crete: {
    name: 'ΚΡΗΤΗ/ΗΡΑΚΛΕΙΟ',
    cx: '280',
    cy: '520',
    r: '20',
  },
  chios: {
    name: 'ΧΙΟΣ',
    cx: '420',
    cy: '300',
    r: '20',
  },
  syros: {
    name: 'ΣΥΡΟΣ',
    cx: '330',
    cy: '350',
    r: '20',
  },
  skopelos: {
    name: 'ΣΚΟΠΕΛΟΣ',
    cx: '310',
    cy: '150',
    r: '20',
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
                {/* All cities as circles */}
                {Object.entries(cityCircles).map(([regionKey, city]) => (
                  <circle
                    key={regionKey}
                    cx={city.cx}
                    cy={city.cy}
                    r={city.r}
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
