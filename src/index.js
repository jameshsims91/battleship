import GameController from './GameController.js';
import { renderBoards, showMessage, previewShip } from './dom.js';
import './style.css';

const shipLengths = [5, 4, 3, 3, 2];

let gameController = new GameController();
let currentShipIndex = 0;
let direction = 'horizontal';
let placementPhase = 'player-one';
let previewStart = null;
let gameMode = 'computer';

const shipFleet = [
  { name: 'Carrier', length: 5 },
  { name: 'Battleship', length: 4 },
  { name: 'Cruiser', length: 3 },
  { name: 'Submarine', length: 3 },
  { name: 'Destroyer', length: 2 },
];

function getPlacementLabel() {
  if (placementPhase === 'player-two') {
    return 'Player 2';
  }

  return 'Player 1';
}

function isPlacementComplete() {
  return placementPhase === 'battle';
}

function isPlayerVsPlayer() {
  return gameMode === 'player';
}

function handleGameModeChange(event) {
  gameMode = event.target.value;
  handleNewGameClick();
}

function updatePlacementFeedback() {
  const selectedShipName = document.querySelector('#selected-ship-name');
  const remainingShipsList = document.querySelector('#remaining-ships-list');

  if (!selectedShipName || !remainingShipsList) return;

  if (placementPhase === 'battle') {
    selectedShipName.textContent = '';
    remainingShipsList.innerHTML = '';
    return;
  }

  const selectedShip = shipFleet[currentShipIndex];

  if (selectedShip) {
    selectedShipName.textContent = selectedShip.name;
  } else {
    selectedShipName.textContent = 'All ships placed';
  }

  remainingShipsList.innerHTML = '';

  shipFleet.slice(currentShipIndex + 1).forEach((ship) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${ship.name} (${ship.length})`;
    remainingShipsList.appendChild(listItem);
  });
}

function renderGame() {
  if (placementPhase === 'player-two') {
    renderBoards(gameController.computer, gameController.player, false, true);
    return;
  }

  if (placementPhase === 'battle') {
    if (gameController.currentPlayer === gameController.computer) {
      renderBoards(gameController.computer, gameController.player, false, true);
    } else {
      renderBoards(gameController.player, gameController.computer, false, true);
    }

    return;
  }

  renderBoards(gameController.player, gameController.computer, false, true);
}

function updatePlacementMessage() {
  const placementMessage = document.querySelector('#placement-message');

  if (!placementMessage) return;

  if (placementPhase === 'battle') {
    if (isPlayerVsPlayer()) {
      const playerName =
        gameController.currentPlayer === gameController.player
          ? 'Player 1'
          : 'Player 2';

      placementMessage.textContent = `${playerName}'s turn. Attack the enemy board.`;
    } else {
      placementMessage.textContent = 'Your turn. Attack the enemy board.';
    }

    return;
  }

  const playerName = getPlacementLabel();

  placementMessage.textContent = `${playerName}, place your ships.`;
}

function updateGameStatus() {
  const gamePhase = document.querySelector('#game-phase');
  const turnStatus = document.querySelector('#turn-status');
  const playerShipsRemaining = document.querySelector(
    '#player-ships-remaining',
  );
  const enemyShipsRemaining = document.querySelector('#enemy-ships-remaining');

  if (
    !gamePhase ||
    !turnStatus ||
    !playerShipsRemaining ||
    !enemyShipsRemaining
  ) {
    return;
  }

  const playerShips = gameController.player.gameboard.ships;
  const enemyShips = gameController.computer.gameboard.ships;

  const playerRemaining = playerShips.filter((ship) => !ship.isSunk()).length;

  const enemyRemaining = enemyShips.filter((ship) => !ship.isSunk()).length;

  if (gameController.gameOver) {
    gamePhase.textContent = 'Game Over';

    if (isPlayerVsPlayer()) {
      turnStatus.textContent =
        gameController.winner === gameController.player
          ? 'Player 1 won!'
          : 'Player 2 won!';
    } else {
      turnStatus.textContent =
        gameController.winner === gameController.player
          ? 'You won!'
          : 'Computer won!';
    }
  } else if (placementPhase !== 'battle') {
    gamePhase.textContent = 'Placement';

    turnStatus.textContent =
      placementPhase === 'player-two'
        ? 'Player 2: Place your ships'
        : 'Player 1: Place your ships';
  } else {
    gamePhase.textContent = 'Battle';

    if (isPlayerVsPlayer()) {
      turnStatus.textContent =
        gameController.currentPlayer === gameController.player
          ? 'Player 1 turn'
          : 'Player 2 turn';
    } else {
      turnStatus.textContent =
        gameController.currentPlayer === gameController.player
          ? 'Your turn'
          : "Computer's Turn";
    }
  }

  playerShipsRemaining.textContent = `${playerRemaining} remaining`;
  enemyShipsRemaining.textContent = `${enemyRemaining} remaining`;
}

