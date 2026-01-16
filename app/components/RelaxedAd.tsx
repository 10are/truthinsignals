"use client";

import { useEffect, useRef, useState } from "react";

export default function RelaxedAd() {
  const adRef = useRef<HTMLModElement>(null);
  const [hasAd, setHasAd] = useState(false);

  useEffect(() => {
    try {
      // @ts-expect-error adsbygoogle is defined by Google AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad already pushed or error
    }

    // Check if ad loaded after a short delay
    const timer = setTimeout(() => {
      if (adRef.current && adRef.current.offsetHeight > 0) {
        setHasAd(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={hasAd ? "my-6" : ""}>
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
