import Icon from '../ui/Icon'
import useTheme from '../../hooks/useTheme'
import './ThemeToggle.css'

/**
 * Tombol pengganti tema terang/gelap.
 * Ikon bulan tampil saat tema terang (klik → gelap), ikon matahari saat gelap.
 */
export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  const label = isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      role="switch"
      aria-checked={isDark}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb">
          <Icon name={isDark ? 'sun' : 'moon'} size={15} />
        </span>
      </span>
    </button>
  )
}
