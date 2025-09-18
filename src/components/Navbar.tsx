"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { WifiHigh } from "lucide-react";

export default function Navbar() {
  const [time, setTime] = useState("");
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);

  useEffect(() => {
    const updateTime = () => {
      // Get current time in India Standard Time (IST)
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata"
        })
      );
    };

    updateTime(); // set immediately
    const interval = setInterval(updateTime, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getBatteryInfo = async () => {
      try {
        // Check if Battery API is supported
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          
          const updateBatteryInfo = () => {
            setBatteryLevel(Math.round(battery.level * 100));
            setIsCharging(battery.charging);
          };

          // Set initial values
          updateBatteryInfo();

          // Listen for battery changes
          battery.addEventListener('levelchange', updateBatteryInfo);
          battery.addEventListener('chargingchange', updateBatteryInfo);

          // Cleanup function
          return () => {
            battery.removeEventListener('levelchange', updateBatteryInfo);
            battery.removeEventListener('chargingchange', updateBatteryInfo);
          };
        }
      } catch (error) {
        console.log('Battery API not supported or accessible');
      }
    };

    getBatteryInfo();
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 w-full h-8 
             bg-white/20 
             backdrop-blur-md backdrop-saturate-150
             border-b border-white/10
             flex items-center px-4 text-xs text-black z-50 justify-between"
    >
        <div className="flex items-center gap-4">
          <Image src="/appleicon.png" alt="Logo" width={45} height={45} />
          <span className="font-semibold text-white pt-1">KarmaOS</span>
        </div>

      <div className="flex items-center gap-3 text-white">
        <WifiHigh size={30} className="text-white pb-1" />
        <div className="flex items-center gap-1 pt-1">
          {batteryLevel !== null ? (
            <>
              <div className="relative">
                {/* Battery body */}
                <div className="w-6 h-3 border border-white rounded-sm relative">
                  {/* Battery level fill */}
                  <div 
                    className={`transition-all duration-300 ${
                      batteryLevel > 20 ? 'bg-white' : 'bg-red-500'
                    } ${
                      batteryLevel >= 100 ? 'rounded-sm' : 'rounded-l-sm'
                    }`}
                    style={{ 
                      width: `${batteryLevel}%`,
                      height: 'calc(100% + 1px)',
                      marginTop: '-0.5px'
                    }}
                  />
                </div>
                {/* Battery tip */}
                <div className="absolute -right-0.5 top-1 w-0.5 h-1 bg-white rounded-r-sm"></div>
                {/* Charging indicator */}
                {isCharging && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 border border-white border-t-0 border-r-0 transform rotate-45"></div>
                  </div>
                )}
              </div>
              <span className="text-xs">{batteryLevel}%</span>
            </>
          ) : (
            <div className="relative">
              {/* Default battery icon */}
              <div className="w-6 h-3 border border-white rounded-sm relative">
                <div 
                  className="w-3/4 bg-white rounded-l-sm"
                  style={{
                    height: 'calc(100% + 1px)',
                    marginTop: '-0.5px'
                  }}
                ></div>
              </div>
              <div className="absolute -right-0.5 top-1 w-0.5 h-1 bg-white rounded-r-sm"></div>
            </div>
          )}
        </div>
        <span className="pt-1">{time}</span>
      </div>
    </nav>
  );
}