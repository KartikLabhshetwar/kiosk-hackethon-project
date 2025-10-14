"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Card from "@/components/card2";
import { useRouter } from "next/navigation";
import { getCelebrities } from "@/lib/api/services";

export default function EvolStudioLanding() {
  const router = useRouter();
  const [celebrities, setCelebrities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const leftImages = [
    "/jewel1.png",
    "/jewel2.png",
    "/jewel3.png",
    "/jewel4.png",
  ];

  const rightImages = [
    "/jewel1.png",
    "/jewel2.png",
    "/jewel3.png",
    "/jewel4.png",
  ];

  // Load celebrities from backend
  useEffect(() => {
    const loadCelebrities = async () => {
      try {
        setLoading(true);
        const celebList = await getCelebrities();
        setCelebrities(celebList);
        setError(null);
      } catch (err) {
        console.error('Failed to load celebrities:', err);
        setError('Failed to load celebrities. Please try again.');
        // Fallback to static data
        setCelebrities([
          "alia bhatt",
          "anushka sharma", 
          "deepika padukone",
          "katrina kaif",
          "kareena kapoor",
          "kangana ranaut"
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCelebrities();
  }, []);

  return (
    <div className="w-full">
      <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center overflow-hidden">
        <div className="flex w-full h-screen">
          {/* Left Marquee Column */}
          <div className="w-[300px] relative overflow-hidden">
            <div className="marquee-container-up bg-white p-4 border-r-2 border-[#BA9456]">
              {leftImages.map((img, idx) => (
                <div key={idx} className="marquee-item">
                  <img
                    src={img}
                    alt={`Jewelry ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {leftImages.map((img, idx) => (
                <div key={`copy-${idx}`} className="marquee-item">
                  <img
                    src={img}
                    alt={`Jewelry ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Center Content */}
          {/* Center Content */}
          <div className="flex-1 flex items-center justify-center ">
            <div className=" w-full text-center">
              {/* Logo */}
              <div>
                <div className="mb-6">
                                <Image
                                  src="/evollogo.png"
                                  alt="Evol Studio Logo"
                                  width={150}
                                  height={70}
                                  className="mx-auto"
                                />
                              </div>
              </div>

              {/* Heading */}
              <h1 className="text-4xl playfair  mb-4">
                Let's find the Perfect jewelry for you!
              </h1>

              {/* Question */}
              <h2 className="text-4xl h-15 w-full bg-white text-[#BA9456] jakarta font-medium mb-4 flex items-center justify-center">
                What Vibe are you looking for ?
              </h2>

              {/* Cards Grid */}
            <div className="flex justify-center items-center mb-4">
                {loading ? (
                  <div className="text-center">
                    <div className="text-2xl text-[#BA9456] mb-4">Loading celebrities...</div>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BA9456] mx-auto"></div>
                  </div>
                ) : error ? (
                  <div className="text-center">
                    <div className="text-xl text-red-600 mb-4">{error}</div>
                    <div className="text-lg text-gray-600">Using fallback data</div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 items-center">
                    <div className="flex gap-6">
                      {celebrities.slice(0, 4).map((celebrity, index) => {
                        const celebName = celebrity.replace(/\s+/g, '').toLowerCase();
                        const imageMap: { [key: string]: string } = {
                          'aliabhatt': '/celebs/aliabhatt.jpg',
                          'anushkasharma': '/celebs/anushka.jpg',
                          'deepikapadukone': '/celebs/deepika.jpg',
                          'katrinakaif': '/celebs/katrina.jpg',
                          'kareenakapoor': '/celebs/kareena.png',
                          'kanganaranaut': '/celebs/kangana.jpg',
                          'priyankachopra': '/celebs/priyanka.jpg',
                          'sonamkapoor': '/celebs/sonam.jpg'
                        };
                        const image = imageMap[celebName] || '/celebs/aliabhatt.jpg';
                        const displayName = celebrity.split(' ').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ');
                        
                        return (
                          <Card 
                            key={celebrity} 
                            image={image} 
                            title={displayName} 
                            alt={`${displayName} style`} 
                          />
                        );
                      })}
                    </div>

                    {celebrities.length > 4 && (
                      <div className="flex gap-6">
                        {celebrities.slice(4, 6).map((celebrity) => {
                          const celebName = celebrity.replace(/\s+/g, '').toLowerCase();
                          const imageMap: { [key: string]: string } = {
                            'aliabhatt': '/celebs/aliabhatt.jpg',
                            'anushkasharma': '/celebs/anushka.jpg',
                            'deepikapadukone': '/celebs/deepika.jpg',
                            'katrinakaif': '/celebs/katrina.jpg',
                            'kareenakapoor': '/celebs/kareena.png',
                            'kanganaranaut': '/celebs/kangana.jpg',
                            'priyankachopra': '/celebs/priyanka.jpg',
                            'sonamkapoor': '/celebs/sonam.jpg'
                          };
                          const image = imageMap[celebName] || '/celebs/aliabhatt.jpg';
                          const displayName = celebrity.split(' ').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ');
                          
                          return (
                            <Card 
                              key={celebrity} 
                              image={image} 
                              title={displayName} 
                              alt={`${displayName} style`} 
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
            </div>


              {/* Navigation Buttons */}
              <div className="flex items-center justify-center gap-50">
                <button onClick={()=>router.push("/")} className="px-12 py-2 text-xl font-semibold bg-white border-2 border-[#BA9456] text-[#BA9456] rounded-full hover:scale-105 transition-transform duration-500 ">
                  Back
                </button>
                <div className="text-lg border-2 bg-white border-[#BA9456] px-12 py-3 rounded-3xl">
                  Step <span className="font-semibold">1</span> of{" "}
                  <span className="font-semibold">6</span>
                </div>
                 <button onClick={()=>router.push("/celeb-wear")} className="px-12 py-2 text-xl font-semibold bg-white border-2 border-[#BA9456] text-[#BA9456] rounded-full hover:scale-105 transition-transform duration-500 ">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Right Marquee Column */}
          <div className="w-[300px] relative overflow-hidden">
            <div className="marquee-container-down  bg-white p-4 border-l-2 border-[#BA9456]">
              {rightImages.map((img, idx) => (
                <div key={idx} className="marquee-item">
                  <img
                    src={img}
                    alt={`Jewelry ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {rightImages.map((img, idx) => (
                <div key={`copy-${idx}`} className="marquee-item">
                  <img
                    src={img}
                    alt={`Jewelry ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
