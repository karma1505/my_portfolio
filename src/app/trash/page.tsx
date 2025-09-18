"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Draggable from "react-draggable";
import { useWindowContext } from "@/contexts/WindowContext";

export default function Trash() {
  const router = useRouter();
  const nodeRef = useRef<HTMLDivElement>(null);
  const { isWindowMinimized, minimizeWindow } = useWindowContext();
  const windowId = "trash";
  const isMinimized = isWindowMinimized(windowId);

  if (isMinimized) return null;

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-200/40">
      <Draggable nodeRef={nodeRef}>
        <div
          ref={nodeRef}
          className="bg-white/90 backdrop-blur-xl 
                     w-[600px] max-w-[90vw] rounded-xl shadow-2xl 
                     border border-gray-300 
                     overflow-hidden absolute"
        >
          {/* Toolbar */}
          <div className="window-toolbar h-10 flex items-center px-4 border-b border-gray-300 bg-gray-100">
            <div className="flex gap-2 mr-4">
              <span
                onClick={() => router.push("/")}
                className="w-3 h-3 bg-red-500 rounded-full cursor-pointer hover:brightness-90"
              />
              <span
                onClick={() => minimizeWindow(windowId)}
                className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer hover:brightness-95"
              />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <span className="text-sm font-semibold text-gray-600">
              Trash(The Tech Graveyard)
            </span>
          </div>

          {/* Content */}
          <div className="p-10 text-center">
            <h1 className="text-3xl font-bold mb-4">
              You Found The Trash!
            </h1>
            <p className="text-gray-600 mb-8">
              Here lies the projects that have been deleted because they were never completed
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-400 transition"
            >
              Back to Desktop
            </button>
          </div>
        </div>
      </Draggable>
    </div>
  );
}