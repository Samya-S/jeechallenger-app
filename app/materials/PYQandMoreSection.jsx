import Link from "next/link"

const PYQandMoreSection = () => {
  return (
    <div className="px-5 py-10">
      <div className="flex-container2">
        <div>
          <p className="heading text-4xl pb-4 !font-[500]">Previous Years' Questions</p>
          <div>
            <p>
              <Link href="chapterwise-solved-pyqs">
                <button className="button2">Find out more</button>
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="flex-container2">
        <div>
          <p className="heading text-4xl pb-4 !font-[500]" style={{ color: 'black', isolation: 'unset' }}>More from UNACADEMY</p>
          <div>
            <p>
              <Link href="../more-platforms/unacademy">
                <button className="button2">Find out more</button>
              </Link>
            </p>
          </div>
        </div>

        <div>
          <p className="heading text-4xl pb-4 !font-[500]" style={{ color: 'rgb(0, 0, 0)', isolation: 'unset' }}>More study materials</p>
          <div>
            <p>
              <Link href="more-study-materials">
                <button className="button2">Find out more</button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PYQandMoreSection
