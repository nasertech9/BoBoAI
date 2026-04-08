import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, ArrowLeft, Volume2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VoiceState = "idle" | "listening" | "processing" | "responding";

const TIPS = [
  "Say something like \"Write me a Python function\"",
  "Ask \"Show me upcoming music festivals\"",
  "Try \"Generate an image of a sunset\"",
  "Ask \"What is machine learning?\"",
  "Say \"Help me debug this code\"",
];

export default function VoicePage() {
  const navigate = useNavigate();
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [tipIndex, setTipIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Check browser support
  useEffect(() => {
    const SpeechRecognitionAPI =
      (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setSupported(false);
    }
  }, []);

  // Elapsed timer while listening
  useEffect(() => {
    if (voiceState === "listening") {
      timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsedSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [voiceState]);

  const startListening = () => {
    const SpeechRecognitionAPI =
      (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as Window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setVoiceState("listening");
      setTranscript("");
      setResponse("");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += t;
        } else {
          interimTranscript += t;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onend = () => {
      if (transcript || recognitionRef.current) {
        processVoice();
      } else {
        setVoiceState("idle");
      }
    };

    recognition.onerror = () => {
      setVoiceState("idle");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const processVoice = () => {
    setVoiceState("processing");
    // Simulate AI processing delay
    setTimeout(() => {
      setVoiceState("responding");
      const mockResponses = [
        "I heard you! Let me help you with that right away.",
        "Great question! Here's what I found for you.",
        "Sure thing! I'm processing your request now.",
        "Absolutely! Let me take care of that for you.",
      ];
      const r = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setResponse(r);
      // Speak response
      const utterance = new SpeechSynthesisUtterance(r);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.onend = () => setVoiceState("idle");
      window.speechSynthesis.speak(utterance);
    }, 1500);
  };

  const handleMicClick = () => {
    if (voiceState === "listening") {
      stopListening();
    } else if (voiceState === "idle") {
      startListening();
    }
  };

  const handleSendToChat = () => {
    if (transcript) {
      navigate("/", { state: { voiceMessage: transcript } });
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/40 px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-bold text-foreground">Voice Assistant</h1>
          <p className="text-xs text-muted-foreground">Speak to BoBoAI</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">BoBoAI 4.0 Pro</span>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
        {/* Animated orb */}
        <div className="relative flex items-center justify-center">
          {/* Outer pulse rings */}
          {voiceState === "listening" && (
            <>
              <div className="absolute h-64 w-64 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: "1.5s" }} />
              <div className="absolute h-52 w-52 rounded-full border border-primary/30 animate-ping" style={{ animationDuration: "1.2s", animationDelay: "0.2s" }} />
              <div className="absolute h-44 w-44 rounded-full border border-primary/40 animate-ping" style={{ animationDuration: "0.9s", animationDelay: "0.1s" }} />
            </>
          )}
          {voiceState === "processing" && (
            <div className="absolute h-48 w-48 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          )}
          {voiceState === "responding" && (
            <>
              <div className="absolute h-56 w-56 rounded-full border border-green-400/20 animate-ping" style={{ animationDuration: "1s" }} />
              <div className="absolute h-44 w-44 rounded-full border border-green-400/30 animate-ping" style={{ animationDuration: "1.3s" }} />
            </>
          )}

          {/* Mic button */}
          <button
            onClick={handleMicClick}
            disabled={voiceState === "processing" || voiceState === "responding" || !supported}
            className={cn(
              "relative z-10 flex h-36 w-36 items-center justify-center rounded-full transition-all duration-300",
              "shadow-2xl focus:outline-none active:scale-95",
              voiceState === "idle" &&
                "bg-gradient-to-br from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 hover:scale-105",
              voiceState === "listening" &&
                "bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 animate-pulse-glow",
              voiceState === "processing" &&
                "bg-gradient-to-br from-orange-500 to-amber-500 cursor-not-allowed opacity-80",
              voiceState === "responding" &&
                "bg-gradient-to-br from-green-500 to-emerald-500 cursor-not-allowed"
            )}
            aria-label={voiceState === "listening" ? "Stop listening" : "Start listening"}
          >
            {voiceState === "processing" ? (
              <Loader2 className="h-14 w-14 text-white animate-spin" />
            ) : voiceState === "listening" ? (
              <MicOff className="h-14 w-14 text-white" />
            ) : (
              <Mic className="h-14 w-14 text-white" />
            )}
          </button>
        </div>

        {/* Status label */}
        <div className="text-center space-y-1">
          {voiceState === "idle" && (
            <>
              <p className="text-lg font-semibold text-foreground">
                {supported ? "Tap to speak" : "Voice not supported"}
              </p>
              {supported && (
                <p className="text-sm text-muted-foreground animate-fade-in" key={tipIndex}>
                  {TIPS[tipIndex]}
                </p>
              )}
              {!supported && (
                <p className="text-sm text-muted-foreground">
                  Your browser doesn't support speech recognition. Try Chrome or Edge.
                </p>
              )}
            </>
          )}
          {voiceState === "listening" && (
            <>
              <p className="text-lg font-semibold text-red-400">Listening…</p>
              <p className="text-sm font-mono text-muted-foreground">{formatTime(elapsedSeconds)}</p>
              <p className="text-xs text-muted-foreground">Tap the mic to stop</p>
            </>
          )}
          {voiceState === "processing" && (
            <p className="text-lg font-semibold text-orange-400 animate-pulse">Processing…</p>
          )}
          {voiceState === "responding" && (
            <p className="text-lg font-semibold text-green-400">Speaking response…</p>
          )}
        </div>

        {/* Transcript card */}
        {transcript && (
          <div className="w-full max-w-md animate-fade-in">
            <div className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-lg">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                You said
              </p>
              <p className="text-sm text-foreground leading-relaxed">"{transcript}"</p>
              {voiceState === "idle" && (
                <Button
                  onClick={handleSendToChat}
                  size="sm"
                  className="mt-3 gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send to chat
                </Button>
              )}
            </div>
          </div>
        )}

        {/* AI response card */}
        {response && (
          <div className="w-full max-w-md animate-fade-in">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-lg">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary/70">
                BoBoAI says
              </p>
              <p className="text-sm text-foreground leading-relaxed">{response}</p>
            </div>
          </div>
        )}
      </div>

      {/* Waveform bars (decorative, only while listening) */}
      {voiceState === "listening" && (
        <div className="flex items-end justify-center gap-1 pb-6 h-16">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-primary/60"
              style={{
                height: `${20 + Math.random() * 40}px`,
                animation: `bounce-dots ${0.8 + Math.random() * 0.6}s ease-in-out infinite`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
