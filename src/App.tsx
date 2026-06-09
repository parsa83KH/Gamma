/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Presentation,
  Compass,
  Zap,
  Activity,
  Heart,
  Eye,
  Info,
  BookOpen,
  ArrowRight,
  Award,
  ListCollapse,
  ShieldCheck,
  Brain,
  Grid,
  FileSpreadsheet,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Clock
} from "lucide-react";

import EegSimulator from "./components/EegSimulator";
import CritiqueSection from "./components/CritiqueSection";
import {
  StimulusTypeGraphic,
  BrightnessTradeoffGraphic,
  PeripheralAngleGraphic
} from "./components/InteractiveDataVisualizations";
import IsfExplanationAnimation from "./components/IsfExplanationAnimation";
import UnifiedParameterModeler from "./components/UnifiedParameterModeler";
import TranslationalImplications from "./components/TranslationalImplications";
import { SimulationState } from "./types";

export default function App() {
  const [viewMode, setViewMode] = useState<"slides" | "infographic">("slides");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Simulation State Shared with EEG Simulator
  const [simState, setSimState] = useState<SimulationState>({
    stimulusType: "ISF",
    brightness: 40,
    peripheralAngle: 15,
    isStimulating: false
  });

  // Presentation slides content
  const slides = [
    // Slide 1: Title & Citation
    {
      id: 0,
      category: "Introduction",
      label: "Scientific Reports (2024)",
      title: "Light-based gamma entrainment",
      subtitle: "Balancing 40 Hz neural responses with comfort using invisible spectral flicker",
      accent: "from-primary-500 to-indigo-600 font-display",
      content: (
        <div className="space-y-6 max-w-3xl mx-auto text-center" id="slide-intro">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold text-primary-500 uppercase tracking-wider mx-auto">
            <BookOpen className="w-3.5 h-3.5" /> Journal Club Masterclass
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-bold text-slate-100 tracking-tight leading-[1.15] mt-4">
            Light-Based Gamma Entrainment
          </h2>
          <p className="text-lg sm:text-2xl font-serif italic text-primary-500/90 max-w-2.5xl mx-auto leading-relaxed">
            Balancing 40 Hz neural responses with comfort using invisible spectral flicker
          </p>

          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-slate-800/60 mt-8">
            <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Scientific Citation</span>
              <span className="text-xs font-semibold text-slate-200 block leading-normal italic font-serif">
                Scientific Reports (2024) 14:1042
              </span>
            </div>
            <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">The Critical Obstacle</span>
              <span className="text-xs font-semibold text-slate-300 block leading-normal">
                High-intensity flickering traditional lights cause headaches and poor daily compliance at home.
              </span>
            </div>
            <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Translational Goal</span>
              <span className="text-xs font-semibold text-slate-300 block leading-normal">
                Can we generate high-level cortical entrainment while offering visual comfort for Alzheimer's care?
              </span>
            </div>
          </div>

        </div>
      )
    },
    // Slide 2: Background - AD & Gamma Band
    {
      id: 1,
      category: "Background",
      label: "Cortical Oscillations",
      title: "Alzheimer's Disease & 40 Hz Gamma Band",
      accent: "from-sky-400 to-blue-600",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto" id="slide-background">
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase font-bold">
                <Brain className="w-4 h-4" /> NEURAL OSCILLATORY IMPAIRMENTS
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-mono">
                Alzheimer's pathology is marked by classic structural amyloid and tau lesions. However, deep functional disruptions occur inside brainwave bands early on, particularly inside the <strong>gamma-frequency band (30–80 Hz)</strong>.
              </p>
            </div>

            <div className="space-y-3 bg-indigo-950/20 p-5 rounded-2xl border border-indigo-500/10">
              <span className="text-xs font-mono font-bold text-sky-400 uppercase">BENEFITS OF 40 Hz SENSORY STIMULATION (GENUS):</span>
              <ul className="space-y-2.5 text-xs font-mono text-slate-300">
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold shrink-0">✔</span>
                  <span><strong>Synaptic Strength:</strong> Increases synaptic connections and improves network fidelity.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold shrink-0">✔</span>
                  <span><strong>Mitigate Burden:</strong> Triggers microglial waste extraction, decreasing amyloid and tau accumulations.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold shrink-0">✔</span>
                  <span><strong>Cognitive Performance:</strong> Demonstrates recovery in memory-related mouse models.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-white/5 rounded-2xl p-6 space-y-4">
            <span className="text-[10px] font-mono text-slate-500 block uppercase">GENUS Mechanism Pathway</span>
            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border-l-2 border-sky-500">
                <div className="font-bold text-slate-200">1. Sensory Influx</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Light shifts at 40 Hz triggers visual pathway grids.</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border-l-2 border-indigo-500">
                <div className="font-bold text-slate-200">2. Occipital Entrainment</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Visual cortex synchronizes to the external 40 Hz rhythm (SSVEP).</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border-l-2 border-emerald-500">
                <div className="font-bold text-slate-200">3. Microglial Cleanup</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Local brain immune systems trigger deep waste extraction.</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 3: Background - Limits vs ISF concept
    {
      id: 2,
      category: "Background",
      label: "Visual Flicker Challenges",
      title: "Visual Flicker Limits & The ISF Alternative",
      accent: "from-sky-400 to-indigo-500",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto" id="slide-flicker-limits">
          {/* Limitations Card */}
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex gap-2 items-center text-rose-400 text-xs font-mono font-bold uppercase">
                <AlertTriangle className="w-4 h-4" /> Traditional Luminance Flicker (LF) Limits
              </div>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Conventional GENUS therapies pulse brightness strictly on and off. While effective for short EEG recordings, this brightness fluctuation presents deep patient limitations over continuous long sessions:
              </p>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li className="flex gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>Severe user fatigue, eye strain, and acute eye-strain headaches.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>Annoying visual disruptions during daily domestic routines.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500 font-bold shrink-0">✕</span>
                  <span>Safety triggers (photophobia, seizure/epileptic risks).</span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/10 text-[11px] text-rose-300/80 font-mono mt-4">
              <strong>Critical Bottleneck:</strong> Poor patient compliance during home therapy weakens clinical efficacy in active trials.
            </div>
          </div>

          {/* Solution Card */}
          <div className="bg-slate-900 border border-primary-500/20 p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex gap-2 items-center text-emerald-400 text-xs font-mono font-bold uppercase">
                <Lightbulb className="w-4 h-4" /> The Invisible Spectral Flicker (ISF) Solution
              </div>
              <p className="text-xs font-mono text-slate-400 leading-relaxed">
                Rather than modifying overall brightness (luminance), ISF high-frequency protocols change the spectral (color wavelength) composition of the stimulus rapidly at 40 Hz:
              </p>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✔</span>
                  <span><strong>Total Luminance Constant:</strong> Shifts colored wavelengths precisely so the eye sees a steady, fused, pleasant glow.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✔</span>
                  <span><strong>Virtually Invisible:</strong> Humans perceive little to no annoying visual strobe.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✔</span>
                  <span><strong>Cortical Entrainment:</strong> Drives high-efficiency 40 Hz entrainment inside visual regions!</span>
                </li>
              </ul>
            </div>
            <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[11px] text-emerald-300 font-mono mt-4">
              <strong>Core Question:</strong> Can near-invisible spectral flicker evoke cortical gamma activity with comparable power?
            </div>
          </div>
        </div>
      )
    },
    // Slide 4: Methods (high-level)
    {
      id: 3,
      category: "Methods",
      label: "Research Framework",
      title: "Experimental Methodology & Variables",
      accent: "from-indigo-500 to-purple-600",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-5xl mx-auto" id="slide-methods">
          <div className="md:col-span-12 md:col-span-5 space-y-6">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 space-y-4">
              <span className="text-xs font-mono text-slate-500 block uppercase">Cohort Sample Selection</span>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-display font-extrabold text-white shrink-0 whitespace-nowrap">N = 25</div>
                <div className="text-xs font-mono text-slate-400">
                  Healthy young adults, age 20–44 years, with normal or corrected-to-normal vision records.
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 space-y-3">
              <span className="text-xs font-mono text-slate-500 block uppercase">Continuous Outcomes Tracked</span>
              <div className="space-y-4 font-mono text-xs">
                <div className="flex gap-3">
                  <Activity className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <strong className="text-slate-200">Neural: 40Hz SSVEP</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">Recorded power using occipital EEG electrodes during stimulation.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Heart className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <strong className="text-slate-200">Subjective Comfort</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">Participant feedback surveys evaluating sensory stress & fatigue levels.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Eye className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <strong className="text-slate-200">Perceived Flicker Intensity</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">Surveys tracking how intense or visible the flashing appeared to eyes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-12 md:col-span-7 bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col justify-start">
            <span className="text-xs font-mono text-slate-400 block uppercase mb-2">Experimental Factors Under Evaluation</span>
            <p className="text-[11px] text-slate-400/80 font-mono leading-relaxed mb-4 pb-2 border-b border-white/5">
              These clinical parameters are systematically varied to identify the boundary conditions where light stimulation remains fully effective yet completely comfortable for patients' daily home use.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 font-mono text-xs">
                <div className="p-4 bg-slate-950 rounded-xl">
                  <span className="font-bold text-slate-200">Stimulus Paradigm:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Evaluated three stimulus configurations: Invisible Spectral Flicker (ISF), Luminance Flicker (LF), and Chromatic Flicker (CF).
                  </p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl">
                  <span className="font-bold text-slate-200">Luminance / Brightness Level:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Swept multiple brightness settings to test if lower intensities reduce neural driver efficacy.
                  </p>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl">
                  <span className="font-bold text-slate-200">Visual Location / Eccentricity:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Placed ISF light directly in central foveal view vs. shifting up to 60° into peripheral fields.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 5: Invisible Spectral Flicker Animation Model
    {
      id: 4,
      category: "Mechanism",
      label: "Retinal Spectral Modulations",
      title: "Interactive Physical Modulation Model",
      accent: "from-emerald-500 to-sky-600",
      content: (
        <div className="max-w-5xl mx-auto" id="slide-isf-explanation-animation">
          <IsfExplanationAnimation />
        </div>
      )
    },
    // Slide 6: Interactive Simulator
    {
      id: 5,
      category: "Simulation",
      label: "Interactive GENUS Lab",
      title: "Live 40 Hz Stimulation & EEG Sandbox",
      accent: "from-sky-500 to-indigo-600",
      content: (
        <div className="max-w-6xl mx-auto" id="slide-interactive-sandbox">
          <EegSimulator state={simState} onChange={setSimState} />
        </div>
      )
    },
    // Slide 7: Combined Multidimensional Parameter Modeler
    {
      id: 6,
      category: "Optimization",
      label: "Multidimensional Modeling",
      title: "Interactive Efficacy & Adherence Modeler",
      accent: "from-teal-400 to-indigo-600",
      content: (
        <div className="max-w-5xl mx-auto" id="slide-unified-modelling-dashboard">
          <UnifiedParameterModeler />
        </div>
      )
    },
    // Slide 8: Results - Stimulus Type comparison
    {
      id: 7,
      category: "Results",
      label: "EEG & Comfort Comparison",
      title: "Flicker Paradigm Comparison",
      accent: "from-emerald-500 to-sky-500",
      content: (
        <div className="max-w-5xl mx-auto space-y-6" id="slide-results-type">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-xs text-sky-400 font-mono tracking-wide uppercase font-bold">STIMULUS TYPE COMPARISONS</p>
            <h3 className="text-2xl font-display font-semibold text-white mt-1">Cortical Entrainment vs Subjective Comfort</h3>
          </div>
          <StimulusTypeGraphic />
        </div>
      )
    },
    // Slide 9: Results - Brightness tradeoff
    {
      id: 8,
      category: "Results",
      label: "Luminance Optimization",
      title: "Brightness Calibration Outcomes",
      accent: "from-amber-400 to-orange-500",
      content: (
        <div className="max-w-5xl mx-auto space-y-6" id="slide-results-brightness">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-xs text-amber-400 font-mono tracking-wide uppercase font-bold">BRIGHTNESS EFFECTS</p>
            <h3 className="text-2xl font-display font-semibold text-white mt-1">Entrainment Remains High at Lower Intensities</h3>
          </div>
          <BrightnessTradeoffGraphic />
        </div>
      )
    },
    // Slide 10: Results - Peripheral Angle
    {
      id: 9,
      category: "Results",
      label: "Spatial Gaze Axis",
      title: "Peripheral Eccentricity Trade-offs",
      accent: "from-sky-400 to-indigo-500",
      content: (
        <div className="max-w-5xl mx-auto space-y-6" id="slide-results-peripheral">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-xs text-sky-400 font-mono tracking-wide uppercase font-bold">SPATIAL ANGLE MEASURES</p>
            <h3 className="text-2xl font-display font-semibold text-white mt-1">Decoupled Gaze: Feasibility in Patient Daily Tasks</h3>
          </div>
          <PeripheralAngleGraphic />
        </div>
      )
    },
    // Slide 11: Clinical Translation Scenarios (Dedicated Section)
    {
      id: 10,
      category: "Translation",
      label: "Patient Compliance Scenarios",
      title: "Patient Adherence & Daily Integration Strategy",
      accent: "from-indigo-400 to-purple-600",
      content: (
        <div className="max-w-5xl mx-auto" id="slide-adherence-matrix">
          <TranslationalImplications />
        </div>
      )
    },
    // Slide 12: Critique
    {
      id: 11,
      category: "Critique",
      label: "Journal Club Evaluation",
      title: "Methodology Critique & Appraisals",
      accent: "from-sky-500 to-indigo-600",
      content: (
        <div className="max-w-5xl mx-auto" id="slide-critique-sandbox">
          <CritiqueSection />
        </div>
      )
    },
    // Slide 13: Take-Home Messages & Conclusion (Replaced Quiz)
    {
      id: 12,
      category: "Conclusion",
      label: "Take-Home Messages",
      title: "Key Takeaways & Future Horizons",
      accent: "from-emerald-400 to-teal-500",
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto text-left" id="slide-conclusion-summary">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-primary-500 tracking-wider uppercase">SYNTHESIS & REPORT SUMMARY</span>
              <h4 className="text-2xl font-display font-bold text-white tracking-tight">Shifting the Paradigm of Alzheimer's Sensory Therapeutics</h4>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                Invisible Spectral Flicker (ISF) demonstrates that we do not need to compromise between sensory comfort and electrophysiological potency. By moving 40 Hz spectral modulations to the silent opponent-color pathways, ISF achieves powerful cortical entrainment while eliminating visual burden and strain.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-primary-500 font-bold uppercase tracking-wider block">KEY DISCOVERY</span>
                <h5 className="text-sm font-semibold text-slate-100 font-display">Decoupled Sensory Stress</h5>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">
                  First-of-its-kind optical configuration that triggers robust 40 Hz SSVEP responses in the visual cortex while reducing perceived flicker to ambient room thresholds.
                </p>
              </div>

              <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">TRANSLATION ROUTE</span>
                <h5 className="text-sm font-semibold text-slate-100 font-display">Frictionless Compliance</h5>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">
                  Establishes practical avenues for integration into home environments—through smart ambient ceiling panels, desktop bedroom lamps, or lightweight wearable eyeglasses.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900/30 border border-white/5 p-6 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">Executive Findings</span>
              <ul className="space-y-3 text-xs text-slate-300 font-mono">
                <li className="flex items-start gap-2.5 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0 animate-ping" />
                  <span><strong>94% Comfort Index</strong> versus just 16% in traditional strobing luminance fixtures.</span>
                </li>
                <li className="flex items-start gap-2.5 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span><strong>Preserved 40 Hz SSVEP</strong> intensity exceeding 7.9 μV in patient models.</span>
                </li>
                <li className="flex items-start gap-2.5 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span><strong>Passive morning sessions</strong> fit seamlessly into existing domestic and bedroom layouts.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/5 text-center space-y-1">
              <p className="text-[11px] font-serif italic text-primary-500/95 leading-normal">
                "In chronic cognitive therapeutics, comfort is not simply a secondary concern; it is the ultimate determinant of treatment viability and patient adherence."
              </p>
              <span className="text-[9px] text-slate-500 font-mono block uppercase tracking-wider mt-1">— Translational Research Editorial</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Presentation controller logic: Left / Right arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "slides") return;
      if (e.key === "ArrowRight" || e.key === "Space") {
        setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode]);

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col justify-between relative overflow-hidden" id="journal-club-app-root">
      
      {/* Immersive background decoration */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" id="immersive-bg-atmosphere">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full immersive-gradient-indigo opacity-75 blur-[100px]" />
        <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full immersive-gradient-orange opacity-[0.25] blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] rounded-full immersive-gradient-indigo opacity-55 blur-[100px]" />
        <div className="absolute inset-0 immersive-dots opacity-[0.2]" />
      </div>

      {/* HEADER SECTION */}
      <header className="border-b border-white/5 glass-panel py-4 px-6 sticky top-0 z-40 flex items-center justify-between backdrop-blur-md" id="app-header">
        <div className="flex items-center gap-3">
          <div className="p-1 px-2.5 rounded bg-primary-500/10 border border-primary-500/20 text-primary-500 font-mono text-[10px] font-bold tracking-widest animate-pulse uppercase">
            40 Hz Gamma
          </div>
          <div className="space-y-0.5">
            <h1 className="font-display font-medium text-sm tracking-wide text-white uppercase sm:block hidden">
              Invisible Spectral Flicker Presenter
            </h1>
            <p className="text-[10px] text-slate-400 font-mono sm:block hidden">Scientific Reports (2024)</p>
          </div>
        </div>

        {/* Presentation View Mode Switcher Toggle */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-xl border border-white/5" id="view-mode-toggle">
          <button
            id="view-toggle-slides"
            onClick={() => setViewMode("slides")}
            className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-display font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === "slides"
                ? "bg-slate-850 text-white shadow-inner border border-white/5"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-primary-500" />
            SLIDES
          </button>
          <button
            id="view-toggle-infographic"
            onClick={() => setViewMode("infographic")}
            className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-display font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === "infographic"
                ? "bg-slate-855 text-white shadow-inner border border-white/5"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            INFOGRAPHIC
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow flex flex-col justify-center py-6 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-10" id="main-deck-container">
        {viewMode === "slides" ? (
          /* PRESENTATION SLIDES VIEW */
          <div className="flex flex-col justify-between h-full min-h-[480px]">
            {/* Slide stage with animated transitions */}
            <div className="flex-grow flex items-center justify-center py-4 relative min-h-[420px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full flex justify-center"
                >
                  <div className="w-full" id={`slide-stage-${currentSlide}`}>
                    <div className="text-center mb-6">
                      <span className="text-[10px] font-mono tracking-widest font-bold text-sky-400 uppercase bg-sky-500/5 px-2.5 py-1 rounded-full border border-sky-500/10">
                        {slides[currentSlide].category} • {slides[currentSlide].label}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight mt-3">
                        {slides[currentSlide].title}
                      </h3>
                    </div>

                    <div className="mt-4">
                      {slides[currentSlide].content}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Remote Controller */}
            <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6 pb-2" id="slides-pagination-controls">
              <button
                id="slide-prev-btn"
                onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                disabled={currentSlide === 0}
                className="cursor-pointer p-2.5 rounded-xl bg-slate-900 border border-white/5 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all text-slate-100 flex items-center gap-1.5 font-display text-xs"
              >
                <ChevronLeft className="w-4 h-4" /> PREV
              </button>

              {/* Progress Bullet Points */}
              <div className="flex gap-1.5 items-center max-w-xs overflow-x-auto no-scrollbar py-1">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    id={`page-bullet-${index}`}
                    onClick={() => setCurrentSlide(index)}
                    className={`cursor-pointer h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index ? "w-6 bg-primary-500" : "w-2 bg-slate-800 hover:bg-slate-700"
                    }`}
                    title={slide.title}
                  />
                ))}
              </div>

              <button
                id="slide-next-btn"
                onClick={() => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1))}
                disabled={currentSlide === slides.length - 1}
                className="cursor-pointer p-2.5 rounded-xl bg-slate-900 border border-white/5 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all text-slate-100 flex items-center gap-1.5 font-display text-xs"
              >
                NEXT <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* COMPLEX INFOGRAPHIC SCROLLABLE DASHBOARD POSTER */
          <div className="space-y-16 py-8" id="infographic-poster-view">
            {slides.map((s, index) => (
              <motion.section
                key={s.id}
                id={`infographic-section-${index}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="border-b border-white/[0.04] pb-16 space-y-6"
              >
                <div className="text-center">
                  <span className="text-[10px] font-mono tracking-widest font-bold text-indigo-400 uppercase bg-indigo-500/5 px-2.5 py-1 rounded-full border border-indigo-500/10">
                    PART {index + 1}: {s.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight mt-3">
                    {s.title}
                  </h3>
                  {s.subtitle && (
                    <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-wide">{s.subtitle}</p>
                  )}
                </div>

                <div className="pt-2">
                  {s.content}
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER COOPERATING BRANDINGS */}
      <footer className="border-t border-white/5 py-8 px-6 text-center relative z-20 bg-slate-950/40 backdrop-blur-md">
        <div className="inline-flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">PRESENTATION BY</span>
          <span className="text-lg md:text-xl font-display font-bold bg-gradient-to-r from-primary-500 via-indigo-400 to-sky-400 bg-clip-text text-transparent uppercase tracking-widest drop-shadow">
            Parisa Balou
          </span>
          <span className="h-0.5 w-12 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full mt-1" />
        </div>
      </footer>
    </div>
  );
}
