import {
  Brain,
  Mic,
  FileText,
  Sparkles,
  MessageCircle
} from "lucide-react";

export default function AILoader({ text = "Loading..." }) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center">

      <div className="flex items-center gap-4   rounded-xl px-6 py-4">

        {/* AI Loader */}
        <div className="relative w-14 h-14 flex items-center justify-center">

          {/* center icon */}
          <div className="absolute w-9 h-9 rounded-full theme-primary flex items-center justify-center shadow-lg animate-softPulse">
            <Brain size={16} />
          </div>

          {/* orbit icons */}
          <div className="absolute w-full h-full animate-slowSpin">

            <Mic
              size={14}
              className="absolute top-0 left-1/2 -translate-x-1/2 text-indigo-600 animate-orbit"
            />

            <FileText
              size={14}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-sky-600 animate-orbit"
              style={{ animationDelay: "0.6s" }}
            />

            <Sparkles
              size={14}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-teal-600 animate-orbit"
              style={{ animationDelay: "1.2s" }}
            />

            <MessageCircle
              size={14}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-indigo-500 animate-orbit"
              style={{ animationDelay: "1.8s" }}
            />

          </div>
        </div>

        {/* loader text */}
        <div className="text-sm text-gray-700 font-medium animate-pulse">
          {text}
        </div>

      </div>

    </div>
  );
}