import { useEffect, useState } from 'react';

interface ChatbaseWidgetProps {
  chatbotId?: string;
  domain?: string;
  userId?: string;
  userHash?: string;
  className?: string;
}

declare global {
  interface Window {
    chatbase: any;
  }
}

const ChatbaseWidget: React.FC<ChatbaseWidgetProps> = ({
  chatbotId = "kyhsZ0DUPimm663sg-pJ5", // Your chatbot ID from the script
  domain = "www.chatbase.co",
  userId,
  userHash,
  className = ""
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize chatbase if not already done
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...args: any[]) => {
        if (!window.chatbase.q) {
          window.chatbase.q = [];
        }
        window.chatbase.q.push(args);
      };

      window.chatbase = new Proxy(window.chatbase, {
        get(target: any, prop: string) {
          if (prop === "q") {
            return target.q;
          }
          return (...args: any[]) => target(prop, ...args);
        }
      });
    }

    // Load the chatbase script
    const loadChatbase = () => {
      // Check if script already exists
      if (document.getElementById(chatbotId)) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = chatbotId;
      script.setAttribute("domain", domain);
      
      script.onload = () => {
        setIsLoaded(true);
        
        // Set user identification if provided
        if (userId && userHash && window.chatbase) {
          window.chatbase("identify", {
            userId: userId,
            userHash: userHash
          });
        }
      };

      script.onerror = () => {
        console.error("Failed to load Chatbase widget");
      };

      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      loadChatbase();
    } else {
      window.addEventListener("load", loadChatbase);
    }

    // Cleanup function
    return () => {
      window.removeEventListener("load", loadChatbase);
    };
  }, [chatbotId, domain, userId, userHash]);

  // Method to programmatically open/close chat
  const openChat = () => {
    if (window.chatbase && isLoaded) {
      window.chatbase("open");
    }
  };

  const closeChat = () => {
    if (window.chatbase && isLoaded) {
      window.chatbase("close");
    }
  };

  // Method to send custom events
  const sendEvent = (eventName: string, data?: any) => {
    if (window.chatbase && isLoaded) {
      window.chatbase("track", eventName, data);
    }
  };

  return (
    <div className={`chatbase-widget ${className}`}>
     
      <button 
        onClick={openChat}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!isLoaded}
      >
        {isLoaded ? "Open Chat" : "Loading..."}
      </button>
      
    </div>
  );
};

export default ChatbaseWidget;