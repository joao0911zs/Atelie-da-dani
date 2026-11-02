const whatsapp = '5511913079437';
const instagram = 'https://www.instagram.com/ateliedadanie?stkn=MTE5cDFuMTB6N2phOA%3D%3D';

// Menu mobile
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

// Filtro de sabores
const tabs = document.querySelectorAll('.flavor-tab');
const flavorCards = document.querySelectorAll('.flavor-card');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  const filter = tab.dataset.filter;
  flavorCards.forEach(card => {
    card.classList.toggle('hidden', filter !== 'todos' && card.dataset.category !== filter);
  });
}));
const drawer = document.querySelector('.order-drawer');
const drawerPanel = document.querySelector('.drawer-panel');
const orderItems = document.querySelector('#orderItems');
const sendOrder = document.querySelector('#sendOrder');
const order = [];

function openDrawer(item = null) {
  if (item) order.push(item);
  renderOrder();
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
function renderOrder() {
  if (!order.length) {
    orderItems.innerHTML = '<p class="empty-order">Seu pedido ainda está vazio.</p>';
    sendOrder.classList.add('disabled');
    sendOrder.href = '#';
    return;
  }
  orderItems.innerHTML = order.map((item, i) => `<div class="order-row"><span>${item}</span><button data-remove="${i}" aria-label="Remover ${item}">remover</button></div>`).join('');
  orderItems.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => {
    order.splice(Number(btn.dataset.remove), 1);
    renderOrder();
  }));
  const text = `Oi Ateliê da Dani! Vim pelo site e gostaria de fazer um orçamento.\n\nItens de interesse:\n${order.map(x => `• ${x}`).join('\n')}\n\nPode me passar as opções e disponibilidade?`;
  sendOrder.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
  sendOrder.classList.remove('disabled');
}

document.querySelectorAll('[data-order]').forEach(button => {
  button.addEventListener('click', () => openDrawer(button.dataset.order));
});
document.querySelector('.drawer-close')?.addEventListener('click', closeDrawer);
document.querySelector('.drawer-overlay')?.addEventListener('click', closeDrawer);
document.querySelector('.clear-order')?.addEventListener('click', () => { order.length = 0; renderOrder(); });

// Galeria lightbox
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('img');
document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => {
  lightboxImg.src = item.dataset.image;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}));
function closeLightbox() { lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('show'); observer.unobserve(entry.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelector('#year').textContent = new Date().getFullYear();

window.addEventListener('keydown', e => { if (e.key === 'Escape') { closeDrawer(); closeLightbox(); } });
