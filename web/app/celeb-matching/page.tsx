"use client";
import Image from "next/image";
import React, { useState } from "react";
import Card from "@/components/card2";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/lib/context";
import { useFormattedCelebrities } from "@/lib/hooks";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EvolStudioLanding() {
  const router = useRouter();
  const { setCelebrity } = usePreferences();
  const { data: celebrities, isLoading } = useFormattedCelebrities();
  const [selectedCeleb, setSelectedCeleb] = useState<string | null>(null);
  
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

  const handleCelebSelect = (celebId: string) => {
    setSelectedCeleb(celebId);
    setCelebrity(celebId);
  };

  const handleNext = () => {
    if (selectedCeleb) {
      router.push("/celeb-wear");
    }
  };

  // Celebrity image mapping
  const celebImageMap: Record<string, string> = {
    "alia_bhatt": "/celebs/aliabhatt.jpg",
    "anushka_sharma": "/celebs/anushka.jpg",
    "deepika_padukone": "/celebs/deepika.jpg",
    "katrina_kaif": "/celebs/katrina.jpg",
    "kareena_kapoor": "/celebs/kareena.png",
    "kangana_ranaut": "/celebs/kangana.jpg",
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
                Which Celebrity Style Inspires You?
              </h2>

              {/* Cards Grid */}
              <div className="flex justify-center items-center mb-4 min-h-80">
                {isLoading ? (
                  <LoadingSpinner message="Loading celebrities..." />
                ) : (
                  <div className="flex flex-col gap-6 items-center">
                    <div className="flex gap-6">
                      {celebrities.slice(0, 4).map((celeb) => (
                        <div 
                          key={celeb.id}
                          onClick={() => handleCelebSelect(celeb.id)}
                          className={selectedCeleb === celeb.id ? "ring-4 ring-[#BA9456] rounded-2xl" : ""}
                        >
                          <Card 
                            image={celebImageMap[celeb.id] || "/celebs/aliabhatt.jpg"} 
                            title={celeb.name.split(' ')[0]} 
                            alt={celeb.name} 
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-6">
                      {celebrities.slice(4, 6).map((celeb) => (
                        <div 
                          key={celeb.id}
                          onClick={() => handleCelebSelect(celeb.id)}
                          className={selectedCeleb === celeb.id ? "ring-4 ring-[#BA9456] rounded-2xl" : ""}
                        >
                          <Card 
                            image={celebImageMap[celeb.id] || "/celebs/aliabhatt.jpg"} 
                            title={celeb.name.split(' ')[0]} 
                            alt={celeb.name} 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-center gap-50">
                <button 
                  onClick={() => router.push("/")} 
                  className="px-12 py-2 text-xl font-semibold bg-white border-2 border-[#BA9456] text-[#BA9456] rounded-full hover:scale-105 transition-transform duration-500 "
                >
                  Back
                </button>
                <div className="text-lg border-2 bg-white border-[#BA9456] px-12 py-3 rounded-3xl">
                  Step <span className="font-semibold">1</span> of{" "}
                  <span className="font-semibold">6</span>
                </div>
                <button 
                  onClick={handleNext} 
                  disabled={!selectedCeleb}
                  className={`px-12 py-2 text-xl font-semibold rounded-full transition-all duration-500 ${
                    selectedCeleb 
                      ? "bg-white border-2 border-[#BA9456] text-[#BA9456] hover:scale-105" 
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
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
