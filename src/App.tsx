import React, { useEffect, useState, useRef } from 'react';
import { Search, Settings, RefreshCw, Zap, ChevronDown, ChevronUp, Mail } from 'lucide-react';

function App() {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [showTitleCursor, setShowTitleCursor] = useState(true);
  const [showSubtitleCursor, setShowSubtitleCursor] = useState(false);
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());
  const [hoveredFaq, setHoveredFaq] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [isMoving, setIsMoving] = useState(false);
  const moveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  
  const fullTitleText = 'AI-Powered Solutions';
  const fullSubtitleText = 'Grow your profits with AI automation';
  const titleSpeed = 50; // milliseconds per character (faster)
  const subtitleSpeed = 25; // milliseconds per character (faster)
  const titleStartDelay = 300; // delay before title starts typing (shorter)
  const subtitleStartDelay = 800; // delay before subtitle starts typing (shorter)

  // Navigation sections mapping
  const navSections = {
    'Home': 'hero-section',
    'Process': 'process-section',
    'Services': 'services-section',
    'FAQ': 'faq-section',
    'Contact': 'contact-section' // Changed from 'calendly-section' to 'contact-section'
  };

  // Service details with bullet points
  const serviceDetails = {
    'website-creation': {
      title: 'Website Creation',
      description: 'Custom-built, responsive websites that capture your brand\'s essence and drive results',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      bullets: [
        'Responsive design for all devices',
        'Sleek animations and modern designs',
        'Custom branding and visual identity',
        'User experience focused development',
        'AI Chatbot integration'
      ]
    },
    'ai-chatbots': {
      title: 'AI Chatbots',
      description: 'Intelligent conversational agents that engage customers and streamline support operations',
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      bullets: [
        '24/7 customer support automation',
        'Natural language understanding',
        'Personalized customer interactions',
        'Seamless CRM integration',
        'Multi-platform deployment (web, mobile, messaging apps)'
      ]
    },
    'ai-voice-callers': {
      title: 'AI Voice Callers',
      description: 'Natural-sounding voice assistants that handle inbound calls and customer interactions',
      image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      bullets: [
        'Human-like voice interactions',
        'Automated appointment scheduling, rescheduling and cancellation',
        'Customer information collection',
        'Integration with existing phone systems',
        '24/7 service, never sleeps or takes breaks'
      ]
    },
    'ai-workflow': {
      title: 'AI Workflow Automation',
      description: 'AI Automated systems handling business tasks with precision and efficiency',
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      bullets: [
        'Business process automation',
        'Document processing and data extraction',
        'Workflow optimization and analysis',
        'Custom automation solutions',
        'Integration with existing business systems'
      ]
    }
  };

  // FAQ data
  const faqItems = [
    {
      question: "What AI solutions do you offer?",
      answer: "We offer a comprehensive range of AI solutions including Website Creation, AI chatbots, AI Voice Callers, and AI workflow automations tailored to your specific business needs."
    },
    {
      question: "How long does it take to implement an AI solution?",
      answer: "Implementation timelines vary based on complexity and scope. Simple automations can be deployed in 2-4 weeks, while more complex enterprise solutions can take 2-6 months. During our initial consultation, we'll discuss the specific timeline to your project."
    },
    {
      question: "Do you offer ongoing support?",
      answer: "Yes, we provide comprehensive ongoing support through our Maintain + Upgrade service. This includes 24/7 system monitoring, regular performance optimization, feature enhancements, and scaling support as your business grows. We offer flexible support packages to meet your specific needs."
    },
    {
      question: "Can AI solutions integrate with my existing systems?",
      answer: "Absolutely. Our solutions are designed to seamlessly integrate with your existing infrastructure, including CRMs, ERPs, databases, and custom software. We prioritize creating solutions that enhance rather than replace your current technology investments."
    },
    {
      question: "What industries do you serve?",
      answer: "We work with clients across various industries. We specifically specialize in the hospitality industry, namely restaurants, hotels and Catering services. Our AI solutions are adaptable to the unique challenges and opportunities each industry faces."
    },
    {
      question: "What is the typical return on investment?",
      answer: "AI never sleeps, never calls in sick and works 24/7. That's why our AI solutions have high ROI's. ROI varies by project, but our clients typically see a immediate return on their investment after the implementation of our solution. We focus on high-impact areas where AI can reduce costs, increase efficiency, or generate new revenue. During our assessment phase, we'll provide detailed ROI projections for your specific use case."
    }
  ];

  // Services mapping for footer links
  const serviceLinks = {
    'Website Creation': 'services-section',
    'AI Workflow Automation': 'services-section',
    'AI Chatbots': 'ai-chatbots-service',
    'AI Voice Callers': 'ai-voice-callers-service'
  };

  const toggleFaq = (index: number) => {
    setExpandedFaqs(prevExpandedFaqs => {
      const newExpandedFaqs = new Set(prevExpandedFaqs);
      
      if (newExpandedFaqs.has(index)) {
        newExpandedFaqs.delete(index);
      } else {
        newExpandedFaqs.add(index);
      }
      
      return newExpandedFaqs;
    });
  };

  // Check if a FAQ is expanded
  const isFaqExpanded = (index: number) => {
    return expandedFaqs.has(index);
  };

  const toggleService = (serviceId: string) => {
    setExpandedServices(prevExpandedServices => {
      const newExpandedServices = new Set(prevExpandedServices);
      
      if (newExpandedServices.has(serviceId)) {
        newExpandedServices.delete(serviceId);
      } else {
        newExpandedServices.add(serviceId);
      }
      
      return newExpandedServices;
    });
  };

  // Check if a service is expanded
  const isServiceExpanded = (serviceId: string) => {
    return expandedServices.has(serviceId);
  };

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Custom cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      // Set moving state to true
      setIsMoving(true);
      
      // Clear any existing timeout
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
      
      // Set a timeout to set moving state to false after 100ms of no movement
      moveTimeoutRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, []);

  // Create cursor elements
  useEffect(() => {
    // Create cursor dot element
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    // Create cursor glow element
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);
    
    // Add cursor-active class to body when cursor is moving
    if (isMoving) {
      document.body.classList.add('cursor-active');
    } else {
      document.body.classList.remove('cursor-active');
    }
    
    // Update cursor position
    cursorDot.style.left = `${cursorPosition.x}px`;
    cursorDot.style.top = `${cursorPosition.y}px`;
    cursorGlow.style.left = `${cursorPosition.x}px`;
    cursorGlow.style.top = `${cursorPosition.y}px`;
    
    return () => {
      document.body.removeChild(cursorDot);
      document.body.removeChild(cursorGlow);
    };
  }, [cursorPosition, isMoving]);

  // Load Calendly script only once when component mounts
  useEffect(() => {
    if (!calendlyLoaded) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        setCalendlyLoaded(true);
      };
      document.head.appendChild(script);
      
      return () => {
        // Only remove if it exists
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [calendlyLoaded]);

  useEffect(() => {
    // Title typing animation
    let titleTimer: ReturnType<typeof setTimeout>;
    let currentTitleIndex = 0;
    
    titleTimer = setTimeout(() => {
      const titleInterval = setInterval(() => {
        if (currentTitleIndex <= fullTitleText.length) {
          setTitleText(fullTitleText.substring(0, currentTitleIndex));
          currentTitleIndex++;
        } else {
          clearInterval(titleInterval);
          // Hide title cursor when done and show subtitle cursor
          setShowTitleCursor(false);
          setShowSubtitleCursor(true);
        }
      }, titleSpeed);
      
      return () => clearInterval(titleInterval);
    }, titleStartDelay);

    // Subtitle typing animation (starts after title)
    let subtitleTimer: ReturnType<typeof setTimeout>;
    let currentSubtitleIndex = 0;
    
    subtitleTimer = setTimeout(() => {
      const subtitleInterval = setInterval(() => {
        if (currentSubtitleIndex <= fullSubtitleText.length) {
          setSubtitleText(fullSubtitleText.substring(0, currentSubtitleIndex));
          currentSubtitleIndex++;
        } else {
          clearInterval(subtitleInterval);
          // Hide subtitle cursor when done
          setShowSubtitleCursor(false);
        }
      }, subtitleSpeed);
      
      return () => clearInterval(subtitleInterval);
    }, subtitleStartDelay);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
    };
  }, []);

  // Initialize Calendly when component is mounted and script is loaded
  useEffect(() => {
    if (calendlyLoaded && (window as any).Calendly) {
      // Force Calendly to initialize for the widget
      (window as any).Calendly.initInlineWidget({
        url: 'https://calendly.com/lightning-strategy/free-ai-automation-onboarding-call',
        parentElement: document.querySelector('.calendly-inline-widget'),
        prefill: {},
        utm: {}
      });
    }
  }, [calendlyLoaded]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background with grid only */}
      <div className="absolute inset-0 z-0">
        <div className="lightning-grid"></div>
        {/* Lightning bolts removed */}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center">
          <Zap className="h-8 w-8 text-orange-500 mr-2" />
          <h1 className="text-2xl font-bold text-orange-500">LIGHTNING STRATEGY</h1>
        </div>
        <div className="hidden md:flex space-x-8">
          {Object.entries(navSections).map(([name, sectionId]) => (
            <a 
              key={name} 
              href={`#${sectionId}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(sectionId);
              }}
              className="text-white hover:text-orange-500 transition-colors duration-300"
            >
              {name}
            </a>
          ))}
        </div>
        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </nav>

      {/* Hero Section */}
      <header id="hero-section" className="relative z-10 text-center py-20 px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-300 mb-6 min-h-[4rem] md:min-h-[5rem]">
          <span className="inline-block">{titleText}</span>
          {showTitleCursor && <span className="inline-block text-orange-500 animate-blink">|</span>}
        </h1>
        <p className="text-xl md:text-2xl text-white mb-10 max-w-3xl mx-auto min-h-[3rem] md:min-h-[4rem]">
          <span className="inline-block">{subtitleText}</span>
          {showSubtitleCursor && <span className="inline-block text-white animate-blink">|</span>}
        </p>
        <button 
          onClick={() => scrollToSection('calendly-section')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(255,165,0,0.5)] button-spark"
        >
          Get Started
        </button>
      </header>

      {/* Process Section */}
      <section id="process-section" className="relative z-10 py-16 px-4">
        <h2 className="text-5xl font-bold text-center mb-16">Our Process</h2>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Assess Section */}
          <div 
            className={`process-panel ${hoveredSection === 'assess' ? 'panel-hovered' : ''}`}
            onMouseEnter={() => setHoveredSection('assess')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="icon-container">
              <Search className="h-12 w-12 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-orange-500 mb-4">Assess</h3>
            <p className="text-white mb-6">We thoroughly discuss & analyze your business operations & workflow.</p>
            <ul className="text-white space-y-2">
              <li className={`flex items-center ${hoveredSection === 'assess' ? 'slide-in' : ''}`} style={{animationDelay: '0s'}}>
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                Business Process Analysis
              </li>
              <li className={`flex items-center ${hoveredSection === 'assess' ? 'slide-in' : ''}`} style={{animationDelay: '0.1s'}}>
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                Pain Point Identification
              </li>
              <li className={`flex items-center ${hoveredSection === 'assess' ? 'slide-in' : ''}`} style={{animationDelay: '0.2s'}}>
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                Opportunity Assessment
              </li>
              <li className={`flex items-center ${hoveredSection === 'assess' ? 'slide-in' : ''}`} style={{animationDelay: '0.3s'}}>
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                ROI Projection
              </li>
            </ul>
          </div>

          {/* Implementation Section */}
          <div 
            className={`process-panel ${hoveredSection === 'implementation' ? 'panel-hovered' : ''}`}
            onMouseEnter={() => setHoveredSection('implementation')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="icon-container">
              <Settings className="h-12 w-12 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-orange-500 mb-4">Implementation</h3>
            <p className="text-white mb-6">We develop & deploy customized AI solutions tailored to your objectives.</p>
            <ul className="text-white space-y-2">
              <li className={`flex items-center ${hoveredSection === 'implementation' ? 'slide-in' : ''}`} style={{animationDelay: '0s'}}>
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                Solution Development
              </li>
              <li className={`flex items-center ${hoveredSection === 'implementation' ? 'slide-in' : ''}`} style={{animationDelay: '0.1s'}}>
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                Existing Systems Integration
              </li>
              <li className={`flex items-center ${hoveredSection === 'implementation' ? 'slide-in' : ''}`} style={{animationDelay: '0.2s'}}>
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                Staff Training + Onboarding
              </li>
              <li className={`flex items-center ${hoveredSection === 'implementation' ? 'slide-in' : ''}`} style={{animationDelay: '0.3s'}}>
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                Performance Testing
              </li>
              <li className={`flex items-center ${hoveredSection === 'implementation' ? 'slide-in' : ''}`} style={{animationDelay: '0.4s'}}>
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                Deployment & Monitoring
              </li>
            </ul>
          </div>

          {/* Maintain + Upgrade Section */}
          <div 
            className={`process-panel ${hoveredSection === 'maintain' ? 'panel-hovered' : ''}`}
            onMouseEnter={() => setHoveredSection('maintain')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="icon-container">
              <RefreshCw className="h-12 w-12 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-orange-500 mb-4">Maintain + Upgrade</h3>
            <p className="text-white mb-6">We provide ongoing support & continuous improvements.</p>
            <ul className="text-white space-y-2">
              <li className={`flex items-center ${hoveredSection === 'maintain' ? 'slide-in' : ''}`} style={{animationDelay: '0s'}}>
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                24/7 System Monitoring
              </li>
              <li className={`flex items-center ${hoveredSection === 'maintain' ? 'slide-in' : ''}`} style={{animationDelay: '0.1s'}}>
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                Performance Optimization
              </li>
              <li className={`flex items-center ${hoveredSection === 'maintain' ? 'slide-in' : ''}`} style={{animationDelay: '0.2s'}}>
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                Feature Enhancements
              </li>
              <li className={`flex items-center ${hoveredSection === 'maintain' ? 'slide-in' : ''}`} style={{animationDelay: '0.3s'}}>
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                Scaling Support
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="relative z-10 py-16 px-4 bg-black bg-opacity-50">
        <h2 className="text-5xl font-bold text-center mb-16">Our Services</h2>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Map through service details to create service cards */}
          {Object.entries(serviceDetails).map(([id, service]) => (
            <div 
              key={id} 
              id={id === 'ai-chatbots' ? 'ai-chatbots-service' : id === 'ai-voice-callers' ? 'ai-voice-callers-service' : ''}
              className={`service-card ${isServiceExpanded(id) ? 'service-expanded' : ''}`}
            >
              <div className="relative h-48 mb-4 overflow-hidden rounded-t-lg">
                <img 
                  src={service.image}
                  alt={service.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{service.title}</h3>
              </div>
              <div className="p-4">
                <p className="text-white mb-4">{service.description}</p>
                
                <button 
                  onClick={() => toggleService(id)}
                  className="flex items-center justify-center w-full py-2 px-4 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-md transition-all duration-300 border border-orange-500/30"
                >
                  <span className="mr-2">{isServiceExpanded(id) ? 'Show Less' : 'Show More'}</span>
                  {isServiceExpanded(id) ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isServiceExpanded(id) ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}>
                  <ul className="text-white space-y-2">
                    {service.bullets.map((bullet, index) => (
                      <li 
                        key={index} 
                        className={`flex items-center ${isServiceExpanded(id) ? 'slide-in-delayed' : ''}`}
                        style={{animationDelay: `${0.1 * index}s`}}
                      >
                        <span className="h-2 w-2 bg-orange-400 rounded-full mr-2"></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq-section" className="relative z-10 py-16 px-4 bg-black bg-opacity-30">
        <h2 className="text-5xl font-bold text-center mb-16">FAQ</h2>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className={`faq-card ${hoveredFaq === index ? 'faq-hovered' : ''}`}
              onMouseEnter={() => setHoveredFaq(index)}
              onMouseLeave={() => setHoveredFaq(null)}
            >
              <button
                onClick={() => toggleFaq(index)}
                className={`w-full flex justify-between items-center p-5 rounded-lg text-left transition-all duration-300 ${
                  isFaqExpanded(index) 
                    ? 'bg-gradient-to-r from-orange-900/50 to-orange-800/30 text-orange-400' 
                    : 'bg-black/50 text-orange-400 hover:bg-black/70'
                }`}
              >
                <span className="text-xl font-semibold">{item.question}</span>
                {isFaqExpanded(index) ? (
                  <ChevronUp className="h-6 w-6 text-orange-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-orange-400 flex-shrink-0" />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isFaqExpanded(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 bg-black/30 text-white rounded-b-lg border-t border-orange-800/30">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Calendly Section */}
      <section id="calendly-section" className="relative z-10 py-16 px-4 bg-black bg-opacity-70">
        <h2 className="text-5xl font-bold text-center mb-8">Schedule a Consultation</h2>
        <p className="text-xl text-white text-center mb-10 max-w-2xl mx-auto">
          Select a time that works for you, and our AI strategy experts will help you identify opportunities for automation in your business.
        </p>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="calendly-inline-widget" data-url="https://calendly.com/lightning-strategy/free-ai-automation-onboarding-call" style={{minWidth: '320px', height: '700px'}}></div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact-section" className="relative z-10 bg-black bg-opacity-70 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-orange-500 mr-2" />
              <h3 className="text-xl font-bold text-orange-500">LIGHTNING STRATEGY LLC</h3>
            </div>
          
            <p className="text-gray-300">
              312 W 2nd St Unit #A2299 
              Casper, WY 82601, USA
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-500">Quick Links</h4>
            <ul className="space-y-2">
              {Object.entries(navSections).map(([name, sectionId]) => (
                <li key={name}>
                  <a 
                    href={`#${sectionId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(sectionId);
                    }}
                    className="text-gray-300 hover:text-orange-500 transition-colors duration-300"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-500">Services</h4>
            <ul className="space-y-2">
              {Object.entries(serviceLinks).map(([name, sectionId]) => (
                <li key={name}>
                  <a 
                    href={`#${sectionId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(sectionId);
                    }}
                    className="text-gray-300 hover:text-orange-500 transition-colors duration-300"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-orange-500">Contact</h4>
            <div className="flex items-center">
              <a 
                href="mailto:lukas@lightning-strategy.com" 
                className="email-link mr-2 transition-transform duration-300 hover:scale-110"
                title="Send us an email"
              >
                <Mail className="h-6 w-6 text-orange-500 hover:text-orange-400" />
              </a>
              <span className="text-gray-300">lukas@lightning-strategy.com</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          © 2025 Lightning Strategy LLC. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;