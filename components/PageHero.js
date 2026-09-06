import HeroField from './HeroField';

export default function PageHero({ division, title, lede, meta, fieldId = 'ph', aside }) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg" aria-hidden="true">
        <HeroField id={fieldId} />
      </div>
      <div className={`shell page-hero-in${aside ? ' page-hero-split' : ''}`}>
        <div>
          <p className="label crumb reveal">
            {division} <span>/</span> Second Spark Intelligence
          </p>
          <h1 className="reveal reveal-d1">{title}</h1>
          <p className="lede reveal reveal-d2">{lede}</p>
          {meta && (
            <p className="label reveal reveal-d3" style={{ marginTop: 26 }}>
              {meta}
            </p>
          )}
        </div>
        {aside && (
          <div className="page-hero-aside reveal reveal-d2">{aside}</div>
        )}
      </div>
    </section>
  );
}
