'use client'

import { useState } from 'react'

interface EditableFieldProps {
  label: string
  value: string
  placeholder?: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea'
  onChange: (value: string) => void
  maxLength?: number
  required?: boolean
}

export default function EditableField({
  label,
  value,
  placeholder,
  type = 'text',
  onChange,
  maxLength,
  required = false
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)

  const handleSave = () => {
    onChange(tempValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-charcoal dark:text-gray-200">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {isEditing ? (
        <div className="space-y-2">
          {/* Input Field */}
          {type === 'textarea' ? (
            <textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={maxLength}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-2xl text-charcoal dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-coral dark:focus:ring-coral-light focus:border-transparent resize-none"
              autoFocus
            />
          ) : (
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={maxLength}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full text-charcoal dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-coral dark:focus:ring-coral-light focus:border-transparent"
              autoFocus
            />
          )}

          {/* Character Counter */}
          {maxLength && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
              {tempValue.length} / {maxLength}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-coral hover:bg-coral/90 dark:bg-coral-light dark:hover:bg-coral-light/90 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              Αποθήκευση
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Ακύρωση
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="group cursor-pointer flex items-start gap-2 px-4 py-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {/* Display Value */}
          <div className="flex-1">
            {value ? (
              <p className="text-charcoal dark:text-gray-200 whitespace-pre-wrap break-words">
                {value}
              </p>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 italic">
                {placeholder || `Προσθέστε ${label.toLowerCase()}`}
              </p>
            )}
          </div>

          {/* Edit Icon */}
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-coral dark:group-hover:text-coral-light transition-colors flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
      )}
    </div>
  )
}
