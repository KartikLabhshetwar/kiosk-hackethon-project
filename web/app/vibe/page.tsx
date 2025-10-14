"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Card from "@/components/card";
import { useRouter } from "next/navigation";
import { getVibes, searchByVibe } from "@/lib/api/services";

export default function EvolStudioLanding() {
  const router = useRouter();
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vibes, setVibes] = useState<string[]>([]);
  const [loadingVibes, setLoadingVibes] = useState(true);
  
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

  // Load vibes from backend
  useEffect(() => {
    const loadVibes = async () => {
      try {
        setLoadingVibes(true);
        const vibeList = await getVibes();
        setVibes(vibeList);
      } catch (error) {
        console.error('Failed to load vibes:', error);
        // Fallback to static vibes
        setVibes([
          "traditional",
          "professional", 
          "festive",
          "casual",
          "vintage",
          "elegant",
          "modern",
          "bohemian"
        ]);
      } finally {
        setLoadingVibes(false);
      }
    };

    loadVibes();
  }, []);

  const handleVibeSelect = async (vibe: string) => {
    setSelectedVibe(vibe);
    setIsLoading(true);
    console.log('Selected vibe:', vibe);
    
    // Get vibe-based recommendations from backend
    try {
      const recommendations = await searchByVibe({
        vibe: vibe,
        top_k: 5
      });
      console.log('Vibe-based recommendations:', recommendations);
      // Store recommendations for later use
      localStorage.setItem('vibeRecommendations', JSON.stringify(recommendations));
    } catch (error) {
      console.error('Failed to get vibe-based recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (selectedVibe) {
      // Store the selected vibe in localStorage for later use
      localStorage.setItem('selectedVibe', selectedVibe);
      router.push('/type');
    } else {
      alert('Please select a vibe first!');
    }
  };

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
                                  height={60}
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
              
              {/* Selection Feedback */}
              {selectedVibe && (
                <div className="mb-4 text-center">
                  <p className="text-lg text-[#BA9456] font-medium">
                    Great choice! {selectedVibe.charAt(0).toUpperCase() + selectedVibe.slice(1)} vibe selected
                  </p>
                  {isLoading && (
                    <div className="mt-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#BA9456] mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-1">Finding perfect recommendations...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Cards Grid */}
            <div className="flex justify-center items-center mb-4">
                {loadingVibes ? (
                  <div className="text-center">
                    <div className="text-2xl text-[#BA9456] mb-4">Loading vibes...</div>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BA9456] mx-auto"></div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 items-center">
                    <div className="flex gap-6">
                      {vibes.slice(0, 3).map((vibe) => {
                        const vibeImageMap: { [key: string]: string } = {
                          'traditional': '/vibe/traditional.png',
                          'professional': '/vibe/professional.png',
                          'festive': '/vibe/festive.png',
                          'casual': '/vibe/casual.png',
                          'vintage': '/vibe/traditional.png',
                          'elegant': '/vibe/traditional.png',
                          'modern': '/vibe/professional.png',
                          'bohemian': '/vibe/casual.png'
                        };
                        const image = vibeImageMap[vibe] || '/vibe/traditional.png';
                        const displayName = vibe.charAt(0).toUpperCase() + vibe.slice(1);
                        
                        return (
                          <Card
                            key={vibe}
                            image={image}
                            title={displayName}
                            alt={`${displayName} vibe`}
                            onClick={() => handleVibeSelect(vibe)}
                            isSelected={selectedVibe === vibe}
                          />
                        );
                      })}
                    </div>

                    <div className="flex gap-6">
                      {vibes.slice(3, 5).map((vibe) => {
                        const vibeImageMap: { [key: string]: string } = {
                          'traditional': '/vibe/traditional.png',
                          'professional': '/vibe/professional.png',
                          'festive': '/vibe/festive.png',
                          'casual': '/vibe/casual.png',
                          'vintage': '/vibe/traditional.png',
                          'elegant': '/vibe/traditional.png',
                          'modern': '/vibe/professional.png',
                          'bohemian': '/vibe/casual.png'
                        };
                        const image = vibeImageMap[vibe] || '/vibe/traditional.png';
                        const displayName = vibe.charAt(0).toUpperCase() + vibe.slice(1);
                        
                        return (
                          <Card
                            key={vibe}
                            image={image}
                            title={displayName}
                            alt={`${displayName} vibe`}
                            onClick={() => handleVibeSelect(vibe)}
                            isSelected={selectedVibe === vibe}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
              

              {/* Navigation Buttons */}
              <div className="flex items-center justify-center gap-50">
                <button onClick={()=>router.push("/budget")} className="px-12 py-2 text-xl font-semibold bg-white border-2 border-[#BA9456] text-[#BA9456] rounded-full hover:scale-105 transition-transform duration-500 ">
                  Back
                </button>
                <div className="text-lg border-2 bg-white border-[#BA9456] px-12 py-3 rounded-3xl">
                  Step <span className="font-semibold">3</span> of{" "}
                  <span className="font-semibold">6</span>
                </div>
                 <button 
                   onClick={handleNext}
                   className={`px-12 py-2 text-xl font-semibold border-2 rounded-full hover:scale-105 transition-transform duration-500 ${
                     selectedVibe 
                       ? 'bg-[#BA9456] text-white border-[#BA9456]' 
                       : 'bg-white text-[#BA9456] border-[#BA9456] opacity-50 cursor-not-allowed'
                   }`}
                   disabled={!selectedVibe}
                 >
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
