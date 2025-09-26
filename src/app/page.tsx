// app/page.tsx
"use client";

import Link from "next/link";
import { BiPlay } from "react-icons/bi";

export default function Home() {
  return (
    <div>
      <div
        className="max-h-[1000px] bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: "url('/hero-img.png')",
        }}
      >
        {/* Glowing Orbs Animation */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div 
            className="absolute w-32 h-32 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 50%, transparent 70%)',
              top: '15%',
              right: '5%',
              animation: 'float1 8s ease-in-out infinite',
              opacity: 0.6,
            }}
          />
          <div 
            className="absolute w-24 h-24 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 50%, transparent 70%)',
              top: '45%',
              right: '15%',
              animation: 'float2 10s ease-in-out infinite',
              opacity: 0.7,
            }}
          />
          <div 
            className="absolute w-40 h-40 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 50%, transparent 70%)',
              top: '70%',
              right: '8%',
              animation: 'float3 12s ease-in-out infinite',
              opacity: 0.5,
            }}
          />
          <div 
            className="absolute w-20 h-20 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 50%, transparent 70%)',
              top: '30%',
              right: '25%',
              animation: 'float4 9s ease-in-out infinite',
              opacity: 0.8,
            }}
          />
        </div>
        {/* Hero */}
        <div className="max-w-5xl mx-auto text-left py-40 relative">
          <div className="max-w-xl pb-20 text-gray-700" data-aos="fade-up">
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
                <button className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-medium transition-colors">
                  Create a <strong>free</strong> memorial
                </button>
              </Link>

              <Link href="/explore" className="inline-block">
                <button 
                  className="text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors hover:bg-white/12 border border-black/10"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.08)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  View Memorials
                </button>
              </Link>
            </div>
          </div>
          <div 
            className="absolute bottom-[-130px] right-0 left-0 shadow-lg text-center p-20 items-center justify-center z-30 max-w-5xl mx-auto rounded-3xl"
            style={{
              backgroundColor: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(20px)'
            }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h3 className="mb-6 text-xl">Those remembered in love are never truly gone.</h3>
            <button className="text-gray-800 items-center gap-2 px-6 py-3 rounded-lg hover:bg-gray-700 hover:text-white font-medium text-sm transition-colors border border-black/10" 
            style={{
              backdropFilter: 'blur(10px)'
            }}
            >
              <BiPlay className="w-6 h-6 inline-block" />
              Why we created Lembra</button>
          </div>
        </div>
      </div>
      <section className="relative py-20 z-10 pt-40">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center min-h-[400px]">
            <div className="flex flex-col justify-center" data-aos="fade-right">
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
                className="absolute w-full max-w-[800px] top-32 mt-0"
                data-aos="fade-up"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="relative py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center min-h-[400px]">
            <div data-aos="fade-right">
              <img
                src="/theme.png"
                alt="Bringing loved ones together"
                className=" w-full max-w-[800px]"
              />
            </div>
            <div className="flex flex-col justify-center" data-aos="fade-left">
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
                a memorial page - it's a representation of who they were in
                life.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="relative py-20 bg-[#F3F9FF]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center min-h-[400px]">
            <div className="flex flex-col justify-center" data-aos="fade-right">
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
            <div data-aos="fade-left">
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
            <div data-aos="fade-right">
              <img
                src="/modal.png"
                alt="Bringing loved ones together"
                className=" w-full max-w-[800px]"
              />
            </div>
            <div className="flex flex-col justify-center" data-aos="fade-left">
              <h3 className="text-1xl font-bold">Utilize our tools</h3>
              <h2 className="text-2xl font-bold mb-4">
                A simple and easy to use experience with AI
              </h2>
              <p>
                Our advanced AI tools will help you craft the eulogy you are
                looking for when you can't find the right words. Restore photos
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
            <div className="flex flex-col justify-center" data-aos="fade-right">
              <h3 className="text-1xl font-bold">Contribution and delivery</h3>
              <h2 className="text-2xl font-bold mb-4">
                Notify your friends and family seamlessly and gently
              </h2>
              <p>
                Today, there are countless social media platforms, and managing
                them all can be overwhelming — posting updates, responding to
                comments, and deciding on next steps. With Lembra, you can
                notify everyone from one place and manage all responses directly
                from your dashboard. It's one less thing to worry about. Lembra
                becomes the central hub where everyone can contribute and help
                move the process forward.
              </p>
            </div>
            <div data-aos="fade-left">
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
