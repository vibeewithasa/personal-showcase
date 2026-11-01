import { useState } from 'react';
import { portfolio, type PortfolioContent } from '../content/portfolio';
import Project from '../components/Project';
export default function Portfolio({
  content = portfolio,
}: {
  content?: PortfolioContent;
}) {
  const [category, setCategory] = useState('All');
  const projects = content.projects.filter(
    (p) => category === 'All' || p.category === category,
  );
  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">The portfolio</p>
        <h1>
          Selected work<span className="period">.</span>
        </h1>
        <p className="body-copy">A collection of projects by {content.name}.</p>
      </div>
      {content.categories.length > 0 && (
        <div className="filters" role="group" aria-label="Filter projects">
          {['All', ...content.categories].map((c) => (
            <button
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              key={c}
            >
              {c}
            </button>
          ))}
        </div>
      )}
      <div className="portfolio-grid">
        {projects.map((p, i) => (
          <Project
            key={p.slug}
            project={p}
            index={i}
            sizes="(max-width: 700px) 90vw, 45vw"
          />
        ))}
      </div>
      {!projects.length && (
        <p className="empty-state">
          No projects in this collection yet. Choose another category.
        </p>
      )}
    </>
  );
}