function showResultScreen() {
  const resultScreen = document.querySelector('#result-screen');
  const resultTitle = document.querySelector('#result-title');
  const resultMessage = document.querySelector('#result-message');
  if (!resultScreen || !resultTitle || !resultMessage) return;
  const playerWon = gameController.winner === gameController.player;

  resultScreen.hidden = false;
  resultScreen.classList.toggle('defeat', !playerWon);

  resultTitle.textContent = playerWon ? 'Victory' : 'Defeat';
  resultMessage.textContent = playerWon
    ? 'You sank the enemy fleet'
    : 'The computer sank your fleet.';

  resultScreen.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
}

function hideResultScreen() {
  const resultScreen = document.querySelector('#result-screen');
  if (!resultScreen) return;
  resultScreen.hidden = true;
  resultScreen.classList.remove('defeat');
}

function showHandoffScreen() {
  const handoffScreen = document.querySelector('#handoff-screen');
  const placementSection = document.querySelector('#placement-section');
  const gameModeControls = document.querySelector('.game-mode-controls');

  const isPlacementHandoff = placementPhase === 'player-two';

  handoffScreen.hidden = false;

  // Only hide the placement board during Player 2's placement handoff.
  if (isPlacementHandoff) {
    placementSection.hidden = true;
  }

  if (gameModeControls) {
    gameModeControls.hidden = true;
  }

  const nextPlayer = isPlacementHandoff
    ? 'Player 2'
    : gameController.currentPlayer === gameController.player
      ? 'Player 1'
      : 'Player 2';

  const handoffTitle = document.querySelector('#handoff-title');
  const handoffMessage = document.querySelector('#handoff-message');

  if (handoffTitle) {
    handoffTitle.textContent = `${nextPlayer}'s Turn`;
  }

  if (handoffMessage) {
    handoffMessage.textContent = isPlacementHandoff
      ? 'Player 2, get ready to place your ships.'
      : `${nextPlayer}, get ready.`;
  }

  updateBoardVisibility();
}

function hideHandoffScreen() {
  const handoffScreen = document.querySelector('#handoff-screen');
  const placementSection = document.querySelector('#placement-section');
  const gameModeControls = document.querySelector('.game-mode-controls');

  handoffScreen.hidden = true;
  placementSection.hidden = false;

  if (gameModeControls) {
    gameModeControls.hidden = false;
  }

  updateBoardVisibility();
}

function handlePlayerBoardClick(event) {
  if (placementPhase === 'battle') return;

  if (!event.target.classList.contains('cell')) {
    return;
  }

  if (isPlacementComplete()) {
    return;
  }

  const x = Number(event.target.dataset.x);
  const y = Number(event.target.dataset.y);
  const start = [x, y];

  if (!previewStart) {
    previewStart = start;

    const length = shipLengths[currentShipIndex];
    const playerBoard = document.querySelector('#player-board .gameboard');

    previewShip(playerBoard, start, length, direction);
    showMessage('Click the highlighted cells again to place the ship.');

    return;
  }

  const length = shipLengths[currentShipIndex];

  const result =
    placementPhase === 'player-two'
      ? gameController.placeSecondPlayerShip(length, start, direction)
      : gameController.placePlayerShip(length, start, direction);

  if (!result) {
    showMessage('That ship cannot be placed there.');
    previewStart = null;
    clearPlayerBoardPreview();

    return;
  }

  previewStart = null;
  clearPlayerBoardPreview();
  currentShipIndex += 1;

  if (currentShipIndex === shipLengths.length) {
    finishPlacementPhase();
    return;
  }

  updatePlacementFeedback();
  updatePlacementMessage();
  showMessage('Ship placed successfully.');

  renderGame();
}

function finishPlacementPhase() {
  if (placementPhase === 'player-one' && isPlayerVsPlayer()) {
    placementPhase = 'player-two';
    currentShipIndex = 0;
    direction = 'horizontal';
    previewStart = null;

    clearPlayerBoardPreview();
    showHandoffScreen();
    return;
  }

  placementPhase = 'battle';
  currentShipIndex = 0;
  direction = 'horizontal';
  previewStart = null;

  clearPlayerBoardPreview();

  showMessage(
    isPlayerVsPlayer()
      ? 'Player 1 begins the battle.'
      : 'All ships placed. Your turn. Attack the enemy board.',
  );

  updatePlacementFeedback();
  updatePlacementMessage();
  updateGameStatus();
  updateBoardVisibility();
  renderGame();
}

function handleHandoffContinue() {
  hideHandoffScreen();

  if (placementPhase === 'player-two') {
    showMessage('Player 2, place your ships.');
  } else if (placementPhase === 'battle') {
    const currentPlayer =
      gameController.currentPlayer === gameController.player
        ? 'Player 1'
        : 'Player 2';

    showMessage(`${currentPlayer}, attack the enemy board.`);
  }

  updatePlacementFeedback();
  updatePlacementMessage();
  updateGameStatus();
  updateBoardVisibility();
  renderGame();
}

