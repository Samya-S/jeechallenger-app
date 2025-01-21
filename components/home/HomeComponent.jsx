"use client";
import Styles from "./Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

const HomeComponent = () => {
  const marqueeRef = useRef(null);

  const handleMouseOver = () => {
    if (marqueeRef.current) {
      marqueeRef.current.stop();
    }
  };

  const handleMouseOut = () => {
    if (marqueeRef.current) {
      marqueeRef.current.start();
    }
  };

  return (
    <div>
      <div className="relative text-center">
        <div className={Styles.welcomeimg}></div>
        <div className={Styles.welcomepc}>
          <div className={Styles.centered}>
            <p className={`${Styles.heroText} text-4xl sm:text-5xl`}>All That You Need to Excel</p>
          </div>
          <div className={Styles.welcomeimgpc}>
            <Image
              src="/images/home.jpg"
              alt="Welcome"
              width={484}
              height={484}
            />
          </div>
        </div>
      </div>

      <div
        className={`bg-gray-200 bg-opacity-30 bg-cover px-5 py-12`}
        style={{ backgroundImage: "url('/images/tg-bg.jpg')" }}
      >
        <div className="flex flex-col items-center justify-center gap-4 pb-8">
          <Image
            src="/images/jcicon.jpg"
            alt="JEE Challenger Icon"
            width={180}
            height={180}
            className="rounded-full max-w-[180px]"
          />
          <p className="text-4xl font-bold">JEE Challenger</p>
        </div>
        <Link href="https://t.me/+oOnj4y_ZYqYyZjA1" target="_blank">
          <button className={`button2_tele text-xl`}>
            Join us on Telegram
          </button>
        </Link>
      </div>

      <div className="px-5 py-10">
        <p className="heading text-3xl mb-4">JEE Papers and Official Links</p>
        <div className="flex-container gap-8">
          <div className="block1">
            <p className="subheading text-2xl">JEE Main</p>
            <Link href="/official-links/jee-main">
              <button className={`button1`}>Go</button>
            </Link>
          </div>
          <div className="block1">
            <p className="subheading text-2xl">JEE Advanced</p>
            <Link href="/official-links/jee-advanced">
              <button className={`button1`}>Go</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-200 bg-opacity-30 px-5 py-10">
        <p className="heading text-3xl mb-4">The Subjects</p>
        <div className="flex-container gap-8">
          <div className="block1">
            <Image
              className="thumbnailImg"
              src="/images/physics.jpg"
              alt="Physics"
              width={180}
              height={180}
            />
            <p className="py-5">
              <b>
                "Physics is an attempt conceptually to grasp reality as
                something that is considered to be independent of its being
                observed. In this sense one speaks of physical reality."
              </b>
              <br />
              <em>- Albert Einstein</em>
            </p>
            <Link href="/materials/physics">
              <button className="button1">Find out more</button>
            </Link>
          </div>
          <div className="block1">
            <Image
              className="thumbnailImg"
              src="/images/chemistry.jpg"
              alt="Chemistry"
              width={180}
              height={180}
            />
            <p className="py-5">
              <b>
                "Chemists do not usually stutter. It would be very awkward if
                they did, seeing that they have at times to get out such words
                as methylethylamylophenylium."
              </b>
              <br />
              <em>- William Crookes</em>
            </p>
            <Link href="/materials/chemistry">
              <button className="button1">Find out more</button>
            </Link>
          </div>
          <div className="block1">
            <Image
              className="thumbnailImg"
              src="/images/maths.jpg"
              alt="Mathematics"
              width={180}
              height={180}
            />
            <p className="py-5">
              <b>
                "A man is like a fraction whose numerator is what he is and
                whose denominator is what he thinks of himself. The larger the
                denominator, the smaller the fraction."
              </b>
              <br />
              <em>- Leo Tolstoy</em>
            </p>
            <Link href="/materials/mathematics">
              <button className="button1">Find out more</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="px-5 py-10">
        <p className="heading text-3xl">More Contents</p>
        <div className="flex-container2 gap-8">
          <div className="block1">
            <p className="subheading text-2xl">
              Chapter wise solved PYQs
            </p>
            <Image
              className="thumbnailImg"
              src="/images/pyqs.jpg"
              alt="Chapter wise solved PYQs"
              width={1080}
              height={540}
            />
            <p className="py-4">
              Get chapter wise solved previous (43) years' JEE papers published
              by Arihant and Disha publication
            </p>
            <Link href="/materials/chapterwise-solved-pyqs">
              <button className="button1">Go</button>
            </Link>
          </div>
          <div className="block1">
            <p className="subheading text-2xl">Link to NCERT books (PDF)</p>
            <Image
              className="thumbnailImg"
              src="/images/ncertpdfs.jpg"
              alt="NCERT PDFs"
              width={1080}
              height={540}
            />
            <p className="py-4">
              This is a link to the Official Website of NCERT from where you can
              get NCERT text books in form of PDF
            </p>
            <Link href="https://ncert.nic.in/textbook.php" target="_blank">
              <button className="button1">Go</button>
            </Link>
          </div>
        </div>

        <div className="p-4 flex justify-center">
          <div className="block1">
            <Image
              className="thumbnailImg"
              src="/images/Unacademy-banner.jpg"
              alt="Unacademy"
              width={1080}
              height={540}
            />
            <p className="py-4">
              India's Largest Learning Platform. Coaching by Top Educators.
            </p>
            <Link href="/more-platforms/unacademy">
              <button className="button1">Go</button>
            </Link>
          </div>
        </div>

        <div className="flex-container2 gap-8">
          <div className="block1">
            <Image
              className="thumbnailImg"
              src="/images/apnikaksha2.jpg"
              alt="Apni Kaksha"
              width={1080}
              height={540}
            />
            <p className="py-4">
              Premium Education for All for free or at the most affordable
              price
            </p>
            <Link href="/more-platforms/apnikaksha">
              <button className="button1">Go</button>
            </Link>
          </div>
          <div className="block1">
            <Image
              className="thumbnailImg"
              src="/images/pwallah.jpg"
              alt="Physics Wallah"
              width={1080}
              height={540}
            />
            <p className="py-4">
              The most affordable learning platform that cares about you
            </p>
            <Link href="/more-platforms/physicswallah">
              <button className="button1">Go</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="message bg-gray-200 bg-opacity-30 px-5 py-10">
        <marquee
          ref={marqueeRef}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          scrollamount={15}
          className="subheading text-2xl pb-4"
        >
          Now you can contribute study materials to this website. Just click
          here 👇 and upload your file(s).
        </marquee>
        <Link
          href="https://drive.google.com/drive/folders/1gs_ehca1F1-K9g3q_Q0mTteUSGzd6z8F?usp=sharing"
          target="_blank"
        >
          <button className={`button2`}>Click here</button>
        </Link>
      </div>

      <div className="px-5 py-10">
        <p className="heading text-3xl">ISI Aspirant?</p>
        <p className="subheading text-2xl">
          This is for you <span className="darkmode-ignore">👇</span>
        </p>
        <div className="video-container">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/6Ebb-oe2IUc"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
        <p className="subheading text-2xl">Guide to ISI website</p>
        <Link href="https://samya-s.github.io/guidetoisi/" target="_blank">
          <button className="button2">Visit</button>
        </Link>
      </div>
    </div>
  );
};

export default HomeComponent;
