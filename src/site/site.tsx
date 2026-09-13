import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import { StructuredData } from "@/components/StructuredData";

const PHONE_DISPLAY = "+38 (066) 930 30 07";
const PHONE_LINK = "tel:+380669303007";
const EMAIL = "comforthomevkieve@gmail.com";

const NAV = [
  { to: "/", label: "Головна", number: "01" },
  { to: "/remonty", label: "Ремонти", number: "02" },
  { to: "/budivnytstvo", label: "Будівництво", number: "03" },
  { to: "/dyzain", label: "Дизайн інтер'єру", number: "04" },
  { to: "/portfolio", label: "Портфоліо", number: "05" },
  { to: "/kontakty", label: "Контакти", number: "06" },
] as const;

const SERVICE_OPTIONS = [
  "Ремонт під ключ",
  "Будівництво будинку",
  "Дизайн інтерʼєру",
  "Комплектація матеріалами",
  "Консультація",
];

type LeadContextValue = {
  openLead: (service?: string) => void;
};

const LeadContext = createContext<LeadContextValue | null>(null);

function useLead() {
  const value = useContext(LeadContext);
  if (!value) throw new Error("Lead context is unavailable");
  return value;
}

function OpenLeadButton({ service, className, children }: { service: string; className?: string; children: ReactNode }) {
  const { openLead } = useLead();
  return <button type="button" className={className} onClick={() => openLead(service)}>{children}</button>;
}

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={down ? "icon-arrow icon-arrow-down" : "icon-arrow"}>
      {down ? <path d="M12 4v15m0 0-5-5m5 5 5-5" /> : <><path d="M7 7h10v10" /><path d="M7 17 17 7" /></>}
    </svg>
  );
}

function CloseIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5 5 19" /></svg>;
}

function MenuIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>;
}

function PhoneIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7.2 3.7 10 7.9 8.2 9.7c1.3 2.6 3.4 4.7 6 6l1.8-1.8 4.3 2.8v2.1c0 1.1-.9 2-2 2C10 20.3 3.7 14 3.2 5.7c0-1.1.9-2 2-2h2Z" /></svg>;
}

function MailIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" /><path d="m3 7 9 6 9-6" /></svg>;
}

function PinIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 10c0 5-5.5 10.2-7.4 11.8a1 1 0 0 1-1.2 0C9.5 20.2 4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
}

function MessageIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.9L3 20.5l1.5-4.8A8.5 8.5 0 1 1 21 11.5Z" /></svg>;
}

function StarIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" /></svg>;
}

function BrandMark() {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true" className="brand-mark">
      <path d="M4 24 A18 18 0 0 1 40 24" />
      <path d="M7 24 A15 15 0 0 1 37 24" strokeDasharray="0.5 2" opacity="0.7" />
      <g className="brand-mark-fill">
        <path d="M14 30V19l3-3v14Z" />
        <path d="M19 30V13l4-3v20Z" />
        <path d="M25 30V16l4-2v16Z" />
      </g>
      <path d="M11 31h22" />
    </svg>
  );
}

function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`wordmark ${dark ? "wordmark-dark" : ""}`}>
      <BrandMark />
      <span className="wordmark-copy">
        <span className="wordmark-name">Comfort <b>Home</b></span>
        <span className="wordmark-tag">Ремонти під ключ</span>
      </span>
    </span>
  );
}

