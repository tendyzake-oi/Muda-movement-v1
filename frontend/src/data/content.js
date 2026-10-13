/**
 * SEMUA TEKS & DATA HALAMAN ADA DI SINI.
 * Ingin mengganti kata-kata, nama proyek, atau kontak? Edit file ini saja —
 * tidak perlu membuka komponen.
 */

import Beasiswa from '../../Assets/Project/Beasiswa.jpg'
import Leadership from '../../Assets/Project/Leadership.jpg'
import LearningCamp from '../../Assets/Project/Learning.jpg'
import Sahabat from '../../Assets/Project/Sahabat.jpg'
import herologo from '../../Assets/Navbar/Muda-Movement-putih.png'
import academyLogo from '../../Assets/brands/Mooda-Academy.png'
import trainingEventPhoto from '../../Assets/events/Upgrading.png'
import Workshop from '../../Assets/events/Workshop.png'
import MudaColaboration from '../../Assets/events/Muda-Colaboration.png'
import Monitoring from '../../Assets/events/Monitoring.png'
import Mudainternship from '../../Assets/Program/Muda-Internship.png'
import futurebox from '../../Assets/Program/Future-Box.png'
import Mudakolaborasi from '../../Assets/Program/Muda-collaboration.jpg'


export const brand = {
  name: 'Muda Movement',
  logo: herologo,
}

export const navLinks = [
  { label: 'Beranda', href: '#home' },
  { label: 'Tentang Kami', href: '#about' },
  { label: 'Program Kami', href: '#programs' },
  { label: 'Portofolio', href: '#portfolio' },
  { label: 'Event', href: '#events' },
  { label: 'Partner Kolaborasi', href: '#partners' },
  { label: 'Hubungi Kami', href: '#contact' },
]

export const hero = {
  badge: 'Learning · Developing · Empowering',
  title: 'Muda Movement',
  description: 'Membantu anak muda menemukan versi terbaiknya melalui ruang belajar, pengembangan diri, dan kolaborasi yang berdampak.',
  primaryCta: { label: 'Jelajahi Program', href: '#programs' },
  secondaryCta: { label: 'Hubungi Kami', href: '#contact' },
  stats: [
    { value: 'Nasional', label: 'Jangkauan program', text: 'Menjangkau pemuda di seluruh Indonesia.' },
    { value: '10.000+', label: 'Alumni network', text: 'Tersebar di berbagai wilayah Indonesia.' },
    { value: '13+', label: 'Tahun pengalaman', text: 'Konsisten memberdayakan pemuda.' },
  ],
}

export const highlights = [
  { icon: 'compass', tone: 'violet', label: 'Sosial Media Management', photo: 'social-media-management.jpg' },
  { icon: 'monitor', tone: 'coral', label: 'Jasa Foto & Video', photo: 'jasa-foto-video.jpg' },
  { icon: 'users', tone: 'amber', label: 'Jasa Desain', photo: 'jasa-desain.jpg' },
  { icon: 'motion', tone: 'violet', label: 'Kreatif Studio', photo: 'kreatif-studio.jpg' },
  { icon: 'whatsapp', tone: 'coral', label: 'Digital Marketing', photo: 'digital-marketing.jpg' },
  { icon: 'website', tone: 'amber', label: 'Jasa Website', photo: 'jasa-website.jpg' },
]

export const about = {
  eyebrow: 'Tentang Kami',
  title: 'Mengenal Muda Movement lebih dekat',
  paragraphs: [
    'Muda Movement adalah platform inovasi pemuda Indonesia yang membantu anak muda menemukan versi terbaik dirinya.',
    'Melalui learning, developing, dan empowering, kami membuka ruang bagi generasi muda untuk belajar, bertumbuh, dan memberikan dampak bagi masyarakat.',
  ],
  visual: {
    label: 'Learning · Developing · Empowering',
    text: 'Membantu anak muda menemukan versi terbaiknya.',
  },
  values: [
    { icon: 'lightbulb', tone: 'coral', title: 'Learning', text: 'Belajar dan menemukan potensi diri.' },
    { icon: 'overlap', tone: 'violet', title: 'Empowering', text: 'Bertumbuh bersama dan membawa perubahan.' },
  ],
}

