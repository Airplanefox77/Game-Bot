// adventure_bot.js
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { exploreEvents, forageEvents, enemies } = require('./eventstorage');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const players = new Map();

function initPlayer(userId) {
    if (!players.has(userId)) {
        players.set(userId, {
            health: 100,
            hunger: 100,
            stamina: 100,
            sanity: 100,
            temperature: 37,
            wood: 0,
            meat: 0,
            enemy: null
        });
    }
}

function clampStat(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// --- Message-based command system ---
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();

    const playerId = message.author.id;
    initPlayer(playerId);
    const player = players.get(playerId);

    if (command === '/explore') {
        const event = exploreEvents[Math.floor(Math.random() * exploreEvents.length)];
        let msg = `${event.scenario}\n${event.outcome}\n`;

        if (event.statChanges) {
            for (const [stat, change] of Object.entries(event.statChanges)) {
                player[stat] = clampStat((player[stat] || 0) + change);
            }
        }

        if (event.enemy) {
            player.enemy = event.enemy;
            msg += "Use `/fight` to battle it!";
        }

        message.channel.send(msg);
    }

    else if (command === '/forage') {
        const event = forageEvents[Math.floor(Math.random() * forageEvents.length)];
        let msg = `${event.scenario}\n${event.outcome}\n`;

        if (event.statChanges) {
            for (const [stat, change] of Object.entries(event.statChanges)) {
                player[stat] = clampStat((player[stat] || 0) + change);
            }
        }

        message.channel.send(msg);
    }

    else if (command === '/fight') {
        if (!player.enemy) {
            message.channel.send("There's no enemy to fight!");
            return;
        }

        const enemy = player.enemy;
        const playerAttack = Math.floor(Math.random() * 11) + 5; // 5-15
        const enemyAttack = Math.floor(Math.random() * (enemy.damage + 1));

        enemy.health -= playerAttack;
        player.health -= enemyAttack;

        let msg = `You attack the ${enemy.name} for ${playerAttack} damage.\n`;
        msg += `The ${enemy.name} attacks you for ${enemyAttack} damage.\n`;

        if (enemy.health <= 0) {
            msg += `You defeated the ${enemy.name}!\n`;
            player.wood += Math.floor(Math.random() * 3) + 1;
            player.meat += Math.floor(Math.random() * 3) + 1;
            player.enemy = null;
        }

        message.channel.send(msg);
    }

    else if (command === '/eat') {
        if (player.meat <= 0) {
            message.channel.send("You have no food to eat!");
            return;
        }
        player.meat -= 1;
        player.health = clampStat(player.health + 20);
        player.hunger = clampStat(player.hunger + 30);
        message.channel.send("You ate some food and feel better!");
    }

    else if (command === '/stats') {
        const p = player;
        let msg = `**Your Stats:**\nHealth: ${p.health}\nHunger: ${p.hunger}\nStamina: ${p.stamina}\nSanity: ${p.sanity}\nTemperature: ${p.temperature}°C\nWood: ${p.wood}\nMeat: ${p.meat}`;
        message.channel.send(msg);
    }

    else if (command === '/build') {
        const item = args[0];
        const costs = { shelter: 10, campfire: 5 };

        if (!item) {
            message.channel.send("Specify what you want to build! Options: shelter, campfire");
            return;
        }
        if (!costs[item]) {
            message.channel.send("You can't build that!");
            return;
        }
        if (player.wood < costs[item]) {
            message.channel.send(`Not enough wood! ${costs[item]} wood needed.`);
            return;
        }

        player.wood -= costs[item];
        message.channel.send(`You built a ${item} successfully!`);
    }
});

client.login('YOUR_BOT_TOKEN');
