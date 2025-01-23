import { FaTelegram } from "react-icons/fa"

const TelegramJoinFloat = () => {
  return (
    <div className="hidden sm:block">
      <a
        href="https://t.me/+oOnj4y_ZYqYyZjA1"
        target="_blank"
        className="telegram-float"
        style={{
          position: "fixed",
          zIndex: "5",
          width: "60px",
          height: "fit-content",
          top: "50%",
          transform: "translate(0, -50%)",
          left: "0px",
          backgroundColor: "rgb(255, 255, 255)",
          color: "#2e87ca",
          borderRadius: "15px",
          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
          textAlign: "center",
          textDecoration: "none",
          padding: "5px",
          boxShadow: "2px 2px 3px #999"
        }}
      >
        <p className="text-xl">Join us on</p>
        <FaTelegram className="text-4xl m-auto my-[5px]" />
      </a>
    </div>
  )
}

export default TelegramJoinFloat
