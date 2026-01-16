"use client";

import { useEffect, useRef, useState } from "react";

export default function RelaxedAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    // Only render ad after component mounts and has width
    if (containerRef.current && containerRef.current.offsetWidth > 0) {
      setShouldRender(true);
    }
  }, []);

  useEffect(() => {
    if (!shouldRender) return;

    try {
      // @ts-expect-error adsbygoogle is defined by Google AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad already pushed or error
    }

    // Check if ad loaded
    const timer = setInterval(() => {
      if (containerRef.current) {
        const ins = containerRef.current.querySelector("ins");
        if (ins && (ins.getAttribute("data-ad-status") === "filled" || ins.offsetHeight > 50)) {
          setAdLoaded(true);
          clearInterval(timer);
        }
      }
    }, 500);

    const timeout = setTimeout(() => clearInterval(timer), 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [shouldRender]);

  // Reklam gelmezse hiç yer kaplamasın
  if (!adLoaded && !shouldRender) {
    return <div ref={containerRef} className="min-h-0" />;
  }

  return (
    <div
      ref={containerRef}
      className={adLoaded ? "my-6" : "min-h-0 overflow-hidden"}
    >
      {shouldRender && (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="autorelaxed"
          data-ad-client="ca-pub-2898264794440783"
          data-ad-slot="4515201676"
        />
      )}
    </div>
  );
}
