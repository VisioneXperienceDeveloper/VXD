// components/GoogleAdsense.tsx
import Script from "next/script";

type Props = {
  pId: string;
};

export function GoogleAdSense({ pId }: Props) {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
