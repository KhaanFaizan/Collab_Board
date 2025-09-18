import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const animateCounters = () => {
      const counters = document.querySelectorAll('.stat-number');
      counters.forEach((counter, index) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        // Determine which stats should have "+" symbol
        const shouldAddPlus = index !== 2; // All except "Uptime %" (index 2)
        
        const updateCounter = () => {
          if (current < target) {
            current += increment;
            const displayValue = Math.ceil(current).toLocaleString();
            counter.textContent = shouldAddPlus ? `${displayValue}+` : displayValue;
            requestAnimationFrame(updateCounter);
          } else {
            const finalValue = target.toLocaleString();
            counter.textContent = shouldAddPlus ? `${finalValue}+` : finalValue;
          }
        };
        
        updateCounter();
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          setStatsAnimated(true);
          setTimeout(animateCounters, 500);
        }
      });
    });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => {
      if (statsSection) {
        observer.unobserve(statsSection);
      }
    };
  }, [statsAnimated]);

  const features = [
    {
      icon: 'fas fa-project-diagram',
      title: 'Project Management',
      description: 'Organize and track your projects with ease. Create, assign, and monitor project progress in real-time.'
    },
    {
      icon: 'fas fa-tasks',
      title: 'Task Management',
      description: 'Break down projects into manageable tasks. Set deadlines, assign team members, and track completion.'
    },
    {
      icon: 'fas fa-users',
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team. Share files, communicate, and coordinate efforts effectively.'
    },
    {
      icon: 'fas fa-calendar',
      title: 'Calendar Integration',
      description: 'Keep track of deadlines and milestones with our integrated calendar system.'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className={`hero-section ${isVisible ? 'visible' : ''}`}>
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
            <div className="shape shape-5"></div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="brand-name">CollabBoard</span>
            </h1>
            <p className="hero-subtitle">
              The ultimate collaboration platform for modern teams. 
              Streamline your projects, boost productivity, and achieve your goals together.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                <i className="fas fa-rocket"></i>
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </Link>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="preview-title">CollabBoard Dashboard</div>
              </div>
              <div className="preview-content">
                <div className="preview-stats">
                  <div className="preview-stat">
                    <div className="stat-icon projects"></div>
                    <div className="stat-info">
                      <div className="stat-number">12</div>
                      <div className="stat-label">Projects</div>
                    </div>
                  </div>
                  <div className="preview-stat">
                    <div className="stat-icon tasks"></div>
                    <div className="stat-info">
                      <div className="stat-number">48</div>
                      <div className="stat-label">Tasks</div>
                    </div>
                  </div>
                  <div className="preview-stat">
                    <div className="stat-icon team"></div>
                    <div className="stat-info">
                      <div className="stat-number">8</div>
                      <div className="stat-label">Team</div>
                    </div>
                  </div>
                </div>
                <div className="preview-projects">
                  <div className="preview-project">
                    <div className="project-bar"></div>
                    <div className="project-info">
                      <div className="project-name">Website Redesign</div>
                      <div className="project-progress">75% Complete</div>
                    </div>
                  </div>
                  <div className="preview-project">
                    <div className="project-bar"></div>
                    <div className="project-info">
                      <div className="project-name">Mobile App</div>
                      <div className="project-progress">45% Complete</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number" data-target="10000">0</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-target="50000">0</div>
              <div className="stat-label">Projects Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-target="99">0</div>
              <div className="stat-label">Uptime %</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-target="150">0</div>
              <div className="stat-label">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose CollabBoard?</h2>
            <p>Powerful features designed to enhance your team's productivity and collaboration</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card ${currentFeature === index ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="feature-icon">
                  <i className={feature.icon}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Join thousands of satisfied teams who trust CollabBoard</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p>"CollabBoard transformed how our team manages projects. The interface is intuitive and the collaboration features are outstanding."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <span>Project Manager, TechCorp</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p>"The task management system is incredibly powerful. We've seen a 40% increase in productivity since switching to CollabBoard."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Michael Chen</h4>
                  <span>CEO, StartupXYZ</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p>"Best collaboration tool we've ever used. The real-time updates and team coordination features are game-changers."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>Emily Rodriguez</h4>
                  <span>Team Lead, DesignStudio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2>Simple, Transparent Pricing</h2>
            <p>Choose the plan that fits your team's needs</p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Starter</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">0</span>
                  <span className="period">/month</span>
                </div>
                <p>Perfect for small teams getting started</p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> Up to 5 projects</li>
                  <li><i className="fas fa-check"></i> 3 team members</li>
                  <li><i className="fas fa-check"></i> Basic task management</li>
                  <li><i className="fas fa-check"></i> Email support</li>
                </ul>
              </div>
              <Link to="/register" className="btn btn-outline btn-large">
                Get Started Free
              </Link>
            </div>

            <div className="pricing-card featured">
              <div className="popular-badge">Most Popular</div>
              <div className="pricing-header">
                <h3>Professional</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">12</span>
                  <span className="period">/month</span>
                </div>
                <p>Ideal for growing teams and businesses</p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> Unlimited projects</li>
                  <li><i className="fas fa-check"></i> Up to 25 team members</li>
                  <li><i className="fas fa-check"></i> Advanced analytics</li>
                  <li><i className="fas fa-check"></i> Priority support</li>
                  <li><i className="fas fa-check"></i> Calendar integration</li>
                </ul>
              </div>
              <Link to="/register" className="btn btn-primary btn-large">
                Start Free Trial
              </Link>
            </div>

            <div className="pricing-card">
              <div className="pricing-header">
                <h3>Enterprise</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">29</span>
                  <span className="period">/month</span>
                </div>
                <p>For large organizations with advanced needs</p>
              </div>
              <div className="pricing-features">
                <ul>
                  <li><i className="fas fa-check"></i> Everything in Professional</li>
                  <li><i className="fas fa-check"></i> Unlimited team members</li>
                  <li><i className="fas fa-check"></i> Custom integrations</li>
                  <li><i className="fas fa-check"></i> 24/7 phone support</li>
                  <li><i className="fas fa-check"></i> Advanced security</li>
                </ul>
              </div>
              <Link to="/register" className="btn btn-outline btn-large">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Team's Productivity?</h2>
            <p>Join thousands of teams already using CollabBoard to achieve their goals</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                <i className="fas fa-rocket"></i>
                Start Your Free Trial
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                <i className="fas fa-sign-in-alt"></i>
                Sign In to Your Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>CollabBoard</h3>
              <p>Empowering teams to collaborate and achieve greatness together.</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <ul>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#integrations">Integrations</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#about">About</a></li>
                  <li><a href="#careers">Careers</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <ul>
                  <li><a href="#help">Help Center</a></li>
                  <li><a href="#docs">Documentation</a></li>
                  <li><a href="#community">Community</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 CollabBoard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
