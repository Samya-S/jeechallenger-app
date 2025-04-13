import Image from 'next/image'

const ApniKakshaComponent = () => {
  return (
    <div>
      <Image
        className="headingimg Uimg"
        src="/images/apnikaksha.jpg"
        alt="Apni Kaksha Banner"
        width={1920}
        height={1080}
        style={{ width: '100%', boxSizing: 'border-box' }}
      />

      <div className="px-5 py-10 bg-white dark:bg-black">
        <div className="flex-container">
          <div className="block2">
            <p className="subheading text-2xl">YouTube Channel</p>
            <Image
              className="thumbnailImg mb-5"
              src="/images/apnikaksha-ytchannel.png"
              alt="YouTube Channel"
              width={800}
              height={600}
            />
            <p>
              <a
                href="https://www.youtube.com/channel/UCF7BExjT2zH_mmyqOB139Dg/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="button1">Click Here</button>
              </a>
            </p>
          </div>
          <div className="block2">
            <p className="subheading text-2xl">Official Website</p>
            <Image
              className="thumbnailImg mb-5"
              src="/images/apnikaksha-website.png"
              alt="Official Website"
              width={800}
              height={600}
            />
            <p>
              <a
                href="https://www.apnikaksha.net/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="button1">Click Here</button>
              </a>
            </p>
          </div>
          <div className="block2">
            <p className="subheading text-2xl">Mobile App</p>
            <Image
              className="thumbnailImg mb-5"
              src="/images/apnikaksha-app.png"
              alt="Mobile App"
              width={800}
              height={600}
            />
            <p>
              <a
                href="https://play.google.com/store/apps/details?id=com.apni.kaksha"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="button1">Click Here</button>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApniKakshaComponent
