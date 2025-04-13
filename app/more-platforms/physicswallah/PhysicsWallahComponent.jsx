import Image from 'next/image'

const PhysicsWallahComponent = () => {
  return (
    <div>
      <Image
        className="headingimg Uimg"
        src="/images/physicswallah.png"
        alt="Physics Wallah Banner"
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
              src="/images/pwyt.jpg"
              alt="Physics Wallah YouTube Channel"
              width={800}
              height={600}
            />
            <p>
              <a
                href="https://www.youtube.com/c/PhysicsWallah"
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
              src="/images/pwweb.jpg"
              alt="Physics Wallah Official Website"
              width={800}
              height={600}
            />
            <p>
              <a
                href="https://www.pw.live/"
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
              src="/images/pwapp.jpg"
              alt="Physics Wallah Mobile App"
              width={800}
              height={600}
            />
            <p>
              <a
                href="https://play.google.com/store/apps/details?id=xyz.penpencil.physicswala"
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

export default PhysicsWallahComponent