export const programs = {
  eyebrow: 'Program Kami',
  title: 'Ruang belajar, bertumbuh, dan berkolaborasi',
  description:
    'Program yang membuka kesempatan bagi generasi muda dan komunitas untuk belajar, mengembangkan potensi, serta menciptakan dampak bersama.',
  items: [
    { icon: 'lightbulb', tone: 'violet', title: 'Mooda Academy', text: 'Bootcamp pelatihan pemuda untuk mengembangkan keterampilan dan meningkatkan kompetensi diri', photo: academyLogo },
    { icon: 'compass', tone: 'coral', title: 'Future Box', text: 'Distribusi Dream kit dan workshop untuk menumbuhkan keberanian bermimpi dan merancang masa depan.', photo: futurebox },
    { icon: 'users', tone: 'amber', title: 'Muda Internship', text: 'Program magang plus pelatihan skill dasar bagi siswa, mahasiswa, dan fresh graduate.', photo: Mudainternship },
    { icon: 'sparkles', tone: 'violet', title: 'Muda Collaboration', text: 'kelas tematik hybrid untuk menambahkan wawasan dan meng-upgrade diri generasi muda.', photo: Mudakolaborasi },
  ],
}

export const portfolio = {
  eyebrow: 'Project Kami',
  title: 'Project, kegiatan, dan kolaborasi yang berdampak',
  description: 'Kami mempunyai pengalaman menjadi pelaksana program sosial-edukatif dari perencana hingga evaluasi, berdampak bagi ribuan pemuda di seluruh Indonesia.',
  items: [
    { id: 'beasiswa', title: 'Beasiswa Bintang Mandiri', description: 'Program beasiswa untuk mendukung pendidikan dan pengembangan diri pemuda.', photo: Beasiswa },
    { id: 'leadership', title: 'Leadership Camp', description: 'Pelatihan kepemimpinan untuk membangun karakter dan keterampilan manajerial.', photo: Leadership },
    { id: 'learning-camp', title: 'Learning Camp', description: 'Kamp belajar yang memberikan pengalaman langsung dalam berbagai bidang.', photo: LearningCamp },
    { id: 'sahabat', title: 'Sahabat Pelajar Indonesia', description: 'Program kolaborasi untuk mendukung perkembangan akademik dan sosial pemuda.', photo: Sahabat },
  ],
}

export const events = {
  eyebrow: 'Kegiatan / Event',
  title: 'Kegiatan yang disediakan',
  description: 'Kegiatan dan event yang diselenggarakan oleh Muda Movement untuk mendukung pengembangan diri anak muda.',
  items: [
    { name: 'Upgrade diri', date: 'Upgrading', photo: trainingEventPhoto },
    { name: 'Workshop dan pengembangan', date: 'Workshop kemandirian', photo: Workshop },
    { name: 'Muda Finance Talk', date: 'Muda Collaboration', photo: MudaColaboration },
    { name: 'Monitoring dan evaluasi mentor', date: 'Monitoring dan evaluasi mentor', photo: Monitoring },
  ],
}

export const partners = {
  eyebrow: 'Tumbuh Bersama',
  title: 'Partner Kolaborasi Muda Movement',
}

export const impact = {
  eyebrow: 'Why / Impact',
  title: 'Ruang untuk menunjukkan dampak yang nyata.',
  note: 'Placeholder — replace with verified data.',
  stats: [
    { value: 'XX', tone: 'violet', label: 'Project', text: 'Ganti dengan data terverifikasi.' },
    { value: '—', tone: 'coral', label: 'Partner', text: 'Ganti dengan data terverifikasi.' },
    { value: 'XX', tone: 'amber', label: 'Creative Output', text: 'Ganti dengan data terverifikasi.' },
  ],
}

export const testimonial = {
  eyebrow: 'Client Testimonial',
  quote: '[Tambahkan testimonial klien terverifikasi di sini]',
  author: 'Nama klien / Peran / Perusahaan',
}

export const cta = {
  eyebrow: 'Muda Movement',
  title: 'Bersama membantu anak muda bertumbuh.',
  text: 'Mari mulai percakapan untuk belajar, berkembang, dan berkolaborasi.',
  button: { label: 'Hubungi Kami', href: '#contact' },
}

