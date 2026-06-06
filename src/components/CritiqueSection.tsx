import React, { useState } from "react";
import { motion } from "motion/react";
import { AlertCircle, Sliders, Award, BookOpen, Quote, ShieldCheck } from "lucide-react";

export default function CritiqueSection() {
  // Calibration sliders for Critical Journal Club appraisal
  const [criticMetrics, setCriticMetrics] = useState([
    {
      id: "cohort",
      label: "Patient Cohort Fit",
      score: 3,
      desc: "Healthy Young Adults vs. Alzheimer's Patients",
      lowExplain: "The study utilized only healthy subjects (aged 20–44). AD patients have different neural architecture, aged skull density, and EEG baseline characteristics.",
      highLabel: "No clinical patient cohort testing"
    },
    {
      id: "durability",
      label: "Chronicity & Cumulative Data",
      score: 2,
      desc: "Acute EEG snapshot vs. Long-Term Adherence",
      lowExplain: "Stimulation runs were recorded in a single temporary lab session. No long-term data on cognitive improvement or amyloid/tau clearing in humans.",
      highLabel: "Short-term laboratory trial only"
    },
    {
      id: "parameter",
      label: "Parameter Exploration",
      score: 6,
      desc: "Breadth of tested Brightness & Frequency ranges",
      lowExplain: "Tested multiple brightness levels and peripheral angles, but restricted only to 40 Hz. No comparative sweeps of alternative gamma frequency peaks (e.g., 38Hz, 42Hz) or complex pulsing protocols.",
      highLabel: "Limited frequency/brightness parameter space"
    },
    {
      id: "mechanism",
      label: "Biomarker Verification",
      score: 4,
      desc: "EEG Entrainment vs. True Alzheimer's Pathology",
      lowExplain: "EEG SSVEP successfully proves network resonance, but does not provide direct biochemical confirmation (e.g. CSF, PET, blood panels for amyloid-β or microglial activation state).",
      highLabel: "No physical clearing biomarkers verified"
    }
  ]);

  const handleScoreChange = (id: string, newScore: number) => {
    setCriticMetrics(prev => prev.map(m => m.id === id ? { ...m, score: newScore } : m));
  };

  // Compile a custom "Translational Feasibility Index" based on the user's assessments
  const averageRating = (criticMetrics.reduce((sum, m) => sum + m.score, 0) / criticMetrics.length).toFixed(1);
  const compositeScore = parseFloat(averageRating);

  const getCritiqueSynthesis = (score: number) => {
    if (score < 4) {
      return {
        title: "Rigorous Scientific Skepticism",
        color: "text-red-400 border-red-500/20 bg-red-950/10",
        verdict: "A critical translation bottleneck exists. Although ISF has high-level neural engineering merit, the gap between short-term healthy EEG response and long-term Alzheimer's therapeutic efficacy remains unproven.",
        talkingPoint: "Class Question: How can we design a safe, home-compliance study for patients with actual cognitive impairment over a 6-month scale to confirm physical tau accumulation changes?"
      };
    } else if (score < 7) {
      return {
        title: "Balanced Translation Analysis",
        color: "text-amber-400 border-amber-500/20 bg-amber-950/10",
        verdict: "The paper successfully decouples visual discomfort from entrainment. It presents a critical bridge element (ISF technology) but demands extensive multi-center clinical trials to validate long-term clinical outcome measures.",
        talkingPoint: "Class Question: Given that ISF is unnoticeable, can we integrate it unnoticed into ambient home lighting systems for older adults, and how do we resolve diagnostic / dosage calibration challenges?"
      };
    } else {
      return {
        title: "Highly Optimistic Perspective",
        color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/10",
        verdict: "Outstanding methodology. Resolving the comfort ceiling represents a massive breakthrough, directly removing the main limiting factor preventing clinical sensory GENUS therapies from seeing wide, chronic adoption.",
        talkingPoint: "Class Question: If entrainment magnitude is comparable across LF, CF and ISF, shouldn't ISF completely replace traditional flickering protocols immediately in all ongoing AD clinical research trials?"
      };
    }
  };

  const synthesis = getCritiqueSynthesis(compositeScore);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-2xl relative overflow-hidden" id="critique-scorecard">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-sky-400 tracking-widest uppercase flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Journal Club Critical Evaluation
          </span>
          <h3 className="text-2xl font-display font-semibold text-white mt-1">Study Appraisal & Translational Gap</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            A crucial part of any masterclass presentation is critiquing the research. Use this interactive scorecard to evaluate the translation potential of this paper.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-xl border border-white/5 self-start md:self-auto shrink-0">
          <div className="text-center">
            <span className="text-[10px] font-mono text-slate-500 block uppercase">Appraisal Index</span>
            <span className="text-3xl font-display font-bold text-white block">{averageRating} <span className="text-sm text-slate-500">/ 10</span></span>
            <span className="text-[10px] text-sky-400 font-mono mt-0.5 block font-semibold uppercase">Composite Verdict</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* SLIDERS COLUMN */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <h4 className="text-sm font-display font-semibold text-slate-200">Rate Research Dimensions:</h4>
          </div>

          <div className="space-y-4">
            {criticMetrics.map((m) => (
              <div key={m.id} className="bg-slate-900/30 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-sm font-display font-semibold text-slate-200 block">{m.label}</span>
                    <span className="text-xs text-slate-400 block">{m.desc}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-950 font-mono text-xs font-bold text-sky-400 border border-slate-800">
                    {m.score} / 10
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id={`slider-critique-${m.id}`}
                    type="range"
                    min="1"
                    max="10"
                    value={m.score}
                    onChange={(e) => handleScoreChange(m.id, parseInt(e.target.value))}
                    className="w-full accent-sky-500 bg-slate-950 h-1 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-950/20 p-2 rounded border border-white/[0.02] font-mono leading-relaxed">
                  <span className="font-semibold text-amber-500/80 mr-1 font-sans">Critique Note:</span> {m.lowExplain}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPOSITE SYNTHESIS PANEL */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
          <div className={`border p-5 rounded-2xl ${synthesis.color} space-y-4 flex-grow h-full flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2 text-sm font-display font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>{synthesis.title}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-300 mt-3 italic">
                "{synthesis.verdict}"
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 bg-slate-950/20 p-3.5 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300 font-display">
                <Quote className="w-3.5 h-3.5" />
                <span>PROPOSED SLIDE Q&A:</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                {synthesis.talkingPoint}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-white/5 space-y-2.5">
            <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PRESENTATION EDGE
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              <strong>Journal Club Pro-Tip:</strong> Highlighting limitations on sample composition (N=25 healthy) shows advanced research literacy. Explain that validating ISF comfort metrics in active dementia patients (who may have photophobia or behavioral agitation) is the immediate next step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
