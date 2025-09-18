"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useWindowContext } from "@/contexts/WindowContext";


export default function Dock() {
    const router = useRouter();
    const { restoreWindow, isWindowMinimized } = useWindowContext();
    
    const apps = [
        { name: "Safari", src: "/icons/safari.png", alt: "Safari", path: "/about", windowId: "about" },
        { name: "Mail", src: "/icons/mail.png", alt: "Mail", path: "/contact", windowId: "contact" },
        { name: "Calendar", src: "/icons/calendar.png", alt: "Calendar", path: "/calendar", windowId: "calendar" },
        { name: "Notes", src: "/icons/notes.png", alt: "Notes", path: "/notes", windowId: "notes" }, 
        { name: "Terminal", src: "/icons/terminal.jpg", alt: "Terminal", path: "/terminal", windowId: "terminal" },
        // { name: "Settings", src: "/icons/settings.png", alt: "Settings" },
        { name: "Trash", src: "/icons/trash.png", alt: "Trash", path: "/trash", windowId: "trash" }, 
      ];

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2
                 flex items-end gap-4 px-4 py-2
                 bg-white/20 
                 backdrop-blur-md backdrop-saturate-150
                 rounded-2xl shadow-lg border border-white/10
                 z-50"
    >
      {apps.map((app) => (
        <button
          key={app.name}
          onClick={() => {
            if (app.path) {
              // If window is minimized, restore it first
              if (app.windowId && isWindowMinimized(app.windowId)) {
                restoreWindow(app.windowId);
              }
              router.push(app.path); // navigate if path exists
            } else {
              alert(`${app.name} app coming soon 🚀`); // placeholder for now
            }
          }}
          className="transition-transform duration-200 hover:scale-125"
        >
          <div className="w-16 h-16 relative">
            <Image
              src={app.src}
              alt={app.alt}
              fill
              className="object-contain"
            />
          </div>
        </button>
      ))}
    </div>
  );
}