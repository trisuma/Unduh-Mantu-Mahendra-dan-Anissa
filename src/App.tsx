import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import './App.css'
import { supabase } from './lib/supabase'
import heroImage from './assets/07a80012-6114-4aa3-a4c4-7da716aac2ae.jpg'
import weddingMusic from './assets/Bruno Mars - Risk It All.mp3'
import musicCover from './assets/unduh mantu alakh mahen dan mbk annisa.png'
import galleryImage1 from './assets/2240a012-7682-44d2-a855-d1eaa5ecf1f9.jpg'
import galleryImage2 from './assets/3745ad36-acad-460a-b6e1-4caff4fefe8b.jpg'
import galleryImage3 from './assets/44b59c61-5668-45a1-af3d-e9391f212932.jpg'
import galleryImage4 from './assets/45ac179b-bab8-427e-870d-349af2b84fdd.jpg'
import galleryImage5 from './assets/66957763-d81d-45bd-a1f7-94911fcb5adc.jpg'
import batikAwan from './assets/batik-awan.webp'
import batikBunga from './assets/batik-bunga.png'
import bungaBatik from './assets/bunga-batik2.png'
import gununganWayang from './assets/gunungan wayang .png'

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

type Wish = {
  id?: number
  name: string
  message: string
  attendance: 'Hadir' | 'Tidak Hadir'
  created_at?: string
}

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
  const [wishes, setWishes] = useState<Wish[]>([])
  const [wishesLoading, setWishesLoading] = useState(false)
  const [wishError, setWishError] = useState('')
  const [wishSuccess, setWishSuccess] = useState(false)
  const [wishSending, setWishSending] = useState(false)
  const [copiedAccount, setCopiedAccount] = useState('')
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
      document.querySelectorAll<HTMLElement>('.reveal, .reveal-card, .reveal-item, .ornament'),
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
      item.style.transitionDelay = item.classList.contains('ornament') ? '0ms' : `${index * 120}ms`
      observer.observe(item)
    })

    return () => observer.disconnect()
  }, [invitationOpen])

  useEffect(() => {
    if (!invitationOpen || !supabase) return
    const client = supabase

    const loadWishes = async () => {
      setWishesLoading(true)
      const { data, error } = await client
        .from('wishes')
        .select('id, name, message, attendance, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        setWishError('Ucapan belum dapat dimuat. Silakan coba lagi nanti.')
      } else {
        setWishes(data as Wish[])
      }
      setWishesLoading(false)
    }

    void loadWishes()
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

  const handleCopyAccount = async (accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber)
      setCopiedAccount(accountNumber)
      window.setTimeout(() => setCopiedAccount(''), 1800)
    } catch {
      setWishError('Nomor rekening belum berhasil disalin.')
    }
  }

  const handleWishSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) {
      setWishError('Koneksi database belum dikonfigurasi.')
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()
    const attendance = formData.get('attendance') === 'Tidak Hadir' ? 'Tidak Hadir' : 'Hadir'

    setWishError('')
    setWishSuccess(false)
    setWishSending(true)
    const { error } = await supabase.from('wishes').insert({ name, message, attendance })

    if (error) {
      setWishError('Ucapan belum berhasil dikirim. Silakan coba lagi.')
    } else {
      form.reset()
      setWishes((currentWishes) => [
        { name, message, attendance, created_at: new Date().toISOString() },
        ...currentWishes,
      ])
      setWishSuccess(true)
    }
    setWishSending(false)
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

      <section className={`hero-section ${invitationOpen ? 'invitation-started' : ''}`} id="hero">
        <div className="hero-image-wrap">
          <img alt="Mahendra and Annisa wedding hero image" src={heroImage} />
          <div className="hero-overlay" />
        </div>

        <div className="hero-wayang-transition" aria-hidden="true">
          <img className="hero-wayang hero-wayang-left" src={gununganWayang} alt="" />
          <img className="hero-wayang hero-wayang-right" src={gununganWayang} alt="" />
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
        <img className="section-ornament ornament-gunungan" src={gununganWayang} alt="" aria-hidden="true" />
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
        <img className="section-ornament ornament-cloud" src={batikAwan} alt="" aria-hidden="true" />
        <div className="quote-bg-wrap">
          <img
            alt="Soft blurred floral arrangement representing romance and peace"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDL-J3B_jBGgvJhCrycJzrM164BtOldudoUGkysfJ1bSOdtCD3E6PnYQQkBUh9jG_JSQ-jDO4yLzd59dUvoT7QW_lH7pp94zuHerT4ZELff37V6_-kZ4V_EZTD7p7AHDYfy67qXaGwVQe1w7W-q93kbK-Fpksoxae-6Hplx-zZwPPlvQ74kZXbX-ra4aWABcF9niRIhVXowjR8iuttROUK_qZPX6fY3RjvJu31fcaZKa0v9-1KXw3shk3RrYGc19sIEigM"
          />
          <div className="quote-overlay" />
        </div>

        <div className="quote-content reveal-item">
          <h3>QS Ar-Rum : 21</h3>
          <p>
            &quot;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan 
            pasangan-pasangan untukmu dari jenismu sendiri, agar kamu 
            cenderung dan merasa tenteram kepadanya, dan Dia menjadikan 
            di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu 
            benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."&quot;
          </p>
        </div>
      </section>

      <section className="schedule-section reveal" id="schedule">
        <img className="section-ornament ornament-flower ornament-flower-schedule" src={bungaBatik} alt="" aria-hidden="true" />
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
            <p className="event-time">08.00 - selesai</p>
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
        <img className="section-ornament ornament-batik ornament-batik-story" src={batikBunga} alt="" aria-hidden="true" />
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
        <img className="section-ornament ornament-flower ornament-flower-gallery" src={bungaBatik} alt="" aria-hidden="true" />
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

        <section className="gift-section reveal" id="gift">
        <img className="section-ornament ornament-batik ornament-batik-gift" src={batikBunga} alt="" aria-hidden="true" />
          <div className="gift-inner">
            <div className="gift-heading reveal-item">
              <p className="eyebrow">UNGKAPAN KASIH</p>
              <h2>Gift</h2>
              <p>
                Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi
                adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
              </p>
            </div>

            <div className="gift-grid">
              <article className="gift-card reveal-card">
                <span className="material-symbols-outlined gift-icon">account_balance</span>
                <h3>Mahendra</h3>
                <p className="gift-bank">BRI</p>
                <div className="gift-account-row">
                  <p className="gift-account">028501088671504</p>
                  <button
                    className="copy-account-button"
                    type="button"
                    aria-label="Salin nomor rekening Mahendra"
                    onClick={() => handleCopyAccount('028501088671504')}
                  >
                    <span className="material-symbols-outlined">content_copy</span>
                    {copiedAccount === '028501088671504' ? 'COPIED' : 'COPY'}
                  </button>
                </div>
                <p className="gift-owner">MAHENDRA SURYA TRISUMA</p>
              </article>

              <article className="gift-card reveal-card">
                <span className="material-symbols-outlined gift-icon">account_balance</span>
                <h3>Annisa</h3>
                <p className="gift-bank">BCA</p>
                <div className="gift-account-row">
                  <p className="gift-account">3520522769</p>
                  <button
                    className="copy-account-button"
                    type="button"
                    aria-label="Salin nomor rekening Annisa"
                    onClick={() => handleCopyAccount('3520522769')}
                  >
                    <span className="material-symbols-outlined">content_copy</span>
                    {copiedAccount === '3520522769' ? 'COPIED' : 'COPY'}
                  </button>
                </div>
                <p className="gift-owner">ANNISA FIRDAUS</p>
              </article>
            </div>
          </div>
        </section>

        <section className="wishes-section reveal" id="wishes">
          <img className="section-ornament ornament-flower ornament-flower-wishes" src={bungaBatik} alt="" aria-hidden="true" />
          <div className="wishes-inner">
            <div className="wishes-heading reveal-item">
              <p className="eyebrow">DOA DAN UCAPAN</p>
              <h2>Best Wishes</h2>
              <p>Sampaikan doa dan ucapan terbaik Anda</p>
            </div>

            <form className="wishes-form reveal-card" onSubmit={handleWishSubmit}>
              <label className="field-group">
                <span>Nama</span>
                <input name="name" type="text" placeholder="Nama Anda" required />
              </label>
              <label className="field-group">
                <span>Ucapan</span>
                <textarea
                  name="message"
                  placeholder="Tuliskan doa dan ucapan terbaik Anda..."
                  rows={4}
                  required
                />
              </label>
              <fieldset className="field-group attendance-group">
                <span>Konfirmasi Kehadiran</span>
                <div className="attendance-options">
                  <label className="attendance-option">
                    <input name="attendance" type="radio" value="Hadir" defaultChecked required />
                    <span className="attendance-choice">
                      <span className="material-symbols-outlined">check</span>
                      Hadir
                    </span>
                  </label>
                  <label className="attendance-option">
                    <input name="attendance" type="radio" value="Tidak Hadir" />
                    <span className="attendance-choice">
                      <span className="material-symbols-outlined">close</span>
                      Tidak Hadir
                    </span>
                  </label>
                </div>
              </fieldset>
              <button className="primary-button wishes-button" type="submit" disabled={wishSending}>
                <span className="material-symbols-outlined">send</span>
                {wishSending ? 'MENGIRIM...' : 'KIRIM UCAPAN'}
              </button>
              {wishError && <p className="wish-error" role="alert">{wishError}</p>}
            </form>

            <div className="wishes-list reveal-item" aria-live="polite">
              <h3>Ucapan dan Doa</h3>
              {wishesLoading ? (
                <p className="wishes-empty">Memuat ucapan...</p>
              ) : wishes.length === 0 ? (
                <p className="wishes-empty">Belum ada ucapan. Jadilah yang pertama menyampaikan doa.</p>
              ) : (
                wishes.map((wish, index) => (
                  <article className="wish-card" key={`${wish.name}-${index}`}>
                    <div className="wish-card-heading">
                      <h4>{wish.name}</h4>
                      <span className="wish-attendance">{wish.attendance}</span>
                    </div>
                    <p>{wish.message}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="closing-section reveal">
        <img className="section-ornament ornament-cloud ornament-cloud-closing" src={batikAwan} alt="" aria-hidden="true" />
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

      {wishSuccess && (
        <div className="wish-modal-backdrop" role="presentation">
          <div className="wish-modal" role="alertdialog" aria-modal="true" aria-labelledby="wish-modal-title">
            <div className="wish-modal-check" aria-hidden="true">
              <span className="material-symbols-outlined">check</span>
            </div>
            <h3 id="wish-modal-title">Pesan Anda sudah dikirim</h3>
            <button className="primary-button wish-modal-button" type="button" onClick={() => setWishSuccess(false)}>
              TUTUP
            </button>
          </div>
        </div>
      )}

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
