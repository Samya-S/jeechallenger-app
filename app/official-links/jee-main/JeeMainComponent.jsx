"use client";
import JeeMain2020papers from './JeeMain2020papers';
import JeeMain2022papers from './JeeMain2022papers';

const JeeMainComponent = () => {
  const toggle_show_hide_Function_2020 = () => {
    const element2020 = document.getElementById("toggle-show-hide-id-2020");
    const element2022 = document.getElementById("toggle-show-hide-id-2022");
    
    // Hide 2022 first
    element2022.style.display = "none";
    
    // Toggle visibility of 2020
    element2020.style.display = element2020.style.display === "none" ? "block" : "none";
  };
  
  const toggle_show_hide_Function_2022 = () => {
    const element2020 = document.getElementById("toggle-show-hide-id-2020");
    const element2022 = document.getElementById("toggle-show-hide-id-2022");
  
    // Hide 2020 first
    element2020.style.display = "none";
  
    // Toggle visibility of 2022
    element2022.style.display = element2022.style.display === "none" ? "block" : "none";
  };
  
  return (
    <div>
      {/* to add proper spacing for navbar */}
      <div className="headingimg"></div>

      <div className="px-5 py-10 bg-[rgba(212,212,212,0.26)]">
        <p className="heading text-3xl mb-4 message">Link to JEE Main Official Website</p>
        <a href="https://jeemain.nta.nic.in/" target="_blank">
          <button className="button2">Go</button>
        </a>
      </div>

      <div className="px-5 py-10">
        <p className="heading text-3xl mb-4">JEE Main Question Papers</p>
        <div className="flex-container">
          <div className="block">
            <p className="subheading text-2xl">Question Papers 2022</p>
            <p className="text-lg pb-4">With solutions</p>
            <button className="button1" onClick={toggle_show_hide_Function_2022}>
              Click Here
            </button>
          </div>
          <div className="block">
            <p className="subheading text-2xl">Question Papers 2021</p>
            <p className="text-lg pb-4">Booklet by ALLEN</p>
            <a href="https://t.me/c/1655397860/238" target="_blank">
              <button className="button1">Download</button>
            </a>
          </div>
          <div className="block">
            <p className="subheading text-2xl">Question Papers 2020</p>
            <p className="text-lg pb-4">With solutions</p>
            <button className="button1" onClick={toggle_show_hide_Function_2020}>
              Click Here
            </button>
          </div>
        </div>
      </div>

      <div id="toggle-show-hide-id-2020" style={{ display: 'none', padding: '2%', backgroundColor: 'rgba(212, 212, 212, 0.1)', marginTop: '20px' }}>
        <JeeMain2020papers />
      </div>

      <div id="toggle-show-hide-id-2022" style={{ display: 'none', padding: '2%', backgroundColor: 'rgba(212, 212, 212, 0.1)', marginTop: '20px' }}>
        <JeeMain2022papers />
      </div>
    </div>
  );
}

export default JeeMainComponent;