function LeadModal({ open, initialService, onClose }: { open: boolean; initialService: string; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setPhoneError("");
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>("input, select, textarea, button");
    first?.focus();
    document.body.classList.add("modal-lock");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panel) return;
      const focusable = [...panel.querySelectorAll<HTMLElement>("button, input, select, textarea, a[href]")]
        .filter((element) => !element.hasAttribute("disabled"));
      if (!focusable.length) return;
      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-lock");
      previous?.focus();
    };
  }, [open, onClose]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") ?? "").replace(/[^\d+]/g, "");
    if (phone.replace(/\D/g, "").length < 10) {
      setPhoneError("Вкажіть, будь ласка, повний номер телефону.");
      return;
    }
    setPhoneError("");
    setSubmitted(true);
  }

  if (!open) return null;

  return (
    <div className="lead-modal" role="presentation">
      <button className="lead-modal-backdrop" type="button" onClick={onClose} aria-label="Закрити форму" />
      <div ref={panelRef} className="lead-modal-panel" role="dialog" aria-modal="true" aria-labelledby="lead-title">
        <div className="lead-modal-topline">
          <span>Заявка · Comfort Home</span>
          <button className="lead-modal-close" type="button" onClick={onClose} aria-label="Закрити форму">
            <CloseIcon />
          </button>
        </div>
        {submitted ? (
          <div className="lead-success" role="status">
            <span className="lead-success-number">01</span>
            <h2 id="lead-title">Форма готова.</h2>
            <p>Дані перевірені. Надсилання заявки буде активоване на фінальному етапі після підключення Telegram.</p>
            <button className="lead-success-action" type="button" onClick={onClose}>Повернутися на сайт <Arrow /></button>
          </div>
        ) : (
          <form className="lead-form" onSubmit={handleSubmit} noValidate>
            <p className="section-kicker">Коротко про ваш проєкт</p>
            <h2 id="lead-title">Готові обговорити простір?</h2>
            <p className="lead-form-intro">Залиште контакти та кілька деталей. Після підключення Telegram заявка одразу надходитиме команді.</p>
            <div className="lead-form-grid">
              <label className="lead-field">
                <span>Імʼя</span>
                <input name="name" autoComplete="name" placeholder="Як до вас звертатися" />
              </label>
              <label className="lead-field">
                <span>Телефон *</span>
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+38 (000) 000 00 00" required aria-describedby={phoneError ? "phone-error" : undefined} />
                {phoneError ? <small id="phone-error" className="field-error">{phoneError}</small> : null}
              </label>
              <label className="lead-field lead-field-wide">
                <span>Тип послуги</span>
                <select name="service" defaultValue={initialService || ""}>
                  <option value="">Оберіть напрямок</option>
                  {SERVICE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="lead-field lead-field-wide">
                <span>Коментар</span>
                <textarea name="comment" rows={4} placeholder="Площа, стан обʼєкта, бажані строки або інші деталі" />
              </label>
            </div>
            <div className="lead-form-footer">
              <p>Натискаючи «Надіслати», ви погоджуєтесь з обробкою персональних даних.</p>
              <button className="lead-submit" type="submit">Надіслати заявку <Arrow /></button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Header({ current }: { current: string }) {
  const { openLead } = useLead();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-lock", menuOpen);
    return () => document.body.classList.remove("menu-lock");
  }, [menuOpen]);

  return (
    <>
      <header className={`site-header ${current === "/kontakty" ? "site-header-light" : ""} ${scrolled ? "site-header-scrolled" : ""}`}>
        <div className="header-inner">
          <Link to="/" aria-label="Comfort Home — головна" className="header-logo"><Wordmark dark={current === "/kontakty"} /></Link>
          <nav className="desktop-nav" aria-label="Головна навігація">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className={current === item.to ? "active" : ""}>{item.label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <button className="header-consultation" type="button" onClick={() => openLead("Консультація")}>Консультація <Arrow /></button>
            <button className="menu-toggle" type="button" aria-label="Відкрити меню" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(true)}><MenuIcon /></button>
          </div>
        </div>
      </header>
      <button className={`menu-backdrop ${menuOpen ? "open" : ""}`} type="button" aria-label="Закрити меню" onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1} />
      <aside id="mobile-menu" className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen} aria-label="Мобільна навігація">
        <div className="mobile-menu-head">
          <Wordmark dark />
          <button type="button" aria-label="Закрити меню" className="menu-close" onClick={() => setMenuOpen(false)}><CloseIcon /></button>
        </div>
        <nav className="mobile-nav">
          <span className="mobile-menu-label">Меню</span>
          <ul>
            {NAV.map((item, index) => (
              <li key={item.to} style={{ "--delay": `${index * 45}ms` } as React.CSSProperties}>
                <Link to={item.to} className={current === item.to ? "active" : ""} onClick={() => setMenuOpen(false)}>
                  <span>{item.label}</span><span><small>{item.number}</small><Arrow /></span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-nav-footer">
            <button type="button" onClick={() => { setMenuOpen(false); openLead("Консультація"); }}>Отримати консультацію <Arrow /></button>
            <div><span>Телефон</span><a href={PHONE_LINK}>{PHONE_DISPLAY}</a></div>
          </div>
        </nav>
      </aside>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <FinalInvitation />
      <div className="footer-grid">
        <div className="footer-brand">
          <Wordmark />
          <p>Команда, що виконує ремонти під ключ, реалізує дизайн-проєкти та будує приватні будинки і котеджі. Повний цикл — від ідеї до готового результату.</p>
        </div>
        <div className="footer-column">
          <span>Послуги</span>
          <Link to="/remonty">Ремонти під ключ</Link>
          <Link to="/budivnytstvo">Будівництво будинків</Link>
          <Link to="/dyzain">Дизайн інтер'єру</Link>
          <Link to="/portfolio">Реалізовані проєкти</Link>
        </div>
        <div className="footer-column footer-contacts">
          <span>Контакти</span>
          <a className="footer-phone" href={PHONE_LINK}>{PHONE_DISPLAY}</a>
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <p>Україна — виїзд по обʼєктах<br />Київ · область</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 COMFORT HOME. Усі права захищено.</span>
        <span>Ремонти <i /> Дизайн <i /> Будівництво</span>
      </div>
      <div className="footer-ghost" aria-hidden="true">Comfort Home</div>
    </footer>
  );
}

function FinalInvitation() {
  const { openLead } = useLead();
  return (
    <div className="final-invitation">
      <div>
        <p>— З думкою про деталі</p>
        <h2>Готові обговорити ваш простір?</h2>
        <span>Залиште заявку — ми зв'яжемося, щоб коротко обговорити задачу, бюджет та орієнтовні строки.</span>
      </div>
      <div className="final-actions">
        <button type="button" onClick={() => openLead("Консультація")}>Залишити заявку <Arrow /></button>
        <a href="https://g.page/r/CYEup9Ivtv9gEBE/review" target="_blank" rel="noreferrer">Залишити відгук у Google <Arrow /></a>
      </div>
    </div>
  );
}

function FloatingCall() {
  return <a className="floating-call" href={PHONE_LINK} aria-label={`Подзвонити ${PHONE_DISPLAY}`}><PhoneIcon /></a>;
}

function NextStep() {
  const { openLead } = useLead();
  return (
    <section className="next-step">
      <div>
        <p>Наступний крок</p>
        <h2>Плануєте ремонт, дизайн або будівництво?</h2>
        <span>Залиште заявку — підкажемо, з чого почати, та запропонуємо оптимальний формат співпраці.</span>
      </div>
      <div className="next-step-actions">
        <button type="button" onClick={() => openLead("Консультація")}>Залишити заявку <Arrow /></button>
        <a href={PHONE_LINK}><small>Подзвонити</small>{PHONE_DISPLAY}</a>
      </div>
    </section>
  );
}

function SiteLayout({ current, children, schema = false }: { current: string; children: ReactNode; schema?: boolean }) {
  const [leadOpen, setLeadOpen] = useState(false);
  const [service, setService] = useState("");
  const openLead = (nextService = "") => {
    setService(nextService);
    setLeadOpen(true);
  };
  return (
    <LeadContext.Provider value={{ openLead }}>
      {schema ? <StructuredData json={BUSINESS_SCHEMA} /> : null}
      <Header current={current} />
      <main className="site-main">{children}</main>
      <SiteFooter />
      <FloatingCall />
      <LeadModal open={leadOpen} initialService={service} onClose={() => setLeadOpen(false)} />
    </LeadContext.Provider>
  );
}

const BUSINESS_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.comforthome.kyiv.ua/#organization",
      name: "COMFORT HOME",
      url: "https://www.comforthome.kyiv.ua",
      logo: "https://www.comforthome.kyiv.ua/brand/comfort-home-logo.png",
      email: EMAIL,
      telephone: "+380669303007",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.comforthome.kyiv.ua/#website",
      name: "COMFORT HOME",
      url: "https://www.comforthome.kyiv.ua",
      publisher: { "@id": "https://www.comforthome.kyiv.ua/#organization" },
      inLanguage: "uk-UA",
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://www.comforthome.kyiv.ua/#service",
      name: "COMFORT HOME",
      url: "https://www.comforthome.kyiv.ua",
      description: "Ремонти квартир і будинків під ключ, дизайн інтерʼєру та будівництво приватних будинків.",
      areaServed: ["Київ", "Київська область", "Україна"],
      serviceType: ["Ремонт під ключ", "Будівництво будинків", "Дизайн інтерʼєру"],
      telephone: "+380669303007",
      email: EMAIL,
      provider: { "@id": "https://www.comforthome.kyiv.ua/#organization" },
    },
  ],
});

