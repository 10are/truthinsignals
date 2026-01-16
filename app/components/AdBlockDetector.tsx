"use client";

import { useEffect, useState } from "react";

export default function AdBlockDetector() {
  const [adBlockDetected, setAdBlockDetected] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const detectAdBlock = async () => {
      try {
        // Create a bait element that ad blockers typically block
        const bait = document.createElement("div");
        bait.className = "adsbox ad-banner ad-placement textads banner-ads";
        bait.style.cssText = "position:absolute;top:-10px;left:-10px;width:1px;height:1px;";
        bait.innerHTML = "&nbsp;";
        document.body.appendChild(bait);

        // Wait a bit for ad blocker to act
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Check if the element was hidden/removed
        const isBlocked =
          bait.offsetHeight === 0 ||
          bait.offsetWidth === 0 ||
          bait.clientHeight === 0 ||
          getComputedStyle(bait).display === "none" ||
          getComputedStyle(bait).visibility === "hidden";

        // Clean up
        if (bait.parentNode) {
          bait.parentNode.removeChild(bait);
        }

        // Also try to fetch a common ad script
        try {
          const response = await fetch(
            "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
            { method: "HEAD", mode: "no-cors" }
          );
          // If we get here without error, ads might be allowed
          // But we still check the bait element
        } catch {
          // Fetch blocked = ad blocker detected
          setAdBlockDetected(true);
          setChecking(false);
          return;
        }

        setAdBlockDetected(isBlocked);
      } catch {
        // If there's an error, assume ad blocker might be present
        setAdBlockDetected(true);
      }
      setChecking(false);
    };

    detectAdBlock();
  }, []);

  if (checking) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (adBlockDetected) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">🛑</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Ad Blocker Detected
          </h1>
          <p className="text-gray-600 mb-6">
            We rely on ads to keep this site free. Please disable your ad blocker
            to continue using Truth In Signals.
          </p>
          <div className="bg-gray-50 rounded-xl p-6 text-left mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">How to disable:</h3>
            <ol className="text-sm text-gray-600 space-y-2">
              <li>1. Click on your ad blocker icon in the browser</li>
              <li>2. Click "Pause" or "Disable" for this site</li>
              <li>3. Refresh the page</li>
            </ol>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all"
          >
            I've Disabled It - Refresh
          </button>
        </div>
      </div>
    );
  }

  return null;
}
