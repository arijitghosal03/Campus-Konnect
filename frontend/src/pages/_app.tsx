import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Image from "next/image";
import Script from "next/script";

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

      {/* Chatbase Integration */}
      <Script 
        id="chatbase-script" 
        strategy="afterInteractive"
      >
        {`
          (function(){
            if(!window.chatbase||window.chatbase("getState")!=="initialized"){
              window.chatbase=(...arguments)=>{
                if(!window.chatbase.q){window.chatbase.q=[]}
                window.chatbase.q.push(arguments)
              };
              window.chatbase=new Proxy(window.chatbase,{
                get(target,prop){
                  if(prop==="q"){return target.q}
                  return(...args)=>target(prop,...args)
                }
              })
            }
            const onLoad=function(){
              const script=document.createElement("script");
              script.src="https://www.chatbase.co/embed.min.js";
              script.id="kyhsZ0DUPimm663sg-pJ5";
              script.domain="www.chatbase.co";
              document.body.appendChild(script)
            };
            if(document.readyState==="complete"){
              onLoad()
            } else {
              window.addEventListener("load",onLoad)
            }
          })();
        `}
      </Script>
    </div>
  );
}