function SectionIntro({ number, label, title, text, light = false }: { number: string; label: string; title: ReactNode; text?: string; light?: boolean }) {
  return (
    <div className={`section-intro ${light ? "section-intro-light" : ""}`}>
      <p className="section-kicker"><span>{number}</span>{label}</p>
      <h2>{title}</h2>
      {text ? <p className="section-copy">{text}</p> : null}
    </div>
  );
}

function HomeHero() {
  const { openLead } = useLead();
  return (
    <section className="home-hero" aria-label="Головний екран">
      <img src="/projects/varshavsky-living-hero.jpg" alt="Інтерʼєр квартири у ЖК Варшавський — вітальня з природним деревом, мʼякими тонами та архітектурним освітленням" />
      <div className="hero-shade" />
      <div className="home-hero-inner">
        <div className="hero-meta"><span />Est. 2014 — Україна <i /> <b>Архітектура · Інтерʼєр · Будівництво</b></div>
        <h1>Ремонт квартир <em>і будинків</em>{" "}<br className="hero-title-break" />під ключ.</h1>
        <div className="hero-lower">
          <p>Виконуємо повний цикл ремонтних робіт — від демонтажу та чорнових процесів до чистового оздоблення, комплектації матеріалами та здачі готового обʼєкта.</p>
          <div className="hero-actions">
            <button type="button" onClick={() => openLead("Ремонт під ключ")}>Обговорити проєкт <Arrow /></button>
            <Link to="/portfolio">Переглянути роботи <Arrow /></Link>
          </div>
        </div>
      </div>
      <div className="hero-foot"><span><Arrow down /> Ремонт під ключ · Чорнові · Чистові · Комплектація</span><span>120+ обʼєктів</span></div>
    </section>
  );
}

const STATS = [
  ["Досвід", "10+", "років"],
  ["Обʼєктів", "120+", ""],
  ["Команда", "35", "спец."],
  ["Гарантія", "3", "роки"],
];

const HOME_SERVICES = [
  { to: "/remonty", number: "01", title: "Ремонти під ключ", text: "Повний цикл робіт для квартир і будинків: від чорнових процесів до чистового оздоблення.", tags: ["Демонтаж", "Чорнові", "Чистові", "Комплектація"], image: "/projects/varshavsky-marble-kitchen.jpg", alt: "Кухня з мармуровою стільницею — ЖК Варшавський" },
  { to: "/budivnytstvo", number: "02", title: "Будівництво будинків і котеджів", text: "Комплексне будівництво приватних будинків, котеджів та заміських обʼєктів — від фундаменту до здачі.", tags: ["Фундамент", "Коробка", "Покрівля", "Фасад"], image: "/projects/varshavsky-living-view.jpg", alt: "Вітальня з панорамним видом — ЖК Варшавський" },
  { to: "/dyzain", number: "03", title: "Дизайн інтерʼєру", text: "Розробка дизайн-проєктів, планувальних рішень, візуалізацій та повної технічної документації.", tags: ["Планування", "3D-візуалізації", "Креслення", "Авторський нагляд"], image: "/projects/varshavsky-bedroom.jpg", alt: "Спальня преміум-класу у теплих тонах" },
] as const;

