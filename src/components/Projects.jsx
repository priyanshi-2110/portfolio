import { useState, useEffect } from 'react';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';
import RepoCard from './RepoCard';
import './Projects.css';

// ── GitHub username (edit this to change the profile fetched) ──────────────
const GITHUB_USERNAME = 'priyanshi-2110';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;

// ── Static "Featured Projects" data ──────────────────────────────────────────
const defaultProjects = [
  {
    title: 'AI API Integration',
    subtitle: 'Practical 13 · AI & API Integration',
    stack: 'JavaScript, Gemini API',
    language: 'JavaScript',
    stars: 0,
    forks: 0,
    points: [
      'Integrated Google Gemini AI API for intelligent real-time responses',
      'Built a clean interface to send prompts and display AI-generated output',
      'Handled API authentication, error states, and response parsing',
    ],
    github: 'https://github.com/priyanshi-2110/Practical-13-AI-API-Integration',
  },
  {
    title: 'Full Stack Integration',
    subtitle: 'Practical 6 · Full-Stack Web Application',
    stack: 'React (Vite), Node.js, Express.js, MongoDB',
    language: 'JavaScript',
    stars: 0,
    forks: 0,
    points: [
      'Full-stack CRUD app connecting React frontend with Express + MongoDB REST API backend',
      'Implemented Axios for async data fetching with loading spinner and error handling',
      'Complete CRUD operations with persistent MongoDB storage',
    ],
    github: 'https://github.com/priyanshi-2110/Practical-6-full-stack-integration',
  },
  {
    title: 'Recommendation Engine',
    subtitle: 'Data Science & Machine Learning',
    stack: 'Python, Jupyter Notebook, scikit-learn',
    language: 'Jupyter Notebook',
    stars: 0,
    forks: 0,
    points: [
      'Built a recommendation engine using collaborative and content-based filtering',
      'Explored and cleaned datasets, applied ML algorithms for personalized recommendations',
      'Documented findings and model evaluation in a Jupyter Notebook',
    ],
    github: 'https://github.com/priyanshi-2110/Recommandation_engine',
  },
  {
    title: 'Docker Containerization',
    subtitle: 'Practical 11 · DevOps',
    stack: 'JavaScript, Docker, Docker Compose',
    language: 'JavaScript',
    stars: 0,
    forks: 0,
    points: [
      'Containerized a full-stack JavaScript application using Docker',
      'Wrote Dockerfile and docker-compose.yml for multi-service orchestration',
      'Achieved consistent environment across development and production',
    ],
    github: 'https://github.com/priyanshi-2110/Practical-11-Docker-Containerization',
  },
  {
    title: 'Kadamdhara Landscape',
    subtitle: 'Frontend Web Project',
    stack: 'HTML, CSS',
    language: 'HTML',
    stars: 0,
    forks: 0,
    points: [
      'Designed and built a responsive static website for a landscape/nature theme',
      'Applied modern CSS layout techniques for an aesthetic, mobile-friendly design',
    ],
    github: 'https://github.com/priyanshi-2110/Kadamdhara-landscape',
  },
  {
    title: 'Task Manager API',
    subtitle: 'Backend API',
    stack: 'Node.js, Express.js, JavaScript',
    language: 'JavaScript',
    stars: 0,
    forks: 0,
    points: [
      'Built a RESTful Task Manager API with full CRUD operations',
      'Implemented request validation, error handling middleware, and clean route architecture',
    ],
    github: 'https://github.com/priyanshi-2110/task-manager-api',
  },
  {
    title: 'Amazon Data Engineering Lifecycle',
    subtitle: 'Data Engineering',
    stack: 'Data Engineering, Cloud',
    language: null,
    stars: 0,
    forks: 0,
    points: [
      'Explored the full data engineering lifecycle using Amazon as a case study',
      'Covered data ingestion, storage, transformation, and consumption stages',
    ],
    github: 'https://github.com/priyanshi-2110/Amazon-Data-Engineering-Lifecycle',
  },
  {
    title: 'Java Submission & Self Study',
    subtitle: 'Academic & Self-Learning',
    stack: 'Java',
    language: 'Java',
    stars: 0,
    forks: 0,
    points: [
      'Collection of Java programs covering OOP, data structures, and algorithms',
      'Includes academic submissions and self-study exercises to strengthen Java fundamentals',
    ],
    github: 'https://github.com/priyanshi-2110/Java_Submission',
  },
];

