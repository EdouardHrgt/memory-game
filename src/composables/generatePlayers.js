// export function generatePlayers(number) {
//   const players = number;
//   let playersList = Array.from({ length: players }, () => ({ score: 0, moves: 0 }));
//   return playersList;
// }

export function generatePlayers(number) {
  const players = number;
  let playersList = Array.from({ length: players }, (_, index) => ({
    score: 0,
    moves: 0,
    id: index + 1, // L'ID commence à 1 (ou 0 si vous préférez)
  }));
  return playersList;
}
