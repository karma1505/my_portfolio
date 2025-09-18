"use client";
import { useState, useEffect } from "react";
import WindowWrapper from "@/components/WindowWrapper";
import { Github, Linkedin, Mail, Download } from "lucide-react";
import { useWindowContext } from "@/contexts/WindowContext";

export default function About() {
  const { isWindowMinimized, minimizeWindow, restoreWindow, windowStates } = useWindowContext();
  const windowId = "about";
  const isMinimized = isWindowMinimized(windowId);

  return (
    <WindowWrapper 
      title="About Me"
      isMinimized={isMinimized}
      onMinimize={() => minimizeWindow(windowId)}
    >
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 text-center text-gray-700">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
          👨‍💻 Karmanya Singh
        </h1>

        <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-6">
          Hey there👋 I'm <span className="font-semibold">Karmanya</span>.  
          I am an SDE-1 and love to make new stuff. Currently I'm building an automotive software suite called PitStop.
          I specialize in building software that makes an impact and exploring the intersection of  
          <span className="font-semibold"> technology</span> and <span className="font-semibold"> creativity</span>.
        </p>

        <div className="text-xs sm:text-sm md:text-base leading-relaxed mb-8 text-gray-600">
          <p>
            If you don't see me coding, I'm probably working on the following in an endless cycle:
          </p>
          <ul className="list-disc list-inside text-center mt-2 space-y-1">
            <li>Working on PitStop</li>
            <li>Grinding LeetCode for practice</li>
            <li>Or maybe on the track 🏎️</li>
          </ul>
        </div>

        {/* Socials + Resume */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto">
          <a
            href="https://www.linkedin.com/in/karmanyasingh/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 rounded-lg border bg-gray-50 hover:bg-gray-100 transition p-3 text-sm font-medium"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
            LinkedIn
          </a>

          {/* Resume download */}
          <button
            onClick={async () => {
              try {
                const path = "/KarmanyaSingh_SDE1%20.pdf";
                const filename = "KarmanyaSingh_SDE1 .pdf";
                const head = await fetch(path, { method: "HEAD" });
                if (!head.ok) throw new Error("Resume not found");
                const link = document.createElement("a");
                link.href = path;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } catch (e) {
                console.error(e);
              }
            }}
            className="group flex items-center justify-center gap-2 rounded-lg border bg-gray-50 hover:bg-gray-100 transition p-3 text-sm font-medium"
            aria-label="Resume PDF"
          >
            <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
            Resume
          </button>

          <a
            href="https://github.com/karma1505"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 rounded-lg border bg-gray-50 hover:bg-gray-100 transition p-3 text-sm font-medium"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
            GitHub
          </a>

          <a
            href="mailto:karmanyasingh8@gmail.com"
            className="group flex items-center justify-center gap-2 rounded-lg border bg-gray-50 hover:bg-gray-100 transition p-3 text-sm font-medium"
            aria-label="Email"
          >
            <Mail className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
            Email
          </a>
        </div>
      </div>
    </WindowWrapper>
  );
}