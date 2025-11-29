'use client'

import { useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function LoginPage() {
  const { login, requestMagicLink } = useAuth()
  const router = useRouter()

  // Password login state
  const [loginEmail, setLoginEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [loginMessage, setLoginMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Magic link state
  const [magicEmail, setMagicEmail] = useState('')
  const [isMagicLoading, setIsMagicLoading] = useState(false)
  const [magicMessage, setMagicMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginMessage(null)
    setIsLoginLoading(true)

    try {
      const result = await login(loginEmail, password)

      if (result.success) {
        setLoginMessage({ type: 'success', text: result.message || 'Επιτυχής σύνδεση' })
        // Redirect to profile after successful login
        setTimeout(() => {
          router.push('/profile')
        }, 1000)
      } else {
        setLoginMessage({ type: 'error', text: result.message || 'Σφάλμα σύνδεσης' })
      }
    } catch (error) {
      setLoginMessage({ type: 'error', text: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.' })
    } finally {
      setIsLoginLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setMagicMessage(null)
    setIsMagicLoading(true)

    try {
      const result = await requestMagicLink(magicEmail)

      if (result.success) {
        setMagicMessage({ type: 'success', text: result.message })
        setMagicEmail('')
      } else {
        setMagicMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setMagicMessage({ type: 'error', text: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.' })
    } finally {
      setIsMagicLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F0EB] dark:bg-gray-900">
      <Navigation />

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-16">
        <div className="w-full max-w-md space-y-6">

          {/* Password Login Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-charcoal dark:text-gray-100 mb-2">
                Σύνδεση
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Για χρήστες με κωδικό πρόσβασης
              </p>
            </div>

            {/* Password Login Form */}
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-charcoal dark:text-gray-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="login-email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="to-email-sas@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-charcoal dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-coral dark:focus:ring-coral-light focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                  disabled={isLoginLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-charcoal dark:text-gray-200 mb-2">
                  Κωδικός Πρόσβασης
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-charcoal dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-coral dark:focus:ring-coral-light focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                  disabled={isLoginLoading}
                />
              </div>

              {/* Login Message */}
              {loginMessage && (
                <div
                  className={`p-4 rounded-2xl text-sm ${
                    loginMessage.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {loginMessage.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoginLoading}
                className="w-full bg-coral hover:bg-coral/90 dark:bg-coral-light dark:hover:bg-coral-light/90 text-white py-3 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoginLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Σύνδεση...
                  </span>
                ) : (
                  'Σύνδεση'
                )}
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#F5F0EB] dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                ή
              </span>
            </div>
          </div>

          {/* Magic Link Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-charcoal dark:text-gray-100 mb-2">
                Πρώτη Σύνδεση
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Εισάγετε το email σας για να λάβετε σύνδεσμο
              </p>
            </div>

            {/* Magic Link Form */}
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label htmlFor="magic-email" className="block text-sm font-medium text-charcoal dark:text-gray-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="magic-email"
                  value={magicEmail}
                  onChange={(e) => setMagicEmail(e.target.value)}
                  placeholder="to-email-sas@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-charcoal dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-coral dark:focus:ring-coral-light focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                  disabled={isMagicLoading}
                />
              </div>

              {/* Magic Message */}
              {magicMessage && (
                <div
                  className={`p-4 rounded-2xl text-sm ${
                    magicMessage.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                  }`}
                >
                  {magicMessage.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isMagicLoading}
                className="w-full bg-gray-700 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white py-3 rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMagicLoading ? (
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

            {/* Info */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                Ο σύνδεσμος θα σας επιτρέψει να ορίσετε κωδικό πρόσβασης. Λήγει σε 6 ώρες.
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center space-y-2 pt-4">
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
      </div>

      <Footer />
    </main>
  )
}
