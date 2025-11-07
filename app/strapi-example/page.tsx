import StrapiActivitiesExample from '@/components/StrapiActivitiesExample'

export default function StrapiExamplePage() {
  return (
    <main className="min-h-screen">
      <div className="bg-charcoal text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Strapi Integration Example</h1>
          <p className="text-lg text-gray-300">
            This page demonstrates fetching activities from Strapi CMS
          </p>
        </div>
      </div>

      <StrapiActivitiesExample />
    </main>
  )
}
