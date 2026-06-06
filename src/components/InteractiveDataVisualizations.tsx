import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, ShieldAlert, Heart, Sun, Activity, Navigation, CheckCircle2, Award } from "lucide-react";

export function StimulusTypeGraphic() {
  const [hovered, setHovered] = useState<string | null>(null);

  // Quantitative data gathered from the paper
  const data = [
    {
      id: "isf",
      title: "Invisible Spectral Flicker (ISF)",
      description: "Toggles spectral composition rapidly at 40 Hz at constant general luminance. Maximizes eye comfort while preserving cortical resonance.",
      entrainment: 7.9, // SSVEP in mV
      comfort: 92, // subjective rating (out of 100)
      perceivedFlicker: 8, // percept (out of 100)
      barColor: "bg-emerald-500",
      textColor: "text-emerald-400 font-bold",
      accentBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "lf",
      title: "Luminance Flicker (LF)",
      description: "Classic black-and-white brightness flashing. Extremely irritating to eye tissue, often causing photophobic migraine triggers.",
      entrainment: 9.2,
      comfort: 18,
      perceivedFlicker: 95,
      barColor: "bg-rose-500",
      textColor: "text-rose-400 font-bold",
      accentBg: "bg-rose-500/10 border-rose-500/20",
    },
    {
      id: "cf",
      title: "Chromatic Flicker (CF)",
      description: "Vibrates back and forth between saturated opponent colors. Medium eye comfort; highly visible chromatic distraction.",
      entrainment: 8.5,
      comfort: 30,
      perceivedFlicker: 80,
      barColor: "bg-purple-500",
      textColor: "text-purple-400 font-bold",
      accentBg: "bg-purple-500/10 border-purple-500/20",
    }
  ];

  return (
    <div className="space-y-6" id="stimulus-graphics">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item) => (
          <div
            key={item.id}
            id={`stimulus-card-${item.id}`}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            className={`p-5 rounded-2xl transition-all duration-300 border flex flex-col justify-between ${
              hovered === item.id 
                ? "bg-slate-900 border-primary-500/40 shadow-lg shadow-primary-500/5 translate-y-[-2px]" 
                : "bg-slate-900/60 border-white/5"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-bold tracking-widest uppercase py-0.5 px-2 rounded-full ${item.accentBg} ${item.textColor}`}>
                  {item.id === "isf" ? "STUDY WINNER" : "CONVENTIONAL"}
                </span>
                {item.id === "isf" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>

              <div>
                <h4 className="font-display font-bold text-base text-white">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1 font-mono leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 pt-4 border-t border-white/5">
              {/* Entrainment score */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-sky-400" /> 40Hz EEG Power (SSVEP)
                  </span>
                  <span className="text-slate-100 font-semibold">{item.entrainment} μV</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.entrainment / 10) * 100}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-sky-500"
                  />
                </div>
              </div>

              {/* Comfort score */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" /> Subjective Comfort
                  </span>
                  <span className="text-slate-100 font-semibold">{item.comfort}/100</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.comfort}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`h-full ${item.barColor}`}
                  />
                </div>
              </div>

              {/* Perceived flicker */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-amber-500" /> Perceived Flicker
                  </span>
                  <span className="text-slate-100 font-semibold">{item.perceivedFlicker}%</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.perceivedFlicker}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 space-y-10">
        <div className="flex gap-2 text-sky-400 font-mono text-xs items-center mb-1">
          <Award className="w-4 h-4 shrink-0" />
          <span>Scientific Insight Panel:</span>
        </div>
        <p className="text-xs text-slate-400 font-mono leading-relaxed mt-1">
          <strong>The Great Decoupling:</strong> Classical visual neurophysiology assumed that cortical entrainment magnitude was strictly coupled to how strongly the human subject perceived flicker (retinal ganglion excitation patterns). This paper proves we can completely <strong>decouple</strong> cortical synchronization (almost equivalent at ~8 μV) from subjective annoyance (reducing flicker percept from 95% down to 8% and lifting comfort from 18% to 92%!).
        </p>
      </div>
    </div>
  );
}

