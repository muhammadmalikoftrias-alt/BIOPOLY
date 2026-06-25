import React, { useState, useEffect, useRef } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, User, Bot, Heart, AlertTriangle, CheckCircle, XCircle, Home, Building2, ShieldAlert, Zap } from 'lucide-react';

const BOARD_SPACES = [
  { id: 0, name: "START (Sintesis Protein)", type: 'START', color: 'bg-white', cost: 0, rent: 0 },
  { id: 1, name: "Hidung", group: 'Pernapasan', type: 'PROPERTY', color: 'bg-red-200', cost: 100, rent: 10 },
  { id: 2, name: "Trakea", group: 'Pernapasan', type: 'PROPERTY', color: 'bg-red-200', cost: 100, rent: 10 },
  { id: 3, name: "Gaya Hidup", type: 'LIFESTYLE', color: 'bg-blue-100', icon: '☀️' },
  { id: 4, name: "Alveolus", group: 'Pernapasan', type: 'PROPERTY', color: 'bg-red-200', cost: 120, rent: 12 },
  { id: 5, name: "Jantung", group: 'Peredaran', type: 'PROPERTY', color: 'bg-blue-200', cost: 150, rent: 15 },
  { id: 6, name: "Karantina Medis", type: 'JAIL', color: 'bg-gray-300', icon: '🏥' },
  { id: 7, name: "Pembuluh Nadi (Arteri)", group: 'Peredaran', type: 'PROPERTY', color: 'bg-blue-200', cost: 150, rent: 15 },
  { id: 8, name: "Patogen", type: 'PATHOGEN', color: 'bg-red-100', icon: '🦠' },
  { id: 9, name: "Pembuluh Balik (Vena)", group: 'Peredaran', type: 'PROPERTY', color: 'bg-blue-200', cost: 150, rent: 15 },
  { id: 10, name: "Kapiler", group: 'Peredaran', type: 'PROPERTY', color: 'bg-blue-200', cost: 160, rent: 16 },
  { id: 11, name: "Mulut", group: 'Pencernaan', type: 'PROPERTY', color: 'bg-green-200', cost: 180, rent: 18 },
  { id: 12, name: "Parkir Bebas", type: 'FREE_PARKING', color: 'bg-white', icon: '☕' },
  { id: 13, name: "Lambung", group: 'Pencernaan', type: 'PROPERTY', color: 'bg-green-200', cost: 180, rent: 18 },
  { id: 14, name: "Gaya Hidup", type: 'LIFESTYLE', color: 'bg-blue-100', icon: '☀️' },
  { id: 15, name: "Usus Halus", group: 'Pencernaan', type: 'PROPERTY', color: 'bg-green-200', cost: 200, rent: 20 },
  { id: 16, name: "Usus Besar", group: 'Pencernaan', type: 'PROPERTY', color: 'bg-green-200', cost: 200, rent: 20 },
  { id: 17, name: "Ginjal", group: 'Ekskresi', type: 'PROPERTY', color: 'bg-yellow-200', cost: 220, rent: 22 },
  { id: 18, name: "Tertular Penyakit", type: 'GO_TO_JAIL', color: 'bg-gray-300', icon: '🚨' },
  { id: 19, name: "Kulit", group: 'Ekskresi', type: 'PROPERTY', color: 'bg-yellow-200', cost: 220, rent: 22 },
  { id: 20, name: "Patogen", type: 'PATHOGEN', color: 'bg-red-100', icon: '🦠' },
  { id: 21, name: "Hati", group: 'Ekskresi', type: 'PROPERTY', color: 'bg-yellow-200', cost: 240, rent: 24 },
  { id: 22, name: "Paru-paru", group: 'Ekskresi', type: 'PROPERTY', color: 'bg-yellow-200', cost: 250, rent: 25 },
  { id: 23, name: "Gaya Hidup", type: 'LIFESTYLE', color: 'bg-blue-100', icon: '☀️' }
];

const LIFESTYLE_CARDS = [
  { text: "Mengonsumsi Mangga Probolinggo! Vitamin C melimpah.", amount: 100 },
  { text: "Olahraga lari pagi rutin selama seminggu.", amount: 50 },
  { text: "Makan sayur bayam buatan Ibu.", amount: 30 },
  { text: "Tidur cukup 8 jam. Tubuh terasa segar!", amount: 40 },
  { text: "Rutin minum air putih 2 liter hari ini.", amount: 20 },
  { text: "Mendapat Vaksinasi lengkap. Kekebalan tubuh super!", amount: 150 },
  { text: "Rajin cuci tangan pakai sabun sebelum makan.", amount: 30 },
  { text: "Minum suplemen Vitamin C.", amount: 40 },
  { text: "Berhasil menghindari paparan asap rokok seharian.", amount: 80 },
  { text: "Memilih jalan kaki santai ke sekolah.", amount: 50 },
  { text: "Ikut senam pagi bersama teman-teman.", amount: 40 },
  { text: "Bermeditasi mengurangi tingkat stres pikiran.", amount: 30 },
  { text: "Membawa bekal buah-buahan segar.", amount: 50 },
  { text: "Cek kesehatan rutin gratis di Puskesmas.", amount: 100 },
  { text: "Berjemur pagi menyerap Vitamin D.", amount: 40 }
];

