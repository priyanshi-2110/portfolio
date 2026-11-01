import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import DigitalMindscape from './components/DigitalMindscape';
import Loading from './components/Loading';
import './App.css';

// Lazy-loaded route components for Practical 8
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));
const TaskManager = lazy(() => import('./components/TaskManager'));

// ——— Data passed as props ———
const name = 'Priyanshi Padshala';
const role = 'Information Technology Student | DSML Intern';
const themeColor = '#6366F1';

const skillList = [
  'HTML & CSS',
  'JavaScript',
  'React',
  'Python',
  'Java',
  'MongoDB',
  'Git & GitHub',
  'SQL',
];

const projects = [
  {
    title: 'AI API Integration',
    subtitle: 'Practical 13 · AI & API Integration',
    stack: 'JavaScript, Gemini API',
    points: [
      'Integrated Google Gemini AI API into a web application for intelligent responses',
      'Built a clean interface to send prompts and display AI-generated output in real time',
      'Handled API authentication, error states, and response parsing',
    ],
    github: 'https://github.com/priyanshi-2110/Practical-13-AI-API-Integration',
  },
  {
    title: 'GitHub Actions CI Pipeline',
    subtitle: 'Practical 12 · DevOps & CI/CD',
    stack: 'JavaScript, GitHub Actions, YAML',
    points: [
      'Configured a GitHub Actions CI/CD pipeline for automated testing and deployment',
      'Defined workflow YAML for lint, test, and build stages triggered on push/PR',
      'Demonstrates DevOps best practices for continuous integration',
    ],
    github: 'https://github.com/priyanshi-2110/Practical-12-GitHub-Actions-CI-pipeline',
  },
  {
    title: 'Docker Containerization',
    subtitle: 'Practical 11 · DevOps',
    stack: 'JavaScript, Docker, Docker Compose',
    points: [
      'Containerized a full-stack JavaScript application using Docker',
      'Wrote a Dockerfile and docker-compose.yml for multi-service orchestration',
      'Achieved consistent environment across development and production',
    ],
    github: 'https://github.com/priyanshi-2110/Practical-11-Docker-Containerization',
  },
  {
    title: 'Full Stack Integration',
    subtitle: 'Practical 6 · Full-Stack Web Application',
    stack: 'React (Vite), Node.js, Express.js, MongoDB',
    points: [
      'Full-stack CRUD app connecting React frontend with an Express + MongoDB REST API backend',
      'Implemented Axios for async data fetching with loading spinner and error handling',
      'Complete CRUD: create, read, update, and delete operations with persistent MongoDB storage',
    ],
    github: 'https://github.com/priyanshi-2110/Practical-6-full-stack-integration',
  },
  {
    title: 'Recommendation Engine',
    subtitle: 'Data Science & Machine Learning',
    stack: 'Python, Jupyter Notebook, scikit-learn',
    points: [
      'Built a recommendation engine using collaborative and content-based filtering techniques',
      'Explored and cleaned datasets, applied ML algorithms to generate personalized recommendations',
      'Documented findings and model evaluation in a Jupyter Notebook',
    ],
    github: 'https://github.com/priyanshi-2110/Recommandation_engine',
  },
  {
    title: 'Tiny Court',
    subtitle: 'Personal Project',
    stack: 'Python',
    points: [
      'Developed a Python-based application for court/game management logic',
      'Implemented core features for scheduling and tracking',
    ],
    github: 'https://github.com/priyanshi-2110/tiny_court',
  },
  {
    title: 'Kadamdhara Landscape',
    subtitle: 'Frontend Web Project',
    stack: 'HTML, CSS',
    points: [
      'Designed and built a responsive static website for a landscape/nature theme',
      'Applied modern CSS layout techniques for an aesthetic and mobile-friendly design',
    ],
    github: 'https://github.com/priyanshi-2110/Kadamdhara-landscape',
  },
  {
    title: 'Amazon Data Engineering Lifecycle',
    subtitle: 'Data Engineering',
    stack: 'Data Engineering, Cloud',
    points: [
      'Explored and documented the full data engineering lifecycle using Amazon as a case study',
      'Covered data ingestion, storage, transformation, and consumption stages',
    ],
    github: 'https://github.com/priyanshi-2110/Amazon-Data-Engineering-Lifecycle',
  },
  {
    title: 'Task Manager API',
    subtitle: 'Backend API',
    stack: 'Node.js, Express.js, JavaScript',
    points: [
      'Built a RESTful Task Manager API with full CRUD operations',
      'Implemented request validation, error handling middleware, and clean route architecture',
    ],
    github: 'https://github.com/priyanshi-2110/task-manager-api',
  },
  {
    title: 'Java Submission & Self Study',
    subtitle: 'Academic & Self-Learning',
    stack: 'Java',
    points: [
      'Collection of Java programs covering core concepts: OOP, data structures, and algorithms',
      'Includes academic submissions and self-study exercises to strengthen Java fundamentals',
    ],
    github: 'https://github.com/priyanshi-2110/Java_Submission',
  },
];

const contactInfo = {
  name: 'Priyanshi Padshala',
  email: 'padshalapriyanshi21@gmail.com',
  github: 'https://github.com/priyanshi-2110',
  linkedin: 'https://www.linkedin.com/in/priyanshi-padshala',
};

export default function App() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  const toggleDarkMode = () => {
    setIsLightMode(!isLightMode);
  };

  return (
    <>
      <DigitalMindscape />
      <Navbar isLightMode={isLightMode} toggleDarkMode={toggleDarkMode} />
      <Suspense fallback={<Loading message="Loading page..." />}>
        <Routes>
          <Route path="/" element={
            <>
              <Header name={name} role={role} themeColor={themeColor} />
              <About />
              <Skills skillList={skillList} />
            </>
          } />
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="/task-manager" element={<TaskManager />} />
          <Route path="/projects" element={<Projects projects={projects} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer contactInfo={contactInfo} />
    </>
  );
}