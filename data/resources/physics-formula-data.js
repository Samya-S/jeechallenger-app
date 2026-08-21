// Physics Formula Data — chapters match syllabusData.js exactly
const PhysicsFormulaData = [
  {
    chapter: "Units and Measurements",
    formulas: [
      { name: "Dimensional Formula — Force", latex: "[F] = [M\\,L\\,T^{-2}]", description: "Newton (N) = kg·m/s²" },
      { name: "Dimensional Formula — Energy / Work", latex: "[E] = [M\\,L^2\\,T^{-2}]", description: "Joule (J)" },
      { name: "Dimensional Formula — Power", latex: "[P] = [M\\,L^2\\,T^{-3}]", description: "Watt (W) = J/s" },
      { name: "Dimensional Formula — Pressure / Stress", latex: "[P] = [M\\,L^{-1}\\,T^{-2}]", description: "Pascal (Pa) = N/m²" },
      { name: "Dimensional Formula — Electric Charge", latex: "[q] = [A\\,T]", description: "Coulomb (C)" },
      { name: "Dimensional Formula — Gravitational Constant", latex: "[G] = [M^{-1}\\,L^3\\,T^{-2}]", description: "G = 6.674 × 10⁻¹¹ N·m²/kg²" },
      { name: "Dimensional Formula — Planck's Constant", latex: "[h] = [M\\,L^2\\,T^{-1}]", description: "h = 6.626 × 10⁻³⁴ J·s" },
      { name: "Absolute Error", latex: "\\Delta a = |a_{mean} - a_i|", description: "Mean value minus individual measurement" },
      { name: "Relative Error", latex: "\\text{Relative Error} = \\frac{\\Delta a}{a_{mean}}", description: "Dimensionless ratio" },
      { name: "Percentage Error", latex: "\\text{\\% Error} = \\frac{\\Delta a}{a_{mean}} \\times 100", description: "Used to report accuracy" },
      { name: "Error in Product / Quotient", latex: "\\frac{\\Delta Z}{Z} = \\frac{\\Delta A}{A} + \\frac{\\Delta B}{B}", description: "For Z = A × B or Z = A/B" },
      { name: "Error in Power", latex: "\\frac{\\Delta Z}{Z} = n\\frac{\\Delta A}{A}", description: "For Z = Aⁿ" },
    ]
  },
  {
    chapter: "Motion in a Straight Line",
    formulas: [
      { name: "Average Velocity", latex: "v_{avg} = \\frac{\\Delta x}{\\Delta t} = \\frac{x_2 - x_1}{t_2 - t_1}", description: "Displacement divided by time interval" },
      { name: "Average Speed", latex: "\\text{Speed}_{avg} = \\frac{\\text{Total distance}}{\\text{Total time}}", description: "Always ≥ |average velocity|" },
      { name: "Instantaneous Velocity", latex: "v = \\lim_{\\Delta t \\to 0}\\frac{\\Delta x}{\\Delta t} = \\frac{dx}{dt}", description: "Derivative of position" },
      { name: "First Equation of Motion", latex: "v = u + at", description: "Uniform acceleration" },
      { name: "Second Equation of Motion", latex: "s = ut + \\tfrac{1}{2}at^2", description: "Displacement in time t" },
      { name: "Third Equation of Motion", latex: "v^2 = u^2 + 2as", description: "Velocity–displacement relation" },
      { name: "Displacement in nth Second", latex: "s_n = u + \\frac{a(2n-1)}{2}", description: "Displacement only in the nth second" },
      { name: "Free Fall (dropping from rest)", latex: "v = gt,\\quad h = \\tfrac{1}{2}gt^2,\\quad v^2 = 2gh", description: "g = 9.8 m/s² downward; u = 0" },
    ]
  },
  {
    chapter: "Motion in a Plane",
    formulas: [
      { name: "Projectile — Range", latex: "R = \\frac{u^2 \\sin 2\\theta}{g}", description: "Maximum when θ = 45°" },
      { name: "Projectile — Max Height", latex: "H = \\frac{u^2 \\sin^2\\theta}{2g}", description: "Reached at t = T/2" },
      { name: "Projectile — Time of Flight", latex: "T = \\frac{2u\\sin\\theta}{g}", description: "Total time in air" },
      { name: "Trajectory Equation", latex: "y = x\\tan\\theta - \\frac{gx^2}{2u^2\\cos^2\\theta}", description: "Parabolic path of projectile" },
      { name: "Horizontal Velocity", latex: "v_x = u\\cos\\theta = \\text{const}", description: "No acceleration in horizontal direction" },
      { name: "Vertical Velocity at Time t", latex: "v_y = u\\sin\\theta - gt", description: "Zero at maximum height" },
      { name: "Circular Motion — Centripetal Acceleration", latex: "a_c = \\frac{v^2}{r} = r\\omega^2 = v\\omega", description: "Directed toward center" },
      { name: "Relative Velocity", latex: "\\vec{v}_{AB} = \\vec{v}_A - \\vec{v}_B", description: "Velocity of A as seen from B" },
      { name: "River-Boat: Minimum Drift Angle", latex: "\\sin\\theta = \\frac{v_r}{v_b}", description: "θ upstream to cross with minimum drift" },
    ]
  },
  {
    chapter: "Laws of Motion",
    formulas: [
      { name: "Newton's Second Law", latex: "\\vec{F}_{net} = m\\vec{a}", description: "Net external force = mass × acceleration" },
      { name: "Linear Momentum", latex: "\\vec{p} = m\\vec{v},\\quad \\vec{F} = \\frac{d\\vec{p}}{dt}", description: "Rate of change of momentum" },
      { name: "Impulse", latex: "\\vec{J} = \\vec{F}\\,\\Delta t = \\Delta\\vec{p}", description: "Change in momentum" },
      { name: "Static Friction", latex: "f_s \\leq \\mu_s N", description: "Maximum static friction: f_s^{max} = μ_s N" },
      { name: "Kinetic Friction", latex: "f_k = \\mu_k N,\\quad \\mu_k < \\mu_s", description: "Acts opposite to direction of sliding" },
      { name: "Centripetal Force (Circular)", latex: "F_c = \\frac{mv^2}{r} = mr\\omega^2", description: "Required force for uniform circular motion" },
      { name: "Banking Angle (Frictionless)", latex: "\\tan\\theta = \\frac{v^2}{rg}", description: "Ideal banking for speed v, radius r" },
      { name: "Maximum Speed on Banked Road (with friction)", latex: "v_{max} = \\sqrt{\\frac{rg(\\mu+\\tan\\theta)}{1-\\mu\\tan\\theta}}", description: "Upper speed limit for banked road with friction μ" },
      { name: "Minimum Speed on Banked Road", latex: "v_{min} = \\sqrt{\\frac{rg(\\tan\\theta-\\mu)}{1+\\mu\\tan\\theta}}", description: "Lower speed limit" },
    ]
  },
  {
    chapter: "Work, Energy and Power",
    formulas: [
      { name: "Work Done", latex: "W = \\vec{F}\\cdot\\vec{d} = Fd\\cos\\theta", description: "Scalar product of force and displacement" },
      { name: "Work by Variable Force", latex: "W = \\int_{x_1}^{x_2} F\\,dx", description: "Area under F–x graph" },
      { name: "Kinetic Energy", latex: "KE = \\tfrac{1}{2}mv^2 = \\frac{p^2}{2m}", description: "Energy due to motion" },
      { name: "Work-Energy Theorem", latex: "W_{net} = \\Delta KE = \\tfrac{1}{2}mv_f^2 - \\tfrac{1}{2}mv_i^2", description: "Net work = change in KE" },
      { name: "Elastic PE (Spring)", latex: "U = \\tfrac{1}{2}kx^2", description: "x = compression or extension from natural length" },
      { name: "Gravitational PE", latex: "U = mgh", description: "h = height above reference level" },
      { name: "Conservation of Energy", latex: "KE + PE = \\text{constant (conservative forces only)}", description: "Total mechanical energy conserved" },
      { name: "Power", latex: "P = \\frac{dW}{dt} = \\vec{F}\\cdot\\vec{v} = Fv\\cos\\theta", description: "Rate of doing work; unit: Watt (W)" },
      { name: "Coefficient of Restitution", latex: "e = \\frac{v_2' - v_1'}{u_1 - u_2}", description: "e = 1 (perfectly elastic), e = 0 (perfectly inelastic)" },
      { name: "Perfectly Inelastic Collision", latex: "m_1 u_1 + m_2 u_2 = (m_1+m_2)v", description: "Momentum conserved; KE not conserved" },
    ]
  },
  {
    chapter: "System of Particles and Rotational Motion",
    formulas: [
      { name: "Centre of Mass", latex: "\\vec{r}_{cm} = \\frac{m_1\\vec{r}_1 + m_2\\vec{r}_2 + ...}{m_1 + m_2 + ...}", description: "Weighted average of position vectors" },
      { name: "Torque", latex: "\\vec{\\tau} = \\vec{r}\\times\\vec{F},\\quad |\\tau| = rF\\sin\\theta", description: "Rotational analog of force" },
      { name: "Angular Momentum", latex: "\\vec{L} = \\vec{r}\\times\\vec{p} = I\\vec{\\omega}", description: "Conserved when net torque = 0" },
      { name: "Newton's Second Law (Rotation)", latex: "\\vec{\\tau}_{net} = I\\vec{\\alpha}", description: "Rotational analog of F = ma" },
      { name: "Moment of Inertia — Disc", latex: "I = \\tfrac{1}{2}MR^2", description: "About axis through center, perpendicular to plane" },
      { name: "Moment of Inertia — Ring", latex: "I = MR^2", description: "About axis through center, perpendicular to plane" },
      { name: "Moment of Inertia — Solid Sphere", latex: "I = \\tfrac{2}{5}MR^2", description: "About diameter" },
      { name: "Moment of Inertia — Hollow Sphere", latex: "I = \\tfrac{2}{3}MR^2", description: "About diameter" },
      { name: "Moment of Inertia — Rod (center)", latex: "I = \\frac{ML^2}{12}", description: "About axis perpendicular to rod at midpoint" },
      { name: "Parallel Axis Theorem", latex: "I = I_{cm} + Md^2", description: "d = distance between parallel axes" },
      { name: "Perpendicular Axis Theorem", latex: "I_z = I_x + I_y", description: "For laminar (flat 2D) bodies only" },
      { name: "Rolling without Slipping", latex: "v_{cm} = R\\omega,\\quad a_{cm} = R\\alpha", description: "Condition for pure rolling" },
      { name: "KE of Rolling Body", latex: "KE = \\tfrac{1}{2}mv_{cm}^2\\!\\left(1 + \\frac{k^2}{R^2}\\right)", description: "k = radius of gyration" },
    ]
  },
  {
    chapter: "Gravitation",
    formulas: [
      { name: "Newton's Law of Gravitation", latex: "F = \\frac{Gm_1 m_2}{r^2}", description: "G = 6.674 × 10⁻¹¹ N·m²/kg²" },
      { name: "Gravitational Field Intensity", latex: "g = \\frac{GM}{R^2}", description: "At surface; g ≈ 9.8 m/s² for Earth" },
      { name: "Variation of g with Height", latex: "g_h = g\\!\\left(\\frac{R}{R+h}\\right)^2 \\approx g\\!\\left(1-\\frac{2h}{R}\\right)", description: "Approximate for h << R" },
      { name: "Variation of g with Depth", latex: "g_d = g\\!\\left(1-\\frac{d}{R}\\right)", description: "Decreases linearly; g = 0 at Earth's center" },
      { name: "Orbital Velocity", latex: "v_o = \\sqrt{\\frac{GM}{R+h}} \\approx \\sqrt{gR} \\text{ (low orbit)}", description: "Velocity for circular orbit" },
      { name: "Escape Velocity", latex: "v_e = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR}", description: "≈ 11.2 km/s for Earth" },
      { name: "Time Period of Satellite", latex: "T = 2\\pi\\sqrt{\\frac{(R+h)^3}{GM}}", description: "Kepler's Third Law applied" },
      { name: "Kepler's Third Law", latex: "T^2 \\propto a^3", description: "a = semi-major axis of orbit" },
      { name: "Total Energy of Satellite", latex: "E = -\\frac{GMm}{2r}", description: "r = R + h; negative means bound" },
      { name: "Binding Energy", latex: "E_B = \\frac{GMm}{2r}", description: "Energy to free satellite from orbit" },
    ]
  },
  {
    chapter: "Mechanical Properties of Solids",
    formulas: [
      { name: "Stress", latex: "\\sigma = \\frac{F}{A}", description: "Force per unit area; unit: Pa = N/m²" },
      { name: "Longitudinal Strain", latex: "\\epsilon_L = \\frac{\\Delta L}{L}", description: "Change in length per original length" },
      { name: "Young's Modulus", latex: "Y = \\frac{\\sigma}{\\epsilon_L} = \\frac{FL}{A\\,\\Delta L}", description: "Resistance to stretching/compression" },
      { name: "Shear Stress and Modulus", latex: "\\eta = \\frac{F/A}{\\Delta x/L} = \\frac{F/A}{\\tan\\phi}", description: "Rigidity modulus; φ = shear angle" },
      { name: "Bulk Modulus", latex: "K = -\\frac{\\Delta P}{\\Delta V/V}", description: "Resistance to uniform compression" },
      { name: "Compressibility", latex: "\\beta = \\frac{1}{K}", description: "Inverse of bulk modulus" },
      { name: "Poisson's Ratio", latex: "\\nu = -\\frac{\\epsilon_{lateral}}{\\epsilon_{longitudinal}}", description: "Ratio of lateral to longitudinal strain; −0.5 ≤ ν ≤ 0.5" },
      { name: "Elastic Potential Energy Density", latex: "u = \\frac{1}{2}\\times\\text{stress}\\times\\text{strain}", description: "Energy stored per unit volume" },
    ]
  },
  {
    chapter: "Mechanical Properties of Fluids",
    formulas: [
      { name: "Pressure in Fluid", latex: "P = P_0 + \\rho g h", description: "Absolute pressure at depth h" },
      { name: "Buoyancy (Archimedes)", latex: "F_b = \\rho_{fluid}\\,V_{submerged}\\,g", description: "Upward force on submerged object" },
      { name: "Continuity Equation", latex: "A_1 v_1 = A_2 v_2 = \\text{const}", description: "Conservation of mass for incompressible flow" },
      { name: "Bernoulli's Equation", latex: "P + \\tfrac{1}{2}\\rho v^2 + \\rho g h = \\text{const}", description: "Energy conservation for ideal fluid flow" },
      { name: "Torricelli's Theorem", latex: "v = \\sqrt{2gh}", description: "Speed of efflux from an orifice at depth h" },
      { name: "Stokes' Law", latex: "F_{drag} = 6\\pi\\eta r v", description: "Viscous drag on sphere; η = dynamic viscosity" },
      { name: "Terminal Velocity", latex: "v_t = \\frac{2r^2(\\rho - \\sigma)g}{9\\eta}", description: "ρ = sphere density, σ = fluid density" },
      { name: "Surface Tension — Excess Pressure (Bubble)", latex: "\\Delta P = \\frac{4T}{r}", description: "Soap bubble: 2 surfaces → factor 4" },
      { name: "Surface Tension — Excess Pressure (Drop)", latex: "\\Delta P = \\frac{2T}{r}", description: "Liquid drop: 1 surface → factor 2" },
      { name: "Capillary Rise", latex: "h = \\frac{2T\\cos\\theta}{r\\rho g}", description: "θ = contact angle; negative h means depression" },
    ]
  },
  {
    chapter: "Thermal Properties of Matter",
    formulas: [
      { name: "Linear Thermal Expansion", latex: "\\Delta L = L_0\\,\\alpha\\,\\Delta T,\\quad L = L_0(1+\\alpha\\Delta T)", description: "α = linear expansion coefficient" },
      { name: "Area Expansion", latex: "\\Delta A = A_0\\,\\beta\\,\\Delta T,\\quad \\beta = 2\\alpha", description: "β = areal expansion coefficient" },
      { name: "Volume Expansion", latex: "\\Delta V = V_0\\,\\gamma\\,\\Delta T,\\quad \\gamma = 3\\alpha", description: "γ = volumetric expansion coefficient" },
      { name: "Heat Capacity", latex: "Q = mc\\Delta T", description: "c = specific heat capacity (J/kg·K)" },
      { name: "Latent Heat", latex: "Q = mL", description: "L = specific latent heat; no temperature change during phase transition" },
      { name: "Fourier's Law of Conduction", latex: "\\frac{dQ}{dt} = -KA\\frac{dT}{dx}", description: "K = thermal conductivity; negative sign: heat flows hot→cold" },
      { name: "Thermal Resistance", latex: "R_{th} = \\frac{L}{KA}", description: "Analog of electrical resistance" },
      { name: "Newton's Law of Cooling", latex: "\\frac{dT}{dt} = -k(T - T_0)", description: "Rate of cooling proportional to temperature difference" },
      { name: "Stefan-Boltzmann Law", latex: "P = \\varepsilon\\sigma A T^4", description: "σ = 5.67 × 10⁻⁸ W/m²K⁴; ε = emissivity" },
      { name: "Wien's Displacement Law", latex: "\\lambda_{max}\\,T = b = 2.898\\times10^{-3}\\text{ m·K}", description: "Peak wavelength shifts with temperature" },
    ]
  },
  {
    chapter: "Thermodynamics",
    formulas: [
      { name: "First Law", latex: "\\Delta U = Q - W", description: "Q = heat added to system; W = work done by system" },
      { name: "Work Done by Gas (Isobaric)", latex: "W = P\\Delta V = nR\\Delta T", description: "Constant pressure" },
      { name: "Work Done (Isothermal)", latex: "W = nRT\\ln\\frac{V_2}{V_1}", description: "Constant temperature" },
      { name: "Work Done (Adiabatic)", latex: "W = \\frac{nR(T_1-T_2)}{\\gamma-1} = \\frac{P_1V_1 - P_2V_2}{\\gamma-1}", description: "No heat exchange with surroundings" },
      { name: "Isochoric Process", latex: "W = 0,\\quad Q = \\Delta U = nC_V\\Delta T", description: "Constant volume; all heat raises internal energy" },
      { name: "Adiabatic Relations", latex: "PV^\\gamma = C,\\quad TV^{\\gamma-1} = C,\\quad T^\\gamma P^{1-\\gamma} = C", description: "γ = Cp/Cv" },
      { name: "Efficiency of Heat Engine", latex: "\\eta = 1 - \\frac{Q_2}{Q_1} = 1 - \\frac{T_L}{T_H}", description: "Carnot efficiency is maximum possible" },
      { name: "COP of Refrigerator", latex: "COP = \\frac{Q_2}{W} = \\frac{T_L}{T_H - T_L}", description: "Coefficient of performance; COP of Carnot is maximum" },
      { name: "Mayer's Relation", latex: "C_P - C_V = R", description: "For one mole of ideal gas" },
    ]
  },
  {
    chapter: "Kinetic Theory",
    formulas: [
      { name: "Ideal Gas Equation", latex: "PV = nRT = NkT", description: "R = 8.314 J/mol·K; k_B = 1.38 × 10⁻²³ J/K" },
      { name: "Pressure by Gas", latex: "P = \\frac{1}{3}\\rho\\,\\overline{v^2} = \\frac{1}{3}\\frac{mN}{V}\\,\\overline{v^2}", description: "Derived from kinetic theory" },
      { name: "RMS Speed", latex: "v_{rms} = \\sqrt{\\frac{3RT}{M}} = \\sqrt{\\frac{3kT}{m}}", description: "M = molar mass in kg/mol" },
      { name: "Mean Speed", latex: "\\bar{v} = \\sqrt{\\frac{8RT}{\\pi M}}", description: "Average speed of all molecules" },
      { name: "Most Probable Speed", latex: "v_p = \\sqrt{\\frac{2RT}{M}}", description: "Speed at peak of Maxwell distribution" },
      { name: "Speed Relation", latex: "v_p < \\bar{v} < v_{rms}", description: "Ratio ≈ 1 : 1.13 : 1.22" },
      { name: "Average KE per Molecule", latex: "\\bar{KE} = \\frac{f}{2}kT", description: "f = degrees of freedom (mono=3, di=5, poly=6)" },
      { name: "Internal Energy", latex: "U = \\frac{f}{2}nRT", description: "For n moles; f = degrees of freedom" },
      { name: "Mean Free Path", latex: "\\lambda = \\frac{1}{\\sqrt{2}\\,n\\,\\pi d^2}", description: "n = number density; d = diameter of molecule" },
    ]
  },
  {
    chapter: "Oscillations",
    formulas: [
      { name: "SHM Equation", latex: "x = A\\sin(\\omega t + \\phi)", description: "A = amplitude, φ = initial phase" },
      { name: "Velocity in SHM", latex: "v = \\omega\\sqrt{A^2-x^2}", description: "Maximum at x=0; zero at x=±A" },
      { name: "Acceleration in SHM", latex: "a = -\\omega^2 x", description: "Always directed toward mean position" },
      { name: "Angular Frequency", latex: "\\omega = \\frac{2\\pi}{T} = 2\\pi f", description: "Unit: rad/s" },
      { name: "Spring-Mass Period", latex: "T = 2\\pi\\sqrt{\\frac{m}{k}}", description: "k = spring constant; independent of amplitude" },
      { name: "Simple Pendulum Period", latex: "T = 2\\pi\\sqrt{\\frac{L}{g}}", description: "Valid for θ < 4°; independent of mass and amplitude" },
      { name: "Total Energy in SHM", latex: "E = \\frac{1}{2}kA^2 = \\frac{1}{2}m\\omega^2 A^2", description: "Constant; proportional to A²" },
      { name: "PE in SHM", latex: "U = \\frac{1}{2}kx^2 = \\frac{1}{2}m\\omega^2 x^2", description: "Maximum at extreme positions" },
      { name: "KE in SHM", latex: "KE = \\frac{1}{2}m\\omega^2(A^2 - x^2)", description: "Maximum at mean position" },
    ]
  },
  {
    chapter: "Waves",
    formulas: [
      { name: "Wave Equation", latex: "y = A\\sin(kx - \\omega t)", description: "Transverse progressive wave in +x direction" },
      { name: "Wave Speed — Fundamental", latex: "v = f\\lambda = \\frac{\\omega}{k}", description: "Universal wave relation" },
      { name: "Wave Number", latex: "k = \\frac{2\\pi}{\\lambda}", description: "Spatial angular frequency; unit: rad/m" },
      { name: "Speed in String", latex: "v = \\sqrt{\\frac{T}{\\mu}}", description: "T = tension (N), μ = linear mass density (kg/m)" },
      { name: "Speed of Sound in Gas", latex: "v = \\sqrt{\\frac{\\gamma P}{\\rho}} = \\sqrt{\\frac{\\gamma RT}{M}}", description: "Laplace's formula; γ = Cp/Cv" },
      { name: "Beats Frequency", latex: "f_{beats} = |f_1 - f_2|", description: "Beats per second" },
      { name: "Doppler Effect", latex: "f' = f\\frac{v \\pm v_o}{v \\mp v_s}", description: "+ for approach, − for recession (both observer & source)" },
      { name: "Fundamental — Open Pipe", latex: "f_1 = \\frac{v}{2L}", description: "All harmonics present" },
      { name: "Fundamental — Closed Pipe", latex: "f_1 = \\frac{v}{4L}", description: "Only odd harmonics" },
      { name: "Standing Wave — Nodes & Antinodes", latex: "y = 2A\\cos(kx)\\sin(\\omega t)", description: "Nodes at kx = π/2, 3π/2; antinodes at kx = 0, π" },
      { name: "Intensity of Sound", latex: "I = \\frac{P}{4\\pi r^2}", description: "Point source; decreases as 1/r²" },
    ]
  },
  {
    chapter: "Electric Charges and Fields",
    formulas: [
      { name: "Coulomb's Law", latex: "F = k\\frac{q_1 q_2}{r^2},\\quad k = \\frac{1}{4\\pi\\epsilon_0} = 9\\times10^9\\,\\text{N·m}^2\\text{/C}^2", description: "Force between two point charges" },
      { name: "Electric Field (Point Charge)", latex: "E = \\frac{kq}{r^2}", description: "Away from +ve, toward −ve charge" },
      { name: "Electric Field — Infinite Line Charge", latex: "E = \\frac{\\lambda}{2\\pi\\epsilon_0 r}", description: "λ = linear charge density; radially outward" },
      { name: "Electric Field — Infinite Sheet", latex: "E = \\frac{\\sigma}{2\\epsilon_0}", description: "σ = surface charge density; uniform and perpendicular" },
      { name: "Electric Dipole Moment", latex: "\\vec{p} = q\\vec{d}", description: "Direction: negative to positive charge" },
      { name: "Field on Dipole Axis (End-on)", latex: "E = \\frac{2kp}{r^3}", description: "Far field approximation" },
      { name: "Field on Dipole Equator (Broadside-on)", latex: "E = \\frac{kp}{r^3}", description: "Far field; direction opposite to p" },
      { name: "Gauss's Law", latex: "\\oint\\vec{E}\\cdot d\\vec{A} = \\frac{Q_{enc}}{\\epsilon_0}", description: "ε₀ = 8.85 × 10⁻¹² C²/N·m²" },
      { name: "Electric Flux", latex: "\\Phi_E = \\vec{E}\\cdot\\vec{A} = EA\\cos\\theta", description: "Through a surface" },
    ]
  },
  {
    chapter: "Electrostatic Potential and Capacitance",
    formulas: [
      { name: "Electric Potential (Point Charge)", latex: "V = \\frac{kq}{r}", description: "Work done per unit charge from ∞ to r" },
      { name: "Potential Difference", latex: "V_A - V_B = -\\int_B^A\\vec{E}\\cdot d\\vec{l}", description: "Work done per unit charge against E" },
      { name: "E and V Relation", latex: "E = -\\frac{dV}{dr}", description: "E in direction of steepest decrease in V" },
      { name: "Potential Due to Dipole (Axis)", latex: "V = \\frac{kp\\cos\\theta}{r^2}", description: "θ from dipole axis" },
      { name: "Capacitance", latex: "C = \\frac{Q}{V}", description: "Unit: Farad (F)" },
      { name: "Parallel Plate Capacitor", latex: "C = \\frac{\\epsilon_0 A}{d}", description: "A = plate area; d = separation" },
      { name: "With Dielectric", latex: "C' = KC = \\frac{K\\epsilon_0 A}{d}", description: "K = dielectric constant (K > 1)" },
      { name: "Series Combination", latex: "\\frac{1}{C_{eq}} = \\frac{1}{C_1}+\\frac{1}{C_2}+...", description: "Same charge on each; total V adds up" },
      { name: "Parallel Combination", latex: "C_{eq} = C_1+C_2+...", description: "Same voltage; charges add up" },
      { name: "Energy Stored in Capacitor", latex: "U = \\frac{Q^2}{2C} = \\frac{1}{2}CV^2 = \\frac{QV}{2}", description: "Stored in electric field between plates" },
      { name: "Energy Density", latex: "u = \\frac{1}{2}\\epsilon_0 E^2", description: "Energy per unit volume in electric field" },
    ]
  },
  {
    chapter: "Current Electricity",
    formulas: [
      { name: "Electric Current", latex: "I = \\frac{dq}{dt} = nAev_d", description: "n = free e⁻ density; v_d = drift velocity" },
      { name: "Ohm's Law", latex: "V = IR", description: "Valid for ohmic conductors at constant T" },
      { name: "Resistivity", latex: "R = \\rho\\frac{L}{A}", description: "ρ = resistivity (Ω·m)" },
      { name: "Temperature Coefficient of Resistance", latex: "R_T = R_0(1+\\alpha\\Delta T)", description: "α ≈ 0.004/°C for metals" },
      { name: "Power Dissipation", latex: "P = VI = I^2R = \\frac{V^2}{R}", description: "Heat generated per second" },
      { name: "EMF & Terminal Voltage", latex: "\\varepsilon = V + Ir = I(R+r)", description: "r = internal resistance; V = terminal voltage" },
      { name: "Kirchhoff's Current Law", latex: "\\sum I_{in} = \\sum I_{out}", description: "Charge conservation at junction" },
      { name: "Kirchhoff's Voltage Law", latex: "\\sum V_{loop} = 0", description: "Energy conservation in closed loop" },
      { name: "Series Resistors", latex: "R_{eq} = R_1+R_2+...", description: "Same current through all" },
      { name: "Parallel Resistors", latex: "\\frac{1}{R_{eq}} = \\frac{1}{R_1}+\\frac{1}{R_2}+...", description: "Same voltage across all" },
      { name: "Wheatstone Bridge (Balanced)", latex: "\\frac{P}{Q} = \\frac{R}{S}", description: "No current through galvanometer at balance" },
      { name: "Potentiometer Principle", latex: "\\frac{\\varepsilon_1}{\\varepsilon_2} = \\frac{l_1}{l_2}", description: "EMF proportional to balancing length" },
    ]
  },
  {
    chapter: "Moving Charges and Magnetism",
    formulas: [
      { name: "Biot-Savart Law", latex: "d\\vec{B} = \\frac{\\mu_0}{4\\pi}\\frac{I\\,d\\vec{l}\\times\\hat{r}}{r^2}", description: "μ₀ = 4π × 10⁻⁷ T·m/A" },
      { name: "Field at Center of Circular Loop", latex: "B = \\frac{\\mu_0 I}{2R}", description: "Single loop of radius R" },
      { name: "Field Inside Solenoid", latex: "B = \\mu_0 nI", description: "n = turns per meter; uniform inside" },
      { name: "Ampere's Law", latex: "\\oint\\vec{B}\\cdot d\\vec{l} = \\mu_0 I_{enc}", description: "For steady current" },
      { name: "Lorentz Force", latex: "\\vec{F} = q(\\vec{v}\\times\\vec{B})", description: "Force on moving charge in B field" },
      { name: "Force on Current Wire", latex: "\\vec{F} = I(\\vec{L}\\times\\vec{B})", description: "L = length vector along current direction" },
      { name: "Radius of Circular Motion", latex: "r = \\frac{mv}{qB}", description: "Charged particle in uniform B field" },
      { name: "Cyclotron Frequency", latex: "f = \\frac{qB}{2\\pi m}", description: "Independent of velocity (non-relativistic)" },
      { name: "Force between Parallel Wires", latex: "\\frac{F}{L} = \\frac{\\mu_0 I_1 I_2}{2\\pi d}", description: "Attractive for same-direction currents" },
      { name: "Torque on Current Loop", latex: "\\vec{\\tau} = \\vec{m}\\times\\vec{B} = NIAB\\sin\\theta", description: "m = NIA = magnetic moment" },
    ]
  },
  {
    chapter: "Magnetism and Matter",
    formulas: [
      { name: "Magnetic Dipole Moment", latex: "\\vec{m} = IA\\hat{n}", description: "Current loop; direction by right-hand rule" },
      { name: "Bar Magnet — Field on Axis", latex: "B_{axis} = \\frac{\\mu_0}{4\\pi}\\frac{2M}{r^3}", description: "M = magnetic dipole moment" },
      { name: "Bar Magnet — Field on Equator", latex: "B_{eq} = \\frac{\\mu_0}{4\\pi}\\frac{M}{r^3}", description: "Direction opposite to M" },
      { name: "Torque on Dipole", latex: "\\tau = MB\\sin\\theta", description: "Aligns magnetic moment with field" },
      { name: "Potential Energy of Dipole", latex: "U = -\\vec{M}\\cdot\\vec{B} = -MB\\cos\\theta", description: "Minimum (stable) at θ = 0" },
      { name: "Magnetic Susceptibility", latex: "\\chi_m = \\frac{M}{H}", description: "M = magnetisation; H = magnetic field intensity" },
      { name: "Relative Permeability", latex: "\\mu_r = 1 + \\chi_m", description: "Para: μr > 1; Dia: μr < 1; Ferro: μr >> 1" },
      { name: "Curie's Law", latex: "\\chi_m = \\frac{C}{T}", description: "Paramagnetics; C = Curie constant" },
    ]
  },
  {
    chapter: "Electromagnetic Induction",
    formulas: [
      { name: "Magnetic Flux", latex: "\\Phi_B = \\vec{B}\\cdot\\vec{A} = BA\\cos\\theta", description: "Unit: Weber (Wb) = T·m²" },
      { name: "Faraday's Law", latex: "\\varepsilon = -N\\frac{d\\Phi_B}{dt}", description: "Induced EMF opposes flux change (Lenz's Law)" },
      { name: "Motional EMF", latex: "\\varepsilon = Blv", description: "Conductor of length l moving at speed v ⊥ B" },
      { name: "Self-Inductance", latex: "\\varepsilon_L = -L\\frac{dI}{dt}", description: "L = self-inductance in Henry (H)" },
      { name: "Inductance of Solenoid", latex: "L = \\mu_0 n^2 Al", description: "n = turns/m, A = area, l = length" },
      { name: "Mutual Inductance", latex: "\\varepsilon_2 = -M\\frac{dI_1}{dt}", description: "M = mutual inductance between two coils" },
      { name: "Energy in Inductor", latex: "U_L = \\frac{1}{2}LI^2", description: "Stored as magnetic field energy" },
      { name: "Energy Density (B-field)", latex: "u = \\frac{B^2}{2\\mu_0}", description: "Magnetic energy per unit volume" },
    ]
  },
  {
    chapter: "Alternating Current",
    formulas: [
      { name: "RMS Values", latex: "V_{rms} = \\frac{V_0}{\\sqrt{2}},\\quad I_{rms} = \\frac{I_0}{\\sqrt{2}}", description: "For sinusoidal AC; V₀, I₀ = peak values" },
      { name: "Inductive Reactance", latex: "X_L = \\omega L = 2\\pi fL", description: "Opposition by inductor; increases with frequency" },
      { name: "Capacitive Reactance", latex: "X_C = \\frac{1}{\\omega C} = \\frac{1}{2\\pi fC}", description: "Opposition by capacitor; decreases with frequency" },
      { name: "Impedance (Series RLC)", latex: "Z = \\sqrt{R^2+(X_L-X_C)^2}", description: "Total AC opposition" },
      { name: "Phase Angle", latex: "\\tan\\phi = \\frac{X_L - X_C}{R}", description: "Phase of voltage w.r.t. current" },
      { name: "Resonance Frequency", latex: "f_0 = \\frac{1}{2\\pi\\sqrt{LC}}", description: "At resonance: Z = R (minimum), current maximum" },
      { name: "Quality Factor", latex: "Q = \\frac{\\omega_0 L}{R} = \\frac{1}{R}\\sqrt{\\frac{L}{C}}", description: "Sharpness of resonance" },
      { name: "Average Power", latex: "P_{avg} = V_{rms}I_{rms}\\cos\\phi = I_{rms}^2 R", description: "True power; φ = phase difference" },
      { name: "Power Factor", latex: "\\cos\\phi = \\frac{R}{Z}", description: "1 for pure resistive; 0 for pure reactive" },
      { name: "Transformer", latex: "\\frac{V_s}{V_p} = \\frac{N_s}{N_p} = \\frac{I_p}{I_s}", description: "Ideal transformer; N_s > N_p: step-up" },
    ]
  },
  {
    chapter: "Electromagnetic Waves",
    formulas: [
      { name: "Speed of EM Wave", latex: "c = \\frac{1}{\\sqrt{\\mu_0\\epsilon_0}} = 3\\times10^8\\text{ m/s}", description: "In vacuum; μ₀ = 4π × 10⁻⁷, ε₀ = 8.85 × 10⁻¹²" },
      { name: "Wave Equation (E-field)", latex: "E = E_0\\sin(kx-\\omega t)", description: "EM wave propagating in +x direction" },
      { name: "Relation E and B", latex: "\\frac{E_0}{B_0} = c", description: "E and B oscillate in phase; perpendicular to each other and to direction of propagation" },
      { name: "EM Wave Intensity", latex: "I = \\frac{1}{2}c\\epsilon_0 E_0^2 = \\frac{c}{2\\mu_0}B_0^2", description: "Average intensity" },
      { name: "Radiation Pressure (absorbed)", latex: "P_{rad} = \\frac{I}{c}", description: "Force per unit area from EM radiation" },
      { name: "Radiation Pressure (reflected)", latex: "P_{rad} = \\frac{2I}{c}", description: "For perfect reflector" },
    ]
  },
  {
    chapter: "Ray Optics and Optical Instruments",
    formulas: [
      { name: "Snell's Law", latex: "n_1\\sin\\theta_1 = n_2\\sin\\theta_2", description: "Refraction at interface" },
      { name: "Critical Angle (TIR)", latex: "\\sin\\theta_c = \\frac{n_2}{n_1}\\quad (n_1 > n_2)", description: "For total internal reflection" },
      { name: "Mirror Formula", latex: "\\frac{1}{v}+\\frac{1}{u} = \\frac{1}{f} = \\frac{2}{R}", description: "Sign convention: distances from pole" },
      { name: "Mirror Magnification", latex: "m = -\\frac{v}{u}", description: "+ve = erect; −ve = inverted" },
      { name: "Lens Formula", latex: "\\frac{1}{v}-\\frac{1}{u} = \\frac{1}{f}", description: "Cartesian sign convention" },
      { name: "Lens Magnification", latex: "m = \\frac{v}{u}", description: "+ve = virtual erect; −ve = real inverted" },
      { name: "Lensmaker's Formula", latex: "\\frac{1}{f} = (n-1)\\!\\left(\\frac{1}{R_1}-\\frac{1}{R_2}\\right)", description: "n = refractive index of lens material" },
      { name: "Power of Lens", latex: "P = \\frac{1}{f(\\text{m})}\\quad\\text{(Diopter, D)}", description: "Converging lens: +ve; Diverging: −ve" },
      { name: "Combined Power (in contact)", latex: "P = P_1 + P_2", description: "Two thin lenses in contact" },
      { name: "Prism — Minimum Deviation", latex: "\\mu = \\frac{\\sin\\left(\\frac{A+\\delta_m}{2}\\right)}{\\sin\\frac{A}{2}}", description: "A = apex angle; δ_m = minimum deviation" },
      { name: "Thin Prism Deviation", latex: "\\delta = (\\mu-1)A", description: "Small angle approximation" },
      { name: "Compound Microscope (M)", latex: "M = \\frac{L}{f_o}\\times\\frac{D}{f_e}", description: "L = tube length, D = 25 cm (least distance of distinct vision)" },
      { name: "Telescope Magnification", latex: "M = -\\frac{f_o}{f_e}", description: "−ve = inverted image; larger f_o and smaller f_e = more magnification" },
    ]
  },
  {
    chapter: "Wave Optics",
    formulas: [
      { name: "YDSE — Fringe Width", latex: "\\beta = \\frac{\\lambda D}{d}", description: "D = screen distance; d = slit separation" },
      { name: "YDSE — Bright Fringe Position", latex: "y_n = \\frac{n\\lambda D}{d}", description: "n = 0, ±1, ±2, ... (n=0 is central bright)" },
      { name: "YDSE — Dark Fringe Position", latex: "y_n = \\frac{(2n-1)\\lambda D}{2d}", description: "n = 1, 2, 3, ..." },
      { name: "Constructive Interference", latex: "\\Delta = n\\lambda", description: "Path difference = integer multiple of λ" },
      { name: "Destructive Interference", latex: "\\Delta = (2n-1)\\frac{\\lambda}{2}", description: "Path difference = odd multiple of λ/2" },
      { name: "Resultant Intensity", latex: "I = I_1 + I_2 + 2\\sqrt{I_1 I_2}\\cos\\delta", description: "δ = phase difference = 2πΔ/λ" },
      { name: "Single Slit — Diffraction Minima", latex: "a\\sin\\theta = n\\lambda,\\quad n = \\pm 1, \\pm 2...", description: "a = slit width; central maximum is widest" },
      { name: "Central Maximum Width (Single Slit)", latex: "w = \\frac{2\\lambda D}{a}", description: "Width of central bright fringe on screen" },
      { name: "Malus's Law", latex: "I = I_0\\cos^2\\theta", description: "Intensity after polariser at angle θ to the analyser" },
      { name: "Brewster's Angle", latex: "\\tan\\theta_p = n", description: "n = refractive index; reflected light fully plane-polarised" },
    ]
  },
  {
    chapter: "Dual Nature of Radiation and Matter",
    formulas: [
      { name: "Photoelectric Equation (Einstein)", latex: "KE_{max} = h\\nu - \\phi = eV_0", description: "φ = work function; V₀ = stopping potential" },
      { name: "Threshold Frequency", latex: "\\nu_0 = \\frac{\\phi}{h}", description: "Minimum frequency for photoelectric effect" },
      { name: "Photon Energy", latex: "E = h\\nu = \\frac{hc}{\\lambda}", description: "h = 6.626 × 10⁻³⁴ J·s; c = 3 × 10⁸ m/s" },
      { name: "Photon Momentum", latex: "p = \\frac{h}{\\lambda} = \\frac{E}{c}", description: "Photon has momentum despite zero rest mass" },
      { name: "de Broglie Wavelength", latex: "\\lambda = \\frac{h}{p} = \\frac{h}{mv}", description: "Matter wave associated with moving particle" },
      { name: "de Broglie (Accelerated Particle)", latex: "\\lambda = \\frac{h}{\\sqrt{2mqV}}", description: "Particle of charge q accelerated through V" },
      { name: "de Broglie (Thermal Particle)", latex: "\\lambda = \\frac{h}{\\sqrt{3mkT}}", description: "Particle in thermal equilibrium at T" },
    ]
  },
  {
    chapter: "Atoms",
    formulas: [
      { name: "Bohr's Radius (nth orbit)", latex: "r_n = a_0\\frac{n^2}{Z},\\quad a_0 = 0.529\\text{ Å}", description: "Z = atomic number; hydrogen: Z=1" },
      { name: "Velocity in nth Orbit", latex: "v_n = \\frac{Ze^2}{2\\epsilon_0 hn}", description: "Decreases as n increases; v₁ ≈ c/137" },
      { name: "Energy of nth Orbit (H-like)", latex: "E_n = -\\frac{13.6\\,Z^2}{n^2}\\text{ eV}", description: "Negative = bound state; ground state (n=1, Z=1): −13.6 eV" },
      { name: "Photon Emitted (Transition)", latex: "h\\nu = E_{n_2} - E_{n_1},\\quad n_2 > n_1", description: "Emission: from higher to lower orbit" },
      { name: "Rydberg Formula", latex: "\\frac{1}{\\lambda} = R_H Z^2\\!\\left(\\frac{1}{n_1^2}-\\frac{1}{n_2^2}\\right)", description: "R_H = 1.097 × 10⁷ m⁻¹" },
      { name: "Spectral Series (Hydrogen)", latex: "n_1 = 1\\text{ (Lyman)},\\; 2\\text{ (Balmer)},\\; 3\\text{ (Paschen)}", description: "Lyman: UV; Balmer: visible; Paschen: IR" },
      { name: "de Broglie Condition (Bohr)", latex: "n\\lambda = 2\\pi r_n", description: "Standing wave condition for electron orbits" },
    ]
  },
  {
    chapter: "Nuclei",
    formulas: [
      { name: "Nuclear Radius", latex: "R = R_0 A^{1/3},\\quad R_0 = 1.2\\times10^{-15}\\text{ m}", description: "A = mass number; nuclear density is constant" },
      { name: "Mass Defect", latex: "\\Delta m = [Zm_p + Nm_n - M_{nucleus}]", description: "Z protons + N neutrons; N = A − Z" },
      { name: "Binding Energy", latex: "BE = \\Delta m\\cdot c^2 = \\Delta m\\times 931.5\\text{ MeV}", description: "1 amu = 931.5 MeV/c²" },
      { name: "Radioactive Decay Law", latex: "N = N_0 e^{-\\lambda t}", description: "λ = decay constant (s⁻¹)" },
      { name: "Half-Life", latex: "T_{1/2} = \\frac{\\ln 2}{\\lambda} = \\frac{0.693}{\\lambda}", description: "Time for half the nuclei to decay" },
      { name: "Mean Life", latex: "\\tau = \\frac{1}{\\lambda} = \\frac{T_{1/2}}{\\ln 2} \\approx 1.44\\,T_{1/2}", description: "Average lifetime of a nucleus" },
      { name: "Activity", latex: "A = \\lambda N = A_0 e^{-\\lambda t}", description: "Unit: Becquerel (Bq) = 1 decay/s; 1 Curie = 3.7 × 10¹⁰ Bq" },
      { name: "Alpha Decay", latex: "^A_Z X \\rightarrow{}^{A-4}_{Z-2}Y + {}^4_2He", description: "A decreases by 4, Z by 2" },
      { name: "Beta (β⁻) Decay", latex: "^A_Z X \\rightarrow{}^{A}_{Z+1}Y + e^- + \\bar{\\nu}_e", description: "Z increases by 1; antineutrino emitted" },
    ]
  },
  {
    chapter: "Semiconductor Electronics",
    formulas: [
      { name: "Intrinsic Carrier Concentration", latex: "n_i^2 = n_e \\cdot n_h", description: "Mass action law; n_i increases with temperature" },
      { name: "Diode Current (Ideal)", latex: "I = I_0\\!\\left(e^{V/\\eta V_T}-1\\right)", description: "V_T = kT/e ≈ 26 mV at 300 K; η = ideality factor" },
      { name: "Rectifier — Half Wave (Avg)", latex: "I_{dc} = \\frac{I_m}{\\pi}", description: "Average output current" },
      { name: "Rectifier — Full Wave (Avg)", latex: "I_{dc} = \\frac{2I_m}{\\pi}", description: "Higher DC output than half wave" },
      { name: "Transistor CE Current Gain (β)", latex: "\\beta = \\frac{I_C}{I_B}", description: "Common-emitter configuration; typical β: 20 – 500" },
      { name: "Transistor CB Current Gain (α)", latex: "\\alpha = \\frac{I_C}{I_E},\\quad \\alpha < 1", description: "Common-base; α and β relation: β = α/(1−α)" },
      { name: "Relation α and β", latex: "\\beta = \\frac{\\alpha}{1-\\alpha},\\quad \\alpha = \\frac{\\beta}{1+\\beta}", description: "Both > 0; α < 1; β can be large" },
      { name: "Logic Gates", latex: "\\text{AND: }Y=A\\cdot B,\\;\\text{OR: }Y=A+B,\\;\\text{NOT: }Y=\\bar{A}", description: "NAND and NOR are universal gates" },
    ]
  },
  {
    chapter: "Communication Systems",
    formulas: [
      { name: "Modulation Index (AM)", latex: "m_a = \\frac{A_m}{A_c}", description: "A_m = message amplitude; A_c = carrier amplitude; m_a ≤ 1 for no distortion" },
      { name: "AM Bandwidth", latex: "BW = 2f_m", description: "f_m = maximum message frequency" },
      { name: "FM Modulation Index", latex: "m_f = \\frac{\\Delta f}{f_m}", description: "Δf = frequency deviation; f_m = message frequency" },
      { name: "Range of Ground Waves", latex: "d = \\sqrt{2Rh}", description: "h = antenna height; R = 6400 km (Earth radius)" },
      { name: "Line of Sight (LoS)", latex: "d_T + d_R = \\sqrt{2Rh_T} + \\sqrt{2Rh_R}", description: "d_T and d_R for transmitter and receiver antennas" },
      { name: "Sampling Theorem", latex: "f_s \\geq 2f_{max}", description: "Nyquist rate: sampling frequency ≥ 2× max signal frequency" },
    ]
  }
];

export default PhysicsFormulaData;
