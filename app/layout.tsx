import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Culture for Change',
  description: 'First Greek social innovation network for cultural and political change',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="el">
      <body>
        {children}
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'el',
                  includedLanguages: 'en,de,es,pt,fr,it,ru,zh-CN,ja,ar,tr,nl,pl,sv,no,da,fi,cs,ro,hu,el',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false
                }, 'google_translate_element');
              }
            `,
          }}
        />
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
