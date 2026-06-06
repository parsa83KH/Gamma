import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Play, Pause, Eye, Info, RefreshCw, Layers } from "lucide-react";

export default function IsfExplanationAnimation() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [slowMo, setSlowMo] = useState(true); // default to slow-motion to explain the mechanics clearly
  const [waveOffset, setWaveOffset] = useState(0);
  const requestRef = useRef<number | null>(null);

  // Animation ticks for the waveform charts
  useEffect(() => {
    let lastTime = Date.now();
    const animate = () => {
      if (isPlaying) {
        const now = Date.now();
        const delta = now - lastTime;
        // In slow-motion, wave moves slower
        const speed = slowMo ? 0.08 : 0.4;
        setWaveOffset((prev) => (prev + speed * (delta / 16.66)) % (Math.PI * 2));
        lastTime = now;
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, slowMo]);

  // Build points for the wave visualization
  const getSinePoints = (amplitude: number, phaseShift: number = 0, isFlat: boolean = false) => {
    const points = [];
    const width = 240;
    const height = 60;
    const centerY = height / 2;

    for (let x = 0; x <= width; x += 4) {
      const angle = (x / width) * Math.PI * 4 - waveOffset + phaseShift;
      const y = isFlat ? centerY : centerY + Math.sin(angle) * amplitude;
      points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  // Human retina color cones state in fast vs slow-mo
  const getIsfColor = () => {
    if (!isPlaying) return "rgb(254, 243, 199)"; // Warm vanilla neutral white
    if (!slowMo) {
      // At full 40 Hz, colors fuse perfectly on retinal receptors
      return "rgb(254, 243, 199)"; 
    }
    // In slow-mo, show the alternating complementary wavelengths (Emerald green / Hot orange)
    const cycle = Math.sin(waveOffset);
    if (cycle > 0) {
      // Wavelength A: Emerald-Cyan Channel
      return `rgba(20, 184, 166, ${0.4 + cycle * 0.5})`;
    } else {
      // Wavelength B: Neon Pink-Orange Channel
      return `rgba(249, 115, 22, ${0.4 + Math.abs(cycle) * 0.5})`;
    }
  };

  const getLfColor = () => {
    if (!isPlaying) return "rgb(156, 163, 175)"; // Off state gray
    if (!slowMo) {
      // Fast rate looks like bright gray
      return "rgb(226, 232, 240)";
    }
    const cycle = Math.sin(waveOffset);
    const intensity = Math.round(128 + cycle * 120); // extreme bright to dark
    return `rgb(${intensity}, ${intensity}, ${intensity})`;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-2xl space-y-6" id="isf-animation-module">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-primary-500 tracking-wider uppercase block">PHYSICAL MODEL ANIMATOR</span>
          <h4 className="text-lg font-display font-bold text-white">Luminance Flicker vs. Spectral Modulations</h4>
        </div>
        <div className="flex items-center gap-3 bg-slate-950/60 p-1.5 rounded-xl border border-white/5">
          {/* Play / Pause */}
          <button
            id="isf-play-pause-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            className="cursor-pointer p-2 rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-200 hover:text-white transition-all"
            title={isPlaying ? "Pause simulation" : "Play simulation"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          </button>

          {/* Rate switcher */}
          <button
            id="isf-slow-mo-btn"
            onClick={() => setSlowMo(!slowMo)}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              slowMo
                ? "bg-primary-500/10 text-primary-500 border border-primary-500/20"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-white/5"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: slowMo ? '4s' : '0.8s' }} />
            {slowMo ? "SLOW MOTION (EXPLORE MECHANISM)" : "REAL 40 Hz FREQUENCY"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PANEL A: LUMINANCE FLICKER (LF) */}
        <div className="bg-slate-900/40 rounded-2xl p-5 border border-white/5 flex flex-col justify-between space-y-6" id="lf-explanation-card">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wide">Traditional Luminance Flicker (LF)</span>
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Modulates raw light intensity on and off at 40 Hz. Because the average level swings intensely, the user experiences maximum photoreceptor stress and headaches.
            </p>
          </div>

          {/* Biological Visual Loop */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
            
            {/* Visual Light Bulb source */}
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={slowMo ? {} : { opacity: [0.2, 1, 0.2] }}
                transition={slowMo ? {} : { repeat: Infinity, duration: 0.025, ease: "linear" }}
                className="w-16 h-16 rounded-full border-2 border-slate-600/40 flex items-center justify-center transition-colors duration-150 shadow-2xl relative"
                style={{
                  backgroundColor: getLfColor(),
                  boxShadow: isPlaying ? `0 0 ${slowMo ? 15 + Math.sin(waveOffset) * 15 : 20}px rgba(254, 240, 138, 0.15)` : "none"
                }}
              />
              <span className="text-[10px] font-mono font-bold text-slate-500 mt-2 uppercase">Luminance Wave Emitter</span>
            </div>

            {/* Glowing flicker ring when fast */}
            {!slowMo && isPlaying && (
              <div className="absolute inset-0 bg-yellow-500/5 animate-pulse pointer-events-none" style={{ animationDuration: '0.025s' }} />
            )}
          </div>

          {/* Time wave chart */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Retinal Photoreceptor Signal</span>
              <span className="text-rose-400 font-bold">{isPlaying ? (slowMo ? "Harmonic Fluctuation" : "40 Hz Strobing") : "Static"}</span>
            </div>
            <div className="bg-slate-950 rounded-xl p-3 border border-white/5 flex items-center justify-center">
              <svg width="240" height="60" className="overflow-visible">
                {/* Center line */}
                <line x1="0" y1="30" x2="240" y2="30" stroke="rgba(255,255,255,0.06)" />
                {/* Wave line */}
                <path
                  d={`M ${getSinePoints(20)}`}
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0 ms</span>
              <span>120 ms (Time range)</span>
            </div>
          </div>

          <div className="p-3 bg-rose-950/10 border border-rose-500/10 rounded-xl text-[11px] font-mono text-rose-300 leading-normal">
            <strong>Subjective Impact:</strong> Eye perceives deep fluctuations of average luminous power. Compliance is low during domestic reading, TV, or dining tasks.
          </div>
        </div>

        {/* PANEL B: INVISIBLE SPECTRAL FLICKER (ISF) */}
        <div className="bg-slate-900/40 rounded-2xl p-5 border border-white/5 flex flex-col justify-between space-y-6" id="isf-explanation-card">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">Invisible Spectral Flicker (ISF)</span>
            </div>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Splits the wave into complementary spectral ranges (e.g., Red and Green wavelengths) out-of-phase. The sum of light energy fusions stays flat, and flicker vanishes completely!
            </p>
          </div>

          {/* Biological Visual Loop */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
            
            {/* Visual Light Bulb source */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className="w-16 h-16 rounded-full border-2 border-slate-600/40 flex items-center justify-center transition-colors duration-100 shadow-2xl relative"
                style={{
                  backgroundColor: getIsfColor(),
                  boxShadow: isPlaying ? "0 0 25px rgba(20, 184, 166, 0.15)" : "none"
                }}
              />
              <span className="text-[10px] font-mono font-bold text-slate-500 mt-2 uppercase">Balanced Wavelength Emitter</span>
            </div>

            {/* Glowing flat ambient background */}
            {isPlaying && (
              <div className="absolute inset-0 bg-emerald-500/[0.02] pointer-events-none" />
            )}
          </div>

          {/* Time wave chart showing Counter-Phase & Flat Sum */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Retinal Photoreceptor Signal</span>
              <span className="text-emerald-400 font-bold">{isPlaying ? (slowMo ? "Dual Channel Split" : "Fused Perfect Flatline") : "Static"}</span>
            </div>
            <div className="bg-slate-950 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center space-y-2">
              <svg width="240" height="60" className="overflow-visible">
                {/* Center line */}
                <line x1="0" y1="30" x2="240" y2="30" stroke="rgba(255,255,255,0.06)" />
                
                {slowMo ? (
                  <>
                    {/* Wavelength Channel A (Emerald Wave) */}
                    <path
                      d={`M ${getSinePoints(14, 0)}`}
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="1.5"
                      strokeDasharray="2,2"
                      className="transition-all duration-300"
                    />
                    {/* Wavelength Channel B (Orange Wave - 180 deg out of phase) */}
                    <path
                      d={`M ${getSinePoints(14, Math.PI)}`}
                      fill="none"
                      stroke="#ea580c"
                      strokeWidth="1.5"
                      strokeDasharray="2,2"
                      className="transition-all duration-300"
                    />
                  </>
                ) : null}

                {/* Combined Perceived Brightness (FLAT SUM at 40 Hz) */}
                <path
                  d={`M ${getSinePoints(0, 0, true)}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              {slowMo ? (
                <>
                  <span className="text-[#0d9488]">Channel A</span>
                  <span className="text-emerald-400 font-bold">Sum = Perfectly Flat</span>
                  <span className="text-[#ea580c]">Channel B</span>
                </>
              ) : (
                <>
                  <span>0 ms</span>
                  <span className="text-emerald-400 font-bold">Flicker Cancelled to Human Eye</span>
                  <span>120 ms</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3 bg-emerald-950/10 border border-emerald-500/10 rounded-xl text-[11px] font-mono text-emerald-300 leading-normal">
            <strong>Subjective Impact:</strong> Visual cortex detects the high-frequency spectral oscillations at 40 Hz, but photoreceptors average out the brightness, resulting in the appearance of a cozy steady glowing lamp.
          </div>
        </div>

      </div>

      {/* Dynamic educational subtitle summary card */}
      <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 space-y-2">
        <label className="text-xs font-mono font-bold text-sky-400 uppercase flex items-center gap-1">
          <Info className="w-3.5 h-3.5" /> SCIENTIFIC VERDICTS: THE COUNTER-PHASE PRINCIPLE
        </label>
        <p className="text-xs text-slate-400 font-mono leading-relaxed">
          The reason <strong>ISF</strong> is visually imperceptible is due to the <strong>human chromatic fusion frequency limits</strong>. Chromatic signals (color switching) are processed via opponent-color pathways in the parvocellular channels, which have much slower temporal limits (cannot resolve color shifts beyond ~15-20 Hz) compared to luminance flashes (which can be resolved up to 50 Hz). By modulating colors out of phase at 40 Hz, we slip past the visual perception barrier but preserve temporal retinal synchronization driving sub-cortical and cortical cells powerfully at 40 Hz.
        </p>
      </div>

    </div>
  );
}
