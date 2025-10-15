"use client";
import Image from "next/image";
import React from "react";
import Card from "@/components/card";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/lib/context";

export default function OccasionPage() {
  const router = useRouter();
  const { setOccasion } = usePreferences();

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
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full text-center">
              {/* Logo */}
              <div className="mb-6">
                <Image
                  src="/evollogo.png"
                  alt="Evol Studio Logo"
                  width={150}
                  height={60}
                  className="mx-auto"
                />
              </div>

              {/* Heading */}
              <h1 className="text-4xl playfair mb-4">
                Let's find the Perfect jewelry for you!
              </h1>

              {/* Question */}
              <h2 className="text-4xl h-15 w-full bg-white text-[#BA9456] jakarta font-medium mb-4 flex items-center justify-center">
                What's the occasion?
              </h2>

              {/* Cards Grid */}
              <div className="flex justify-center items-center mb-4">
                <div className="grid grid-cols-2 gap-6">
                  <div onClick={() => { setOccasion("wedding"); router.push("/budget"); }}>
                    <Card
                      image="/occasion/wedding.png"
                      title="Wedding"
                      alt="Wedding rings"
                    />
                  </div>
                  <div onClick={() => { setOccasion("engagement"); router.push("/budget"); }}>
                    <Card
                      image="/occasion/engagement.png"
                      title="Engagement"
                      alt="Engagement ring"
                    />
                  </div>
                  <div onClick={() => { setOccasion("casual"); router.push("/budget"); }}>
                    <Card
                      image="/occasion/casual.png"
                      title="Casual"
                      alt="Casual jewelry"
                    />
                  </div>
                  <div onClick={() => { setOccasion("party"); router.push("/budget"); }}>
                    <Card image="/occasion/party.png" title="Party" alt="Party jewelry" />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-center gap-50">
                <button 
                  onClick={() => router.push("/")} 
                  className="px-12 py-2 text-xl font-semibold bg-white border-2 border-[#BA9456] text-[#BA9456] rounded-full hover:scale-105 transition-transform duration-500">
                  Back
                </button>
                <div className="text-lg border-2 bg-white border-[#BA9456] px-12 py-3 rounded-3xl">
                  Step <span className="font-semibold">1</span> of{" "}
                  <span className="font-semibold">5</span>
                </div>
                <button 
                  onClick={() => router.push("/budget")} 
                  className="px-12 py-2 text-xl font-semibold bg-white border-2 border-[#BA9456] text-[#BA9456] rounded-full hover:scale-105 transition-transform duration-500">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Right Marquee Column */}
          <div className="w-[300px] relative overflow-hidden">
            <div className="marquee-container-down bg-white p-4 border-l-2 border-[#BA9456]">
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