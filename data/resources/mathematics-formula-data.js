// Mathematics Formula Data — chapters match syllabusData.js exactly (29 chapters)
const MathematicsFormulaData = [
  {
    chapter: "Sets",
    formulas: [
      { name: "Subset", latex: "A \\subseteq B \\Leftrightarrow \\forall x \\in A,\\; x \\in B", description: "Every element of A is in B" },
      { name: "Power Set Cardinality", latex: "|P(A)| = 2^n \\text{ where } n = |A|", description: "Number of subsets of A" },
      { name: "Union", latex: "A \\cup B = \\{x : x \\in A \\text{ or } x \\in B\\}", description: "All elements in A or B or both" },
      { name: "Intersection", latex: "A \\cap B = \\{x : x \\in A \\text{ and } x \\in B\\}", description: "Elements common to both A and B" },
      { name: "Complement", latex: "A' = U - A = \\{x : x \\in U,\\; x \\notin A\\}", description: "Elements in universal set but not in A" },
      { name: "De Morgan's Laws", latex: "(A \\cup B)' = A' \\cap B',\\quad (A \\cap B)' = A' \\cup B'", description: "Complement distributes over union/intersection" },
      { name: "Inclusion-Exclusion (2 sets)", latex: "|A \\cup B| = |A| + |B| - |A \\cap B|", description: "Avoids double counting" },
      { name: "Inclusion-Exclusion (3 sets)", latex: "|A \\cup B \\cup C| = |A|+|B|+|C|-|A\\cap B|-|B\\cap C|-|A\\cap C|+|A\\cap B\\cap C|", description: "Generalization for 3 sets" },
      { name: "Cartesian Product", latex: "A \\times B = \\{(a,b) : a \\in A,\\; b \\in B\\},\\quad |A\\times B| = |A|\\cdot|B|", description: "Set of all ordered pairs" },
    ]
  },
  {
    chapter: "Relations and Functions",
    formulas: [
      { name: "Number of Relations", latex: "\\text{From A to B: } 2^{|A|\\times|B|}", description: "Each ordered pair is either included or not" },
      { name: "Number of Functions", latex: "\\text{From A to B: } |B|^{|A|}", description: "Each element of A maps to one of |B| elements" },
      { name: "Number of One-One Functions", latex: "\\text{From A to B: } ^{|B|}P_{|A|} = \\frac{|B|!}{(|B|-|A|)!}", description: "Only possible when |B| ≥ |A|" },
      { name: "Composition of Functions", latex: "(g \\circ f)(x) = g(f(x))", description: "Apply f first, then g" },
      { name: "Inverse Function Condition", latex: "f^{-1}\\text{ exists iff }f\\text{ is bijective (one-one and onto)}", description: "Bijective = injective + surjective" },
      { name: "Equivalence Relation", latex: "\\text{Reflexive}\\;(aRa) + \\text{Symmetric}\\;(aRb\\Rightarrow bRa) + \\text{Transitive}\\;(aRb,bRc\\Rightarrow aRc)", description: "All three properties together" },
    ]
  },
  {
    chapter: "Trigonometric Functions",
    formulas: [
      { name: "Pythagorean Identities", latex: "\\sin^2\\theta + \\cos^2\\theta = 1,\\quad 1+\\tan^2\\theta = \\sec^2\\theta,\\quad 1+\\cot^2\\theta = \\csc^2\\theta", description: "Fundamental identities derived from unit circle" },
      { name: "Angle Sum (sin)", latex: "\\sin(A \\pm B) = \\sin A\\cos B \\pm \\cos A\\sin B", description: "Addition and subtraction formula" },
      { name: "Angle Sum (cos)", latex: "\\cos(A \\pm B) = \\cos A\\cos B \\mp \\sin A\\sin B", description: "Note: sign flips for cos" },
      { name: "Angle Sum (tan)", latex: "\\tan(A \\pm B) = \\frac{\\tan A \\pm \\tan B}{1 \\mp \\tan A\\tan B}", description: "Denominator sign flips" },
      { name: "Double Angle Formulas", latex: "\\sin 2\\theta = 2\\sin\\theta\\cos\\theta,\\quad \\cos 2\\theta = \\cos^2\\theta-\\sin^2\\theta = 1-2\\sin^2\\theta = 2\\cos^2\\theta-1", description: "Special case of angle sum" },
      { name: "tan Double Angle", latex: "\\tan 2\\theta = \\frac{2\\tan\\theta}{1-\\tan^2\\theta}", description: "Valid when θ ≠ 45° + n·90°" },
      { name: "Product-to-Sum", latex: "2\\sin A\\cos B = \\sin(A+B)+\\sin(A-B)", description: "Used to simplify products" },
      { name: "Sum-to-Product (sin)", latex: "\\sin C + \\sin D = 2\\sin\\frac{C+D}{2}\\cos\\frac{C-D}{2}", description: "C = A+B, D = A−B substitution" },
      { name: "Sum-to-Product (cos)", latex: "\\cos C + \\cos D = 2\\cos\\frac{C+D}{2}\\cos\\frac{C-D}{2}", description: "cos C − cos D: sine version with negative sign" },
      { name: "General Solution (sin)", latex: "\\sin\\theta = \\sin\\alpha \\Rightarrow \\theta = n\\pi + (-1)^n\\alpha,\\;n\\in\\mathbb{Z}", description: "All solutions of sin equation" },
      { name: "General Solution (cos)", latex: "\\cos\\theta = \\cos\\alpha \\Rightarrow \\theta = 2n\\pi \\pm \\alpha,\\;n\\in\\mathbb{Z}", description: "All solutions of cos equation" },
      { name: "General Solution (tan)", latex: "\\tan\\theta = \\tan\\alpha \\Rightarrow \\theta = n\\pi + \\alpha,\\;n\\in\\mathbb{Z}", description: "All solutions of tan equation" },
    ]
  },
  {
    chapter: "Principle of Mathematical Induction",
    formulas: [
      { name: "Sum of first n natural numbers", latex: "\\sum_{k=1}^n k = \\frac{n(n+1)}{2}", description: "Proved by induction; Gauss's formula" },
      { name: "Sum of squares", latex: "\\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6}", description: "Standard PMI result" },
      { name: "Sum of cubes", latex: "\\sum_{k=1}^n k^3 = \\left[\\frac{n(n+1)}{2}\\right]^2", description: "Square of sum of first n naturals" },
      { name: "Geometric Series Sum", latex: "\\sum_{k=0}^{n-1} ar^k = a\\cdot\\frac{r^n-1}{r-1},\\quad r \\neq 1", description: "Proved by induction; base case then inductive step" },
      { name: "PMI Steps", latex: "\\text{1. Base case: }P(1)\\text{ true}\\quad\\text{2. Inductive step: }P(k)\\Rightarrow P(k+1)", description: "Both steps necessary for complete proof" },
    ]
  },
  {
    chapter: "Complex Numbers and Quadratic Equations",
    formulas: [
      { name: "Imaginary Unit", latex: "i = \\sqrt{-1},\\quad i^2=-1,\\quad i^3=-i,\\quad i^4=1", description: "Powers of i repeat with period 4" },
      { name: "Modulus", latex: "|z| = |a+ib| = \\sqrt{a^2+b^2}", description: "Distance from origin in Argand plane" },
      { name: "Argument", latex: "\\arg(z) = \\theta = \\tan^{-1}\\frac{b}{a}", description: "Angle with positive real axis; note quadrant" },
      { name: "Polar Form", latex: "z = r(\\cos\\theta + i\\sin\\theta) = re^{i\\theta}", description: "r = |z|, θ = arg(z); Euler's formula: e^{iθ} = cosθ + i sinθ" },
      { name: "De Moivre's Theorem", latex: "(\\cos\\theta + i\\sin\\theta)^n = \\cos n\\theta + i\\sin n\\theta", description: "For integer n; used to find nth roots" },
      { name: "Conjugate", latex: "\\bar{z} = a-ib,\\quad z\\bar{z} = |z|^2 = a^2+b^2", description: "Reflect across real axis" },
      { name: "Cube Roots of Unity", latex: "\\omega = e^{2\\pi i/3} = \\frac{-1+i\\sqrt3}{2},\\quad 1+\\omega+\\omega^2=0,\\quad\\omega^3=1", description: "ω and ω² are the complex cube roots; ω² = conjugate of ω" },
      { name: "Quadratic Formula", latex: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}", description: "Solutions of ax² + bx + c = 0" },
      { name: "Discriminant", latex: "D = b^2-4ac:\\quad D>0\\text{ (real distinct)},\\;D=0\\text{ (equal)},\\;D<0\\text{ (complex)}", description: "Nature of roots of quadratic" },
      { name: "Vieta's Formulas (Quadratic)", latex: "\\alpha+\\beta = -\\frac{b}{a},\\quad \\alpha\\beta = \\frac{c}{a}", description: "Sum and product of roots" },
    ]
  },
  {
    chapter: "Linear Inequalities",
    formulas: [
      { name: "Absolute Value Inequality", latex: "|x| < a \\Rightarrow -a < x < a,\\quad |x| > a \\Rightarrow x < -a \\text{ or } x > a", description: "a > 0; open intervals" },
      { name: "Rules for Inequalities", latex: "a < b \\Rightarrow a+c < b+c;\\quad a < b,\\;c < 0 \\Rightarrow ac > bc", description: "Multiplying/dividing by negative flips inequality" },
      { name: "Solution of Linear Inequality", latex: "ax + b > 0,\\;a>0 \\Rightarrow x > -\\frac{b}{a}", description: "Solve same as linear equation; watch for sign flip" },
      { name: "Compound Inequality", latex: "a < x < b \\Leftrightarrow x > a \\text{ AND } x < b", description: "Intersection of two solution sets" },
    ]
  },
  {
    chapter: "Permutations and Combinations",
    formulas: [
      { name: "Factorial", latex: "n! = n\\cdot(n-1)\\cdot(n-2)\\cdots2\\cdot1,\\quad 0! = 1", description: "Grows rapidly: 10! = 3,628,800" },
      { name: "Permutation", latex: "^nP_r = \\frac{n!}{(n-r)!}", description: "Ordered arrangements of r from n distinct objects" },
      { name: "Combination", latex: "^nC_r = \\binom{n}{r} = \\frac{n!}{r!(n-r)!} = {}^nC_{n-r}", description: "Unordered selections" },
      { name: "Relation P and C", latex: "^nP_r = r! \\cdot {}^nC_r", description: "Permutation = r! × combination" },
      { name: "Permutations with Repetition", latex: "n^r", description: "r items from n with replacement (ordered)" },
      { name: "Permutations with Identical Items", latex: "\\frac{n!}{p!\\,q!\\,r!}", description: "n items with p alike, q alike, r alike" },
      { name: "Circular Permutations", latex: "(n-1)!", description: "Arrangements of n distinct objects in a circle" },
      { name: "Combinations with Repetition", latex: "^{n+r-1}C_r", description: "Choosing r from n types with repetition allowed" },
    ]
  },
  {
    chapter: "Binomial Theorem",
    formulas: [
      { name: "Binomial Theorem", latex: "(a+b)^n = \\sum_{r=0}^n \\binom{n}{r} a^{n-r}b^r", description: "Expansion of (a+b)^n for non-negative integer n" },
      { name: "General Term", latex: "T_{r+1} = \\binom{n}{r}a^{n-r}b^r", description: "(r+1)th term from beginning" },
      { name: "Middle Term (n even)", latex: "T_{\\frac{n}{2}+1} = \\binom{n}{n/2}a^{n/2}b^{n/2}", description: "Single middle term when n is even" },
      { name: "Middle Terms (n odd)", latex: "T_{\\frac{n+1}{2}}\\text{ and }T_{\\frac{n+3}{2}}", description: "Two middle terms when n is odd" },
      { name: "Number of Terms", latex: "n+1", description: "Expansion of (a+b)^n has n+1 terms" },
      { name: "Sum of Binomial Coefficients", latex: "\\sum_{r=0}^n \\binom{n}{r} = 2^n", description: "Put a = b = 1" },
      { name: "Sum of Alternating Coefficients", latex: "\\sum_{r=0}^n (-1)^r\\binom{n}{r} = 0", description: "Put a = 1, b = −1" },
      { name: "Approximation (small x)", latex: "(1+x)^n \\approx 1 + nx,\\quad |x| \\ll 1", description: "First-order binomial approximation" },
    ]
  },
  {
    chapter: "Sequences and Series",
    formulas: [
      { name: "AP — nth Term", latex: "a_n = a + (n-1)d", description: "a = first term; d = common difference" },
      { name: "AP — Sum of n Terms", latex: "S_n = \\frac{n}{2}[2a+(n-1)d] = \\frac{n}{2}(a+l)", description: "l = last term" },
      { name: "GP — nth Term", latex: "a_n = ar^{n-1}", description: "a = first term; r = common ratio" },
      { name: "GP — Sum of n Terms", latex: "S_n = a\\frac{r^n-1}{r-1}\\;(r\\neq1),\\quad S_n = na\\;(r=1)", description: "Finite geometric sum" },
      { name: "GP — Sum to Infinity", latex: "S_\\infty = \\frac{a}{1-r},\\quad |r| < 1", description: "Convergent geometric series" },
      { name: "Arithmetic Mean (AM)", latex: "AM = \\frac{a+b}{2}", description: "AM between a and b" },
      { name: "Geometric Mean (GM)", latex: "GM = \\sqrt{ab}", description: "GM between a and b (both positive)" },
      { name: "Harmonic Mean (HM)", latex: "HM = \\frac{2ab}{a+b}", description: "HM between a and b" },
      { name: "AM–GM–HM Inequality", latex: "AM \\geq GM \\geq HM", description: "Equality holds iff a = b" },
      { name: "Sum of AGP", latex: "S = \\frac{a}{1-r}+\\frac{dr}{(1-r)^2},\\quad|r|<1", description: "Arithmetic-Geometric Progression infinite sum" },
    ]
  },
  {
    chapter: "Straight Lines",
    formulas: [
      { name: "Slope of Line", latex: "m = \\tan\\theta = \\frac{y_2-y_1}{x_2-x_1}", description: "θ = angle with positive x-axis" },
      { name: "Slope-Intercept Form", latex: "y = mx + c", description: "m = slope, c = y-intercept" },
      { name: "Two-Point Form", latex: "\\frac{y-y_1}{x-x_1} = \\frac{y_2-y_1}{x_2-x_1}", description: "Line through two given points" },
      { name: "Intercept Form", latex: "\\frac{x}{a}+\\frac{y}{b} = 1", description: "a = x-intercept, b = y-intercept" },
      { name: "General Form", latex: "ax+by+c = 0", description: "Slope = −a/b; y-intercept = −c/b" },
      { name: "Distance from Point to Line", latex: "d = \\frac{|ax_1+by_1+c|}{\\sqrt{a^2+b^2}}", description: "Perpendicular distance from (x₁, y₁) to ax+by+c=0" },
      { name: "Angle between Two Lines", latex: "\\tan\\theta = \\left|\\frac{m_1-m_2}{1+m_1m_2}\\right|", description: "θ = acute angle between lines with slopes m₁ and m₂" },
      { name: "Parallel Lines Condition", latex: "m_1 = m_2", description: "Equal slopes; distance = |c₁−c₂|/√(a²+b²)" },
      { name: "Perpendicular Lines Condition", latex: "m_1\\cdot m_2 = -1", description: "Product of slopes = −1" },
      { name: "Section Formula (Internal)", latex: "P = \\left(\\frac{mx_2+nx_1}{m+n},\\frac{my_2+ny_1}{m+n}\\right)", description: "Point dividing (x₁,y₁)–(x₂,y₂) in ratio m:n internally" },
    ]
  },
  {
    chapter: "Conic Sections",
    formulas: [
      { name: "Circle", latex: "(x-h)^2+(y-k)^2 = r^2", description: "Center (h,k), radius r" },
      { name: "General Circle Equation", latex: "x^2+y^2+2gx+2fy+c = 0", description: "Center (−g,−f); radius = √(g²+f²−c)" },
      { name: "Parabola (standard)", latex: "y^2 = 4ax", description: "Focus (a,0); directrix x=−a; axis along x-axis" },
      { name: "Parabola — Other Forms", latex: "y^2=-4ax,\\;x^2=4ay,\\;x^2=-4ay", description: "Corresponding foci and directrices" },
      { name: "Ellipse (standard)", latex: "\\frac{x^2}{a^2}+\\frac{y^2}{b^2} = 1,\\quad a > b > 0", description: "Foci: (±c,0); c²=a²−b²; e=c/a<1" },
      { name: "Ellipse — Key Relations", latex: "b^2 = a^2(1-e^2),\\quad e = \\frac{c}{a} < 1", description: "e = eccentricity; b²+c²=a²" },
      { name: "Hyperbola (standard)", latex: "\\frac{x^2}{a^2}-\\frac{y^2}{b^2} = 1", description: "Foci: (±c,0); c²=a²+b²; e=c/a>1" },
      { name: "Hyperbola — Asymptotes", latex: "y = \\pm\\frac{b}{a}x", description: "Lines approached but never touched" },
      { name: "Rectangular Hyperbola", latex: "xy = c^2", description: "Asymptotes are coordinate axes; eccentricity = √2" },
      { name: "Focal Chord (Parabola)", latex: "\\frac{1}{SP}+\\frac{1}{SQ} = \\frac{1}{a}", description: "P, Q are ends of focal chord; S is focus" },
    ]
  },
  {
    chapter: "Introduction to Three Dimensional Geometry",
    formulas: [
      { name: "Distance in 3D", latex: "PQ = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}", description: "3D extension of distance formula" },
      { name: "Section Formula (3D)", latex: "P = \\left(\\frac{mx_2+nx_1}{m+n},\\frac{my_2+ny_1}{m+n},\\frac{mz_2+nz_1}{m+n}\\right)", description: "Internal division in ratio m:n" },
      { name: "Centroid of Triangle (3D)", latex: "G = \\left(\\frac{x_1+x_2+x_3}{3},\\frac{y_1+y_2+y_3}{3},\\frac{z_1+z_2+z_3}{3}\\right)", description: "Average of all three vertices" },
      { name: "Direction Cosines", latex: "l^2+m^2+n^2 = 1,\\quad l=\\cos\\alpha,\\;m=\\cos\\beta,\\;n=\\cos\\gamma", description: "α,β,γ = angles with x,y,z axes" },
      { name: "Direction Ratios to Direction Cosines", latex: "l = \\frac{a}{\\sqrt{a^2+b^2+c^2}},\\;m=\\frac{b}{\\sqrt{...}},\\;n=\\frac{c}{\\sqrt{...}}", description: "(a,b,c) are direction ratios" },
    ]
  },
  {
    chapter: "Limits and Derivatives",
    formulas: [
      { name: "Standard Limit", latex: "\\lim_{x\\to0}\\frac{\\sin x}{x} = 1", description: "x must be in radians; fundamental trigonometric limit" },
      { name: "Standard Limit (exponential)", latex: "\\lim_{x\\to0}\\frac{e^x-1}{x} = 1,\\quad\\lim_{x\\to0}\\frac{\\ln(1+x)}{x} = 1", description: "Exponential and log limits" },
      { name: "Standard Limit (algebraic)", latex: "\\lim_{x\\to a}\\frac{x^n-a^n}{x-a} = na^{n-1}", description: "Works for all real n" },
      { name: "L'Hôpital's Rule", latex: "\\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\lim_{x\\to a}\\frac{f'(x)}{g'(x)},\\quad\\text{if }\\frac{0}{0}\\text{ or }\\frac{\\infty}{\\infty}", description: "Differentiate numerator and denominator separately" },
      { name: "Derivative from First Principles", latex: "f'(x) = \\lim_{h\\to0}\\frac{f(x+h)-f(x)}{h}", description: "Definition of derivative" },
      { name: "Power Rule", latex: "\\frac{d}{dx}(x^n) = nx^{n-1}", description: "For all real n" },
      { name: "Product Rule", latex: "(uv)' = u'v + uv'", description: "Derivative of product of two functions" },
      { name: "Quotient Rule", latex: "\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}", description: "Derivative of quotient; v ≠ 0" },
    ]
  },
  {
    chapter: "Mathematical Reasoning",
    formulas: [
      { name: "Negation", latex: "\\sim p\\;(\\text{not }p)", description: "True when p is false; false when p is true" },
      { name: "Conjunction (AND)", latex: "p \\land q", description: "True only when both p and q are true" },
      { name: "Disjunction (OR)", latex: "p \\lor q", description: "True when at least one of p, q is true" },
      { name: "Implication (If-Then)", latex: "p \\Rightarrow q\\equiv \\sim p\\lor q", description: "False only when p is true and q is false" },
      { name: "Biconditional (Iff)", latex: "p \\Leftrightarrow q\\equiv (p\\Rightarrow q)\\land(q\\Rightarrow p)", description: "True when p and q have same truth value" },
      { name: "Contrapositive", latex: "p\\Rightarrow q\\equiv\\sim q\\Rightarrow\\sim p", description: "Always logically equivalent to the original implication" },
      { name: "Converse", latex: "\\text{Converse of }(p\\Rightarrow q)\\text{ is }(q\\Rightarrow p)", description: "Not equivalent to original implication" },
    ]
  },
  {
    chapter: "Statistics",
    formulas: [
      { name: "Mean", latex: "\\bar{x} = \\frac{\\sum x_i}{n} = \\frac{\\sum f_i x_i}{\\sum f_i}", description: "Arithmetic average; second form for frequency distribution" },
      { name: "Median", latex: "M = L + \\frac{\\frac{N}{2}-CF}{f}\\times h", description: "L=lower class limit; CF=cumulative freq before class; f=freq; h=class width" },
      { name: "Mode", latex: "Z = L + \\frac{f_1-f_0}{2f_1-f_0-f_2}\\times h", description: "f₁=modal class freq; f₀=preceding freq; f₂=following freq" },
      { name: "Variance", latex: "\\sigma^2 = \\frac{\\sum(x_i-\\bar{x})^2}{n} = \\frac{\\sum x_i^2}{n} - \\bar{x}^2", description: "Mean of squared deviations" },
      { name: "Standard Deviation", latex: "\\sigma = \\sqrt{\\frac{\\sum(x_i-\\bar{x})^2}{n}}", description: "Square root of variance; same units as data" },
      { name: "Coefficient of Variation", latex: "CV = \\frac{\\sigma}{\\bar{x}}\\times100\\%", description: "Relative measure of dispersion; unitless" },
      { name: "Empirical Relation", latex: "\\text{Mode} = 3\\,\\text{Median} - 2\\,\\text{Mean}", description: "Approximate relation for moderately skewed distributions" },
    ]
  },
  {
    chapter: "Probability",
    formulas: [
      { name: "Classical Probability", latex: "P(A) = \\frac{n(A)}{n(S)}", description: "Favorable outcomes / total equally likely outcomes" },
      { name: "Complementary Events", latex: "P(A') = 1 - P(A)", description: "P(A) + P(A') = 1 always" },
      { name: "Addition Rule", latex: "P(A\\cup B) = P(A)+P(B)-P(A\\cap B)", description: "For mutually exclusive: P(A∩B) = 0" },
      { name: "Conditional Probability", latex: "P(A|B) = \\frac{P(A\\cap B)}{P(B)},\\quad P(B)\\neq0", description: "Probability of A given B has occurred" },
      { name: "Multiplication Rule", latex: "P(A\\cap B) = P(A)\\cdot P(B|A) = P(B)\\cdot P(A|B)", description: "Joint probability" },
      { name: "Independent Events", latex: "P(A\\cap B) = P(A)\\cdot P(B)", description: "A and B are independent iff this holds" },
    ]
  },
  {
    chapter: "Relations and Functions (Advanced)",
    formulas: [
      { name: "Types of Functions", latex: "\\text{Injective (1-1): }f(x_1)=f(x_2)\\Rightarrow x_1=x_2", description: "Each output comes from at most one input" },
      { name: "Surjective (Onto)", latex: "\\forall y\\in B,\\;\\exists x\\in A:\\;f(x)=y", description: "Every element of codomain is in range" },
      { name: "Bijective", latex: "\\text{One-one}\\;(\\text{injective}) + \\text{onto}\\;(\\text{surjective})", description: "Perfect pairing; invertible" },
      { name: "Even and Odd Functions", latex: "f(-x)=f(x)\\text{ (even)};\\quad f(-x)=-f(x)\\text{ (odd)}", description: "Even: symmetric about y-axis; Odd: 180° rotational symmetry" },
      { name: "Periodic Function", latex: "f(x+T) = f(x)\\;\\forall x,\\quad T = \\text{period}", description: "Smallest positive T is the fundamental period" },
    ]
  },
  {
    chapter: "Inverse Trigonometric Functions",
    formulas: [
      { name: "Domain and Range", latex: "\\sin^{-1}x: [-1,1]\\to[-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2}],\\quad\\cos^{-1}x:[-1,1]\\to[0,\\pi]", description: "Principal value branches" },
      { name: "tan⁻¹ and cot⁻¹", latex: "\\tan^{-1}x: \\mathbb{R}\\to(-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2}),\\quad\\cot^{-1}x:\\mathbb{R}\\to(0,\\pi)", description: "Open interval for tan⁻¹" },
      { name: "Identity: sin⁻¹ + cos⁻¹", latex: "\\sin^{-1}x + \\cos^{-1}x = \\frac{\\pi}{2},\\quad x\\in[-1,1]", description: "Complementary angle identity" },
      { name: "Identity: tan⁻¹ + cot⁻¹", latex: "\\tan^{-1}x + \\cot^{-1}x = \\frac{\\pi}{2},\\quad x\\in\\mathbb{R}", description: "Complementary angle identity" },
      { name: "tan⁻¹ Addition", latex: "\\tan^{-1}x + \\tan^{-1}y = \\tan^{-1}\\frac{x+y}{1-xy},\\quad xy<1", description: "xy > 1: add ±π to result (based on signs of x,y)" },
      { name: "tan⁻¹ Subtraction", latex: "\\tan^{-1}x - \\tan^{-1}y = \\tan^{-1}\\frac{x-y}{1+xy},\\quad xy>-1", description: "Useful for simplification" },
      { name: "2·tan⁻¹ Formula", latex: "2\\tan^{-1}x = \\sin^{-1}\\frac{2x}{1+x^2} = \\cos^{-1}\\frac{1-x^2}{1+x^2} = \\tan^{-1}\\frac{2x}{1-x^2}", description: "Connects inverse trig functions" },
    ]
  },
  {
    chapter: "Matrices",
    formulas: [
      { name: "Matrix Addition/Subtraction", latex: "(A \\pm B)_{ij} = A_{ij} \\pm B_{ij}", description: "Same order matrices; element-wise operation" },
      { name: "Matrix Multiplication", latex: "(AB)_{ij} = \\sum_k A_{ik}B_{kj}", description: "A is m×n, B is n×p → AB is m×p" },
      { name: "Transpose", latex: "(A^T)_{ij} = A_{ji},\\quad (AB)^T = B^T A^T", description: "Rows become columns" },
      { name: "Symmetric Matrix", latex: "A^T = A", description: "a_{ij} = a_{ji} for all i, j" },
      { name: "Skew-Symmetric Matrix", latex: "A^T = -A,\\quad a_{ii} = 0", description: "Diagonal elements are always zero" },
      { name: "Any Matrix Decomposition", latex: "A = \\frac{A+A^T}{2} + \\frac{A-A^T}{2}", description: "Sum of symmetric and skew-symmetric parts" },
      { name: "Properties of Transpose", latex: "(A+B)^T = A^T+B^T,\\quad (kA)^T = kA^T", description: "Linearity of transpose" },
    ]
  },
  {
    chapter: "Determinants",
    formulas: [
      { name: "2×2 Determinant", latex: "\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix} = ad-bc", description: "Product of main diagonal minus anti-diagonal" },
      { name: "3×3 Determinant (expansion)", latex: "\\det(A) = a_{11}C_{11}+a_{12}C_{12}+a_{13}C_{13}", description: "Expand along any row or column; C_{ij} = cofactor" },
      { name: "Cofactor", latex: "C_{ij} = (-1)^{i+j}M_{ij}", description: "M_{ij} = minor = det of matrix with row i, col j deleted" },
      { name: "Adjugate (Adjoint)", latex: "\\text{adj}(A) = (C_{ij})^T", description: "Transpose of cofactor matrix" },
      { name: "Inverse of Matrix", latex: "A^{-1} = \\frac{1}{|A|}\\text{adj}(A)", description: "Exists only if |A| ≠ 0 (non-singular)" },
      { name: "Cramer's Rule", latex: "x_i = \\frac{D_i}{D}", description: "D = det(A); D_i = det with ith column replaced by constants" },
      { name: "Properties of Determinant", latex: "\\det(AB) = \\det(A)\\det(B),\\quad \\det(A^T) = \\det(A)", description: "Key properties for calculations" },
      { name: "Area of Triangle (Determinant)", latex: "\\Delta = \\frac{1}{2}\\left|\\begin{matrix}x_1&y_1&1\\\\x_2&y_2&1\\\\x_3&y_3&1\\end{matrix}\\right|", description: "Vertices (x₁,y₁), (x₂,y₂), (x₃,y₃)" },
    ]
  },
  {
    chapter: "Continuity and Differentiability",
    formulas: [
      { name: "Continuity Condition", latex: "f\\text{ continuous at }x=a \\Leftrightarrow \\lim_{x\\to a}f(x) = f(a)", description: "Left limit = right limit = value at a" },
      { name: "Chain Rule", latex: "\\frac{d}{dx}[f(g(x))] = f'(g(x))\\cdot g'(x)", description: "Derivative of composite function" },
      { name: "Standard Derivatives", latex: "\\frac{d}{dx}(\\sin x)=\\cos x,\\;(\\cos x)=-\\sin x,\\;(\\tan x)=\\sec^2x", description: "Most used; memorise all six trig derivatives" },
      { name: "Exponential & Log Derivatives", latex: "\\frac{d}{dx}(e^x)=e^x,\\;(a^x)=a^x\\ln a,\\;(\\ln x)=\\frac{1}{x}", description: "e^x is its own derivative" },
      { name: "Parametric Differentiation", latex: "\\frac{dy}{dx} = \\frac{dy/dt}{dx/dt}", description: "When x = f(t), y = g(t)" },
      { name: "Implicit Differentiation", latex: "\\frac{d}{dx}[F(x,y)=0]\\Rightarrow\\frac{dy}{dx} = -\\frac{\\partial F/\\partial x}{\\partial F/\\partial y}", description: "Differentiate entire equation w.r.t. x" },
      { name: "Logarithmic Differentiation", latex: "y = u^v \\Rightarrow \\ln y = v\\ln u \\Rightarrow \\frac{y'}{y} = v'\\ln u + \\frac{vu'}{u}", description: "Used when base and exponent both contain x" },
      { name: "Rolle's Theorem", latex: "f\\text{ cont on }[a,b],\\;f(a)=f(b)\\Rightarrow\\exists c:\\;f'(c)=0", description: "Guarantees horizontal tangent between equal function values" },
      { name: "Mean Value Theorem (Lagrange)", latex: "f'(c) = \\frac{f(b)-f(a)}{b-a}\\text{ for some }c\\in(a,b)", description: "Generalisation of Rolle's theorem" },
    ]
  },
  {
    chapter: "Application of Derivatives",
    formulas: [
      { name: "Equation of Tangent", latex: "y - y_1 = f'(x_1)(x - x_1)", description: "Slope = f'(x₁) at point (x₁, y₁)" },
      { name: "Equation of Normal", latex: "y - y_1 = -\\frac{1}{f'(x_1)}(x - x_1)", description: "Perpendicular to tangent; slope = −1/f'(x₁)" },
      { name: "Angle of Intersection of Curves", latex: "\\tan\\theta = \\left|\\frac{m_1-m_2}{1+m_1m_2}\\right|", description: "m₁, m₂ = slopes of tangents at intersection point" },
      { name: "Increasing Function", latex: "f'(x) > 0 \\text{ in interval }\\Rightarrow f\\text{ is increasing}", description: "Derivative positive → function rising" },
      { name: "Critical Points", latex: "f'(x) = 0 \\text{ or } f'(x)\\text{ does not exist}", description: "Candidates for maxima, minima or inflection points" },
      { name: "Second Derivative Test", latex: "f'(c)=0:\\;f''(c)<0\\Rightarrow\\text{max};\\;f''(c)>0\\Rightarrow\\text{min}", description: "Conclusive when f''(c) ≠ 0" },
      { name: "Approximation", latex: "\\Delta y \\approx f'(x)\\Delta x,\\quad f(x+h)\\approx f(x)+hf'(x)", description: "Linear approximation using derivative" },
      { name: "Absolute Max/Min on [a,b]", latex: "\\text{Compare values at critical points and endpoints}", description: "Global extrema occur at one of these" },
    ]
  },
  {
    chapter: "Integrals",
    formulas: [
      { name: "Fundamental Theorem of Calculus", latex: "\\int_a^b f(x)\\,dx = F(b)-F(a),\\quad F'(x)=f(x)", description: "Connects differentiation and integration" },
      { name: "Power Rule (Integration)", latex: "\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C,\\quad n\\neq-1", description: "Add 1 to power, divide by new power" },
      { name: "Standard Integrals", latex: "\\int e^x dx = e^x+C,\\;\\int\\frac{1}{x}dx = \\ln|x|+C,\\;\\int\\sin x\\,dx = -\\cos x+C", description: "Most frequently used" },
      { name: "Integration by Parts", latex: "\\int u\\,dv = uv - \\int v\\,du", description: "ILATE: Inverse trig > Log > Algebraic > Trig > Exponential (choose u)" },
      { name: "Substitution", latex: "\\int f(g(x))g'(x)\\,dx = \\int f(t)\\,dt,\\quad t=g(x)", description: "Reversal of chain rule" },
      { name: "Partial Fractions", latex: "\\frac{P(x)}{Q(x)} = \\frac{A}{x-a}+\\frac{B}{x-b}+...", description: "When degree of P < degree of Q and Q factorises" },
      { name: "King's Property", latex: "\\int_a^b f(x)\\,dx = \\int_a^b f(a+b-x)\\,dx", description: "Substitute x → a+b−x; very useful for definite integrals" },
      { name: "Even/Odd Function Property", latex: "\\int_{-a}^a f(x)\\,dx = \\begin{cases}2\\int_0^a f\\,dx & f\\text{ even}\\\\0 & f\\text{ odd}\\end{cases}", description: "Simplifies symmetric integrals" },
    ]
  },
  {
    chapter: "Application of Integrals",
    formulas: [
      { name: "Area under Curve", latex: "A = \\int_a^b |f(x)|\\,dx", description: "Absolute value ensures positive area" },
      { name: "Area between Two Curves", latex: "A = \\int_a^b [f(x)-g(x)]\\,dx,\\quad f(x)\\geq g(x)\\text{ on }[a,b]", description: "Upper curve minus lower curve" },
      { name: "Area using y-integration", latex: "A = \\int_c^d [f(y)-g(y)]\\,dy", description: "Integrate horizontally; useful when curves are easier expressed as x=f(y)" },
      { name: "Area of Ellipse", latex: "A = \\pi ab", description: "Semi-axes a and b; circle: a=b=r gives πr²" },
      { name: "Area of Parabola (y²=4ax, x=h)", latex: "A = \\frac{4}{3}\\times\\text{base}\\times\\text{height}= \\frac{4}{3}\\cdot2\\sqrt{4ah}\\cdot h", description: "Area enclosed by chord and parabola" },
    ]
  },
  {
    chapter: "Differential Equations",
    formulas: [
      { name: "Order and Degree", latex: "\\text{Order: highest derivative; Degree: power of highest derivative (after rationalising)}", description: "Degree defined only for polynomial differential equations" },
      { name: "Variable Separable", latex: "\\frac{dy}{dx} = f(x)g(y)\\Rightarrow\\int\\frac{dy}{g(y)} = \\int f(x)\\,dx", description: "Separate variables, integrate both sides" },
      { name: "Homogeneous DE", latex: "\\frac{dy}{dx} = F\\!\\left(\\frac{y}{x}\\right)\\xrightarrow{y=vx}\\text{separable in }v,x", description: "Substitute y = vx to reduce to separable form" },
      { name: "Linear DE (First Order)", latex: "\\frac{dy}{dx}+P(x)y = Q(x)", description: "Standard form; solve using integrating factor" },
      { name: "Integrating Factor", latex: "\\mu = e^{\\int P(x)\\,dx}", description: "Multiply both sides by μ to make left side exact" },
      { name: "Solution of Linear DE", latex: "y\\cdot\\mu = \\int Q(x)\\cdot\\mu\\,dx + C", description: "General solution after applying integrating factor" },
      { name: "Bernoulli's DE", latex: "\\frac{dy}{dx}+P(x)y = Q(x)y^n\\xrightarrow{v=y^{1-n}}\\text{linear in }v", description: "Reduce to linear DE by substitution" },
    ]
  },
  {
    chapter: "Vector Algebra",
    formulas: [
      { name: "Magnitude of Vector", latex: "|\\vec{a}| = \\sqrt{a_x^2+a_y^2+a_z^2}", description: "Length of vector \\vec{a} = a_x\\hat{i}+a_y\\hat{j}+a_z\\hat{k}" },
      { name: "Unit Vector", latex: "\\hat{a} = \\frac{\\vec{a}}{|\\vec{a}|}", description: "Vector of magnitude 1 in direction of \\vec{a}" },
      { name: "Dot (Scalar) Product", latex: "\\vec{a}\\cdot\\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta = a_xb_x+a_yb_y+a_zb_z", description: "Scalar result; θ = angle between vectors" },
      { name: "Cross (Vector) Product", latex: "|\\vec{a}\\times\\vec{b}| = |\\vec{a}||\\vec{b}|\\sin\\theta", description: "Vector perpendicular to both; magnitude = area of parallelogram" },
      { name: "Cross Product (Components)", latex: "\\vec{a}\\times\\vec{b} = \\begin{vmatrix}\\hat{i}&\\hat{j}&\\hat{k}\\\\a_x&a_y&a_z\\\\b_x&b_y&b_z\\end{vmatrix}", description: "Determinant formula" },
      { name: "Scalar Triple Product", latex: "[\\vec{a}\\;\\vec{b}\\;\\vec{c}] = \\vec{a}\\cdot(\\vec{b}\\times\\vec{c})", description: "Volume of parallelepiped; zero if coplanar" },
      { name: "Projection of \\vec{a} on \\vec{b}", latex: "\\text{proj}_{\\vec{b}}\\vec{a} = \\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{b}|}", description: "Scalar projection; vector projection = (scalar proj)×\\hat{b}" },
      { name: "Angle between Vectors", latex: "\\cos\\theta = \\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}||\\vec{b}|}", description: "0 ≤ θ ≤ π" },
    ]
  },
  {
    chapter: "Three Dimensional Geometry",
    formulas: [
      { name: "Equation of Line (Vector Form)", latex: "\\vec{r} = \\vec{a} + \\lambda\\vec{b}", description: "\\vec{a} = position vector of point on line; \\vec{b} = direction vector" },
      { name: "Equation of Line (Cartesian)", latex: "\\frac{x-x_1}{l} = \\frac{y-y_1}{m} = \\frac{z-z_1}{n}", description: "(l,m,n) = direction cosines or ratios" },
      { name: "Angle between Two Lines", latex: "\\cos\\theta = |l_1l_2+m_1m_2+n_1n_2|", description: "Acute angle between lines with direction cosines (l₁,m₁,n₁) and (l₂,m₂,n₂)" },
      { name: "Equation of Plane", latex: "\\vec{r}\\cdot\\hat{n} = d,\\quad ax+by+cz = d", description: "\\hat{n} = normal unit vector; d = perpendicular distance from origin" },
      { name: "Plane through Three Points", latex: "\\begin{vmatrix}x-x_1&y-y_1&z-z_1\\\\x_2-x_1&y_2-y_1&z_2-z_1\\\\x_3-x_1&y_3-y_1&z_3-z_1\\end{vmatrix}=0", description: "Determinant form" },
      { name: "Distance — Point to Plane", latex: "d = \\frac{|ax_1+by_1+cz_1-d|}{\\sqrt{a^2+b^2+c^2}}", description: "Perpendicular distance from (x₁,y₁,z₁) to ax+by+cz=d" },
      { name: "Angle between Line and Plane", latex: "\\sin\\theta = \\frac{|al+bm+cn|}{\\sqrt{a^2+b^2+c^2}\\sqrt{l^2+m^2+n^2}}", description: "θ = angle between line direction and plane normal complement" },
      { name: "Angle between Two Planes", latex: "\\cos\\theta = \\frac{|a_1a_2+b_1b_2+c_1c_2|}{\\sqrt{a_1^2+b_1^2+c_1^2}\\sqrt{a_2^2+b_2^2+c_2^2}}", description: "Angle between their normal vectors" },
      { name: "Skew Lines — Shortest Distance", latex: "d = \\frac{|(\\vec{a}_2-\\vec{a}_1)\\cdot(\\vec{b}_1\\times\\vec{b}_2)|}{|\\vec{b}_1\\times\\vec{b}_2|}", description: "Distance between two non-parallel, non-intersecting lines" },
    ]
  },
  {
    chapter: "Linear Programming",
    formulas: [
      { name: "Objective Function", latex: "Z = ax + by,\\text{ maximise or minimise}", description: "Linear function to optimise" },
      { name: "Constraints", latex: "a_1x+b_1y \\leq c_1,\\;a_2x+b_2y \\leq c_2,\\;x\\geq0,\\;y\\geq0", description: "Inequality constraints; feasible region = intersection" },
      { name: "Optimal Solution Location", latex: "\\text{Optimum occurs at a vertex (corner point) of feasible region}", description: "Corner point theorem; evaluate Z at all vertices" },
      { name: "Unbounded Solution Condition", latex: "\\text{If feasible region is unbounded: check if optimum exists}", description: "Maximum may not exist; minimum may still exist" },
    ]
  },
  {
    chapter: "Probability (Advanced)",
    formulas: [
      { name: "Bayes' Theorem", latex: "P(A_i|B) = \\frac{P(A_i)P(B|A_i)}{\\sum_j P(A_j)P(B|A_j)}", description: "Posterior probability; updates prior with evidence" },
      { name: "Total Probability Theorem", latex: "P(B) = \\sum_{i=1}^n P(A_i)P(B|A_i)", description: "A₁, A₂,..., Aₙ form a partition of sample space" },
      { name: "Binomial Distribution", latex: "P(X=r) = \\binom{n}{r}p^r q^{n-r},\\quad q=1-p", description: "n = trials, p = success probability, r = successes" },
      { name: "Binomial Mean and Variance", latex: "\\mu = np,\\quad\\sigma^2 = npq", description: "q = 1−p" },
      { name: "Poisson Distribution", latex: "P(X=r) = \\frac{e^{-\\lambda}\\lambda^r}{r!}", description: "λ = mean = np for large n, small p" },
      { name: "Expected Value", latex: "E(X) = \\sum x_i P(x_i)", description: "Weighted average of outcomes by probability" },
      { name: "Variance of Random Variable", latex: "\\text{Var}(X) = E(X^2) - [E(X)]^2", description: "Second moment minus square of first moment" },
    ]
  }
];

export default MathematicsFormulaData;
