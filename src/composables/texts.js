export function textList() {
  return [
    [
      {
        lang: 'Select Language',
        theme: ['Select Theme', 'Numbers', 'Animals', 'Monsters'],
        players: 'Numbers of players',
        grid: ['Grid Size', 'Small', 'Large'],
        round: 'Round Speed',
        start: 'Start Game',
      },
      {
        lang: 'Choisir la langue',
        theme: ['Selectionner le thème', 'Nombres', 'Animaux', 'Monstres'],
        players: 'Nombre de joueurs',
        grid: ['Taille de la grille', 'petite', 'Grande'],
        round: 'Vitesse des tours',
        start: 'Commencer la partie',
      },
    ],
    [
      {
        header: ['Restart', 'New Game'],
        footer: ['Moves', 'Time'],
        players: 'Player',
        turn: 'Current Turn',
      },
      {
        header: ['Recommencer', 'Nouvelle Partie'],
        footer: ['Coups', 'Temps'],
        players: 'Joueur',
        turn: 'Tour Actuel',
      },
    ],
  ];
}
