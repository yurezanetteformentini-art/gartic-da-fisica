// Gartic da Física — servidor multijogador
// Para iniciar: npm install  e depois  npm start

const express = require('express');
const http = require('http');
const os = require('os');
const path = require('path');
const { Server } = require('socket.io');
const QRCode = require('qrcode');
const BANCO = require('./palavras');

const PORT = process.env.PORT || 3000;
const TEMPO_ESCOLHA = 15;   // segundos para o desenhista escolher a palavra
const TEMPO_REVELACAO = 8;  // segundos mostrando a resposta e a explicação

const app = express();
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 1e6 });

app.use(express.static(path.join(__dirname, 'public')));

function enderecosRede() {
  const lista = [];
  for (const ifs of Object.values(os.networkInterfaces())) {
    for (const i of ifs || []) {
      if (i.family === 'IPv4' && !i.internal) lista.push(`http://${i.address}:${PORT}`);
    }
  }
  return lista;
}

app.get('/info', (req, res) => res.json({ rede: enderecosRede() }));

app.get('/qr', async (req, res) => {
  const t = String(req.query.t || '').slice(0, 300);
  if (!t) return res.status(400).end();
  try {
    const svg = await QRCode.toString(t, { type: 'svg', margin: 1 });
    res.type('image/svg+xml').send(svg);
  } catch { res.status(500).end(); }
});

app.get('/temas', (req, res) => {
  const out = {};
  for (const [k, v] of Object.entries(BANCO)) out[k] = { nome: v.nome, temas: Object.keys(v.temas) };
  res.json(out);
});

// ---------- utilidades ----------
function normalizar(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/^(o|a|os|as|um|uma)\s+/, '')
    .replace(/[^a-z0-9]/g, '');
}

function distancia(a, b) {
  if (Math.abs(a.length - b.length) > 3) return 99;
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return m[a.length][b.length];
}

function conferir(palpite, palavra) {
  const g = normalizar(palpite);
  if (!g) return 'erro';
  const opcoes = [palavra.p, ...(palavra.a || [])].map(normalizar);
  for (const o of opcoes) {
    if (g === o || g + 's' === o || g === o + 's' || g + 'es' === o || g === o + 'es') return 'acerto';
  }
  for (const o of opcoes) {
    const lim = o.length >= 9 ? 2 : o.length >= 5 ? 1 : 0;
    if (lim && distancia(g, o) <= lim) return 'quase';
  }
  return 'erro';
}

