'use client'

import { useState } from 'react'
import Link from 'next/link'

interface NewsletterSectionProps {
  variant?: 'default' | 'members'
}

export default function NewsletterSection({ variant = 'default' }: NewsletterSectionProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const bgColor = variant === 'members' ? 'bg-[#F5F0EB] dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (agreedToTerms) {
      window.open('https://docs.google.com/forms/d/e/1FAIpQLSfZt1bKl2vOOnztzSozcd1C0SCLEifXlvzUQgsG6gnQESbgMw/viewform', '_blank')
    }
  }

  return (
    <>
      <section className={`py-24 ${bgColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div>
              <p className="text-coral dark:text-coral-light text-sm font-medium mb-4">ΟΛΑ TA NEA ΣTO EMAIL ΣΑΣ!</p>
              <h2 className="text-xl md:text-2xl font-bold leading-tight mb-6 dark:text-gray-100">
                Γραφτείτε στο newsletter μας, για να<br />
                λαμβάνετε τις δράσεις του Δικτύου,<br />
                ευκαιρίες για επαγγελματίες και νέα από<br />
                το ελληνικό και παγκόσμιο πολιτιστικό<br />
                περιβάλλον.
              </h2>
            </div>

            {/* Right - Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-start gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-coral bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-coral focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="terms-checkbox" className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                    Συμφωνώ με τους{' '}
                    <Link href="/terms" className="text-charcoal dark:text-gray-200 font-medium hover:text-coral transition-colors underline">
                      όρους και τις προϋποθέσεις
                    </Link>
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={!agreedToTerms}
                  className="w-full bg-coral hover:bg-coral/90 text-white px-8 py-4 rounded-full text-lg font-bold transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ΕΓΓΡΑΦΗ ΣΤΟ NEWSLETTER
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