export function BrightnessTradeoffGraphic() {
  const [luminance, setLuminance] = useState(40); // Initial 40% optimal recommendation

  // Calculate parameters at chosen luminance level
  // Entrainment: flat/slight drift across range. At 10% it's 8.1; at 100% it's 8.5
  const ssvep = (8.1 + (luminance / 100) * 0.4).toFixed(2);
  // Comfort: falls heavily as luminance rises. At 10% comfort is 96. At 100% comfort is 45.
  const comfort = Math.round(96 - (luminance / 100) * 51);
  // Optimal Index (harmonic combination)
  const productScore = Math.round((parseFloat(ssvep) / 8.5) * 100 * comfort / 100);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8" id="brightness-tradeoff-graphics">
      {/* Slider & Controls */}
      <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
        <div>
          <span className="text-xs font-mono font-bold text-amber-500 tracking-wider uppercase block">PARAMETER OPTIMIZER</span>
          <h4 className="text-xl font-display font-semibold text-white mt-1">Luminance Calibration</h4>
          <p className="text-xs text-slate-400 mt-2 font-mono leading-relaxed">
            Drag the slider to alter stimulus brightness level. Observe how decreasing brightness lifts subjective comfort while the target 40 Hz EEG entrainment remains statistically unchanged!
          </p>
        </div>

        <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-white/5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500" /> STIMULATION BRIGHTNESS
            </span>
            <span className="text-lg font-bold text-amber-400">{luminance}%</span>
          </div>

          <div className="pt-2">
            <input
              id="calibration-brightness-slider"
              type="range"
              min="10"
              max="100"
              value={luminance}
              onChange={(e) => setLuminance(parseInt(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>10% (Dim setting)</span>
            <span>100% (Full intensity)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono border-t border-white/5 pt-4">
          <strong>Finding of the study:</strong> There is no statistically significant main effect of brightness on 40 Hz SSVEP power within the tested ranges of this study. Decreasing intensity from maximum to comfortable limits is safe and highly recommended for clinical AD patient protocols.
        </div>
      </div>

      {/* Interactive visualizer results */}
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex flex-col justify-between text-left min-h-[140px]">
          <span className="text-xs font-mono tracking-wider font-semibold text-slate-350 uppercase flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-sky-400" /> EEG SSVEP Output
          </span>
          <div className="my-3">
            <span className="text-3xl font-extrabold text-sky-400 font-display block">{ssvep} μV</span>
            <span className="text-xs text-slate-400 font-mono block">Occipital spectral peak</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500" style={{ width: `${(parseFloat(ssvep) / 10) * 100}%` }} />
            </div>
            <span className="text-xs text-emerald-400 font-semibold font-mono block">✔ Statistical flatline (Entrained!)</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex flex-col justify-between text-left min-h-[140px]">
          <span className="text-xs font-mono tracking-wider font-semibold text-slate-350 uppercase flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> Comfort Rating
          </span>
          <div className="my-3">
            <span className={`text-3xl font-extrabold font-display block ${comfort > 70 ? "text-emerald-400" : comfort > 45 ? "text-amber-400" : "text-rose-400"}`}>{comfort} / 100</span>
            <span className="text-xs text-slate-400 font-mono block">Subjective user report</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className={`h-full ${comfort > 70 ? "bg-emerald-500" : comfort > 45 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${comfort}%` }} />
            </div>
            <span className="text-xs font-semibold font-mono block" style={{ color: comfort > 70 ? "#34d399" : comfort > 45 ? "#fbbf24" : "#f87171" }}>
              {comfort > 70 ? "🌿 Outstanding / Safe" : comfort > 45 ? "⚠ Noticeable discomfort" : "❌ High eye strain risk"}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 flex flex-col justify-between text-left min-h-[140px]">
          <span className="text-xs font-mono tracking-wider font-semibold text-slate-350 uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Optimal Score
          </span>
          <div className="my-3">
            <span className="text-3xl font-extrabold font-display block text-amber-400">{productScore}%</span>
            <span className="text-xs text-slate-400 font-mono block">Efficacy / Comfort ratio</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${productScore}%` }} />
            </div>
            <span className="text-xs text-slate-300 font-semibold font-mono block">
              {luminance < 35 ? "💡 Dim & cozy" : luminance <= 55 ? "🎯 PEAK BALANCE ZONE" : "🔦 Over-exposure territory"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PeripheralAngleGraphic() {
  const [angle, setAngle] = useState(15);

  // Math models: Central gives maximum amplitude, falling as angle increases to 60 deg
  // 0 deg = 8.8 mV. 60 deg = 6.4 mV.
  const entrainmentValue = (8.8 - (angle / 60) * 2.4).toFixed(2);
  const entrainmentPercent = Math.round((parseFloat(entrainmentValue) / 8.8) * 100);

  // Adherence rating increases as angle increases (because direct staring is not required)
  const adherenceValue = Math.min(100, Math.round(55 + (angle / 60) * 45));

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8" id="peripheral-tradeoff-graphics">
      <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950/40 p-5 rounded-xl border border-white/5">
        <span className="text-xs font-mono text-slate-400 block uppercase mb-4 text-center font-bold tracking-tight">Visual Field Peripheral Eccentricity Simulator</span>

        {/* Head/Gaze Vector graphics */}
        <div className="relative h-44 w-full flex items-center justify-center overflow-hidden">
          {/* Eyes Node */}
          <div className="relative flex flex-col items-center">
            {/* User Head profile */}
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center relative mt-6 z-10">
              <span className="text-xs font-mono font-bold text-slate-420">PATIENT</span>
              {/* Eye direction arrow */}
              <div className="absolute -top-3 w-1.5 h-3.5 bg-sky-200 rounded-lg animate-pulse" />
            </div>
            <div className="text-xs text-slate-400 font-semibold font-mono mt-2 z-10">Direct Gaze (0°)</div>
          </div>

          {/* Light stimulation node */}
          <motion.div
            animate={{
              x: (angle / 60) * 120, // push right as angle increases
              y: -50 - (60 - angle) * 0.2, // push up
            }}
            transition={{ type: "spring", stiffness: 80 }}
            className="absolute p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex flex-col items-center shadow-lg shadow-amber-500/5 z-10"
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="text-[9px] font-mono mt-0.5 font-bold">ISF Light</span>
            <span className="text-[8px] font-mono">{angle}° Axis</span>
          </motion.div>

          {/* Dotted lines connecting Gaze Gated path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Gaze trace line (straight up) */}
            <line x1="50%" y1="75%" x2="50%" y2="5%" stroke="rgba(56, 189, 248, 0.2)" strokeDasharray="3,3" strokeWidth="1.5" />
            {/* Peripheral angle sector vector lines */}
            <path
              d={`M ${window.innerWidth < 640 ? 100 : 180} 120 L 50% 75%`}
              stroke="rgba(245, 158, 11, 0.15)"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-0.5">
            <span className="text-slate-500">Stimulus Eccentricity Offset:</span>
            <span className="text-slate-200 block text-xs font-bold">{angle === 0 ? "Direct Centered Fovea" : `Peripheral Visual Angle (${angle}°)`}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-500">EEG Driver Status:</span>
            <span className="text-amber-500 block text-xs font-bold">{entrainmentPercent}% Retained strength</span>
          </div>
        </div>
      </div>

      {/* Adjuster controls side */}
      <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-sky-400 tracking-wider uppercase block">SPATIAL DEVIATION ANALYSIS</span>
          <h4 className="text-xl font-display font-semibold text-white mt-1">Peripheral Stimulation trade-off</h4>
          <p className="text-xs text-slate-400 mt-2 font-mono leading-relaxed">
            Move the slider to shift the active 40 Hz ISF stimulus wider into peripheral vision. Analyze the tradeoff between cortical response size vs. real-world clinical feasibility.
          </p>
        </div>

        <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-white/5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-sky-500 rotate-90" /> ECCENTRICITY ANGLE
            </span>
            <span className="text-lg font-bold text-sky-400">{angle}°</span>
          </div>

          <div className="pt-2">
            <input
              id="calibration-peripheral-slider"
              type="range"
              min="0"
              max="60"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full accent-sky-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>0° (Central Fovea)</span>
            <span>60° (Deep Visual Edge)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1 text-left">
            <span className="text-xs font-mono text-slate-400 uppercase block font-medium">40Hz EEG Power</span>
            <span className="text-xl font-bold text-sky-400 font-display block">{entrainmentValue} μV</span>
            <span className="text-xs text-slate-500 block font-mono">Slow modest decline</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1 text-left">
            <span className="text-xs font-mono text-slate-400 uppercase block font-medium">Wearer Feasibility</span>
            <span className="text-xl font-bold text-emerald-400 font-display block">{adherenceValue}%</span>
            <span className="text-xs text-slate-500 block font-mono">Less intrusive daily use</span>
          </div>
        </div>
      </div>
    </div>
  );
}
