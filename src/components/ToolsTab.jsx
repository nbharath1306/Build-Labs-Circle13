import { motion } from 'framer-motion';

const toolsTop = [
  { name: "ChatGPT", domain: "chatgpt.com" },
  { name: "Claude", domain: "anthropic.com" },
  { name: "Google Gemini", domain: "gemini.google.com" },
  { name: "NotebookLM", domain: "notebooklm.google.com" },
  { name: "DeepSeek", domain: "deepseek.com" },
  { name: "Grok", domain: "x.com" },
  { name: "Manus", domain: "manus.im" },
  { name: "GetMulti.ai", domain: "getmulti.ai" },
  { name: "KIMI", domain: "moonshot.cn" },
  { name: "Julius AI", domain: "julius.ai" },
  { name: "Microsoft Copilot", domain: "copilot.microsoft.com" },
  { name: "Excel AI", domain: "microsoft.com" },
  { name: "Mistral AI", domain: "mistral.ai" },
  { name: "Perplexity", domain: "perplexity.ai" },
  { name: "Midjourney", domain: "midjourney.com" },
  { name: "Google AI Studio", domain: "aistudio.google.com" },
  { name: "Higgsfield", domain: "higgsfield.ai" },
  { name: "OpenClaw", domain: "openclaw.com" },
  { name: "PicoClaw", domain: "picoclaw.com" },
];

const toolsBottom = [
  { name: "LangChain", domain: "langchain.com" },
  { name: "LlamaIndex", domain: "llamaindex.ai" },
  { name: "Pinecone", domain: "pinecone.io" },
  { name: "n8n", domain: "n8n.io" },
  { name: "Make", domain: "make.com" },
  { name: "Zapier", domain: "zapier.com" },
  { name: "AutoGPT", domain: "agpt.co" },
  { name: "Cursor", domain: "cursor.com" },
  { name: "Comet", domain: "comet.com" },
  { name: "Power BI", domain: "powerbi.microsoft.com" },
  { name: "Tableau", domain: "tableau.com" },
  { name: "Supabase", domain: "supabase.com" },
  { name: "Firebase", domain: "firebase.google.com" },
  { name: "Razorpay", domain: "razorpay.com" },
  { name: "Notion AI", domain: "notion.so" },
  { name: "WhisperFlow", domain: "whisperflow.com" },
  { name: "ElevenLabs", domain: "elevenlabs.io" },
];

// Duplicate array multiple times for infinite continuous scrolling effect
const topRow = [...toolsTop, ...toolsTop, ...toolsTop, ...toolsTop];
const bottomRow = [...toolsBottom, ...toolsBottom, ...toolsBottom, ...toolsBottom];

const ToolIcon = ({ tool }) => {
  return (
    <div 
      className="flex flex-col items-center justify-center gap-3 w-32 h-32 mx-4 rounded-2xl bg-gradient-to-br from-premium-charcoal/50 to-premium-black border border-premium-charcoal/40 backdrop-blur-md cursor-pointer hover:-translate-y-3 transition-all duration-300 group/item relative overflow-hidden"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
    >
      {/* Colorful Hover Glow Background */}
      <div 
        className="absolute inset-0 opacity-0 group-hover/item:opacity-20 transition-opacity duration-300 pointer-events-none" 
        style={{ background: `radial-gradient(circle at center, #ffffff 0%, transparent 70%)` }} 
      />
      
      <img 
        src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=128`} 
        alt={tool.name} 
        className="w-12 h-12 rounded-lg transition-all duration-300 group-hover/item:scale-110 drop-shadow-lg"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling.style.display = 'block';
        }} 
      />
      <span className="hidden text-premium-white font-bold text-sm text-center drop-shadow-lg">{tool.name}</span>
      <span className="text-premium-gray text-xs font-semibold group-hover/item:text-premium-white transition-colors tracking-wide z-10">{tool.name}</span>
    </div>
  );
};

const ToolsTab = () => {
  return (
    <div className="w-full min-h-[80vh] flex flex-col justify-center py-24 bg-premium-black overflow-hidden relative">
      
      {/* Background ambient glow matching the colorful aesthetic */}
      <div className="absolute top-0 left-1/3 w-[800px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[800px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        className="text-center mb-24 relative z-10 px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-mono tracking-widest uppercase text-sm mb-4 block font-bold">The Ecosystem</span>
        <h1 className="text-4xl md:text-6xl font-bold text-premium-white mb-6">The Future of Intelligence</h1>
        <p className="text-xl text-premium-gray max-w-2xl mx-auto">
          Built with the exact same scalable open-source and proprietary toolchain the world's leading AI companies run in production.
        </p>
      </motion.div>

      {/* Infinite Carousel Top Row (Moving Left) */}
      <div className="relative flex overflow-x-hidden group whitespace-nowrap mb-8 py-4">
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-premium-black to-transparent z-10" />
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-premium-black to-transparent z-10" />
        
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
        >
          {topRow.map((tool, idx) => (
            <ToolIcon key={`top-${idx}`} tool={tool} />
          ))}
        </motion.div>
      </div>

      {/* Infinite Carousel Bottom Row (Moving Right) */}
      <div className="relative flex overflow-x-hidden group whitespace-nowrap py-4 mt-4">
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-premium-black to-transparent z-10" />
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-premium-black to-transparent z-10" />
        
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: [-1000, 0] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
        >
          {bottomRow.map((tool, idx) => (
            <ToolIcon key={`bottom-${idx}`} tool={tool} />
          ))}
        </motion.div>
      </div>

    </div>
  );
};

export default ToolsTab;
