import { useState } from 'react'
import './PasswordInput.css'

export default function PasswordInput({ className = '', ...inputProps }) {
  const [visible, setVisible] = useState(false)
  const classes = `password-input ${className}`.trim()

  return (
    <span className={classes}>
      <input {...inputProps} type={visible ? 'text' : 'password'} />
      <button
        className="password-input__toggle"
        type="button"
        aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
        aria-pressed={visible}
        onClick={() => setVisible((value) => !value)}
      >
        {visible ? 'Sembunyikan' : 'Tampilkan'}
      </button>
    </span>
  )
}
