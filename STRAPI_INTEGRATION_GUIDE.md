# Connecting Next.js to Strapi CMS

After you've set up Strapi following STRAPI_SETUP_GUIDE.md, follow these steps to connect your website.

## 🔗 Part 1: Install Dependencies

```bash
cd "/Users/yoryosstyl/Documents/Projects/Projects (active)/CforC/Website"

# Install the Strapi client
npm install axios
```

---

## 📁 Part 2: Create API Helper

Create a new file: `lib/strapi.ts`

```typescript
// lib/strapi.ts
import axios from 'axios'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'

export const strapi = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Fetch Open Calls
export async function getOpenCalls() {
  try {
    const response = await strapi.get('/open-calls?populate=*&sort=deadline:desc')
    return response.data.data
  } catch (error) {
    console.error('Error fetching open calls:', error)
    return []
  }
}

// Fetch Members
export async function getMembers() {
  try {
    const response = await strapi.get('/members?populate=*')
    return response.data.data
  } catch (error) {
    console.error('Error fetching members:', error)
    return []
  }
}

// Fetch Activities
export async function getActivities() {
  try {
    const response = await strapi.get('/activities?populate=*&sort=date:desc')
    return response.data.data
  } catch (error) {
    console.error('Error fetching activities:', error)
    return []
  }
}
```

---

## 🔧 Part 3: Update Components to Use Strapi

### Update ActivitiesSection.tsx

Replace the hardcoded activities array with Strapi data:

```typescript
// components/ActivitiesSection.tsx
'use client'

import { useState, useEffect } from 'react'
import { getActivities } from '@/lib/strapi'

export default function ActivitiesSection() {
  const [activities, setActivities] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchActivities() {
      const data = await getActivities()
      setActivities(data)
      setLoading(false)
    }
    fetchActivities()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activities.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activities.length) % activities.length)
  }

  if (loading) {
    return <div className="py-24 text-center">Loading activities...</div>
  }

  if (activities.length === 0) {
    return <div className="py-24 text-center">No activities found.</div>
  }

  return (
    <section id="activities" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-coral text-sm font-medium mb-2">ΠΡΟΣΦΑΤΕΣ ΔΡΑΣΤΗΡΙΟΤΗΤΕΣ</p>
            <h2 className="text-4xl md:text-5xl font-bold">
              ΔΡΑΣΤΗΡΙΟΤΗΤΕΣ ΤΟΥ CULTURE<br />
              FOR CHANGE
            </h2>
          </div>
          <button className="hidden md:block bg-coral text-white px-6 py-3 rounded-full font-medium hover:bg-coral-dark transition-colors">
            ΟΛΕΣ ΟΙ ΔΡΑΣΤΗΡΙΟΤΗΤΕΣ
          </button>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {activities.map((activity: any, index: number) => (
                <div key={activity.id} className="w-full flex-shrink-0 px-2">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Show 3 cards, cycling through */}
                    {[0, 1, 2].map((offset) => {
                      const cardIndex = (index + offset) % activities.length
                      const card = activities[cardIndex]
                      const imageUrl = card.attributes.image?.data?.attributes?.url

                      return (
                        <div
                          key={card.id}
                          className={`bg-white border-2 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                            card.attributes.featured ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          {imageUrl && (
                            <div className="aspect-video bg-gray-200">
                              <img
                                src={`http://localhost:1337${imageUrl}`}
                                alt={card.attributes.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          <div className="p-6">
                            <div className="mb-4">
                              <span className="inline-block bg-gray-100 px-4 py-1 rounded-full text-sm font-medium">
                                {new Date(card.attributes.date).toLocaleDateString('el-GR')}
                              </span>
                            </div>

                            <h3 className="text-lg font-bold mb-4 line-clamp-3">
                              {card.attributes.title}
                            </h3>

                            <div className="flex items-center text-sm text-gray-600">
                              <span>{card.attributes.organization}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border-2 border-charcoal flex items-center justify-center hover:bg-charcoal hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2">
              {activities.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-coral' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border-2 border-charcoal flex items-center justify-center hover:bg-charcoal hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <button className="md:hidden w-full mt-8 bg-coral text-white px-6 py-3 rounded-full font-medium">
          ΟΛΕΣ ΟΙ ΔΡΑΣΤΗΡΙΟΤΗΤΕΣ
        </button>
      </div>
    </section>
  )
}
```

---

## 🌍 Part 4: Environment Variables

Create `.env.local` file in your project root:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

For production (Vercel), you'll set this to your cloud Strapi URL.

---

## 🧪 Part 5: Test the Integration

1. **Make sure Strapi is running:**
   ```bash
   cd cms
   npm run develop
   ```

2. **Run your Next.js site:**
   ```bash
   cd ..
   npm run dev
   ```

3. **Visit:** http://localhost:3000

You should now see activities from Strapi! ✅

---

## 📤 Part 6: Deploy Strapi (Later)

When ready to deploy:

**Option A: Railway (Easiest)**
- Free $5/month credit
- One-click Strapi deployment
- https://railway.app

**Option B: Render (Free tier)**
- 750 hours/month free
- https://render.com

**Option C: DigitalOcean**
- $6/month droplet
- Full control

I can help you deploy when you're ready!

---

## 🎉 What You've Achieved

✅ **Content managers can now:**
- Log into Strapi admin
- Add/edit/delete Open Calls, Members, Activities
- Upload images
- Publish changes instantly

✅ **Website automatically:**
- Fetches latest content from Strapi
- Shows updated content in real-time
- No code changes needed

✅ **You have:**
- Separation of content and code
- Easy content management
- Scalable CMS solution

---

## 🆘 Need Help?

Run into issues? Let me know and I'll help troubleshoot!

**Common issues:**
- "Can't connect to Strapi" → Make sure Strapi is running (`npm run develop` in cms folder)
- "Images not showing" → Check image URLs and CORS settings
- "No data showing" → Verify API permissions in Strapi Settings → Roles → Public
