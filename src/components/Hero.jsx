import { Container, Row, Col, Button } from 'react-bootstrap'

/*
  HERO PHOTO
  To use a real photo (recommended for launch), put a licensed image at src/assets/hero.jpg, then:
    import heroPhoto from '../assets/hero.jpg'
    const HERO_PHOTO = heroPhoto
  Leave it empty to use the built-in illustrated office scene.
*/
import heroPhoto from '../assets/hero.jpg'
const HERO_PHOTO = heroPhoto

const QUICK = [
  ['loans', 'bi-bank', 'Loans'],
  ['sip', 'bi-graph-up-arrow', 'SIP & Mutual Funds'],
  ['wealth', 'bi-pie-chart', 'Portfolio Review'],
  ['planning', 'bi-clipboard-check', 'Financial Planning'],
]

/* Illustrated consultation scene: advisor with tablet, client gesturing, desk, laptop, shelves, window */
function OfficeScene() {
  const books = [[0, 14, '#8a8f80'], [16, 10, '#6f7466'], [28, 16, '#a3a796'], [46, 12, '#5d6254'], [60, 18, '#94988a'], [80, 10, '#777c6e'], [92, 14, '#b2b5a7']]
  return (
    <svg className="hero-scene-svg" viewBox="0 0 1440 720" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="wall" x1="0" x2="1"><stop offset="0" stopColor="#d9dbd2" /><stop offset="1" stopColor="#eceee6" /></linearGradient>
        <linearGradient id="win" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e4e7dc" /></linearGradient>
        <linearGradient id="desk" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#c9cbc0" /><stop offset="1" stopColor="#9fa296" /></linearGradient>
        <linearGradient id="suitM" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3b3f35" /><stop offset="1" stopColor="#24271f" /></linearGradient>
        <linearGradient id="suitW" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#55594d" /><stop offset="1" stopColor="#3c4036" /></linearGradient>
        <radialGradient id="light" cx=".85" cy=".25" r=".7"><stop offset="0" stopColor="#fff" stopOpacity=".7" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>

      {/* room */}
      <rect width="1440" height="720" fill="url(#wall)" />
      <rect x="0" y="470" width="1440" height="250" fill="#c3c5ba" />
      {/* window with blinds */}
      <rect x="1170" y="40" width="250" height="420" rx="4" fill="#9ea294" />
      <rect x="1182" y="52" width="226" height="396" fill="url(#win)" />
      {Array.from({ length: 18 }, (_, i) => <rect key={i} x="1182" y={60 + i * 22} width="226" height="6" fill="#d3d6ca" />)}
      <rect width="1440" height="720" fill="url(#light)" />

      {/* shelf unit */}
      <g transform="translate(760 110)">
        <rect width="260" height="370" fill="#b8bbae" />
        <rect x="8" y="8" width="244" height="354" fill="#cfd1c6" />
        {[92, 182, 272].map((y) => <rect key={y} x="8" y={y} width="244" height="8" fill="#a6a99c" />)}
        {[0, 1, 2].map((row) => (
          <g key={row} transform={`translate(${20 + row * 30} ${92 * row + 22})`}>
            {books.slice(row, row + 5).map(([x, w, c], i) => <rect key={i} x={x} y={i % 2 ? 6 : 0} width={w} height={i % 2 ? 64 : 70} fill={c} />)}
          </g>
        ))}
        <rect x="170" y="210" width="60" height="62" fill="#e8eae1" /><rect x="176" y="216" width="48" height="50" fill="#b6b9ac" />
        <circle cx="200" cy="140" r="18" fill="#8e9284" /><rect x="186" y="154" width="28" height="28" fill="#7b7f71" />
      </g>
      {/* plant on shelf top */}
      <g transform="translate(900 40)">
        <path d="M-20 70h40l-6 36h-28z" fill="#7c8072" />
        {[[-40, 20, -30], [-14, -10, -10], [16, -4, 15], [40, 22, 35], [0, 10, 0]].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y + 40} rx="14" ry="34" fill={i % 2 ? '#6b7160' : '#878c7b'} transform={`rotate(${r} ${x} ${y + 40})`} />
        ))}
      </g>

      {/* woman advisor (standing behind desk, holding tablet) */}
      <g transform="translate(640 0)">
        <ellipse cx="60" cy="610" rx="120" ry="20" fill="#000" opacity=".12" filter="url(#soft)" />
        <path d="M-10 330 q70 -40 140 0 l20 250 h-180z" fill="url(#suitW)" />
        <path d="M44 312 h32 l-16 70z" fill="#f1f2ec" />
        <rect x="46" y="290" width="28" height="30" fill="#c9b9a7" />
        <ellipse cx="60" cy="252" rx="34" ry="40" fill="#d6c6b3" />
        <path d="M24 250 q-4 -56 38 -58 q44 2 36 60 q-4 -30 -36 -34 q-30 2 -38 32z" fill="#3e3a33" />
        <circle cx="62" cy="196" r="16" fill="#3e3a33" />
        <rect x="40" y="246" width="18" height="9" rx="4" fill="none" stroke="#2b2b26" strokeWidth="2.5" />
        <rect x="64" y="246" width="18" height="9" rx="4" fill="none" stroke="#2b2b26" strokeWidth="2.5" />
        {/* arms + tablet */}
        <path d="M-6 340 q-22 90 30 140 l24 -16 q-34 -40 -20 -110z" fill="#4a4e43" />
        <path d="M126 340 q26 80 -10 130 l-26 -10 q22 -40 10 -110z" fill="#4a4e43" />
        <rect x="18" y="440" width="96" height="66" rx="6" fill="#2c2f28" transform="rotate(-8 66 473)" />
        <rect x="24" y="446" width="84" height="54" rx="3" fill="#c4c8b8" transform="rotate(-8 66 473)" />
      </g>

      {/* desk */}
      <path d="M380 560 L1440 520 L1440 720 L250 720 Z" fill="url(#desk)" />
      <path d="M380 560 L1440 520 L1440 540 L360 582 Z" fill="#dfe1d8" />
      {/* laptop */}
      <g transform="translate(860 430)">
        <path d="M0 0 h170 l10 110 h-190z" fill="#4b4f45" />
        <path d="M8 8 h154 l8 94 h-170z" fill="#a9ad9f" />
        <path d="M30 70 l30 -20 l25 12 l35 -30 l30 18" stroke="#e9ebe3" strokeWidth="5" fill="none" />
        <path d="M-24 110 h228 l18 18 h-264z" fill="#6c7064" />
      </g>
      {/* papers, cup, calculator */}
      <g transform="rotate(-6 560 610)"><rect x="500" y="590" width="130" height="90" fill="#f3f4ef" /><rect x="514" y="606" width="80" height="6" fill="#bcbfb2" /><rect x="514" y="620" width="100" height="6" fill="#d0d2c7" /><rect x="514" y="634" width="60" height="6" fill="#d0d2c7" /></g>
      <rect x="690" y="600" width="80" height="54" rx="6" fill="#3b3e36" transform="rotate(8 730 627)" /><rect x="700" y="606" width="60" height="12" fill="#a9ad9f" transform="rotate(8 730 627)" />
      <path d="M1100 560 h46 l-6 50 h-34z" fill="#eef0e8" /><path d="M1146 572 q18 4 2 22" stroke="#eef0e8" strokeWidth="6" fill="none" />

      {/* man client (foreground right, gesturing) */}
      <g transform="translate(1120 0)">
        <path d="M-120 380 q150 -90 300 0 l40 340 h-380z" fill="url(#suitM)" />
        <path d="M20 300 h56 l-28 110z" fill="#e9eae4" />
        <path d="M40 318 h16 l6 70 l-14 18 l-14 -18z" fill="#1F7A45" />
        <rect x="26" y="262" width="44" height="50" fill="#b9a48f" />
        <ellipse cx="48" cy="216" rx="50" ry="58" fill="#c7b29c" />
        <path d="M-4 214 q-6 -76 54 -78 q60 2 52 76 q-8 -40 -52 -44 q-44 4 -54 46z" fill="#2c2924" />
        <ellipse cx="-2" cy="226" rx="8" ry="14" fill="#bba591" />
        {/* arm pointing toward advisor */}
        <path d="M-90 400 q-60 10 -150 -20 l-10 34 q90 40 170 26z" fill="#2f322a" />
        <ellipse cx="-252" cy="396" rx="22" ry="16" fill="#c7b29c" />
      </g>
    </svg>
  )
}

