import TelegramPost from '@/components/utils/TelegramPost'

const MoreMaterialsComponent = () => {
  return (
    <div>
      {/* to add proper spacing for navbar */}
      <div className="headingimg"></div>

      <div className="px-5 pt-5 pb-10 bg-white dark:bg-black">
        <p className="heading text-3xl mb-4">More Study Materials</p>
        <div className="space-y-3 mb-6 mx-auto w-fit">
          <p className="text-lg font-medium">Miscellaneous Resources Drive Link</p>
          <p className="text-left">Available Materials:</p>
          <ul className="text-left list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Allen JEE Modules (Complete PCM) Latest</li>
            <li>Bansal Maths Module</li>
            <li>FIITJEE AITS for JEE Mains and JEE Advanced 2022</li>
            <li>JEE Previous Year Questions</li>
            <li>Miscellaneous PCM Resources</li>
            <li>Resonance + Allen Study Materials</li>
            <li>Resonance Complete Sheets with solutions</li>
            <li>Unacademy Plus Notes (PMS, BJ, MKA, VJ sir)</li>
            <li>Unacademy Iconic JEE Notes</li>
            <li>Unacademy JEE - Predictor papers</li>
          </ul>
          <p className="text-left">And many more...</p>
        </div>

        <a
          href="https://drive.google.com/drive/folders/19r66GAkz0zAsEY_GlI-Ehf0lNqGm5caA?usp=drive_link"
          target="_blank"
          className="block"
          rel="noopener noreferrer"
        >
          <button className="button1 px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200">
            Access More Study Materials
          </button>
        </a>
      </div>

      <div className="px-5 py-10 bg-gray-200/30 dark:bg-zinc-900/30">
        <p className="heading text-3xl mb-4">Etoos lectures</p>
        <p className="subheading text-2xl">All Etoos lectures by NV sir, PS sir, NJ sir in one place</p>
        (
        <a href="https://bit.ly/etooslectures" target="_blank" style={{ textDecoration: "underline", color: "red", isolation: "unset" }}>
          https://bit.ly/etooslectures
        </a>
        )
        <br />
        <br />
        <iframe
          style={{ height: "500px", width: "90%" }}
          className="m-auto dark:!invert"
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTIZhOA_KrJYPUirK-Xp5XutggAWlQzCbeE7q735675W3OiJTstbvNzZrbHBzLvM7g_bFHQDuiGPLNO/pubhtml?widget=true&headers=false"
        ></iframe>
      </div>

      <div className="px-5 py-10 bg-white dark:bg-black">
        <p className="heading text-3xl mb-4">Couldn't find what you are searching for?</p>

        <div className="message">
          <p className="subheading text-2xl max-w-4xl m-auto">
            Some materials are not directly published in the website due to copyright issues. If you
            are searching for something like that, you may get it from our telegram channel.
          </p>
        </div>

        <p
          className="flex-container2 mb-4"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <img
            src="../images/jcicon.jpg"
            alt="JEE Challenger Telegram Channel Icon"
            className="max-w-[180px] rounded-[50px] shadow-md"
          />
        </p>

        <a href="https://t.me/+oOnj4y_ZYqYyZjA1" target="_blank">
          <button className="button2_tele" style={{ fontSize: "20px" }}>
            Join us on Telegram
          </button>
        </a>

        <div className="py-5" style={{ fontSize: "25px" }}>
          You can also contribute study materials to this website if you find something missing here. <br />
          Just{" "}
          <a
            href="https://drive.google.com/drive/folders/1gs_ehca1F1-K9g3q_Q0mTteUSGzd6z8F?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className="message"
              style={{
                padding: "0 15px",
                border: "2px solid rgb(255, 0, 0)",
                backgroundColor: "transparent",
                borderRadius: "8px",
                fontSize: "20px",
                fontWeight: "500",
              }}
            >
              Click here
            </button>
          </a>{" "}
          and upload your file(s).
        </div>
      </div>

      <TelegramPost url="jeechallengerindex/7" />
    </div>
  )
}

export default MoreMaterialsComponent
