'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function LoginPage() {
  const { requestMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setIsLoading(true)

    try {
      const result = await requestMagicLink(email)

      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        setEmail('')
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F0EB] dark:bg-gray-900">
      <Navigation />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-charcoal dark:text-gray-100 mb-2">
                Σύνδεση Μέλους
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Εισάγετε το email σας για να λάβετε σύνδεσμο σύνδεσης
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal dark:text-gray-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="to-email-sas@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-charcoal dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-coral dark:focus:ring-coral-light focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                  disabled={isLoading}
                />
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`p-4 rounded-2xl text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-coral hover:bg-coral/90 dark:bg-coral-light dark:hover:bg-coral-light/90 text-white py-3 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Αποστολή...
                  </span>
                ) : (
                  'Αποστολή Συνδέσμου'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Δεν είστε μέλος;{' '}
                <Link href="/participation" className="text-coral dark:text-coral-light hover:underline font-medium">
                  Γίνετε μέλος
                </Link>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <Link href="/members" className="text-coral dark:text-coral-light hover:underline font-medium">
                  Περιήγηση Μελών
                </Link>
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-2xl text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Θα λάβετε έναν σύνδεσμο στο email σας μόνο αν το email σας υπάρχει στη βάση δεδομένων μελών μας.
              Ο σύνδεσμος θα λήξει σε 6 ώρες.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
