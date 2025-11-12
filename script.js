// script.js - controle de cadastro com localStorage, cards animados e toast

const form = document.getElementById('gatoForm');
const listaGatos = document.getElementById('listaGatos');
const toast = document.getElementById('toast');
const limparBtn = document.getElementById('limparBtn');

let gatos = [];

// --- util: mostrar toast de sucesso/erro ---
function showToast(msg, timeout = 2200) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    toast.classList.remove('show');
  }, timeout);
}

// --- salvar e carregar do localStorage ---
function saveToStorage() {
  localStorage.setItem('gatos', JSON.stringify(gatos));
}
function loadFromStorage() {
  try {
    const raw = localStorage.getItem('gatos');
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) gatos = parsed;
  } catch (e) {
    console.error('Erro carregando storage', e);
  }
}

// --- renderiza a lista de gatos em cards ---
function renderGatos() {
  listaGatos.innerHTML = '';
  if (gatos.length === 0) {
    listaGatos.innerHTML = `<p style="color:var(--muted);">Nenhum gato cadastrado ainda.</p>`;
    return;
  }

  gatos.forEach((gato, idx) => {
    const card = document.createElement('article');
    card.className = 'card fade-in';
    card.innerHTML = `
      <button class="removeBtn" title="Remover" aria-label="Remover gato">✕</button>
      <div class="nome">${escapeHtml(gato.nome)}</div>
      <div class="meta">Idade: ${escapeHtml(gato.idade)} ano(s)</div>
      <div class="raca">Raça: ${escapeHtml(gato.raca)}</div>
    `;

    // remover evento
    const btn = card.querySelector('.removeBtn');
    btn.addEventListener('click', () => {
      if (!confirm(`Remover ${gato.nome}?`)) return;
      gatos.splice(idx, 1);
      saveToStorage();
      renderGatos();
      showToast('Gato removido 🐾', 1600);
    });

    listaGatos.appendChild(card);
  });
}

// proteção simples contra XSS ao injetar texto
function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// evento de submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const idade = document.getElementById('idade').value.trim();
  const raca = document.getElementById('raca').value.trim();

  if (!nome || !idade || !raca) {
    showToast('Preencha todos os campos 🙂', 1800);
    return;
  }

  // adicionar ao array
  const novo = { nome, idade, raca };
  gatos.unshift(novo); // adiciona no topo
  saveToStorage();
  renderGatos();
  form.reset();
  showToast('Gato cadastrado com sucesso! 🐱');
});

// limpar toda a lista