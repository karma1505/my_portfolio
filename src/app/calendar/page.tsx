"use client";
import { useState, useEffect } from "react";
import WindowWrapper from "@/components/WindowWrapper";
import { useWindowContext } from "@/contexts/WindowContext";

export default function Calendar() {
  const { isWindowMinimized, minimizeWindow, restoreWindow, windowStates } = useWindowContext();
  const windowId = "calendar";
  const isMinimized = isWindowMinimized(windowId);
  const events = [
    { company: "Cyret Technologies", role: "Full Stack Developer Intern", date: "Dec 2023 – Feb 2024", color: "bg-purple-500" },
    { company: "Tradexa Technologies", role: "Backend Engineer Intern", date: "Feb 2025 – Aug 2025", color: "bg-green-500" },
  ];

  return (
    <WindowWrapper 
      title="My Work Experience" 
      width="900px" 
      height="auto"
      isMinimized={isMinimized}
      onMinimize={() => minimizeWindow(windowId)}
    >
      <div className="relative space-y-12 px-4 sm:px-6 md:px-8">
        {/* Middle Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 hidden md:block"></div>

        {events.map((event, i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? "justify-start md:justify-start" : "justify-end md:justify-end"} relative`}
          >
            <div className="relative w-full md:w-5/12">
              {/* Dot (hidden on small screens) */}
              <div
                className={`hidden md:block absolute top-5 w-4 h-4 ${event.color} rounded-full border-2 border-white ${
                  i % 2 === 0 ? "right-[-32px]" : "left-[-32px]"
                }`}
              ></div>

              {/* Card */}
              <div className="bg-gray-100 p-4 sm:p-5 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 duration-200">
                <h3 className="text-lg font-semibold text-gray-900">{event.company}</h3>
                <p className="text-sm text-gray-600">{event.role}</p>
                <p className="text-xs text-gray-500">{event.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </WindowWrapper>
  );
}