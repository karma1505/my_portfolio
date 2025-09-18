// WindowWrapper.tsx
"use client";
import { useRouter } from "next/navigation";
import Draggable from "react-draggable";
import { ReactNode, useRef, useState } from "react";

export default function WindowWrapper({
  title,
  children,
  width = "700px",
  height = "auto",
  variant = "default",
  className = "",
  onMinimize,
  isMinimized = false,
}: {
  title: string;
  children: ReactNode;
  width?: string;
  height?: string;
  variant?: "default" | "terminal";
  className?: string;
  onMinimize?: () => void;
  isMinimized?: boolean;
}) {
  const router = useRouter();
  const nodeRef = useRef<HTMLDivElement>(null);

  const isTerminal = variant === "terminal";

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    }
  };


  // Don't render anything if minimized
  if (isMinimized) {
    return null;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Draggable 
        handle=".window-toolbar" 
        nodeRef={nodeRef} 
        cancel=".no-drag"
      >
        <div
          ref={nodeRef}
          className={`rounded-xl shadow-2xl border overflow-hidden
            ${isTerminal 
              ? "bg-[#2b2b2b]/80 backdrop-blur-md border-gray-700 text-gray-100 font-mono" 
              : "bg-white/90  backdrop-blur-xl border-gray-300 resize"
            }
            w-[95%] sm:w-[90%] md:w-[750px] lg:w-[900px]
            h-[75vh] sm:h-[80vh] md:h-[600px]
            min-w-[300px] min-h-[200px] max-w-[95vw] max-h-[90vh]
            ${className}
          `}
          style={{ 
            maxWidth: width, 
            maxHeight: height,
            resize: isTerminal ? 'none' : 'both'
          }}
        >
          {/* Toolbar */}
          <div
            className={`window-toolbar flex items-center px-4 py-2 border-b cursor-default
              ${isTerminal 
                ? "bg-[#1e1e1e]/80 border-gray-700 text-sm text-gray-300"
                : "bg-gray-100 border-gray-300 font-semibold text-gray-700"
              }`}
            style={{ cursor: 'default' }}
          >
            <div className="flex gap-2">
              <button
                onClick={() => router.push("/")}
                className="w-3 h-3 rounded-full bg-red-500 hover:scale-110 transition"
              />
              <button
                onClick={handleMinimize}
                className="w-3 h-3 rounded-full bg-yellow-500 hover:scale-110 transition"
              />
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            <div className="flex-1 text-center truncate">{title}</div>
          </div>

          {/* Content */}
          <div className="p-4 h-[calc(100%-2.5rem)] overflow-y-auto relative">{children}</div>
          
          {/* Resize Handle - only for non-terminal windows */}
          {!isTerminal && (
            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity">
              <div className="absolute bottom-1 right-1 w-0 h-0 border-l-[6px] border-l-transparent border-b-[6px] border-b-gray-400"></div>
            </div>
          )}
        </div>
      </Draggable>
    </div>
  );
}