const PATHOGEN_CARDS = [
  { text: "Terserang ISPA karena terpapar Angin Gending.", amount: -75 },
  { text: "Terkena virus Influenza. Hidung mampet!", amount: -50 },
  { text: "Batuk berdahak karena infeksi ringan.", amount: -30 },
  { text: "Diare akut setelah jajan sembarangan.", amount: -40 },
  { text: "Demam Berdarah! Dirawat akibat nyamuk Aedes aegypti.", amount: -150 },
  { text: "Tipes (Demam Tifoid) karena bakteri Salmonella.", amount: -100 },
  { text: "Asam lambung naik karena telat makan.", amount: -60 },
  { text: "Asma kambuh terkena debu polusi jalanan.", amount: -80 },
  { text: "Gejala anemia, kurang sel darah merah.", amount: -50 },
  { text: "Keracunan makanan di kantin.", amount: -90 },
  { text: "Infeksi Saluran Kemih karena kurang minum.", amount: -70 },
  { text: "Kolesterol naik karena sering makan gorengan.", amount: -60 },
  { text: "Gula darah melonjak sehabis minum boba manis.", amount: -80 },
  { text: "Dehidrasi parah setelah olahraga tanpa minum.", amount: -40 },
  { text: "Sistem imun turun karena begadang main game.", amount: -50 }
];

