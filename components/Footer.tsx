import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/cforc_logo.svg"
              alt="Culture for Change Logo"
              width={200}
              height={80}
              className="w-48"
            />
          </div>

          {/* Sitemap */}
          <div>
            <h3 className="font-bold mb-4 text-coral">SITEMAP</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/find-members" className="hover:text-coral transition-colors">ΕΥΡΕΣΗ ΜΕΛΩΝ</Link></li>
              <li><Link href="/about" className="hover:text-coral transition-colors">ΣΧΕΤΙΚΑ ΜΕ ΕΜΑΣ</Link></li>
              <li><Link href="/activities" className="hover:text-coral transition-colors">ΔΡΑΣΤΗΡΙΟΤΗΤΕΣ</Link></li>
              <li><Link href="/open-calls" className="hover:text-coral transition-colors">ΑΝΟΙΧΤΑ ΚΑΛΕΣΜΑΤΑ</Link></li>
              <li><Link href="/membership" className="hover:text-coral transition-colors">ΣΥΜΜΕΤΟΧΗ</Link></li>
              <li><Link href="/transparency" className="hover:text-coral transition-colors">ΔΙΑΦΑΝΕΙΑ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-coral">ΕΠΙΚΟΙΝΩΝΙΑ</h3>
            <ul className="space-y-2 text-sm">
              <li>Λ.ΑΛΕΞΑΝΔΡΑΣ 48, 11473, ΑΘΗΝΑ</li>
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
            <h3 className="font-bold mb-4 text-coral">ΠΟΛΙΤΙΚΗ</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-coral transition-colors">ΟΡΟΙ & ΠΡΟΫΠΟΘΕΣΕΙΣ</Link></li>
              <li><Link href="/privacy" className="hover:text-coral transition-colors">ΠΟΛΙΤΙΚΗ ΑΠΟΡΡΗΤΟΥ</Link></li>
              <li><Link href="/cookies" className="hover:text-coral transition-colors">ΠΟΛΙΤΙΚΗ COOKIES</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold mb-4 text-coral">SOCIAL MEDIA</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.linkedin.com/company/cultureforchange" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition-colors">
                  LINKED IN
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/cultureforchange" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition-colors">
                  FACEBOOK
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/cultureforchange" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition-colors">
                  INSTAGRAM
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/cultureforchange" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition-colors">
                  YOUTUBE
                </a>
              </li>
              <li>
                <a href="https://vimeo.com/cultureforchange" target="_blank" rel="noopener noreferrer" className="hover:text-coral transition-colors">
                  VIMEO
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-300 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-800">
          <p>ΠΝΕΥΜΑΤΙΚΑ ΔΙΚΑΙΩΜΑΤΑ © 2025 CULTURE FOR CHANGE</p>
          <p className="mt-2 md:mt-0">
            DESIGN BY <span className="font-medium">NEKATIV</span> DEVELOPED BY <span className="font-medium">DIV&TONIC</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
