// Chemistry Formula Data — chapters match syllabusData.js exactly (30 chapters)
const ChemistryFormulaData = [
  {
    chapter: "Some Basic Concepts of Chemistry",
    formulas: [
      { name: "Avogadro's Number", latex: "N_A = 6.022\\times10^{23}\\text{ mol}^{-1}", description: "Number of entities in 1 mole" },
      { name: "Moles from Mass", latex: "n = \\frac{\\text{mass (g)}}{\\text{molar mass (g/mol)}}", description: "Most fundamental mole calculation" },
      { name: "Number of Particles", latex: "N = n \\times N_A", description: "Total particles in n moles" },
      { name: "Percent Composition", latex: "\\%X = \\frac{\\text{mass of X in 1 mol compound}}{\\text{molar mass of compound}}\\times100", description: "Elemental percentage" },
      { name: "Empirical Formula Multiplier", latex: "n = \\frac{\\text{molecular mass}}{\\text{empirical formula mass}}", description: "Integer that converts empirical to molecular formula" },
      { name: "Molarity", latex: "M = \\frac{n_{solute}}{V_{solution}(\\text{L})}", description: "Moles of solute per litre of solution" },
      { name: "Molality", latex: "m = \\frac{n_{solute}}{W_{solvent}(\\text{kg})}", description: "Independent of temperature; preferred for colligative properties" },
      { name: "Mole Fraction", latex: "\\chi_A = \\frac{n_A}{n_A + n_B + ...}", description: "Dimensionless; all mole fractions sum to 1" },
      { name: "Normality", latex: "N = M \\times n\\text{-factor}", description: "n-factor = valency / change in O.S. / H⁺ or OH⁻ per formula unit" },
      { name: "Dilution Law", latex: "M_1V_1 = M_2V_2", description: "Moles of solute remain constant on dilution" },
      { name: "Law of Conservation of Mass", latex: "\\sum m_{reactants} = \\sum m_{products}", description: "Mass is neither created nor destroyed" },
    ]
  },
  {
    chapter: "Structure of Atom",
    formulas: [
      { name: "Bohr Radius (nth orbit)", latex: "r_n = 0.529\\frac{n^2}{Z}\\text{ Å}", description: "Å = 10⁻¹⁰ m; for hydrogen Z = 1" },
      { name: "Energy of nth Orbit", latex: "E_n = -\\frac{13.6\\,Z^2}{n^2}\\text{ eV}", description: "Negative sign indicates bound state" },
      { name: "Velocity in nth Orbit", latex: "v_n = 2.18\\times10^6\\frac{Z}{n}\\text{ m/s}", description: "Decreases with n; increases with Z" },
      { name: "Rydberg Formula", latex: "\\frac{1}{\\lambda} = R_H Z^2\\!\\left(\\frac{1}{n_1^2}-\\frac{1}{n_2^2}\\right)", description: "R_H = 1.097 × 10⁷ m⁻¹; n₂ > n₁" },
      { name: "de Broglie Wavelength", latex: "\\lambda = \\frac{h}{mv}", description: "h = 6.626 × 10⁻³⁴ J·s" },
      { name: "Heisenberg Uncertainty Principle", latex: "\\Delta x\\cdot\\Delta p \\geq \\frac{h}{4\\pi}", description: "Cannot determine both position and momentum precisely" },
      { name: "Number of Orbitals in Subshell", latex: "(2l+1)", description: "l = 0(s): 1; l=1(p): 3; l=2(d): 5; l=3(f): 7" },
      { name: "Max Electrons in Shell n", latex: "2n^2", description: "K=2, L=8, M=18, N=32" },
      { name: "Photon Energy (Planck)", latex: "E = h\\nu = \\frac{hc}{\\lambda}", description: "h = 6.626 × 10⁻³⁴ J·s; c = 3 × 10⁸ m/s" },
    ]
  },
  {
    chapter: "Classification of Elements and Periodicity",
    formulas: [
      { name: "Effective Nuclear Charge", latex: "Z^* = Z - \\sigma", description: "Z = atomic number; σ = shielding constant (Slater's rules)" },
      { name: "Atomic Radius Trend", latex: "\\text{Across period: }r\\downarrow,\\quad\\text{Down group: }r\\uparrow", description: "Due to increasing Z* across and addition of shells down" },
      { name: "Ionisation Energy Trend", latex: "\\text{IE}_1 < \\text{IE}_2 < \\text{IE}_3 < ...", description: "Successive IEs increase; large jump indicates noble gas config." },
      { name: "Electronegativity (Pauling Scale)", latex: "\\chi_A - \\chi_B = 0.102\\sqrt{\\Delta}", description: "Δ = extra ionic resonance energy in kJ/mol" },
      { name: "Group Number from Electron Configuration", latex: "\\text{Group} = \\text{no. of valence electrons}", description: "For s and p blocks" },
      { name: "Period Number", latex: "\\text{Period} = \\text{highest principal quantum number (n)}", description: "Number of occupied electron shells" },
    ]
  },
  {
    chapter: "Chemical Bonding and Molecular Structure",
    formulas: [
      { name: "Formal Charge", latex: "FC = V - N - \\frac{B}{2}", description: "V = valence e⁻; N = non-bonding e⁻; B = bonding e⁻" },
      { name: "Bond Order (MOT)", latex: "BO = \\frac{N_b - N_{ab}}{2}", description: "N_b = bonding e⁻; N_ab = antibonding e⁻" },
      { name: "Dipole Moment", latex: "\\mu = q\\times d", description: "q = charge; d = bond length; unit: Debye (D) = 3.336 × 10⁻³⁰ C·m" },
      { name: "Hybridisation Index", latex: "H = \\frac{1}{2}(V + M - C + A)", description: "V = valence e⁻; M = monovalent atoms; C = cation charge; A = anion charge" },
      { name: "VSEPR — Total Electron Pairs", latex: "\\text{Total EP} = \\text{Bonding Pairs (BP)} + \\text{Lone Pairs (LP)}", description: "Geometry: 2-linear, 3-trig. planar, 4-tetra, 5-tbp, 6-octahedral" },
      { name: "Resonance Structures", latex: "\\text{Bond Order} = \\frac{\\text{total bonds}}{\\text{no. of resonating bonds}}", description: "Example: O₃ bond order = 1.5; benzene = 1.5" },
      { name: "Lattice Energy (Born-Landé)", latex: "U = -\\frac{N_A M z^+ z^- e^2}{4\\pi\\epsilon_0 r_0}\\!\\left(1-\\frac{1}{n}\\right)", description: "M = Madelung constant; n = Born exponent (5–12)" },
    ]
  },
  {
    chapter: "States of Matter",
    formulas: [
      { name: "Ideal Gas Law", latex: "PV = nRT", description: "R = 8.314 J/mol·K = 0.0821 L·atm/mol·K" },
      { name: "Combined Gas Law", latex: "\\frac{P_1V_1}{T_1} = \\frac{P_2V_2}{T_2}", description: "For fixed amount of ideal gas" },
      { name: "Dalton's Law", latex: "P_{total} = P_1 + P_2 + ... = \\sum\\chi_i P_{total}", description: "P_i = χ_i × P_total; partial pressure" },
      { name: "Graham's Law of Diffusion", latex: "\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}} = \\frac{d_2}{d_1}^{1/2}", description: "Lighter gases diffuse faster" },
      { name: "Van der Waals Equation", latex: "\\left(P+\\frac{an^2}{V^2}\\right)(V-nb) = nRT", description: "a = attraction correction; b = volume correction" },
      { name: "Compressibility Factor", latex: "Z = \\frac{PV}{nRT}", description: "Z=1 ideal; Z>1 repulsion dominant; Z<1 attraction dominant" },
      { name: "RMS Speed", latex: "u_{rms} = \\sqrt{\\frac{3RT}{M}}", description: "M in kg/mol; largest of the three speeds" },
      { name: "Most Probable Speed", latex: "u_{mp} = \\sqrt{\\frac{2RT}{M}}", description: "Speed at peak of Maxwell distribution; smallest" },
      { name: "Average Speed", latex: "u_{avg} = \\sqrt{\\frac{8RT}{\\pi M}}", description: "Between u_mp and u_rms" },
      { name: "Van der Waals Constants", latex: "T_c = \\frac{8a}{27Rb},\\quad P_c = \\frac{a}{27b^2},\\quad V_c = 3nb", description: "Critical constants in terms of a, b" },
    ]
  },
  {
    chapter: "Thermodynamics",
    formulas: [
      { name: "First Law", latex: "\\Delta U = q + w \\quad (q = \\text{heat absorbed},\\;w = \\text{work done on system})", description: "Energy conservation" },
      { name: "Work by Gas (expansion)", latex: "w_{by} = -P_{ext}\\Delta V", description: "Negative: gas expands and does work on surroundings" },
      { name: "Enthalpy", latex: "H = U + PV,\\quad \\Delta H = \\Delta U + P\\Delta V = \\Delta U + \\Delta n_g RT", description: "Δn_g = moles of gaseous products − reactants" },
      { name: "Hess's Law", latex: "\\Delta H_{rxn} = \\sum\\Delta H_f^\\circ(\\text{products}) - \\sum\\Delta H_f^\\circ(\\text{reactants})", description: "Enthalpy is a state function; path-independent" },
      { name: "Bond Enthalpy", latex: "\\Delta H_{rxn} = \\sum BE(\\text{broken}) - \\sum BE(\\text{formed})", description: "Breaking is endothermic (+); formation is exothermic (−)" },
      { name: "Gibbs Free Energy", latex: "\\Delta G = \\Delta H - T\\Delta S", description: "Spontaneous if ΔG < 0 at constant T and P" },
      { name: "Standard Free Energy & K", latex: "\\Delta G^\\circ = -RT\\ln K = -2.303RT\\log K", description: "Links thermodynamics and equilibrium" },
      { name: "Entropy Change", latex: "\\Delta S = \\frac{q_{rev}}{T}", description: "Reversible heat exchange per kelvin; increases with disorder" },
      { name: "Kirchhoff's Law", latex: "\\Delta H_2^\\circ = \\Delta H_1^\\circ + \\Delta C_P(T_2-T_1)", description: "Temperature correction of enthalpy" },
    ]
  },
  {
    chapter: "Equilibrium",
    formulas: [
      { name: "Equilibrium Constant Kc", latex: "K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}", description: "For aA + bB ⇌ cC + dD; constant at fixed T" },
      { name: "Kp and Kc", latex: "K_p = K_c(RT)^{\\Delta n_g}", description: "Δn_g = moles of gaseous products − reactants" },
      { name: "Reaction Quotient Q", latex: "Q < K\\Rightarrow\\text{forward};\\quad Q > K\\Rightarrow\\text{backward}", description: "Q = Kc expression at any moment, not equilibrium" },
      { name: "Degree of Dissociation", latex: "\\alpha = \\frac{\\text{moles dissociated}}{\\text{initial moles}}", description: "Range 0 to 1" },
      { name: "Van't Hoff Equation", latex: "\\ln\\frac{K_2}{K_1} = -\\frac{\\Delta H^\\circ}{R}\\!\\left(\\frac{1}{T_2}-\\frac{1}{T_1}\\right)", description: "Effect of temperature on K" },
      { name: "pH Definition", latex: "pH = -\\log[H^+] = -\\log[H_3O^+]", description: "pH + pOH = 14 at 25°C" },
      { name: "Ionic Product of Water", latex: "K_w = [H^+][OH^-] = 10^{-14}\\text{ at 25°C}", description: "pKw = 14" },
      { name: "Weak Acid [H⁺]", latex: "[H^+] = \\sqrt{K_a\\cdot C}", description: "Assuming α << 1; C = initial concentration" },
      { name: "Henderson-Hasselbalch", latex: "pH = pK_a + \\log\\frac{[A^-]}{[HA]}", description: "Buffer solution of weak acid and its conjugate base" },
      { name: "Solubility Product (Ksp)", latex: "K_{sp} = [M^{m+}]^m[X^{n-}]^n", description: "For M_m X_n; precipitate forms if Q > K_sp" },
    ]
  },
  {
    chapter: "Redox Reactions",
    formulas: [
      { name: "Oxidation State Rules", latex: "\\text{Sum of OS in compound} = \\text{charge of species}", description: "OS of O usually −2; H usually +1" },
      { name: "n-factor (Redox)", latex: "n = \\frac{\\text{change in OS}}{\\text{formula unit}}", description: "Used to find normality and equivalents" },
      { name: "Equivalents (Redox)", latex: "\\text{equivalents} = n \\times \\text{moles}", description: "Equivalents of oxidant = equivalents of reductant at equivalence" },
      { name: "Half-Reaction Method", latex: "\\text{(Oxidation half)} + \\text{(Reduction half)} = \\text{balanced equation}", description: "Balance atoms, then balance charge with e⁻" },
      { name: "Cell Potential", latex: "E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode}", description: "Positive E° = spontaneous under standard conditions" },
    ]
  },
  {
    chapter: "Hydrogen",
    formulas: [
      { name: "H₂O₂ Oxidation State", latex: "\\text{OS of O in H}_2\\text{O}_2 = -1", description: "Between −2 (water) and 0 (O₂); acts as both oxidant and reductant" },
      { name: "H₂O₂ Normality", latex: "N = M\\times2", description: "n-factor of H₂O₂ = 2 in most redox reactions" },
      { name: "Strength of H₂O₂ (volume strength)", latex: "\\text{Volume strength} = 5.6\\times N = 11.2\\times M", description: "Volume of O₂ (mL at STP) released by 1 mL of H₂O₂" },
      { name: "Structure of Water", latex: "\\angle H\\text{-}O\\text{-}H = 104.5°", description: "Bent/V-shaped; sp³ hybridised O with 2 lone pairs" },
      { name: "Hard Water Hardness", latex: "\\text{Temporary hardness: HCO}_3^-\\text{ salts; Permanent: Cl}^-,\\text{SO}_4^{2-}\\text{ salts}", description: "Temporary removed by boiling; permanent by chemicals" },
    ]
  },
  {
    chapter: "s-Block Elements",
    formulas: [
      { name: "Flame Test Colors", latex: "\\text{Li: crimson, Na: golden, K: lilac, Ca: brick red, Sr: crimson, Ba: apple green}", description: "Characteristic emission due to electronic transitions" },
      { name: "Diagonal Relationship", latex: "\\text{Li}\\sim\\text{Mg};\\quad\\text{Be}\\sim\\text{Al};\\quad\\text{Na}\\sim\\text{Ca}", description: "Similar properties due to comparable charge/radius ratio" },
      { name: "Hydration Enthalpy Order (Alkali)", latex: "\\text{Li}^+ > \\text{Na}^+ > \\text{K}^+ > \\text{Rb}^+ > \\text{Cs}^+", description: "Smaller ion → higher charge density → more hydration" },
      { name: "Reaction with Water", latex: "2M + 2H_2O \\rightarrow 2MOH + H_2\\uparrow", description: "M = Group 1 alkali metals; reactivity increases down the group" },
    ]
  },
  {
    chapter: "p-Block Elements",
    formulas: [
      { name: "Boron Family (Group 13)", latex: "\\text{Valence e}^-: ns^2np^1,\\quad\\text{usual OS: +3}", description: "B is metalloid; Al, Ga, In, Tl are metals" },
      { name: "Carbon Family (Group 14)", latex: "\\text{Valence e}^-: ns^2np^2,\\quad\\text{usual OS: +4, +2}", description: "C is unique: catenation, allotropes, tetravalency" },
      { name: "Nitrogen Family (Group 15)", latex: "\\text{OS range: }-3\\text{ to }+5", description: "N: −3(NH₃) to +5(HNO₃); P: −3 to +5" },
      { name: "Oxygen Family (Group 16)", latex: "\\text{OS of O: }0\\text{ to }-2 \\text{ (usually }-2\\text{)}", description: "Highest EN after F; S shows +4 and +6 also" },
      { name: "Halogen Family (Group 17)", latex: "\\text{Oxidising power: }F_2 > Cl_2 > Br_2 > I_2", description: "F₂ strongest oxidising agent; cannot be oxidised further" },
      { name: "Noble Gases (Group 18)", latex: "\\text{Ionisation Energy: highest in period}", description: "Xe forms compounds: XeF₂, XeF₄, XeO₃ etc." },
      { name: "Oxyacid Strength (Halogens)", latex: "\\text{HClO} < \\text{HClO}_2 < \\text{HClO}_3 < \\text{HClO}_4", description: "More O atoms → more electron withdrawal → stronger acid" },
    ]
  },
  {
    chapter: "Organic Chemistry - Basic Principles",
    formulas: [
      { name: "Degree of Unsaturation (DBE)", latex: "DBE = \\frac{2C+2+N-H-X}{2}", description: "C = carbons, H = hydrogens, N = nitrogens, X = halogens; O and S ignored" },
      { name: "Inductive Effect Order (−I)", latex: "-F > -Cl > -Br > -I > -OR > -OH > -NH_2", description: "Electron-withdrawing through σ-bonds" },
      { name: "Resonance Effect (+M)", latex: "-OH,\\,-NH_2,\\,-OR:\\text{ lone pair into ring (+M)}", description: "+M groups increase electron density on ring" },
      { name: "Resonance Effect (−M)", latex: "-NO_2,\\,-CHO,\\,-COOH,\\,-CN:\\text{ withdraw by }\\pi\\text{ (+)M)}", description: "Electron-withdrawing via π system" },
      { name: "Acidity (pKa)", latex: "\\text{More stable conjugate base} = \\text{more acidic}", description: "pKa: HF(3.2) > CH₃COOH(4.7) > HCN(9.2) > H₂O(15.7)" },
      { name: "SN1 vs SN2", latex: "\\text{SN1: 3°>2°>1°, SN2: 1°>2°>3°}", description: "SN1: carbocation stability; SN2: steric hindrance matters" },
      { name: "Markovnikov's Rule", latex: "H\\text{ adds to C with more H atoms (HX addition to alkenes)}", description: "Carbocation stability: 3° > 2° > 1°" },
    ]
  },
  {
    chapter: "Hydrocarbons",
    formulas: [
      { name: "General Formula", latex: "\\text{Alkane: }C_nH_{2n+2},\\;\\text{Alkene: }C_nH_{2n},\\;\\text{Alkyne: }C_nH_{2n-2}", description: "Each degree of unsaturation removes 2H" },
      { name: "Combustion of Alkane", latex: "C_nH_{2n+2} + \\frac{3n+1}{2}O_2 \\rightarrow nCO_2 + (n+1)H_2O", description: "Complete combustion in excess O₂" },
      { name: "Ozonolysis (Alkene)", latex: "\\text{C=C} + O_3\\xrightarrow{\\text{Zn/H}_2\\text{O}} \\text{two carbonyl compounds}", description: "Cleavage of C=C double bond; identifies position of double bond" },
      { name: "Wurtz Reaction", latex: "2\\text{RX} + 2\\text{Na}\\xrightarrow{\\text{dry ether}} \\text{R-R} + 2\\text{NaX}", description: "Coupling of alkyl halides; best for symmetric products" },
      { name: "Aromaticity (Hückel)", latex: "4n+2\\text{ π electrons},\\quad n = 0,1,2,...", description: "Benzene: n=1 (6π); cyclopentadienyl anion: n=1 (6π)" },
      { name: "Friedel-Crafts Alkylation", latex: "\\text{C}_6\\text{H}_6 + \\text{RCl}\\xrightarrow{\\text{AlCl}_3} \\text{C}_6\\text{H}_5\\text{R} + \\text{HCl}", description: "Electrophilic aromatic substitution; Lewis acid catalyst" },
    ]
  },
  {
    chapter: "Environmental Chemistry",
    formulas: [
      { name: "BOD", latex: "\\text{BOD} = \\text{Biochemical Oxygen Demand}", description: "Amount of O₂ needed by microbes to decompose organic matter in water; higher BOD = more polluted" },
      { name: "Ozone Depletion", latex: "\\text{Cl}^\\bullet + \\text{O}_3 \\rightarrow \\text{ClO}^\\bullet + \\text{O}_2", description: "CFC-derived Cl radicals destroy ozone catalytically" },
      { name: "Photochemical Smog", latex: "\\text{NO}_2 \\xrightarrow{h\\nu} \\text{NO} + \\text{O}^\\bullet,\\quad \\text{O}^\\bullet + \\text{O}_2 \\rightarrow \\text{O}_3", description: "Ozone formed at ground level (harmful); different from stratospheric ozone" },
      { name: "Greenhouse Gases", latex: "\\text{CO}_2,\\,\\text{CH}_4,\\,\\text{N}_2\\text{O},\\,\\text{CFCs},\\,\\text{H}_2\\text{O vapour}", description: "Absorb and re-emit IR radiation causing warming" },
      { name: "pH of Acid Rain", latex: "\\text{pH} < 5.6", description: "CO₂ + H₂O → H₂CO₃; SO₂, NOx make it more acidic" },
    ]
  },
  {
    chapter: "Solid State",
    formulas: [
      { name: "Packing Efficiency — Simple Cubic", latex: "PE = \\frac{\\frac{4}{3}\\pi r^3}{a^3}\\times100 = 52.4\\%", description: "a = 2r; 1 atom per unit cell" },
      { name: "Packing Efficiency — BCC", latex: "PE = 68\\%", description: "a√3 = 4r; 2 atoms per unit cell" },
      { name: "Packing Efficiency — FCC/HCP", latex: "PE = 74\\%", description: "a√2 = 4r; 4 atoms per unit cell (FCC); most efficient" },
      { name: "Number of Atoms per Unit Cell", latex: "Z = N_{corner}\\times\\frac{1}{8} + N_{face}\\times\\frac{1}{2} + N_{edge}\\times\\frac{1}{4} + N_{body}\\times1", description: "Contribution rule for different positions" },
      { name: "Density of Crystal", latex: "\\rho = \\frac{Z\\times M}{N_A\\times a^3}", description: "Z = atoms/cell; M = molar mass; a = edge length" },
      { name: "Schottky Defect", latex: "n_s = N\\,e^{-\\Delta H_s/2RT}", description: "Equal cation and anion vacancies; density decreases" },
      { name: "Frenkel Defect", latex: "n_F = \\sqrt{NN'}\\,e^{-\\Delta H_F/2RT}", description: "Ion shifts to interstitial site; density unchanged" },
    ]
  },
  {
    chapter: "Solutions",
    formulas: [
      { name: "Raoult's Law", latex: "P_A = \\chi_A P_A^\\circ", description: "Partial vapour pressure of A = mole fraction × VP of pure A" },
      { name: "Vapour Pressure Lowering", latex: "\\frac{P^\\circ - P_s}{P^\\circ} = \\chi_{solute}", description: "Relative lowering of vapour pressure" },
      { name: "Boiling Point Elevation", latex: "\\Delta T_b = K_b\\cdot m", description: "K_b for water = 0.52 K·kg/mol; m = molality" },
      { name: "Freezing Point Depression", latex: "\\Delta T_f = K_f\\cdot m", description: "K_f for water = 1.86 K·kg/mol; m = molality" },
      { name: "Osmotic Pressure", latex: "\\pi = CRT = \\frac{nRT}{V}", description: "C = molarity; R = 0.0821 L·atm/mol·K; isotonic: π₁ = π₂" },
      { name: "Van't Hoff Factor", latex: "i = \\frac{\\text{observed colligative property}}{\\text{ideal colligative property}}", description: "i > 1: dissociation; i < 1: association" },
      { name: "Modified Colligative Property", latex: "\\Delta T_b = iK_b m,\\quad\\pi = iCRT", description: "i accounts for electrolyte dissociation" },
      { name: "Degree of Dissociation from i", latex: "\\alpha = \\frac{i-1}{n-1}", description: "n = number of ions produced per formula unit" },
      { name: "Henry's Law", latex: "p = K_H\\cdot\\chi", description: "Solubility of gas ∝ partial pressure above solution; K_H varies with gas and T" },
    ]
  },
  {
    chapter: "Electrochemistry",
    formulas: [
      { name: "Standard Cell Potential", latex: "E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode}", description: "Positive E° = spontaneous (galvanic cell)" },
      { name: "Nernst Equation (25°C)", latex: "E_{cell} = E^\\circ_{cell} - \\frac{0.0592}{n}\\log Q", description: "n = electrons transferred; Q = reaction quotient" },
      { name: "Gibbs Energy & Cell Potential", latex: "\\Delta G^\\circ = -nFE^\\circ_{cell}", description: "F = 96485 C/mol (Faraday's constant)" },
      { name: "Equilibrium from E°", latex: "\\log K = \\frac{nE^\\circ_{cell}}{0.0592}\\quad\\text{at 25°C}", description: "Links thermodynamics, electrochemistry and equilibrium" },
      { name: "Faraday's First Law", latex: "m = \\frac{M\\cdot I\\cdot t}{n\\cdot F}", description: "M = molar mass; n = n-factor; I = current (A); t = time (s)" },
      { name: "Faraday's Second Law", latex: "\\frac{m_1}{m_2} = \\frac{E_1}{E_2}", description: "E = equivalent weight = M/n-factor" },
      { name: "Molar Conductivity", latex: "\\Lambda_m = \\frac{\\kappa\\times1000}{M}", description: "κ = specific conductance (S/cm); M = molarity" },
      { name: "Kohlrausch's Law", latex: "\\Lambda_m^\\infty = \\nu_+\\lambda_+^\\infty + \\nu_-\\lambda_-^\\infty", description: "At infinite dilution; independent ionic contributions" },
      { name: "α from Conductance", latex: "\\alpha = \\frac{\\Lambda_m}{\\Lambda_m^\\infty}", description: "Degree of dissociation for weak electrolytes" },
    ]
  },
  {
    chapter: "Chemical Kinetics",
    formulas: [
      { name: "Rate of Reaction", latex: "r = -\\frac{1}{a}\\frac{d[A]}{dt} = +\\frac{1}{c}\\frac{d[C]}{dt}", description: "For aA + bB → cC + dD; always positive" },
      { name: "Rate Law", latex: "r = k[A]^m[B]^n", description: "m, n = orders; determined experimentally (not stoichiometry)" },
      { name: "Units of k (nth order)", latex: "[k] = (\\text{mol/L})^{1-n}\\cdot\\text{s}^{-1}", description: "Zero order: mol/L·s; First order: s⁻¹; Second order: L/mol·s" },
      { name: "Zero Order: [A] vs t", latex: "[A] = [A]_0 - kt,\\quad t_{1/2} = \\frac{[A]_0}{2k}", description: "Linear [A]–t graph; half-life depends on [A]₀" },
      { name: "First Order: [A] vs t", latex: "[A] = [A]_0 e^{-kt},\\quad\\ln[A] = \\ln[A]_0 - kt", description: "Exponential decay; linear ln[A]–t graph" },
      { name: "First Order Half-Life", latex: "t_{1/2} = \\frac{\\ln2}{k} = \\frac{0.693}{k}", description: "Independent of [A]₀ — key identifier of first order" },
      { name: "Arrhenius Equation", latex: "k = Ae^{-E_a/RT}", description: "A = frequency factor; E_a = activation energy (J/mol)" },
      { name: "Arrhenius: Two Temperatures", latex: "\\log\\frac{k_2}{k_1} = \\frac{E_a}{2.303R}\\!\\left(\\frac{1}{T_1}-\\frac{1}{T_2}\\right)", description: "Used to calculate E_a or predict k at new temperature" },
    ]
  },
  {
    chapter: "Surface Chemistry",
    formulas: [
      { name: "Freundlich Isotherm", latex: "\\frac{x}{m} = kP^{1/n}\\quad(0 < \\tfrac{1}{n} < 1)", description: "x/m = amount adsorbed per gram of adsorbent" },
      { name: "Freundlich (log form)", latex: "\\log\\frac{x}{m} = \\log k + \\frac{1}{n}\\log P", description: "Straight line graph; slope = 1/n, intercept = log k" },
      { name: "Langmuir Isotherm", latex: "\\frac{x}{m} = \\frac{aP}{1+bP}", description: "Monolayer adsorption; a, b = Langmuir constants" },
      { name: "Tyndall Effect", latex: "\\text{Colloid particle size: 1–1000 nm}", description: "Scattering of light by colloidal particles; not seen in true solutions" },
      { name: "Coagulation (Hardy-Schulze Rule)", latex: "\\text{Higher charge of coagulating ion} = \\text{greater coagulating power}", description: "Trivalent > divalent > monovalent" },
    ]
  },
  {
    chapter: "General Principles and Processes of Isolation of Elements",
    formulas: [
      { name: "Ellingham Diagram Criterion", latex: "\\Delta G = \\Delta H - T\\Delta S < 0\\text{ for feasible reduction}", description: "Lower ΔG°_formation means stronger reducing agent at that T" },
      { name: "Flux Reactions", latex: "\\text{Basic flux (CaO) + acidic gangue (SiO}_2\\text{)} \\rightarrow \\text{slag}", description: "Flux removes gangue as slag; acidic flux for basic gangue" },
      { name: "van Arkel Method", latex: "\\text{TiI}_4\\xrightarrow{\\Delta}\\text{Ti (pure)} + 2\\text{I}_2", description: "Thermal decomposition for purification of Ti, Zr, Si" },
      { name: "Zone Refining", latex: "k = \\frac{c_s}{c_l} < 1\\text{ (impurity concentrates in melt)}", description: "k = distribution coefficient; impurity swept to one end" },
    ]
  },
  {
    chapter: "p-Block Elements (Group 15-18)",
    formulas: [
      { name: "Bond Angle: NH₃ vs PH₃", latex: "\\angle\\text{H-N-H} = 107.8°\\; > \\;\\angle\\text{H-P-H} = 93.5°", description: "N: large lone pair repulsion on small central atom" },
      { name: "Acid Strength of Oxoacids (N)", latex: "\\text{HNO}_3 > \\text{HNO}_2", description: "+5 oxidation state → stronger acid; more O atoms" },
      { name: "Thermal Stability of Hydrides (Group 15)", latex: "\\text{NH}_3 > \\text{PH}_3 > \\text{AsH}_3 > \\text{SbH}_3", description: "M-H bond strength decreases down group" },
      { name: "Bleaching Power of Cl₂", latex: "\\text{Cl}_2 + \\text{H}_2\\text{O} \\rightarrow \\text{HCl} + \\text{HOCl}\\xrightarrow{} \\text{O (nascent)}", description: "Nascent O bleaches; permanent bleaching" },
      { name: "Bond Dissociation Energy (Halogens)", latex: "\\text{Cl}_2 > \\text{Br}_2 > \\text{F}_2 > \\text{I}_2", description: "F₂ anomalously weak due to lone pair–lone pair repulsion" },
      { name: "Xenon Fluorides Geometry", latex: "\\text{XeF}_2: \\text{linear},\\;\\text{XeF}_4: \\text{sq. planar},\\;\\text{XeF}_6: \\text{distorted octahedral}", description: "VSEPR determines geometry" },
    ]
  },
  {
    chapter: "d and f Block Elements",
    formulas: [
      { name: "Magnetic Moment", latex: "\\mu = \\sqrt{n(n+2)}\\text{ BM}", description: "n = number of unpaired electrons; BM = Bohr Magnetons" },
      { name: "Variable Oxidation States", latex: "\\text{Easy (n-1)d e}^-\\text{ participation due to similar energy to ns}", description: "Ti: +2 to +4; Mn: +2 to +7; Cr: +2 to +6" },
      { name: "Lanthanoid Contraction", latex: "\\text{Poor shielding by 4f e}^-\\Rightarrow Z^*\\uparrow\\Rightarrow r\\downarrow", description: "Across lanthanoids, size decreases gradually but cumulatively" },
      { name: "Catalytic Activity (d-block)", latex: "\\text{Variable OS} + \\text{ability to adsorb reactants}", description: "Fe (Haber), Pt (Ostwald), V₂O₅ (Contact process)" },
      { name: "Colour (d-block)", latex: "d-d\\text{ transition absorbs visible light}\\Rightarrow\\text{complementary colour seen}", description: "Cu²⁺: blue; Cr³⁺: violet; Mn²⁺: pale pink; Zn²⁺: colourless" },
    ]
  },
  {
    chapter: "Coordination Compounds",
    formulas: [
      { name: "Coordination Number", latex: "CN = \\text{number of donor atoms directly bonded to metal}", description: "[Co(NH₃)₆]³⁺: CN=6; [PtCl₄]²⁻: CN=4" },
      { name: "Werner's Primary & Secondary Valency", latex: "\\text{Primary: ionisable; Secondary: coordination sphere}", description: "[CoCl₃(NH₃)₃]: primary=3, secondary=6" },
      { name: "Crystal Field Splitting (Octahedral)", latex: "\\Delta_o = E(e_g) - E(t_{2g})", description: "Strong field ligand: large Δ_o (low spin); weak field: small Δ_o (high spin)" },
      { name: "CFSE (Octahedral, Strong Field)", latex: "CFSE = -0.4n_1\\Delta_o + 0.6n_2\\Delta_o", description: "n₁ = electrons in t₂g; n₂ = electrons in e_g" },
      { name: "Magnetic Moment", latex: "\\mu_{spin-only} = \\sqrt{n(n+2)}\\text{ BM}", description: "n = unpaired electrons in complex" },
      { name: "Spectrochemical Series", latex: "I^- < Br^- < Cl^- < F^- < OH^- < en < CN^- < CO", description: "Increasing field strength → increasing Δ" },
    ]
  },
  {
    chapter: "Haloalkanes and Haloarenes",
    formulas: [
      { name: "SN2 Rate", latex: "\\text{Rate} = k[\\text{RX}][\\text{Nu}^-]", description: "Bimolecular; inversion of configuration; 1° > 2° > 3°" },
      { name: "SN1 Rate", latex: "\\text{Rate} = k[\\text{RX}]", description: "Unimolecular; racemisation; 3° > 2° > 1°" },
      { name: "Reactivity Order (RX with SN2)", latex: "\\text{RI} > \\text{RBr} > \\text{RCl} > \\text{RF}", description: "C-I bond weakest; best leaving group" },
      { name: "Elimination vs Substitution", latex: "\\text{Bulky base/high T: elimination (E2); small Nu/low T: substitution}", description: "Hoffman elimination with bulky base; Zaitsev with non-bulky" },
      { name: "Benzene Diazonium Salt Reactions", latex: "\\text{ArN}_2^+\\text{Cl}^- \\rightarrow \\text{Ar-X, Ar-OH, Ar-CN, Ar-H...}", description: "Key synthetic intermediate in aromatic substitution" },
    ]
  },
  {
    chapter: "Alcohols, Phenols and Ethers",
    formulas: [
      { name: "Lucas Test", latex: "\\text{3°: immediate cloudiness; 2°: slow; 1°: no reaction with ZnCl}_2\\text{/HCl}", description: "Distinguishes primary, secondary, tertiary alcohols" },
      { name: "Esterification", latex: "\\text{RCOOH + R'OH} \\underset{-H_2O}{\\xrightarrow{H^+,\\Delta}} \\text{RCOOR'}", description: "Acid-catalysed; reversible" },
      { name: "Iodoform Test", latex: "\\text{CH}_3\\text{CHO, CH}_3\\text{CO-R, C}_2\\text{H}_5\\text{OH}\\xrightarrow{I_2/\\text{NaOH}} \\text{CHI}_3", description: "Yellow precipitate: positive test for methyl ketone or ethanol" },
      { name: "Phenol Acidity", latex: "pK_a(\\text{phenol}) \\approx 10,\\;pK_a(\\text{alcohol}) \\approx 16", description: "Phenol more acidic due to resonance stabilisation of phenoxide" },
      { name: "Kolbe's Reaction", latex: "\\text{C}_6\\text{H}_5\\text{OH} + \\text{CO}_2 \\xrightarrow{\\text{NaOH},\\Delta, P} \\text{salicylate}", description: "Sodium phenoxide + CO₂ under pressure → sodium salicylate" },
      { name: "Cleavage of Ethers (HI)", latex: "\\text{R-O-R'} + \\text{HI}\\xrightarrow{\\Delta}\\text{ROH + R'I}", description: "Larger R group gets iodide; SN2 mechanism" },
    ]
  },
  {
    chapter: "Aldehydes, Ketones and Carboxylic Acids",
    formulas: [
      { name: "Nucleophilic Addition (Aldehyde > Ketone)", latex: "\\text{Reactivity: HCHO > RCHO > RCOR'}", description: "Steric and electronic factors: less alkyl = more reactive" },
      { name: "Aldol Condensation", latex: "2\\text{CH}_3\\text{CHO}\\xrightarrow{\\text{dil. OH}^-}\\text{CH}_3\\text{CH(OH)CH}_2\\text{CHO}", description: "α-H aldehyde/ketone; forms β-hydroxy carbonyl" },
      { name: "Cannizzaro Reaction", latex: "2\\text{HCHO}\\xrightarrow{\\text{conc. OH}^-}\\text{CH}_3\\text{OH} + \\text{HCOONa}", description: "No α-H; disproportionation of aldehyde" },
      { name: "Tollen's Test", latex: "\\text{RCHO} + 2[\\text{Ag(NH}_3\\text{)}_2]^+\\rightarrow\\text{RCOOH} + 2\\text{Ag}\\downarrow", description: "Silver mirror test; only aldehydes (not ketones)" },
      { name: "Fehling's Test", latex: "\\text{RCHO} + 2\\text{Cu}^{2+}\\rightarrow\\text{RCOOH} + \\text{Cu}_2\\text{O}\\downarrow\\text{(red)}", description: "Aliphatic aldehydes only; ketones don't react" },
      { name: "Carboxylic Acid pKa", latex: "\\text{Electron-withdrawing groups increase acidity (↓ pKa)}", description: "FCH₂COOH (2.59) < ClCH₂COOH (2.86) < CH₃COOH (4.74)" },
      { name: "Hell-Volhard-Zelinsky", latex: "\\text{RCOOH} + Cl_2\\xrightarrow{\\text{P}}\\text{RCH(Cl)COOH}", description: "α-halogenation of carboxylic acids" },
    ]
  },
  {
    chapter: "Amines",
    formulas: [
      { name: "Basicity Order (Aliphatic)", latex: "\\text{R}_2\\text{NH} > \\text{RNH}_2 > \\text{R}_3\\text{N} > \\text{NH}_3\\text{ (aqueous)}", description: "Steric vs. inductive; 2° amine most basic in water" },
      { name: "Basicity: Aniline vs Alkyl Amine", latex: "\\text{Alkyl amine} \\gg \\text{Aniline (aromatic)}", description: "Lone pair delocalisation in aniline reduces basicity" },
      { name: "Substituted Aniline Basicity", latex: "o,p\\text{-withdrawing groups decrease; o,p-donating increase basicity}", description: "NO₂ group at ortho/para decreases basicity most" },
      { name: "Diazonium Salt Formation", latex: "\\text{ArNH}_2 + \\text{NaNO}_2 + \\text{HCl}\\xrightarrow{0\\text{-}5°C}\\text{ArN}_2^+\\text{Cl}^-", description: "Low temperature critical to prevent hydrolysis" },
      { name: "Hoffmann Bromamide", latex: "\\text{RCONH}_2 + \\text{Br}_2 + 4\\text{NaOH}\\rightarrow\\text{RNH}_2 + \\text{Na}_2\\text{CO}_3 + 2\\text{NaBr} + 2\\text{H}_2\\text{O}", description: "Carbon chain decreases by 1; primary amine product" },
      { name: "Gabriel Phthalimide", latex: "\\text{Phthalimide}\\xrightarrow{\\text{KOH, RX, H}_3\\text{O}^+}\\text{RNH}_2", description: "Synthesis of primary amines without secondary/tertiary contamination" },
    ]
  },
  {
    chapter: "Biomolecules",
    formulas: [
      { name: "Glycosidic Bond", latex: "\\text{Monosaccharide} + \\text{Monosaccharide}\\xrightarrow{-H_2O}\\text{Disaccharide}", description: "C1-OH of one sugar + OH of another; α- or β-linkage" },
      { name: "Isoelectric Point", latex: "pI = \\frac{pK_{a1} + pK_{a2}}{2}", description: "pH at which amino acid has zero net charge; minimum solubility" },
      { name: "Peptide Bond", latex: "\\text{-COOH} + \\text{H}_2\\text{N-}\\rightarrow\\text{-CO-NH-} + H_2O", description: "Planar and rigid due to partial double bond character (resonance)" },
      { name: "Mutarotation", latex: "\\text{α-D-glucose}\\underset{\\Delta}{\\rightleftharpoons}\\text{open chain}\\rightleftharpoons\\text{β-D-glucose}", description: "Change in optical rotation until equilibrium; characteristic of reducing sugars" },
      { name: "Protein Structure Levels", latex: "1°\\text{: peptide bonds; }2°\\text{: H-bonds; }3°\\text{: S-S, H-bonds; }4°\\text{: subunit interactions}", description: "Primary to quaternary structure" },
    ]
  },
  {
    chapter: "Polymers",
    formulas: [
      { name: "Degree of Polymerisation", latex: "n = \\frac{M_{polymer}}{M_{monomer}}", description: "Number of monomer units in polymer chain" },
      { name: "Addition Polymerisation", latex: "n\\text{CH}_2\\!=\\!\\text{CH}_2\\rightarrow(-\\text{CH}_2\\text{-CH}_2\\text{-})_n", description: "Chain growth; no byproduct; monomers with π bond" },
      { name: "Condensation Polymerisation", latex: "\\text{Bifunctional monomers}\\xrightarrow{-\\text{small molecule (H}_2\\text{O/HCl)}}\\text{polymer}", description: "Step growth; nylon, dacron, bakelite" },
      { name: "Nylon 6,6", latex: "\\text{Hexanedioic acid} + \\text{1,6-diaminohexane}\\rightarrow\\text{nylon-6,6}", description: "Polyamide: 6 carbons from each monomer unit" },
      { name: "Glass Transition Temperature (Tg)", latex: "T < T_g:\\text{ glassy; }T > T_g:\\text{ rubbery}", description: "Amorphous polymers soften above Tg" },
    ]
  },
  {
    chapter: "Chemistry in Everyday Life",
    formulas: [
      { name: "Drug-Receptor Interaction", latex: "\\text{Agonist: mimics natural molecule; Antagonist: blocks receptor}", description: "Shape and functional group complementarity determines activity" },
      { name: "Antacid Action", latex: "\\text{Mg(OH)}_2 + 2\\text{HCl}\\rightarrow\\text{MgCl}_2 + 2\\text{H}_2\\text{O}", description: "Neutralises excess stomach acid; raises pH" },
      { name: "Soap Saponification", latex: "\\text{Fat (ester)} + \\text{NaOH}\\xrightarrow{\\Delta}\\text{Soap (carboxylate)} + \\text{Glycerol}", description: "Base hydrolysis of triglyceride" },
      { name: "CMC (Critical Micelle Concentration)", latex: "\\text{Above CMC: micelles form and trap grease}", description: "Hydrophilic head faces water; hydrophobic tail faces grease" },
      { name: "Artificial Sweetener Relative Sweetness", latex: "\\text{Saccharin}\\approx550\\times,\\;\\text{Aspartame}\\approx200\\times,\\;\\text{Sucralose}\\approx600\\times\\text{ (vs sucrose)}", description: "Sweetness relative to sucrose; used by diabetics" },
    ]
  }
];

export default ChemistryFormulaData;
