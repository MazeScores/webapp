/** @type {import('../types/types.js').GameModel[]} */
export default [
  {
    id: "base",
    label: "Modèle de base",
    description: "Modèle générique pour compter des scores par manche",
    minPlayers: 1,
    maxPlayers: 99,
    type: "rounds"
  },
  {
    id: "harmonies",
    label: "Harmonies",
    description: "Jeu de placement de tuiles et d'animaux dans un paysage harmonieux",
    minPlayers: 1,
    maxPlayers: 4,
    type: "calculated",
    fields: [
      { id: "animaux", label: "Animaux", icon: "🦊" },
      { id: "batiments", label: "Bâtiments", icon: "🏠" },
      { id: "riviere", label: "Rivière", icon: "🌊" },
      { id: "arbres", label: "Arbres", icon: "🌲" },
      { id: "champs", label: "Champs", icon: "🌾" },
      { id: "montagne", label: "Montagne", icon: "⛰️" }
    ]
  },
  {
    id: "catan",
    label: "Catan",
    description: "Jeu de gestion de ressources et de commerce sur une île",
    minPlayers: 3,
    maxPlayers: 4,
    type: "rounds"
  },
  {
    id: "seven-wonders",
    label: "7 Wonders",
    description: "Jeu de draft de cartes à travers trois âges de civilisation",
    minPlayers: 2,
    maxPlayers: 7,
    type: "calculated",
    fields: [
      { id: "militaire", label: "Militaire", icon: "⚔️" },
      { id: "tresor", label: "Trésor", icon: "💰" },
      { id: "merveille", label: "Merveille", icon: "🏛️" },
      { id: "civil", label: "Civil", icon: "🏛️" },
      { id: "commerce", label: "Commerce", icon: "🤝" },
      { id: "guilde", label: "Guilde", icon: "📜" },
      { id: "science", label: "Science", icon: "🔬" }
    ]
  }
];
