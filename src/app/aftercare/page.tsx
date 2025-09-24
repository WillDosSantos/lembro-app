'use client';

import Link from 'next/link';

export default function AftercarePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Emotional Support & Services</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 mb-8">
            We understand that losing a loved one is one of life's most difficult experiences. 
            Our emotional support and services are designed to help you and your family navigate 
            through grief and find comfort during this challenging time.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Grief Counseling</h2>
              <p className="text-gray-600 mb-4">
                Professional grief counselors are available to help you process your emotions 
                and develop healthy coping strategies.
              </p>
              <Link 
                href="/explore" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Find Counselors
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Support Groups</h2>
              <p className="text-gray-600 mb-4">
                Connect with others who are experiencing similar loss through our online 
                and in-person support groups.
              </p>
              <Link 
                href="/explore" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Join Groups
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Memorial Planning</h2>
              <p className="text-gray-600 mb-4">
                Get assistance with planning memorial services, celebrations of life, 
                and other commemorative events.
              </p>
              <Link 
                href="/create" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Plan Memorial
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Resources</h2>
              <p className="text-gray-600 mb-4">
                Access helpful articles, books, and other resources to support your 
                grief journey and healing process.
              </p>
              <Link 
                href="/explore" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Browse Resources
              </Link>
            </div>
          </div>

          <div className="bg-blue-50 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Need Immediate Support?</h2>
            <p className="text-gray-600 mb-6">
              If you're experiencing a crisis or need immediate emotional support, 
              please reach out to these 24/7 helplines:
            </p>
            <div className="space-y-2 text-lg">
              <p><strong>National Suicide Prevention Lifeline:</strong> 988</p>
              <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
              <p><strong>GriefShare:</strong> 1-800-395-5755</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
