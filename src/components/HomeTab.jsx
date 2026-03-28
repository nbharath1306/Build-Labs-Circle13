import { motion } from 'framer-motion';
import { BookOpen, Target, Briefcase, ChevronRight, Brain } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const HomeTab = ({ onNavigate }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-premium-charcoal/20 to-premium-black z-0" />
        
        <motion.div 
          className="flex-1 z-10 text-center lg:text-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-premium-white leading-tight mb-6">
            Learn Real AI.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-premium-gold to-premium-goldDark">Build Real Systems.</span>
          </h1>
          <p className="text-lg sm:text-xl text-premium-gray mb-10 max-w-2xl mx-auto lg:mx-0">
            2-hour hands-on Buildlabs for engineers who want to ship AI products. No fluff, no basic tutorials—just practical coding and real integrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={() => onNavigate('Buildlabs')}
              className="px-8 py-4 bg-premium-gold text-premium-black font-bold rounded-sm hover:bg-premium-goldHover transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(218,165,32,0.4)] hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              View Upcoming Buildlabs
              <ChevronRight size={20} />
            </button>
            <button 
              onClick={() => onNavigate('Buildlabs')}
              className="px-8 py-4 bg-transparent border border-premium-charcoal text-premium-white font-semibold rounded-sm hover:border-premium-gold hover:text-premium-gold transition-colors duration-300"
            >
              See What You'll Build
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="flex-1 w-full max-w-lg lg:max-w-none relative z-10"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative w-full rounded-2xl overflow-hidden border border-premium-charcoal bg-[#0f172a] shadow-[0_0_40px_rgba(20,184,166,0.15)] group transition-all duration-500 hover:shadow-[0_0_60px_rgba(20,184,166,0.25)]">
            <div className="absolute inset-0 transition-opacity duration-500 z-10 bg-[#0f172a]/10 group-hover:bg-[#0f172a]/0 pointer-events-none" />
            <img 
              src="/hero_poster.jpg"
              alt="Build Agentic AI Systems"
              className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]" 
            />
          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-premium-dark border-y border-premium-charcoal relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-premium-white mb-4">
              AI tools are everywhere.<br />
              <span className="text-premium-gray">But knowing how to use them?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Lots of tutorials", desc: "Most stop at theory. We push you to production." },
              { icon: Target, title: "Build fast", desc: "But how to actually ship? We teach the real workflows." },
              { icon: Briefcase, title: "Want skills", desc: "None of the bootcamps teach current, practical AI." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                className="p-8 rounded-sm bg-premium-black border border-premium-charcoal hover:border-premium-gold/50 transition-colors duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-premium-dark rounded-full flex items-center justify-center mb-6 group-hover:bg-premium-gold/10 transition-colors">
                  <item.icon className="text-premium-gray group-hover:text-premium-gold transition-colors" size={24} />
                </div>
                <h3 className="text-xl font-bold text-premium-white mb-2">{item.title}</h3>
                <p className="text-premium-gray">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-premium-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-premium-gold/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-premium-white mb-6">
              Ready to learn? Registration closing soon.
            </h2>
            <div className="mb-10 w-full flex justify-center">
              <CountdownTimer targetDate={new Date(Date.now() + 48 * 60 * 60 * 1000)} />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button 
                onClick={() => onNavigate('Buildlabs')}
                className="w-full sm:w-auto px-10 py-4 bg-premium-gold text-premium-black font-bold rounded-sm hover:bg-premium-goldHover transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(218,165,32,0.4)]"
              >
                Register Now
              </button>
              <button 
                onClick={() => onNavigate('Buildlabs')}
                className="w-full sm:w-auto px-10 py-4 border border-premium-charcoal text-premium-white font-semibold rounded-sm hover:border-premium-gray transition-colors duration-300"
              >
                View All Buildlabs
              </button>
            </div>
            <p className="text-premium-gray text-sm">No credit card needed right now. Seats strictly limited to 15 engineers per cohort.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomeTab;
