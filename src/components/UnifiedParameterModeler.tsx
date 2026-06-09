import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Sun, Navigation, Eye, Heart, Info, Sparkles, CheckCircle2 } from "lucide-react";

export default function UnifiedParameterModeler() {
  const [stimulusType, setStimulusType] = useState<"ISF" | "LF" | "CF">("ISF");
  const [brightness, setBrightness] = useState(40);
  const [peripheralAngle, setPeripheralAngle] = useState(15);

  // Dynamic calculations representing the physical experimental model
  const getOutputMetrics = () => {
    // 1. SSVEP magnitude (μV) - target is around 3.0 to 10.0 μV
    // Base amplitude by type
    const baseAmps = { LF: 9.2, CF: 8.5, ISF: 7.9 };
    // Brightness slightly scales amplitude: bright = stronger driving force
    const brightnessScale = 0.82 + (brightness / 100) * 0.18;
    // Peripheral angle scales down: fovea = maximum receptors, periphery = declining density
    const angleScale = 1.0 - (peripheralAngle / 60) * 0.28;

    const ssvepMag = baseAmps[stimulusType] * brightnessScale * angleScale;

    // 2. Perceived flicker intensity (0 - 100)
    // LF is massive strobe. CF is active. ISF is extremely quiet.
    const baseFlicker = { LF: 95, CF: 78, ISF: 6 };
    // Flicker scales with brightness
    const flickerBrightnessScale = 0.4 + (brightness / 100) * 0.6;
    // Peripheral vision has faster temporal resolution (Sees flicker slightly more in corners for LF/CF)
    const flickerAngleScale = stimulusType === "ISF" ? 1.0 : 1.0 + (peripheralAngle / 60) * 0.12;

    const perceivedFlicker = Math.min(100, Math.round(baseFlicker[stimulusType] * flickerBrightnessScale * flickerAngleScale));

    // 3. Subjective Comfort score (0 - 100)
    const baseComfort = { LF: 16, CF: 28, ISF: 94 };
    // Comfort is severely penalised by high brightness (photophobia / migraine trigger)
    const brightnessComfortPenalty = (brightness / 100) * 44;
    // Comfort gets slightly better if the stimulus is placed peripheral (out of central focus)
    const angleComfortBonus = (peripheralAngle / 60) * 10;

    const comfortRating = Math.max(
      4,
      Math.min(100, Math.round(baseComfort[stimulusType] - brightnessComfortPenalty + angleComfortBonus))
    );

    // 4. Cumulative Patient Adherence probability (clinical forecast)
    // Higher comfort and less visible flicker maximizes long-term home compliance
    const adherenceProb = Math.round(
      Math.max(5, Math.min(100, (comfortRating * 2.5 + (100 - perceivedFlicker)) / 3.5))
    );

    return {
      ssvep: parseFloat(ssvepMag.toFixed(2)),
      flicker: perceivedFlicker,
      comfort: comfortRating,
      adherence: adherenceProb,
    };
  };

  const metrics = getOutputMetrics();

  // Color mappings based on score strength
  const getQualityColor = (score: number) => {
    if (score >= 75) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 45) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-rose-400 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-2xl space-y-8" id="unified-modeler-container">
           {/* Simulation Workspace Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs md:text-sm font-mono tracking-widest font-bold text-sky-400 bg-sky-500/10 px-3.5 py-1.5 rounded-full border border-sky-500/20">
          Multidimensional Parameter Calibration
        </span>
        <h4 className="text-2xl font-display font-bold text-white tracking-tight pt-2">
          Neurobiology Efficacy & Comfort Modeler
        </h4>
        <p className="text-sm text-slate-300 font-mono leading-relaxed mt-2">
          Select stimulus physics, luminosity settings, and spatial location configurations to observe the immediate correlation between 40 Hz SSVEP power and subjective human tolerability ratings.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COMPONENT: TRIPLE CONTROL DECK */}
        <div className="xl:col-span-5 bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-6">
          <span className="text-xs font-mono text-slate-400 font-bold block uppercase tracking-wider border-b border-white/5 pb-2">
            1. Configure System Inputs
          </span>

          {/* Stimulus Type Grid Buttons */}
          <div className="space-y-2.5">
            <label className="text-sm font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-primary-500" /> Stimulus Physics Paradigm
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: "ISF", name: "Invisible Spectral Flicker", detail: "Constant total luminance white (Optimal)", color: "border-emerald-500/30 text-emerald-400" },
                { id: "LF", name: "Luminance Flicker", detail: "Classic flash on/off strobe", color: "border-rose-500/30 text-rose-400" },
                { id: "CF", name: "Chromatic Flicker", detail: "Opponent color vibration (Red/Green)", color: "border-purple-500/30 text-purple-400" }
              ].map((item) => (
                <button
                  key={item.id}
                  id={`unified-type-btn-${item.id}`}
                  onClick={() => setStimulusType(item.id as any)}
                  className={`cursor-pointer w-full text-left p-3 rounded-xl border text-sm transition-all duration-200 flex flex-col gap-1 ${
                    stimulusType === item.id
                      ? "border-primary-500 bg-primary-500/10 shadow-lg text-white font-semibold"
                      : "border-white/5 bg-slate-950/20 text-slate-400 hover:bg-slate-950/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{item.name}</span>
                    {item.id === "ISF" && (
                      <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold font-mono">
                        94% Comfort
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 block font-mono font-medium">{item.detail}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Slider input 2: Brightness */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" /> Luminous Intensity (Brightness)
              </span>
              <span className="text-amber-400 font-bold text-sm bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                {brightness}%
              </span>
            </div>
            <input
              id="unified-brightness-slider"
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>10% (Low exposure)</span>
              <span>100% (High radiation)</span>
            </div>
          </div>

          {/* Slider input 3: Eccentricity Angle */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-sky-500 rotate-90" /> Peripheral Angle Offset
              </span>
              <span className="text-sky-400 font-bold text-sm bg-sky-500/5 px-2 py-0.5 rounded border border-sky-500/10">
                {peripheralAngle}° Degree
              </span>
            </div>
            <input
              id="unified-angle-slider"
              type="range"
              min="0"
              max="60"
              value={peripheralAngle}
              onChange={(e) => setPeripheralAngle(parseInt(e.target.value))}
              className="w-full accent-sky-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>0° (Foveal Focus)</span>
              <span>60° (Lateral Retinal Edge)</span>
            </div>
          </div>

        </div>

        {/* RIGHT COMPONENT: QUANTITATIVE GRAPHS & REPORT PANEL */}
        <div className="xl:col-span-7 flex flex-col justify-between space-y-6">
          <span className="text-xs font-mono text-slate-400 font-bold block uppercase tracking-wider">
            2. Resulting Brainwave and Subjective Metrics
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Out 1: EEG Magnitude */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[145px] relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-xs font-semibold font-mono text-slate-300 uppercase tracking-wider block">40Hz EEG SSVEP POWER</span>
                <span className="text-3xl font-extrabold font-display text-sky-400 block">{metrics.ssvep} μV</span>
                <span className="text-xs text-slate-400 font-mono block">Electrophysiology spectral peak</span>
              </div>
              <div className="space-y-2 pt-2">
                {/* Custom animated simple graph meter */}
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "30%" }}
                    animate={{ width: `${(metrics.ssvep / 10) * 100}%` }}
                    transition={{ type: "spring", stiffness: 60 }}
                    className="h-full bg-sky-500"
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Target: {metrics.ssvep >= 6.0 ? "🔥 Strong Driver" : "⚡ Moderate Driver"}</span>
                  <span>10.0 μV max</span>
                </div>
              </div>
            </div>

            {/* Out 2: Subjective comfort */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[145px] relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-xs font-semibold font-mono text-slate-300 uppercase tracking-wider block">SUBJECTIVE COMFORT</span>
                <span className={`text-3xl font-extrabold font-display block ${metrics.comfort >= 70 ? "text-emerald-400" : "text-rose-400"}`}>
                  {metrics.comfort} / 100
                </span>
                <span className="text-xs text-slate-400 font-mono block">Patient self-reporting scale</span>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "80%" }}
                    animate={{ width: `${metrics.comfort}%` }}
                    transition={{ type: "spring", stiffness: 60 }}
                    className={`h-full ${metrics.comfort >= 70 ? "bg-emerald-500" : metrics.comfort >= 40 ? "bg-amber-500" : "bg-rose-500"}`}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Status: {metrics.comfort >= 75 ? "🌿 High Comfort" : metrics.comfort >= 40 ? "⚠ Uncomfortable" : "🔥 Urgent Pain"}</span>
                  <span>100 Max</span>
                </div>
              </div>
            </div>

            {/* Out 3: Perceived Flicker */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[145px] relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-xs font-semibold font-mono text-slate-300 uppercase tracking-wider block">PERCEIVED FLICKER RATIO</span>
                <span className="text-3xl font-extrabold font-display text-amber-500 block">{metrics.flicker}%</span>
                <span className="text-xs text-slate-400 font-mono block">Retina level motion perception</span>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "8%" }}
                    animate={{ width: `${metrics.flicker}%` }}
                    transition={{ type: "spring", stiffness: 60 }}
                    className="h-full bg-amber-500"
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Percept: {metrics.flicker <= 15 ? "👁 Invisible" : metrics.flicker <= 60 ? "💥 Moderately visible" : "⚡ Aggressive Flash"}</span>
                  <span>100% max</span>
                </div>
              </div>
            </div>

            {/* Out 4: Expected Adherence */}
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[145px] relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-xs font-semibold font-mono text-slate-300 uppercase tracking-wider block">Home Adherence Forecast</span>
                <span className={`text-3xl font-extrabold font-display block ${metrics.adherence >= 75 ? "text-emerald-400" : "text-rose-400"}`}>
                  {metrics.adherence}% Prob.
                </span>
                <span className="text-xs text-slate-400 font-mono block">Projected patient compliance probability</span>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "90%" }}
                    animate={{ width: `${metrics.adherence}%` }}
                    transition={{ type: "spring", stiffness: 60 }}
                    className={`h-full ${metrics.adherence >= 75 ? "bg-emerald-500" : "bg-rose-500"}`}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Rating: {metrics.adherence >= 75 ? "👑 Clinically Viable" : "❌ High Dropout Rate"}</span>
                  <span>100% full</span>
                </div>
              </div>
            </div>

          </div>

          {/* Dynamic Scientific Insight based on sliders combo */}
          <div className="p-4 bg-slate-950 rounded-xl border border-white/5 flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-sm text-slate-300 font-mono leading-relaxed">
              <span className="text-white font-bold block text-sm">Translation Verdict & Dynamic Analysis:</span>
              {stimulusType === "ISF" ? (
                <span>
                  Using <strong>Invisible Spectral Flicker (ISF)</strong> at a moderate brightness of <strong>{brightness}%</strong>, the model forecasts a high compliance score of <strong>{metrics.comfort}/100</strong> and adherence of <strong>{metrics.adherence}%</strong>. The SSVEP power remains strong at <strong>{metrics.ssvep} μV</strong>, confirming we have successfully decoupled therapeutic entrainment from sensory stress!
                </span>
              ) : stimulusType === "LF" ? (
                <span className="text-rose-200">
                  Although <strong>Luminance Flicker (LF)</strong> drives high EEG power (<strong>{metrics.ssvep} μV</strong>), its visual flicker rating is <strong>{metrics.flicker}%</strong>, crashing patient home compliance probability to <strong>{metrics.adherence}%</strong>. This explains the persistent real-world failure of classic 40 Hz lamps in actual residential care environments.
                </span>
              ) : (
                <span className="text-purple-200">
                  <strong>Chromatic Flicker (CF)</strong> represents a marginal improvement over LF, but its color vibration score remains easily visible (<strong>{metrics.flicker}%</strong>), maintaining comfort at a mediocre <strong>{metrics.comfort}/100</strong>. It is not recommended for patients suffering from acute cognitive distress.
                </span>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