function updateBoardVisibility() {
  const playerBoardSection = document.querySelector('#placement-section');
  const enemyBoardSection = document
    .querySelector('#computer-board')
    .closest('section');

  if (placementPhase === 'player-one') {
    playerBoardSection.hidden = false;
    enemyBoardSection.hidden = true;
  } else if (placementPhase === 'player-two') {
    playerBoardSection.hidden = false;
    enemyBoardSection.hidden = true;
  } else {
    // During battle, both boards must be visible.
    playerBoardSection.hidden = false;
    enemyBoardSection.hidden = false;
  }
}

function handlePlayerBoardHover(event) {
  if (!event.target.classList.contains('cell')) {
    return;
  }

  if (isPlacementComplete()) {
    return;
  }

  const x = Number(event.target.dataset.x);
  const y = Number(event.target.dataset.y);
  const length = shipLengths[currentShipIndex];
  const playerBoard = document.querySelector('#player-board .gameboard');

  previewShip(playerBoard, [x, y], length, direction);
}

function clearPlayerBoardPreview() {
  const playerBoard = document.querySelector('#player-board .gameboard');

  playerBoard.querySelectorAll('.preview, .invalid-preview').forEach((cell) => {
    cell.classList.remove('preview', 'invalid-preview');
  });
}

function handleBoardClick(event) {
  if (placementPhase === 'battle') {
    handleBattleBoardClick(event);
    return;
  }

  handlePlayerBoardClick(event);
}

function handleBattleBoardClick(event) {
  if (placementPhase !== 'battle') return;
  if (gameController.gameOver) return;
  if (!event.target.classList.contains('cell')) return;

  const clickedBoard = event.currentTarget.id;

  // The enemy board is always the physical computer-board.
  // renderGame() swaps which player's data is displayed there.
  if (clickedBoard !== 'computer-board') return;

  const x = Number(event.target.dataset.x);
  const y = Number(event.target.dataset.y);

  const result = gameController.playTurn([x, y]);

  // null means the cell was already attacked.
  if (result === null) return;

  if (gameController.gameOver) {
    const winner =
      gameController.winner === gameController.player ? 'Player 1' : 'Player 2';

    showMessage(`${winner} wins!`);
    updateGameStatus();
    renderGame();
    showResultScreen();
    return;
  }

  if (result) {
    showMessage('Hit! You get to attack again.');
  } else {
    showMessage(
      isPlayerVsPlayer()
        ? 'Miss! Pass the turn to the other player.'
        : 'Miss! The computer is taking its turn.',
    );
  }

  updateGameStatus();
  if (isPlayerVsPlayer() && result === false) {
    renderGame();
    showHandoffScreen();
    return;
  }

  renderGame();
}

function handleDirectionClick() {
  direction = direction === 'horizontal' ? 'vertical' : 'horizontal';

  previewStart = null;
  clearPlayerBoardPreview();

  const directionButton = document.querySelector('#direction-button');

  directionButton.textContent = `Direction: ${direction[0].toUpperCase()}${direction.slice(1)}`;

  updatePlacementMessage();
}

function handleNewGameClick() {
  gameController = new GameController(gameMode);
  currentShipIndex = 0;
  direction = 'horizontal';
  placementPhase = 'player-one';
  previewStart = null;

  document.querySelector('#direction-button').textContent =
    'Direction: Horizontal';

  hideResultScreen();
  hideHandoffScreen();
  showMessage('Place your ships before attacking.');
  updatePlacementFeedback();
  updatePlacementMessage();
  updateGameStatus();
  renderGame();
  updateBoardVisibility();
}

document
  .querySelector('#player-board')
  .addEventListener('mouseover', handlePlayerBoardHover);

document
  .querySelector('#player-board')
  .addEventListener('mouseleave', clearPlayerBoardPreview);

document
  .querySelector('#player-board')
  .addEventListener('click', handleBoardClick);

document
  .querySelector('#computer-board')
  .addEventListener('click', handleBoardClick);

document
  .querySelector('#direction-button')
  .addEventListener('click', handleDirectionClick);

document
  .querySelector('#new-game-button')
  .addEventListener('click', handleNewGameClick);

document
  .querySelector('#result-new-game-button')
  .addEventListener('click', handleNewGameClick);

document
  .querySelector('#game-mode')
  .addEventListener('change', handleGameModeChange);

document
  .querySelector('#handoff-continue-button')
  .addEventListener('click', handleHandoffContinue);

showMessage('Place your ships before attacking.');
updatePlacementMessage();
updatePlacementFeedback();
updateGameStatus();
renderGame();
