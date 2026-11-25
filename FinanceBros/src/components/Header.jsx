import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap'
import { useStore } from '../services/store.jsx'

export const IG_URL = 'https://www.instagram.com/finance.bros.in/'

export function Brand() {
  return (
    <span className="d-inline-flex align-items-center gap-2">
      <span className="brand-mark" aria-hidden="true">FB</span>
      <span className="brand-name">Finance<span>Bros</span></span>
    </span>
  )
}

const SERVICE_LINKS = [
  ['loans', 'bi-bank', 'Loans & credit', 'Eligibility, EMIs, balance transfer'],
  ['sip', 'bi-graph-up-arrow', 'SIP & mutual funds', 'Plan and review your SIPs'],
  ['wealth', 'bi-pie-chart', 'Investment & portfolio', 'Portfolio health report'],
  ['planning', 'bi-clipboard-check', 'Financial planning', 'Budget, goals, retirement'],
  ['insurance', 'bi-shield-check', 'Insurance & tax', 'Cover, claims and ITR help'],
]
const TOOL_LINKS = [
  ['calculators', 'bi-calculator', 'Financial calculators', 'EMI, SIP, eligibility, retirement & more'],
  ['health-check', 'bi-heart-pulse', 'Portfolio health check', 'Your score out of 100 in a minute'],
]

function MenuItem({ href, icon, title, sub, onClick }) {
  return (
    <NavDropdown.Item href={href} onClick={onClick} className="mega-item">
      <span className="mi-icon"><i className={`bi ${icon}`} /></span>
      <span><span className="mi-title">{title}</span><span className="mi-sub">{sub}</span></span>
    </NavDropdown.Item>
  )
}

export default function Header({ onBook, onService, active }) {
  const { user } = useStore()
  return (
    <>
      <div className="topbar py-2 d-none d-lg-block">
        <Container className="d-flex justify-content-between align-items-center gap-3">
          <div className="d-flex gap-4 text-nowrap">
            <span><i className="bi bi-telephone me-2" />+91 90000 00000</span>
            <span><i className="bi bi-envelope me-2" />hello@financebros.in</span>
          </div>
          <div className="d-flex gap-3 align-items-center text-nowrap">
            <span className="opacity-75 d-none d-xl-inline">Free calculators · No spam · Transparent fees</span>
            <a href={IG_URL} target="_blank" rel="noreferrer"><i className="bi bi-instagram me-1" />@finance.bros.in</a>
          </div>
        </Container>
      </div>

      <Navbar expand="lg" sticky="top" className="navbar-fb" collapseOnSelect>
        <Container>
          <Navbar.Brand href="#home" aria-label="Finance Bros home"><Brand /></Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="mx-auto main-links">
              <Nav.Link href="#home" active={active === 'home'}>Home</Nav.Link>
              <NavDropdown title="Services" id="svc-dd" active={active === 'services'} className="mega">
                {SERVICE_LINKS.map(([k, icon, t, s]) => <MenuItem key={k} href="#services" icon={icon} title={t} sub={s} onClick={() => onService(k)} />)}
                <NavDropdown.Divider />
                <NavDropdown.Item href="#services" className="fw-semibold small text-olive">View all services <i className="bi bi-arrow-right" /></NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Tools" id="tools-dd" active={active === 'calculators' || active === 'health'} className="mega">
                {TOOL_LINKS.map(([h, icon, t, s]) => <MenuItem key={h} href={`#${h}`} icon={icon} title={t} sub={s} />)}
              </NavDropdown>
              <Nav.Link href="#learn" active={active === 'learn'}>Learn</Nav.Link>
              <Nav.Link href="#pricing" active={active === 'pricing'}>Pricing</Nav.Link>
              <Nav.Link href="#about" active={active === 'about'}>About</Nav.Link>
              <Nav.Link href="#contact" active={active === 'contact'}>Contact</Nav.Link>
            </Nav>
            <div className="nav-actions">
              <Button className="btn-ghost btn-nav" href="#account" aria-label={user ? 'My account' : 'Log in'}>
                <i className={`bi ${user ? 'bi-person-check' : 'bi-person'}`} />
                <span>{user ? user.name.split(' ')[0] : 'Log in'}</span>
              </Button>
              <Button className="btn-olive btn-nav" onClick={onBook}><i className="bi bi-calendar-check" /><span>Book a call</span></Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}
