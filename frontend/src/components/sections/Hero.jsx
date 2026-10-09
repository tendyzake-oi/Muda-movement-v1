import { hero } from '../../data/content'
import Button from '../ui/Button'
import './Hero.css'
import Picture from '../../../Assets/People.png'

/** Ilustrasi kartu di sisi kanan hero — murni CSS/SVG, tanpa gambar. */
function HeroVisual() {
  return (
    <div className="hero-visual">
      <div className="hero-visual__stage">
        <span className="hero-visual__plate" aria-hidden="true" />

        <figure className="hero-visual__photo-card">
          <img
            src={Picture}
            alt="Identitas Muda Movement di kantor pusat"
          />
          <figcaption>
            <span>LEARNING · DEVELOPING · EMPOWERING</span>
            <strong>Membantu Anak Muda Temukan Versi Terbaiknya</strong>
          </figcaption>
        </figure>
      </div>
    </div>
  )
}

export default function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      {/* Dekorasi latar */}
      <span className="hero__deco hero__deco--ring" aria-hidden="true" />
      <span className="hero__deco hero__deco--sun" aria-hidden="true" />
      <span className="hero__deco hero__deco--dot" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="hero__badge">
            <span className="hero__badge-dot" />
            {hero.badge}
          </p>
          <h1 id="hero-title" className="hero__title">
            <span>MUDA</span>
            <span className="hero__title-sub">movement</span>
          </h1>
          <p className="hero__desc">{hero.description}</p>

          <ul className="hero__stats" aria-label="Muda Movement dalam angka">
            {hero.stats.map((stat) => (
              <li className="hero__stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span className="hero__stat-label">{stat.label}</span>
                <span className="hero__stat-text">{stat.text}</span>
              </li>
            ))}
          </ul>

          <div className="hero__actions">
            <Button href={hero.primaryCta.href} icon="arrow-right">{hero.primaryCta.label}</Button>
            <Button href={hero.secondaryCta.href} variant="secondary" icon="sparkles">{hero.secondaryCta.label}</Button>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}
