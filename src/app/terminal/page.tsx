"use client";
import { useState, useRef, useEffect } from "react";
import WindowWrapper from "@/components/WindowWrapper";
import { useWindowContext } from "@/contexts/WindowContext";

export default function Terminal() {
  const { isWindowMinimized, minimizeWindow, windowStates } = useWindowContext();
  const windowId = "terminal";
  const isMinimized = isWindowMinimized(windowId);

  // Restore state from context when window is restored
  useEffect(() => {
    const savedState = windowStates[windowId]?.content;
    if (savedState && !isMinimized) {
      if (savedState.history) {
        // Add a new prompt line when restoring
        const newHistory = [...savedState.history, ""];
        setHistory(newHistory);
      }
      if (savedState.input) {
        setInput(savedState.input);
      }
    }
  }, [isMinimized, windowStates, windowId]);


  // Rainbow colors for ASCII art
  const rainbowColors = [
    "text-red-500",
    "text-orange-500", 
    "text-yellow-500",
    "text-green-500",
    "text-blue-500",
    "text-indigo-500",
    "text-purple-500",
    "text-pink-500",
    "text-red-400",
    "text-orange-400",
    "text-yellow-400",
    "text-green-400",
    "text-blue-400",
    "text-indigo-400",
    "text-purple-400",
    "text-pink-400"
  ];

  const asciiArtLines = [
    "╔══════════════════════════════════════════════════════════════╗",
    "║                                                              ║",
    "║    ██╗  ██╗ █████╗ ██████╗ ███╗   ███╗ █████╗                ║",
    "║    ██║ ██╔╝██╔══██╗██╔══██╗████╗ ████║██╔══██╗               ║",
    "║    █████╔╝ ███████║██████╔╝██╔████╔██║███████║               ║",
    "║    ██╔═██╗ ██╔══██║██╔══██╗██║╚██╔╝██║██╔══██║               ║",
    "║    ██║  ██╗██║  ██║██║  ██║██║ ╚═╝ ██║██║  ██║               ║",
    "║    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝               ║",
    "║                                                              ║",
    "║    Welcome to Karmanya's Terminal                            ║",
    "║    Type `help` to see available commands                     ║",
    "║                                                              ║",
    "╚══════════════════════════════════════════════════════════════╝",
    "",
  ];

  const [history, setHistory] = useState<string[]>(asciiArtLines);
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const commands: Record<string, string | string[]> = {
    help: [
      "Available commands:",
      "karma --info       → About me",
      "karma --edu        → My academic background",
      "karma --projects   → Highlighted work",
      "karma --social     → My social profiles",
      "resume | cv        → Download my resume (PDF)",
      "date               → Show current date/time",
      "time               → Show current time",
      "uptime             → Show system uptime",
      "echo               → Repeat your message",
      "enlighten          → Random tech trivia",
      "clear              → Clear screen",
      "exit               → Close terminal",
    ],
    "karma --info": "👨‍💻 Karma — Developer & Designer | Builder & Creator",
    "karma --edu": [
      "1. CS Engineering, specializing in AI & ML.",
      "2. Organized the first techfest in my university, known as GLITCH with a footfall of 6000+ students.",
      "3. Co-founded the first tech club mentoring 50+ students per year in my university, named HackHound.",
      "4. Founded a startup called Nimbus Technologies with it's product suite for automotive software.",
    ],
    "karma --projects": [
      "PitStop — Automotive software suite (React Native + Spring Boot)",
      "Dilli House — Resort landing page (Next.js + Framer Motion)",
      "JustHoney — Ecommerce site (Next.js + Razorpay)",
      "Portfolio — Personal website (Next.js + TailwindCSS + Supabase)",
    ],
    "karma --links": [
      "🔗 LinkedIn: linkedin.com/in/karmanyasingh",
      "🌐 Portfolio: portfolio-c4ovc6zif-karma1505s-projects.vercel.app/",
      "🐙 GitHub: github.com/karma1505",
    ],
    enlighten: [
      "🧠 CRDTs enable conflict-free offline edits without central coordination.",
      "💾 SQLite ships in billions of devices and is public domain.",
      "⚡ CPU cache lines are ~64 bytes on x86_64; false sharing tanks performance.",
      "🌐 Most DBs use LSM trees (e.g., RocksDB) for write-optimized storage.",
      "🛰️ NASA’s Curiosity rover runs VxWorks on a RAD750 PowerPC.",
      "📡 Ethernet’s original Xerox PARC implementation was 2.94 Mbps, not 3.",
      "🔐 Argon2 is memory-hard by design; PBKDF2 isn’t—choose wisely.",
      "📦 DNS over HTTPS hides queries from ISPs but can break enterprise tooling.",
      "🌉 TCP slow start doubles cwnd each RTT until loss; BBR uses delivery rate.",
      "🧩 Unicode normalization can make visually identical strings compare unequal.",
    ],
  };

  const promptLine = (cmd: string) =>
    `<span class="text-green-400">karma</span>@<span class="text-cyan-400">MacBook-Air</span> <span class="text-blue-400">~</span> % ${cmd}`;

  // Utility functions for dynamic date/time
  const getCurrentDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    };
    return now.toLocaleString('en-US', options);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const getSystemUptime = () => {
    const now = new Date();
    const startTime = new Date(now.getTime() - (Math.random() * 86400000 * 7)); // Random uptime up to 7 days
    const uptime = now.getTime() - startTime.getTime();
    
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${days} days, ${hours} hours, ${minutes} minutes`;
  };

  const triggerDownload = async (publicPath: string, filename: string) => {
    try {
      const head = await fetch(publicPath, { method: "HEAD" });
      if (!head.ok) throw new Error("Not found");
      const link = document.createElement("a");
      link.href = publicPath;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setHistory((prev) => [...prev, promptLine("resume"), `Downloading ${filename}...`]);
    } catch (e) {
      setHistory((prev) => [...prev, promptLine("resume"), `Resume not found. Ensure 'public/${filename}' exists and try again.`]);
    }
  };

  const handleCommand = (cmd: string) => {
    if (cmd === "clear") {
      setHistory([]);
      return;
    }
    if (cmd === "exit") {
      // Minimize the terminal window
      minimizeWindow(windowId, { history, input });
      return;
    }
    if (cmd === "date") {
      setHistory((prev) => [...prev, promptLine(cmd), getCurrentDateTime()]);
      return;
    }
    if (cmd === "time") {
      setHistory((prev) => [...prev, promptLine(cmd), getCurrentTime()]);
      return;
    }
    if (cmd === "uptime") {
      setHistory((prev) => [...prev, promptLine(cmd), `System uptime: ${getSystemUptime()}`]);
      return;
    }
    if (cmd.startsWith("echo ")) {
      setHistory((prev) => [...prev, promptLine(cmd), cmd.slice(5)]);
      return;
    }
    if (cmd === "enlighten") {
      const facts = commands.enlighten as string[];
      const random = facts[Math.floor(Math.random() * facts.length)];
      setHistory((prev) => [...prev, promptLine(cmd), random]);
      return;
    }
    if (cmd === "resume" || cmd === "cv") {
      // Attempt to download the provided resume from public
      triggerDownload("/KarmanyaSingh_SDE1%20.pdf", "KarmanyaSingh_SDE1 .pdf");
      return;
    }
    if (commands[cmd]) {
      setHistory((prev) => [
        ...prev,
        promptLine(cmd),
        ...(Array.isArray(commands[cmd]) ? commands[cmd] : [commands[cmd]]),
      ]);
    } else {
      setHistory((prev) => [
        ...prev,
        promptLine(cmd),
        `zsh: command not found: ${cmd}`,
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input.trim());
    setInput("");
    setHistoryIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistoryIndex((prev) =>
        prev === null ? history.length - 1 : Math.max(prev - 1, 0)
      );
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistoryIndex((prev) =>
        prev === null ? null : prev < history.length - 1 ? prev + 1 : null
      );
    }
  };

  const handleTerminalClick = () => {
    // Focus the input when clicking anywhere in the terminal
    const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
      // Move cursor to end of input
      const length = inputElement.value.length;
      inputElement.setSelectionRange(length, length);
    }
  };

  useEffect(() => {
    if (historyIndex !== null) {
      const prevCmd = history
        .filter((line) => line.startsWith("<span"))[historyIndex];
      if (prevCmd) {
        setInput(prevCmd.replace(/<[^>]*>/g, "").split("% ")[1] || "");
      }
    }
  }, [historyIndex, history]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <WindowWrapper
      title="Terminal — zsh"
      width="min(90vw, 700px)"
      height="min(70vh, 500px)"
      variant="terminal"
      isMinimized={isMinimized}
      onMinimize={() => minimizeWindow(windowId, { history, input })}
    >
      <div className="flex flex-col h-full text-sm cursor-text" onClick={handleTerminalClick}>
        {history.map((line, i) => {
          // Check if this line is part of the ASCII art by comparing content
          const isAsciiLine = asciiArtLines.includes(line);
          const asciiIndex = asciiArtLines.indexOf(line);
          const colorClass = isAsciiLine && asciiIndex !== -1 ? rainbowColors[asciiIndex % rainbowColors.length] : "";
          
          return (
            <p
              key={i}
              className={`whitespace-pre-wrap transition-opacity duration-300 opacity-100 ${colorClass}`}
              dangerouslySetInnerHTML={{ __html: line }}
            />
          );
        })}

        {/* Input line */}
        <form onSubmit={handleSubmit} className="flex mt-2">
          <span>
            <span className="text-green-400">karma</span>@
            <span className="text-cyan-400">MacBook-Air</span>{" "}
            <span className="text-blue-400">~</span> %
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none flex-1 caret-green-400 ml-2"
            autoFocus
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </WindowWrapper>
  );
}