// ── Static ProjectCard ────────────────────────────────────────────────────────
function ProjectCard({ project }) {
  const stackItems =
    project.stack && project.stack !== '—'
      ? project.stack.split(',').map((s) => s.trim())
      : [];

  return (
    <div className="project-card">
      <div className="project-card-header">
        <span className="project-icon">📁</span>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="project-github-link"
            title="View on GitHub"
          >
            ⟶
          </a>
        )}
      </div>

      <h3 className="project-title">{project.title}</h3>
      {project.subtitle && <span className="project-subtitle">{project.subtitle}</span>}

      {stackItems.length > 0 && (
        <div className="project-stack">
          {stackItems.map((tech, i) => (
            <span className="project-stack-tag" key={i}>
              {tech}
            </span>
          ))}
        </div>
      )}

      {project.points && (
        <ul className="project-points">
          {project.points.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      )}

      {/* Stats row — stars, forks, language */}
      <div className="project-stats-row">
        {typeof project.stars === 'number' && (
          <span className="stat-badge star-badge" title="Stars">
            <span className="star-icon">⭐</span>
            <span className="stat-count">{project.stars}</span>
          </span>
        )}
        {typeof project.forks === 'number' && (
          <span className="stat-badge fork-badge" title="Forks">
            <span className="fork-icon">🍴</span>
            <span className="stat-count">{project.forks}</span>
          </span>
        )}
        {project.language && (
          <span className="project-language-tag">
            <span className="lang-dot"></span>
            {project.language}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main Projects component ─────────────────────────────────────────────────
export default function Projects({ projects = defaultProjects }) {
  const displayProjects = projects && projects.length > 0 ? projects : defaultProjects;

  // ── State variables (Requirements 1) ──────────────────────────────────────
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // fetchTrigger starts at 0 → effect runs on mount.
  // Incrementing it (via retry) re-runs the effect without putting fetch in
  // the component body, satisfying Requirement 8.
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // ── useEffect with fetch (Requirements 2, 8) ───────────────────────────────
  useEffect(() => {
    // Reset state before each fetch attempt
    setLoading(true);
    setError(null);

    fetch(GITHUB_API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`GitHub API error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => setRepos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [fetchTrigger]); // eslint-disable-line react-hooks/exhaustive-deps
  // fetchTrigger = 0 on mount → behaves like [], re-runs only on retry

  // ── Client-side search filter (Requirement 7) ──────────────────────────────
  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Retry handler for ErrorMessage (Requirement 6) ─────────────────────────
  const handleRetry = () => setFetchTrigger((n) => n + 1);

  return (
    <section className="projects section" id="projects">
      <div className="container">

        {/* ── Section 1: Static Featured Projects ────────────────────────── */}
        <div className="projects-header">
          <h2 className="section-title">
            Featured <span className="highlight">Projects</span>
          </h2>
          <p className="projects-subtitle">
            A showcase of my recent academic, personal, and open-source software projects
          </p>
        </div>

        <div className="projects-grid">
          {displayProjects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </div>

        {/* ── Section 2: Live GitHub Repositories (Requirements 3–7) ─────── */}
        <div className="github-repos-section">
          <div className="github-repos-header">
            <h2 className="section-title">
              GitHub <span className="highlight">Repositories</span>
            </h2>
            <p className="projects-subtitle">
              Live feed from{' '}
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="github-profile-link"
              >
                @{GITHUB_USERNAME}
              </a>{' '}
              via GitHub REST API
            </p>
          </div>

          {/* Search input — always visible, disabled while loading (Requirement 7) */}
          <div className="repos-search-wrapper">
            <span className="repos-search-icon" aria-hidden="true">🔍</span>
            <input
              id="repo-search-input"
              type="search"
              className="repos-search-input"
              placeholder="Filter repositories by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={loading || !!error}
              aria-label="Filter repositories by name"
            />
            {!loading && !error && (
              <span className="repos-count">
                {filteredRepos.length} / {repos.length} repos
              </span>
            )}
          </div>

          {/* Requirement 3: Spinner while loading */}
          {loading && <Spinner message="Fetching repositories from GitHub…" />}

          {/* Requirement 4 & 6: ErrorMessage with retry button */}
          {!loading && error && (
            <ErrorMessage message={error} onRetry={handleRetry} />
          )}

          {/* Requirement 5: Repo cards on success */}
          {!loading && !error && (
            <>
              {filteredRepos.length > 0 ? (
                <div className="repos-grid">
                  {filteredRepos.map((repo) => (
                    <RepoCard key={repo.id} repo={repo} />
                  ))}
                </div>
              ) : (
                <p className="repos-empty">
                  No repositories match &ldquo;{search}&rdquo;. Try a different search term.
                </p>
              )}
            </>
          )}
        </div>

      </div>
    </section>
  );
}
