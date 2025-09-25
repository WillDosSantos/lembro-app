// app/page.tsx
"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div
        className="max-h-[1000px] bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: "url('/hero-img.png')",
        }}
      >
        {/* Hero */}
        <div className="max-w-5xl mx-auto text-left py-40">
          <div className="max-w-2xl">
            <h1 className="text-4xl mb-4">
              <strong>Honor and preserve</strong> the stories of the ones we
              miss.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Use the power of AI to create a beautiful online memorial to honor
              the life and legacy of your loved ones.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/create" className="inline-block">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors">
                  Create a free memorial
                </button>
              </Link>

              <Link href="/explore" className="inline-block">
                <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors">
                  View Memorials
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <section className="relative py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center min-h-[400px]">
            <div className="flex flex-col justify-center">
              <h3 className="text-1xl font-bold">
                Bringing loved ones together
              </h3>
              <h2 className="text-2xl font-bold mb-4">
                No matter their location in the world
              </h2>
              <p>
                Not everyone can afford the time-off, travel costs, and physical
                ability to attend the wake, celebration of life, or funeral.
                Now, you can have a dedicated space of reflection and
                remembrance for anyone to join and pay their respects to the
                ones we miss.{" "}
              </p>
            </div>
            <div>
              <img
                src="/world-map.png"
                alt="Bringing loved ones together"
                className="absolute w-full max-w-[800px] top-0 mt-0"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="relative py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center min-h-[400px]">
            <div>
              <img
                src="/theme.png"
                alt="Bringing loved ones together"
                className=" w-full max-w-[800px]"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-1xl font-bold">
                Beautifully designed templates
              </h3>
              <h2 className="text-2xl font-bold mb-4">
                Choose the best layout for your loved ones memorial
              </h2>
              <p>
                Most digital memorials are dated and generic. Our custom layout
                generator allows you to choose the best layout to fit the life
                style and culture of the person it represents. This is more than
                a memorial page - it’s a representation of who they were in
                life.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="relative py-20 bg-[#F3F9FF]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center min-h-[400px]">
            <div className="flex flex-col justify-center">
              <h3 className="text-1xl font-bold">We will never charge you</h3>
              <h2 className="text-2xl font-bold mb-4">
                All personal memorials are, and will remain, free
              </h2>
              <p>
                You have enough going on. This is an absolutely free tool for
                you to use during this time. We understand that there are many
                other expenses and things that you have to focus on. If you need
                extra help, visit our planning guide.
              </p>
            </div>
            <div>
              <img
                src="/free.png"
                alt="Bringing loved ones together"
                className="w-full max-w-[800px] top-0 mt-0"
              />
            </div>
          </div>
        </div>
      </section>
      <section 
        className="relative py-20 bg-cover bg-left bg-no-repeat"
        style={{
          backgroundImage: "url('/dots.png')",
          backgroundSize: "1249px auto"
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center min-h-[400px]">
            <div>
              <img
                src="/modal.png"
                alt="Bringing loved ones together"
                className=" w-full max-w-[800px]"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-1xl font-bold">Utilize our tools</h3>
              <h2 className="text-2xl font-bold mb-4">
                A simple and easy to use experience with AI
              </h2>
              <p>
                Our advanced AI tools will help you craft the eulogy you are
                looking for when you can’t find the right words. Restore photos
                to bring you right back to that moment in time to be forever
                cherished.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="relative py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center min-h-[400px]">
            <div className="flex flex-col justify-center">
              <h3 className="text-1xl font-bold">Contribution and delivery</h3>
              <h2 className="text-2xl font-bold mb-4">
                Notify your friends and family seamlessly and gently
              </h2>
              <p>
                Today, there are countless social media platforms, and managing
                them all can be overwhelming — posting updates, responding to
                comments, and deciding on next steps. With Lembra, you can
                notify everyone from one place and manage all responses directly
                from your dashboard. It’s one less thing to worry about. Lembra
                becomes the central hub where everyone can contribute and help
                move the process forward.
              </p>
            </div>
            <div>
              <img
                src="/ui.png"
                alt="Bringing loved ones together"
                className="w-full max-w-[800px] top-0 mt-0"
              />
            </div>
           </div>
         </div>
       </section>
     </div>
   );
 }