const REVIEWS = [
  ["Олена К.", "ЖК Варшавський", "Ремонт квартири · 83 м²", "Замовляли ремонт квартири під ключ. Команда взяла на себе всі етапи — від демонтажу до фінального прибирання. Все було зрозуміло й організовано."],
  ["Андрій М.", "ЖК Діброва парк", "Ремонт квартири · 72 м²", "Сподобалось, що кошторис був прозорий, а роботи виконувалися поетапно. Результат виглядає дуже якісно."],
  ["Ірина та Віктор С.", "Будинок СофБо", "Ремонт будинку · 145 м²", "Робили ремонт будинку. Допомогли з матеріалами, контролем робіт і фінальною здачею. Результатом задоволені."],
  ["Марина Л.", "Сирецькі Сади", "Ремонт квартири · 78 м²", "Повний ремонт кухні-вітальні з нуля. Особливо сподобався підхід до деталей та якість чистових робіт. Рекомендуємо."],
  ["Олексій Д.", "Чорна кухня", "Кухня-вітальня · темний інтерʼєр", "Замовляли дизайн-проєкт та ремонт. Все виконали в обумовлені терміни. Приємно здивовані якістю та відповідальністю команди."],
];

function VideoReview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    video.controls = true;
    void video.play();
  };
  return (
    <section className="video-review">
      <div className="video-heading">
        <SectionIntro number="04" label="Відгук клієнта" title={<>Відеовідгук <em>після ремонту.</em></>} text="Реальний відгук клієнта після завершення ремонту під ключ. Найкраща рекомендація — це задоволений замовник." light />
      </div>
      <div className="video-stage">
        <video ref={videoRef} playsInline preload="metadata" poster="/media/client-review-poster.jpg" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
          <source src="/media/client-review.mp4" type="video/mp4" />
          Ваш браузер не підтримує відео.
        </video>
        {!playing ? <button type="button" onClick={play} aria-label="Відтворити відеовідгук"><span>▶</span></button> : null}
        <p>Реальний відгук клієнта після завершення ремонту під ключ</p>
      </div>
    </section>
  );
}

