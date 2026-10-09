import { partners } from '../../data/content'
import SectionHeading from '../ui/SectionHeading'
import './Partners.css'

const brandLogos = Object.entries(
  import.meta.glob('../../../Assets/brands/*.{svg,png,jpg,jpeg,webp}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)
  .map(([path, src]) => {
    const filename = path.split('/').pop().replace(/\.[^.]+$/, '')
    const label = filename.replace(/[-_]+/g, ' ').replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
    return { src, label }
  })
  .sort((first, second) => first.label.localeCompare(second.label))

export default function Partners() {
  return (
    <section id="partners" className="section partners" aria-labelledby="partners-title">
      <div className="container--wide">
        <SectionHeading id="partners-title" eyebrow={partners.eyebrow} title={partners.title} tone="inverse" />

        {brandLogos.length > 0 && (
          <div className="partners__marquee" role="group" aria-label="Logo partner kolaborasi" tabIndex={0}>
            <div className="partners__track">
              {[false, true].map((isDuplicate) => (
                <ul
                  className="partners__group"
                  key={isDuplicate ? 'duplicate' : 'original'}
                  aria-hidden={isDuplicate || undefined}
                >
                  {brandLogos.map((logo) => (
                    <li className="partners__logo" key={logo.src}>
                      <img
                        src={logo.src}
                        alt={isDuplicate ? '' : logo.label}
                        decoding="async"
                        aria-hidden={isDuplicate || undefined}
                      />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
