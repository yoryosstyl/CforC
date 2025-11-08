'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

// Initial city positions
const initialCityCircles = {
  thessaloniki: {
    name: 'ΘΕΣΣΑΛΟΝΙΚΗ',
    cx: 250,
    cy: 100,
    r: 20,
  },
  attiki: {
    name: 'ΑΤΤΙΚΗ',
    cx: 270,
    cy: 280,
    r: 20,
  },
  athens: {
    name: 'ΑΘΗΝΑ',
    cx: 270,
    cy: 280,
    r: 20,
  },
  kalamata: {
    name: 'ΚΑΛΑΜΑΤΑ',
    cx: 180,
    cy: 370,
    r: 20,
  },
  volos: {
    name: 'ΒΟΛΟΣ',
    cx: 270,
    cy: 200,
    r: 20,
  },
  messolonghi: {
    name: 'ΜΕΣΟΛΟΓΓΙ',
    cx: 160,
    cy: 250,
    r: 20,
  },
  preveza: {
    name: 'ΠΡΕΒΕΖΑ',
    cx: 130,
    cy: 200,
    r: 20,
  },
  crete: {
    name: 'ΚΡΗΤΗ/ΗΡΑΚΛΕΙΟ',
    cx: 280,
    cy: 520,
    r: 20,
  },
  chios: {
    name: 'ΧΙΟΣ',
    cx: 420,
    cy: 300,
    r: 20,
  },
  syros: {
    name: 'ΣΥΡΟΣ',
    cx: 330,
    cy: 350,
    r: 20,
  },
  skopelos: {
    name: 'ΣΚΟΠΕΛΟΣ',
    cx: 310,
    cy: 150,
    r: 20,
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
  const [cityPositions, setCityPositions] = useState(initialCityCircles)
  const [draggingCity, setDraggingCity] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const handleCityHover = (region: string | null) => {
    setHoveredRegion(region)
  }

  const handleRegionClick = (region: string) => {
    setSelectedRegion(selectedRegion === region ? null : region)
  }

  const isRegionActive = (region: string) => {
    return hoveredRegion === region || selectedRegion === region
  }

  const handleMouseDown = (regionKey: string, e: React.MouseEvent) => {
    e.preventDefault()
    setDraggingCity(regionKey)
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingCity || !svgRef.current) return

    const svg = svgRef.current
    const point = svg.createSVGPoint()
    point.x = e.clientX
    point.y = e.clientY
    const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse())

    setCityPositions(prev => ({
      ...prev,
      [draggingCity]: {
        ...prev[draggingCity as keyof typeof prev],
        cx: Math.round(svgPoint.x),
        cy: Math.round(svgPoint.y),
      },
    }))
  }

  const handleMouseUp = () => {
    setDraggingCity(null)
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
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{city.name}</span>
                  {city.region && (
                    <span className="text-xs text-gray-500 font-mono">
                      ({cityPositions[city.region as keyof typeof cityPositions].cx}, {cityPositions[city.region as keyof typeof cityPositions].cy})
                    </span>
                  )}
                </div>
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
                ref={svgRef}
                viewBox="0 0 500 600"
                className="absolute inset-0 w-full h-full"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* All cities as circles - always visible and draggable */}
                {Object.entries(cityPositions).map(([regionKey, city]) => (
                  <circle
                    key={regionKey}
                    cx={city.cx}
                    cy={city.cy}
                    r={city.r}
                    fill={
                      draggingCity === regionKey
                        ? 'rgba(255, 107, 74, 0.8)'
                        : isRegionActive(regionKey)
                        ? 'rgba(255, 107, 74, 0.5)'
                        : 'rgba(255, 107, 74, 0.3)'
                    }
                    stroke="rgba(255, 107, 74, 0.8)"
                    strokeWidth="2"
                    className="cursor-move transition-all duration-300"
                    onMouseDown={(e) => handleMouseDown(regionKey, e)}
                    onMouseEnter={() => handleCityHover(regionKey)}
                    onMouseLeave={() => !draggingCity && handleCityHover(null)}
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
                <div className="flex justify-between items-center">
                  {city.region && (
                    <span className="text-xs text-gray-500 font-mono">
                      ({cityPositions[city.region as keyof typeof cityPositions].cx}, {cityPositions[city.region as keyof typeof cityPositions].cy})
                    </span>
                  )}
                  <span className="text-sm font-medium">{city.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
