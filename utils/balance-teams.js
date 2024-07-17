function balanceTeams(players) {
  // Сортируем игроков по убыванию MMR
  players.sort((a, b) => b.mmr - a.mmr);

  let team1 = [];
  let team2 = [];
  let team1MMR = 0;
  let team2MMR = 0;
  let team1Positions = new Set();
  let team2Positions = new Set();
  let usedPlayers = new Set();

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const position = player.pos;

    // Если обе команды уже полные, выходим из цикла
    if (team1.length === 5 && team2.length === 5) {
      break;
    }

    // Если игрок уже использован, пропускаем его
    if (usedPlayers.has(player.name)) {
      continue;
    }

    // Определяем, в какую команду добавить игрока, чтобы разница по MMR была минимальной
    if (Math.abs(team1MMR + player.mmr - team2MMR) <= Math.abs(team1MMR - (team2MMR + player.mmr))) {
      if (team1.length < 5 && !team1Positions.has(position)) {
        team1.push(player);
        team1MMR += player.mmr;
        team1Positions.add(position);
        usedPlayers.add(player.name);
      }
    } else {
      if (team2.length < 5 && !team2Positions.has(position)) {
        team2.push(player);
        team2MMR += player.mmr;
        team2Positions.add(position);
        usedPlayers.add(player.name);
      }
    }
  }

  // Если одна из команд не полная, добавляем в нее оставшихся игроков
  while (team1.length < 5) {
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const position = player.pos;
      if (!team1Positions.has(position) && !usedPlayers.has(player.name)) {
        team1.push(player);
        team1MMR += player.mmr;
        team1Positions.add(position);
        usedPlayers.add(player.name);
        break;
      }
    }
  }

  while (team2.length < 5) {
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const position = player.pos;
      if (!team2Positions.has(position) && !usedPlayers.has(player.name)) {
        team2.push(player);
        team2MMR += player.mmr;
        team2Positions.add(position);
        usedPlayers.add(player.name);
        break;
      }
    }
  }

  team1.sort((a, b) => a.pos - b.pos);
  team2.sort((a, b) => a.pos - b.pos);

  return [team1, team2];
}

module.exports = balanceTeams;