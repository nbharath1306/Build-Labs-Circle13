import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { Instagram, Linkedin } from './Icons';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const ContactTab = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full pb-32">
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <span className="text-premium-gold font-mono tracking-widest uppercase text-sm mb-4 block">Contact Us</span>
            <h1 className="text-4xl md:text-6xl font-bold text-premium-white mb-6">Get in Touch</h1>
            <p className="text-xl text-premium-gray max-w-md mb-12">
              Have a question about the Buildlabs, enterprise training, or simply want to chat AI? Drop us a line.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-premium-dark border border-premium-charcoal flex items-center justify-center shrink-0">
                  <Mail className="text-premium-gold" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-premium-gray uppercase tracking-wider mb-1">Email</h3>
                  <a href="mailto:signal.circle13@gmail.com" className="text-xl font-medium text-premium-white hover:text-premium-gold transition-colors block border-b border-transparent hover:border-premium-gold w-max pb-1">
                    signal.circle13@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-premium-dark border border-premium-charcoal flex items-center justify-center shrink-0">
                  <Linkedin className="text-premium-gold" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-premium-gray uppercase tracking-wider mb-1">Company</h3>
                  <a href="https://www.linkedin.com/company/circle13ai/" target="_blank" rel="noreferrer" className="text-xl font-medium text-premium-white hover:text-premium-gold transition-colors block border-b border-transparent hover:border-premium-gold w-max pb-1">
                    Circle13 AI LinkedIn
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-premium-dark border border-premium-charcoal flex items-center justify-center shrink-0">
                  <Instagram className="text-premium-gold" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-premium-gray uppercase tracking-wider mb-1">Social</h3>
                  <a href="https://www.instagram.com/circle13.signal/" target="_blank" rel="noreferrer" className="text-xl font-medium text-premium-white hover:text-premium-gold transition-colors block border-b border-transparent hover:border-premium-gold w-max pb-1">
                    @circle13.signal
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-premium-dark border border-premium-charcoal p-8 md:p-12 rounded-sm relative overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-premium-gold/5 rounded-full blur-[80px] pointer-events-none" />
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-premium-gray">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-premium-black border border-premium-charcoal rounded-sm px-4 py-3 text-premium-white focus:outline-none focus:border-premium-gold transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-premium-gray">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-premium-black border border-premium-charcoal rounded-sm px-4 py-3 text-premium-white focus:outline-none focus:border-premium-gold transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-semibold text-premium-gray">Subject</label>
                <select 
                  id="subject" 
                  name="subject" 
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-premium-black border border-premium-charcoal rounded-sm px-4 py-3 text-premium-white focus:outline-none focus:border-premium-gold transition-colors appearance-none"
                >
                  <option value="" disabled>Select a topic</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Enterprise Training">Enterprise / Team Training</option>
                  <option value="Billing / Refunds">Billing</option>
                  <option value="Partnerships">Partnerships</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-premium-gray">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-premium-black border border-premium-charcoal rounded-sm px-4 py-3 text-premium-white focus:outline-none focus:border-premium-gold transition-colors resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || isSubmitted}
                className="w-full py-4 bg-premium-gold text-premium-black font-bold flex justify-center items-center gap-2 rounded-sm hover:bg-premium-goldHover transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : isSubmitted ? 'Message Sent!' : (
                  <>Send Message <Send size={18} /></>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default ContactTab;
