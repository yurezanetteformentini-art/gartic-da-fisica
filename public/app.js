// Gartic da Física — lado do jogador (celular / navegador)
const socket = io();
const $ = (s) => document.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let meuId = null;
let est = null;
let temasInfo = {};
let serieEscolhida = null;
let minhaPalavra = null;   // { p, tema, idVez }
let acerteiPalavra = null; // { palavra, idVez }
let idVezAtual = null;
let fimLocal = 0;
let urlConvite = '';

// ---------- telas ----------
function mostrar(id) {
  document.querySelectorAll('.tela').forEach((t) => t.classList.toggle('ativa', t.id === id));
}

function toast(msg, cor) {
  const t = $('#toast');
  t.textContent = msg;
  t.style.background = cor || '';
  t.classList.add('ativo');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('ativo'), 2200);
}

// ---------- tela inicial ----------
const params = new URLSearchParams(location.search);
$('#nome').value = localStorage.getItem('gf-nome') || '';
$('#sala').value = params.get('sala') || '';

function selecionarSerie(s) {
  serieEscolhida = s;
  document.querySelectorAll('.turma').forEach((b) => b.classList.toggle('sel', b.dataset.serie === s));
  const info = temasInfo[s];
  $('#temas-previa').innerHTML = info ? info.temas.map((t) => `<span class="chip">${esc(t)}</span>`).join('') : '';
}

document.querySelectorAll('.turma').forEach((b) => b.addEventListener('click', () => selecionarSerie(b.dataset.serie)));

fetch('/temas').then((r) => r.json()).then((t) => {
  temasInfo = t;
  const s = params.get('serie');
  if (s && t[s]) selecionarSerie(s);
});

function entrar() {
  const nome = $('#nome').value.trim();
  const sala = $('#sala').value.trim();
  $('#erro-inicio').textContent = '';
  if (!serieEscolhida) return ($('#erro-inicio').textContent = 'Escolha sua turma.');
  if (!nome) return ($('#erro-inicio').textContent = 'Digite seu nome.');
  localStorage.setItem('gf-nome', nome);
  $('#btn-entrar').disabled = true;
  socket.emit('entrar', { nome, serie: serieEscolhida, sala }, (res) => {
    $('#btn-entrar').disabled = false;
    if (!res || res.erro) return ($('#erro-inicio').textContent = (res && res.erro) || 'Erro ao entrar.');
    meuId = res.id;
  });
}
$('#btn-entrar').addEventListener('click', entrar);
$('#nome').addEventListener('keydown', (e) => e.key === 'Enter' && entrar());
$('#sala').addEventListener('keydown', (e) => e.key === 'Enter' && entrar());
$('#btn-sair').addEventListener('click', () => { location.href = location.pathname; });

