import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { domToPng } from 'modern-screenshot';

interface RoastOutputProps {
  roast: string;
  onReset: () => void;
}

export const RoastOutput: React.FC<RoastOutputProps> = ({ roast, onReset }) => {
  const roastRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!roastRef.current) return;
    
    try {
      const dataUrl = await domToPng(roastRef.current, {
        backgroundColor: '#09090b',
        scale: 2,
        quality: 1,
      });
      
      const link = document.createElement('a');
      link.download = 'my-shameful-roast.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to capture roast:', err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <div 
          ref={roastRef}
          className="relative bg-zinc-950 border border-zinc-800 rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden"
        >
          {/* Hacker aesthetic scanline effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
          
          <div className="prose prose-invert max-w-none prose-headings:text-orange-500 prose-strong:text-orange-400 prose-table:border prose-table:border-zinc-800 prose-th:bg-zinc-900 prose-th:p-2 prose-td:p-2 prose-td:border prose-td:border-zinc-800">
            <ReactMarkdown>{roast}</ReactMarkdown>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-zinc-100 text-zinc-950 px-6 py-3 rounded-full font-bold hover:bg-white transition-colors shadow-lg shadow-white/10"
        >
          <Download className="w-5 h-5" />
          Download My Shame
        </button>
        
        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-zinc-900 text-zinc-400 border border-zinc-800 px-6 py-3 rounded-full font-bold hover:text-zinc-100 hover:border-zinc-700 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          Incinerate Another
        </button>
      </div>
    </div>
  );
};
