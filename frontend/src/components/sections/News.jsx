import SectionHeading from '../ui/SectionHeading'
import './News.css'

export default function News() {
  return (
    <section id="news" className="section news-section" aria-labelledby="news-title">
      <div className="container">
        <SectionHeading
          id="news-title"
          eyebrow="Insights & Updates"
          title="Berita Terbaru"
          description="Kabar terkini seputar MUDA Movement."
        />
        <p className="news-section__message">
          Berita akan tersedia kembali setelah sumber kontennya disiapkan.
        </p>
      </div>
    </section>
  )
}
