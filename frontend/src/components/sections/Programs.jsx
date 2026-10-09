import { programs } from '../../data/content'
import IconTile from '../ui/IconTile'
import SectionHeading from '../ui/SectionHeading'
import './Programs.css'

export default function Programs() {
  return (
    <section id="programs" className="section section--alt programs" aria-labelledby="programs-title">
      <div className="container--wide">
        <SectionHeading
          id="programs-title"
          eyebrow={programs.eyebrow}
          title={programs.title}
          description={programs.description}
        />

        <ul className="programs__grid">
          {programs.items.map((program) => (
            <li className="program-card" key={program.title}>
              <div className="program-card__top">
                <IconTile name={program.icon} tone={program.tone} />
                <img className="program-card__photo" src={program.photo} alt="" loading="lazy" decoding="async" />
              </div>
              <h3>{program.title}</h3>
              <p>{program.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
