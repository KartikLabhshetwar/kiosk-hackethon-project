"use client";
import Image from "next/image";
import React, { useState } from "react";
import Card from "@/components/card";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/lib/api/services";

export default function EvolStudioLanding() {
  const router = useRouter();
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
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

  const budgetOptions = [
    { id: '100k', title: 'Under ₹1,00,000', maxPrice: 100000 },
    { id: '200k', title: 'Under ₹2,00,000', maxPrice: 200000 },
    { id: '300k', title: 'Under ₹3,00,000', maxPrice: 300000 },
    { id: '400k', title: 'Under ₹4,00,000', maxPrice: 400000 }
  ];

  const handleBudgetSelect = async (budgetId: string) => {
    setSelectedBudget(budgetId);
    setIsLoading(true);
    console.log('Selected budget:', budgetId);
    
    // Get budget-based recommendations from backend
    try {
      const budgetOption = budgetOptions.find(b => b.id === budgetId);
      if (budgetOption) {
        const recommendations = await searchProducts({
          query: 'jewelry',
          max_price: budgetOption.maxPrice,
          top_k: 5
        });
        console.log('Budget-based recommendations:', recommendations);
        // Store recommendations for later use
        localStorage.setItem('budgetRecommendations', JSON.stringify(recommendations));
      }
    } catch (error) {
      console.error('Failed to get budget-based recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (selectedBudget) {
      // Store the selected budget in localStorage for later use
      localStorage.setItem('selectedBudget', selectedBudget);
      router.push('/vibe');
    } else {
      alert('Please select a budget range first!');
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
                What's your Budget / Range?
              </h2>
              
              {/* Selection Feedback */}
              {selectedBudget && (
                <div className="mb-4 text-center">
                  <p className="text-lg text-[#BA9456] font-medium">
                    Great choice! {budgetOptions.find(b => b.id === selectedBudget)?.title} selected
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
              <div className="flex justify-center items-center mb-4 min-h-80">
                <div className="grid grid-cols-2 gap-4">
                  {budgetOptions.map((budget) => (
                    <div
                      key={budget.id}
                      onClick={() => handleBudgetSelect(budget.id)}
                      className={`cursor-pointer flex flex-col items-center justify-center p-4 border-2 rounded-2xl hover:scale-105 transition-all duration-300 text-2xl font-normal ${
                        selectedBudget === budget.id
                          ? 'bg-[#BA9456] bg-opacity-10 border-[#BA9456] text-[#af894b]'
                          : 'bg-white border-[#BA9456] text-[#BA9456] hover:border-[#af894b]'
                      }`}
                    >
                      {budget.title}
                    </div>
                  ))}
                </div>
              </div>
               {/* <div>
                    <input type="range" />
                </div> */}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-center gap-50">
                <button onClick={()=>router.push("/occasion")} className="px-12 py-2 text-xl font-semibold bg-white border-2 border-[#BA9456] text-[#BA9456] rounded-full hover:scale-105 transition-transform duration-500 ">
                  Back
                </button>
                <div className="text-lg border-2 bg-white border-[#BA9456] px-12 py-3 rounded-3xl">
                  Step <span className="font-semibold">3</span> of{" "}
                  <span className="font-semibold">6</span>
                </div>
                 <button 
                   onClick={handleNext}
                   className={`px-12 py-2 text-xl font-semibold border-2 rounded-full hover:scale-105 transition-transform duration-500 ${
                     selectedBudget 
                       ? 'bg-[#BA9456] text-white border-[#BA9456]' 
                       : 'bg-white text-[#BA9456] border-[#BA9456] opacity-50 cursor-not-allowed'
                   }`}
                   disabled={!selectedBudget}
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
