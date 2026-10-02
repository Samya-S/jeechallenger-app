"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, CheckCircle2, Layers } from "lucide-react";
import { FaChalkboardTeacher } from "react-icons/fa";
import styles from "./Home.module.css";

/**
 * Parses formula text supporting superscripts indicated by ^(...), ^{...}, or ^x.
 * Example: "e^(iπ) + 1 = 0" -> [
 *   { text: "e", isSup: false },
 *   { text: "iπ", isSup: true },
 *   { text: " + 1 = 0", isSup: false }
 * ]
 */
function parseFormulaSegments(text) {
  const segments = [];
  const regex = /\^(\(([^)]+)\)|\{([^}]+)\}|(\S))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), isSup: false });
    }
    const supContent = match[2] || match[3] || match[4];
    segments.push({ text: supContent, isSup: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), isSup: false });
  }

  return segments;
}

export default function HeroAnimation3D() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    // Detect dark mode accurately from html or body
    const isDarkMode = () => 
      document.documentElement.classList.contains("dark") || 
      document.body.classList.contains("dark");

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Track smooth mouse interpolation
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetMouseX = x * 2;
      targetMouseY = y * 2;
    };

    const handleMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    // 3D Ambient Stardust (Soft drifting micro-sparks, clean & sparse)
    const particleCount = 22;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 120 + Math.random() * 110;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      particles.push({
        x: radius * Math.cos(phi) * Math.cos(theta),
        y: radius * Math.cos(phi) * Math.sin(theta),
        z: radius * Math.sin(phi),
        baseRadius: radius,
        speed: 0.002 + Math.random() * 0.003,
        angle: Math.random() * Math.PI * 2,
        size: 1.2 + Math.random() * 1.3
      });
    }

    // 3D Smooth Luminous Orbital Rings (Physics=Cyan, Maths=Purple, Chemistry=Emerald)
    // Modeled so that when viewed along the screen normal (XY plane), all 3 rings align edge-on
    // as 3 lines crossing at the quantum core (separated by 60° like the classic atom symbol ⚛),
    // and as the view continuously rotates, they bloom into open 3D revolving elliptical paths.
    const orbits = [
      {
        id: "physics",
        radius: 158,
        angle: Math.PI / 6, // 30° - diagonal upward-right
        speed: 0.022,
        electronAngle: 0,
        color: "#38bdf8",
        darkColor: "#38bdf8",
        lightTextColor: "rgba(2, 132, 199,",
      },
      {
        id: "maths",
        radius: 168,
        angle: Math.PI / 2, // 90° - vertical
        speed: -0.018,
        electronAngle: 2.1,
        color: "#8b5cf6",
        darkColor: "#a855f7",
        lightTextColor: "rgba(124, 58, 237,",
      },
      {
        id: "chemistry",
        radius: 162,
        angle: (5 * Math.PI) / 6, // 150° - diagonal upward-left
        speed: 0.024,
        electronAngle: 4.2,
        color: "#10b981",
        darkColor: "#34d399",
        lightTextColor: "rgba(5, 150, 105,",
      },
    ];

    // 3D JEE Math & Science Formulas attached directly to the 3 subject orbital paths:
    // Orbit 0 (Physics - Cyan): E = mc², λ = h/p, Δx·Δp ≥ ħ/2
    // Orbit 1 (Maths - Purple): ∫ f(x)dx, e^(iπ) + 1 = 0, lim(x→0)
    // Orbit 2 (Chemistry - Emerald): PV = nRT, ΔG = ΔH - TΔS, pH = -log[H⁺]
    const rawSymbols = [
      // Physics (Cyan Orbit, 30° tilt)
      { text: "E = mc²", orbitIndex: 0, offsetAngle: 0 },
      { text: "λ = h/p", orbitIndex: 0, offsetAngle: (2 * Math.PI) / 3 },
      { text: "Δx·Δp ≥ ħ/2", orbitIndex: 0, offsetAngle: (4 * Math.PI) / 3 },

      // Mathematics (Purple Orbit, 90° tilt)
      { text: "∫ f(x)dx", orbitIndex: 1, offsetAngle: 0.5 },
      { text: "e^(iπ) + 1 = 0", orbitIndex: 1, offsetAngle: 0.5 + (2 * Math.PI) / 3 },
      { text: "lim(x→0)", orbitIndex: 1, offsetAngle: 0.5 + (4 * Math.PI) / 3 },

      // Chemistry (Emerald Orbit, 150° tilt)
      { text: "PV = nRT", orbitIndex: 2, offsetAngle: 1.0 },
      { text: "ΔG = ΔH - TΔS", orbitIndex: 2, offsetAngle: 1.0 + (2 * Math.PI) / 3 },
      { text: "pH = -log[H⁺]", orbitIndex: 2, offsetAngle: 1.0 + (4 * Math.PI) / 3 },
    ];

    const symbols = rawSymbols.map((s) => ({
      ...s,
      segments: parseFormulaSegments(s.text),
    }));

    let time = 0;

    // Helper: 3D point projection to 2D
    const project3D = (x, y, z, rotX, rotY, cx, cy, fov = 420) => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const scale = fov / (fov + z2);
      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        scale: scale,
        z: z2
      };
    };

    const render = () => {
      time += 0.016;

      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const dark = isDarkMode();

      // Point of view: Continuous smooth 3D rotation with natural screen-plane alignment
      // baseRotX is at eye level (0 at rest) so revolving paths periodically flatten into 3 lines on screen (XY plane)
      const baseRotY = time * 0.22 + currentMouseX * 0.65;
      const baseRotX = -currentMouseY * 0.45;

      // 1. Draw glowing background aura
      const auraGradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, 210);
      if (dark) {
        auraGradient.addColorStop(0, "rgba(96, 165, 250, 0.28)");
        auraGradient.addColorStop(0.4, "rgba(168, 85, 247, 0.16)");
        auraGradient.addColorStop(0.8, "rgba(59, 130, 246, 0.06)");
        auraGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        auraGradient.addColorStop(0, "rgba(59, 130, 246, 0.18)");
        auraGradient.addColorStop(0.5, "rgba(139, 92, 246, 0.08)");
        auraGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      }
      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, 220, 0, Math.PI * 2);
      ctx.fill();

      // 2. Ambient Subtle Cosmic Stardust (Clean & spaced, NO spiderweb lines)
      const projectedParticles = particles.map((p) => {
        p.angle += p.speed;
        const currentRadius = p.baseRadius + Math.sin(time * 1.5 + p.angle) * 6;
        const px = currentRadius * Math.cos(p.angle);
        const py = p.y + Math.sin(time * 0.8 + p.angle) * 4;
        const pz = currentRadius * Math.sin(p.angle);
        return project3D(px, py, pz, baseRotX, baseRotY, cx, cy);
      });

      for (let i = 0; i < projectedParticles.length; i++) {
        const p = projectedParticles[i];
        if (p.scale <= 0) continue;
        const alpha = Math.max(0.15, Math.min(0.65, (p.z + 160) / 320));

        ctx.fillStyle = dark
          ? `rgba(186, 230, 253, ${alpha})`
          : `rgba(99, 102, 241, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.9, particles[i].size * p.scale), 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Smooth Luminous Energy Rings & Light Beads (Revolving Paths that periodically flatten into 3 lines)
      orbits.forEach((orbit) => {
        orbit.electronAngle += orbit.speed;
        const ringSteps = 80;
        const ringPoints = [];
        const ringColor = dark ? orbit.darkColor : orbit.color;

        const cosAngle = Math.cos(orbit.angle);
        const sinAngle = Math.sin(orbit.angle);

        for (let s = 0; s <= ringSteps; s++) {
          const stepAngle = (s / ringSteps) * Math.PI * 2;
          const u = Math.cos(stepAngle) * orbit.radius;
          const v = Math.sin(stepAngle) * orbit.radius;

          const ox = u * cosAngle;
          const oy = u * sinAngle;
          const oz = v;

          ringPoints.push(project3D(ox, oy, oz, baseRotX, baseRotY, cx, cy));
        }

        // Smooth continuous energy ring stroke (NO dashes)
        ctx.beginPath();
        for (let s = 0; s < ringPoints.length; s++) {
          if (s === 0) ctx.moveTo(ringPoints[s].x, ringPoints[s].y);
          else ctx.lineTo(ringPoints[s].x, ringPoints[s].y);
        }

        if (dark) {
          ctx.shadowColor = ringColor;
          ctx.shadowBlur = 7;
          ctx.strokeStyle = ringColor;
          ctx.lineWidth = 1.4;
        } else {
          ctx.shadowBlur = 0;
          ctx.strokeStyle = ringColor;
          ctx.lineWidth = 1.3;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Calculate traveling energy bead position
        const eu = Math.cos(orbit.electronAngle) * orbit.radius;
        const ev = Math.sin(orbit.electronAngle) * orbit.radius;

        const eox = eu * cosAngle;
        const eoy = eu * sinAngle;
        const eoz = ev;

        const electronProj = project3D(eox, eoy, eoz, baseRotX, baseRotY, cx, cy);

        // Radiant Light Bead
        if (electronProj.scale > 0) {
          const eRadius = 4.2 * electronProj.scale;
          const glowGrad = ctx.createRadialGradient(
            electronProj.x,
            electronProj.y,
            0,
            electronProj.x,
            electronProj.y,
            eRadius * 3.8
          );
          glowGrad.addColorStop(0, dark ? "#ffffff" : ringColor);
          glowGrad.addColorStop(0.35, ringColor);
          glowGrad.addColorStop(1, "rgba(0,0,0,0)");

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(electronProj.x, electronProj.y, eRadius * 3.8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(electronProj.x, electronProj.y, eRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. Central Sleek Holographic Quantum Orb (Luminous Glass Sphere with 3D Depth)
      const orbRadius = 34 + Math.sin(time * 2) * 0.8;

      // Soft ambient radiant glow halo
      const glowRadius = orbRadius * 2.2;
      const auraGrad = ctx.createRadialGradient(cx, cy, orbRadius * 0.4, cx, cy, glowRadius);
      if (dark) {
        auraGrad.addColorStop(0, "rgba(56, 189, 248, 0.3)");
        auraGrad.addColorStop(0.4, "rgba(99, 102, 241, 0.18)");
        auraGrad.addColorStop(0.75, "rgba(168, 85, 247, 0.06)");
        auraGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        auraGrad.addColorStop(0, "rgba(56, 189, 248, 0.25)");
        auraGrad.addColorStop(0.4, "rgba(99, 102, 241, 0.12)");
        auraGrad.addColorStop(0.8, "rgba(168, 85, 247, 0.04)");
        auraGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      }
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Translucent Glass Sphere Body
      const glassGrad = ctx.createRadialGradient(
        cx - orbRadius * 0.35,
        cy - orbRadius * 0.35,
        orbRadius * 0.08,
        cx,
        cy,
        orbRadius
      );
      if (dark) {
        glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.6)");
        glassGrad.addColorStop(0.25, "rgba(186, 230, 253, 0.25)");
        glassGrad.addColorStop(0.65, "rgba(79, 70, 229, 0.18)");
        glassGrad.addColorStop(0.9, "rgba(30, 27, 75, 0.35)");
        glassGrad.addColorStop(1, "rgba(56, 189, 248, 0.6)");
      } else {
        glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        glassGrad.addColorStop(0.3, "rgba(224, 242, 254, 0.45)");
        glassGrad.addColorStop(0.7, "rgba(99, 102, 241, 0.18)");
        glassGrad.addColorStop(1, "rgba(59, 130, 246, 0.55)");
      }
      ctx.fillStyle = glassGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      // Delicate 3D Holographic Latitude & Longitude Rings on the Glass Orb
      // Fixed 22° axial tilt ensures the orb always exhibits stunning spherical 3D contouring
      const orbAxialTilt = 0.38;
      const ringTiltX = baseRotX + orbAxialTilt;
      const ringTiltY = baseRotY;
      const orbSteps = 36;

      // Equator Ring
      ctx.beginPath();
      for (let s = 0; s <= orbSteps; s++) {
        const a = (s / orbSteps) * Math.PI * 2;
        const rx = Math.cos(a) * (orbRadius * 0.95);
        const ry = 0;
        const rz = Math.sin(a) * (orbRadius * 0.95);
        const p = project3D(rx, ry, rz, ringTiltX, ringTiltY, cx, cy);
        if (s === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = dark ? "rgba(186, 230, 253, 0.4)" : "rgba(79, 70, 229, 0.35)";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // Cross Meridian Ring - full circumference great circle in YZ plane (perpendicular to Prime Meridian and Equator)
      ctx.beginPath();
      for (let s = 0; s <= orbSteps; s++) {
        const a = (s / orbSteps) * Math.PI * 2;
        const rx = 0;
        const ry = Math.sin(a) * (orbRadius * 0.95);
        const rz = Math.cos(a) * (orbRadius * 0.95);
        const p = project3D(rx, ry, rz, ringTiltX, ringTiltY, cx, cy);
        if (s === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = dark ? "rgba(125, 211, 252, 0.35)" : "rgba(56, 189, 248, 0.3)";
      ctx.lineWidth = 0.95;
      ctx.stroke();

      // Meridian Ring
      ctx.beginPath();
      for (let s = 0; s <= orbSteps; s++) {
        const a = (s / orbSteps) * Math.PI * 2;
        const rx = Math.cos(a) * (orbRadius * 0.95);
        const ry = Math.sin(a) * (orbRadius * 0.95);
        const rz = 0;
        const p = project3D(rx, ry, rz, ringTiltX, ringTiltY, cx, cy);
        if (s === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = dark ? "rgba(192, 132, 252, 0.3)" : "rgba(139, 92, 246, 0.25)";
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Inner Radiant Energy Core (Heart of the Orb)
      const innerCoreRadius = 9 + Math.sin(time * 3) * 1.2;
      const innerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerCoreRadius * 2.2);
      innerGlow.addColorStop(0, "#ffffff");
      innerGlow.addColorStop(0.35, "rgba(56, 189, 248, 0.85)");
      innerGlow.addColorStop(0.7, "rgba(99, 102, 241, 0.35)");
      innerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = innerGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, innerCoreRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Glowing Glass Sphere Crisp Edge Rim
      ctx.strokeStyle = dark ? "rgba(186, 230, 253, 0.55)" : "rgba(99, 102, 241, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, orbRadius, 0, Math.PI * 2);
      ctx.stroke();

      // 5. Draw Floating 3D Science & Math Formulas revolving along their respective subject paths
      symbols.forEach((sym) => {
        const orbit = orbits[sym.orbitIndex];
        const r = orbit.radius;

        // Position along the circular orbit ring - glides smoothly with orbit velocity
        const currentAngle = sym.offsetAngle + time * (orbit.speed * 0.5);

        const u = r * Math.cos(currentAngle);
        const v = r * Math.sin(currentAngle);

        const cosAngle = Math.cos(orbit.angle);
        const sinAngle = Math.sin(orbit.angle);

        // Exact 3D point along this tilted orbit ring
        const px = u * cosAngle;
        const py = u * sinAngle;
        const pz = v;

        const proj = project3D(px, py, pz, baseRotX, baseRotY, cx, cy);
        if (proj.scale > 0) {
          // Perspective scale and depth lighting:
          const depthAlpha = Math.max(0.55, Math.min(1.0, 0.72 + (proj.z / 260) * 0.28));
          const formulaScale = Math.max(0.78, Math.min(1.18, proj.scale));

          ctx.save();
          ctx.translate(proj.x, proj.y);
          ctx.scale(formulaScale, formulaScale);

          // Crisp, subtle protective typography halo
          const haloColor = dark
            ? `rgba(15, 23, 42, ${depthAlpha * 0.9})`
            : `rgba(255, 255, 255, ${depthAlpha * 0.95})`;
          ctx.strokeStyle = haloColor;
          ctx.lineWidth = 2.4;
          ctx.lineJoin = "round";

          const ringColor = dark ? orbit.darkColor : orbit.color;

          if (dark) {
            ctx.shadowColor = ringColor;
            ctx.shadowBlur = proj.z > 0 ? 10 : 3;
            ctx.fillStyle = `rgba(248, 250, 252, ${depthAlpha})`;
          } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = `${orbit.lightTextColor} ${depthAlpha})`;
          }

          // High-resolution fixed font definition; continuous scale handled smoothly by canvas matrix
          const baseFont = "bold 13px Jost, system-ui, sans-serif";
          const supFont = "bold 9px Jost, system-ui, sans-serif";

          if (sym.segments.length === 1 && !sym.segments[0].isSup) {
            ctx.font = baseFont;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeText(sym.segments[0].text, 0, 0);
            ctx.fillText(sym.segments[0].text, 0, 0);
          } else {
            ctx.font = baseFont;
            let totalW = 0;
            const segsWithWidth = sym.segments.map((seg) => {
              ctx.font = seg.isSup ? supFont : baseFont;
              const w = ctx.measureText(seg.text).width;
              totalW += w;
              return { ...seg, width: w };
            });

            let curX = -totalW / 2;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";

            segsWithWidth.forEach((seg) => {
              ctx.font = seg.isSup ? supFont : baseFont;
              const yOffset = seg.isSup ? -4 : 0;
              ctx.strokeText(seg.text, curX, yOffset);
              ctx.fillText(seg.text, curX, yOffset);
              curX += seg.width;
            });
          }

          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[560px] aspect-square mx-auto flex items-center justify-center select-none touch-pan-y"
    >
      {/* Background Soft Lighting Gradients */}
      <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-blue-500/15 via-indigo-500/15 to-cyan-500/15 blur-3xl pointer-events-none" />

      {/* 3D Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
        aria-hidden="true"
      />

      {/* Floating 3D Micro Glass Badges Overlay with matching Navbar glass styling */}

      {/* Top Left Badge: 24/7 AI Doubt Solver */}
      <div 
        className={`absolute top-2 sm:top-4 left-0 sm:left-2 z-20 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-2.5 sm:p-3 shadow-sm dark:shadow-none transition-all duration-300 hover:scale-105 pointer-events-auto ${styles.floatBadge1}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/15">
            <FaChalkboardTeacher className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900 dark:text-white">AI Doubt Solver</div>
            <p className="text-[10px] font-medium text-gray-600 dark:text-gray-200">Step-by-step 24/7 help</p>
          </div>
        </div>
      </div>

      {/* Top Right Badge: Chapter-Wise PYQs */}
      <div 
        className={`absolute top-8 sm:top-10 right-0 sm:right-2 z-20 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-2.5 sm:p-3 shadow-sm dark:shadow-none transition-all duration-300 hover:scale-105 pointer-events-auto ${styles.floatBadge2}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/15">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900 dark:text-white">Chapter-Wise PYQs</div>
            <p className="text-[10px] font-medium text-gray-600 dark:text-gray-200">Official Shift Papers</p>
          </div>
        </div>
      </div>

      {/* Bottom Left Badge: Syllabus Tracker */}
      <div 
        className={`absolute bottom-4 sm:bottom-6 left-0 sm:left-2 z-20 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-2.5 sm:p-3 shadow-sm dark:shadow-none transition-all duration-300 hover:scale-105 pointer-events-auto ${styles.floatBadge3}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/15">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900 dark:text-white">Syllabus Tracker</div>
            <p className="text-[10px] font-medium text-gray-600 dark:text-gray-200">All 88 Chapters • PCM</p>
          </div>
        </div>
      </div>

      {/* Bottom Right Badge: Formulas & Mindmaps */}
      <div 
        className={`absolute bottom-2 sm:bottom-4 right-0 sm:right-2 z-20 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-800 rounded-2xl p-2.5 sm:p-3 shadow-sm dark:shadow-none transition-all duration-300 hover:scale-105 pointer-events-auto ${styles.floatBadge4}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-sm shadow-purple-500/15">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-900 dark:text-white">Formulas & Mindmaps</div>
            <p className="text-[10px] font-medium text-gray-600 dark:text-gray-200">High-Yield Notes • PCM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
