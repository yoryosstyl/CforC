'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import EditableField from '@/components/profile/EditableField'
import EditableImage from '@/components/profile/EditableImage'
import ConfirmationModal from '@/components/ConfirmationModal'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, refreshSession } = useAuth()

  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Bio: '',
    FieldsOfWork: '',
    City: '',
    Province: '',
    Phone: '',
    Websites: ''
  })

  const [originalData, setOriginalData] = useState(formData)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  // Check authentication
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      const data = {
        Name: user.Name || '',
        Email: user.Email || '',
        Bio: user.Bio || '',
        FieldsOfWork: user.FieldsOfWork || '',
        City: user.City || '',
        Province: user.Province || '',
        Phone: user.Phone || '',
        Websites: user.Websites || ''
      }
      setFormData(data)
      setOriginalData(data)
    }
  }, [user])

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    return (
      JSON.stringify(formData) !== JSON.stringify(originalData) ||
      imageFile !== null
    )
  }

  // Handle field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setSaveMessage(null)
  }

  // Handle image change
  const handleImageChange = (file: File) => {
    setImageFile(file)
    setSaveMessage(null)
  }

  // Save changes
  const handleSave = async () => {
    if (!hasUnsavedChanges()) return

    setIsSaving(true)
    setSaveMessage(null)

    try {
      let response

      if (imageFile) {
        // Use FormData if there's an image
        const formDataWithImage = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
          formDataWithImage.append(key, value)
        })
        formDataWithImage.append('image', imageFile)

        response = await fetch('/api/members/update', {
          method: 'POST',
          body: formDataWithImage
        })
      } else {
        // Use JSON if no image
        response = await fetch('/api/members/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
      }

      const data = await response.json()

      if (response.ok) {
        setSaveMessage({ type: 'success', text: 'Οι αλλαγές αποθηκεύτηκαν επιτυχώς' })
        setOriginalData(formData)
        setImageFile(null)

        // Refresh session to update user data
        await refreshSession()
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Αποτυχία αποθήκευσης' })
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Σφάλμα δικτύου. Παρακαλώ δοκιμάστε ξανά.' })
    } finally {
      setIsSaving(false)
    }
  }

  // Discard changes
  const handleDiscard = () => {
    setFormData(originalData)
    setImageFile(null)
    setSaveMessage(null)
    setShowUnsavedModal(false)

    if (pendingNavigation) {
      router.push(pendingNavigation)
    }
  }

  // Save and navigate
  const handleSaveAndNavigate = async () => {
    await handleSave()
    setShowUnsavedModal(false)

    if (pendingNavigation) {
      router.push(pendingNavigation)
    }
  }

  // Warn before leaving page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges()) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [formData, originalData, imageFile])

  // Show loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F5F0EB] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-coral dark:text-coral-light mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-300">Φόρτωση...</p>
        </div>
      </main>
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null
  }

  const currentImageUrl = user.Image && user.Image.length > 0 ? user.Image[0].url : undefined

  return (
    <main className="min-h-screen bg-[#F5F0EB] dark:bg-gray-900">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal dark:text-gray-100 mb-2">
            Το Προφίλ Μου
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Επεξεργαστείτε τις πληροφορίες του προφίλ σας
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Profile Image */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
              <h2 className="text-lg font-bold text-charcoal dark:text-gray-100 mb-4">
                Φωτογραφία Προφίλ
              </h2>
              <EditableImage
                currentImageUrl={currentImageUrl}
                alt={user.Name}
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Right Column - Profile Fields */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-6">
              <h2 className="text-lg font-bold text-charcoal dark:text-gray-100 mb-4">
                Βασικές Πληροφορίες
              </h2>

              <EditableField
                label="Όνομα"
                value={formData.Name}
                placeholder="Το όνομά σας"
                onChange={(value) => handleFieldChange('Name', value)}
                required
              />

              <EditableField
                label="Email"
                value={formData.Email}
                placeholder="email@example.com"
                type="email"
                onChange={(value) => handleFieldChange('Email', value)}
                required
              />

              <EditableField
                label="Βιογραφικό"
                value={formData.Bio}
                placeholder="Γράψτε μια σύντομη περιγραφή για εσάς..."
                type="textarea"
                onChange={(value) => handleFieldChange('Bio', value)}
                maxLength={500}
              />

              <EditableField
                label="Τομείς Εργασίας"
                value={formData.FieldsOfWork}
                placeholder="π.χ. Τέχνη, Πολιτισμός, Κοινωνική Καινοτομία"
                onChange={(value) => handleFieldChange('FieldsOfWork', value)}
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-6">
              <h2 className="text-lg font-bold text-charcoal dark:text-gray-100 mb-4">
                Στοιχεία Επικοινωνίας
              </h2>

              <EditableField
                label="Τηλέφωνο"
                value={formData.Phone}
                placeholder="+30 123 456 7890"
                type="tel"
                onChange={(value) => handleFieldChange('Phone', value)}
              />

              <EditableField
                label="Πόλη"
                value={formData.City}
                placeholder="Αθήνα"
                onChange={(value) => handleFieldChange('City', value)}
              />

              <EditableField
                label="Περιφέρεια"
                value={formData.Province}
                placeholder="Αττική"
                onChange={(value) => handleFieldChange('Province', value)}
              />

              <EditableField
                label="Ιστοσελίδες"
                value={formData.Websites}
                placeholder="https://example.com"
                type="url"
                onChange={(value) => handleFieldChange('Websites', value)}
              />
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div
                className={`p-4 rounded-2xl text-sm ${
                  saveMessage.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                }`}
              >
                {saveMessage.text}
              </div>
            )}

            {/* Save Button - Only show when there are unsaved changes */}
            {hasUnsavedChanges() && (
              <div className="sticky bottom-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 border-2 border-coral dark:border-coral-light">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-coral dark:bg-coral-light animate-pulse"></div>
                    <span className="text-sm font-medium text-charcoal dark:text-gray-200">
                      Έχετε μη αποθηκευμένες αλλαγές
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDiscard}
                      disabled={isSaving}
                      className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      Απόρριψη
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2 bg-coral hover:bg-coral/90 dark:bg-coral-light dark:hover:bg-coral-light/90 text-white rounded-full text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Αποθήκευση...
                        </>
                      ) : (
                        'Αποθήκευση'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unsaved Changes Modal */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
            onClick={() => setShowUnsavedModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-center text-charcoal dark:text-gray-100 mb-3">
              Μη Αποθηκευμένες Αλλαγές
            </h3>

            {/* Message */}
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Έχετε μη αποθηκευμένες αλλαγές. Τι θέλετε να κάνετε;
            </p>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleSaveAndNavigate}
                className="w-full px-6 py-3 bg-coral hover:bg-coral/90 dark:bg-coral-light dark:hover:bg-coral-light/90 text-white rounded-full font-medium transition-colors"
              >
                Αποθήκευση & Αποχώρηση
              </button>
              <button
                onClick={handleDiscard}
                className="w-full px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Απόρριψη Αλλαγών
              </button>
              <button
                onClick={() => {
                  setShowUnsavedModal(false)
                  setPendingNavigation(null)
                }}
                className="w-full px-6 py-3 text-gray-600 dark:text-gray-300 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Παραμονή στη Σελίδα
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
