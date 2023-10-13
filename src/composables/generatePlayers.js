export function generatePlayers(number) {
  const players = number;
  let playersList = Array.from({ length: players }, () => ({ score: 0, moves: 0 }));
  return playersList;
}