// ---------- convite ----------
async function montarConvite() {
  let base = location.origin;
  if (['localhost', '127.0.0.1'].includes(location.hostname)) {
    try {
      const info = await (await fetch('/info')).json();
      if (info.rede && info.rede.length) base = info.rede[0];
    } catch {}
  }
  const url = `${base}/?serie=${est.serie}&sala=${encodeURIComponent(est.sala)}`;
  if (url === urlConvite) return;
  urlConvite = url;
  $('#link-convite').textContent = url.replace(/^https?:\/\//, '');
  $('#qr').src = '/qr?t=' + encodeURIComponent(url);
}

// ---------- sala de espera ----------
function renderEspera() {
  mostrar('tela-espera');
  $('#esp-turma').textContent = est.nomeSerie;
  $('#esp-sala').textContent = est.sala;
  $('#esp-qtd').textContent = est.jogadores.length;
  $('#esp-jogadores').innerHTML = est.jogadores.map((j) =>
    `<li class="${j.id === meuId ? 'eu' : ''}"><span>${esc(j.nome)}${j.id === meuId ? ' (você)' : ''}</span><span>${j.id === est.anfitriao ? '👑' : ''}</span></li>`
  ).join('');
  $('#esp-aviso').textContent = est.aviso || (est.jogadores.length < 2 ? 'Aguardando mais jogadores…' : '');

  const souHost = est.anfitriao === meuId;
  $('#cfg-host').style.display = souHost ? 'block' : 'none';
  $('#cfg-convidado').style.display = souHost ? 'none' : 'block';
  const todos = (temasInfo[est.serie] || { temas: [] }).temas;
  if (souHost) {
    const atual = $('#cfg-temas').dataset.serie;
    if (atual !== est.serie || !$('#cfg-temas').children.length) {
      $('#cfg-temas').dataset.serie = est.serie;
      $('#cfg-temas').innerHTML = todos.map((t) =>
        `<label><input type="checkbox" value="${esc(t)}"> ${esc(t)}</label>`).join('');
      $('#cfg-temas').querySelectorAll('input').forEach((i) => i.addEventListener('change', enviarConfig));
    }
    $('#cfg-temas').querySelectorAll('input').forEach((i) => { i.checked = est.config.temas.includes(i.value); });
    $('#cfg-rodadas').value = est.config.rodadas;
    $('#cfg-tempo').value = est.config.tempo;
    $('#btn-iniciar').disabled = est.jogadores.length < 2;
  } else {
    $('#cfg-convidado').innerHTML =
      `<p><b>Temas:</b> ${est.config.temas.map(esc).join(', ')}</p>
       <p><b>Rodadas:</b> ${est.config.rodadas} &nbsp; <b>Tempo:</b> ${est.config.tempo} s</p>
       <p class="dica-peq">O anfitrião 👑 escolhe as configurações e inicia o jogo.</p>`;
  }
  montarConvite();
}

function enviarConfig() {
  const temas = [...$('#cfg-temas').querySelectorAll('input:checked')].map((i) => i.value);
  if (!temas.length) { toast('Escolha pelo menos um tema', 'var(--erro)'); return renderEspera(); }
  socket.emit('configurar', { temas, rodadas: $('#cfg-rodadas').value, tempo: $('#cfg-tempo').value });
}
$('#cfg-rodadas').addEventListener('change', enviarConfig);
$('#cfg-tempo').addEventListener('change', enviarConfig);
$('#btn-iniciar').addEventListener('click', () => socket.emit('iniciar'));

// ---------- quadro ----------
const cv = $('#quadro');
const ctx = cv.getContext('2d');
const W = cv.width, H = cv.height;
let tracos = [];

function limparQuadro() { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); }
function desenharSeg(s) {
  ctx.strokeStyle = s.c; ctx.lineWidth = s.w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(s.x0 * W, s.y0 * H); ctx.lineTo(s.x1 * W, s.y1 * H); ctx.stroke();
}
function redesenhar() { limparQuadro(); tracos.forEach(desenharSeg); }
limparQuadro();

const CORES = ['#1b1f2a', '#ffffff', '#8e9aaf', '#d62839', '#fb8500', '#ffd60a', '#2a9d5c', '#3a86ff', '#7b2cbf', '#8d5524', '#ff70a6', '#00b4d8'];
let corAtual = CORES[0], larg = 4, borracha = false;
$('#cores').innerHTML = CORES.map((c, i) => `<button class="cor ${i === 0 ? 'ativo' : ''}" data-c="${c}" style="background:${c}"></button>`).join('');
$('#cores').addEventListener('click', (e) => {
  const b = e.target.closest('.cor'); if (!b) return;
  corAtual = b.dataset.c; borracha = false;
  document.querySelectorAll('.cor').forEach((x) => x.classList.toggle('ativo', x === b));
  $('#f-borracha').classList.remove('ativo');
});
document.querySelectorAll('.tam').forEach((b) => b.addEventListener('click', () => {
  larg = +b.dataset.w;
  document.querySelectorAll('.tam').forEach((x) => x.classList.toggle('ativo', x === b));
}));
$('#f-borracha').addEventListener('click', () => { borracha = !borracha; $('#f-borracha').classList.toggle('ativo', borracha); });
$('#f-desfazer').addEventListener('click', () => socket.emit('desfazer'));
$('#f-limpar').addEventListener('click', () => socket.emit('limpar'));

