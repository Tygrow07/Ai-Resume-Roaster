import { useState, useEffect } from 'react';
import { Flame, Skull, Terminal, Ghost, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { FileUpload } from './components/FileUpload';
import { RoastOutput } from './components/RoastOutput';
import { extractTextFromPdf } from './lib/pdf';
import { roastResume } from './lib/gemini';

const LOADING_MESSAGES = [
  "Checking for typos...",
  "Laughing at your 'Skills' section...",
  "Calling your references (they didn't pick up)...",
  "Calculating the probability of unemployment...",
  "Searching for actual experience... (404 not found)",
  "Consulting the recruiter gods...",
  "Converting buzzwords into disappointment...",
  "Analyzing your font choice (Comic Sans? Really?)...",
  "Shredding your hopes and dreams...",
  "Preparing the burn unit..."
];

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [roast, setRoast] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[i]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setRoast(null);

    try {
      const text = await extractTextFromPdf(selectedFile);
      const result = await roastResume(text);
      setRoast(result || "The incinerator jammed. Even your resume is too much for AI.");
      
      // Fire confetti for the "incineration" effect
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4400', '#ff8800', '#ff0000']
      });
    } catch (error) {
      console.error(error);
      setRoast("## 💀 SYSTEM ERROR\n\nYour resume was so bad it broke the API. Or maybe it's just a network issue. Try again, loser.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setRoast(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-orange-500/30">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <main className="relative z-10 container mx-auto px-4 py-12 md:py-24 flex flex-col items-center">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-orange-600 p-2 rounded-lg shadow-lg shadow-orange-600/20">
              <Flame className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              Resume <span className="text-orange-600">Incinerator</span>
            </h1>
          </div>
          <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase">
            Recruiter-grade emotional damage as a service
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!file && !isProcessing && !roast && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full"
            >
              <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: Skull, title: "Brutal Honesty", desc: "No sugar-coating. Just cold, hard facts about your career choices." },
                  { icon: Terminal, title: "Hacker Aesthetic", desc: "Clean, sharp, and minimalist. Like your resume should have been." },
                  { icon: Ghost, title: "AI Powered", desc: "Gemini-3-Flash analyzes your failures with surgical precision." }
                ].map((feature, i) => (
                  <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                    <feature.icon className="w-6 h-6 text-orange-500 mb-4" />
                    <h4 className="font-bold mb-2">{feature.title}</h4>
                    <p className="text-sm text-zinc-500">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {isProcessing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-24 h-24 mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-orange-600/20 border-t-orange-600 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-orange-600 animate-bounce" />
                </div>
              </div>
              <motion.p
                key={loadingMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xl font-mono text-zinc-400 text-center max-w-md"
              >
                {loadingMessage}
              </motion.p>
            </motion.div>
          )}

          {roast && !isProcessing && (
            <motion.div
              key="roast"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <RoastOutput roast={roast} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-24 text-zinc-600 text-xs font-mono uppercase tracking-widest">
          &copy; 2026 Resume Incinerator // Built for the bold
        </footer>
      </main>
    </div>
  );
}
