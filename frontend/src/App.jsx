import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Programs from './components/sections/Programs'
import Portfolio from './components/sections/Portfolio'
import Events from './components/sections/Events'
import Partners from './components/sections/Partners'
import Contact from './components/sections/Contact'

/**
 * Susunan halaman dari atas ke bawah.
 * Ingin memindah / menghapus section? Cukup ubah baris di bawah ini.
 */
function LandingPage() {
  return (
    <>
      <a className="skip-link" href="#main">Lewati ke konten utama</a>
      <Navbar />

      <main id="main">
        <Hero />
        <About />
        <Programs />
        <Portfolio />
        <Events />
        <Partners />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
