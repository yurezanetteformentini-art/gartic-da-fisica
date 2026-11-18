// Banco de palavras do Gartic da Física
// p = palavra | a = outras respostas aceitas | d = explicação mostrada no fim da vez
// Para acrescentar palavras, copie uma linha e altere o texto.

module.exports = {
  "1": {
    nome: "1ª série",
    temas: {
      "Cinemática": [
        { p: "Referencial", d: "Corpo ou ponto a partir do qual dizemos se algo está em movimento ou em repouso." },
        { p: "Trajetória", d: "Caminho formado pelas posições ocupadas por um corpo ao longo do tempo; depende do referencial." },
        { p: "Deslocamento", d: "Variação da posição entre o ponto de partida e o de chegada, sem depender do caminho percorrido." },
        { p: "Velocidade média", a: ["velocidade"], d: "Razão entre o deslocamento e o intervalo de tempo: v = Δs/Δt." },
        { p: "Aceleração", d: "Taxa de variação da velocidade no tempo: a = Δv/Δt." },
        { p: "Movimento uniforme", a: ["MU"], d: "Movimento com velocidade constante: distâncias iguais em tempos iguais." },
        { p: "Movimento uniformemente variado", a: ["MUV"], d: "Movimento com aceleração constante: a velocidade varia igualmente a cada segundo." },
        { p: "Queda livre", d: "Corpo solto sob ação apenas da gravidade, com aceleração de cerca de 10 m/s²." },
        { p: "Lançamento oblíquo", d: "Lançamento inclinado em relação ao solo; a trajetória é uma parábola." },
        { p: "Lançamento horizontal", d: "Movimento uniforme na horizontal combinado com queda livre na vertical." },
        { p: "Movimento circular", d: "Trajetória circular: mesmo com rapidez constante, a direção da velocidade muda o tempo todo." },
        { p: "Velocímetro", d: "Instrumento que indica a velocidade instantânea de um veículo." },
        { p: "Frenagem", a: ["freada", "frear", "freio"], d: "Redução da velocidade: a aceleração tem sentido oposto ao do movimento." },
        { p: "Ultrapassagem", d: "Exemplo de velocidade relativa: um veículo mais rápido passa outro no mesmo sentido." }
      ],
      "Modalidades de energia": [
        { p: "Energia solar", a: ["painel solar", "placa solar"], d: "Energia da radiação do Sol, aproveitada em painéis fotovoltaicos ou aquecedores solares." },
        { p: "Energia eólica", a: ["eolica", "aerogerador", "turbina eolica"], d: "Energia cinética dos ventos convertida em energia elétrica por aerogeradores." },
        { p: "Usina hidrelétrica", a: ["hidreletrica", "energia hidreletrica", "energia hidraulica"], d: "Converte a energia potencial gravitacional da água represada em energia elétrica." },
        { p: "Energia nuclear", a: ["usina nuclear"], d: "Energia liberada na fissão de núcleos atômicos, como os de urânio." },
        { p: "Energia química", d: "Energia armazenada nas ligações químicas, presente em alimentos, combustíveis e pilhas." },
        { p: "Energia elétrica", a: ["eletricidade"], d: "Energia associada ao movimento de cargas elétricas; chega às casas pela rede de fios." },
        { p: "Energia térmica", d: "Energia associada à agitação das partículas de um corpo." },
        { p: "Energia sonora", a: ["som"], d: "Energia transportada por ondas mecânicas, como o som no ar." },
        { p: "Energia luminosa", a: ["luz"], d: "Energia transportada pela luz, uma onda eletromagnética." },
        { p: "Energia geotérmica", a: ["geotermica"], d: "Energia térmica do interior da Terra, aproveitada perto de vulcões e gêiseres." },
        { p: "Biomassa", a: ["energia da biomassa"], d: "Matéria orgânica (bagaço de cana, lenha, resíduos) usada para gerar energia." },
        { p: "Energia das marés", a: ["maremotriz", "energia maremotriz"], d: "Aproveita a subida e a descida do nível do mar para gerar eletricidade." },
        { p: "Bateria", a: ["pilha"], d: "Armazena energia química e a converte em energia elétrica." }
      ],
      "Energia mecânica": [
        { p: "Energia cinética", a: ["cinetica"], d: "Energia associada ao movimento: Ec = m·v²/2." },
        { p: "Energia potencial gravitacional", a: ["potencial gravitacional"], d: "Energia associada à altura em relação a um nível de referência: Ep = m·g·h." },
        { p: "Energia potencial elástica", a: ["potencial elastica"], d: "Energia armazenada em corpos deformados, como molas: Ep = k·x²/2." },
        { p: "Conservação da energia", a: ["conservacao da energia mecanica"], d: "Sem atrito, a energia mecânica (cinética + potencial) permanece constante." },
        { p: "Montanha-russa", d: "Troca contínua entre energia potencial (no alto) e cinética (embaixo)." },
        { p: "Pêndulo", d: "Oscila trocando energia potencial gravitacional e cinética a cada ida e volta." },
        { p: "Mola", d: "Comprimida ou esticada, armazena energia potencial elástica." },
        { p: "Estilingue", a: ["atiradeira", "baladeira", "bodoque", "setra"], d: "Converte a energia potencial elástica do elástico em energia cinética da pedra." },
        { p: "Trabalho", d: "Energia transferida por uma força ao longo de um deslocamento: τ = F·d·cos θ." },
        { p: "Potência", d: "Rapidez com que a energia é transferida: P = E/Δt, medida em watts." },
        { p: "Bate-estaca", d: "Eleva um peso (ganha energia potencial) e o solta para cravar estacas (energia cinética)." },
        { p: "Salto com vara", d: "Energia cinética da corrida vira energia elástica da vara e depois energia potencial gravitacional." },
        { p: "Atrito", d: "Transforma parte da energia mecânica em energia térmica." }
      ],
      "Espectro eletromagnético": [
        { p: "Ondas de rádio", a: ["onda de radio", "radio"], d: "Ondas eletromagnéticas de maior comprimento de onda, usadas em rádio, TV e comunicação." },
        { p: "Micro-ondas", a: ["forno de micro-ondas"], d: "Usadas no forno de micro-ondas, em radares e no Wi-Fi." },
        { p: "Infravermelho", d: "Radiação percebida como calor; usada em controles remotos e câmeras térmicas." },
        { p: "Luz visível", a: ["luz"], d: "Única faixa do espectro que nossos olhos enxergam, do vermelho ao violeta." },
        { p: "Ultravioleta", a: ["UV", "raios ultravioleta"], d: "Radiação com frequência maior que a do violeta; causa bronzeamento e queimaduras." },
        { p: "Raios X", a: ["raio x"], d: "Radiação de alta energia que atravessa tecidos moles; usada em radiografias." },
        { p: "Raios gama", a: ["raio gama"], d: "Radiação de maior frequência e energia do espectro, emitida por núcleos radioativos." },
        { p: "Arco-íris", d: "As gotas de chuva decompõem a luz branca do Sol em cores de diferentes frequências." },
        { p: "Prisma", d: "Separa a luz branca nas cores do espectro visível (dispersão da luz)." },
        { p: "Comprimento de onda", d: "Distância entre duas cristas consecutivas de uma onda." },
        { p: "Frequência", d: "Número de oscilações por segundo (hertz); quanto maior, maior a energia da radiação." },
        { p: "Antena", d: "Emite ou recebe ondas eletromagnéticas, como as de rádio e de celular." },
        { p: "Protetor solar", d: "Bloqueia ou absorve a radiação ultravioleta do Sol." },
        { p: "Controle remoto", d: "Envia comandos à TV por meio de radiação infravermelha." },
        { p: "Radiografia", d: "Imagem dos ossos obtida com raios X, que atravessam os tecidos moles." }
      ],
      "Máquinas térmicas": [
        { p: "Máquina a vapor", d: "Transforma calor em trabalho pela expansão do vapor d'água; símbolo da Revolução Industrial." },
        { p: "Locomotiva a vapor", a: ["maria-fumaca", "trem a vapor", "trem"], d: "Trem movido a vapor: o calor da queima do carvão vira movimento." },
        { p: "Motor a combustão", a: ["motor", "motor de carro", "motor a explosao"], d: "A queima do combustível nos cilindros expande os gases, que empurram os pistões." },
        { p: "Pistão", a: ["embolo"], d: "Peça que se move dentro do cilindro, empurrada pela expansão dos gases." },
        { p: "Geladeira", a: ["refrigerador"], d: "Máquina térmica invertida: usa trabalho para retirar calor de dentro e liberá-lo no ambiente." },
        { p: "Ar-condicionado", d: "Retira calor do ambiente interno e o libera do lado de fora, consumindo energia elétrica." },
        { p: "Turbina a vapor", a: ["turbina"], d: "O vapor em alta pressão gira as pás da turbina, que movimenta um gerador." },
        { p: "Usina termelétrica", a: ["termeletrica", "termoeletrica"], d: "Queima combustível para gerar vapor, que move turbinas e produz eletricidade." },
        { p: "Fonte quente", d: "Reservatório de onde a máquina térmica retira calor, como a queima do combustível." },
        { p: "Fonte fria", d: "Reservatório para onde vai o calor que não virou trabalho, como o ambiente." },
        { p: "Rendimento", a: ["eficiencia"], d: "Fração do calor recebido que vira trabalho útil; nenhuma máquina térmica chega a 100%." },
        { p: "Escapamento", d: "Por onde saem os gases quentes do motor: o calor rejeitado para a fonte fria." },
        { p: "Compressor", d: "Parte da geladeira que comprime o gás refrigerante, realizando trabalho sobre ele." }
      ]
    }
  },

  "2": {
    nome: "2ª série",
    temas: {
      "Leis de Newton": [
        { p: "Inércia", a: ["primeira lei de newton", "lei da inercia"], d: "1ª Lei: um corpo tende a manter seu repouso ou seu movimento retilíneo uniforme." },
        { p: "Força resultante", d: "Soma vetorial de todas as forças que atuam em um corpo." },
        { p: "Princípio fundamental da dinâmica", a: ["segunda lei de newton", "F=ma", "Fr=ma"], d: "2ª Lei: a força resultante é igual à massa vezes a aceleração (F = m·a)." },
        { p: "Ação e reação", a: ["terceira lei de newton", "lei da acao e reacao"], d: "3ª Lei: as forças surgem aos pares, com mesma intensidade e sentidos opostos, em corpos diferentes." },
        { p: "Força peso", a: ["peso"], d: "Força com que a Terra atrai os corpos: P = m·g." },
        { p: "Força normal", a: ["normal"], d: "Força de contato perpendicular à superfície que apoia um corpo." },
        { p: "Força de atrito", a: ["atrito"], d: "Força de contato que se opõe ao deslizamento entre superfícies." },
        { p: "Tração", a: ["forca de tracao", "tensao na corda"], d: "Força transmitida por cordas, cabos ou fios esticados." },
        { p: "Cinto de segurança", a: ["cinto"], d: "Numa freada, o corpo tende a seguir em frente por inércia; o cinto o segura." },
        { p: "Foguete", d: "Expele gases para trás e é empurrado para a frente: ação e reação." },
        { p: "Dinamômetro", d: "Instrumento que mede forças pela deformação de uma mola." },
        { p: "Plano inclinado", a: ["rampa"], d: "No plano inclinado, o peso se decompõe em uma parte paralela e outra perpendicular à superfície." },
        { p: "Polia", a: ["roldana"], d: "Roda com sulco por onde passa uma corda; muda a direção da força de tração." },
        { p: "Cabo de guerra", d: "Vence o lado para onde aponta a força resultante." },
        { p: "Massa", d: "Medida da inércia de um corpo (kg); ao contrário do peso, não muda de lugar para lugar." }
      ],
      "Pressão": [
        { p: "Pressão", d: "Força dividida pela área em que ela se distribui: p = F/A." },
        { p: "Área de contato", a: ["area"], d: "Para a mesma força, quanto menor a área, maior a pressão." },
        { p: "Faca afiada", a: ["faca"], d: "O fio tem área muito pequena, então a pressão é grande e corta com pouca força." },
        { p: "Cama de pregos", d: "Muitos pregos espalham o peso em uma área maior e a pressão em cada ponto fica pequena." },
        { p: "Salto alto", d: "O salto fino concentra o peso numa área pequena, gerando grande pressão no chão." },
        { p: "Raquete de neve", a: ["sapato de neve"], d: "Aumenta a área de apoio do pé e diminui a pressão, evitando afundar na neve." },
        { p: "Percevejo", a: ["tachinha"], d: "A ponta tem área pequena: a pressão é alta e ele entra facilmente no mural." },
        { p: "Pressão atmosférica", d: "Pressão exercida pelo peso do ar; ao nível do mar vale cerca de 1 atm (≈ 100 000 Pa)." },
        { p: "Barômetro", d: "Instrumento que mede a pressão atmosférica." },
        { p: "Ventosa", d: "Fica presa porque a pressão do ar de fora é maior que a pressão dentro dela." },
        { p: "Canudo", a: ["canudinho"], d: "Ao sugar, a pressão dentro do canudo diminui e a pressão atmosférica empurra o líquido para cima." },
        { p: "Seringa", d: "Ao puxar o êmbolo, a pressão interna cai e o líquido é empurrado para dentro." },
        { p: "Prensa hidráulica", a: ["macaco hidraulico", "elevador hidraulico"], d: "Princípio de Pascal: a pressão se transmite pelo líquido e multiplica a força." }
      ],
      "Pressão hidrostática": [
        { p: "Pressão hidrostática", d: "Pressão exercida por um líquido em repouso; aumenta com a profundidade (p = d·g·h)." },
        { p: "Profundidade", d: "Quanto mais fundo, maior a coluna de líquido acima e maior a pressão." },
        { p: "Mergulhador", a: ["mergulho"], d: "A pressão aumenta cerca de 1 atm a cada 10 m de profundidade na água." },
        { p: "Barragem", a: ["represa", "dique"], d: "É mais larga embaixo porque a pressão da água aumenta com a profundidade." },
        { p: "Vasos comunicantes", d: "Recipientes ligados pela base: o líquido fica na mesma altura em todos eles." },
        { p: "Caixa-d'água", a: ["caixa d agua", "reservatorio"], d: "Fica no alto para que a pressão da coluna de água leve a água às torneiras." },
        { p: "Submarino", d: "Precisa de um casco resistente para suportar a enorme pressão da água em grandes profundidades." },
        { p: "Manômetro", d: "Instrumento que mede a pressão de líquidos e gases." },
        { p: "Garrafa furada", a: ["garrafa com furos"], d: "Com furos em alturas diferentes, o jato do furo mais baixo sai mais forte (maior pressão)." },
        { p: "Peixe abissal", a: ["peixe das profundezas"], d: "Vive em grandes profundidades, sob uma pressão centenas de vezes maior que a atmosférica." },
        { p: "Lei de Stevin", a: ["stevin", "teorema de stevin"], d: "A diferença de pressão entre dois pontos de um líquido é Δp = d·g·Δh." }
      ],
      "Empuxo": [
        { p: "Empuxo", d: "Força vertical para cima que um fluido exerce sobre um corpo, igual ao peso do fluido deslocado." },
        { p: "Arquimedes", a: ["principio de arquimedes", "eureka"], d: "Cientista grego que formulou o princípio do empuxo; diz a lenda que gritou 'Eureka!' na banheira." },
        { p: "Navio", a: ["barco"], d: "Mesmo feito de aço, flutua porque seu formato desloca um grande volume de água." },
        { p: "Boia", d: "Tem baixa densidade média e flutua: o empuxo equilibra seu peso." },
        { p: "Colete salva-vidas", a: ["colete"], d: "Aumenta o volume com pouca massa, aumentando o empuxo sobre quem o veste." },
        { p: "Balão de ar quente", a: ["balao"], d: "O ar quente é menos denso que o ar ao redor; o empuxo faz o balão subir." },
        { p: "Densidade", d: "Massa por unidade de volume (d = m/V); corpos menos densos que o líquido flutuam." },
        { p: "Iceberg", d: "O gelo é um pouco menos denso que a água do mar e flutua com cerca de 90% submerso." },
        { p: "Flutuação", a: ["flutuar", "boiar"], d: "Ocorre quando o empuxo equilibra o peso do corpo." },
        { p: "Densímetro", d: "Flutua no líquido e indica sua densidade pela altura em que afunda." },
        { p: "Bexiga natatória", d: "Bolsa de gás que permite ao peixe ajustar sua densidade e flutuar em diferentes profundidades." },
        { p: "Ovo na água com sal", a: ["ovo flutuando", "ovo na agua salgada", "ovo"], d: "O sal aumenta a densidade da água; o empuxo cresce e o ovo passa a flutuar." },
        { p: "Mar Morto", d: "Sua água é tão salgada e densa que as pessoas flutuam com facilidade." }
      ],
      "Calorimetria": [
        { p: "Calor", d: "Energia térmica em trânsito, que passa espontaneamente do corpo mais quente para o mais frio." },
        { p: "Temperatura", d: "Medida do grau de agitação das partículas de um corpo." },
        { p: "Termômetro", d: "Instrumento que mede a temperatura." },
        { p: "Equilíbrio térmico", d: "Corpos em contato atingem a mesma temperatura e deixam de trocar calor." },
        { p: "Calor específico", d: "Calor necessário para aquecer 1 g de uma substância em 1 °C; o da água é 1 cal/g·°C." },
        { p: "Calor sensível", d: "Calor que provoca variação de temperatura: Q = m·c·Δθ." },
        { p: "Calor latente", d: "Calor que provoca mudança de estado físico sem variar a temperatura: Q = m·L." },
        { p: "Fusão", a: ["derretimento", "derreter"], d: "Passagem do sólido para o líquido, como o gelo derretendo." },
        { p: "Solidificação", a: ["congelamento", "congelar"], d: "Passagem do líquido para o sólido, como a água virando gelo." },
        { p: "Ebulição", a: ["fervura", "ferver", "vaporizacao"], d: "Vaporização em toda a massa do líquido, com formação de bolhas." },
        { p: "Condensação", a: ["liquefacao"], d: "Passagem do vapor para o líquido, como as gotas no lado de fora de um copo gelado." },
        { p: "Sublimação", d: "Passagem direta do sólido para o gasoso, como a naftalina e o gelo-seco." },
        { p: "Calorímetro", d: "Recipiente isolado usado para medir as trocas de calor entre corpos." },
        { p: "Garrafa térmica", d: "Dificulta a condução, a convecção e a irradiação, mantendo a temperatura do conteúdo." },
        { p: "Convecção", d: "Transmissão de calor por correntes de fluido, como na água aquecida em uma panela." }
      ],
      "Circuito elétrico simples": [
        { p: "Pilha", a: ["bateria"], d: "Gerador que transforma energia química em elétrica e mantém uma diferença de potencial no circuito." },
        { p: "Lâmpada", d: "Converte energia elétrica em luz e calor." },
        { p: "Interruptor", a: ["chave", "botao"], d: "Abre ou fecha o circuito, impedindo ou permitindo a corrente." },
        { p: "Resistor", a: ["resistencia"], d: "Opõe-se à passagem da corrente e transforma energia elétrica em térmica (efeito Joule)." },
        { p: "Fio condutor", a: ["fio", "condutor"], d: "Material que permite a passagem da corrente elétrica, como o cobre." },
        { p: "Corrente elétrica", a: ["corrente"], d: "Movimento ordenado de cargas elétricas; medida em ampères (A)." },
        { p: "Tensão elétrica", a: ["ddp", "voltagem", "diferenca de potencial", "tensao"], d: "Diferença de potencial que impulsiona as cargas no circuito; medida em volts (V)." },
        { p: "Circuito em série", a: ["associacao em serie", "serie"], d: "Componentes um após o outro: a mesma corrente passa por todos; se um queima, todos apagam." },
        { p: "Circuito em paralelo", a: ["associacao em paralelo", "paralelo"], d: "Componentes em ramos separados com a mesma tensão; se um queima, os outros continuam." },
        { p: "Curto-circuito", d: "Ligação de resistência quase nula: a corrente fica muito alta e pode causar aquecimento e incêndio." },
        { p: "Circuito aberto", d: "Circuito interrompido em algum ponto: não há corrente elétrica." },
        { p: "Amperímetro", d: "Mede a corrente elétrica e é ligado em série no circuito." },
        { p: "Voltímetro", d: "Mede a tensão elétrica e é ligado em paralelo ao componente." },
        { p: "Fusível", a: ["disjuntor"], d: "Protege o circuito: interrompe a corrente quando ela fica alta demais." },
        { p: "LED", d: "Diodo emissor de luz: só acende com a corrente no sentido certo e consome pouca energia." }
      ]
    }
  }
};
