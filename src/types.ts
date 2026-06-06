export interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  category: "Introduction" | "Background" | "Hypotheses" | "Methods" | "Simulation" | "Results" | "Discussion" | "Critique" | "Summary";
  accentColor: string;
}

export interface SimulationState {
  stimulusType: "LF" | "CF" | "ISF"; // Luminance Flicker, Chromatic Flicker, Invisible Spectral Flicker
  brightness: number; // 0 to 100
  peripheralAngle: number; // 0 (central) to 60 (peripheral) degrees
  isStimulating: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MetricCritique {
  id: string;
  label: string;
  score: number; // 1 to 10
  description: string;
  lowRatingText: string;
  highRatingText: string;
}