export function HomePage() {
  const process = [
    ["01", "Консультація", "Знайомство, обговорення задачі, орієнтовних строків та бюджету."],
    ["02", "Планування", "Замір обʼєкта, формування технічного завдання та плану робіт."],
    ["03", "Кошторис", "Прозорий розрахунок етапів, матеріалів та робочих позицій."],
    ["04", "Виконання", "Поетапна реалізація, контроль якості та звітність по обʼєкту."],
    ["05", "Здача обʼєкта", "Прибирання, фінальна перевірка та передача замовнику."],
  ];
  return (
    <SiteLayout current="/" schema>
      <HomeHero />
      <section className="about-section page-section">
        <div className="about-copy">
          <SectionIntro number="01" label="Про студію" title={<>Ремонти під ключ — <em>без клопоту для вас.</em></>} />
          <p>COMFORT HOME спеціалізується на ремонтах квартир під ключ, ремонтах будинків під ключ та ремонтах комерційних приміщень. Виконуємо чорнові та чистові роботи будь-якої складності.</p>
          <p>Ми беремо на себе повний цикл: комплектацію матеріалами, організацію процесу, контроль якості та здачу готового обʼєкта. Дизайн і будівництво — як додаткові послуги.</p>
          <div className="stats-grid">
            {STATS.map(([label, value, suffix]) => <div key={label}><span>{label}</span><strong>{value}</strong><small>{suffix}</small></div>)}
          </div>
        </div>
      </section>
      <div className="service-marquee" aria-label="Напрямки роботи"><div>Ремонти під ключ · Дизайн інтерʼєру · Будівництво · Авторський нагляд · Контроль якості · Комплектація матеріалами · Кошториси без сюрпризів · Ремонти під ключ · Дизайн інтерʼєру · Будівництво ·</div></div>
      <section className="services-section page-section">
        <SectionIntro number="02" label="Напрямки роботи" title={<>Три напрямки — <em>один підхід до якості.</em></>} text="Ми обʼєднуємо архітектурне мислення, інженерну точність та увагу до деталі. Це дозволяє вести проєкт від першого ескізу до останнього монтажу — без посередників." />
        <ul className="services-grid">
          {HOME_SERVICES.map((service) => <li key={service.to}><Link to={service.to}><figure><img src={service.image} alt={service.alt} /><span>— {service.number}</span><b><Arrow /></b></figure><h3>{service.title}</h3><p>{service.text}</p><ul>{service.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></Link></li>)}
        </ul>
      </section>
      <section className="home-portfolio page-section">
        <div className="portfolio-heading-row">
          <SectionIntro number="03" label="Портфоліо ремонтів" title={<>Реальні обʼєкти, <em>де ми працювали.</em></>} />
          <Link to="/portfolio" className="portfolio-all">Переглянути всі роботи <Arrow /></Link>
        </div>
        <div className="home-project-grid">
          <figure className="project-tall"><img src="/projects/varshavsky-living-view.jpg" alt="Вітальня з оксамитовим зеленим диваном та видом на місто — ЖК Варшавський" /><figcaption><span>Ремонт квартири під ключ · 83 м²</span><b>ЖК Варшавський</b></figcaption></figure>
          <figure className="project-wide"><img src="/projects/syrets-dining.jpg" alt="Обідня зона з відкритою бетонною стелею, графічним освітленням та теплим дубом" /><figcaption><span>Ремонт + дизайн-проєкт · 78 м²</span><b>Сирецькі Сади</b></figcaption></figure>
          <figure className="project-small"><img src="/projects/dibrova-kitchen.jpg" alt="Світла кухня з мармуровим фартухом та архітектурним освітленням" /><figcaption><span>Квартира · 72 м²</span><b>ЖК Діброва парк</b></figcaption></figure>
          <figure className="project-medium"><img src="/projects/dibrova-bedroom.jpg" alt="Спальня у мʼяких бежевих тонах з видом на місто" /><figcaption><span>Приватний будинок · 145 м²</span><b>Будинок СофБо</b></figcaption></figure>
        </div>
      </section>
      <VideoReview />
      <section className="reviews-section page-section">
        <SectionIntro number="05" label="Відгуки клієнтів" title={<>Що кажуть <em>наші клієнти.</em></>} text="Кожен проєкт — це довіра. Ми цінуємо зворотний звʼязок і робимо все, щоб результат перевершував очікування." />
        <div className="reviews-scroll">
          {REVIEWS.map(([name, place, scope, quote], index) => <article key={name}><span>“</span><blockquote>{quote}</blockquote><footer><strong>{name}</strong><small>{place}<br />{scope}</small><b>0{index + 1}</b></footer></article>)}
        </div>
        <a className="review-link" href="https://g.page/r/CYEup9Ivtv9gEBE/review" target="_blank" rel="noreferrer">Залишити відгук у Google <Arrow /></a>
      </section>
      <section className="process-section page-section">
        <SectionIntro number="06" label="Процес роботи" title={<>Прозоро. Поетапно. <em>Без сюрпризів.</em></>} text="Ми працюємо за чітким циклом, де кожна стадія документується, узгоджується та має фіксований результат." light />
        <ol className="process-list">{process.map(([number, title, text]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
      </section>
      <section className="architecture-section page-section">
        <div>
          <SectionIntro number="07" label="Архітектурний підхід" title={<>Працюємо по чіткому проєкту, <em>а не навмання.</em></>} />
          <p>У роботі використовуємо плани обмірів, демонтажу, монтажу, електрики, сантехніки, освітлення, оздоблення та специфікації матеріалів. Це гарантує точність кошторису та відсутність сюрпризів на обʼєкті.</p>
          <ol>{["Плани обмірів", "Плани демонтажу", "Плани монтажу", "Плани електрики", "Плани сантехніки", "Плани освітлення", "Плани оздоблення", "Специфікації матеріалів"].map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol>
        </div>
        <figure><img src="/projects/varshavsky-dining.jpg" alt="Сучасний інтерʼєр — ЖК Варшавський" /><figcaption><span>Sheet · A-101</span><em>scale 1:50</em></figcaption></figure>
      </section>
      <NextStep />
    </SiteLayout>
  );
}

type ServiceHeroProps = { numeral: string; label: string; title: ReactNode; text: string; image: string; alt: string };

function ServiceHero({ numeral, label, title, text, image, alt }: ServiceHeroProps) {
  return (
    <section className="service-hero">
      <img src={image} alt={alt} />
      <div className="hero-shade" />
      <div className="service-hero-content">
        <p>{numeral} <span>{label}</span></p>
        <h1>{title}</h1>
        <div className="service-hero-copy">{text}</div>
      </div>
    </section>
  );
}

function ServiceLeadBand({ eyebrow, title, text, service, action }: { eyebrow: string; title: string; text: string; service: string; action: string }) {
  const { openLead } = useLead();
  return (
    <section className="service-lead-band">
      <p>{eyebrow}</p><h2>{title}</h2><span>{text}</span>
      <button type="button" onClick={() => openLead(service)}>{action} <Arrow /></button>
    </section>
  );
}

export function RepairsPage() {
  const items = ["Демонтажні роботи", "Чорнові роботи", "Сантехніка", "Електрика", "Стелі, підлога, стіни", "Плитка", "Декоративні покриття", "Чистове оздоблення", "Комплектація матеріалами"];
  return (
    <SiteLayout current="/remonty">
      <ServiceHero numeral="І" label="Послуга 01" title={<>Ремонти під ключ для квартир <em>і будинків</em></>} text="Виконуємо повний цикл ремонтних робіт — від чорнових етапів до готового інтерʼєру. Працюємо за дизайн-проєктом, з прозорим кошторисом та авторським наглядом." image="/projects/varshavsky-marble-kitchen.jpg" alt="Кухня з мармуровою стільницею — ЖК Варшавський" />
      <section className="service-list-section page-section">
        <SectionIntro number="01" label="Що входить" title={<>Кожен етап — <em>під нашим контролем</em></>} text="Від демонтажу до фінальної комплектації меблями та декором. Ми не передаємо обʼєкт іншим підрядникам — все ведемо самі." />
        <ol>{items.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><Arrow /></li>)}</ol>
      </section>
      <section className="method-section page-section">
        <div><SectionIntro number="02" label="Метод" title={<>Працюємо за <em>дизайн-проєктом</em></>} /><p>Реалізуємо ремонти по кресленнях, планах демонтажу, монтажу, електрики, сантехніки, освітлення та оздоблення.</p><p>Якщо проєкту немає — ми допоможемо його розробити або підкажемо, як організувати роботу мінімально якісно.</p><Link to="/dyzain">Дізнатись про дизайн-проєкт <Arrow /></Link></div>
        <figure><img src="/projects/varshavsky-bedroom.jpg" alt="Технічні креслення для ремонту — план електрики та освітлення" /><figcaption>Plan · E-201</figcaption></figure>
      </section>
      <ServiceLeadBand eyebrow="Розрахунок" title="Розрахуємо ремонт під ваш простір" text="Надішліть планування або обʼєкт — підготуємо орієнтовний кошторис та запропонуємо оптимальний формат робіт." service="Ремонт під ключ" action="Розрахувати ремонт" />
      <NextStep />
    </SiteLayout>
  );
}

export function ConstructionPage() {
  const works = [
    ["Будівництво приватних будинків", "індивідуальні проєкти"], ["Будівництво котеджів", "заміські обʼєкти"], ["Фундаментні роботи", "стрічковий, плитний"], ["Коробка будинку", "несучі стіни, перекриття"], ["Покрівельні роботи", "фальц, металочерепиця"], ["Фасадні роботи", "штукатурні, вентильовані"], ["Інженерні комунікації", "вода, тепло, електрика"], ["Внутрішні роботи", "перегородки, оздоблення"], ["Комплектація матеріалами", "перевірені постачальники"],
  ];
  const trust = [
    ["Поетапний контроль", "Кожен етап фіксується актами, фото та відповідною документацією."], ["Зрозуміла організація", "Прозорий графік, єдиний менеджер обʼєкта та чіткі зони відповідальності."], ["Робота з матеріалами", "Працюємо з перевіреними виробниками та контролюємо постачання."], ["Комплексний підхід", "Один підрядник — від фундаменту до фінального оздоблення."],
  ];
  return (
    <SiteLayout current="/budivnytstvo">
      <ServiceHero numeral="ІІ" label="Послуга 02" title={<>Будівництво будинків і котеджів <em>під ключ</em></>} text="Від підготовки ділянки та фундаменту до готового будинку. Ведемо обʼєкт цілісно — без посередників та сюрпризів у бюджеті." image="/projects/dibrova-bedroom.jpg" alt="Спальня — ЖК Діброва парк" />
      <section className="construction-approach page-section">
        <SectionIntro number="01" label="Підхід" title={<>Будинок — це <em>не просто стіни</em></>} />
        <p>Це інженерія, енергоефективність, звукоізоляція, продумане планування та архітектурна цілісність. Ми будуємо так, щоб у будинку хотілося жити роками.</p>
        <div><img src="/projects/varshavsky-living-green.jpg" alt="Вітальня — ЖК Варшавський" /><img src="/projects/dibrova-bath.jpg" alt="Санвузол — ЖК Діброва парк" /><img src="/projects/dibrova-kitchen.jpg" alt="Кухня — ЖК Діброва парк" /></div>
      </section>
      <section className="work-scope page-section">
        <SectionIntro number="02" label="Що ми виконуємо" title={<>Повний цикл — <em>від ділянки до здачі</em></>} text="Дев'ять напрямків робіт у складі одного контракту — одна команда, одна відповідальність." />
        <ol>{works.map(([title, note], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>— {note}</p></li>)}</ol>
      </section>
      <section className="trust-section page-section">
        <SectionIntro number="03" label="Чому нам довіряють" title={<>Серйозний підрядник — <em>без обіцянок</em></>} />
        <div>{trust.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="trust-cta"><p>Готові обговорити ваш проєкт будівництва?</p><OpenLeadButton service="Будівництво будинку">Обговорити будівництво <Arrow /></OpenLeadButton></div>
      </section>
      <NextStep />
    </SiteLayout>
  );
}

export function DesignPage() {
  const items = ["Планувальне рішення", "3D-візуалізації", "Плани демонтажу та монтажу", "Плани освітлення", "Плани електрики", "Плани сантехніки", "Специфікації матеріалів", "Авторський підхід до реалізації"];
  return (
    <SiteLayout current="/dyzain">
      <ServiceHero numeral="ІІІ" label="Послуга 03" title={<>Дизайн інтерʼєру для квартир <em>і будинків</em></>} text="Створюємо продумані інтерʼєри з візуалізаціями, кресленнями та повною технічною документацією. Допомагаємо втілити проєкт у життя без хаосу на ремонті." image="/projects/syrets-dining.jpg" alt="Обідня зона — Сирецькі Сади" />
      <section className="design-gallery page-section"><figure><img src="/projects/varshavsky-living-view.jpg" alt="Вітальня — ЖК Варшавський" /></figure><figure><img src="/projects/syrets-bedroom-curtain.jpg" alt="Спальня — Сирецькі Сади" /></figure></section>
      <section className="service-list-section design-list page-section">
        <SectionIntro number="01" label="Склад проєкту" title={<>Що входить в <em>дизайн-проєкт</em></>} text="Повний пакет документації — від першого ескізу планування до робочих креслень, які використовує бригада на обʼєкті." />
        <ol>{items.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><Arrow /></li>)}</ol>
      </section>
      <section className="design-method page-section">
        <figure><img src="/projects/varshavsky-marble-kitchen.jpg" alt="Кухня — ЖК Варшавський" /><figcaption>— Реалізація проєкту 2024</figcaption></figure>
        <div><SectionIntro number="02" label="Метод" title={<>Від картинки — <em>до реалізації</em></>} /><p>Дизайн-проєкт допомагає уникнути хаосу на ремонті, правильно прорахувати етапи робіт, матеріали та технічні рішення.</p><p>Ми не просто малюємо красиві ракурси — ми готуємо документацію, за якою будівельна бригада виконує роботу без зайвих питань.</p><div className="design-method-actions"><OpenLeadButton service="Дизайн інтерʼєру">Замовити дизайн-проєкт <Arrow /></OpenLeadButton><Link to="/portfolio">Дивитись приклади <Arrow /></Link></div></div>
      </section>
      <NextStep />
    </SiteLayout>
  );
}

type ProjectCategory = "apartments" | "houses" | "kitchens" | "bathrooms" | "commercial";
type Project = { image: string; alt: string; service: string; title: string; area: string; year: string; categories: ProjectCategory[] };

const PROJECTS: Project[] = [
  { image: "/projects/varshavsky-kitchen-island.jpg", alt: "Кухонний острів з мармуровою стільницею, теплим горіхом та видом на місто", service: "Ремонт під ключ + дизайн-проєкт", title: "ЖК Варшавський — сучасна квартира", area: "83 м²", year: "2024", categories: ["apartments", "kitchens"] },
  { image: "/projects/syrets-living.jpg", alt: "Простора вітальня з відкритою бетонною стелею, бібліотекою та зеленим диваном", service: "Ремонт квартири під ключ", title: "Сирецькі Сади — вітальня", area: "78 м²", year: "2024", categories: ["apartments"] },
  { image: "/projects/syrets-dining.jpg", alt: "Обідня зона з графічним освітленням, теплим дубом та лофтовими акцентами", service: "Ремонт + дизайн-проєкт", title: "Сирецькі Сади — обідня зона", area: "78 м²", year: "2024", categories: ["apartments", "kitchens"] },
  { image: "/projects/dibrova-bath.jpg", alt: "Лаконічний санвузол з натурального каменю та теплою архітектурною геометрією", service: "Чистове оздоблення", title: "ЖК Діброва парк — санвузол", area: "6 м²", year: "2024", categories: ["apartments", "bathrooms"] },
  { image: "/projects/syrets-bedroom-slat.jpg", alt: "Спальня з масивним узголівʼям з деревʼяних рейок та лофтовою стелею", service: "Ремонт будинку під ключ", title: "Будинок СофБо — приватний будинок", area: "145 м²", year: "2024", categories: ["houses"] },
  { image: "/projects/dibrova-wardrobe.jpg", alt: "Спальня з вбудованою світлою гардеробною та текстурованим текстилем", service: "Ремонт квартири + дизайн", title: "ЖК Діброва парк — квартира", area: "72 м²", year: "2023", categories: ["apartments"] },
  { image: "/projects/syrets-kitchen-dark.jpg", alt: "Темна кухня з сучасним дизайном та архітектурним освітленням", service: "Ремонт + темний інтерʼєр", title: "Чорна кухня — кухня-вітальня", area: "38 м²", year: "2024", categories: ["apartments", "kitchens"] },
  { image: "/projects/varshavsky-bath-arch.jpg", alt: "Санвузол з арковим дзеркалом, деревʼяною акцентною панеллю та теплою підсвіткою", service: "Чистове оздоблення", title: "ЖК Варшавський — санвузол", area: "8 м²", year: "2024", categories: ["apartments", "bathrooms"] },
  { image: "/projects/varshavsky-kids.jpg", alt: "Дитяча кімната з вбудованим робочим столом та зеленими акцентами", service: "Ремонт + дизайн", title: "ЖК Варшавський — дитяча", area: "16 м²", year: "2024", categories: ["apartments"] },
  { image: "/projects/syrets-kitchen-loft.jpg", alt: "Кухня у лофтовому стилі з відкритою бетонною стелею", service: "Ремонт кухні під ключ", title: "Сирецькі Сади — кухня", area: "24 м²", year: "2024", categories: ["apartments", "kitchens"] },
];

const FILTERS: { key: "all" | ProjectCategory; label: string }[] = [
  { key: "all", label: "Усі" }, { key: "apartments", label: "Квартири" }, { key: "houses", label: "Будинки" }, { key: "kitchens", label: "Кухні" }, { key: "bathrooms", label: "Санвузли" }, { key: "commercial", label: "Комерційні" },
];

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  apartments: "Квартири",
  houses: "Будинки",
  kitchens: "Кухні",
  bathrooms: "Санвузли",
  commercial: "Комерційні",
};

function PortfolioGrid() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const visible = filter === "all" ? PROJECTS : PROJECTS.filter((project) => project.categories.includes(filter));

  useEffect(() => {
    if (!selected) return;
    document.body.classList.add("lightbox-lock");
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", close);
    return () => {
      window.removeEventListener("keydown", close);
      document.body.classList.remove("lightbox-lock");
    };
  }, [selected]);

  return (
    <section className="portfolio-catalog page-section">
      <div className="portfolio-filters" role="group" aria-label="Фільтр портфоліо">
        {FILTERS.map((item) => <button key={item.key} type="button" aria-pressed={filter === item.key} className={filter === item.key ? "active" : ""} onClick={() => setFilter(item.key)}>{item.label}</button>)}
      </div>
      <div className="portfolio-grid" key={filter}>
        {visible.length ? visible.map((project, index) => <article key={project.image} className={`portfolio-card portfolio-card-${index + 1}`}><button type="button" onClick={() => setSelected(project)} aria-label={`Відкрити: ${project.title}`}><img src={project.image} alt={project.alt} /><span className="portfolio-card-shade" /><span className="portfolio-card-caption"><span><small>{project.service}</small><strong>{project.title}</strong><em>{project.area}<i />{project.year}</em></span><b><Arrow /></b></span></button></article>) : <div className="portfolio-empty"><span>00</span><h2>Проєкти цієї категорії готуються до публікації.</h2><p>Напишіть нам, щоб побачити релевантні роботи з внутрішнього архіву.</p></div>}
      </div>
      {selected ? (
        <div className="portfolio-lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null); }}>
          <button className="portfolio-lightbox-close" type="button" aria-label="Закрити" onClick={() => setSelected(null)}><CloseIcon /></button>
          <div className="portfolio-lightbox-inner">
            <figure><img src={selected.image} alt={selected.alt} /></figure>
            <div className="portfolio-lightbox-caption">
              <div><small>{CATEGORY_LABELS[selected.categories[0]]}</small><h3>{selected.title}</h3></div>
              <p><span>{selected.service}</span><i /><span>{selected.area}</span><i /><span>{selected.year}</span></p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function PortfolioPage() {
  return (
    <SiteLayout current="/portfolio">
      <ServiceHero numeral="ІV" label="Портфоліо ремонтів" title={<>Реальні обʼєкти, <em>де ми працювали</em></>} text="Реальні обʼєкти, де виконувались ремонтні роботи, дизайн-проєкти та реалізація інтерʼєрів. Кожен проєкт — результат спільної роботи з клієнтом." image="/projects/varshavsky-living-green.jpg" alt="Вітальня з зеленим диваном — ЖК Варшавський" />
      <PortfolioGrid />
      <NextStep />
    </SiteLayout>
  );
}

export function ContactsPage() {
  return (
    <SiteLayout current="/kontakty">
      <section className="contacts-intro">
        <div><p className="contact-kicker"><span>V</span><i />Контакти</p><h1>Готові обговорити <em>ваш проєкт</em>.</h1><p>Залиште заявку зручним способом — телефоном, у месенджері або через коротку форму. Ми зв'яжемося протягом робочого дня.</p></div>
      </section>
      <section className="contact-options">
        <a href={PHONE_LINK}><b className="contact-option-icon"><PhoneIcon /></b><span>Подзвонити</span><h2>{PHONE_DISPLAY}</h2><p>Пн–Сб · 9:00 — 19:00</p></a>
        <a href={`mailto:${EMAIL}`}><b className="contact-option-icon"><MailIcon /></b><span>Написати</span><h2>{EMAIL}</h2><p>Відповідаємо у робочий час</p></a>
        <div><b className="contact-option-icon"><PinIcon /></b><span>Зона роботи</span><h2>Київ</h2><p>Україна — виїзди по обʼєктах</p></div>
      </section>
      <section className="contact-followup page-section">
        <div className="contact-cta-card"><p>Заявка</p><h2>Залиште свої контакти — <em>ми зателефонуємо</em></h2><span>Розкажіть коротко про задачу. Імʼя, телефон, тип послуги та коментар заповнюються в одній компактній формі.</span><OpenLeadButton service="Ремонт під ключ">Залишити заявку <Arrow /></OpenLeadButton></div>
        <div className="contact-sidebar">
          <div className="messengers"><p>Месенджери</p><h2>Зв'яжіться зручним способом</h2><a href="https://t.me/comforthome" target="_blank" rel="noreferrer"><span><MessageIcon />Telegram</span><Arrow /></a><a href="viber://chat?number=+380669303007"><span><MessageIcon />Viber</span><Arrow /></a><a href="https://wa.me/380669303007" target="_blank" rel="noreferrer"><span><MessageIcon />WhatsApp</span><Arrow /></a></div>
          <a className="google-review-card" href="https://g.page/r/CYEup9Ivtv9gEBE/review" target="_blank" rel="noreferrer"><span><small><StarIcon />Google Review</small><strong>Залишити відгук</strong></span><Arrow /></a>
        </div>
      </section>
    </SiteLayout>
  );
}
