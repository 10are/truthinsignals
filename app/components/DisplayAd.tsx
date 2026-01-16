"use client";

import { useEffect } from "react";

export default function DisplayAd() {
  useEffect(() => {
    try {
      // @ts-expect-error adsbygoogle is defined by Google AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad already pushed or error
    }
  }, []);

  return (
    <div className="my-6">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-2898264794440783"
        data-ad-slot="7221256062"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
