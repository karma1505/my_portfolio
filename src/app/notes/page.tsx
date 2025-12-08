"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import WindowWrapper from "@/components/WindowWrapper";
import { useWindowContext } from "@/contexts/WindowContext";

export default function Notes() {
  const { isWindowMinimized, minimizeWindow, restoreWindow, windowStates } = useWindowContext();
  const windowId = "notes";
  const isMinimized = isWindowMinimized(windowId);
  const projects = [
    {
      title: "PitStop",
      desc: `An automotive software suite for dealerships and garages to manage their business.`,
      highlights: [
        " Dealer Management System",
        " Garage Management System",
        " Inventory Management System",
        " Spare Parts Management System",
        " All in the palm of your hands",
      ],
      img: "/icons/pitstop.png",
      link: "",
      tags: ["React Native", "Spring Boot", "PostgreSQL"],
    },
    {
      title: "Dilli House",
      desc: `A landing page for a resort in the footsteps of The Himalays`,
      highlights: [
        " SEO Friendly",
        " Uses Framer Motion for smooth transitions and animations",
        " Premium, Simplistic Design",
      ],
      img: "/icons/dillihouse.png",
      link: "https://dillihouse.com",
      tags: ["NextJS", "ReactJS", "Framer Motion"],
    },
    {
      title: "JustHoney",
      desc: `An ecommerce website for an apiary out of Himachal.`,
      highlights: [
        " Built with Next JS",
        " Has a landing page with the ecommerce page for the business",
        " Has Razorpay Payments Integration",
      ],
      img: "/icons/justhoney.png",
      link: "https://justhoney.co.in",
      tags: ["NextJS", "ReactJS", "Django", "PostgreSQL"],
    },
    {
      title: "The Journal",
      desc: `A personal tech journal where I write about my development journey, ideas, and insights. A space to share knowledge and connect with the developer community.`,
      highlights: [
        " Personal tech blog and journal",
        " Clean, minimalist design",
        " Built with Next.js frontend",
        " FastAPI backend for content management",
        " Supabase for database and bucket storage",
      ],
      img: "/icons/journal.png",
      link: "https://journal-frontend-swart.vercel.app/",
      tags: ["Next.js", "FastAPI", "Supabase"],
    },
    {
      title: "Portfolio",
      desc: `The place to know who I am and what I do. Always changing cause I believe in,
      'Even if it works, it can always be better'`,
      highlights: [
        " Built with Next.js + TailwindCSS",
        " Uses MacOS as an inspiration",
        " Functional Terminal",
      ],
      img: "/icons/portfolio.png",
      link: "https://karmanya.dev/",
      tags: ["Next.js", "TailwindCSS", "Supabase"],
    }
  ];

  const [selected, setSelected] = useState(projects[0]);

  return (
    <WindowWrapper 
      title="Project Notes" 
      width="1000px" 
      height="650px"
      isMinimized={isMinimized}
      onMinimize={() => minimizeWindow(windowId, { selected })}
    >
      <div className="flex h-full overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-gray-100 border-r border-gray-300 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">My Projects</h2>
          <ul className="space-y-3">
            {projects.map((p) => (
              <li
                key={p.title}
                onClick={() => setSelected(p)}
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition shadow ${
                  selected.title === p.title
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-200"
                }`}
              >
                <a href={p.link} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={p.img}
                    alt={p.title}
                    width={28}
                    height={28}
                    className="rounded cursor-pointer hover:opacity-90 transition"
                  />
                </a>
                <span className="text-sm font-medium">{p.title}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-4">{selected.title}</h1>
          <p className="text-gray-700 mb-4 whitespace-pre-line">
            {selected.desc}
          </p>

          {/* Screenshot */}
          <div className="bg-gray-100 rounded-lg shadow-md p-4 mb-6">
            <a href={selected.link} target="_blank" rel="noopener noreferrer">
              <Image
                src={selected.img}
                alt={selected.title}
                width={600}
                height={300}
                className="rounded-lg object-contain mx-auto cursor-pointer hover:opacity-90 transition"
              />
            </a>
          </div>

          {/* Highlights */}
          <ul className="list-disc list-inside mb-6 space-y-1 text-gray-600">
            {selected.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>

          {/* Footer: tags + action */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-gray-50 shadow-inner">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {selected.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full 
                             bg-blue-100 text-blue-700 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Visit Project Button (hidden for PitStop app) */}
            {selected.title !== "PitStop" && (
              <a
                href={selected.link}
                target="_blank"
                className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 
                           text-white font-medium shadow-md transition"
              >
                🔗 View Project
              </a>
            )}
          </div>
        </div>
      </div>
    </WindowWrapper>
  );
}