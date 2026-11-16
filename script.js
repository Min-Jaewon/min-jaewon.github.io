const newsToggle = document.querySelector('#news-toggle');
const newsList = document.querySelector('.news-list');
const teaserModal = document.querySelector('#teaser-lightbox');
const teaserModalContent = document.querySelector('.teaser-modal-content');
const teaserModalClose = document.querySelector('.teaser-modal-close');

if (newsToggle && newsList) {
  newsToggle.addEventListener('click', () => {
    const expanded = newsToggle.getAttribute('aria-expanded') === 'true';
    newsToggle.setAttribute('aria-expanded', String(!expanded));
    newsList.classList.toggle('expanded', !expanded);
    newsToggle.textContent = expanded ? 'Show All News' : 'Show Less';
  });
}

const currentYear = document.querySelector('#current-year');
if (currentYear) currentYear.textContent = new Date().getFullYear();

function closeTeaserModal() {
  if (!teaserModal || !teaserModalContent) return;
  teaserModal.classList.remove('is-open');
  teaserModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  teaserModalContent.innerHTML = '';
}

function openTeaserModal(media) {
  if (!teaserModal || !teaserModalContent) return;
  const clone = media.cloneNode(true);
  clone.removeAttribute('width');
  clone.removeAttribute('height');
  if (clone.tagName === 'VIDEO') {
    clone.controls = true;
    clone.muted = true;
    clone.loop = true;
    clone.autoplay = true;
    clone.playsInline = true;
  }
  teaserModalContent.innerHTML = '';
  teaserModalContent.appendChild(clone);
  teaserModal.classList.add('is-open');
  teaserModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  if (clone.tagName === 'VIDEO') clone.play().catch(() => {});
}

document.querySelectorAll('.paper-visual').forEach((visual) => {
  const media = visual.querySelector('img, video');
  if (!media) return;
  visual.setAttribute('role', 'button');
  visual.setAttribute('tabindex', '0');
  visual.setAttribute('aria-label', 'Enlarge publication thumbnail');
  visual.addEventListener('click', () => openTeaserModal(media));
  visual.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openTeaserModal(media);
    }
  });
});

if (teaserModal) {
  teaserModal.addEventListener('click', (event) => {
    if (event.target === teaserModal || event.target.classList.contains('teaser-modal-bg')) closeTeaserModal();
  });
}

if (teaserModalClose) teaserModalClose.addEventListener('click', closeTeaserModal);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeTeaserModal();
});

const siteNav = document.querySelector('#site-nav');
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const navSections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

function updateNav() {
  if (!siteNav) return;
  siteNav.classList.toggle('scrolled', window.scrollY > 8);
  const marker = window.scrollY + siteNav.offsetHeight + 80;
  let current = null;
  navSections.forEach((section) => {
    if (section.offsetTop <= marker) current = section;
  });
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (atBottom && navSections.length) current = navSections[navSections.length - 1];
  navLinks.forEach((link) => {
    link.classList.toggle('active', Boolean(current) && link.getAttribute('href') === `#${current.id}`);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
window.addEventListener('resize', updateNav);
updateNav();
