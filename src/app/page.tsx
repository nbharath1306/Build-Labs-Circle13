"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

// Tab Components (to be implemented)
import HomeTab from '@/components/HomeTab'
import BuildlabsTab from '@/components/BuildlabsTab'
import ToolsTab from '@/components/ToolsTab'
import AboutTab from '@/components/AboutTab'
import FAQTab from '@/components/FAQTab'
import ContactTab from '@/components/ContactTab'
import Footer from '@/components/Footer'

const TABS = ['Home', 'Buildlabs', 'Tools', 'About', 'FAQ', 'Contact']

export default function App() {
  const [activeTab, setActiveTab] = useState('Home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Home': return <HomeTab onNavigate={setActiveTab} />
      case 'Buildlabs': return <BuildlabsTab />
      case 'Tools': return <ToolsTab />
      case 'About': return <AboutTab />
      case 'FAQ': return <FAQTab />
      case 'Contact': return <ContactTab />
      default: return <HomeTab onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col pt-20 bg-premium-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-premium-black/90 backdrop-blur-md border-b border-premium-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={() => setActiveTab('Home')}>
              <span className="text-xl md:text-2xl font-bold tracking-tight text-premium-white">Circle13 <span className="text-premium-gold font-semibold">Build Labs</span></span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    activeTab === tab ? 'text-premium-gold' : 'text-premium-gray hover:text-premium-white'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-premium-gold"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
              
              <button 
                onClick={() => setActiveTab('Buildlabs')}
                className="ml-6 px-6 py-2.5 bg-premium-gold text-premium-black font-semibold rounded-sm hover:bg-premium-goldHover transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(218,165,32,0.4)] hover:scale-[1.02]"
              >
                Register Now
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-premium-gray hover:text-premium-white focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-premium-dark border-b border-premium-charcoal"
            >
              <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab)
                      setMobileMenuOpen(false)
                    }}
                    className={`block w-full text-left px-3 py-4 text-base font-medium border-l-4 ${
                      activeTab === tab 
                        ? 'bg-premium-charcoal border-premium-gold text-premium-gold' 
                        : 'border-transparent text-premium-gray hover:bg-premium-charcoal hover:text-premium-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <div className="px-3 mt-4">
                  <button 
                    onClick={() => {
                      setActiveTab('Buildlabs')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full px-4 py-3 bg-premium-gold text-premium-black font-semibold tracking-wide hover:bg-premium-goldHover transition-colors duration-300 text-center"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={setActiveTab} />
    </div>
  )
}
