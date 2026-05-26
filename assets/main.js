const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
root.dataset.theme = savedTheme || (prefersDark ? 'dark' : 'light');

document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', root.dataset.theme);
});

const nav = document.querySelector('#mainNav');
document.querySelector('[data-burger]')?.addEventListener('click', (event) => {
  const isOpen = nav.classList.toggle('is-open');
  event.currentTarget.setAttribute('aria-expanded', String(isOpen));
});
nav?.addEventListener('click', (event) => {
  if (event.target.matches('a')) nav.classList.remove('is-open');
});

const revealNodes = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  }), { threshold: 0.16 });
  revealNodes.forEach((node) => observer.observe(node));
} else revealNodes.forEach((node) => node.classList.add('is-visible'));

const arcPaths = [
  { d: 'M42.3,47.3l-17.8-20.1c-2.1-2.5-1.9-6.2.5-8.3l1.2-1.2c1.1-1.1,2.8-1.5,4.3-1.5s3.1.8,4,1.9l8,9c.6.6.5,1.5-.2,2.1s-1.5.5-2.1-.2l-8-9c-1-.9-3-1.1-4.3,0l-.9,1c-1.1,1.1-1.3,3-.2,4.1l17.9,20.1c.6.6.5,1.4-.2,2.1-.9.9-1.9.4-2.2,0Z', yellow: true, size: 80 },
  { d: 'M42.6,77.4c-17.8-.5-33-13-37-30.3-.2-.8.3-1.6,1.2-1.8.8-.2,1.6.3,1.8,1.2,3.6,16,17.7,27.6,34.2,28.1,13.5.4,26-6.7,32.7-18.5.4-.7,1.3-1,2-.5.7.4,1,1.3.5,2-7.1,12.6-20.7,20.3-35.4,19.8Z', yellow: true, size: 110 }
];
const arcsContainer = document.querySelector('#arcsContainer');
function params() {
  const w = innerWidth, h = innerHeight;
  return {
    startX: `${(Math.random() > .5 ? -1 : 2) * w * (.3 + Math.random() * .4)}px`,
    startY: `${(Math.random() - .5) * h * .8}px`,
    midX: `${(Math.random() - .5) * w * .4}px`,
    midY: `${(Math.random() - .5) * h * .4}px`,
    endX: `${(Math.random() > .5 ? 2 : -1) * w * (.3 + Math.random() * .4)}px`,
    endY: `${(Math.random() - .5) * h * .8}px`,
    startRotate: `${Math.random() * 360}deg`, midRotate: `${Math.random() * 360 + 180}deg`, endRotate: `${Math.random() * 360 + 360}deg`,
    scale: innerWidth < 768 ? 80 : 200, opacity: .06 + Math.random() * .10, duration: `${18 + Math.random() * 12}s`, delay: `${Math.random() * 4}s`
  };
}
function createArcs() {
  if (!arcsContainer || matchMedia('(prefers-reduced-motion: reduce)').matches || innerWidth < 768) return;
  arcsContainer.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const data = arcPaths[i % arcPaths.length], p = params();
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 86 85'); svg.classList.add('arc'); svg.style.width = `${data.size}px`; svg.style.height = `${data.size}px`;
    Object.entries(p).forEach(([k, v]) => svg.style.setProperty(`--${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`, v));
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', data.d); if (data.yellow) path.classList.add('yellow');
    svg.append(path); arcsContainer.append(svg);
  }
}
function startHero() {
  setTimeout(() => document.querySelector('#logoStage')?.classList.add('expanding'), 2300);
  setTimeout(() => { createArcs(); document.querySelectorAll('.arc').forEach((arc, i) => setTimeout(() => arc.classList.add('visible'), i * 220)); }, 3800);
  setTimeout(() => document.querySelector('#heroContent')?.classList.add('visible'), 5200);
}
window.addEventListener('load', startHero);
let resizeTimer; window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { createArcs(); document.querySelectorAll('.arc').forEach(a => a.classList.add('visible')); }, 250); });

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  carousel.querySelector('[data-prev]')?.addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * .85, behavior: 'smooth' }));
  carousel.querySelector('[data-next]')?.addEventListener('click', () => track.scrollBy({ left: track.clientWidth * .85, behavior: 'smooth' }));
  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') track.scrollBy({ left: 360, behavior: 'smooth' });
    if (event.key === 'ArrowLeft') track.scrollBy({ left: -360, behavior: 'smooth' });
  });
});

document.querySelectorAll('.magnetic').forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const r = card.getBoundingClientRect();
    const x = (event.clientX - r.left - r.width / 2) / r.width;
    const y = (event.clientY - r.top - r.height / 2) / r.height;
    card.style.transform = `translate(${x * 10}px, ${y * 10}px) scale(1.025)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

const phone = document.querySelector('[data-phone]');
phone?.addEventListener('input', () => {
  const digits = phone.value.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);
  const d = digits.startsWith('7') ? digits.slice(1) : digits;
  phone.value = '+7' + (d.length ? ` (${d.slice(0,3)}` : '') + (d.length >= 3 ? `) ${d.slice(3,6)}` : '') + (d.length >= 6 ? `-${d.slice(6,8)}` : '') + (d.length >= 8 ? `-${d.slice(8,10)}` : '');
});

document.querySelector('[data-contact-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  form.querySelectorAll('input').forEach((input) => input.classList.add('touched'));
  const email = form.elements.email.value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneOk = form.elements.phone.value.replace(/\D/g, '').length === 11;
  const status = form.querySelector('.form-status');
  if (!form.elements.name.value.trim() || !emailOk || !phoneOk) {
    status.textContent = 'Проверьте имя, email и телефон — эти поля обязательны.';
    return;
  }
  status.textContent = 'Спасибо! Форма проверена. На следующем этапе подключим отправку заявки.';
  form.reset();
});