const INITIAL_PROPERTY_QUIZZES = {
  1: [
    { q: "Apa fungsi bulu hidung?", a: ["menyaring", "saring", "kotoran", "debu"] },
    { q: "Selaput lendir di hidung berfungsi untuk menyesuaikan suhu dan... ?", a: ["kelembaban", "lembab"] },
    { q: "Nama lain dari indra penciuman adalah?", a: ["olfaktori", "pembau"] },
    { q: "Tulang rawan yang memisahkan rongga hidung disebut?", a: ["septum"] },
    { q: "Kondisi peradangan pada selaput hidung disebut?", a: ["rinitis", "pilek"] }
  ],
  2: [
    { q: "Trakea tersusun atas cincin tulang rawan berbentuk huruf?", a: ["c"] },
    { q: "Struktur menyerupai rambut pada dinding trakea disebut?", a: ["silia"] },
    { q: "Fungsi silia pada trakea adalah mendorong keluar...?", a: ["kotoran", "debu", "lendir"] },
    { q: "Trakea bercabang dua menuju paru-paru yang disebut?", a: ["bronkus"] },
    { q: "Trakea terletak di depan saluran yang disebut?", a: ["esofagus", "kerongkongan"] }
  ],
  4: [
    { q: "Proses pertukaran gas O2 dan CO2 di alveolus disebut?", a: ["difusi"] },
    { q: "Alveolus dikelilingi oleh pembuluh darah kecil yang disebut?", a: ["kapiler"] },
    { q: "Gas apa yang diikat oleh darah di alveolus?", a: ["oksigen", "o2"] },
    { q: "Gas apa yang dilepaskan darah ke alveolus?", a: ["karbon dioksida", "co2"] },
    { q: "Bentuk alveolus menyerupai kumpulan buah?", a: ["anggur"] }
  ],
  5: [
    { q: "Jantung manusia terdiri dari berapa ruang?", a: ["4", "empat"] },
    { q: "Ruang jantung yang memompa darah ke seluruh tubuh adalah bilik...?", a: ["kiri"] },
    { q: "Ruang jantung yang menerima darah kotor dari tubuh adalah serambi...?", a: ["kanan"] },
    { q: "Otot penyusun jantung disebut otot?", a: ["jantung", "miokardium"] },
    { q: "Katup antara serambi kanan dan bilik kanan adalah?", a: ["trikuspidalis", "trikuspid"] }
  ],
  7: [
    { q: "Pembuluh darah yang membawa darah KELUAR dari jantung adalah?", a: ["nadi", "arteri"] },
    { q: "Pembuluh nadi terbesar dari bilik kiri disebut?", a: ["aorta"] },
    { q: "Apakah denyut pembuluh arteri terasa jika diraba? (Ya/Tidak)", a: ["ya"] },
    { q: "Sebagian besar arteri membawa darah kaya gas?", a: ["oksigen", "o2"] },
    { q: "Arteri yang membawa darah kotor ke paru-paru adalah arteri...?", a: ["pulmonalis"] }
  ],
  9: [
    { q: "Pembuluh darah yang membawa darah MENUJU jantung adalah?", a: ["balik", "vena"] },
    { q: "Sebagian besar vena membawa darah kaya gas?", a: ["karbon dioksida", "co2"] },
    { q: "Vena memiliki banyak ... agar darah tidak turun kembali.", a: ["katup"] },
    { q: "Pembuluh vena besar dari bagian bawah tubuh disebut vena cava ...?", a: ["inferior"] },
    { q: "Vena pembawa darah bersih dari paru-paru adalah vena...?", a: ["pulmonalis"] }
  ],
  10: [
    { q: "Pembuluh darah terkecil penghubung arteri dan vena disebut?", a: ["kapiler"] },
    { q: "Dinding kapiler terdiri dari berapa lapis sel?", a: ["1", "satu"] },
    { q: "Pertukaran zat nutrisi dan sisa terjadi di pembuluh?", a: ["kapiler"] },
    { q: "Sel darah merah melewati kapiler secara berbaris ... ?", a: ["satu", "tunggal", "sendiri"] },
    { q: "Cairan yang merembes keluar dari kapiler disebut cairan?", a: ["limfa", "getah bening"] }
  ],
  11: [
    { q: "Enzim dalam air liur untuk memecah amilum adalah?", a: ["ptialin", "amilase"] },
    { q: "Gerakan meremas makanan dari mulut ke lambung disebut gerak?", a: ["peristaltik"] },
    { q: "Gigi yang berfungsi merobek makanan adalah gigi?", a: ["taring"] },
    { q: "Pencernaan di mulut dibantu oleh gigi dan?", a: ["lidah"] },
    { q: "Lidah memiliki bintil pengecap yang disebut?", a: ["papila"] }
  ],
  13: [
    { q: "Asam lambung pembunuh kuman disebut?", a: ["hcl", "asam klorida"] },
    { q: "Enzim lambung pemecah protein menjadi pepton adalah?", a: ["pepsin"] },
    { q: "Enzim pengendap protein susu adalah?", a: ["renin"] },
    { q: "Bentuk anatomi lambung menyerupai huruf?", a: ["j"] },
    { q: "Makanan di lambung yang menjadi bubur disebut?", a: ["kimus", "chyme"] }
  ],
  15: [
    { q: "Bagian pertama usus halus disebut usus dua belas jari atau?", a: ["duodenum"] },
    { q: "Enzim lipase mengubah lemak menjadi asam lemak dan?", a: ["gliserol"] },
    { q: "Tonjolan kecil usus halus penyerap sari makanan disebut?", a: ["vili", "jonjot"] },
    { q: "Penyerapan sebagian besar sari makanan terjadi di usus...?", a: ["halus", "penyerapan", "ileum"] },
    { q: "Cairan pencerna lemak yang masuk ke usus halus adalah?", a: ["empedu"] }
  ],
  16: [
    { q: "Fungsi utama usus besar menyerap?", a: ["air", "cairan"] },
    { q: "Bakteri pembusuk sisa makanan di usus besar adalah?", a: ["e. coli", "escherichia coli"] },
    { q: "Bakteri usus besar membantu pembentukan vitamin?", a: ["k"] },
    { q: "Bagian penyimpan feses sementara disebut?", a: ["rektum"] },
    { q: "Umbal cacing yang menempel pada usus buntu disebut?", a: ["apendiks"] }
  ],
  17: [
    { q: "Unit penyaring terkecil di dalam ginjal disebut?", a: ["nefron"] },
    { q: "Penyaringan darah tahap pertama di ginjal disebut?", a: ["filtrasi"] },
    { q: "Hasil filtrasi di glomerulus disebut urin?", a: ["primer"] },
    { q: "Penyerapan kembali zat berguna disebut?", a: ["reabsorpsi"] },
    { q: "Urin dialirkan ke kandung kemih melalui saluran?", a: ["ureter"] }
  ],
  19: [
    { q: "Zat sisa ekskresi kulit adalah?", a: ["keringat"] },
    { q: "Kelenjar penghasil keringat disebut glandula?", a: ["sudorifera"] },
    { q: "Lapisan kulit terluar disebut?", a: ["epidermis"] },
    { q: "Pigmen pemberi warna kulit disebut?", a: ["melanin"] },
    { q: "Kulit mengatur ... tubuh.", a: ["suhu", "temperatur"] }
  ],
  21: [
    { q: "Hati merombak sel darah merah tua menjadi pigmen?", a: ["bilirubin", "empedu"] },
    { q: "Zat sisa metabolisme protein yang dinetralkan hati adalah?", a: ["amonia", "urea"] },
    { q: "Hati mengubah glukosa menjadi cadangan energi bernama?", a: ["glikogen"] },
    { q: "Hati menghasilkan cairan pelarut lemak yaitu?", a: ["empedu"] },
    { q: "Proses penawar racun oleh hati disebut?", a: ["detoksifikasi"] }
  ],
  22: [
    { q: "Gas sisa pernapasan utama adalah?", a: ["karbon dioksida", "co2"] },
    { q: "Uap air dikeluarkan oleh paru-paru saat kita?", a: ["bernapas", "menghembuskan"] },
    { q: "Selaput pembungkus paru-paru disebut?", a: ["pleura"] },
    { q: "Jumlah lobus pada paru-paru kanan adalah?", a: ["3", "tiga"] },
    { q: "Fungsi utama paru-paru dalam sistem ekskresi mengeluarkan?", a: ["karbon dioksida", "co2", "gas"] }
  ]
};