function possoDesenhar() { return est && est.estado === 'desenhando' && est.desenhista === meuId; }
let desenhando = false, ultimo = null, idTraco = null;
function pos(e) {
  const r = cv.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
}
function enviarSeg(a, b) {
  const s = { id: idTraco, x0: a.x, y0: a.y, x1: b.x, y1: b.y, c: borracha ? '#ffffff' : corAtual, w: borracha ? larg * 2.5 : larg };
  tracos.push(s); desenharSeg(s); socket.emit('traco', s);
}
cv.addEventListener('pointerdown', (e) => {
  if (!possoDesenhar()) return;
  e.preventDefault();
  cv.setPointerCapture(e.pointerId);
  desenhando = true; idTraco = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  ultimo = pos(e); enviarSeg(ultimo, ultimo);
});
cv.addEventListener('pointermove', (e) => {
  if (!desenhando || !possoDesenhar()) return;
  const p = pos(e);
  if (Math.hypot(p.x - ultimo.x, p.y - ultimo.y) < 0.002) return;
  enviarSeg(ultimo, p); ultimo = p;
});
['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => cv.addEventListener(ev, () => { desenhando = false; }));

socket.on('traco', (s) => { tracos.push(s); desenharSeg(s); });
socket.on('quadro', (lista) => { tracos = lista || []; redesenhar(); });

// ---------- mensagens ----------
function addMsg(m) {
  const html = m.nome ? `<b>${esc(m.nome)}:</b> ${esc(m.texto)}` : esc(m.texto);
  ['#msgs-jogo', '#msgs-espera'].forEach((sel) => {
    const ul = $(sel);
    const li = document.createElement('li');
    li.className = m.tipo; li.innerHTML = html;
    ul.appendChild(li);
    while (ul.children.length > 80) ul.removeChild(ul.firstChild);
    ul.scrollTop = ul.scrollHeight;
  });
}
socket.on('mensagem', addMsg);

$('#form-palpite').addEventListener('submit', (e) => {
  e.preventDefault();
  const t = $('#palpite').value.trim();
  if (!t) return;
  socket.emit('palpite', t);
  $('#palpite').value = '';
});

// ---------- jogo ----------
socket.on('opcoes', (ops) => {
  const el = $('#sobre-escolha');
  el.innerHTML = `<h2>Sua vez de desenhar!</h2><p>Escolha uma palavra:</p>
    <div class="opcoes">${ops.map((o, i) => `<button class="opcao" data-i="${i}"><strong>${esc(o.p)}</strong><small>${esc(o.tema)}</small></button>`).join('')}</div>`;
  el.querySelectorAll('.opcao').forEach((b) => b.addEventListener('click', () => socket.emit('escolher', b.dataset.i)));
  el.classList.add('ativo');
});
socket.on('suaPalavra', (w) => { minhaPalavra = w; renderJogo(); });
socket.on('voceAcertou', (d) => {
  acerteiPalavra = d;
  toast(`Você acertou! +${d.pts} pontos`);
  if (navigator.vibrate) navigator.vibrate(120);
  renderJogo();
});

function renderPalavra() {
  const el = $('#j-palavra');
  el.classList.remove('minha', 'texto');
  if (est.estado === 'escolhendo') { el.classList.add('texto'); el.textContent = 'Escolhendo…'; return; }
  if (est.estado === 'revelando') { el.textContent = ''; return; }
  if (minhaPalavra && minhaPalavra.idVez === est.idVez) { el.classList.add('minha'); el.textContent = minhaPalavra.p; return; }
  if (acerteiPalavra && acerteiPalavra.idVez === est.idVez) { el.classList.add('minha'); el.textContent = '✅ ' + acerteiPalavra.palavra; return; }
  if (!est.mascara) { el.textContent = ''; return; }
  const letras = est.mascara.filter((c) => /[\p{L}\p{N}]|_/u.test(c)).length;
  el.innerHTML = est.mascara.map((c) =>
    c === ' ' ? '<span class="esp"></span>' : /[\p{L}\p{N}_]/u.test(c) ? `<span class="letra">${c === '_' ? '&nbsp;' : esc(c)}</span>` : esc(c)
  ).join('') + `<span class="qtd">(${letras})</span>`;
}

function renderJogo() {
  if (!est) return;
  mostrar('tela-jogo');
  if (est.idVez !== idVezAtual) {
    idVezAtual = est.idVez;
    if (!minhaPalavra || minhaPalavra.idVez !== est.idVez) minhaPalavra = null;
    acerteiPalavra = null; borracha = false; $('#f-borracha').classList.remove('ativo');
  }
  const souDesenhista = est.desenhista === meuId;
  $('#j-rodada').textContent = `Rodada ${est.rodada}/${est.config.rodadas}`;
  renderPalavra();
  $('#j-tema').innerHTML = est.estado === 'desenhando'
    ? (souDesenhista ? 'Desenhe sem escrever letras nem números!' : `<b>${esc(est.nomeDesenhista)}</b> está desenhando · tema: <b>${esc(est.tema)}</b>`)
    : est.estado === 'escolhendo' ? `<b>${esc(est.nomeDesenhista || '')}</b> está escolhendo a palavra…` : '';

  // sobreposições
  const escolha = $('#sobre-escolha');
  if (est.estado === 'escolhendo' && !souDesenhista) {
    escolha.innerHTML = `<h2>✏️ ${esc(est.nomeDesenhista)}</h2><p>está escolhendo uma palavra…</p>`;
    escolha.classList.add('ativo');
  } else if (est.estado !== 'escolhendo') escolha.classList.remove('ativo');

  const rev = $('#sobre-revela');
  if (est.estado === 'revelando' && est.revelacao) {
    const r = est.revelacao;
    const motivo = { tempo: '⏰ Acabou o tempo!', todos: '🎉 Todos acertaram!', saiu: 'O desenhista saiu.', pulou: 'Vez pulada.' }[r.motivo] || '';
    rev.innerHTML = r.palavra
      ? `<p>${motivo}</p><p>A palavra era</p><div class="revela-palavra">${esc(r.palavra)}</div>
         <div class="dica-peq" style="color:#cfd8ff">${esc(r.tema)}</div>
         <div class="revela-exp">${esc(r.explicacao)}</div>
         <div class="revela-pts">${r.pontos.map((p) => `<span>${esc(p.nome)} +${p.pts}</span>`).join('') || '<span style="background:#6c757d">Ninguém acertou</span>'}</div>`
      : `<h2>${motivo}</h2>`;
    rev.classList.add('ativo');
  } else rev.classList.remove('ativo');

  $('#ferramentas').classList.toggle('ativo', souDesenhista && est.estado === 'desenhando');
  cv.classList.toggle('pode', possoDesenhar());

  const inp = $('#palpite');
  const jaAcertei = acerteiPalavra && acerteiPalavra.idVez === est.idVez;
  inp.disabled = souDesenhista && est.estado === 'desenhando';
  inp.placeholder = inp.disabled ? 'Você está desenhando!' : jaAcertei ? 'Chat de quem acertou…' : 'Digite seu palpite…';

  const ordenados = [...est.jogadores].sort((a, b) => b.pontos - a.pontos);
  $('#placar').innerHTML = ordenados.map((j) => {
    const cls = ['jog', j.id === est.desenhista ? 'desenhando' : '', j.acertou ? 'acertou' : '', j.id === meuId ? 'eu' : ''].join(' ');
    const ic = j.id === est.desenhista ? '✏️' : j.acertou ? '✅' : '';
    return `<div class="${cls}"><span>${ic}</span><span class="nm">${esc(j.nome)}</span><span class="pts">${j.pontos}</span></div>`;
  }).join('');

  fimLocal = Date.now() + (est.restante || 0);
}

function renderFim() {
  mostrar('tela-fim');
  const r = [...est.jogadores].sort((a, b) => b.pontos - a.pontos);
  const med = ['🥇', '🥈', '🥉'];
  const ordemPodio = [1, 0, 2];
  $('#podio').innerHTML = ordemPodio.filter((i) => r[i]).map((i) =>
    `<div class="degrau p${i + 1}"><div class="medalha">${med[i]}</div><div class="nm">${esc(r[i].nome)}</div><div>${r[i].pontos} pts</div></div>`
  ).join('');
  $('#ranking').innerHTML = r.slice(3).map((j) => `<li>${esc(j.nome)} — ${j.pontos} pts</li>`).join('');
}

$('#btn-pular').addEventListener('click', () => socket.emit('pularVez'));
$('#btn-novamente').addEventListener('click', () => socket.emit('voltarEspera'));

socket.on('estado', (s) => {
  est = s;
  document.body.classList.toggle('anfitriao', s.anfitriao === meuId);
  if (s.estado === 'espera') renderEspera();
  else if (s.estado === 'fim') renderFim();
  else renderJogo();
});

// relógio
setInterval(() => {
  if (!est || !['escolhendo', 'desenhando'].includes(est.estado)) { $('#j-relogio').textContent = '–'; $('#j-relogio').classList.remove('urgente'); return; }
  const s = Math.max(0, Math.ceil((fimLocal - Date.now()) / 1000));
  $('#j-relogio').textContent = s;
  $('#j-relogio').classList.toggle('urgente', est.estado === 'desenhando' && s <= 10);
}, 250);

socket.on('disconnect', () => toast('Conexão perdida… recarregue a página.', 'var(--erro)'));
