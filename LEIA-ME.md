# Gartic da Física 🎨⚛️

É um jogo de desenhar e adivinhar conceitos de Física, para jogar pelo celular. Cada aluno entra pelo navegador, sem instalar nenhum aplicativo.

- Na tela inicial, o aluno escolhe a turma (**1ª série** ou **2ª série**), digita o nome e o código da sala (ex.: 1A).
- Todos os alunos que usam a mesma turma e o mesmo código caem na mesma partida.
- O primeiro a entrar vira o **anfitrião 👑**. Ele escolhe os temas, o número de rodadas e o tempo, e inicia o jogo.
- Em cada vez, um aluno recebe 3 palavras para escolher e desenha a que preferir. Os outros digitam os palpites.
  - Respostas sem acento, em maiúsculas ou no plural também são aceitas.
  - Quando o palpite chega perto da palavra, o jogo avisa: "está quase lá!".
  - Ao longo do tempo, algumas letras vão sendo reveladas como dica.
- No fim de cada vez, o jogo mostra a palavra e uma explicação curta do conceito.
- **Pontuação:** quem acerta mais rápido ganha mais pontos, e o desenhista ganha pontos por cada acerto.

---

## Opção A — Rodar no seu notebook, pelo Wi-Fi da escola (mais simples)

1. Instale o **Node.js** (versão LTS) pelo site https://nodejs.org. É só avançar até concluir.
2. Descompacte esta pasta em algum lugar, por exemplo na Área de Trabalho.
3. Abra o terminal dentro da pasta:
   - **Windows:** abra a pasta, clique na barra de endereço, digite `cmd` e aperte Enter.
   - **Mac/Linux:** abra o Terminal e use `cd` até chegar à pasta.
4. Só na primeira vez, digite e aperte Enter:
   ```
   npm install
   ```
5. Para ligar o jogo:
   ```
   npm start
   ```
6. O terminal mostra um endereço parecido com `http://192.168.0.15:3000`. Abra `http://localhost:3000` no seu notebook e entre na sala. A sala de espera exibe um **QR code** com o endereço certo. Projete na TV ou no projetor e peça para os alunos apontarem a câmera.
7. Para desligar, aperte **Ctrl + C** no terminal.

⚠️ O notebook e os celulares precisam estar **na mesma rede Wi-Fi**. Algumas redes escolares bloqueiam a comunicação entre aparelhos. Se os celulares não conseguirem abrir o endereço, peça ao TI para liberar a porta 3000 ou use a Opção B.

💡 Na primeira vez, o Windows pode perguntar se permite o acesso do Node.js à rede. Clique em **Permitir**.

---

## Opção B — Colocar na internet (link fixo, funciona até no 4G)

Um caminho gratuito é o **Render** (https://render.com):

1. Crie uma conta no **GitHub** (https://github.com), crie um repositório novo e envie os arquivos desta pasta. Pelo site dá para arrastar os arquivos, **exceto a pasta `node_modules`**.
2. Entre no Render com a conta do GitHub e clique em **New → Web Service**.
3. Escolha o repositório e preencha:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Clique em **Create Web Service**. Em alguns minutos aparece um link como `https://gartic-da-fisica.onrender.com`.

No plano gratuito, o servidor "dorme" depois de um tempo sem uso. Abra o link uns 2 minutos antes da aula para ele "acordar".

---

## Como trocar ou acrescentar palavras

Abra o arquivo **`palavras.js`** num editor de texto, como o Bloco de Notas ou o VS Code. Cada linha segue este formato:

```js
{ p: "Empuxo", a: ["outra resposta aceita"], d: "Explicação que aparece no fim da vez." },
```

- `p`: a palavra
- `a`: outras respostas aceitas (opcional)
- `d`: a explicação

Para criar um tema novo, copie um bloco inteiro (ex.: `"Calorimetria": [ ... ],`) e troque o nome e as palavras. Depois de salvar, desligue e ligue o jogo de novo (`npm start`).

---

## Dicas para a aula

- Os grupos podem jogar em salas separadas, usando códigos diferentes: 1A-G1, 1A-G2...
- Se você entrar no projetor com um nome como "Professor", o quadro aparece grande para a turma toda. Mas lembre que você também entra na fila para desenhar. Se não quiser, use o botão **Pular esta vez** (só o anfitrião vê).
- Funcionam bem até cerca de 30 alunos por sala. Com turmas grandes, partidas em grupos de 6 a 10 costumam render mais.
