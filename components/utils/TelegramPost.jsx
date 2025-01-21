"use client";
import  { useState } from 'react'

const TelegramPost = ({ url }) => {
  // const [tgError, setTgError] = useState(false);

  return (
    <div
      className="px-5 py-10"
      style={{ backgroundImage: "url('../images/tg-bg.webp')" }}
    >
      <p className="heading text-4xl pb-4 !font-[500]">More from our Telegram Channel</p>
      <h3 className="pb-4" style={{ fontWeight: 'normal' }}>
        (<strong>Please note:</strong> These links will only work if you are a subscriber of our official Telegram channel. If so, please proceed. Or else, please join our Telegram channel before proceeding.)
      </h3>

      {/* {!tgError ? */}
        <div style={{ isolation: 'isolate' }}>
          <script
            async
            src="https://telegram.org/js/telegram-widget.js?22"
            data-telegram-post={url}
            data-width="100%"
            data-dark="1"
          />
        </div> 
        {/* :
        <div style={{ fontFamily: "monospace" }}>
          Unable to load contents from telegram!
          <br />
          https://telegram.org is being blocked!!
          <br />
          Please reload!
        </div> 
      } */}
    </div>
  )
}

export default TelegramPost
