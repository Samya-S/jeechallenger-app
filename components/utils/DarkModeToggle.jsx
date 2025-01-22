"use client";
import { useEffect } from 'react';
import Darkmode from 'darkmode-js';

const DarkModeToggle = () => {
  useEffect(() => {
    const options = {
      bottom: '40px',
      right: '40px',
      left: 'unset',
      time: '0.5s',
      mixColor: '#fff',
      backgroundColor: '#fff',
      buttonColorDark: '#100f2c',
      buttonColorLight: '#fff',
      saveInCookies: true,
      label: '🌓',
      autoMatchOsTheme: true,
    };

    const darkmode = new Darkmode(options);
    darkmode.showWidget();
  }, []);

  return null; // The widget will appear on the screen; no UI needed here.
};

export default DarkModeToggle;
