"use client";
import Styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={Styles.footer}>
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
