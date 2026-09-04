function createBoardElement(gameboard, isEnemy = false, hideShips = false) {
  const boardWrapper = document.createElement('div');
  boardWrapper.classList.add('board-wrapper');

  const columnLabels = document.createElement('div');
  columnLabels.classList.add('column-labels');

  const corner = document.createElement('span');
  corner.classList.add('coordinate-corner');
  columnLabels.appendChild(corner);

  for (let column = 0; column < 10; column += 1) {
    const label = document.createElement('span');
    label.textContent = String.fromCharCode(65 + column);
    columnLabels.appendChild(label);
  }

  const boardLayout = document.createElement('div');
  boardLayout.classList.add('board-layout');

  const rowLabels = document.createElement('div');
  rowLabels.classList.add('row-labels');

  for (let row = 1; row <= 10; row += 1) {
    const label = document.createElement('span');
    label.textContent = row;
    rowLabels.appendChild(label);
  }

  const boardElement = document.createElement('div');
  boardElement.classList.add('gameboard');

  for (let y = 0; y < 10; y += 1) {
    for (let x = 0; x < 10; x += 1) {
      const cell = document.createElement('button');

      cell.classList.add('cell');
      cell.dataset.x = x;
      cell.dataset.y = y;

      cell.addEventListener('mouseenter', () => {
        const columnLabel = columnLabels.children[x + 1];
        const rowLabel = rowLabels.children[y];

        columnLabel.classList.add('highlighted');
        rowLabel.classList.add('highlighted');
      });

      cell.addEventListener('mouseleave', () => {
        const columnLabel = columnLabels.children[x + 1];
        const rowLabel = rowLabels.children[y];

        columnLabel.classList.remove('highlighted');
        rowLabel.classList.remove('highlighted');
      });

      const ship = gameboard.board[y][x];

      if (ship && !isEnemy && !hideShips) {
        cell.classList.add('ship');
      }

      if (gameboard.hasBeenAttacked([x, y])) {
        if (ship) {
          cell.classList.add('hit');

          if (ship.isSunk()) {
            cell.classList.add('sunk');
          }
        } else {
          cell.classList.add('miss');
        }
      }

      if (isEnemy && gameboard.hasBeenAttacked([x, y])) {
        cell.disabled = true;
      }

      boardElement.appendChild(cell);
    }
  }

  boardLayout.appendChild(rowLabels);
  boardLayout.appendChild(boardElement);
  boardWrapper.appendChild(columnLabels);
  boardWrapper.appendChild(boardLayout);

  return boardWrapper;
}

function previewShip(boardElement, start, length, direction) {
  const [x, y] = start;

  boardElement.querySelectorAll('.preview').forEach((cell) => {
    cell.classList.remove('preview', 'invalid-preview');
  });

  const cells = [];

  for (let i = 0; i < length; i += 1) {
    const currentX = direction === 'horizontal' ? x + i : x;
    const currentY = direction === 'horizontal' ? y : y + i;

    const cell = boardElement.querySelector(
      `[data-x="${currentX}"][data-y="${currentY}"]`,
    );

    if (!cell) {
      return;
    }

    cells.push(cell);
  }

  const isInvalid = cells.some(
    (cell) =>
      cell.classList.contains('ship') ||
      cell.classList.contains('invalid-preview'),
  );

  cells.forEach((cell) => {
    cell.classList.add(isInvalid ? 'invalid-preview' : 'preview');
  });
}

function renderBoards(
  player,
  computer,
  hidePlayerShips = false,
  hideComputerShips = false,
) {
  const playerBoardContainer = document.querySelector('#player-board');
  const computerBoardContainer = document.querySelector('#computer-board');

  playerBoardContainer.replaceChildren(
    createBoardElement(player.gameboard, false, hidePlayerShips),
  );

  computerBoardContainer.replaceChildren(
    createBoardElement(computer.gameboard, true, hideComputerShips),
  );
}

function showMessage(message) {
  const messageElement = document.querySelector('#game-message');

  messageElement.textContent = message;
}

export { createBoardElement, renderBoards, showMessage, previewShip };
