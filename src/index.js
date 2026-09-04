import GameController from './GameController.js';
import { renderBoards, showMessage, previewShip } from './dom.js';
import './style.css';

const shipLengths = [5, 4, 3, 3, 2];

let gameController = new GameController();
let currentShipIndex = 0;
let direction = 'horizontal';
let placementComplete = false;
let previewStart = null;

const shipFleet = [
  { name: 'Carrier', length: 5 },
  { name: 'Battleship', length: 4 },
  { name: 'Cruiser', length: 3 },
  { name: 'Submarine', length: 3 },
  { name: 'Destroyer', length: 2 },
];

function updatePlacementFeedback() {
  const selectedShipName = document.querySelector('#selected-ship-name');
  const remainingShipsList = document.querySelector('#remaining-ships-list');

  if (!selectedShipName || !remainingShipsList) return;

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
  renderBoards(gameController.player, gameController.computer);
}

function updatePlacementMessage() {
  const placementMessage = document.querySelector('#placement-message');

  if (!placementMessage) return;

  if (placementComplete) {
    placementMessage.textContent =
      'All ships placed. Your turn. Attack the enemy board.';
    return;
  }

  const selectedShip = shipFleet[currentShipIndex];

  if (!selectedShip) return;

  placementMessage.textContent =
    `Place your ${selectedShip.name} (${selectedShip.length} cells). ` +
    `Direction: ${direction}.`;
}

function handlePlayerBoardClick(event) {
  if (!event.target.classList.contains('cell')) {
    return;
  }

  if (placementComplete) {
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

    showMessage('Tap the highlighted cells again to place the ship.');
    return;
  }
  const length = shipLengths[currentShipIndex];

  const result = gameController.placePlayerShip(length, [x, y], direction);

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
    placementComplete = true;
    showMessage('All ships placed. Your turn. Attack the enemy board.');
  } else {
    showMessage('Ship placed successfully.');
  }

  updatePlacementFeedback();
  updatePlacementMessage();
  renderGame();
}

function handlePlayerBoardHover(event) {
  if (!event.target.classList.contains('cell')) {
    return;
  }

  if (placementComplete) {
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

function handleEnemyBoardClick(event) {
  if (!event.target.classList.contains('cell')) {
    return;
  }

  const x = Number(event.target.dataset.x);
  const y = Number(event.target.dataset.y);

  const result = gameController.playTurn([x, y]);

  if (result === null) {
    return;
  }

  if (gameController.gameOver) {
    showMessage(
      gameController.winner === gameController.player
        ? 'You win!'
        : 'Computer wins!',
    );
  } else {
    showMessage('Your turn. Attack the enemy board.');
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
  gameController = new GameController();
  currentShipIndex = 0;
  direction = 'horizontal';
  placementComplete = false;
  previewStart = null;

  document.querySelector('#direction-button').textContent =
    'Direction: Horizontal';

  showMessage('Place your ships before attacking.');
  updatePlacementFeedback();
  updatePlacementMessage();
  renderGame();
}

document
  .querySelector('#player-board')
  .addEventListener('click', handlePlayerBoardClick);

document
  .querySelector('#player-board')
  .addEventListener('mouseover', handlePlayerBoardHover);

document
  .querySelector('#player-board')
  .addEventListener('mouseleave', clearPlayerBoardPreview);

document
  .querySelector('#computer-board')
  .addEventListener('click', handleEnemyBoardClick);

document
  .querySelector('#direction-button')
  .addEventListener('click', handleDirectionClick);

document
  .querySelector('#new-game-button')
  .addEventListener('click', handleNewGameClick);

showMessage('Place your ships before attacking.');
updatePlacementMessage();
updatePlacementFeedback();
renderGame();
