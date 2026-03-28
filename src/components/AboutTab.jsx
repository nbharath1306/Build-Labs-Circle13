import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { Linkedin, Instagram } from './Icons';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const AboutTab = () => {
  return (
    <div className="w-full pb-24">
      
      {/* Code-generated Banner Header based on specs */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="w-full max-w-[1200px] mx-auto rounded-sm overflow-hidden flex flex-col md:flex-row bg-gradient-to-br from-[#0f172a] to-[#1a202c] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-premium-charcoal aspect-auto md:aspect-[3/1]"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {/* Left Side: Text Content (60%) */}
          <div className="md:w-[60%] p-10 md:p-16 flex flex-col justify-center relative">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#059669]/10 rounded-full blur-[80px]" />
            <span className="text-[#059669] font-mono text-xs tracking-widest uppercase mb-4 block">Circle13 Founders</span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#f7fafc] mb-4 leading-tight">
              Built by Engineers.<br />
              <span className="text-premium-gray">For Engineers.</span>
            </h2>
            <p className="text-lg text-[#f7fafc]/80 mb-8 border-l-2 border-[#059669] pl-4">
              Learn AI from people who actually ship it.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-2 block shrink-0" />
                <span className="text-sm md:text-base text-[#f7fafc]/90"><strong>Akhil Vipin Nair (CTO)</strong> — 2+ years building AI systems at scale</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-2 block shrink-0" />
                <span className="text-sm md:text-base text-[#f7fafc]/90"><strong>N Bharath (CEO)</strong> — 2+ years founding & scaling tech companies</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-2 block shrink-0" />
                <span className="text-sm md:text-base text-[#f7fafc]/90">Teaching what actually works in production</span>
              </li>
            </ul>
          </div>

          {/* Right Side: Photos (40%) */}
          <div className="md:w-[40%] flex items-center justify-center p-10 md:p-0 relative">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1a202c] pointer-events-none hidden md:block" />
            <div className="flex gap-4 md:gap-8 items-center z-10 transition-transform hover:scale-[1.02] duration-500">
              
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#059669] overflow-hidden mb-4 shadow-[0_0_30px_rgba(5,150,105,0.3)] bg-premium-charcoal">
                  <img src="/akhil_v2.jpg" alt="Akhil Vipin Nair" className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                </div>
                <span className="text-[#f7fafc] text-sm font-semibold">Akhil Vipin Nair</span>
                <span className="text-[#059669] text-xs">CTO</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#059669] overflow-hidden mb-4 shadow-[0_0_30px_rgba(5,150,105,0.3)] bg-premium-charcoal">
                  <img src="/bharath_v2.jpg" alt="N Bharath" className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                </div>
                <span className="text-[#f7fafc] text-sm font-semibold">N Bharath</span>
                <span className="text-[#059669] text-xs">CEO</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Detailed Bios */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          <motion.div 
            className="flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-[4/5] rounded-sm bg-premium-dark border border-premium-charcoal mb-8 overflow-hidden group">
              <img src="/akhil_v2.jpg" alt="Akhil Vipin Nair" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <h3 className="text-3xl font-bold text-premium-white mb-2">Akhil Vipin Nair</h3>
            <span className="text-premium-gold font-mono text-sm tracking-widest uppercase mb-6 block">Co-Founder & CTO @Circle13</span>
            <p className="text-premium-gray text-lg mb-8 leading-relaxed">
              Architecting Agentic AI Systems & Intelligent Automation. I work at the intersection of Agentic AI, automation, and intelligent systems, with a clear focus on how technology can be shaped into scalable, durable business value.
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/akhil-vipin-nair-a5692635b/" target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center border border-premium-charcoal rounded-sm text-premium-gold hover:bg-premium-gold hover:text-premium-black transition-all">
                <Linkedin size={20} />
              </a>
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="aspect-[4/5] rounded-sm bg-premium-dark border border-premium-charcoal mb-8 overflow-hidden group">
              <img src="/bharath_v2.jpg" alt="N Bharath" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <h3 className="text-3xl font-bold text-premium-white mb-2">N Bharath</h3>
            <span className="text-premium-gold font-mono text-sm tracking-widest uppercase mb-6 block">Chief Executive Officer @Circle13</span>
            <p className="text-premium-gray text-lg mb-8 leading-relaxed">
              Leading Circle13 as a modern innovation collective focused on building high-quality digital products with clarity, speed, and precision. I oversee company strategy, product direction, team leadership, partnerships, and execution across all projects. My role includes shaping our vision, driving growth, and ensuring Circle13 delivers meaningful, well-engineered digital experiences.
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/n-bharath-2b86311b9/" target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center border border-premium-charcoal rounded-sm text-premium-gold hover:bg-premium-gold hover:text-premium-black transition-all">
                <Linkedin size={20} />
              </a>
              <a href="https://www.linkedin.com/company/circle13ai/" target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center border border-premium-charcoal rounded-sm text-premium-gold hover:bg-premium-gold hover:text-premium-black transition-all">
                <Globe size={20} />
              </a>
            </div>
          </motion.div>

        </div>
      </section>
      
      {/* Social Banner CTA */}
      <section className="py-16 bg-premium-dark border-y border-premium-charcoal">
        <motion.div 
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <Instagram size={48} className="text-premium-gold mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-premium-white mb-6">See behind the scenes</h2>
          <a href="https://www.instagram.com/circle13.signal/" target="_blank" rel="noreferrer" className="text-premium-gray hover:text-premium-gold transition-colors font-medium text-lg border-b border-premium-charcoal hover:border-premium-gold pb-1">
            Follow us for updates @circle13.signal
          </a>
        </motion.div>
      </section>

    </div>
  );
};

export default AboutTab;
