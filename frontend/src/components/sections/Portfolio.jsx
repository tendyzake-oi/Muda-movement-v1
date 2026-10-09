import { useState } from 'react'
import { portfolio } from '../../data/content'
import SectionHeading from '../ui/SectionHeading'
import './Portfolio.css'

export default function Portfolio() {
  const [visibleCaptions, setVisibleCaptions] = useState(() => new Set())

  const toggleCaption = (id) => {
    setVisibleCaptions((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section id="portfolio" className="section portfolio" aria-labelledby="portfolio-title">
      <div className="container">
        <SectionHeading
          id="portfolio-title"
          eyebrow={portfolio.eyebrow}
          title={portfolio.title}
          description={portfolio.description}
        />

        <ul className="portfolio__grid">
          {portfolio.items.map((item) => {
            const isOpen = visibleCaptions.has(item.id)

            return (
              <li key={item.id}>
                <button
                  className={`portfolio-card${isOpen ? ' portfolio-card--open' : ''}`}
                  type="button"
                  aria-label={`${isOpen ? 'Sembunyikan' : 'Tampilkan'} keterangan ${item.title}`}
                  aria-expanded={isOpen}
                  onClick={() => toggleCaption(item.id)}
                >
                  <span className="portfolio-card__image">
                    <img src={item.photo} alt="" loading="lazy" decoding="async" />
                    <span className="portfolio-card__hint" aria-hidden="true">
                      {isOpen ? 'Tutup keterangan' : 'Lihat keterangan'}
                    </span>
                  </span>
                  <span className="portfolio-card__caption">
                    <span className="portfolio-card__title">{item.title}</span>
                    <span className="portfolio-card__description">{item.description}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
