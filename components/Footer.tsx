'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

interface FooterProps {
  variant?: 'default' | 'members'
}

export default function Footer({ variant = 'default' }: FooterProps) {
  const bgColor = variant === 'members' ? 'bg-[#F5F0EB]' : 'bg-gray-100'
  const locale = useLocale()
  const t = useTranslations('footer')

  return (
    <footer className={bgColor}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          {/* Logo */}
          <div className="mb-8 md:mb-0">
            <Image
              src="/cforc_logo.svg"
              alt="Culture for Change Logo"
              width={160}
              height={64}
              className="w-40"
            />
          </div>

          {/* Right columns group */}
          <div className="flex gap-6 md:gap-8">
            {/* Sitemap */}
            <div>
              <h3 className="font-bold mb-3 text-coral text-xs">SITEMAP</h3>
            <ul className="space-y-1.5 text-xs">
              <li><Link href={`/${locale}/members`} className="hover:text-coral transition-colors">{t('findMembers').toUpperCase()}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-coral transition-colors">{t('about').toUpperCase()}</Link></li>
              <li><Link href={`/${locale}/activities`} className="hover:text-coral transition-colors">{t('activities').toUpperCase()}</Link></li>
              <li><Link href={`/${locale}/open-calls`} className="hover:text-coral transition-colors">{t('openCalls').toUpperCase()}</Link></li>
              <li><Link href={`/${locale}/participation`} className="hover:text-coral transition-colors">{t('participation').toUpperCase()}</Link></li>
              <li><Link href={`/${locale}/transparency`} className="hover:text-coral transition-colors">{t('transparency').toUpperCase()}</Link></li>
            </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold mb-3 text-coral text-xs">{t('contact').toUpperCase()}</h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a
                  href="https://www.google.com/maps/place/Leof.+Alexandras+48,+Athina+114+73/@37.9905657,23.7374602,1006m/data=!3m2!1e3!4b1!4m6!3m5!1s0x14a1bd3522c01fef:0x1734422b9fe058ad!8m2!3d37.9905657!4d23.7374602!16s%2Fg%2F11b8v65q35?entry=ttu&g_ep=EgoyMDI1MTEwNC4xIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-coral transition-colors"
                >
                  {t('address').toUpperCase()}
                </a>
              </li>
              <li>
                <a href="mailto:HELLO@CULTUREFORCHANGE.NET" className="hover:text-coral transition-colors">
                  HELLO@CULTUREFORCHANGE.NET
                </a>
              </li>
              <li>
                <a href="tel:+306976225704" className="hover:text-coral transition-colors">
                  +306976225704
                </a>
              </li>
            </ul>
            </div>

            {/* Policy */}
            <div>
              <h3 className="font-bold mb-3 text-coral text-xs">{t('policies').toUpperCase()}</h3>
            <ul className="space-y-1.5 text-xs">
              <li><Link href={`/${locale}/terms`} className="hover:text-coral transition-colors">{t('terms').toUpperCase()}</Link></li>
              <li><Link href={`/${locale}/privacy`} className="hover:text-coral transition-colors">{t('privacy').toUpperCase()}</Link></li>
              <li><Link href={`/${locale}/cookies`} className="hover:text-coral transition-colors">{t('cookies').toUpperCase()}</Link></li>
            </ul>
            </div>

            {/* Social Media - aligned with Yoryos Styl */}
            <div className="relative" style={{marginRight: '-0.15em'}}>
              <h3 className="font-bold mb-3 text-coral text-xs text-right">SOCIAL MEDIA</h3>
              <ul className="space-y-1.5 text-xs text-right">
                <li>
                  <a href="https://www.linkedin.com/company/culture-for-change-gr/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition-colors">
                    LINKED IN
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/cultureforchange" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition-colors">
                    FACEBOOK
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/culture_for_change/" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition-colors">
                    INSTAGRAM
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/channel/UCKFq7TQlenx36UPc3F63Opw" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition-colors">
                    YOUTUBE
                  </a>
                </li>
                <li>
                  <a href="https://vimeo.com/user165582483" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition-colors">
                    VIMEO
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-700">
          <p>{t('copyright').toUpperCase()}</p>
          <p className="mt-2 md:mt-0">
            Developed by <a href="https://yoryosstyl.com" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-coral transition-colors">Yoryos Styl</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
