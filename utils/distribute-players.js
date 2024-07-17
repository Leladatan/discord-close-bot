const distributePlayers = (arr) => {
  let players = [];
  let positions = [[], [], [], [], []]; // массивы для хранения игроков на каждой позиции
  let positionCounts = [0, 0, 0, 0, 0]; // количество игроков на каждой позиции
  let unassignedPlayers = [];
  let error = '';

  for (let i = 0; i < arr.length; i++) {
    let player = arr[i];
    let hasPosition = false;

    // Проверьте, на какую позицию можно назначить игрока
    for (let j = 0; j < 5; j++) {
      if (player[`pos${j + 1}`] > 0 && positionCounts[j] < 2 && !positions[j].includes(player.name)) {
        players.push({ name: player.name, pos: j + 1, mmr: player[`pos${j + 1}`] });
        positions[j].push(player.name);
        positionCounts[j]++;
        hasPosition = true;
        break; // Назначьте игроку первую доступную позицию и переходите к следующему игроку
      }
    }

    if (!hasPosition) {
      unassignedPlayers.push(player.name);
    }
  }

  if (arr.length !== 10) {
    error += 'Недостаточно игроков.\n';
  }

  if (unassignedPlayers.length === arr.length) {
    error += 'Ни у одного игрока нет свободных позиций.\n';
  }

  if (unassignedPlayers.length > 0) {
    error += `Следующие игроки не были распределены по позициям: ${unassignedPlayers.join(', ')}.`;
  }

  players.sort((a, b) => a.pos - b.pos);

  return {
    players,
    error,
  };
}

module.exports = distributePlayers;