import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Image from "next/image";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          priority
          className="brightness-[0.2]"
        />
      </div>

      <div className="relative">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
