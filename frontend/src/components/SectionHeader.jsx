export default function SectionHeader({ eyebrow, title, description, count }) {
  return <div className="section-title"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{description && <p className="results-subtitle">{description}</p>}</div>{count !== undefined && <span className="results-count">{count}</span>}</div>;
}
