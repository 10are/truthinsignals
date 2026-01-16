"use client";

import { useEffect, useRef, useState } from "react";

export default function RelaxedAd() {
  const adRef = useRef<HTMLInsElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      // @ts-expect-error adsbygoogle is defined by Google AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad already pushed or error
    }

    // Check if ad loaded
    const observer = new MutationObserver(() => {
      if (adRef.current) {
        const hasContent = adRef.current.getAttribute("data-ad-status") === "filled" ||
                          adRef.current.innerHTML.trim().length > 0 ||
                          adRef.current.offsetHeight > 50;
        if (hasContent) {
          setLoaded(true);
          observer.disconnect();
        }
      }
    });

    if (adRef.current) {
      observer.observe(adRef.current, { childList: true, subtree: true, attributes: true });
    }

    // Fallback check
    const timer = setTimeout(() => {
      if (adRef.current && adRef.current.offsetHeight > 50) {
        setLoaded(true);
      }
      observer.disconnect();
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{ display: loaded ? "block" : "none", margin: loaded ? "1.5rem 0" : "0" }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-2898264794440783"
        data-ad-slot="4515201676"
      />
    </div>
  );
}
