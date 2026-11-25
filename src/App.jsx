import { useEffect, useState } from 'react'
import { Toast, ToastContainer, Button } from 'react-bootstrap'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import Features, { StatsStrip } from './components/Features.jsx'
import Calculators from './components/Calculators.jsx'
import HealthCheck from './components/HealthCheck.jsx'
import BookingModal from './components/Booking.jsx'
import Account from './components/Account.jsx'
import Admin from './components/Admin.jsx'
import { LearningCentre, LegalModal } from './components/Learn.jsx'
import { Journey, Pricing, Faq, Contact, Footer } from './components/Sections.jsx'
import About from './components/About.jsx'
import { PageHeader, HomeForm, HomeServices, HomeTools, PageCta } from './components/Pages.jsx'
import { useStore, SERVICE_OPTIONS } from './services/store.jsx'

const SERVICE_TOPIC = { loans: 'Personal loan', sip: 'SIP & mutual funds', wealth: 'Portfolio review', planning: 'Financial planning', insurance: 'Insurance' }
const PLAN_TOPIC = { Consultation: 'Financial planning', 'Annual Plan': 'Financial planning', 'Portfolio Report': 'Portfolio review' }
// Hash routes (#name). Old section anchors map onto the new pages.
const ROUTES = {
  '': 'home', home: 'home', callback: 'home', 'why-us': 'home', how: 'home',
  services: 'services', tools: 'calculators', calculators: 'calculators', 'health-check': 'health',
  learn: 'learn', pricing: 'pricing', faq: 'pricing', about: 'about', contact: 'contact',
  account: 'account', admin: 'admin',
}
const hashName = () => window.location.hash.replace('#', '')
const routeOf = () => ROUTES[hashName()] || 'home'

export default function App() {
  const { addEnquiry } = useStore()
  const [page, setPage] = useState(routeOf)
  const [service, setService] = useState('loans')
  const [book, setBook] = useState({ open: false, topic: '' })
  const [legal, setLegal] = useState(null)
  const [toast, setToast] = useState(null)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onHash = () => { setPage(routeOf()); land() }
    const onScroll = () => setShowTop(window.scrollY > 700)
    window.addEventListener('hashchange', onHash)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('scroll', onScroll) }
  }, [])
  // Land at the top of the page, or at the contact form for #contact
  const land = () => setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, 60)
  useEffect(() => { land() }, []) // eslint-disable-line

  const TITLES = {
    home: 'Finance Bros — Loans, SIPs & Financial Planning',
    services: 'Services · Finance Bros', calculators: 'Financial Calculators · Finance Bros', health: 'Portfolio Health Check · Finance Bros',
    learn: 'Learning Centre · Finance Bros', pricing: 'Pricing & FAQ · Finance Bros', about: 'About Us · Finance Bros', contact: 'Contact · Finance Bros', account: 'My Account · Finance Bros', admin: 'Admin · Finance Bros',
  }
  useEffect(() => { document.title = TITLES[page] || 'Finance Bros' }, [page]) // eslint-disable-line

  const openBook = (topic = '') => {
    const t = typeof topic === 'string' ? topic : ''
    setBook({ open: true, topic: SERVICE_OPTIONS.includes(t) ? t : PLAN_TOPIC[t] || '' })
  }
  const enquiryDone = (data) => {
    const rec = addEnquiry({ name: data.name, phone: data.phone, email: data.email, city: data.city, topic: data.topic, employment: data.employment, income: data.income, time: data.time, message: data.message, source: 'Contact form' })
    setToast(`Thanks ${data.name?.split(' ')[0] || ''}! Enquiry ${rec.ref} saved. Track it under My Account (demo mode: stored in this browser).`)
  }

  return (
    <>
      <Header onBook={() => openBook()} onService={setService} active={page} />
      <main key={page} className="page-fade">
        {page === 'home' && <>
          <Hero onBook={() => openBook()} onService={setService} />
          <StatsStrip />
          <HomeForm onDone={enquiryDone} />
          <HomeServices setService={setService} />
          <Features />
          <HomeTools />
          <Journey />
          <PageCta onBook={() => openBook()} />
        </>}
        {page === 'services' && <>
          <PageHeader crumb="Services" icon="bi-grid" title="Our services" sub="Loans, SIPs & mutual funds, portfolio reviews, financial planning, insurance and tax — explained simply." />
          <Services active={service} setActive={setService} onBook={() => openBook(SERVICE_TOPIC[service])} />
          <Journey />
          <PageCta onBook={() => openBook()} />
        </>}
        {page === 'calculators' && <>
          <PageHeader crumb="Calculators" icon="bi-calculator" title="Financial calculators" sub="EMI, SIP, eligibility, retirement, emergency fund, budget and savings goals — free and private." />
          <Calculators onBook={() => openBook()} />
          <PageCta onBook={() => openBook()} />
        </>}
        {page === 'health' && <>
          <PageHeader crumb="Health check" icon="bi-heart-pulse" title="Portfolio health check" sub="An indicative score for your investments in about a minute." />
          <HealthCheck onBook={openBook} />
          <PageCta onBook={() => openBook()} />
        </>}
        {page === 'learn' && <>
          <PageHeader crumb="Learn" icon="bi-book" title="Learning centre" sub="Short, jargon-free guides on loans, investing, tax and insurance." />
          <LearningCentre onBook={() => openBook()} />
          <PageCta onBook={() => openBook()} />
        </>}
        {page === 'pricing' && <>
          <PageHeader crumb="Pricing & FAQ" icon="bi-tag" title="Pricing & FAQ" sub="Simple fees, disclosed up front. Start free." />
          <Pricing onBook={openBook} />
          <Faq />
          <PageCta onBook={() => openBook()} />
        </>}
        {page === 'about' && <>
          <PageHeader crumb="About us" icon="bi-people" title="About Finance Bros" sub="Founded by two brothers — a Chartered Accountant and an MBA." />
          <About onBook={() => openBook()} />
          <PageCta onBook={() => openBook()} />
        </>}
        {page === 'contact' && <>
          <PageHeader crumb="Contact" icon="bi-chat-dots" title="Contact us" sub="Call, WhatsApp, email or send a message — we reply within one working day." />
          <Contact onDone={enquiryDone} />
        </>}
        {page === 'account' && <Account onBook={openBook} />}
        {page === 'admin' && <Admin />}
      </main>
      <Footer onLegal={setLegal} />

      <BookingModal show={book.open} topic={book.topic} onHide={() => setBook({ open: false, topic: '' })} />
      <LegalModal which={legal} onHide={() => setLegal(null)} />

      <ToastContainer position="bottom-center" className="p-3" style={{ zIndex: 1080 }}>
        <Toast show={!!toast} onClose={() => setToast(null)} delay={7000} autohide className="toast-fb border-0">
          <Toast.Body className="d-flex gap-2 align-items-start">
            <i className="bi bi-check-circle-fill" style={{ color: 'var(--lime)' }} />
            <span className="flex-grow-1">{toast}</span>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setToast(null)} />
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {showTop && (
        <Button className="btn-olive back-top p-0" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0 })}>
          <i className="bi bi-arrow-up" />
        </Button>
      )}
    </>
  )
}
