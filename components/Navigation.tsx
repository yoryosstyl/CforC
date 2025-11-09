'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'

interface NavigationProps {
  variant?: 'default' | 'members'
}

export default function Navigation({ variant = 'default' }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const t = useTranslations('navigation')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname and add new locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '')
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  useEffect(() => {
    const handleScroll = () => {
      // Detect if scrolled past hero section (approximately 25vh)
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 150)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const bgColor = variant === 'members' ? 'bg-[#F5F0EB]' : 'bg-coral'
  const bgOpacity = isScrolled ? (variant === 'members' ? 'bg-[#F5F0EB]/90' : 'bg-coral/90') : bgColor

  return (
    <nav className={`fixed ${isScrolled ? 'top-2' : 'top-0'} w-full z-50 shadow-sm transition-all duration-300 ${isScrolled ? 'px-4' : ''}`}>
      <div className={`${bgOpacity} ${isScrolled ? 'rounded-2xl scale-90' : ''} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <img
              src="/cforc_logo.svg"
              alt="Culture for Change"
              className="h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href={`/${locale}/about`} className="text-sm font-medium hover:text-charcoal transition-colors">
              {t('about')}
            </Link>
            <Link href={`/${locale}/activities`} className="text-sm font-medium hover:text-charcoal transition-colors">
              {t('activities')}
            </Link>
            <Link href={`/${locale}/open-calls`} className="text-sm font-medium hover:text-charcoal transition-colors">
              {t('openCalls')}
            </Link>
            <Link href={`/${locale}/participation`} className="text-sm font-medium hover:text-charcoal transition-colors">
              {t('contact')}
            </Link>
            <Link href={`/${locale}/members`} className="bg-white text-charcoal px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
              {t('findMembers')}
            </Link>
            <button
              onClick={() => switchLocale(locale === 'el' ? 'en' : 'el')}
              className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
              title={locale === 'el' ? 'Switch to English' : 'Αλλαγή σε Ελληνικά'}
            >
              <span className="text-sm font-bold">{locale === 'el' ? 'EN' : 'ΕΛ'}</span>
            </button>
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
            <Link href={`/${locale}/about`} className="block text-sm font-medium py-2">{t('about')}</Link>
            <Link href={`/${locale}/activities`} className="block text-sm font-medium py-2">{t('activities')}</Link>
            <Link href={`/${locale}/open-calls`} className="block text-sm font-medium py-2">{t('openCalls')}</Link>
            <Link href={`/${locale}/participation`} className="block text-sm font-medium py-2">{t('contact')}</Link>
            <Link href={`/${locale}/members`} className="block w-full bg-white text-charcoal px-6 py-2 rounded-full text-sm font-medium text-center">
              {t('findMembers')}
            </Link>
            <button
              onClick={() => switchLocale(locale === 'el' ? 'en' : 'el')}
              className="w-full bg-white/20 text-charcoal px-6 py-2 rounded-full text-sm font-bold text-center hover:bg-white/30 transition-colors"
            >
              {locale === 'el' ? 'English (EN)' : 'Ελληνικά (ΕΛ)'}
            </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
