"use client";
import Image from "next/image";
import React, { useState } from "react";
import Card from "@/components/card";
import { useRouter } from "next/navigation";
import { searchByVibe } from "@/lib/api/services";

export default function EvolStudioLanding() {
  const router = useRouter();
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
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

  const occasions = [
    { id: 'wedding', title: 'Wedding', image: '/occasion/wedding.png', alt: 'Wedding rings' },
    { id: 'engagement', title: 'Engagement', image: '/occasion/engagement.png', alt: 'Engagement ring' },
    { id: 'casual', title: 'Casual', image: '/occasion/casual.png', alt: 'Casual jewelry' },
    { id: 'party', title: 'Party', image: '/occasion/party.png', alt: 'Party jewelry' }
  ];

  const handleOccasionSelect = async (occasionId: string) => {
    setSelectedOccasion(occasionId);
    setIsLoading(true);
    console.log('Selected occasion:', occasionId);
    
    // Get occasion-based recommendations from backend
    try {
      // Map occasions to vibes for backend search
      const occasionToVibeMap: { [key: string]: string } = {
        'wedding': 'elegant',
        'engagement': 'romantic', 
        'casual': 'minimalist',
        'party': 'glamorous'
      };
      
      const vibe = occasionToVibeMap[occasionId];
      if (vibe) {
        const recommendations = await searchByVibe({
          vibe: vibe,
          top_k: 5
        });
        console.log('Occasion-based recommendations:', recommendations);
        // Store recommendations for later use
        localStorage.setItem('occasionRecommendations', JSON.stringify(recommendations));
      }
    } catch (error) {
      console.error('Failed to get occasion-based recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (selectedOccasion) {
      // Store the selected occasion in localStorage or context for later use
      localStorage.setItem('selectedOccasion', selectedOccasion);
      router.push('/budget');
    } else {
      alert('Please select an occasion first!');
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
                What's the occasion?
              </h2>
              
              {/* Selection Feedback */}
              {selectedOccasion && (
                <div className="mb-4 text-center">
                  <p className="text-lg text-[#BA9456] font-medium">
                    Great choice! {occasions.find(o => o.id === selectedOccasion)?.title} jewelry selected
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
                <div className="grid grid-cols-2 gap-6">
                  {occasions.map((occasion) => (
                    <Card
                      key={occasion.id}
                      image={occasion.image}
                      title={occasion.title}
                      alt={occasion.alt}
                      onClick={() => handleOccasionSelect(occasion.id)}
                      isSelected={selectedOccasion === occasion.id}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-center gap-50">
                <button onClick={()=>router.push("/")} className="px-12 py-2 text-xl font-semibold bg-white border-2 border-[#BA9456] text-[#BA9456] rounded-full hover:scale-105 transition-transform duration-500 ">
                  Back
                </button>
                <div className="text-lg border-2 bg-white border-[#BA9456] px-12 py-3 rounded-3xl">
                  Step <span className="font-semibold">2</span> of{" "}
                  <span className="font-semibold">6</span>
                </div>
                 <button 
                   onClick={handleNext}
                   className={`px-12 py-2 text-xl font-semibold border-2 rounded-full hover:scale-105 transition-transform duration-500 ${
                     selectedOccasion 
                       ? 'bg-[#BA9456] text-white border-[#BA9456]' 
                       : 'bg-white text-[#BA9456] border-[#BA9456] opacity-50 cursor-not-allowed'
                   }`}
                   disabled={!selectedOccasion}
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
