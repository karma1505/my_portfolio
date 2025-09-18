"use client";
import { useState, useEffect } from "react";
import WindowWrapper from "@/components/WindowWrapper";
import { useWindowContext } from "@/contexts/WindowContext";

export default function Mail() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isWindowMinimized, minimizeWindow, restoreWindow, windowStates } = useWindowContext();
  const windowId = "contact";
  const isMinimized = isWindowMinimized(windowId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const from = String(formData.get("from") || "");
    const subject = String(formData.get("subject") || "");
    const message = String(formData.get("message") || "");

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, subject, message }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
      (e.currentTarget as HTMLFormElement).reset();
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WindowWrapper 
      title="Contact Me" 
      width="600px" 
      height="auto"
      isMinimized={isMinimized}
      onMinimize={() => minimizeWindow(windowId, { sent })}
    >
      <div className="p-6">
        {sent && (
          <div className="p-4 mb-6 rounded-md bg-green-100 text-green-800 text-center">
            ✅ Message sent successfully!
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* From */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              From
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              name="from"
              className="w-full rounded-md border border-gray-300 p-2 bg-white text-gray-900 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Subject
            </label>
            <input
              type="text"
              placeholder="Subject"
              name="subject"
              className="w-full rounded-md border border-gray-300 p-2 bg-white text-gray-900 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Message
            </label>
            <textarea
              rows={6}
              placeholder="Write your message..."
              name="message"
              className="w-full rounded-md border border-gray-300 p-2 bg-white text-gray-900 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-500 
                       text-white font-medium shadow-md transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </WindowWrapper>
  );
}