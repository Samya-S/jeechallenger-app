"use client";
import Image from 'next/image'

const ChapterWiseSolvedPYQsComponent = () => {
  const joinTgAlertMsg = "This link will only work if you are a subscriber of our official telegram channel. If so, please proceed.\n\nOr else, please join our telegram channel before proceeding.";

  return (
    <div>
      <Image
        className="headingimg"
        src="/images/PYQs-banner.png"
        alt="Mathematics Banner"
        width={1920}
        height={1080}
        style={{ width: '100%', boxSizing: 'border-box' }}
      />

      <div className="px-5 py-10">
        <p className="heading text-3xl mb-4">Arihant</p>(41 years')
        <div className="flex-container">
          <div>
            <p className="subheading text-2xl">Physics</p>
            <a
              href="https://drive.google.com/file/d/1ilDvlBn09uV2gzCQdDRfMGOXOsH9ywCs/view?usp=sharing"
              target="_blank"
            >
              <button className="button1">Download</button>
            </a>
          </div>
          <div>
            <p className="subheading text-2xl">Chemistry</p>
            <a
              href="https://drive.google.com/file/d/1jemk4mzdzt-EcUqJZJxzJlfF4MAA_P3B/view?usp=sharing"
              target="_blank"
            >
              <button className="button1">Download</button>
            </a>
          </div>
          <div>
            <p className="subheading text-2xl">Mathematics</p>
            <a
              href="https://drive.google.com/file/d/1fdnuPL3hAHXmxS5rmsqQrmc1Ht9g27e-/view?usp=sharing"
              target="_blank"
            >
              <button className="button1">Download</button>
            </a>
          </div>
        </div>
      </div>

      <div className="px-5 py-10" style={{ backgroundColor: "rgba(212, 212, 212, 0.26)" }}>
        <p className="heading text-3xl mb-4">Disha</p>(41 years')
        <div className="flex-container">
          <div>
            <p className="subheading text-2xl">Physics</p>
            <a
              href="https://drive.google.com/file/d/1WfCf8XUo25V3DxiG3T5ujQFs3ch2r0iJ/view?usp=sharing"
              target="_blank"
            >
              <button className="button1">Download</button>
            </a>
          </div>
          <div>
            <p className="subheading text-2xl">Chemistry</p>
            <a
              href="https://drive.google.com/file/d/1AX6hTGALhvGatJU1h9Rby20FwUG9vl9s/view?usp=sharing"
              target="_blank"
            >
              <button className="button1">Download</button>
            </a>
          </div>
          <div>
            <p className="subheading text-2xl">Mathematics</p>
            <a
              href="https://drive.google.com/file/d/1me6lu3qZl1z2RMoT8IXCVsfn-VrRGrVN/view?usp=sharing"
              target="_blank"
            >
              <button className="button1">Download</button>
            </a>
          </div>
        </div>
      </div>

      <div
        className="px-5 py-10"
        style={{ backgroundImage: "url('../images/tg-bg.jpg')" }}
      >
        <p className="subheading text-2xl">
          *Get chapter-wise solved previous 43 years' JEE papers published by Arihant
          and Disha publication from our telegram channel
        </p>

        <p
          className="flex-container2 pb-5"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <img
            src="../images/jcicon.jpg"
            alt=""
            style={{ borderRadius: "50%", maxWidth: "150px" }}
          />
          <b style={{ fontSize: "30px", textAlign: "center" }}>JEE Challenger</b>
        </p>

        <a
          href="https://t.me/c/1655397860/180"
          target="_blank"
          className="pr-5"
          onClick={(e) => {
            if (!confirm(joinTgAlertMsg)) {
              e.preventDefault();
            }
          }}
        >
          <button className="button2_tele text-xl">Arihant</button>
        </a>
        <a
          href="https://t.me/c/1655397860/211"
          target="_blank"
          onClick={(e) => {
            if (!confirm(joinTgAlertMsg)) {
              e.preventDefault();
            }
          }}
        >
          <button className="button2_tele text-xl">Disha</button>
        </a>
      </div>

      <div className="px-5 py-10">
        <p className="heading text-3xl mb-4">JEE Main papers</p>(Chapter-wise solved previous 20 years' JEE Main papers)
        <div className="flex-container">
          <div>
            <p className="subheading text-2xl">Arihant</p>
            <a
              href="https://t.me/c/1655397860/372"
              target="_blank"
              onClick={(e) => {
                if (!confirm(joinTgAlertMsg)) {
                  e.preventDefault();
                }
              }}
            >
              <button className="button1">Download</button>
            </a>
          </div>
          <div>
            <p className="subheading text-2xl">Disha</p>
            <a
              href="https://t.me/c/1655397860/377"
              target="_blank"
              onClick={(e) => {
                if (!confirm(joinTgAlertMsg)) {
                  e.preventDefault();
                }
              }}
            >
              <button className="button1">Download</button>
            </a>
          </div>
        </div>
      </div>

      <div className="px-5 py-10" style={{ backgroundColor: "rgba(212, 212, 212, 0.26)" }}>
        <p className="heading text-3xl mb-4">Wiley</p>22 Years' (1998-2019)
        <div className="flex-container">
          <div>
            <p className="subheading text-2xl">JEE Advanced Chapter wise Solved Papers</p>
            <a
              href="https://t.me/c/1655397860/351"
              target="_blank"
              onClick={(e) => {
                if (!confirm(joinTgAlertMsg)) {
                  e.preventDefault();
                }
              }}
            >
              <button className="button1">Download</button>
            </a>
          </div>
        </div>
      </div>

      <div className="px-5 py-10">
        <p className="heading text-3xl mb-4">Disha</p>15 Years' (2006-2020)
        <div className="flex-container">
          <div>
            <p className="subheading text-2xl">JEE Advanced Chapter wise Solved Papers</p>
            <a
              href="https://t.me/c/1655397860/398"
              target="_blank"
              onClick={(e) => {
                if (!confirm(joinTgAlertMsg)) {
                  e.preventDefault();
                }
              }}
            >
              <button className="button1">Download</button>
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ChapterWiseSolvedPYQsComponent
