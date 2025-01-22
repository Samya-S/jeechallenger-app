"use client";
import Styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={Styles.footer}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      {/* 
      <a href="https://www.facebook.com/SamyaSaha08" target="_blank" className={`fa fa-facebook ${Styles.fa}`}></a>
      <a href="https://www.twitter.com/SamyaSaha08" target="_blank" className={`fa fa-twitter ${Styles.fa}`}></a>
      <a href="https://bit.ly/SamyaSahaYt" target="_blank" className={`fa fa-youtube ${Styles.fa}`}></a>
      <a href="https://www.instagram.com/SamyaSaha08" target="_blank" className={`fa fa-instagram ${Styles.fa}`}></a><br/> 
      */}
      Copyright © 2020-{new Date().getFullYear() % 100} &nbsp;
      <i style={{ fontWeight: 500 }}>Samya Saha</i>
      <br />
      - All Rights Reserved.
      <br />
      <br />
      <p className="text-xs">
        Access the source code on{' '}
        <a
          href="https://github.com/Samya-S/jeechallenger-2.0"
          target="_blank"
          style={{ color: '#0056b3', textDecoration: 'underline', isolation: 'unset' }}
        >
          GitHub
        </a>
      </p>
    </footer>
  );
};

export default Footer;
