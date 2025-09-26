export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">About Lembra</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A platform born from love, loss, and the desire to preserve the beautiful memories 
            of those we hold dear.
          </p>
        </div>

        {/* CEO Message Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <img
                src="/profile-avatar.png"
                alt="William dos Santos"
                className="w-32 h-32 rounded-full object-cover shadow-lg"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">A Message from Our Founder</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Lembra was born from a deeply personal experience. When my father passed away, 
                  I realized how quickly memories can fade and how important it is to preserve 
                  the stories, photos, and moments that define who our loved ones were.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Traditional memorial services are beautiful, but they're temporary. I wanted 
                  to create something lasting—a digital space where family and friends could 
                  come together to celebrate a life, share memories, and keep those precious 
                  moments alive for generations to come.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Lembra is more than just a memorial platform; it's a way to honor the people 
                  who shaped us, to keep their stories alive, and to ensure that their legacy 
                  continues to inspire and comfort those they left behind.
                </p>
                <div className="mt-6">
                  <p className="font-semibold text-gray-800">William dos Santos</p>
                  <p className="text-gray-600">Founder & CEO, Lembra</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To provide a beautiful, accessible platform where families can create lasting 
              digital memorials that honor their loved ones and preserve their stories for 
              future generations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We believe that everyone deserves to be remembered, and every story deserves 
              to be told. Lembra makes it easy to create meaningful tributes that celebrate 
              life, love, and the connections that matter most.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700"><strong>Respect:</strong> Every life has value and every story matters</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700"><strong>Accessibility:</strong> Beautiful memorials should be available to everyone</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700"><strong>Privacy:</strong> Your memories are sacred and protected</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-gray-700"><strong>Simplicity:</strong> Creating a memorial should be easy and intuitive</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What Makes Lembra Special</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Beautiful Design</h3>
              <p className="text-gray-600">
                Create stunning memorials with our carefully crafted templates and intuitive design tools.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Always Free</h3>
              <p className="text-gray-600">
                We believe memorials should be accessible to everyone, which is why our platform is completely free.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Support</h3>
              <p className="text-gray-600">
                Connect with others who understand your journey and find comfort in shared experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-blue-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Honor Your Loved One?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create a beautiful, lasting tribute that celebrates their life and keeps their memory alive.
          </p>
          <a
            href="/create"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create a Memorial
          </a>
        </div>
      </div>
    </div>
  );
}
