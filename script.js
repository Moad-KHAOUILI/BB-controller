const selectionScreen  = document.getElementById('selection-screen');
const controllerScreen = document.getElementById('controller-screen');
const p1Btn            = document.getElementById('p1-btn');
const p2Btn            = document.getElementById('p2-btn');
const backBtn          = document.getElementById('back-btn');
const playerTag        = document.getElementById('player-tag');

const WS_URL = 'wss://team-01-en-backend-itip-en-01.apps.okd.ucll.cloud/ws';

const ACTION_MAP = {
  forward:  'UP',
  backward: 'DOWN',
  left:     'LEFT',
  right:    'RIGHT'
};

let socket = null;

function openSocket() {
  socket = new WebSocket(WS_URL);
  socket.addEventListener('open',  () => console.log('WS connected'));
  socket.addEventListener('error', (e) => console.error('WS error', e));
  socket.addEventListener('close', () => console.log('WS closed'));
}

function closeSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

function sendAction(action) {
  const player = sessionStorage.getItem('player');
  const message = player + ':' + action;
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
    console.log('Sent:', message);
  } else {
    console.warn('WS not open, dropping:', message);
  }
}

function showController(playerNumber) {
  sessionStorage.setItem('player', playerNumber);
  playerTag.textContent = 'PLAYER ' + playerNumber;
  selectionScreen.classList.remove('active');
  controllerScreen.classList.add('active');
  openSocket();
}

function showSelection() {
  closeSocket();
  controllerScreen.classList.remove('active');
  selectionScreen.classList.add('active');
}

// Control buttons
document.querySelectorAll('.ctrl-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = ACTION_MAP[btn.dataset.action];
    if (action) sendAction(action);
  });
});

p1Btn.addEventListener('click', () => showController(1));
p2Btn.addEventListener('click', () => showController(2));
backBtn.addEventListener('click', showSelection);