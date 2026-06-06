import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Play, Zap, Info, Sun, Eye, Navigation, Settings2 } from "lucide-react";
import { SimulationState } from "../types";

interface EegSimulatorProps {
  state: SimulationState;
  onChange: (state: SimulationState | ((prev: SimulationState) => SimulationState)) => void;
}

export default function EegSimulator({ state, onChange }: EegSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fftCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [slowMo, setSlowMo] = useState(false);
  const [activeTab, setActiveTab] = useState<"flicker" | "eeg" | "parameters">("flicker");

  // Calculate metrics based on parameters
  const getSimulatedMetrics = () => {
    const { stimulusType, brightness, peripheralAngle, isStimulating } = state;

    if (!isStimulating) {
      return {
        comfort: 100,
        perceivedFlicker: 0,
        ssvepAmplitude: 0,
        tolerability: 100,
      };
    }

    // Base neural entrainment (SSVEP Amplitude) at 40Hz
    let baseEntrainment = { LF: 9.2, CF: 8.5, ISF: 7.9 }[stimulusType];
    // Modulate based on brightness (decrement slightly, but no statistically significant drop in experimental range)
    // Decreasing brightness from 100 to 10 reduces amplitude from 100% to ~85%
    const brightnessFactor = 0.85 + (brightness / 100) * 0.15;
    // Modulate based on peripheral angle (shifting to periphery reduces amplitude slightly)
    // 0 deg = 100%, 60 deg = 72%
    const angleFactor = 1.0 - (peripheralAngle / 60) * 0.28;

    const ssvepAmplitude = baseEntrainment * brightnessFactor * angleFactor;

    // Perceived Flicker (0 to 100)
    let baseFlicker = { LF: 95, CF: 80, ISF: 8 }[stimulusType];
    // Flicker increases with brightness
    const flickerFactor = 0.5 + (brightness / 100) * 0.5;
    const perceivedFlicker = Math.min(100, Math.round(baseFlicker * flickerFactor));

    // Comfort Score (0 to 100)
    // ISF is very comfortable (90s). LF is very uncomfortable.
    let baseComfort = { LF: 18, CF: 30, ISF: 92 }[stimulusType];
    // Comfort is much better at lower brightness levels!
    const brightnessComfortPenalty = (brightness / 100) * 45; // high brightness hurts comfort
    // Peripheral angle improves comfort (less intrusive if dynamic/off-focus)
    const angleComfortBonus = (peripheralAngle / 60) * 12;

    const comfort = Math.max(
      5,
      Math.min(100, Math.round(baseComfort - brightnessComfortPenalty + angleComfortBonus))
    );

    // Tolerability Score: a compound score indicating continuous wear feasibility
    const tolerability = Math.max(
      5,
      Math.min(100, Math.round((comfort * 2 + (100 - perceivedFlicker)) / 3))
    );

    return {
      comfort,
      perceivedFlicker,
      ssvepAmplitude: parseFloat(ssvepAmplitude.toFixed(2)),
      tolerability,
    };
  };

  const metrics = getSimulatedMetrics();

  // Draw EEG Time-Domain Signal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high-DPI scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = rect.height;

    let offset = 0;
    const points: number[] = new Array(Math.ceil(width)).fill(0);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw background baseline grid lines
      ctx.strokeStyle = "rgba(148, 163, 184, 0.05)";
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Generate next data point
      const time = Date.now() * 0.001;
      const fatigueFactor = (100 - metrics.comfort) / 100; // 0 (perfect comfort) to 0.95 (extreme discomfort)
      
      // Background neural oscillations adapt dynamically to user comfort/fatigue
      const alpha = Math.sin(time * 10 * Math.PI * 2) * (5 - fatigueFactor * 2);
      const beta = Math.sin(time * 22 * Math.PI * 2) * (3 + fatigueFactor * 2.5);
      const theta = Math.sin(time * 6 * Math.PI * 2) * (7 + fatigueFactor * 4);

      let visual40Hz = 0;
      let stimulusNoise = 0;
      
      if (state.isStimulating) {
        const multiplier = slowMo ? 0.1 : 1.0;
        const phase = time * 40 * Math.PI * 2 * multiplier;
        
        if (state.stimulusType === "LF") {
          // LF: Sharp, square-ish, high-stress visual response featuring higher harmonic coefficients
          visual40Hz = (Math.sin(phase) + Math.sin(phase * 3) / 3.5) * (metrics.ssvepAmplitude * 3.8);
          // Glare and high flashing triggers additional high-frequency muscle twitching/tension noise in EEG
          stimulusNoise = (Math.random() - 0.5) * 5.5 * (state.brightness / 100);
        } else if (state.stimulusType === "CF") {
          // CF: Unstable phase envelope (representing active binocular rivalry in chromatic opponent pathways)
          const colorBeating = Math.sin(time * 3 * Math.PI * 2);
          visual40Hz = Math.sin(phase) * (metrics.ssvepAmplitude * 3.4) * (0.8 + 0.2 * colorBeating);
          stimulusNoise = (Math.random() - 0.5) * 2.0;
        } else {
          // ISF: Perfect, pristine, smooth resonance. Clean mathematical sinusoid showing targeted sub-threshold compliance
          visual40Hz = Math.sin(phase) * (metrics.ssvepAmplitude * 3.6);
          stimulusNoise = (Math.random() - 0.5) * 0.4; // Very low jitter during focused, comfortable ISF entrainment
        }
      }

      const totalNoise = (Math.random() - 0.5) * (6 + fatigueFactor * 3.5) + stimulusNoise;
      const totalSignal = alpha + beta + theta + totalNoise + visual40Hz;

      // Update points array (sliding window)
      points.shift();
      points.push(totalSignal);

      // Draw the wave
      ctx.beginPath();
      ctx.lineWidth = 1.8;
      
      // Match wave outline color with selected stimulus logic
      if (state.isStimulating) {
        ctx.strokeStyle = state.stimulusType === "ISF" ? "#10b981" : state.stimulusType === "CF" ? "#c084fc" : "#f59e0b";
      } else {
        ctx.strokeStyle = "#38bdf8";
      }
      ctx.lineJoin = "round";

      for (let i = 0; i < points.length; i++) {
        const x = i;
        const y = height / 2 + points[i];
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Show stimulation lock header
      if (state.isStimulating) {
        ctx.fillStyle = state.stimulusType === "ISF" ? "rgba(16, 185, 129, 0.07)" : state.stimulusType === "CF" ? "rgba(192, 132, 252, 0.07)" : "rgba(245, 158, 11, 0.07)";
        ctx.fillRect(0, 0, width, 30);
        ctx.fillStyle = state.stimulusType === "ISF" ? "#10b981" : state.stimulusType === "CF" ? "#c084fc" : "#f59e0b";
        ctx.font = "bold 11px JetBrains Mono, monospace";
        ctx.fillText(`EEG: 40 Hz ENTRAINED (${state.stimulusType} MODE ACTIVE)`, 10, 19);
      } else {
        ctx.fillStyle = "rgba(56, 189, 248, 0.04)";
        ctx.fillRect(0, 0, width, 30);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 11px JetBrains Mono, monospace";
        ctx.fillText("EEG: RESTING STATE SPONTANEOUS BRAIN ACTIVITY", 10, 19);
      }

      offset++;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [state.isStimulating, state.stimulusType, metrics.ssvepAmplitude, metrics.comfort, state.brightness, slowMo, activeTab]);

  // Draw EEG FFT (Power Spectrum)
  useEffect(() => {
    const canvas = fftCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = rect.height;

    // Redraw FFT static/animated spectrum
    ctx.clearRect(0, 0, width, height);

    // Draw baseline grid lines
    ctx.strokeStyle = "rgba(148, 163, 184, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      // Draw axis numbers
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px JetBrains Mono, monospace";
      const freq = Math.round((x / width) * 60);
      if (freq > 0 && freq <= 60) {
        ctx.fillText(`${freq}Hz`, x - 15, height - 3);
      }
    }

    // Generate spectral values
    const numBins = 60;
    const bgPower: number[] = [];

    for (let f = 0; f < numBins; f++) {
      // General 1/f noise curve of human EEG spectrum + some alpha bump at 10Hz
      // Comfort level affects cognitive calm / fatigue noise baseline
      const fatigueFactor = (100 - metrics.comfort) / 100;
      let val = 15 / (1 + f * 0.15) + (Math.random() - 0.5) * (1.2 + fatigueFactor * 1.6);
      
      if (f >= 8 && f <= 12) {
        // Alpha peak (reduced during stressful flickering or fatigue states)
        val += (6 - fatigueFactor * 2.5) * (1 - Math.abs(f - 10) / 2);
      }

      // Eye glare and flashing discomfort triggers supplementary beta tension noise (18-30 Hz)
      if (f >= 18 && f <= 30 && state.isStimulating && state.stimulusType !== "ISF") {
        val += (state.stimulusType === "LF" ? 3.6 : 1.8) * Math.random();
      }
      
      // Differentiate stimulated 40Hz and its associated harmonics/subharmonics
      if (state.isStimulating) {
        if (f === 40) {
          // Sharp primary peak proportional to SSVEP magnitude with randomized tiny micro-fluctuations
          val += metrics.ssvepAmplitude * 8.8 + (Math.random() - 0.5) * 0.8;
        } else if (f === 20 && state.stimulusType === "LF") {
          // 20 Hz Subharmonic specific to traditional harsh Luminance strobe (non-linear entrainment response)
          val += metrics.ssvepAmplitude * 1.6;
        } else if (f === 60 && state.stimulusType === "LF") {
          // 60 Hz first upper harmonic for hard Luminance strobe
          val += metrics.ssvepAmplitude * 1.1;
        } else if ((f === 38 || f === 42) && state.stimulusType === "CF") {
          // Smeared shoulders around 40 Hz for Chromatic Flicker representing binocular color rivalry/interference
          val += metrics.ssvepAmplitude * 1.5;
        } else if ((f === 39 || f === 41) && state.stimulusType === "LF") {
          // Glare shoulder noise
          val += metrics.ssvepAmplitude * 0.7;
        }
      } else {
        if (f === 40) {
          // Small resting 40 Hz activity (gamma noise)
          val += 1.2 + Math.random() * 0.6;
        }
      }
      bgPower.push(Math.max(2, val));
    }

    // Draw spectrum filled curve
    ctx.beginPath();
    ctx.moveTo(0, height - 15);
    for (let f = 0; f < numBins; f++) {
      const x = (f / numBins) * width;
      const y = height - 15 - bgPower[f];
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height - 15);
    ctx.closePath();
    ctx.fillStyle = state.isStimulating
      ? state.stimulusType === "ISF"
        ? "rgba(16, 185, 129, 0.08)"
        : state.stimulusType === "CF"
        ? "rgba(192, 132, 252, 0.08)"
        : "rgba(245, 158, 11, 0.08)"
      : "rgba(56, 189, 248, 0.08)";
    ctx.fill();

    // Draw spectrum outline line
    ctx.beginPath();
    for (let f = 0; f < numBins; f++) {
      const x = (f / numBins) * width;
      const y = height - 15 - bgPower[f];
      if (f === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = state.isStimulating
      ? state.stimulusType === "ISF"
        ? "#10b981"
        : state.stimulusType === "CF"
        ? "#c084fc"
        : "#f59e0b"
      : "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw a prominent label + line for 40 Hz peak
    if (state.isStimulating) {
      const x40 = (40 / numBins) * width;
      const y40 = height - 15 - bgPower[40];

      // Draw vertical tracker
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = state.stimulusType === "ISF" ? "rgba(16, 185, 129, 0.6)" : state.stimulusType === "CF" ? "rgba(192, 132, 252, 0.6)" : "rgba(239, 68, 68, 0.6)";
      ctx.beginPath();
      ctx.moveTo(x40, y40);
      ctx.lineTo(x40, height - 15);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw indicator circle at 40 Hz peak
      ctx.fillStyle = state.stimulusType === "ISF" ? "#10b981" : state.stimulusType === "CF" ? "#c084fc" : "#ef4444";
      ctx.beginPath();
      ctx.arc(x40, y40, 4, 0, Math.PI * 2);
      ctx.fill();

      // Text label
      ctx.fillStyle = state.stimulusType === "ISF" ? "#34d399" : state.stimulusType === "CF" ? "#c084fc" : "#f87171";
      ctx.font = "bold 12px Outfit, sans-serif";
      ctx.fillText(`ENTRAINED 40Hz: ${metrics.ssvepAmplitude} μV`, x40 + 8, y40 - 4);
    }
  }, [state.isStimulating, state.stimulusType, metrics.ssvepAmplitude, metrics.comfort, activeTab]);

  // Render flicker simulation speed
  const getFlickerBackground = () => {
    if (!state.isStimulating) return "bg-gray-800";
    if (slowMo) {
      // In slow motion we transition back and forth slowly to show the mechanism
      return state.stimulusType === "LF"
        ? "slow-flicker-luminance"
        : state.stimulusType === "CF"
        ? "slow-flicker-chromatic"
        : "slow-flicker-spectral";
    }

    // Full 40Hz: visually, ISF is near static white/fused. CF is vibratory color mud. LF is harsh strobing structure.
    return state.stimulusType === "LF"
      ? "animate-flicker-luminance"
      : state.stimulusType === "CF"
      ? "animate-flicker-chromatic"
      : "bg-amber-100/90"; // Completely fused, comfortable warm environmental glow!
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/5" id="genus-dashboard">
      <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-amber-500/10 text-amber-500 ${state.isStimulating ? 'animate-pulse' : ''}`}>
            <Zap className="w-5 h-5" id="zap-icon-simulation" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-white">40 Hz Neuro-Flicker Laboratory</h3>
            <p className="text-xs text-slate-400 font-mono">Interactive Stimulation Sandbox & EEG Spectrum</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Stimulation master switch button */}
          <button
            id="simulation-toggle-btn"
            onClick={() => onChange((prev) => ({ ...prev, isStimulating: !prev.isStimulating }))}
            className={`cursor-pointer px-4 py-2 rounded-xl font-display text-xs font-semibold tracking-wide flex items-center gap-2 transition-all duration-300 ${
              state.isStimulating
                ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/25"
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
          >
            {state.isStimulating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  <Activity className="w-4 h-4" />
                </motion.div>
                STOP STIMULATION
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                START 40 Hz STIMULATION
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-slate-800/40">
        {/* LEFT COLUMN: Controls & Settings */}
        <div className="lg:col-span-4 p-6 bg-slate-900/40 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Stimulus Type Radio Selector */}
            <div className="space-y-3">
              <label className="text-xs font-mono tracking-wider font-semibold text-slate-400 uppercase flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5 text-blue-400" /> STIMULUS DESIGN TYPE
              </label>
              <div className="grid grid-cols-1 gap-2" id="stimulus-type-selector">
                {[
                  {
                    id: "LF",
                    name: "Luminance Flicker (LF)",
                    desc: "Classic high-intensity flashing",
                    color: "border-red-500/30 text-red-400 bg-red-500/5",
                  },
                  {
                    id: "CF",
                    name: "Chromatic Flicker (CF)",
                    desc: "Alternating red & green hues",
                    color: "border-purple-500/30 text-purple-400 bg-purple-500/5",
                  },
                  {
                    id: "ISF",
                    name: "Invisible Spectral Flicker (ISF)",
                    desc: "Fast balanced chromatic composition shift",
                    color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    id={`stimulus-type-btn-${t.id}`}
                    onClick={() =>
                      onChange((prev) => ({ ...prev, stimulusType: t.id as "LF" | "CF" | "ISF" }))
                    }
                    className={`cursor-pointer w-full text-left p-3.5 rounded-xl border text-sm transition-all duration-200 flex flex-col justify-between ${
                      state.stimulusType === t.id
                        ? "border-primary-500/80 bg-primary-950/20 shadow-inner ring-1 ring-primary-500/40"
                        : "border-white/5 bg-slate-950/20 text-slate-400 hover:bg-slate-950/40 hover:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold font-display text-slate-100 flex items-center gap-2">
                        {t.name}
                        {t.id === "ISF" && (
                          <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-medium border border-emerald-500/20">
                            OPTIMAL
                          </span>
                        )}
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        state.stimulusType === t.id ? "border-primary-500" : "border-slate-600"
                      }`}>
                        {state.stimulusType === t.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 mt-1">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brightness slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" /> STIMULATION LUMINANCE
                </span>
                <span className="text-amber-400 font-bold">{state.brightness}%</span>
              </div>
              <input
                id="brightness-slider"
                type="range"
                min="10"
                max="100"
                value={state.brightness}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, brightness: parseInt(e.target.value) }))
                }
                className="w-full accent-amber-500 bg-slate-950/40 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>10% (Dim Limit)</span>
                <span>100% (Bright Limit)</span>
              </div>
            </div>

            {/* Peripheral angle slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-sky-400 rotate-90" /> VISUAL ECCENTRICITY
                </span>
                <span className="text-sky-400 font-bold">{state.peripheralAngle}°</span>
              </div>
              <input
                id="peripheral-angle-slider"
                type="range"
                min="0"
                max="60"
                value={state.peripheralAngle}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, peripheralAngle: parseInt(e.target.value) }))
                }
                className="w-full accent-sky-500 bg-slate-950/40 h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>0° (Direct Gaze)</span>
                <span>60° (Deep Peripheral)</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 space-y-2 text-slate-400 text-xs font-mono leading-relaxed bg-slate-950/10 p-3 rounded-xl">
            <div className="flex gap-1.5 text-amber-500 font-semibold mb-1">
              <Info className="w-4 h-4 shrink-0" />
              <span>Translation Mechanics:</span>
            </div>
            {state.stimulusType === "ISF" ? (
              <p>
                ISF rapidly exchanges high-efficiency primary wavelengths at 40 Hz, fusing colors on human photoreceptors (constancy) but driving synaptic visual pathways robustly at 40 Hz.
              </p>
            ) : state.stimulusType === "CF" ? (
              <p>
                CF cycles between complementary color channels. Since luminance is partially preserved, strong chromatic vibrations remain highly distracting over time.
              </p>
            ) : (
              <p>
                LF cycles standard luminosity strictly on & off. The sudden 40 Hz brightness drops cause maximum photo-stress, migraines, and low protocol compliance.
              </p>
            )}
          </div>
        </div>

        {/* CENTER/RIGHT COLUMN: Live visual workspace, scope output & real-time EEG graph */}
        <div className="lg:col-span-8 p-6 bg-slate-950/20 flex flex-col gap-6 justify-between">
          
          {/* Sub Navigation */}
          <div className="flex border-b border-white/5 pb-2 justify-between items-center">
            <div className="flex gap-2">
              {[
                { id: "flicker", name: "Visual Simulator" },
                { id: "eeg", name: "Cortical Entrainment (EEG)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  id={`simulator-tab-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-display font-medium tracking-wide transition-all ${
                    activeTab === tab.id
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {activeTab === "flicker" && state.isStimulating && (
              <div className="flex items-center gap-1.5">
                <input
                  id="slow-mo-checkbox"
                  type="checkbox"
                  checked={slowMo}
                  onChange={(e) => setSlowMo(e.target.checked)}
                  className="rounded bg-slate-950/40 accent-amber-500 cursor-pointer"
                />
                <label htmlFor="slow-mo-checkbox" className="text-[11px] font-mono text-slate-400 select-none cursor-pointer">
                  Spectra Slow-Motion (Reveal shift)
                </label>
              </div>
            )}
          </div>

          <div className="flex-grow flex flex-col justify-center min-h-[240px]">
            {activeTab === "flicker" ? (
              /* TAB 1: Visual Flicker Simulation Box */
              <div className="flex flex-col items-center justify-center p-6 bg-slate-950/30 rounded-xl relative border border-white/5 overflow-hidden">
                <div className="text-center mb-4 z-10">
                  <span className="text-slate-300 text-xs md:text-sm font-semibold font-mono tracking-wider uppercase">PATIENT-SIDE VISUAL FIELD REPRESENTATION</span>
                </div>

                {/* Stimulus Ring box */}
                <div className="relative w-48 h-48 rounded-full border border-slate-700/40 flex items-center justify-center z-10 transition-transform duration-500">
                  {/* Flicker Core */}
                  <div
                    id="flicker-bulb-element"
                    className={`w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative shadow-2xl ${getFlickerBackground()}`}
                    style={{
                      opacity: state.isStimulating ? (0.2 + (state.brightness / 100) * 0.8) : 0.15,
                    }}
                  >
                  </div>

                  {/* Peripheral Angle circular boundary overlay line */}
                  <div
                    className="absolute inset-0 rounded-full border border-dashed border-sky-500/20 pointer-events-none"
                    style={{
                      transform: `scale(${1 + (state.peripheralAngle / 60) * 0.4})`,
                    }}
                  />
                </div>

                <div className="mt-4 text-center z-10 max-w-sm">
                  {state.isStimulating ? (
                    <p className="text-xs md:text-sm text-slate-300 font-mono leading-relaxed font-medium">
                      {state.stimulusType === "ISF"
                        ? "ISF drives 40 Hz cells inside the retina while maintaining a completely motionless steady luminance white circle (92% Comfort!)."
                        : state.stimulusType === "LF"
                        ? "LF flashes brightness repeatedly. Extreme eye strain is highly visible even at lower brightness limits (18% Comfort)."
                        : "CF shifts chromaticity values. Less screen brightness flicker, but highly intrusive color shaking."}
                    </p>
                  ) : (
                    <p className="text-xs md:text-sm text-slate-400 font-mono font-medium">Toggle 'Start Stimulation' to trigger 40 Hz light paradigms.</p>
                  )}
                </div>
              </div>
            ) : (
              /* TAB 2: Cortical Entrainment / EEG & FFT graphs */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/30 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs md:text-sm font-mono font-semibold text-slate-300 uppercase flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-blue-400" /> Occipital EEG Channel (O1)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Horizontal: Time (1s)</span>
                  </div>
                  <canvas ref={canvasRef} className="w-full h-36 bg-slate-950/50 rounded-lg border border-white/5" />
                </div>

                <div className="bg-slate-950/30 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs md:text-sm font-mono font-semibold text-slate-300 uppercase flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" /> Power Spectral Density (PSD)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">X-axis: Frequency (Hz)</span>
                  </div>
                  <canvas ref={fftCanvasRef} className="w-full h-36 bg-slate-950/50 rounded-lg border border-white/5" />
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM ROW: Key Study Output Metics representation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/5">
            {[
              {
                label: "Comfort Score",
                value: `${metrics.comfort}/100`,
                desc: "Higher = Better Compliance",
                color: metrics.comfort > 70 ? "text-emerald-400" : metrics.comfort > 40 ? "text-amber-400" : "text-rose-400",
              },
              {
                label: "Perceived Flicker",
                value: `${metrics.perceivedFlicker}%`,
                desc: "Lower = Better Adherence",
                color: metrics.perceivedFlicker < 20 ? "text-emerald-400" : metrics.perceivedFlicker < 60 ? "text-amber-400" : "text-rose-400",
              },
              {
                label: "40Hz SSVEP Output",
                value: `${metrics.ssvepAmplitude} μV`,
                desc: "Target: Cortical Power",
                color: metrics.ssvepAmplitude > 6.0 ? "text-amber-400" : metrics.ssvepAmplitude > 3.0 ? "text-blue-400" : "text-slate-500",
              },
              {
                label: "Tolerability Index",
                value: `${metrics.tolerability}%`,
                desc: "AD Home Session Rating",
                color: metrics.tolerability > 75 ? "text-emerald-400" : metrics.tolerability > 45 ? "text-amber-400" : "text-rose-400",
              },
            ].map((metric, i) => (
              <div key={i} className="space-y-1">
                <span className="text-xs font-mono tracking-wider text-slate-300 block uppercase font-semibold">{metric.label}</span>
                <span className={`text-2xl md:text-3xl font-extrabold font-display ${metric.color} block`}>{metric.value}</span>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">{metric.desc}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Embedded key-frames for flicker effects inside of simulator */}
      <style>{`
        @keyframes strobe-lum {
          0%, 100% { background-color: #3f3f46; }
          50% { background-color: #fef08a; }
        }
        @keyframes strobe-chrom {
          0%, 100% { background-color: #fca5a5; }
          50% { background-color: #86efac; }
        }
        @keyframes slow-lum {
          0%, 100% { background-color: #4b5563; }
          50% { background-color: #fef08a; }
        }
        @keyframes slow-chrom {
          0%, 100% { background-color: #dc2626; }
          50% { background-color: #16a34a; }
        }
        @keyframes slow-spectral {
          0%, 100% { background-color: #fbbf24; } /* Amber */
          50% { background-color: #14b8a6; } /* Teal */
        }

        .animate-flicker-luminance {
          animation: strobe-lum 0.025s infinite linear;
        }
        .animate-flicker-chromatic {
          animation: strobe-chrom 0.025s infinite linear;
        }

        .slow-flicker-luminance {
          animation: slow-lum 1.5s infinite ease-in-out;
        }
        .slow-flicker-chromatic {
          animation: slow-chrom 1.5s infinite ease-in-out;
        }
        .slow-flicker-spectral {
          animation: slow-spectral 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
