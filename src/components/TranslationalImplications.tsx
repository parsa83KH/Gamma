import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Compass, Shield, Clock, Heart, ArrowRight, Check, Eye } from "lucide-react";

export default function TranslationalImplications() {
  const [activeScenario, setActiveScenario] = useState<number>(0);

  const scenarios = [
    {
      id: 0,
      title: "The Constant-Spectral Living Room Panel",
      domain: "Ambient Home Environment",
      description: "Smart visual ceiling fixtures emit a passive, flicker-free, warm-white environmental light during standard living room reading or family dining. The 40 Hz entrainment runs continuously for 60 minutes in the background without requiring the patient to look directly at a therapeutic bulb or wear active gear.",
      duration: "60 min / daily (Ambient)",
      adherence: "96% Adherence Rate",
      burden: "Zero passive effort",
      safeguard: "Constant safety loop",
      icon: <Home className="w-5 h-5 text-emerald-400" />,
      benefits: [
        "Completely blends with circadian room designs",
        "Passive protection for memory-impaired patients",
        "No device-wearing resistance or active compliance tasks",
        "Entire family can share the space comfortably"
      ],
      graphics: (
        <svg viewBox="0 0 200 200" className="w-full h-full max-h-48 text-emerald-400/90 pointer-events-none">
          {/* Ceiling line and light source */}
          <line x1="20" y1="20" x2="180" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <rect x="70" y="16" width="60" height="8" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
          
          {/* Showering beams */}
          <path d="M 80 24 L 30 180 L 170 180 L 120 24 Z" fill="url(#emeraldGlow)" opacity="0.3" />
          
          {/* Cozy reading sofa */}
          <path d="M 50 140 H 150 V 160 H 50 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <path d="M 60 110 H 140 V 140 H 60 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <circle cx="100" cy="115" r="8" fill="rgba(255,255,255,0.1)" />

          {/* Glowing particle dots indicating entrainment active */}
          <circle cx="65" cy="50" r="1.5" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="135" cy="65" r="1.5" className="animate-ping" style={{ animationDuration: '4s' }} />
          <circle cx="95" cy="100" r="2" fill="#10b981" className="animate-pulse" />

          <defs>
            <radialGradient id="emeraldGlow" cx="50%" cy="0%" r="90%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </radialGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 1,
      title: "Wearable Active AR Clinical Spectacles",
      domain: "Wearable Device Integration",
      description: "Low-profile, lightweight AR eyeglasses designed for senior patients. High-density micro-LED arrays placed along the peripheral frame generate a targeted 40 Hz ISF stimulus directly onto peripheral retinal pathways, leaving foveal fields completely empty so patients can safely enjoy television or read a paperback.",
      duration: "30-40 min / daily (Tasked)",
      adherence: "91% Adherence Rate",
      burden: "Extremely low burden",
      safeguard: "Eye-tracking proximity alert",
      icon: <Compass className="w-5 h-5 text-sky-400" />,
      benefits: [
        "Lightweight frame with soft hypoallergenic pads",
        "Targeted peripheral entrainment spares central vision",
        "Integrates with smart TV or audio entertainment",
        "Auto-session tracking and cloud upload for clinicians"
      ],
      graphics: (
        <svg viewBox="0 0 200 200" className="w-full h-full max-h-48 text-sky-400 pointer-events-none">
          {/* Eyeglasses wireframe */}
          <path d="M 30 100 Q 60 70 100 100 Q 140 70 170 100" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
          {/* Left lens */}
          <circle cx="65" cy="105" r="24" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          {/* Right lens */}
          <circle cx="135" cy="105" r="24" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          {/* Bridge */}
          <path d="M 89 105 A 12 12 0 0 1 111 105" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          
          {/* Active micro LED arrays on outer corners */}
          <circle cx="43" cy="105" r="3" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '1.2s' }} />
          <circle cx="157" cy="105" r="3" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '1.2s' }} />
          
          {/* Ambient cone glow towards retina */}
          <path d="M 43 105 L 10 130" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
          <path d="M 157 105 L 190 130" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Smart Circadian Bimodal Tabletop Lamp",
      domain: "Bedside Companion Hub",
      description: "An elegant, architectural tabletop lamp sits peacefully on a patient's nightstand. Controlled by algorithms that match sleep architectures, the lamp slowly transitions between an active morning 40 Hz ISF session to elevate vigilance, and soft steady circadian orange illumination at night to encourage sleep induction.",
      duration: "45 min / morning session",
      adherence: "94% Adherence Rate",
      burden: "Automatic timed delivery",
      safeguard: "Fades in naturally over 10 min",
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      benefits: [
        "Fades in seamlessly matching morning cortisol slopes",
        "Aligns 40 Hz synaptic stimulation with wake cycles",
        "Zero-clutter design fits elegantly into domestic bedrooms",
        "Bimodal capability replaces secondary blue-light devices"
      ],
      graphics: (
        <svg viewBox="0 0 200 200" className="w-full h-full max-h-48 text-amber-400/90 pointer-events-none">
          {/* Bedside table pedestal */}
          <line x1="20" y1="180" x2="180" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
          
          {/* Elegant lamp structure */}
          <path d="M 95 100 L 95 180" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
          {/* Table lamp base base */}
          <path d="M 80 180 H 120" stroke="rgba(255,255,255,0.4)" strokeWidth="6" />
          
          {/* Lamp shade */}
          <path d="M 70 100 L 80 50 H 120 L 130 100 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          
          {/* Inner bulb emission */}
          <circle cx="100" cy="75" r="10" fill="url(#amberGlow)" />
          
          {/* Side emission waves */}
          <path d="M 60 75 Q 40 75 40 55" fill="none" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1.5" strokeDasharray="2,2" />
          <path d="M 140 75 Q 160 75 160 55" fill="none" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1.5" strokeDasharray="2,2" />

          <defs>
            <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </radialGradient>
          </defs>
        </svg>
      )
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-2xl space-y-8" id="translational-scenarios-panel">
      
      {/* Intro block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center gap-2 text-primary-500 font-mono text-xs uppercase font-bold">
            <Shield className="w-4 h-4" /> Translational Adherence Matrix
          </div>
          <h4 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Overcoming the Alzheimer's Adherence Barrier
          </h4>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            The transition from lab to bedroom is the single most challenging bottleneck in cognitive neurology. By leveraging spectral counter-phase modulations, 40 Hz stimulation fits seamlessly into a patient's existing habits without causing distress or cognitive friction.
          </p>
        </div>

        <div className="lg:col-span-5 bg-slate-950/40 p-4 rounded-xl border border-white/5 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">CLASSIC THERAPY ATTRITION</span>
            <span className="text-xl font-bold font-display text-rose-400">up to 62%</span>
            <span className="text-[9px] text-slate-400 block font-mono">Patient dropouts in 30 days</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">ISF EXPOSURE COMPLIANCE</span>
            <span className="text-xl font-bold font-display text-emerald-400">94%+</span>
            <span className="text-[9px] text-slate-400 block font-mono">Completed daily prescription</span>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {scenarios.map((sc, idx) => (
          <button
            key={sc.id}
            id={`scenario-header-${idx}`}
            onClick={() => setActiveScenario(idx)}
            className={`cursor-pointer p-4 rounded-xl text-left border transition-all duration-300 flex flex-col justify-between space-y-4 ${
              activeScenario === idx
                ? "border-primary-500 bg-primary-950/10 shadow-lg shadow-primary-500/5 ring-1 ring-primary-500/30"
                : "border-white/5 bg-slate-900/40 text-slate-400 hover:bg-slate-900/80"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-lg ${activeScenario === idx ? "bg-primary-500/10 text-primary-500" : "bg-slate-950 text-slate-400"}`}>
                {sc.icon}
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">{sc.domain}</span>
                <span className="text-xs font-bold font-display text-slate-100 block">{sc.title}</span>
              </div>
            </div>

            <p className="text-[11px] font-mono text-slate-400 line-clamp-2 leading-relaxed">
              {sc.description}
            </p>

            <div className="flex items-center justify-between text-[10px] font-mono border-t border-white/5 pt-3">
              <span className="text-slate-500">{sc.duration}</span>
              <span className="text-primary-500 font-semibold flex items-center gap-1">
                Details <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Expanded Scenario Visualizer Module */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScenario}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-950/30 p-6 rounded-2xl border border-white/5 items-center"
          id={`expanded-scenario-box-${activeScenario}`}
        >
          {/* Illustration graphics columns */}
          <div className="lg:col-span-5 bg-slate-950/60 p-4 rounded-xl border border-white/5 flex items-center justify-center min-h-[220px]">
            {scenarios[activeScenario].graphics}
          </div>

          {/* Text Detail columns */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider block">SCENARIO DEPLOYMENT PATHWAY</span>
              <h5 className="text-lg font-display font-semibold text-white">{scenarios[activeScenario].title}</h5>
              <p className="text-xs text-slate-300 font-mono leading-relaxed mt-2">
                {scenarios[activeScenario].description}
              </p>
            </div>

            {/* Parameter pill markers */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-900 border border-white/5 p-3 rounded-xl text-center space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">Daily Exposure</span>
                <span className="text-xs font-semibold text-sky-400 font-mono block">{scenarios[activeScenario].duration}</span>
              </div>
              <div className="bg-slate-900 border border-white/5 p-3 rounded-xl text-center space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">Adherence Level</span>
                <span className="text-xs font-semibold text-emerald-400 font-mono block">{scenarios[activeScenario].adherence}</span>
              </div>
              <div className="bg-slate-900 border border-white/5 p-3 rounded-xl text-center space-y-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">Caregiver Burden</span>
                <span className="text-xs font-semibold text-amber-500 font-mono block">{scenarios[activeScenario].burden}</span>
              </div>
            </div>

            {/* Strategic benefits Checklist */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase block">Strategic Integration Benefits:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                {scenarios[activeScenario].benefits.map((bt, i) => (
                  <div key={i} className="flex gap-2 items-start leading-normal">
                    <div className="p-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{bt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
