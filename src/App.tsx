import { useEffect, useRef, useState, type MouseEvent } from 'react'
import './App.css'
import heroImage from './assets/07a80012-6114-4aa3-a4c4-7da716aac2ae.jpg'
import weddingMusic from './assets/Bruno Mars - Risk It All.mp3'
import musicCover from './assets/unduh mantu alakh mahen dan mbk annisa.png'
import galleryImage1 from './assets/2240a012-7682-44d2-a855-d1eaa5ecf1f9.jpg'
import galleryImage2 from './assets/3745ad36-acad-460a-b6e1-4caff4fefe8b.jpg'
import galleryImage3 from './assets/44b59c61-5668-45a1-af3d-e9391f212932.jpg'
import galleryImage4 from './assets/45ac179b-bab8-427e-870d-349af2b84fdd.jpg'
import galleryImage5 from './assets/66957763-d81d-45bd-a1f7-94911fcb5adc.jpg'

const storyItems = [
  {
    icon: 'favorite',
    date: 'FEBRUARI - 2026',
    text:
      'Berawal dari sebuah perkenalan sederhana di bulan Februari 2026, Mahendra Surya Trisuma dan Annisa Firdaus dipertemukan dalam sebuah kisah yang tak pernah mereka sangka akan membawa keduanya sampai sejauh ini.',
  },
  {
    icon: 'visibility',
    date: 'MARET - 2026',
    text:
      'Jarak sempat menjadi bagian dari perjalanan mereka. Sejak awal mengenal, keduanya menjalani hubungan dalam keadaan LDR. Namun, jarak tidak menjadi penghalang untuk saling mengenal dan menumbuhkan rasa. Hingga pada bulan Maret 2026, mereka akhirnya dipertemukan secara langsung untuk menghabiskan waktu bersama.',
  },
  {
    icon: 'ring_volume',
    date: 'APRIL - 2026',
    text:
      'Setelah kembali menjalani LDR, hubungan keduanya semakin serius. Hingga pada bulan April 2026, Mahendra dan Annisa memantapkan hati untuk melangkah ke jenjang yang lebih serius. Pertemuan kembali terjadi dalam momen lamaran yang menjadi salah satu langkah penting menuju kehidupan bersama.',
  },
  {
    icon: 'celebration',
    date: 'JUNI - 2026',
    text:
      'Tidak lama setelah itu, setelah kembali melewati jarak dan waktu, pada bulan Juni 2026 keduanya akhirnya dipersatukan dalam ikatan suci pernikahan. Hari itu menjadi awal dari perjalanan baru sebagai sepasang suami dan istri. Bagi mereka, cinta bukan tentang seberapa dekat jarak yang memisahkan, tetapi tentang dua hati yang tetap memilih satu sama lain, meski harus berkali-kali menunggu untuk kembali bertemu.',
  },
]

const eventDate = new Date('2026-09-20T08:00:00+07:00').getTime()

const getCountdown = () => {
  const remaining = Math.max(0, eventDate - Date.now())
  const totalSeconds = Math.floor(remaining / 1000)

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
  }
}

