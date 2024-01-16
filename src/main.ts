const app = document.querySelector<HTMLDivElement>('#app')!;
import { io } from 'socket.io-client';

const socket = io('http://localhost:3012');

function showConnexion() {  
  app.innerHTML = '';
  const content = document.createElement('div');
  app.classList.add('connexion');

  const title = document.createElement('h1');
  title.textContent = 'Connexion';

  const loginLabel = document.createElement('label');
  loginLabel.textContent = 'Login';
  const loginInput = document.createElement('input');
  loginInput.type = 'text';
  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'Password';
  const password = document.createElement('input');
  password.type = 'password';

  const actions = document.createElement('div');
  actions.classList.add('actions');

  const submit = document.createElement('button');
  submit.textContent = 'Se connecter';
  submit.addEventListener('click', async () => {
    alert('Connexion');
    // --------------
    const response = await fetch('http://localhost:3012/auth/connect', {
    // --------------
      method: 'POST',
      body: JSON.stringify({
        login: loginInput.value,
        password: password.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if(response.status === 200 && data.jwtToken) {
      alert('Connexion réussie');
      localStorage.setItem('jwt', data.jwtToken);
      showHome();
    }
    else {
      alert('Connexion échouée');
      console.log('error on connexion', data);
    }
  });

  const register = document.createElement('button');
  register.textContent = 'Créer un compte';
  register.addEventListener('click', async () => {
    const registerResponse = await fetch('http://localhost:3012/auth/add', {
      method: 'POST',
      body: JSON.stringify({
        login: loginInput.value,
        password: password.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if(registerResponse.status === 200) {
      loginInput.value = '';
      password.value = '';
      alert('Register réussie, connectez-vous');
    }
    else {
      alert('Register échouée');
    }

  });
  
  content.appendChild(title);
  content.appendChild(loginLabel);
  content.appendChild(loginInput);
  content.appendChild(passwordLabel);
  content.appendChild(password);

  actions.appendChild(submit);
  actions.appendChild(register);

  content.appendChild(actions);

  app.appendChild(content);
}

async function showHome(){
  checkConnexion();

  app.innerHTML = '';
  const content = document.createElement('div');
  app.classList.add('home');

  const title = document.createElement('h1');
  title.textContent = 'Home';

  const gamesResponse = await fetch('http://localhost:3012/games', {
    method: 'GET',
    headers: {
      "Authorization": "Bearer " + localStorage.getItem('jwt'),
      "Content-Type": "application/json"
    }
  })
  const datas = await gamesResponse.json();
  const games = datas.data;

  console.log('games', games);

  const gamesList = document.createElement('ul');
  games.forEach((game: any) => {
    const gameItem = document.createElement('li');
    gameItem.textContent = `${game.joueur1} vs ${game.joueur2} => ${game.winner} en ${game.bestTime}ms pour ${game.objective}ms`;
    gamesList.appendChild(gameItem);
  });

  content.appendChild(title);
  content.appendChild(gamesList);

  const playGameButton = document.createElement('button');
  playGameButton.textContent = 'Play a game';
  playGameButton.addEventListener('click', () => {
    showGame();
  });

  content.appendChild(playGameButton);

  app.appendChild(content);
}

function showGame(){
  checkConnexion();

  app.innerHTML = '';
  const content = document.createElement('div');
  app.classList.add('game');

  const title = document.createElement('h1');
  title.textContent = 'Game';

  const gameBeforeStart = document.createElement('p');
  gameBeforeStart.classList.add('game-before-start');
  gameBeforeStart.textContent = 'La partie commencera quand deux joueurs seront connectés';
  
  const objectifParagraph = document.createElement('p');
  objectifParagraph.textContent = 'Votre objectif est d\'arrêter le chrono le plus proche du temps fourni en début de partie';
  
  content.appendChild(title);
  content.appendChild(gameBeforeStart);
  content.appendChild(objectifParagraph);
  app.appendChild(content);

  socket.emit('ready');
  
  // Game Events
  socket.on('game-start', (objectif: number) => {
    gameBeforeStart.remove();
    objectifParagraph.textContent = 'Arrêter le chrono le plus proche de ' + objectif + ' secondes';
    
    const playButton = document.createElement('button');
    playButton.textContent = 'Arrêter le chrono';

    playButton.addEventListener('click', () => {
      socket.emit('play');
    });
    
    content.appendChild(playButton);
  });

  socket.on('game-end', (winner: string, tempsLePlusProche: number) => {
    alert('Game end');
    const gameEnd = document.createElement('div');
    gameEnd.classList.add('game-end');
    gameEnd.textContent = winner + ' a gagné avec un temps de ' + tempsLePlusProche;

    setTimeout(() => {
      showHome();
    }, 5000);  
  })  
}

async function checkConnexion() {
  console.log('checkConnexion')

  const jwt = localStorage.getItem('jwt');
  if(!jwt) {
    showConnexion();
  }
  else {
    const response = await fetch('http://localhost:3012/users/check-auth', {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + jwt,
        "Content-Type": "application/json"
      }
    });
    if(response.status !== 200) {
      showConnexion();
    }
  }
}

// Programme principal
showConnexion();