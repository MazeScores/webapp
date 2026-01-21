export const GameModels = {
    base: {
    id: 'base',
    label: 'Modèle de base',
    minPlayers: 1,
    maxPlayers: 99,
    type: 'rounds'
    },
    harmonies: {
    id: 'harmonies',
    label: 'Harmonies',
    minPlayers: 2,
    maxPlayers: 4,
    type: 'calculated',
    fields: ['animaux','batiments','riviere','arbres','champs','montagne']
    }
    };
    
    export function getGameModel(id) {
    return GameModels[id];
    }