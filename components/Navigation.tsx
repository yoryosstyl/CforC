'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import { useScrollAnimation } from '@/lib/useScrollAnimation'

interface NavigationProps {
  variant?: 'default' | 'members'
  heroText?: string
  navbarText?: string
  enableMorph?: boolean
}

export default function Navigation({ variant = 'default', heroText, navbarText, enableMorph = false }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMorphing, setIsMorphing] = useState(false)
  const [morphComplete, setMorphComplete] = useState(false)
  const [morphStyle, setMorphStyle] = useState<React.CSSProperties>({})
  const { isScrolled } = useScrollAnimation()
  const pathname = usePathname()
  const activeNavRef = useRef<HTMLAnchorElement>(null)
  const morphTextRef = useRef<HTMLDivElement>(null)

  // Determine active menu item
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname?.startsWith(path)) return true
    return false
  }

  // Handle morphing animation
  useEffect(() => {
    if (!enableMorph || !heroText || !navbarText) return

    if (isScrolled && !isMorphing && !morphComplete) {
      // Start morphing
      setIsMorphing(true)

      // Calculate position to morph to
      if (activeNavRef.current) {
        const navRect = activeNavRef.current.getBoundingClientRect()
        const heroStartX = window.innerWidth < 768 ? 20 : 100 // Approximate hero starting position
        const heroStartY = window.innerWidth < 768 ? 60 : 80

        const morphX = navRect.left + navRect.width / 2 - heroStartX
        const morphY = navRect.top + navRect.height / 2 - heroStartY - window.scrollY

        setMorphStyle({
          '--morph-x': `${morphX}px`,
          '--morph-y': `${morphY}px`,
        } as React.CSSProperties)
      }

      // Complete morph after animation
      setTimeout(() => {
        setIsMorphing(false)
        setMorphComplete(true)
      }, 800)
    } else if (!isScrolled && morphComplete) {
      // Reset when scrolling back up
      setMorphComplete(false)
    }
  }, [isScrolled, enableMorph, heroText, navbarText, isMorphing, morphComplete])

  const bgColor = variant === 'members' ? 'bg-[#F5F0EB]' : 'bg-coral'
  const bgOpacity = isScrolled ? (variant === 'members' ? 'bg-[#F5F0EB]/95' : 'bg-coral/95') : bgColor

  return (
    <nav className={`fixed ${isScrolled ? 'top-2' : 'top-0'} w-full z-50 shadow-sm transition-all duration-500 ${isScrolled ? 'px-4' : ''}`}>
      <div className={`${bgOpacity} ${isScrolled ? 'rounded-2xl' : ''} transition-all duration-500 backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 relative overflow-visible">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/cforc_logo.svg"
              alt="Culture for Change"
              className="h-12"
            />
          </Link>

          {/* Morphing Title - animates from hero to navbar */}
          {enableMorph && isMorphing && heroText && navbarText && (
            <div
              className="fixed pointer-events-none z-[100]"
              style={{
                left: window.innerWidth < 768 ? '20px' : '100px',
                top: window.innerWidth < 768 ? '60px' : '80px',
              }}
            >
              <div
                ref={morphTextRef}
                className="text-5xl md:text-6xl lg:text-7xl font-bold whitespace-nowrap animate-morphToNav"
                style={morphStyle}
              >
                {/* Crossfade from hero text to navbar text */}
                <span className="relative inline-block">
                  <span className="absolute inset-0 animate-[fadeOut_0.4s_ease-in-out_forwards]">
                    {heroText}
                  </span>
                  <span className="animate-[fadeIn_0.4s_0.4s_ease-in-out_forwards] opacity-0">
                    {navbarText}
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              ref={isActive('/about') ? activeNavRef : null}
              href="/about"
              className={`text-sm font-medium hover:text-charcoal transition-all duration-300 px-3 py-2 ${
                isActive('/about') && morphComplete
                  ? 'scale-125 font-extrabold'
                  : ''
              }`}
            >
              ΣΧΕΤΙΚΑ ΜΕ ΕΜΑΣ
            </Link>
            <Link
              ref={isActive('/activities') ? activeNavRef : null}
              href="/activities"
              className={`text-sm font-medium hover:text-charcoal transition-all duration-300 px-3 py-2 ${
                isActive('/activities') && morphComplete
                  ? 'scale-125 font-extrabold'
                  : ''
              }`}
            >
              ΔΡΑΣΤΗΡΙΟΤΗΤΕΣ
            </Link>
            <Link
              ref={isActive('/open-calls') ? activeNavRef : null}
              href="/open-calls"
              className={`text-sm font-medium hover:text-charcoal transition-all duration-300 px-3 py-2 ${
                isActive('/open-calls') && morphComplete
                  ? 'scale-125 font-extrabold'
                  : ''
              }`}
            >
              ΑΝΟΙΧΤΑ ΚΑΛΕΣΜΑΤΑ
            </Link>
            <Link
              ref={isActive('/participation') ? activeNavRef : null}
              href="/participation"
              className={`text-sm font-medium hover:text-charcoal transition-all duration-300 px-3 py-2 ${
                isActive('/participation') && morphComplete
                  ? 'scale-125 font-extrabold'
                  : ''
              }`}
            >
              ΣΥΜΜΕΤΟΧΗ
            </Link>
            <Link
              ref={isActive('/members') ? activeNavRef : null}
              href="/members"
              className={`bg-white text-charcoal px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-all duration-300 ${
                isActive('/members') && morphComplete
                  ? 'scale-125 font-extrabold'
                  : ''
              }`}
            >
              ΕΥΡΕΣΗ ΜΕΛΩΝ
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className={`md:hidden ${bgColor} border-t ${variant === 'members' ? 'border-gray-300' : 'border-coral-dark'}`}>
          <div className="px-4 py-4 space-y-3">
            <Link href="/about" className="block text-sm font-medium py-2">ΣΧΕΤΙΚΑ ΜΕ ΕΜΑΣ</Link>
            <Link href="/activities" className="block text-sm font-medium py-2">ΔΡΑΣΤΗΡΙΟΤΗΤΕΣ</Link>
            <Link href="/open-calls" className="block text-sm font-medium py-2">ΑΝΟΙΧΤΑ ΚΑΛΕΣΜΑΤΑ</Link>
            <Link href="/participation" className="block text-sm font-medium py-2">ΣΥΜΜΕΤΟΧΗ</Link>
            <Link href="/members" className="block w-full bg-white text-charcoal px-6 py-2 rounded-full text-sm font-medium text-center">
              ΕΥΡΕΣΗ ΜΕΛΩΝ
            </Link>
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
