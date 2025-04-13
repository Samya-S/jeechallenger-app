import TelegramPost from '@/components/utils/TelegramPost'
import React from 'react'

const JeeAdvancedComponent = () => {
  return (
    <div>
      {/* to add proper spacing for navbar */}
      <div className="headingimg"></div>

      <div className="px-5 py-10 bg-white dark:bg-black">
        <p className="heading text-3xl mb-4 message">Link to JEE Advanced Official Website</p>
        <a href="https://jeeadv.ac.in/" target="_blank">
          <button className="button2">Go</button>
        </a>
      </div>

      <div className="px-5 py-10 bg-gray-200/30 dark:bg-zinc-900/30">
        <p className="heading text-3xl mb-4">More Official links</p>
        <div className="flex-container">
          <div className="block2">
            <p className="subheading text-2xl">Past Question Papers and Final Answer Keys</p>
            <p className="text-lg pb-4">Link to official website</p>
            <a href="https://jeeadv.ac.in/archive.html" target="_blank" rel="noopener noreferrer">
              <button className="button1">Go</button>
            </a>
          </div>
          <div className="block2">
            <p className="subheading text-2xl">Syllabus</p>
            <p className="text-lg pb-4">Link to official website</p>
            <a href="https://jeeadv.ac.in/syllabus/combined-syllabus.pdf" target="_blank" rel="noopener noreferrer">
              <button className="button1">Go</button>
            </a>
          </div>
          <div className="block2">
            <p className="subheading text-2xl">Previous years' JEE Advanced reports</p>
            <p className="text-lg pb-4">Link to official website</p>
            <a href="https://jeeadv.ac.in/reports.html" target="_blank" rel="noopener noreferrer">
              <button className="button1">Go</button>
            </a>
          </div>
        </div>
        <br />
        <div className="block2">
          <div className="flex justify-center gap-5">
            <img src="../images/flashingNew.gif" alt="" style={{ height: '50px' }} />
            <p className="subheading text-2xl">Revised Syllabus to be followed from JEE (Advanced) 2023</p>
          </div>
          <p className="text-lg pb-4">Link to official website</p>
          <a href="https://jeeadv.ac.in/misc/jee-advanced-2023-syllabus.pdf" target="_blank" rel="noopener noreferrer">
            <button className="button1">Go</button>
          </a>
        </div>
      </div>

      <TelegramPost url="jeechallengerindex/11" />
    </div>
  )
}

export default JeeAdvancedComponent
