# Internationalization (i18n) Setup Guide

This document describes the internationalization setup for the Culture for Change website.

## Overview

The website supports two languages:
- **Greek (el)** - Default language
- **English (en)** - Secondary language

## Technical Stack

- **next-intl** - Internationalization framework for Next.js 13+ App Router
- **Strapi i18n Plugin** - For managing dynamic content translations in Strapi CMS

## URL Structure

The website uses locale-based routing:
- Greek: `https://example.com/el/...`
- English: `https://example.com/en/...`
- Root redirect: `https://example.com/` → `https://example.com/el`

## File Structure

```
├── app/
│   ├── [locale]/          # Locale-specific routes
│   │   ├── layout.tsx     # Locale layout with NextIntlClientProvider
│   │   ├── page.tsx       # Homepage
│   │   ├── about/
│   │   ├── activities/
│   │   ├── members/
│   │   └── ...
│   └── layout.tsx         # Root layout (minimal)
├── messages/
│   ├── el.json            # Greek translations
│   └── en.json            # English translations
├── i18n.ts                # i18n configuration
└── middleware.ts          # Locale detection and routing
```

## Configuration Files

### `i18n.ts`
Configures supported locales and loads translation messages:
```typescript
export const locales = ['en', 'el'] as const;
export type Locale = (typeof locales)[number];
```

### `middleware.ts`
Handles automatic locale detection and routing:
- Detects user's preferred language from browser settings
- Redirects root URL to default locale
- Sets `NEXT_LOCALE` cookie for persistence

### Translation Files

Located in `messages/` directory:
- `el.json` - Greek translations
- `en.json` - English translations

Structure:
```json
{
  "navigation": {
    "home": "HOME",
    "about": "ABOUT US",
    ...
  },
  "footer": {...},
  "home": {...},
  ...
}
```

## Using Translations in Components

### Client Components

```typescript
'use client'

import { useLocale, useTranslations } from 'next-intl';

export default function MyComponent() {
  const locale = useLocale(); // Get current locale: 'el' or 'en'
  const t = useTranslations('navigation'); // Load translation namespace

  return (
    <div>
      <Link href={`/${locale}/about`}>{t('about')}</Link>
    </div>
  );
}
```

### Server Components

```typescript
import { getTranslations } from 'next-intl/server';

export default async function MyServerComponent() {
  const t = await getTranslations('navigation');

  return <h1>{t('home')}</h1>;
}
```

## Language Switcher

The Navigation component includes a language switcher button:
- Desktop: Shows "EN" or "ΕΛ" based on current language
- Mobile: Shows full language names "English (EN)" or "Ελληνικά (ΕΛ)"
- Preserves current page path when switching languages

## Strapi CMS Internationalization

### Enabling i18n in Strapi

1. **Install i18n Plugin** (should already be installed in Strapi v5):
   ```bash
   npm install @strapi/plugin-i18n
   ```

2. **Configure Locales in Strapi Admin**:
   - Go to Settings → Internationalization
   - Add locales: Greek (el) and English (en-US or en)
   - Set Greek as default locale

3. **Enable i18n for Content Types**:

   For each content type (Members, Activities, Open Calls):

   a. Go to Content-Type Builder
   b. Edit the content type
   c. Click "Advanced Settings"
   d. Enable "Internationalization"
   e. Save

4. **Add Translations**:
   - When editing content, you'll see a locale dropdown
   - Create English versions by:
     - Selecting the Greek entry
     - Click "Create new locale"
     - Select English
     - Fill in English translations

### Fetching Localized Content

Update API calls to include locale parameter:

```typescript
// Before
const response = await fetch(
  `${STRAPI_URL}/api/members?populate=*`
);

// After
const response = await fetch(
  `${STRAPI_URL}/api/members?populate=*&locale=${locale}`
);
```

### Example: Members Page with i18n

```typescript
'use client'

import { useLocale } from 'next-intl';

export default function MembersPage() {
  const locale = useLocale();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/members?populate=*&locale=${locale}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      setMembers(data.data);
    }
    fetchMembers();
  }, [locale]); // Re-fetch when locale changes

  return (
    // ...render members
  );
}
```

## Testing

### Local Development
```bash
npm run dev
```

Visit:
- http://localhost:3000 → redirects to /el
- http://localhost:3000/el → Greek version
- http://localhost:3000/en → English version

### Production Build
```bash
npm run build
npm start
```

## Troubleshooting

### 404 Errors on Locale Routes

If `/el` or `/en` routes return 404:

1. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Check middleware matcher**:
   Ensure `middleware.ts` has correct matcher pattern

3. **Verify locale layout**:
   Check that `app/[locale]/layout.tsx` properly awaits params

4. **Try production build**:
   Development server sometimes has caching issues that don't occur in production

### Missing Translations

If translations don't appear:

1. Check translation key exists in both `el.json` and `en.json`
2. Verify namespace name matches in `useTranslations('namespace')`
3. Check browser console for translation errors

### Strapi Content Not Localizing

1. Verify i18n is enabled for the content type
2. Check API call includes `locale=${locale}` parameter
3. Ensure content has translations in Strapi admin
4. Check Strapi locale codes match (`el` not `el-GR`)

## Best Practices

1. **Keep translation files organized by feature/page**
2. **Use meaningful translation keys** (not just sequential numbers)
3. **Always provide fallbacks** for missing translations
4. **Test both languages** before deploying
5. **Use `locale` parameter** in all Strapi API calls
6. **Translate all user-facing text** including:
   - Navigation labels
   - Button text
   - Form labels and placeholders
   - Error messages
   - Meta descriptions

## Future Enhancements

- Add more languages (e.g., French, German)
- Implement locale-specific date/number formatting
- Add language detection based on geographic location
- Create translation management workflow for content editors
- Add SEO metadata translations
- Implement language-specific sitemaps

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Strapi i18n Plugin](https://docs.strapi.io/dev-docs/plugins/i18n)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
