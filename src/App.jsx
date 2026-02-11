import { useState, useEffect } from 'react'
import './App.css'
import { loadChart } from "./services/chartService"
import PageTransition from "./components/PageTransition";
import { motion } from "framer-motion";

function App() {
  // 🔥 NEW PROGRESS TRACKING STATE
  const [taskProgress, setTaskProgress] = useState({
    portfolio: { completedTasks: 0, totalTasks: 4, unlocked: true },
    dashboard: { completedTasks: 0, totalTasks: 4, unlocked: false },
    video: { completedTasks: 0, totalTasks: 3, unlocked: false }
  });
  
  const [count, setCount] = useState(0)
  const [slideIndex, setSlideIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState('login')
  const [selectedProject, setSelectedProject] = useState(null);

  const slides = [
    {
      title: "Web Development",
      image: "/images/web-dev.png",
      text: "Created responsive websites, dashboards, and interactive web applications using HTML, CSS, JavaScript, React, Flask.",
    },
    {
      title: "Video Editing",
      image: "/images/davinci.png",
      text: "Edited professional videos using DaVinci Resolve, Adobe Premiere.",
    },
    {
      title: "Projects & Achievements",
      image: "/images/other.png",
      text: "Portfolio Website, Dashboards, Short Films, Freelance Projects",
    },
  ];

  const projects = [
    {
      id: "portfolio",
      title: "Portfolio Website",
      description: "Build a personal portfolio using React",
      tasks: ["Design layout", "Build components", "Add animations", "Deploy site"],
    },
    {
      id: "dashboard",
      title: "Student Dashboard",
      description: "Create a dashboard with charts and progress",
      tasks: ["Create progress system", "Render charts", "Persist progress", "Polish UI"],
    },
    {
      id: "video",
      title: "Video Editing Project",
      description: "Edit a short promotional video.",
      tasks: ["Import clips", "Add transitions", "Export final video"]
    }
  ];

  // 🔥 PROGRESS CALCULATIONS
  const totalCompleted = Object.values(taskProgress).reduce((sum, proj) => sum + proj.completedTasks, 0);
  const totalProjectTasks = Object.values(taskProgress).reduce((sum, proj) => sum + proj.totalTasks, 0);
  const overallProgress = totalProjectTasks ? Math.round((totalCompleted / totalProjectTasks) * 100) : 0;

  // 🔥 COMPLETE TASK FUNCTION + UNLOCK SYSTEM
  const completeTask = (projectId, taskIndex) => {
    setTaskProgress(prev => {
      const project = prev[projectId];
      const newCompleted = Math.min(project.completedTasks + 1, project.totalTasks);
      
      let updatedProgress = { 
        ...prev, 
        [projectId]: { ...project, completedTasks: newCompleted } 
      };
      
      // 🔥 UNLOCK NEXT PROJECTS
      if (newCompleted === 4 && projectId === 'portfolio') {
        updatedProgress.dashboard.unlocked = true;
      }
      if (newCompleted === 4 && projectId === 'dashboard') {
        updatedProgress.video.unlocked = true;
      }
      
      return updatedProgress;
    });
  };

  // Functions
  const loginUser = () => setCurrentPage('portfolio');
  const registerUser = () => setCurrentPage('login');
  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setSlideIndex((prev) => prev === 0 ? slides.length - 1 : prev - 1);
  const logout = () => { console.log('Logout clicked'); setCurrentPage('login'); };
  const resetProgress = () => {
    setTaskProgress({
      portfolio: { completedTasks: 0, totalTasks: 4, unlocked: true },
      dashboard: { completedTasks: 0, totalTasks: 4, unlocked: false },
      video: { completedTasks: 0, totalTasks: 3, unlocked: false }
    });
  };

  useEffect(() => {
    if (currentPage === "dashboard") {
      loadChart();
    }
  }, [currentPage]);

  const pageTitles = {
    login: "Welcome Back",
    register: "Create Your Account",
    portfolio: "My Portfolio",
    projects: "Select a Project",
    dashboard: "Project Dashboard",
  };

return (
  <div className="app-bg" style={{ paddingTop: '20px' }}>
    {/* 🔥 HEADER ONLY - Fixed on top */}
    <div className="main-title">
      <div key={currentPage} className="title-animate">
        {currentPage === "login" && <h1>KEVS ORGANIZATION</h1>}
        {currentPage !== "login" && <h2>{pageTitles[currentPage]}</h2>}
        {currentPage !== "login" && (
          <p className="page-subtitle">
            {currentPage === "register" && "Join the workplace today"}
            {currentPage === "portfolio" && "WHO'S THIS GUY?"}
            {currentPage === "projects" && `${overallProgress}% Complete`}
            {currentPage === "dashboard" && "Track progress & performance"}
          </p>
        )}
      </div>
    </div>

    {/* 🔥 ALL CONTENT - Single container with proper spacing */}
      <div className="main-content">
      
      {/* LOGIN PAGE */}
      {currentPage === 'login' && (
        <PageTransition>
          <div className="auth-page">
            <div className="section form">
              <h2>Login</h2>
              <input id="login-username" type="text" placeholder="Username" />
              <input id="login-password" type="password" placeholder="Password" />
              <button className="btnn" onClick={loginUser}>Login</button>
              <div className="signup-text">
                <p>Don't have an account?</p>
                <button onClick={() => setCurrentPage('register')}>Sign up</button>
              </div>
            </div>
          </div>
        </PageTransition>
      )}

      {/* REGISTER PAGE */}
      {currentPage === 'register' && (
        <PageTransition>
          <div className="auth-page">
            <div className="section form">
              <h2>Create Account</h2>
              <input id="reg-username" type="text" placeholder="Username" required />
              <input id="reg-admission" type="text" placeholder="Admission Number" required />
              <input id="reg-email" type="email" placeholder="Email Address" required />
              <input id="reg-password" type="password" placeholder="Password" required />
              <input id="reg-confirm-password" type="password" placeholder="Confirm Password" required />
              <button className="btnn" onClick={registerUser}>Register</button>
              <div className="signup-text">
                <p>Already have an account?</p>
                <button onClick={() => setCurrentPage('login')}>Back to Login</button>
              </div>
            </div>
          </div>
        </PageTransition>
      )}

      {/* PORTFOLIO PAGE - ALL SECTIONS VISIBLE */}
      {currentPage === 'portfolio' && (
        <PageTransition>
          <div className="page-wrapper">
            <div className="page">
              {/* 🔥 HERO SECTION */}
              <motion.section 
                className="hero-section"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div 
                  className="hero-content"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <h1 className="hero-title">Hi, I'm <span className="highlight">Kelvin Maina</span></h1>
                  <p className="hero-subtitle">
                    Web Developer & Video Editor <span className="location">— Nairobi, Kenya</span>
                  </p>
                  <p className="hero-description">
                    I build responsive web applications with React and create engaging video content using DaVinci Resolve. 
                    Blending creativity with clean code to deliver experiences that impress and perform.
                  </p>
                  <div className="hero-buttons">
                    <button className="btnn primary" onClick={() => setCurrentPage('projects')}>
                      🚀 View My Work
                    </button>
                    <button className="btnn secondary" onClick={() => setCurrentPage('contact')}>
                      📩 Contact Me
                    </button>
                  </div>
                </motion.div>
              </motion.section>

              {/* 🔥 ABOUT SECTION */}
              <section className="about-section">
                <div className="about-bg-animation">
                  <div className="floating-shape shape-1"></div>
                  <div className="floating-shape shape-2"></div>
                  <div className="floating-shape shape-3"></div>
                  <div className="floating-shape shape-4"></div>
                </div>
                <motion.h2 
                  className="section-title"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  About Me
                </motion.h2>
                <div className="about-container">
                  {/* LEFT: TEXT CONTENT WITH TYPEWRITER */}
                  <motion.div 
                    className="about-text"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="typewriter-container">
                      <p className="typewriter-text">
                        I'm a <span className="highlight">passionate web developer</span> and <span className="highlight">video editor</span> based in Nairobi.
                      </p>
                      <div className="typewriter-cursor">|</div>
                    </div>
                    <p className="about-para">  
                      I specialize in creating <span className="gradient-text">responsive web applications</span> with React, Vite, and modern JavaScript, 
                      and producing <span className="gradient-text">professional video content</span> using DaVinci Resolve and Adobe Premiere Pro.
                    </p>
                    
                    <p className="about-para">
                      My focus is delivering projects that blend <strong>creativity with performance</strong>, ensuring they look stunning and work flawlessly across all devices.
                    </p>
                  </motion.div>

                  {/* RIGHT: ANIMATED FOCUS + STATS */}
                  <motion.div 
                    className="about-focus"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {/* ANIMATED FOCUS TAGS */}
                    <div className="focus-header">
                      <h3>My Expertise</h3>
                      <div className="focus-line"></div>
                    </div>
                    
                    <div className="focus-grid">
                      <motion.div 
                        className="focus-tag web"
                        whileHover={{ scale: 1.1, y: -5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <span>💻</span>
                        <div>
                          <strong>Web Development</strong>
                          <small>React • Vite • JS</small>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="focus-tag video"
                        whileHover={{ scale: 1.1, y: -5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <span>🎬</span>
                        <div>
                          <strong>Video Editing</strong>
                          <small>DaVinci • Premiere</small>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="focus-tag design"
                        whileHover={{ scale: 1.1, y: -5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <span>🎨</span>
                        <div>
                          <strong>UI/UX Design</strong>
                          <small>Figma • Motion</small>
                        </div>
                      </motion.div>
                    </div>

                    {/* ANIMATED STATS */}
                    <div className="stats-grid">
                      <motion.div 
                        className="stat-item"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="stat-number">50+</div>
                        <div className="stat-label">Projects</div>
                      </motion.div>
                      <motion.div 
                        className="stat-item"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 }}
                      >
                        <div className="stat-number">2+</div>
                        <div className="stat-label">Years Exp</div>
                      </motion.div>
                      <motion.div 
                        className="stat-item"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                      >
                        <div className="stat-number">100%</div>
                        <div className="stat-label">Client Sat</div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </section>


                {/* 🔥 2. SKILLS SECTION */}
                <section className="skills-section">
                  <motion.h2 
                    className="section-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    My Skills
                  </motion.h2>
                  <div className="skills-grid">
                    <motion.div 
                      className="skill-category"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3>💻 Web Development</h3>
                      <ul>
                        <li>HTML5</li>
                        <li>CSS3</li>
                        <li>JavaScript (ES6+)</li>
                        <li>React</li>
                        <li>Vite</li>
                        <li>Git & GitHub</li>
                        <li>Tailwind CSS</li>
                      </ul>
                    </motion.div>
                    <motion.div 
                      className="skill-category"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3>🎬 Video Editing</h3>
                      <ul>
                        <li>DaVinci Resolve</li>
                        <li>Adobe Premiere Pro</li>
                        <li>After Effects</li>
                        <li>Color Grading</li>
                        <li>Motion Graphics</li>
                      </ul>
                    </motion.div>
                    <motion.div 
                      className="skill-category"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3>🎨 Design</h3>
                      <ul>
                        <li>Figma</li>
                        <li>UI/UX Design</li>
                        <li>Responsive Design</li>
                        <li>Prototyping</li>
                        <li>Branding</li>
                      </ul>
                    </motion.div>
                  </div>
                </section>

                {/* 🔥 3. PROJECTS PREVIEW */}
                <section className="projects-preview">
                  <motion.h2 
                    className="section-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    Featured Projects
                  </motion.h2>
                  <p className="section-subtitle">Interactive project system with progress tracking</p>
                  <div className="projects-preview-grid">
                    {projects.slice(0, 2).map((project, index) => (
                      <motion.div
                        key={project.id}
                        className="project-preview-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05, y: -10 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="project-preview-image" style={{ 
                          backgroundImage: `url(${index === 0 ? '/images/kevs1.jpeg' : '/images/kevs2.jpeg'})`
                        }}></div>
                        <div className="project-preview-content">
                          <h3>{project.title}</h3>
                          <p>{project.description}</p>
                          <div className="project-tech">
                            <span>React</span>
                            <span>Vite</span>
                            <span>Framer Motion</span>
                          </div>
                          <button className="btnn small" onClick={() => setCurrentPage('projects')}>
                            View All Projects →
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* 🔥 6. RESUME DOWNLOAD */}
                <section className="resume-section">
                  <motion.div 
                    className="resume-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    viewport={{ once: true }}
                  >
                    <h3>📄 Get My Resume</h3>
                    <p>Ready to see my full experience and projects?</p>
                    <a href="KELVIN MAINA's RESUME.pdf" download className="btnn primary large">
                      Download Resume
                    </a>
                  </motion.div>
                </section>

                {/* 🔥 CTA SECTION */}
                <section className="cta-section">
                  <motion.div 
                    className="cta-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2>Ready to Work Together?</h2>
                    <p>Whether you need a website, video editing, or both—let's create something amazing.</p>
                    <div className="cta-buttons">
                      <button className="btnn primary" onClick={() => setCurrentPage('projects')}>
                        🚀 Start a Project
                      </button>
                      <button className="btnn secondary" onClick={() => document.getElementById('contact')?.scrollIntoView()}>
                        📩 Get In Touch
                      </button>
                    </div>
                  </motion.div>
                </section>

                {/* Navigation buttons (keep existing) */}
                <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button className="btnn danger" onClick={() => setCurrentPage('login')}>← Go Back</button>
                  <button className="btnn" onClick={() => setCurrentPage('projects')}>View All Projects</button>
                </div>
              </div>

              {/* 🔥 5. ENHANCED CONTACT SECTION */}
              <div className="contact-section" id="contact">
                <div className="section">
                  <h2 className="section-title">Connect With Me</h2>
                  <div className="contact-grid">
                    <div className="contact-info">
                    
                      <div className="contact-item">
                        <span>📧</span>
                        <a href="mailto:km542754@gmail.com">km542754@gmail.com</a>
                      </div>
                      <div className="contact-item">
                        <span>📞</span>
                        <a href="tel:0111869298">0111869298</a>
                      </div>
                      <div className="contact-item">
                        <span>📍</span>
                        Nairobi, Kenya
                      </div>
                      
                    </div>
                    <h3>Let's Talk</h3>
                    <div className="contact-form">
                      <h3>Send a Message</h3>
                      <div className="form-group">
                        <input type="text" placeholder="Your Name" />
                        <input type="email" placeholder="Your Email" />
                        <textarea placeholder="Lets get some gig done..." rows={5}></textarea>
                        <button className="btnn primary">Send Message</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PageTransition>
        )}


        {/* 🔥 PROJECTS PAGE WITH PROGRESS + LOCKS */}
        {currentPage === 'projects' && (
          <PageTransition>
            <div className="page">
            <div className="section" style={{ marginTop: '2rem' }}></div>
              <div className="page">
                <div className="section">
                  <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    Select a Project
                  </motion.h2>
                  <p>Complete projects in order to unlock the next ones!</p>

                  {/* 🔥 WORKING OVERALL PROGRESS BAR */}
                  <div className="progress-wrapper">
                    <div className="progress-text">
                      {overallProgress}% Complete ({totalCompleted}/{totalProjectTasks} tasks)
                    </div>
                    <div className="progress-bar">
                      <motion.div 
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${overallProgress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* 🔥 ANIMATED PROJECT CARDS WITH PROGRESS + LOCKS */}
                  <motion.div 
                    className="projects-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                      hidden: { transition: { staggerChildren: 0.1 } },
                      visible: { transition: { staggerChildren: 0.2 } }
                    }}
                  >
                    {projects.map((project, index) => {
                      const progress = taskProgress[project.id];
                      const bgImages = ['/images/kevs1.jpeg', '/images/kevs2.jpeg', '/images/davinci.png'];
                      
                      return (
                        <motion.div
                          key={project.id}
                          className={`project-card ${!progress.unlocked ? 'locked' : ''}`}
                          variants={{
                            hidden: { opacity: 0, y: 60, rotateX: 25 },
                            visible: { opacity: 1, y: 0, rotateX: 0 }
                          }}
                          whileHover={progress.unlocked ? {
                            scale: 1.07, y: -15, rotateX: 8, rotateY: 8,
                            backgroundPosition: "center 25%",
                            boxShadow: "0 50px 100px rgba(0,0,0,0.5)",
                            transition: { duration: 0.7 }
                          } : {}}
                          whileTap={progress.unlocked ? { scale: 0.94 } : {}}
                          style={{
                            backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.05)),
                                              url(${bgImages[index] || '/images/kevs1.jpeg'})`,
                            backgroundSize: "135% 135%",
                            backgroundPosition: "center center",
                            height: "280px",
                            display: "flex",
                            flexDirection: "column"
                          }}
                          onClick={() => {
                            if (progress.unlocked && selectedProject?.id !== project.id) {
                              setSelectedProject({ ...project, progress });
                              setCurrentPage("dashboard");
                            }
                          }}
                        >
                          {/* 🔥 LOCK OVERLAY */}
                          {!progress.unlocked && (
                            <div className="lock-overlay">
                              <span>🔒 LOCKED</span>
                              <small>{index === 1 ? 'Complete Portfolio first' : 'Complete Dashboard first'}</small>
                            </div>
                          )}

                          {/* ✨ FLOATING PARTICLES */}
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={`particle-${i}`}
                              className="particle"
                              style={{ left: `${20 + i * 15}%` }}
                              animate={{ 
                                y: [-10, 10, -10],
                                opacity: [0.3, 0.8, 0.3],
                                scale: [0.6, 1.1, 0.6]
                              }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                          ))}
                          
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", zIndex: 2, padding: '1.5rem' }}>
                            <h3>{project.title}</h3>
                            
                            {/* 🔥 MINI PROGRESS BAR PER PROJECT */}
                            <div className="mini-progress" style={{ margin: '1rem 0' }}>
                              <div className="mini-progress-bar">
                                <motion.div 
                                  className="mini-progress-fill"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(progress.completedTasks / progress.totalTasks) * 100}%` }}
                                  transition={{ duration: 0.6 }}
                                />
                              </div>
                              <small style={{ color: '#666', fontSize: '0.8rem' }}>
                                {progress.completedTasks}/{progress.totalTasks} tasks
                              </small>
                            </div>
                            
                            <p style={{ flex: 1, fontSize: '0.95rem' }}>{project.description}</p>
                            <div style={{ marginTop: 'auto' }}>
                              {progress.unlocked ? (
                                <button className="btnn">Start Project</button>
                              ) : (
                                <button className="btnn danger" disabled>🔒 Locked</button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
                    <button className="btnn" onClick={logout}>Logout</button>
                    <button className="btnn danger" onClick={resetProgress}>Reset All Progress</button>
                    <button className="btnn danger" onClick={() => setCurrentPage('portfolio')}>← Back</button>
                  </div>
                </div>

                <div className="contact-info">
                  <h3>Connect with Me</h3>
                  <div className="social-links">
                    <a href="https://www.linkedin.com/in/kelvin-maina-a5a239354/" target="_blank" className="linkedin">
                      <i className="fab fa-linkedin fa-3x"></i>
                    </a>
                    <a href="https://www.youtube.com/channel/UC2rwBP9myu5fwqogxrQgQNg" target="_blank" className="youtube">
                      <i className="fab fa-youtube fa-3x"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </PageTransition>
        )}

        {/* 🔥 TASK DASHBOARD */}
        {currentPage === 'dashboard' && selectedProject && (
          <PageTransition>
            <div className="page">
              <div className="section">
                <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                  {selectedProject.title}
                </motion.h2>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <div>
                    <strong>Progress:</strong> {taskProgress[selectedProject.id].completedTasks}/{taskProgress[selectedProject.id].totalTasks}
                  </div>
                  <div className="mini-progress">
                    <div className="mini-progress-bar" style={{ height: '8px' }}>
                      <motion.div 
                        className="mini-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${(taskProgress[selectedProject.id].completedTasks / taskProgress[selectedProject.id].totalTasks) * 100}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                </div>

                {/* 🔥 CLICKABLE TASK LIST */}
                <div className="task-section">
                  <h3>Complete These Tasks:</h3>
                  <div className="task-list">
                    {selectedProject.tasks.map((task, index) => (
                      <motion.div
                        key={index}
                        className={`task-item ${taskProgress[selectedProject.id].completedTasks > index ? 'completed' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => taskProgress[selectedProject.id].completedTasks <= index && 
                                   completeTask(selectedProject.id, index)}
                        style={{ cursor: taskProgress[selectedProject.id].completedTasks > index ? 'default' : 'pointer' }}
                      >
                        <span>{taskProgress[selectedProject.id].completedTasks > index ? '✅' : '⭕'} {task}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  {taskProgress[selectedProject.id].completedTasks === taskProgress[selectedProject.id].totalTasks && (
                    <motion.div 
                      className="completion-banner"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      🎉 PROJECT COMPLETE! Next project unlocked!
                    </motion.div>
                  )}
                </div>

                <div className="dashboard-actions" style={{ marginTop: '2rem' }}>
                  <button className="btnn" onClick={() => setCurrentPage('projects')}>← Back to Projects</button>
                  <button className="btnn danger" onClick={logout}>Logout</button>
                </div>
              </div>
            </div>
          </PageTransition>
        )}

        {/* OLD DASHBOARD (fallback) */}
        {currentPage === 'dashboard' && !selectedProject && (
          <PageTransition>
            <div className="page">
              <div className="main-content">
                <div className="dashboard">
                  <div className="dashboard-stats">
                    <div className="stat-card">
                      <h3>Total Progress</h3>
                      <p>{overallProgress}%</p>
                    </div>
                    <div className="stat-card">
                      <h3>Tasks Done</h3>
                      <p>{totalCompleted}/{totalProjectTasks}</p>
                    </div>
                  </div>
                  <div className="dashboard-actions">
                    <button className="btnn" onClick={() => setCurrentPage('projects')}>View Projects</button>
                  </div>
                </div>
              </div>
            </div>
          </PageTransition>
        )}
      </div>

      <footer className="site-footer">
        <p>© 2026 <strong>Kelvin Maina</strong> | KEVS Organization</p>
        <p>
          📧 Email: <a href="mailto:km542754@gmail.com">km542754@gmail.com</a> |
          📞 Phone: <a href="tel:0111869298">0111869298</a> |
          📍 Nairobi, Kenya
        </p>
      </footer>
    </div>
  )
}

export default App
