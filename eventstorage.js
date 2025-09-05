// eventstorage.js

// --- Expandable Explore Scenarios ---
const exploreEvents = [
    {
        scenario: "You wander through a dense forest.",
        outcome: "You find some wood lying on the ground.",
        statChanges: { wood: 3, stamina: -5 }
    },
    {
        scenario: "You stumble upon a sparkling stream.",
        outcome: "The water rejuvenates you.",
        statChanges: { health: 10, stamina: 5 }
    },
    {
        scenario: "You hear rustling in the bushes.",
        outcome: "A wild Bastian appears!",
        enemy: { name: "Bastian", health: 30, damage: 10 }
    }
];

// --- Expandable Forage Scenarios ---
const forageEvents = [
    {
        scenario: "You dig around the forest floor.",
        outcome: "You find some edible mushrooms.",
        statChanges: { meat: 2, hunger: 5 }
    },
    {
        scenario: "You check near a berry bush.",
        outcome: "You pick fresh berries.",
        statChanges: { meat: 1, hunger: 3 }
    }
];

// --- Expandable Enemy Templates ---
const enemies = [
    { name: "Goblin", health: 20, damage: 5 },
    { name: "Wolf", health: 15, damage: 7 },
    { name: "Bastian", health: 30, damage: 10 }
];

module.exports = { exploreEvents, forageEvents, enemies };
