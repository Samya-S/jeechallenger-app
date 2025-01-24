"use client";
import { useState, useEffect } from "react";

const TelegramPost = ({ url }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-post", url);
    script.setAttribute("data-width", "100%");
    script.setAttribute("data-dark", "1");

    script.onerror = () => {
      setError(true); // Trigger error state if the script fails to load
    };

    const container = document.getElementById("telegram-widget-container");
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container) {
        container.innerHTML = ""; // Cleanup on component unmount
      }
    };
  }, [url]);

  return (
    <div
      className="px-5 py-10"
      style={{ backgroundImage: "url('../images/tg-bg.webp')" }}
    >
      <p className="heading text-4xl pb-4 !font-[500]">More from our Telegram Channel</p>
      <h3 className="pb-4" style={{ fontWeight: "normal" }}>
        (<strong>Please note:</strong> These links will only work if you are a subscriber of our official Telegram channel. If so, please proceed. Otherwise, please join our Telegram channel before proceeding.)
      </h3>

      {error ? (
        <div style={{ fontFamily: "monospace", color: "red" }}>
          <p>Unable to load contents from Telegram!</p>
          <p>It seems <strong>https://telegram.org</strong> is being blocked or the content could not be loaded.</p>
          <p>Please reload the page or check your network settings.</p>
        </div>
      ) : (
        <div id="telegram-widget-container" className="darkmode-ignore w-full" />
      )}
    </div>
  );
};

export default TelegramPost;
