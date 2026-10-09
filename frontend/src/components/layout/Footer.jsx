import { brand, footer } from '../../data/content'
import Icon from '../ui/Icon'
import './Footer.css'

function getSocialHref(link) {
  const type = link.type || link.icon

  // 1. WhatsApp dengan pesan teks otomatis
  if (type === 'whatsapp') {
    const textParam = link.text ? `?text=${encodeURIComponent(link.text)}` : ''
    return `https://wa.me/${link.value}${textParam}`
  }
  
  // 2. Email Compose Gmail (Tanpa mailto)
  if (type === 'mail') {
    const to = encodeURIComponent(link.value)
    const su = link.subject ? encodeURIComponent(link.subject) : ''
    const body = link.body ? encodeURIComponent(link.body) : ''
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}`
  }
  
  // 3. Instagram Direct Message
  if (type === 'instagram') {
    return `https://ig.me/m/${link.value}`
  }

  return link.href || '#'
}

function FooterColumn({ title, links, isSocial = false }) {
  return (
    <nav className="footer__col" aria-label={title}>
      <h2 className="footer__col-title">{title}</h2>
      <ul>
        {links.map((link) => {
          const href = isSocial ? getSocialHref(link) : link.href

          return (
            <li key={link.label}>
              <a 
                href={href} 
                target={isSocial ? "_blank" : undefined}
                rel={isSocial ? "noopener noreferrer" : undefined}
                className="footer__link"
              >
                {link.icon && <Icon name={link.icon} size={18} />}
                <span>{link.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      <span className="footer__ring" aria-hidden="true" />
      <div className="container--wide footer__inner">
        <div className="footer__grid">
          {/* Kolom 1: Brand Info + Ikon Medsos */}
          <div className="footer__brand">
            <p className="footer__logo">{brand.name}</p>
            <p className="footer__desc">{footer.description}</p>

            {/* Ikon Sosial Media di bawah deskripsi */}
            {footer.socialMedia && footer.socialMedia.length > 0 && (
              <div className="footer__social-icons">
                {footer.socialMedia.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__social-icon-link"
                    aria-label={item.name}
                    title={item.name}
                  >
                    <Icon name={item.icon} size={20} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Kolom 2: Alamat / Google Maps */}
          <div className="footer__col">
            <h2 className="footer__col-title">{footer.addressTitle}</h2>
            <a 
              href={footer.address.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer__link"
            >
              <Icon name={footer.address.icon} size={18} />
              <span>{footer.address.label}</span>
            </a>
          </div>

          {/* Kolom 3: Kontak Kami (Email, IG DM, WA, Website) */}
          <FooterColumn title={footer.socialTitle} links={footer.social} isSocial={true} />
        </div>

        <p className="footer__copy">
          © {new Date().getFullYear()} {footer.copyright}
        </p>
      </div>
    </footer>
  )
}