export default function App() {
  const [gameState, setGameState] = useState('intro'); // intro, playing, gameover
  const [difficulty, setDifficulty] = useState('normal'); 
  const [botName, setBotName] = useState('BOTBIO');
  const [playerName, setPlayerName] = useState('Siswa');

  // Gameplay States
  const [players, setPlayers] = useState([]);
  const [turnIndex, setTurnIndex] = useState(0);
  const [properties, setProperties] = useState({});
  const [availableQuizzes, setAvailableQuizzes] = useState({});
  const [logs, setLogs] = useState([]);
  const [diceVals, setDiceVals] = useState([1, 1]);
  
  // Modals and Prompts
  const [activeModal, setActiveModal] = useState(null); // 'buy', 'card', 'quiz'
  const [modalData, setModalData] = useState({});
  const [quizAnswer, setQuizAnswer] = useState('');

  const logsEndRef = useRef(null);

  useEffect(() => {
    if (logsEndRef.current) logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
  }, [logs]);

  const startGame = () => {
    const isHard = difficulty === 'hard';
    const bName = isHard ? 'BIOPRO' : 'BOTBIO';
    setBotName(bName);
    
    setPlayers([
      { id: 0, name: playerName || 'Siswa', atp: 1500, position: 0, isBot: false },
      { id: 1, name: bName, atp: 1500, position: 0, isBot: true, isPro: isHard }
    ]);
    
    // Initialize properties empty
    const initialProps = {};
    BOARD_SPACES.forEach(sp => {
      if (sp.type === 'PROPERTY') {
        initialProps[sp.id] = { owner: null, houses: 0, hotel: 0 };
      }
    });
    setProperties(initialProps);

    // Deep copy quizzes so we can splice them without mutating original
    setAvailableQuizzes(JSON.parse(JSON.stringify(INITIAL_PROPERTY_QUIZZES)));

    setLogs([`Selamat datang di Biopoly! ${playerName || 'Siswa'} vs ${bName}.`]);
    setGameState('playing');
    setTurnIndex(0);
  };

  const addLog = (msg) => {
    setLogs(prev => [...prev, msg]);
  };

  const rollDice = () => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    setDiceVals([d1, d2]);
    return d1 + d2;
  };

  const getRentAmount = (spaceId) => {
    const prop = properties[spaceId];
    const baseRent = BOARD_SPACES.find(s => s.id === spaceId).rent;
    if (prop.hotel > 0) return baseRent * 5;
    if (prop.houses === 2) return baseRent * 3;
    if (prop.houses === 1) return baseRent * 2;
    return baseRent;
  };

  const getBuildCost = (spaceId, type) => {
    const baseCost = BOARD_SPACES.find(s => s.id === spaceId).cost;
    return type === 'hotel' ? baseCost * 2 : baseCost;
  };

  const executeTurn = () => {
    const cp = players[turnIndex];
    if (cp.isBot) {
      executeBotTurn(cp);
    } else {
      executePlayerRoll(cp);
    }
  };

  const executePlayerRoll = (player) => {
    const steps = rollDice();
    const newPos = (player.position + steps) % BOARD_SPACES.length;
    
    let passStartBonus = 0;
    if (newPos < player.position && newPos !== 0) passStartBonus = 200;

    addLog(`🎲 ${player.name} melempar dadu: ${steps}. Menuju ${BOARD_SPACES[newPos].name}.`);
    
    if (passStartBonus > 0) {
        addLog(`✨ ${player.name} melewati START, dapat bonus 200 ATP.`);
    }

    const updatedPlayer = { ...player, position: newPos, atp: player.atp + passStartBonus };
    updatePlayer(updatedPlayer);

    handleSpaceArrival(updatedPlayer, BOARD_SPACES[newPos]);
  };

  const handleSpaceArrival = (player, space) => {
    // 1. Jail / Karantina Medis
    if (space.type === 'JAIL' || space.type === 'GO_TO_JAIL') {
      const fine = 200;
      addLog(`🚨 ${player.name} masuk Karantina Medis! Denda: ${fine} ATP.`);
      updatePlayer({ ...player, atp: player.atp - fine, position: 6 }); // 6 is actual Jail pos
      endTurnCheck({ ...player, atp: player.atp - fine });
      return;
    }

    // 2. Cards
    if (space.type === 'LIFESTYLE' || space.type === 'PATHOGEN') {
      const cardDeck = space.type === 'LIFESTYLE' ? LIFESTYLE_CARDS : PATHOGEN_CARDS;
      const card = cardDeck[Math.floor(Math.random() * cardDeck.length)];
      if (!player.isBot) {
        setModalData({ card, player });
        setActiveModal('card');
      } else {
        applyCardEffect(player, card);
        endTurnCheck({ ...player, atp: player.atp + card.amount });
      }
      return;
    }

    // 3. Properties
    if (space.type === 'PROPERTY') {
      const propState = properties[space.id];
      
      // Unowned: Buy
      if (propState.owner === null) {
        if (!player.isBot && player.atp >= space.cost) {
          promptAction('buy', space, player, space.cost);
        } else if (player.isBot) {
          handleBotPropertyAction('buy', space, player, space.cost);
        } else {
           addLog(`❌ ${player.name} ATP tidak cukup untuk membeli ${space.name}.`);
           endTurnCheck(player);
        }
        return;
      }
      
      // Owned by Self: Upgrade
      if (propState.owner === player.id) {
        if (propState.hotel === 0) {
          const isHotelNext = propState.houses === 2;
          const upgradeType = isHotelNext ? 'hotel' : 'house';
          const cost = getBuildCost(space.id, upgradeType);
          
          if (!player.isBot && player.atp >= cost) {
            promptAction(upgradeType, space, player, cost);
          } else if (player.isBot) {
             handleBotPropertyAction(upgradeType, space, player, cost);
          } else {
             endTurnCheck(player);
          }
        } else {
          endTurnCheck(player);
        }
        return;
      }

      // Owned by Other: Pay Rent
      if (propState.owner !== player.id) {
        const rent = getRentAmount(space.id);
        const owner = players.find(p => p.id === propState.owner);
        addLog(`💰 ${player.name} membayar sewa ${rent} ATP kepada ${owner.name}.`);
        updatePlayer({ ...player, atp: player.atp - rent });
        const updatedOwner = { ...owner, atp: owner.atp + rent };
        updatePlayer(updatedOwner);
        endTurnCheck({ ...player, atp: player.atp - rent });
        return;
      }
    }

    endTurnCheck(player);
  };

  const executeBotTurn = (bot) => {
    const steps = rollDice();
    const newPos = (bot.position + steps) % BOARD_SPACES.length;
    let passStartBonus = 0;
    if (newPos < bot.position && newPos !== 0) passStartBonus = 200;

    addLog(`🤖 ${bot.name} melempar dadu: ${steps}. Menuju ${BOARD_SPACES[newPos].name}.`);
    if (passStartBonus > 0) addLog(`✨ ${bot.name} melewati START, dapat bonus 200 ATP.`);

    const updatedBot = { ...bot, position: newPos, atp: bot.atp + passStartBonus };
    updatePlayer(updatedBot);
    handleSpaceArrival(updatedBot, BOARD_SPACES[newPos]);
  };

  const handleBotPropertyAction = (actionType, space, bot, cost) => {
    const isPro = bot.isPro;
    const finalCost = isPro ? Math.floor(cost * 0.9) : cost; // Pro bot always gets 10% discount
    
    // Safety buffer for bot to not go broke easily
    if (bot.atp >= finalCost + 100) {
      if (actionType === 'buy') {
         addLog(`🤖 ${bot.name} MEMBELI ${space.name} seharga ${finalCost} ATP. ${isPro ? '(Diskon 10%)' : ''}`);
         setProperties(prev => ({ ...prev, [space.id]: { ...prev[space.id], owner: bot.id } }));
      } else if (actionType === 'house') {
         addLog(`🏗️ 🤖 ${bot.name} membangun KLINIK di ${space.name} seharga ${finalCost} ATP. ${isPro ? '(Diskon 10%)' : ''}`);
         setProperties(prev => ({ ...prev, [space.id]: { ...prev[space.id], houses: prev[space.id].houses + 1 } }));
      } else if (actionType === 'hotel') {
         addLog(`🏥 🤖 ${bot.name} membangun RUMAH SAKIT di ${space.name} seharga ${finalCost} ATP. ${isPro ? '(Diskon 10%)' : ''}`);
         setProperties(prev => ({ ...prev, [space.id]: { ...prev[space.id], hotel: 1, houses: 0 } }));
      }
      
      const newBotState = { ...bot, atp: bot.atp - finalCost };
      updatePlayer(newBotState);
      endTurnCheck(newBotState);
    } else {
      endTurnCheck(bot);
    }
  };

  const promptAction = (actionType, space, player, baseCost) => {
    const quizzes = availableQuizzes[space.id] || [];
    const hasQuiz = quizzes.length > 0;
    
    setModalData({ actionType, space, player, baseCost, hasQuiz, quizzes });
    setActiveModal('action');
  };

  const handleActionChoice = (choice) => {
    const { actionType, space, player, baseCost, quizzes } = modalData;
    setActiveModal(null);

    if (choice === 'normal') {
      executePurchaseOrUpgrade(actionType, space, player, baseCost);
    } else if (choice === 'quiz') {
      const rIdx = Math.floor(Math.random() * quizzes.length);
      const selectedQuiz = quizzes[rIdx];
      setModalData({ ...modalData, activeQuiz: selectedQuiz, quizIndex: rIdx });
      setActiveModal('quiz');
      setQuizAnswer('');
    } else {
      endTurnCheck(player);
    }
  };

  const handleQuizSubmit = () => {
    const { actionType, space, player, baseCost, activeQuiz, quizIndex, quizzes } = modalData;
    const ansLower = quizAnswer.toLowerCase().trim();
    const isCorrect = activeQuiz.a.some(key => ansLower.includes(key));
    
    // Remove quiz from available pool
    const newPool = [...quizzes];
    newPool.splice(quizIndex, 1);
    setAvailableQuizzes(prev => ({ ...prev, [space.id]: newPool }));

    setActiveModal(null);

    if (isCorrect) {
      const discountCost = Math.floor(baseCost * 0.9);
      addLog(`✅ Jawaban BENAR! Mendapat diskon 10%.`);
      executePurchaseOrUpgrade(actionType, space, player, discountCost);
    } else {
      const penaltyCost = Math.floor(baseCost * 1.8);
      addLog(`❌ Jawaban SALAH! Denda tambahan 80%. (Total bayar: ${penaltyCost})`);
      if (player.atp >= penaltyCost) {
         executePurchaseOrUpgrade(actionType, space, player, penaltyCost);
      } else {
         addLog(`💸 ATP tidak cukup untuk membayar penalti (${penaltyCost}). Batal!`);
         endTurnCheck(player);
      }
    }
  };

  const executePurchaseOrUpgrade = (actionType, space, player, finalCost) => {
    if (actionType === 'buy') {
      addLog(`🏢 ${player.name} membeli ${space.name} seharga ${finalCost} ATP.`);
      setProperties(prev => ({ ...prev, [space.id]: { ...prev[space.id], owner: player.id } }));
    } else if (actionType === 'house') {
      addLog(`🏗️ ${player.name} membangun KLINIK di ${space.name} seharga ${finalCost} ATP.`);
      setProperties(prev => ({ ...prev, [space.id]: { ...prev[space.id], houses: prev[space.id].houses + 1 } }));
    } else if (actionType === 'hotel') {
      addLog(`🏥 ${player.name} membangun RUMAH SAKIT di ${space.name} seharga ${finalCost} ATP.`);
      setProperties(prev => ({ ...prev, [space.id]: { ...prev[space.id], hotel: 1, houses: 0 } }));
    }
    
    const newPlayerState = { ...player, atp: player.atp - finalCost };
    updatePlayer(newPlayerState);
    endTurnCheck(newPlayerState);
  };

  const applyCardEffect = (player, card) => {
    addLog(`🎴 ${player.name} mendapat kartu: "${card.text}" (${card.amount > 0 ? '+' : ''}${card.amount} ATP)`);
    updatePlayer({ ...player, atp: player.atp + card.amount });
  };

  const endTurnCheck = (playerStateToCheck) => {
    if (playerStateToCheck.atp <= 0) {
       addLog(`☠️ ${playerStateToCheck.name} BANGKRUT!`);
       setGameState('gameover');
       return;
    }
    setTurnIndex(prev => (prev + 1) % players.length);
  };

  const updatePlayer = (updatedPlayer) => {
    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
  };

  const renderDice = (val) => {
    const props = { className: "w-10 h-10 text-gray-800", strokeWidth: 1.5 };
    switch(val) {
      case 1: return <Dice1 {...props} />;
      case 2: return <Dice2 {...props} />;
      case 3: return <Dice3 {...props} />;
      case 4: return <Dice4 {...props} />;
      case 5: return <Dice5 {...props} />;
      case 6: return <Dice6 {...props} />;
      default: return <Dice1 {...props} />;
    }
  };

  const renderPlayerTokens = (spaceId) => {
    return players.filter(p => p.position === spaceId).map((p, i) => (
      <div key={i} className={`absolute ${i===0 ? 'top-1 left-1' : 'bottom-1 right-1'} 
        rounded-full p-1 shadow-md border-2 border-white
        ${p.isBot ? 'bg-red-500' : 'bg-blue-500'} transition-all duration-300 z-10 animate-bounce`}>
        {p.isBot ? <Bot size={14} color="white"/> : <User size={14} color="white"/>}
      </div>
    ));
  };

  const renderBuildingIndicators = (spaceId) => {
    const prop = properties[spaceId];
    if (!prop || prop.owner === null) return null;
    
    return (
      <div className="absolute top-1 right-1 flex space-x-1">
        {prop.hotel > 0 && <div className="w-3 h-3 bg-red-600 rounded-sm border border-white" title="Rumah Sakit (Hotel)"></div>}
        {prop.hotel === 0 && Array.from({ length: prop.houses }).map((_, i) => (
          <div key={i} className="w-3 h-3 bg-green-500 rounded-sm border border-white" title="Klinik (Rumah)"></div>
        ))}
      </div>
    );
  };

  const renderBoardSpace = (spaceId) => {
    const space = BOARD_SPACES.find(s => s.id === spaceId);
    const prop = properties[spaceId];
    const isOwned = prop && prop.owner !== null;
    const ownerColor = isOwned ? (prop.owner === 0 ? 'bg-blue-500' : 'bg-red-500') : '';

    return (
      <div key={spaceId} className={`relative flex flex-col items-center justify-center border border-gray-400 p-2 text-center 
        ${space.color} shadow-sm min-h-[85px] w-full h-full`}>
        
        {isOwned && <div className={`absolute top-0 left-0 w-full h-1.5 ${ownerColor}`}></div>}
        {renderBuildingIndicators(spaceId)}
        
        <span className="text-[10px] font-bold leading-tight line-clamp-2 mt-2">{space.name}</span>
        {space.icon && <span className="text-xl mt-1">{space.icon}</span>}
        {space.cost > 0 && <span className="text-[9px] font-semibold text-gray-700 mt-auto">{space.cost} ATP</span>}
        
        {renderPlayerTokens(spaceId)}
      </div>
    );
  };

  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 font-sans text-gray-800">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-green-700 tracking-tight">BIOPOLY</h1>
            <p className="text-gray-500 mt-2 font-medium">Petualangan Sistem Organ Manusia</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl text-sm space-y-3">
            <h2 className="font-bold text-lg text-blue-800 mb-2">Panduan Bermain</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Pemain bergerak berdasarkan lemparan dadu.</li>
              <li>Beli organ jika belum dimiliki. Jika mendarat di milik orang lain, bayar sewa.</li>
              <li><strong>Kuis Evaluasi (Pembelian/Pembangunan):</strong> Jawab pertanyaan biologi!
                <ul className="list-[circle] pl-5 mt-1 text-green-700 font-medium">
                  <li>✅ Benar = Diskon 10%</li>
                  <li>❌ Salah = Denda 80% (Bayar 180% dari harga normal!)</li>
                </ul>
              </li>
              <li>Bangun Klinik (hijau, max 2) & Rumah Sakit (merah, max 1) untuk melipatgandakan sewa.</li>
              <li>Mendarat di <strong>Karantina Medis</strong> langsung didenda 200 ATP.</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold text-gray-700">Nama Anda:</label>
              <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)}
                placeholder="Masukkan nama..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-gray-700">Lawan (Bot):</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all">
                <option value="normal">BOTBIO (Normal - Selalu Bayar Penuh)</option>
                <option value="hard">BIOPRO (Profesional - Pintar Kuis/Selalu Diskon)</option>
              </select>
            </div>
          </div>

          <button onClick={startGame} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg transition-transform transform hover:scale-[1.02]">
            Mulai Permainan
          </button>
        </div>
      </div>
    );
  }

  const cp = players[turnIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex p-4 gap-4 font-sans">
      {/* LEFT: Game Board */}
      <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 flex items-center justify-center">
        {/* 7x7 Grid Representation for 24 spaces perimeter */}
        <div className="grid grid-cols-7 grid-rows-7 gap-1 w-full max-w-[800px] max-h-[800px] aspect-square relative bg-gray-300 border-2 border-gray-800 p-1 rounded-sm">
           
           {/* Center Decoration */}
           <div className="col-start-2 col-span-5 row-start-2 row-span-5 bg-white flex flex-col items-center justify-center select-none pointer-events-none">
             <Heart size={100} className="text-red-400 mb-2 opacity-50" />
             <h2 className="text-4xl font-black text-gray-800 tracking-widest uppercase text-center leading-none">BIOPOLY</h2>
             <p className="font-bold text-gray-500 mt-1">Sistem Organ Manusia</p>
           </div>

           {/* Top Row: 0 to 6 */}
           {[0, 1, 2, 3, 4, 5, 6].map(id => (
               <div key={id} className="col-start-auto">{renderBoardSpace(id)}</div>
           ))}
           {/* Right Col: 7 to 11 */}
           {[7, 8, 9, 10, 11].map((id, i) => (
             <div key={id} className="col-start-7" style={{ gridRowStart: i + 2 }}>{renderBoardSpace(id)}</div>
           ))}
           {/* Bottom Row: 12 to 18 (Rendered Right to Left) */}
           {[12, 13, 14, 15, 16, 17, 18].reverse().map((id, i) => (
             <div key={id} className="row-start-7" style={{ gridColumnStart: i + 1 }}>{renderBoardSpace(id)}</div>
           ))}
           {/* Left Col: 19 to 23 (Rendered Bottom to Top) */}
           {[19, 20, 21, 22, 23].reverse().map((id, i) => (
             <div key={id} className="col-start-1" style={{ gridRowStart: i + 2 }}>{renderBoardSpace(id)}</div>
           ))}
        </div>
      </div>

      {/* RIGHT: Status & Controls Panel */}
      <div className="w-[350px] flex flex-col gap-4">
        
        {/* Player Stats */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 space-y-4 flex-shrink-0">
          <h2 className="text-lg font-bold border-b pb-2 text-gray-800">Status Pemain</h2>
          {players.map((p, i) => (
            <div key={p.id} className={`p-3 rounded-xl flex items-center justify-between border-2 transition-all
              ${turnIndex === i ? (p.isBot ? 'border-red-400 bg-red-50' : 'border-blue-400 bg-blue-50') : 'border-transparent bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${p.isBot ? 'bg-red-500' : 'bg-blue-500'}`}>
                  {p.isBot ? <Bot size={18} color="white"/> : <User size={18} color="white"/>}
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight text-gray-800">{p.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-extrabold text-green-600 text-lg">{p.atp} <span className="text-xs font-bold">ATP</span></p>
              </div>
            </div>
          ))}
        </div>

        {/* Dice & Action Area */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 text-center flex-shrink-0">
          <h3 className="font-bold text-gray-500 mb-3 text-sm">Giliran: <span className="text-black">{cp.name}</span></h3>
          <div className="flex justify-center gap-4 mb-4">
            {renderDice(diceVals[0])}
            {renderDice(diceVals[1])}
          </div>
          <button 
            disabled={cp.isBot || activeModal !== null || gameState !== 'playing'} 
            onClick={executeTurn}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md transition-all">
            {cp.isBot ? 'Menunggu Bot...' : 'Lempar Dadu'}
          </button>
        </div>

        {/* Log Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 flex-1 flex flex-col overflow-hidden">
          <h3 className="font-bold border-b pb-2 mb-2 text-gray-800">Log Aktivitas</h3>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2" ref={logsEndRef}>
            {logs.map((l, i) => (
              <div key={i} className="text-xs bg-gray-50 p-2 rounded text-gray-700 border border-gray-100">{l}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTION MODAL (Buy/Upgrade) */}
      {activeModal === 'action' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-1 text-gray-800">
                {modalData.actionType === 'buy' ? 'Beli Organ' : `Bangun ${modalData.actionType === 'hotel' ? 'Rumah Sakit' : 'Klinik'}`}
              </h2>
              <p className="text-gray-500 font-medium">{modalData.space.name}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center space-y-1">
              <p className="text-sm text-gray-600">Harga Normal:</p>
              <p className="text-3xl font-black text-blue-700">{modalData.baseCost} ATP</p>
            </div>

            {modalData.hasQuiz ? (
              <div className="space-y-3">
                <p className="text-xs text-center text-gray-600 bg-yellow-50 border border-yellow-200 p-2 rounded leading-relaxed">
                  Ambil kuis untuk <strong>Diskon 10%</strong>, tapi hati-hati, jika salah dikenakan denda <strong>80%</strong>!
                </p>
                <button onClick={() => handleActionChoice('quiz')} className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                  <Zap size={18} /> Jawab Kuis (Berisiko & Diskon)
                </button>
                <button onClick={() => handleActionChoice('normal')} className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-bold">
                  Beli Normal (Aman)
                </button>
              </div>
            ) : (
              <button onClick={() => handleActionChoice('normal')} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
                Beli ({modalData.baseCost} ATP)
              </button>
            )}
            
            <button onClick={() => handleActionChoice('cancel')} className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-semibold">
              Lewati (Jangan Beli)
            </button>
          </div>
        </div>
      )}

      {/* QUIZ MODAL */}
      {activeModal === 'quiz' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
             <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg flex items-start gap-3 border border-yellow-300">
                <AlertTriangle className="shrink-0 mt-0.5" />
                <p className="font-bold text-sm leading-tight">Uji Pengetahuan Biologi! Benar = Diskon 10%, Salah = Denda 80%.</p>
             </div>
             
             <div className="py-4 text-center">
               <h3 className="font-bold text-lg text-gray-800 mb-4">{modalData.activeQuiz.q}</h3>
               <input type="text" 
                 autoFocus
                 placeholder="Ketik jawaban di sini..."
                 value={quizAnswer}
                 onChange={e => setQuizAnswer(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleQuizSubmit()}
                 className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none text-center font-semibold transition-all" />
             </div>

             <button onClick={handleQuizSubmit} className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold shadow-md">
               Kunci Jawaban
             </button>
          </div>
        </div>
      )}

      {/* CARD MODAL */}
      {activeModal === 'card' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-sm w-full p-8 shadow-2xl text-center space-y-6 
            ${modalData.card.amount > 0 ? 'bg-gradient-to-b from-blue-50 to-blue-100' : 'bg-gradient-to-b from-red-50 to-red-100'}`}>
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-inner
              ${modalData.card.amount > 0 ? 'bg-blue-200 text-blue-600' : 'bg-red-200 text-red-600'}`}>
              {modalData.card.amount > 0 ? <Heart size={40} /> : <ShieldAlert size={40} />}
            </div>
            
            <h2 className="text-2xl font-black text-gray-800">
              {modalData.card.amount > 0 ? 'GAYA HIDUP' : 'PATOGEN'}
            </h2>
            <p className="text-gray-700 font-medium h-20 flex items-center justify-center leading-relaxed text-lg">
              "{modalData.card.text}"
            </p>

            <div className={`font-black text-2xl ${modalData.card.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
               {modalData.card.amount > 0 ? '+' : ''}{modalData.card.amount} ATP
            </div>

            <button onClick={() => { setActiveModal(null); endTurnCheck({ ...modalData.player, atp: modalData.player.atp + modalData.card.amount }); }} 
              className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold">
              Lanjutkan
            </button>
          </div>
        </div>
      )}

      {/* GAME OVER MODAL */}
      {gameState === 'gameover' && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center space-y-6">
            <h2 className="text-4xl font-black text-gray-800">GAME OVER</h2>
            <p className="text-lg text-gray-600 font-medium">Salah satu pemain mengalami kebangkrutan ATP!</p>
            <button onClick={() => setGameState('intro')} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg">
              Main Lagi
            </button>
          </div>
        </div>
      )}

    </div>
  );
}