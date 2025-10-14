"use client";
import Image from "next/image";
import React, { useState } from "react";
import Card from "@/components/card";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/lib/api/services";

export default function EvolStudioLanding() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
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

  const jewelryTypes = [
    { id: 'rings', title: 'Rings', image: '/jewel-types/ring.png', alt: 'Rings' },
    { id: 'earrings', title: 'Earrings', image: '/jewel-types/earrings.png', alt: 'Earrings' },
    { id: 'pendants', title: 'Pendants', image: '/jewel-types/pendant.png', alt: 'Pendants' },
    { id: 'bracelets', title: 'Bracelets', image: '/jewel-types/bracelets.png', alt: 'Bracelets' },
    { id: 'necklaces', title: 'Necklaces', image: '/jewel-types/necklace.png', alt: 'Necklaces' }
  ];

  const handleTypeSelect = async (typeId: string) => {
    setSelectedType(typeId);
    setIsLoading(true);
    console.log('Selected jewelry type:', typeId);
    
    // Get type-based recommendations from backend
    try {
      const recommendations = await searchProducts({
        query: typeId,
        category: typeId,
        top_k: 5
      });
      console.log('Type-based recommendations:', recommendations);
      // Store recommendations for later use
      localStorage.setItem('typeRecommendations', JSON.stringify(recommendations));
    } catch (error) {
      console.error('Failed to get type-based recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (selectedType) {
      // Store the selected type in localStorage for later use
      localStorage.setItem('selectedType', selectedType);
      router.push('/suggestions');
    } else {
      alert('Please select a jewelry type first!');
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
                What type of jewelry are you looking for ?
              </h2>
              
              {/* Selection Feedback */}
              {selectedType && (
                <div className="mb-4 text-center">
                  <p className="text-lg text-[#BA9456] font-medium">
                    Great choice! {jewelryTypes.find(t => t.id === selectedType)?.title} selected
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
                <div className="flex flex-col gap-6 items-center">
                    <div className="flex gap-6">
                      {jewelryTypes.slice(0, 3).map((type) => (
                        <Card
                          key={type.id}
                          image={type.image}
                          title={type.title}
                          alt={type.alt}
                          onClick={() => handleTypeSelect(type.id)}
                          isSelected={selectedType === type.id}
                        />
                      ))}
                    </div>

                    <div className="flex gap-6">
                      {jewelryTypes.slice(3, 5).map((type) => (
                        <Card
                          key={type.id}
                          image={type.image}
                          title={type.title}
                          alt={type.alt}
                          onClick={() => handleTypeSelect(type.id)}
                          isSelected={selectedType === type.id}
                        />
                      ))}
                    </div>
                </div>
            </div>


              {/* Navigation Buttons */}
              <div className="flex items-center justify-center gap-50">
                <button onClick={()=>router.push("/vibe")} className="px-12 py-2 text-xl font-semibold bg-white border-2 border-[#BA9456] text-[#BA9456] rounded-full hover:scale-105 transition-transform duration-500 ">
                  Back
                </button>
                <div className="text-lg border-2 bg-white border-[#BA9456] px-12 py-3 rounded-3xl">
                  Step <span className="font-semibold">2</span> of{" "}
                  <span className="font-semibold">6</span>
                </div>
                 <button 
                   onClick={handleNext}
                   className={`px-12 py-2 text-xl font-semibold border-2 rounded-full hover:scale-105 transition-transform duration-500 ${
                     selectedType 
                       ? 'bg-[#BA9456] text-white border-[#BA9456]' 
                       : 'bg-white text-[#BA9456] border-[#BA9456] opacity-50 cursor-not-allowed'
                   }`}
                   disabled={!selectedType}
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
