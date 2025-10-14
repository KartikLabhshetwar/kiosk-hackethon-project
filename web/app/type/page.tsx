"use client";
import Image from "next/image";
import React, { useState } from "react";
import Card from "@/components/card";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/lib/context";
import { useCategories } from "@/lib/hooks";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EvolStudioLanding() {
  const router = useRouter();
  const { setCategory } = usePreferences();
  const { data: categories, isLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCategory(category);
  };

  const handleNext = () => {
    if (selectedCategory) {
      router.push("/suggestions");
    }
  };

  // Map display names to API category names
  const categoryMap: Record<string, string> = {
    "Rings": "ring",
    "Earrings": "earrings",
    "Pendants": "pendant",
    "Bracelets": "bracelet",
    "Necklaces": "necklace"
  };
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

              {/* Cards Grid */}
            <div className="flex justify-center items-center mb-4 min-h-80">
                {isLoading ? (
                  <LoadingSpinner message="Loading jewelry types..." />
                ) : (
                  <div className="flex flex-col gap-6 items-center">
                    <div className="flex gap-6">
                      <div 
                        onClick={() => handleCategorySelect(categoryMap["Rings"])}
                        className={`cursor-pointer ${selectedCategory === categoryMap["Rings"] ? "ring-4 ring-[#BA9456] rounded-2xl" : ""}`}
                      >
                        <Card image="/jewel-types/ring.png" title="Rings" alt="Rings" />
                      </div>
                      <div 
                        onClick={() => handleCategorySelect(categoryMap["Earrings"])}
                        className={`cursor-pointer ${selectedCategory === categoryMap["Earrings"] ? "ring-4 ring-[#BA9456] rounded-2xl" : ""}`}
                      >
                        <Card image="/jewel-types/earrings.png" title="Earrings" alt="Earrings" />
                      </div>
                      <div 
                        onClick={() => handleCategorySelect(categoryMap["Pendants"])}
                        className={`cursor-pointer ${selectedCategory === categoryMap["Pendants"] ? "ring-4 ring-[#BA9456] rounded-2xl" : ""}`}
                      >
                        <Card image="/jewel-types/pendant.png" title="Pendants" alt="Pendants" />
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div 
                        onClick={() => handleCategorySelect(categoryMap["Bracelets"])}
                        className={`cursor-pointer ${selectedCategory === categoryMap["Bracelets"] ? "ring-4 ring-[#BA9456] rounded-2xl" : ""}`}
                      >
                        <Card image="/jewel-types/bracelets.png" title="Bracelets" alt="Bracelets" />
                      </div>
                      <div 
                        onClick={() => handleCategorySelect(categoryMap["Necklaces"])}
                        className={`cursor-pointer ${selectedCategory === categoryMap["Necklaces"] ? "ring-4 ring-[#BA9456] rounded-2xl" : ""}`}
                      >
                        <Card image="/jewel-types/necklace.png" title="Necklaces" alt="Necklaces" />
                      </div>
                    </div>
                  </div>
                )}
            </div>


              {/* Navigation Buttons */}
              <div className="flex items-center justify-center gap-50">
                <button onClick={()=>router.push("/vibe")} className="px-12 py-2 text-xl font-semibold bg-white border-2 border-[#BA9456] text-[#BA9456] rounded-full hover:scale-105 transition-transform duration-500 ">
                  Back
                </button>
                <div className="text-lg border-2 bg-white border-[#BA9456] px-12 py-3 rounded-3xl">
                  Step <span className="font-semibold">4</span> of{" "}
                  <span className="font-semibold">6</span>
                </div>
                <button 
                  onClick={handleNext}
                  disabled={!selectedCategory}
                  className={`px-12 py-2 text-xl font-semibold rounded-full transition-all duration-500 ${
                    selectedCategory 
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