function limparNome(n) { return String(n || '').replace(/[<>&"]/g, '').trim().slice(0, 16); }
function limparSala(s) { return String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'GERAL'; }
function embaralhar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ---------- salas ----------
const salas = new Map();

function obterSala(serie, sala) {
  const chave = `${serie}:${sala}`;
  let r = salas.get(chave);
  if (!r) {
    r = {
      chave, serie, sala,
      jogadores: new Map(),
      anfitriao: null,
      estado: 'espera',          // espera | escolhendo | desenhando | revelando | fim
      config: { rodadas: 2, tempo: 80, temas: Object.keys(BANCO[serie].temas) },
      ordem: [], vez: -1, rodada: 0, idVez: 0,
      desenhista: null, opcoes: null, palavra: null, mascara: null,
      tracos: [], fimEm: 0, timers: [], usadas: new Set(), pontosVez: {},
      revelacao: null, aviso: null
    };
    salas.set(chave, r);
  }
  return r;
}

function limparTimers(r) { r.timers.forEach(clearTimeout); r.timers = []; }

function estadoPublico(r) {
  const d = r.jogadores.get(r.desenhista);
  return {
    serie: r.serie, nomeSerie: BANCO[r.serie].nome, sala: r.sala,
    estado: r.estado, config: r.config,
    rodada: r.rodada, idVez: r.idVez,
    anfitriao: r.anfitriao, desenhista: r.desenhista, nomeDesenhista: d ? d.nome : null,
    mascara: r.mascara,
    tema: r.palavra && r.estado === 'desenhando' ? r.palavra.tema : null,
    restante: r.estado === 'desenhando' || r.estado === 'escolhendo' ? Math.max(0, r.fimEm - Date.now()) : 0,
    jogadores: [...r.jogadores.values()].map(j => ({ id: j.id, nome: j.nome, pontos: j.pontos, acertou: j.acertou })),
    revelacao: r.estado === 'revelando' ? r.revelacao : null,
    aviso: r.aviso
  };
}

function enviarEstado(r) { io.to(r.chave).emit('estado', estadoPublico(r)); }

function sistema(r, texto, tipo = 'sistema') { io.to(r.chave).emit('mensagem', { tipo, texto }); }

function sortearPalavras(r, n) {
  const banco = BANCO[r.serie].temas;
  let todas = [];
  for (const t of r.config.temas) for (const w of banco[t] || []) todas.push({ ...w, tema: t });
  let livres = todas.filter(w => !r.usadas.has(w.p));
  if (livres.length < n) { r.usadas.clear(); livres = todas; }
  // prioriza temas diferentes entre as opções
  const escolhidas = [];
  const porTema = embaralhar(livres);
  for (const w of porTema) {
    if (escolhidas.length >= n) break;
    if (!escolhidas.some(e => e.tema === w.tema)) escolhidas.push(w);
  }
  for (const w of porTema) {
    if (escolhidas.length >= n) break;
    if (!escolhidas.includes(w)) escolhidas.push(w);
  }
  return escolhidas;
}

function voltarEspera(r, aviso) {
  limparTimers(r);
  r.estado = 'espera'; r.desenhista = null; r.palavra = null; r.mascara = null; r.opcoes = null;
  r.tracos = []; r.rodada = 0; r.vez = -1; r.aviso = aviso || null;
  for (const j of r.jogadores.values()) j.acertou = false;
  io.to(r.chave).emit('quadro', []);
  enviarEstado(r);
}

function iniciarJogo(r) {
  for (const j of r.jogadores.values()) { j.pontos = 0; j.acertou = false; }
  r.usadas.clear();
  r.rodada = 1; r.vez = -1; r.aviso = null;
  r.ordem = embaralhar([...r.jogadores.keys()]);
  sistema(r, 'O jogo começou! Boa sorte 🎨');
  proximaVez(r);
}

function proximaVez(r) {
  limparTimers(r);
  if (r.jogadores.size < 2) return voltarEspera(r, 'São necessários pelo menos 2 jogadores.');
  r.vez++;
  while (r.vez < r.ordem.length && !r.jogadores.has(r.ordem[r.vez])) r.vez++;
  if (r.vez >= r.ordem.length) {
    r.rodada++;
    if (r.rodada > r.config.rodadas) return fimDeJogo(r);
    r.ordem = embaralhar([...r.jogadores.keys()]);
    r.vez = 0;
  }
  r.idVez++;
  r.desenhista = r.ordem[r.vez];
  r.palavra = null; r.mascara = null; r.tracos = []; r.pontosVez = {}; r.revelacao = null;
  for (const j of r.jogadores.values()) j.acertou = false;
  r.opcoes = sortearPalavras(r, 3);
  r.estado = 'escolhendo';
  r.fimEm = Date.now() + TEMPO_ESCOLHA * 1000;
  io.to(r.chave).emit('quadro', []);
  io.to(r.desenhista).emit('opcoes', r.opcoes.map(o => ({ p: o.p, tema: o.tema })));
  r.timers.push(setTimeout(() => escolherPalavra(r, Math.floor(Math.random() * r.opcoes.length)), TEMPO_ESCOLHA * 1000));
  enviarEstado(r);
}

function escolherPalavra(r, idx) {
  if (r.estado !== 'escolhendo' || !r.opcoes || !r.opcoes[idx]) return;
  limparTimers(r);
  r.palavra = r.opcoes[idx];
  r.opcoes = null;
  r.usadas.add(r.palavra.p);
  r.mascara = [...r.palavra.p].map(c => (/[\p{L}\p{N}]/u.test(c) ? '_' : c));
  r.estado = 'desenhando';
  const total = r.config.tempo * 1000;
  r.fimEm = Date.now() + total;
  r.timers.push(setTimeout(() => fimDaVez(r, 'tempo'), total));
  const letras = r.mascara.filter(c => c === '_').length;
  const dicas = letras >= 10 ? 3 : letras >= 5 ? 2 : 1;
  for (let k = 1; k <= dicas; k++) {
    r.timers.push(setTimeout(() => revelarLetra(r), total * (0.35 + 0.5 * k / (dicas + 1))));
  }
  io.to(r.desenhista).emit('suaPalavra', { p: r.palavra.p, tema: r.palavra.tema, idVez: r.idVez });
  sistema(r, `${r.jogadores.get(r.desenhista).nome} está desenhando!`);
  enviarEstado(r);
}

function revelarLetra(r) {
  if (r.estado !== 'desenhando') return;
  const ocultas = r.mascara.map((c, i) => (c === '_' ? i : -1)).filter(i => i >= 0);
  if (ocultas.length <= 2) return;
  const i = ocultas[Math.floor(Math.random() * ocultas.length)];
  r.mascara[i] = r.palavra.p[i];
  sistema(r, '💡 Dica: uma letra foi revelada!', 'dica');
  enviarEstado(r);
}

function fimDaVez(r, motivo) {
  if (r.estado !== 'desenhando' && r.estado !== 'escolhendo') return;
  limparTimers(r);
  const d = r.jogadores.get(r.desenhista);
  r.revelacao = r.palavra ? {
    palavra: r.palavra.p, tema: r.palavra.tema, explicacao: r.palavra.d,
    desenhista: d ? d.nome : '—',
    motivo,
    pontos: Object.entries(r.pontosVez).map(([id, pts]) => ({ nome: (r.jogadores.get(id) || {}).nome || '—', pts })).sort((a, b) => b.pts - a.pts)
  } : { palavra: null, motivo, desenhista: d ? d.nome : '—', pontos: [] };
  r.estado = 'revelando';
  r.mascara = null;
  enviarEstado(r);
  r.timers.push(setTimeout(() => proximaVez(r), TEMPO_REVELACAO * 1000));
}

function fimDeJogo(r) {
  limparTimers(r);
  r.estado = 'fim'; r.desenhista = null; r.palavra = null; r.mascara = null;
  enviarEstado(r);
}

function tratarPalpite(r, j, texto) {
  texto = String(texto || '').trim().slice(0, 60);
  if (!texto) return;
  const ehDesenhista = j.id === r.desenhista;
  if (r.estado !== 'desenhando') {
    if (r.estado === 'espera' || r.estado === 'fim' || r.estado === 'revelando') {
      io.to(r.chave).emit('mensagem', { tipo: 'chat', nome: j.nome, texto });
    }
    return;
  }
  if (ehDesenhista) return; // desenhista não escreve durante a própria vez
  if (j.acertou) {
    // quem já acertou conversa só com quem também acertou e com o desenhista
    for (const outro of r.jogadores.values()) {
      if (outro.acertou || outro.id === r.desenhista) io.to(outro.id).emit('mensagem', { tipo: 'acertou-chat', nome: j.nome, texto });
    }
    return;
  }
  const res = conferir(texto, r.palavra);
  if (res === 'acerto') {
    j.acertou = true;
    const total = r.config.tempo * 1000;
    const restante = Math.max(0, r.fimEm - Date.now());
    const ordem = [...r.jogadores.values()].filter(x => x.acertou).length;
    const pts = Math.round(50 + 50 * restante / total) + (ordem === 1 ? 10 : 0);
    j.pontos += pts;
    r.pontosVez[j.id] = (r.pontosVez[j.id] || 0) + pts;
    const d = r.jogadores.get(r.desenhista);
    if (d) { d.pontos += 20; r.pontosVez[d.id] = (r.pontosVez[d.id] || 0) + 20; }
    io.to(j.id).emit('voceAcertou', { palavra: r.palavra.p, pts, idVez: r.idVez });
    sistema(r, `🎉 ${j.nome} acertou!`, 'acerto');
    const faltam = [...r.jogadores.values()].filter(x => x.id !== r.desenhista && !x.acertou).length;
    if (faltam === 0) fimDaVez(r, 'todos');
    else enviarEstado(r);
  } else {
    io.to(r.chave).emit('mensagem', { tipo: 'chat', nome: j.nome, texto });
    if (res === 'quase') io.to(j.id).emit('mensagem', { tipo: 'quase', texto: `"${texto}" está quase lá!` });
  }
}

// ---------- conexões ----------
io.on('connection', (socket) => {
  let r = null;

  socket.on('entrar', (dados, cb) => {
    const serie = String(dados && dados.serie);
    if (!BANCO[serie]) return cb && cb({ erro: 'Escolha a turma.' });
    let nome = limparNome(dados.nome);
    if (!nome) return cb && cb({ erro: 'Digite seu nome.' });
    if (r) return;
    r = obterSala(serie, limparSala(dados.sala));
    if (r.jogadores.size >= 40) { r = null; return cb && cb({ erro: 'Sala cheia (máx. 40).' }); }
    const nomes = new Set([...r.jogadores.values()].map(j => j.nome.toLowerCase()));
    let base = nome, n = 2;
    while (nomes.has(nome.toLowerCase())) nome = `${base.slice(0, 13)} ${n++}`;
    const j = { id: socket.id, nome, pontos: 0, acertou: false };
    r.jogadores.set(socket.id, j);
    if (!r.anfitriao) r.anfitriao = socket.id;
    socket.join(r.chave);
    cb && cb({ ok: true, id: socket.id, nome });
    socket.emit('quadro', r.tracos);
    sistema(r, `${nome} entrou na sala.`);
    enviarEstado(r);
  });

  socket.on('configurar', (c) => {
    if (!r || socket.id !== r.anfitriao || r.estado !== 'espera' || !c) return;
    const rod = parseInt(c.rodadas, 10);
    const tempo = parseInt(c.tempo, 10);
    if (rod >= 1 && rod <= 5) r.config.rodadas = rod;
    if ([45, 60, 80, 100, 120].includes(tempo)) r.config.tempo = tempo;
    if (Array.isArray(c.temas)) {
      const validos = c.temas.filter(t => BANCO[r.serie].temas[t]);
      if (validos.length) r.config.temas = validos;
    }
    enviarEstado(r);
  });

  socket.on('iniciar', () => {
    if (!r || socket.id !== r.anfitriao || r.estado !== 'espera') return;
    if (r.jogadores.size < 2) return socket.emit('mensagem', { tipo: 'sistema', texto: 'Espere pelo menos mais 1 jogador.' });
    iniciarJogo(r);
  });

  socket.on('escolher', (idx) => {
    if (!r || socket.id !== r.desenhista) return;
    escolherPalavra(r, parseInt(idx, 10));
  });

  socket.on('traco', (s) => {
    if (!r || socket.id !== r.desenhista || r.estado !== 'desenhando' || !s) return;
    const ok = ['x0', 'y0', 'x1', 'y1'].every(k => typeof s[k] === 'number' && s[k] >= -0.1 && s[k] <= 1.1);
    if (!ok || !/^#[0-9a-fA-F]{6}$/.test(s.c) || !(s.w > 0 && s.w <= 80)) return;
    if (r.tracos.length > 30000) return;
    const seg = { id: String(s.id).slice(0, 20), x0: s.x0, y0: s.y0, x1: s.x1, y1: s.y1, c: s.c, w: s.w };
    r.tracos.push(seg);
    socket.to(r.chave).emit('traco', seg);
  });

  socket.on('desfazer', () => {
    if (!r || socket.id !== r.desenhista || r.estado !== 'desenhando' || !r.tracos.length) return;
    const ultimo = r.tracos[r.tracos.length - 1].id;
    r.tracos = r.tracos.filter(s => s.id !== ultimo);
    io.to(r.chave).emit('quadro', r.tracos);
  });

  socket.on('limpar', () => {
    if (!r || socket.id !== r.desenhista || r.estado !== 'desenhando') return;
    r.tracos = [];
    io.to(r.chave).emit('quadro', []);
  });

  socket.on('palpite', (t) => { if (r && r.jogadores.has(socket.id)) tratarPalpite(r, r.jogadores.get(socket.id), t); });

  socket.on('pularVez', () => {
    if (!r || socket.id !== r.anfitriao) return;
    if (r.estado === 'escolhendo' || r.estado === 'desenhando') { sistema(r, 'O anfitrião pulou esta vez.'); fimDaVez(r, 'pulou'); }
  });

  socket.on('voltarEspera', () => {
    if (!r || socket.id !== r.anfitriao) return;
    if (r.estado === 'fim' || r.estado === 'revelando' || r.estado === 'escolhendo' || r.estado === 'desenhando') voltarEspera(r);
  });

  socket.on('disconnect', () => {
    if (!r) return;
    const j = r.jogadores.get(socket.id);
    r.jogadores.delete(socket.id);
    if (r.jogadores.size === 0) { limparTimers(r); salas.delete(r.chave); return; }
    if (r.anfitriao === socket.id) {
      r.anfitriao = r.jogadores.keys().next().value;
      sistema(r, `${r.jogadores.get(r.anfitriao).nome} agora é o anfitrião.`);
    }
    if (j) sistema(r, `${j.nome} saiu.`);
    const emJogo = ['escolhendo', 'desenhando', 'revelando'].includes(r.estado);
    if (emJogo && r.jogadores.size < 2) return voltarEspera(r, 'Jogadores insuficientes — voltamos para a sala de espera.');
    if (socket.id === r.desenhista && (r.estado === 'escolhendo' || r.estado === 'desenhando')) return fimDaVez(r, 'saiu');
    if (r.estado === 'desenhando') {
      const faltam = [...r.jogadores.values()].filter(x => x.id !== r.desenhista && !x.acertou).length;
      if (faltam === 0) return fimDaVez(r, 'todos');
    }
    enviarEstado(r);
  });
});

server.listen(PORT, () => {
  console.log('\n🎨  Gartic da Física rodando!\n');
  console.log(`   Neste computador:  http://localhost:${PORT}`);
  const rede = enderecosRede();
  if (rede.length) {
    console.log('   Celulares no mesmo Wi-Fi:');
    rede.forEach(u => console.log('     ' + u));
  }
  console.log('\n   Para encerrar, aperte Ctrl + C\n');
});