export default function Hero({ onBook, onService }) {
  return (
    <section className="hero hero-photo-style" id="home">
      {/* image layer */}
      <div className="hero-media" aria-hidden="true">
        {HERO_PHOTO ? <img src={HERO_PHOTO} alt="" className="hero-photo" /> : <OfficeScene />}
      </div>
      {/* olive diagonal shadows (the reference's orange shapes, in brand olive) */}
      <svg className="hero-planes" viewBox="0 0 1440 720" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="shade" x1="0" x2="1">
            <stop offset="0" stopColor="#121513" stopOpacity=".72" />
            <stop offset=".55" stopColor="#121513" stopOpacity=".38" />
            <stop offset="1" stopColor="#121513" stopOpacity=".12" />
          </linearGradient>
        </defs>
        <rect width="1440" height="720" fill="url(#shade)" />
        <polygon points="0,0 820,0 0,690" fill="#1F7A45" opacity=".93" />
        <polygon points="0,0 420,0 0,360" fill="#2A2F2C" opacity=".55" />
        <polygon points="0,330 620,720 0,720" fill="#1C201E" opacity=".72" />
        <polygon points="300,720 760,420 980,720" fill="#15603A" opacity=".45" />
        <polygon points="1440,720 1440,520 1150,720" fill="#2A2F2C" opacity=".75" />
      </svg>

      <Container>
        <Row>
          <Col lg={7} xl={6}>
            <span className="hero-chip mb-3"><i className="bi bi-patch-check-fill" style={{ color: '#8CC9A0' }} />Money, made simple — for every Indian earner</span>
            <h1 className="mb-3">Trusted guidance for your money.</h1>
            <p className="lead mb-4">Smarter loan decisions, clear SIP &amp; mutual fund guidance and honest financial planning — understand your numbers before you pay anything.</p>
            <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
              <Button className="btn-lime" size="lg" onClick={onBook}>Book a free call <i className="bi bi-arrow-right ms-1" /></Button>
              <a className="play-link" href="#tools">
                <span className="play"><i className="bi bi-calculator" /></span>Try free calculators
              </a>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {QUICK.map(([k, icon, label]) => (
                <a key={k} className="hero-quick" href="#services" onClick={() => onService(k)}><i className={`bi ${icon}`} />{label}</a>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
