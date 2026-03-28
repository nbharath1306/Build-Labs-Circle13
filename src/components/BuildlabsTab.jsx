import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, MessageSquare, Repeat, Rocket, GraduationCap, PenTool, Play, ArrowRight, Check } from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { RegistrationForm } from './RegistrationForm';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const tracks = [
  {
    title: "AI Tools & Automations",
    desc: "Learn the AI stack. Build your first automation.",
    build: "A working bot + automation blueprint",
    icon: Settings,
    image: "/course_ai_tools.jpg"
  },
  {
    title: "Prompt Engineering",
    desc: "Master prompt frameworks that actually work.",
    build: "5+ reusable prompt templates, personal vault",
    icon: MessageSquare,
    image: "/course_prompt_eng.jpg"
  },
  {
    title: "AI Automation Lab",
    desc: "Wire AI into your actual workflows.",
    build: "End-to-end automation pipeline",
    icon: Repeat,
    image: "/course_automation.jpg"
  },
  {
    title: "Idea to MVP",
    desc: "Take your idea from concept to working MVP.",
    build: "Demo-ready AI product",
    icon: Rocket,
    image: "/course_mvp.jpg"
  }
];

const timeline = [
  { time: "15 min", title: "Learn", desc: "Understand the foundations", icon: GraduationCap },
  { time: "70 min", title: "Build", desc: "Get your hands dirty with real code", icon: PenTool },
  { time: "20 min", title: "Demo", desc: "See what you built, share it", icon: Play },
  { time: "15 min", title: "Next Steps", desc: "We help you ship it", icon: ArrowRight }
];

const pricingTiers = [
  {
    id: "Early Bird",
    title: "Early Bird",
    price: 399,
    highlight: false,
    features: ['Buildlab Access', 'Session Recording', 'Base Resources'],
    ctaText: "Register"
  },
  {
    id: "Standard",
    title: "Standard",
    price: 799,
    highlight: true,
    features: ['Buildlab Access', 'Session Recording', 'Prompt Vault', 'Premium Templates'],
    ctaText: "Register"
  },
  {
    id: "Bundle",
    title: "Builder Bundle",
    price: 1499,
    highlight: false,
    features: ['Everything in Standard', '1:1 Architecture Audit', 'VIP Community', 'Next Lab Free'],
    ctaText: "Register"
  }
];

const BuildlabsTab = () => {
  const [selectedTier, setSelectedTier] = useState(null);
  
  return (
    <div className="w-full pb-24">
      
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-premium-charcoal">
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h1 className="text-4xl md:text-6xl font-bold text-premium-white mb-6">Choose Your Buildlab</h1>
          <p className="text-xl text-premium-gray max-w-2xl mx-auto">
            Practical tracks designed for builders. Stop watching tutorials and start shipping.
          </p>
        </motion.div>
      </section>

      {/* What You'll Build */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.h2 
          className="text-3xl font-bold text-premium-white mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          What You'll Build
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tracks.map((track, idx) => (
            <motion.div 
              key={idx}
              className="group rounded-sm border border-premium-charcoal bg-premium-dark overflow-hidden hover:border-premium-gold transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="aspect-video bg-premium-black relative overflow-hidden flex items-center justify-center group/img">
                {/* The Custom Generated 4K Course Thumbnail */}
                <img 
                  src={track.image} 
                  alt={track.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                />
                
                {/* Gradient Overlay for Text Readability & Mood */}
                <div className="absolute inset-0 bg-gradient-to-t from-premium-dark via-premium-dark/40 to-transparent pointer-events-none z-10" />
                
                {/* The "Preview Track" overlay that appears on hover */}
                <div className="absolute inset-0 border border-premium-gold/0 group-hover:border-premium-gold/50 transition-colors duration-500 z-20 pointer-events-none" />
                <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <span className="text-premium-gold font-bold uppercase tracking-widest text-sm shadow-2xl px-6 py-3 bg-[#020617]/80 rounded-sm border border-premium-gold/40 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Preview Track</span>
                </div>
                
                {/* The Lucide Icon (visible by default, hidden on hover) */}
                <track.icon className="w-14 h-14 text-white/50 group-hover:opacity-0 transition-opacity duration-300 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-premium-white mb-2">{track.title}</h3>
                <p className="text-premium-gray mb-6">{track.desc}</p>
                <div className="mb-6 pt-4 border-t border-premium-charcoal">
                  <span className="text-xs uppercase tracking-wider font-bold text-premium-gold mb-2 block">You will build</span>
                  <p className="text-premium-white font-medium">{track.build}</p>
                </div>
                <button className="text-premium-gold font-semibold hover:text-premium-goldHover transition-colors flex items-center gap-2 group/btn">
                  Learn more <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works (Timeline) */}
      <section className="py-24 bg-premium-dark border-y border-premium-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-premium-white mb-4">The 2-Hour Experience</h2>
            <p className="text-premium-gray">Fast-paced, focused, and strictly hands-on.</p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[45px] left-0 w-full h-[1px] bg-gradient-to-r from-premium-charcoal via-premium-gold/30 to-premium-charcoal" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
              {timeline.map((step, idx) => (
                <motion.div 
                  key={idx}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-24 h-24 rounded-full bg-premium-black border border-premium-charcoal flex items-center justify-center mb-6 relative group hover:border-premium-gold transition-colors duration-300">
                    <step.icon className="w-8 h-8 text-premium-gray group-hover:text-premium-gold transition-colors" />
                    <div className="absolute -top-3 right-0 bg-premium-gold text-premium-black text-xs font-bold px-2 py-1 rounded-sm">
                      {step.time}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-premium-white mb-2">{step.title}</h3>
                  <p className="text-premium-gray">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table via FeatureCard */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative" id="pricing-section">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-premium-gold/5 rounded-full blur-[100px] pointer-events-none" />
        
        <motion.div 
          className="text-center mb-16 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-premium-white mb-4">Simple Pricing</h2>
          <p className="text-premium-gray">Invest in your skills. Get ROI on day one.</p>
        </motion.div>

        <div className="relative z-10 w-full mb-16">
          <FeatureCard 
            tiers={pricingTiers} 
            onSelectTier={(tierId) => {
              setSelectedTier(tierId);
              setTimeout(() => {
                document.getElementById('registration-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }} 
          />
        </div>
      </section>

      {/* Conditional Registration Form */}
      {selectedTier && (
        <section id="registration-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-3xl font-bold text-premium-white mb-8 text-center border-t border-premium-charcoal pt-12 w-full">Complete Registration</h2>
            <div className="w-full flex justify-center">
              <RegistrationForm />
            </div>
          </motion.div>
        </section>
      )}

    </div>
  );
};

export default BuildlabsTab;
