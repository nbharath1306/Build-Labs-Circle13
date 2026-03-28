import { Mail } from 'lucide-react';
import { Twitter, Instagram, Linkedin } from './Icons';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-premium-black border-t border-premium-charcoal pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold tracking-tight text-premium-white mb-4 block">Circle13</span>
            <p className="text-premium-gray max-w-sm mb-6">
              Building the best AI education for technical people. Learn real AI, build real systems.
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://www.linkedin.com/company/circle13ai/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-premium-dark flex items-center justify-center text-premium-gray hover:text-premium-gold hover:bg-premium-charcoal transition-all">
                <Linkedin size={20} />
              </a>
              <a href="https://www.instagram.com/circle13.signal/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-premium-dark flex items-center justify-center text-premium-gray hover:text-premium-gold hover:bg-premium-charcoal transition-all">
                <Instagram size={20} />
              </a>
              <a href="mailto:signal.circle13@gmail.com" className="w-10 h-10 rounded-full bg-premium-dark flex items-center justify-center text-premium-gray hover:text-premium-gold hover:bg-premium-charcoal transition-all">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-premium-white font-semibold mb-6 tracking-wider uppercase text-sm">Navigation</h4>
            <ul className="space-y-3">
              {['Home', 'Buildlabs', 'Tools', 'About', 'FAQ', 'Contact'].map((item) => (
                <li key={item}>
                  <button onClick={() => onNavigate(item)} className="text-premium-gray hover:text-premium-gold hover:translate-x-1 transition-all">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-premium-white font-semibold mb-6 tracking-wider uppercase text-sm">Legal</h4>
            <ul className="space-y-3">
              {['Terms of Service', 'Privacy Policy', 'Refund Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-premium-gray hover:text-premium-white transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-premium-charcoal">
          <p className="text-premium-gray text-sm mb-4 md:mb-0">
            © 2026 Circle13. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-premium-gray text-sm">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