export const contact = {
  eyebrow: 'Kontak',
  title: 'Hubungi Muda Movement',
  description:
    'Punya pertanyaan atau ingin berkolaborasi? Kami siap mendengar dari Anda. Hubungi tim Muda Movement melalui saluran berikut.',
  channels: [
    { icon : 'mail', tone: 'violet', label: 'Email', value: 'info@mudamovement.com', subject: 'Tanya Program Muda Movement', body: 'Halo tim Muda Movement, saya tertarik untuk mengetahui lebih lanjut mengenai...' },
    { icon: 'whatsapp', tone: 'amber', label: 'WhatsApp', value: '6282315581944', text: 'Halo Muda Movement, saya ingin bertanya tentang program dan kolaborasi.' },
    { icon: 'instagram', tone: 'coral', label: 'instagram', value: 'mudamovement' },
    { icon: 'website', tone: 'violet', label: 'Website', value: 'Dashboard' },
  ],
  // Data FAQ Baru
  faqs: [
    {
      question: 'Apa itu Muda Movement?',
      answer: 'Muda Movement adalah platform inovasi pemuda Indonesia yang membantu anak muda menemukan versi terbaiknya.'
    },
    {
      question: 'Apa saja pilar Muda Movement?',
      answer: 'Kami bergerak melalui tiga pilar: Learning, Developing, dan Empowering.'
    },
    {
      question: 'Siapa yang dapat mengikuti program?',
      answer: 'Program kami ditujukan untuk anak muda dan komunitas yang ingin belajar, mengembangkan potensi, dan berkolaborasi.'
    },
    {
      question: 'Bagaimana cara berkolaborasi dengan Muda Movement?',
      answer: 'Hubungi tim kami melalui WhatsApp atau website untuk membicarakan program dan peluang kolaborasi.'
    },
  ]
}

export const footer = {
  description: 'Platform inovasi pemuda Indonesia untuk learning, developing, dan empowering.',
  
  // Icon media sosial yang ditaruh di bawah deskripsi
  socialMedia: [
    {
      name: 'Instagram',
      icon: 'instagram',
      href: 'https://instagram.com/mudamovement',
    },
    {
      name: 'YouTube',
      icon: 'youtube',
      href: 'https://www.youtube.com/@mudamovement6875', // Ganti dengan handle/link channel YT Anda
    },
    {
      name: 'TikTok',
      icon: 'tiktok',
      href: 'https://tiktok.com/@mudamovement', // Ganti dengan link TikTok Anda
    },
    {
      name: 'Facebook',
      icon: 'facebook',
      href: 'https://facebook.com/mudamovement', // Ganti dengan link FP/Profil FB Anda
    },
  ],
  addressTitle: 'Informasi',
  address: {
    icon: 'location',
    label: 'Jl. Brigadir Jend. Katamso No.19B Lt 3, Cihaur Geulis, Kec. Cibeunying Kidul, Kota Bandung, Jawa Barat 40122',
    // Gunakan URL pencarian Google Maps atau link share titik Google Maps Anda
    href: 'https://maps.app.goo.gl/CtVxFSh8wvB8gaDe9', 
  },
  socialTitle: 'Hubungi Kami',
  social: [
    { 
      type: 'whatsapp',
      icon: 'whatsapp',
      label: 'WhatsApp', 
      value: '6282315581944', // Nomor WA (gunakan format internasional tanpa + atau 0 di depan)
      text: 'Halo Muda Movement, saya ingin bertanya tentang program dan kolaborasi.'
    },
    { 
      type: 'mail',
      icon: 'mail', 
      label: 'Email Kami', 
      value: 'info@mudamovement.com',
      subject: 'Tanya Program Muda Movement',
      body: 'Halo tim Muda Movement, saya tertarik untuk mengetahui lebih lanjut mengenai...'
    },
    { 
      type: 'instagram',
      icon: 'instagram', 
      label: 'Instagram', 
      value: 'mudamovement' // Username Instagram Anda
    },
    { 
      type: 'website',
      icon: 'website', 
      label: 'Website', 
      href: 'https://mudamovement.com' 
    },
  ],
  copyright: 'Muda Movement — All Rights Reserved',
}
