import Image from 'next/image'

const UnacademyComponent = () => {
  return (
    <div>
      <Image
        className="headingimg Uimg"
        src="/images/Unacademy_header.png"
        alt="Unacademy Banner"
        width={1920}
        height={1080}
        style={{ width: '100%', boxSizing: 'border-box' }}
      />

      <div className="px-5 py-10">
        <div className="flex-container2" style={{ padding: "2rem" }}>
          <div className="block2">
            <p className="subheading text-2xl">Unacademy App</p>
            <a
              href="https://play.google.com/store/apps/details?id=com.unacademyapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="button1">Click here</button>
            </a>
          </div>
          <div className="block2">
            <p className="subheading text-2xl">Official Website</p>
            <a
              href="https://unacademy.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="button1">Click here</button>
            </a>
          </div>
        </div>
      </div>

      <div
      className="px-5 py-10"
        style={{
          backgroundColor: "rgba(212, 212, 212, 0.26)",
        }}
      >
        <div className="flex-container2">
          <div className="block2">
            <p className="subheading text-2xl">JEE YouTube Channel</p>
            <a
              href="https://www.youtube.com/c/UnacademyJEE"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="button1">Click here</button>
            </a>
          </div>
          <div className="block2">
            <p className="subheading text-2xl">JEE Live Daily</p>
            <a
              href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQUwyeyCbReMBmABf-Q-XqG40oB5KrDQoUlLMpDZhBu18YasgWI72pAyH4beYolw95ylxQJdPqSWcig/pubhtml"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="button1">Click here</button>
            </a>
          </div>
        </div>
        <div className="flex-container2">
          <div className="block2">
            <p className="subheading text-2xl">Atoms YouTube Channel</p>
            <a
              href="https://www.youtube.com/c/UnacademyAtoms"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="button1">Click here</button>
            </a>
          </div>
          <div className="block2">
            <p className="subheading text-2xl">Atoms Spreadsheet</p>
            <a
              href="https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vSGdvJCyKe-ZNbftgiYhgiftUINBIRiTiT53bjvHPDZ2NUuoAbelekk6213TtLa25S6pseSsozKIZ7C/pubhtml"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="button1">Click here</button>
            </a>
          </div>
        </div>
      </div>

      <div className="px-5 py-10">
        <p className="heading text-3xl mb-4">Get Unacademy subscription</p>
        <img
          src="../images/Unacademy-subscription.gif"
          alt=""
          style={{ maxWidth: "100%", padding: "2%" }}
          className="m-auto"
        />
        <br />
        <a
          href="https://unacademy.com/goal/jee-main-and-advanced-preparation/TMUVD/subscribe?referral_code=PLUSX9K6W"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            className="button2"
            style={{ fontSize: "20px" }}
          >
            Subscribe Now
          </button>
        </a>
      </div>
    </div>
  )
}

export default UnacademyComponent
