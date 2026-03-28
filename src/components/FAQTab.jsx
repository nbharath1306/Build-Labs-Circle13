import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: "What's the difference between your tracks?",
    a: "Each track focuses on a specific outcome. 'Tools & Automations' builds foundational knowledge, while 'Prompt Engineering' focuses on LLM manipulation. 'AI Automation Lab' is for complex multi-tool workflows, and 'Idea to MVP' is an end-to-end product sprint."
  },
  {
    q: "I'm a beginner, is this for me?",
    a: "You need basic programming knowledge (able to read code, write simple scripts). We don't teach syntax; we teach architecture and integration. If you can write a basic Python or JS function, you're ready."
  },
  {
    q: "Will I get a recording?",
    a: "Yes. All attendees receive lifetime access to the session recording, shared via our private portal within 24 hours of completion."
  },
  {
    q: "What if I can't attend live?",
    a: "If emergencies arise, please email us. You will still receive the recording and all course materials, but you miss out on the live Q&A and networking."
  },
  {
    q: "Can I register on the day?",
    a: "No. Registrations close 48 hours before the Buildlab starts to ensure we can provision necessary credentials and resources for all attendees."
  },
  {
    q: "What should I prepare?",
    a: "A stable internet connection, a quiet environment, your preferred code editor (VS Code recommended), and a modern browser. Specific API credentials required will be emailed to you."
  },
  {
    q: "Is there a refund policy?",
    a: "We offer a 100% money-back guarantee if you feel the Buildlab didn't deliver on its promises. Simply email us within 24 hours after the session concludes."
  },
  {
    q: "What about job placement?",
    a: "While we don't offer formal job placement, the real-world artifacts you build and the Builder community you join frequently lead to opportunities and networking advantages."
  },
  {
    q: "Can companies sponsor team attendance?",
    a: "Yes. We offer enterprise team scaling. Please use the Contact form so we can arrange an invoice and group registration."
  },
  {
    q: "What's included in Builder Bundle?",
    a: "Everything in Standard, plus a 45-minute 1:1 architecture teardown of your specific project with Akhil or Bharath, lifetime VIP community access, and your next Buildlab is completely free."
  }
];

const FAQTab = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full pb-32">
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-premium-gold font-mono tracking-widest uppercase text-sm mb-4 block">Support</span>
          <h1 className="text-4xl md:text-6xl font-bold text-premium-white mb-6">Questions?<br />We got you.</h1>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div 
                key={idx}
                className={`border rounded-sm transition-colors duration-300 overflow-hidden ${isOpen ? 'border-premium-gold bg-premium-dark' : 'border-premium-charcoal bg-premium-black hover:border-premium-gray'}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                >
                  <span className={`text-lg font-semibold transition-colors ${isOpen ? 'text-premium-gold' : 'text-premium-white'}`}>
                    {faq.q}
                  </span>
                  <span className={`ml-4 shrink-0 p-1 rounded-sm transition-colors ${isOpen ? 'bg-premium-gold/20 text-premium-gold' : 'text-premium-gray'}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 pt-2 text-premium-gray border-t border-premium-charcoal mt-2">
                        <p className="leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default FAQTab;