function App() {
  const [invitationOpen, setInvitationOpen] = useState(false)
  const [countdown, setCountdown] = useState(getCountdown)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const countdownTimer = window.setInterval(() => {
      setCountdown(getCountdown())
    }, 1000)

    return () => window.clearInterval(countdownTimer)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false))
    }
  }, [])

  useEffect(() => {
    if (!invitationOpen) return

    const revealItems = Array.from(
      document.querySelectorAll<HTMLElement>('.reveal, .reveal-card, .reveal-item'),
    )

    if (!revealItems.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 120}ms`
      observer.observe(item)
    })

    return () => observer.disconnect()
  }, [invitationOpen])

  const handleOpenInvitation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setInvitationOpen(true)
    const audio = audioRef.current
    if (audio) {
      audio.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false))
    }

    setTimeout(() => {
      const target = document.getElementById('profiles')
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 420)
  }

  const handleMusicToggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false))
    } else {
      audio.pause()
      setMusicPlaying(false)
    }
  }

  return (
    <div className="wedding-page">
      <nav className="top-nav" aria-label="Top navigation">
        <button type="button" className="nav-button" aria-label="Open menu">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
            menu
          </span>
        </button>
        <div className="brand-mark">M &amp; A</div>
        <div className="nav-spacer" aria-hidden="true" />
      </nav>

      <section className="hero-section" id="hero">
        <div className="hero-image-wrap">
          <img alt="Mahendra and Annisa wedding hero image" src={heroImage} />
          <div className="hero-overlay" />
        </div>

        <div className="hero-content">
          <p className="eyebrow text-inverse-primary">UNDUH MANTU</p>
          <h1>Mahendra &amp; Annisa</h1>
          <p className="hero-date">Minggu, 20 September 2026</p>
          <a className="primary-button" href="#profiles" onClick={handleOpenInvitation}>
            <span className="material-symbols-outlined">drafts</span>
            BUKA UNDANGAN
          </a>
        </div>
      </section>

      <div className={`invitation-shell ${invitationOpen ? 'is-open' : ''}`}>
        <section className="profiles-section reveal" id="profiles">
        <div className="section-inner">
          <div className="intro-copy reveal-item">
            <h2 className="quote-title">Assalamu'alaikum Warahmatullahi Wabarakatuh</h2>
            <p>
              Dengan memohon rahmat dan ridha Allah Subhanahu Wa Ta&apos;ala, kami mengundang
              Bapak/Ibu/Saudara/i untuk berkenan menghadiri acara ngunduh mantu kami:
            </p>
          </div>

          <div className="profiles-grid">
            <div className="person-card reveal-card">
              <div className="portrait-frame">
                <img
                  alt="Groom Mahendra portrait in traditional attire"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDniNKVAjLqTOfv5tfFejHdzGCXHoMHwzN5Z7slxAGynVw3-OyCFNImPImaEHVXCSvdeTZ6lUH_lstyQnqED8Rcx26TD65ehx8s6qFbbuNW22rbxMJLI7ES1BLDEswvSESSvsMVGTnZYR3d8NpCVYJIBrYQtAHpfZYIsIVrLSuRF6omiSLvIeFMe5wIddqI7bFH29qJM-xoZIadpghghOj6Qjt5JuARyzXOg8vS6rMPzf2aOFUeVmk9WvpgzjxYjGQqSS4"
                />
              </div>
              <h3>Mahendra</h3>
              <p className="person-meta">Briptu Mahendra Surya Trisuma, S.S.</p>
            </div>

            <div className="ampersand">&amp;</div>

            <div className="person-card">
              <div className="portrait-frame">
                <img
                  alt="Bride Annisa portrait in traditional attire"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsVVDddh8km3_eDe-TnBBFtHAm5_B55977OOppocX0dPBB018kPRDiayRjVDBG2BGc1PIia57iHgq1wqW0apA9hEr3mpJKJNUccE1bO2ubErmv9pldbCXd9f-pJC-VhDDRItdfxB2NxBBQ2pEsHP1r2bSad4r_U_ad-lvFBzdUavIrmOJ__AWVlFsTTp8yAoDRLC7Md2myx7qCI91dTc9DbyRSC4e7C3hcGzg4fQpim_PYH_hiLQhgt3EAnLLXGY0G9Y0"
                />
              </div>
              <h3>Annisa</h3>
              <p className="person-meta">Annisa Firdaus, A. Md. Keb.</p>
            </div>
          </div>
        </div>
        </section>

        <section className="quote-section reveal">
        <div className="quote-bg-wrap">
          <img
            alt="Soft blurred floral arrangement representing romance and peace"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL-J3B_jBGgvJhCrycJzrM164BtOldudoUGkysfJ1bSOdtCD3E6PnYQQkBUh9jG_JSQ-jDO4yLzd59dUvoT7QW_lH7pp94zuHerT4ZELff37V6_-kZ4V_EZTD7p7AHDYfy67qXaGwVQe1w7W-q93kbK-Fpksoxae-6Hplx-zZwPPlvQ74kZXbX-ra4aWABcF9niRIhVXowjR8iuttROUK_qZPX6fY3RjvJu31fcaZKa0v9-1KXw3shk3RrYGc19sIEigM"
          />
          <div className="quote-overlay" />
        </div>

        <div className="quote-content reveal-item">
          <h3>Q.S. AR - RUM 21</h3>
          <p>
            &quot;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
            istri-istri dari jenismu sendiri, supaya kamu merasa ketenangan dan ketentraman
            hatimu, dan dijadikan-Nya di antaramu rasa kasih sayang.&quot;
          </p>
        </div>
      </section>

      <section className="schedule-section reveal" id="schedule">
        <div className="schedule-pattern" aria-hidden="true" />
        <div className="schedule-card glass-panel gold-border reveal-card">
          <h2>Unduh Mantu Schedule</h2>

          <div className="countdown reveal-item">
            <div className="count-box reveal-item">
              <span>{countdown.days}</span>
              <small>HARI</small>
            </div>
            <div className="count-box split reveal-item">
              <span>{String(countdown.hours).padStart(2, '0')}</span>
              <small>JAM</small>
            </div>
            <div className="count-box split reveal-item">
              <span>{String(countdown.minutes).padStart(2, '0')}</span>
              <small>MENIT</small>
            </div>
          </div>

          <div className="event-block reveal-item">
            <h3>UNDUH MANTU</h3>
            <p className="event-date">MINGGU, 20 SEPTEMBER 2026</p>
            <p className="event-time">08.00 - 10.00 WIB</p>
            <p className="event-address">
              RT./RW/RW.002/005, Sukabumi, Kec. Buay Bahuga, Kabupaten Way Kanan, Lampung 34767
            </p>
          </div>
        </div>
        </section>

        <section className="maps-section reveal" id="maps">
          <div className="maps-inner">
            <div className="maps-heading reveal-item">
              <p className="eyebrow">LOKASI ACARA</p>
              <h2>Temukan Lokasi Kami</h2>
              <p>Silakan buka Google Maps untuk mendapatkan petunjuk arah menuju lokasi acara.</p>
            </div>
            <div className="map-frame reveal-card">
              <iframe
                title="Lokasi acara di titik -4.261974, 104.568166"
                src="https://www.google.com/maps?q=-4.261974,104.568166&z=18&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              className="primary-button maps-button reveal-item"
              href="https://www.google.com/maps/search/?api=1&query=-4.261974%2C104.568166"
              target="_blank"
              rel="noreferrer"
            >
              <span className="material-symbols-outlined">location_on</span>
              BUKA GOOGLE MAPS
            </a>
          </div>
        </section>

        <section className="story-section reveal" id="story">
        <div className="story-inner">
          <h2 className="story-heading reveal-item">
            <span>Our Love Story</span>
          </h2>

          <div className="story-hero-image reveal-item">
            <img
              alt="Couple looking at each other affectionately in soft lighting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcccoTOcs76I1xWL-M6-SFu7c0kYAoqDPevqUCo68pF1U_G0TT7bDaDhCjwJZydLFOtqZGr6rUEZCTEfLBzdlrzVWy9T6a_phiPKOsw8mXS7iihtsRDZ32g0erF5Z6JviBDMkpYwstnr5Z-_sgpL7kkXzZZ7rAD3OL-5G3FvBUURPoANqhf3LnfuGXzRr43Crj_sKjneC2IQRIxV3u37V8yd7Dtsn5z6k7swqtz2ur_9QlC8sV9PAOvosEwugPdHH268E"
            />
          </div>

          <div className="story-timeline">
            {storyItems.map((item, index) => (
              <div className={`story-item reveal-item ${index % 2 === 0 ? 'is-active' : ''}`} key={item.date}>
                <div className="timeline-dot">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div className="story-card">
                  <div className="story-date">{item.date}</div>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </section>

        <section className="gallery-section reveal" id="gallery">
        <div className="gallery-inner">
          <h2 className="reveal-item">Our Gallery</h2>

          <div className="gallery-grid">
            <div className="gallery-item video-item reveal-card">
              <img
                alt="Mahendra and Annisa wedding portrait"
                src={galleryImage1}
              />
              <div className="video-overlay">
                <button type="button" aria-label="Play gallery video">
                  <span className="material-symbols-outlined">play_arrow</span>
                </button>
              </div>
            </div>

            <div className="gallery-item portrait tall reveal-card">
              <img
                alt="Mahendra and Annisa wedding portrait in traditional attire"
                src={galleryImage2}
              />
            </div>
            <div className="gallery-item portrait tall reveal-card">
              <img
                alt="Mahendra and Annisa wedding floral portrait"
                src={galleryImage3}
              />
            </div>
            <div className="gallery-item landscape wide reveal-card">
              <img
                alt="Mahendra and Annisa signing their marriage document"
                src={galleryImage4}
              />
            </div>
            <div className="gallery-item landscape wide reveal-card">
              <img
                alt="Mahendra and Annisa wedding portrait"
                src={galleryImage5}
              />
            </div>
          </div>
        </div>
        </section>

        <section className="closing-section reveal">
        <div className="closing-image-wrap">
          <img
            alt="Happy couple portrait looking away in soft lighting"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdW9yEx7Q1Kc_wVFy60WsczlZzM4WBHTE1JrWtFEOFFjKFlXCZXd2HEBcELE8NpBi6-AqAwlgukUU4o5WAFJSBYqxcTrlJDJJ1viXVu6mhNlIpFeCAr4E10GUWJ4l7qCOzRwv2A4JKAfZ_IXtlOVhDtQtipWnH9SfT_etK0DDijVeukWBuPS1Tvi7LYhyMAQmWt2rNRvWnHJXAnObNOda2Ao1UHb3Mx156cgXlHgoq3twtMK-fgDx547mJruYQgNzi5nE"
          />
          <div className="closing-overlay" />
        </div>

        <div className="closing-content reveal-item">
          <p className="closing-message">
            Menjadi sebuah kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dalam
            hari bahagia kami. Terima kasih atas segala ucapan, doa, dan perhatian yang diberikan.
          </p>
          <p className="closing-note">Sampai jumpa di hari bahagia kami</p>
          <h2>Mahendra &amp; Annisa</h2>
          <p className="closing-couple">Beserta Keluarga</p>
          <div className="monogram">M&amp;A</div>
          <p className="copyright">All rights reserved © 2026</p>
        </div>
        </section>
      </div>

      <audio ref={audioRef} src={weddingMusic} loop preload="auto" />

      <button
        type="button"
        className={`music-button ${musicPlaying ? 'is-playing' : ''}`}
        aria-label={musicPlaying ? 'Pause music' : 'Play music'}
        aria-pressed={musicPlaying}
        onClick={handleMusicToggle}
      >
        <img className="music-cover" src={musicCover} alt="Music cover" />
      </button>
    </div>
  )
}

export default App
