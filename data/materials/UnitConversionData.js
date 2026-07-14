export const conversionData = {
  // --- Space & Time ---
  Length: {
    base: "Meter (m)",
    units: {
      "Meter (m)": { m: 1, c: 0 },
      "Centimeter (cm)": { m: 0.01, c: 0 },
      "Millimeter (mm)": { m: 0.001, c: 0 },
      "Kilometer (km)": { m: 1000, c: 0 },
      "Inch (in)": { m: 0.0254, c: 0 },
      "Foot (ft)": { m: 0.3048, c: 0 },
      "Yard (yd)": { m: 0.9144, c: 0 },
      "Mile (mi)": { m: 1609.34, c: 0 },
      "Lightyear (ly)": { m: 9.461e15, c: 0 },
      "Angstrom (Å)": { m: 1e-10, c: 0 },
    },
  },
  Area: {
    base: "Square Meter (m²)",
    units: {
      "Square Meter (m²)": { m: 1, c: 0 },
      "Square Kilometer (km²)": { m: 1e6, c: 0 },
      "Square Centimeter (cm²)": { m: 1e-4, c: 0 },
      "Hectare (ha)": { m: 10000, c: 0 },
      "Acre (ac)": { m: 4046.86, c: 0 },
    }
  },
  Volume: {
    base: "Cubic Meter (m³)",
    units: {
      "Cubic Meter (m³)": { m: 1, c: 0 },
      "Liter (L)": { m: 0.001, c: 0 },
      "Milliliter (mL)": { m: 1e-6, c: 0 },
      "Cubic Centimeter (cm³)": { m: 1e-6, c: 0 },
      "Gallon (US)": { m: 0.00378541, c: 0 },
    }
  },
  Angle: {
    base: "Radian (rad)",
    units: {
      "Radian (rad)": { m: 1, c: 0 },
      "Degree (°)": { m: 0.01745329252, c: 0 },
      "Gradian (grad)": { m: 0.01570796327, c: 0 },
      "Arcminute (')": { m: 0.0002908882087, c: 0 },
      "Arcsecond (\")": { m: 0.000004848136811, c: 0 },
    }
  },
  "Solid Angle": {
    base: "Steradian (sr)",
    units: {
      "Steradian (sr)": { m: 1, c: 0 },
      "Square degree (sq.deg)": { m: 0.0003046174197, c: 0 },
    }
  },
  Time: {
    base: "Second (s)",
    units: {
      "Second (s)": { m: 1, c: 0 },
      "Minute (min)": { m: 60, c: 0 },
      "Hour (hr)": { m: 3600, c: 0 },
      "Day (d)": { m: 86400, c: 0 },
      "Year (yr)": { m: 31557600, c: 0 },
    },
  },

  // --- Kinematics ---
  Velocity: {
    base: "Meter per second (m/s)",
    units: {
      "Meter per second (m/s)": { m: 1, c: 0 },
      "Kilometer per hour (km/h)": { m: 0.2777777778, c: 0 },
      "Mile per hour (mph)": { m: 0.44704, c: 0 },
    }
  },
  "Angular Velocity": {
    base: "Radian per second (rad/s)",
    units: {
      "Radian per second (rad/s)": { m: 1, c: 0 },
      "Degree per second (°/s)": { m: 0.01745329252, c: 0 },
      "Revolution per minute (RPM)": { m: 0.1047197551, c: 0 },
    }
  },

  // --- Matter & Thermodynamics ---
  Mass: {
    base: "Kilogram (kg)",
    units: {
      "Kilogram (kg)": { m: 1, c: 0 },
      "Gram (g)": { m: 0.001, c: 0 },
      "Milligram (mg)": { m: 1e-6, c: 0 },
      "Pound (lb)": { m: 0.453592, c: 0 },
      "Ounce (oz)": { m: 0.0283495, c: 0 },
      "Metric Ton (t)": { m: 1000, c: 0 },
      "Atomic Mass Unit (amu)": { m: 1.660539e-27, c: 0 },
    },
  },
  Density: {
    base: "Kilogram per cubic meter (kg/m³)",
    units: {
      "Kilogram per cubic meter (kg/m³)": { m: 1, c: 0 },
      "Gram per cubic centimeter (g/cm³)": { m: 1000, c: 0 },
      "Gram per milliliter (g/mL)": { m: 1000, c: 0 },
    }
  },
  Temperature: {
    base: "Kelvin (K)",
    units: {
      "Kelvin (K)": { m: 1, c: 0 },
      "Celsius (°C)": { m: 1, c: 273.15 },
      "Fahrenheit (°F)": { m: 5/9, c: 459.67 },
    }
  },
  Molarity: {
    base: "Moles per Liter (mol/L)",
    units: {
      "Moles per Liter (M)": { m: 1, c: 0 },
      "Millimolar (mM)": { m: 0.001, c: 0 },
      "Micromolar (µM)": { m: 1e-6, c: 0 },
      "Nanomolar (nM)": { m: 1e-9, c: 0 },
    }
  },
  Proportion: {
    base: "Fraction (1)",
    units: {
      "Fraction (1)": { m: 1, c: 0 },
      "Percentage (%)": { m: 0.01, c: 0 },
      "Per mille (‰)": { m: 0.001, c: 0 },
      "Parts per million (ppm)": { m: 1e-6, c: 0 },
    }
  },

  // --- Mechanics ---
  Force: {
    base: "Newton (N)",
    units: {
      "Newton (N)": { m: 1, c: 0 },
      "Dyne (dyn)": { m: 1e-5, c: 0 },
      "Kilogram-force (kgf)": { m: 9.80665, c: 0 },
    },
  },
  Pressure: {
    base: "Pascal (Pa)",
    units: {
      "Pascal (Pa)": { m: 1, c: 0 },
      "Atmosphere (atm)": { m: 101325, c: 0 },
      "Bar (bar)": { m: 100000, c: 0 },
      "Torr (torr)": { m: 133.322, c: 0 },
      "Millimeter of mercury (mmHg)": { m: 133.322, c: 0 },
    },
  },
  Energy: {
    base: "Joule (J)",
    units: {
      "Joule (J)": { m: 1, c: 0 },
      "Erg (erg)": { m: 1e-7, c: 0 },
      "Electronvolt (eV)": { m: 1.60218e-19, c: 0 },
      "Calorie (cal)": { m: 4.184, c: 0 },
      "Kilocalorie (kcal)": { m: 4184, c: 0 },
      "Kilowatt-hour (kWh)": { m: 3.6e6, c: 0 },
    },
  },
  Power: {
    base: "Watt (W)",
    units: {
      "Watt (W)": { m: 1, c: 0 },
      "Kilowatt (kW)": { m: 1000, c: 0 },
      "Megawatt (MW)": { m: 1e6, c: 0 },
      "Horsepower (hp)": { m: 745.7, c: 0 },
    },
  },

  // --- Electromagnetism ---
  Charge: {
    base: "Coulomb (C)",
    units: {
      "Coulomb (C)": { m: 1, c: 0 },
      "Millicoulomb (mC)": { m: 1e-3, c: 0 },
      "Microcoulomb (µC)": { m: 1e-6, c: 0 },
      "Nanocoulomb (nC)": { m: 1e-9, c: 0 },
      "Elementary charge (e)": { m: 1.602176634e-19, c: 0 },
    }
  },
  "Dipole Moment": {
    base: "Coulomb-meter (C·m)",
    units: {
      "Coulomb-meter (C·m)": { m: 1, c: 0 },
      "Debye (D)": { m: 3.33564e-30, c: 0 },
    }
  },
  Capacitance: {
    base: "Farad (F)",
    units: {
      "Farad (F)": { m: 1, c: 0 },
      "Millifarad (mF)": { m: 1e-3, c: 0 },
      "Microfarad (µF)": { m: 1e-6, c: 0 },
      "Nanofarad (nF)": { m: 1e-9, c: 0 },
      "Picofarad (pF)": { m: 1e-12, c: 0 },
    }
  },
  "Magnetic Field": {
    base: "Tesla (T)",
    units: {
      "Tesla (T)": { m: 1, c: 0 },
      "Gauss (G)": { m: 1e-4, c: 0 },
    }
  },
  "Magnetic Flux": {
    base: "Weber (Wb)",
    units: {
      "Weber (Wb)": { m: 1, c: 0 },
      "Maxwell (Mx)": { m: 1e-8, c: 0 },
    }
  },

  // --- Waves & Modern Physics ---
  Frequency: {
    base: "Hertz (Hz)",
    units: {
      "Hertz (Hz)": { m: 1, c: 0 },
      "Kilohertz (kHz)": { m: 1000, c: 0 },
      "Megahertz (MHz)": { m: 1e6, c: 0 },
      "Gigahertz (GHz)": { m: 1e9, c: 0 },
    }
  },
  Radioactivity: {
    base: "Becquerel (Bq)",
    units: {
      "Becquerel (Bq)": { m: 1, c: 0 },
      "Curie (Ci)": { m: 3.7e10, c: 0 },
      "Rutherford (Rd)": { m: 1e6, c: 0 },
    }
  }
};
