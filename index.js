// // Discord.js bot
// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();
const request = require('request');

// The token of your bot - https://discordapp.com/developers/applications/me
// const token = 'process.env.token';

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
    client.user.setActivity(`Serving ${client.guilds.size} servers | .help`);
    console.log(`Logged in as ${client.user.tag}!`);
    console.log('I am ready!');
    client.user.setStatus("online");
});
client.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Serving ${client.guilds.size} servers | .help`);
});

client.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.size} servers | .help`);
});
// Create an event listener for messages
client.on("message", async message => {
    if (message.author.bot) return;
    const prefix = '.';
    if (message.content.indexOf(prefix) !== 0) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    // If the message is "ping"
    if (command === 'help') {
        message.reply(`${message.author.username}`);
        const embed = {
            "title": "~Help~",
            "description": "BoxieBot Help Page",
            "url": "https://github.com/shiv213/DiscordJSBot",
            "color": 12995298,
            "footer": {
                "icon_url": "https://res.cloudinary.com/boxiebot/image/upload/v1529595893/robot_boxie-905x509.jpg",
                "text": "Currently serving " + `${client.guilds.size}` + " servers"
            },
            "thumbnail": {
                "url": "https://res.cloudinary.com/boxiebot/image/upload/v1529595893/robot_boxie-905x509.jpg"
            },
            "author": {
                "name": "BoxieBot",
                "url": "https://discordapp.com/oauth2/authorize?client_id=459064720985554945&scope=bot",
                "icon_url": "https://res.cloudinary.com/boxiebot/image/upload/v1529595963/boxie1.jpg"
            },
            "fields": [{
                    "name": ".xkcd (comic number)",
                    "value": "Displays the xkcd comic of the number provided"
                },
                {
                    "name": ".swanson",
                    "value": "Displays a random Ron Swanson quote"
                },
                {
                    "name": ".invite",
                    "value": "Displays BoxieBot invite link"
                },
                {
                    "name": ".purge (number of messages)",
                    "value": "Removes all messages from all users in the channel, up to 100"
                },
                {
                    "name": ".kick (user)",
                    "value": "Kicks user from server"
                },
                {
                    "name": ".ban (user)",
                    "value": "Bans user from server"
                },
                {
                    "name": ".say (text)",
                    "value": "Makes BoxieBot say something"
                },
                // {
                //     "name": ".placeholder",
                //     "value": "placeholder"
                // },
                {
                    "name": ":revolving_hearts: Made with love by @shiv213#7699",
                    "value": "© BoxieBot"

                }
            ]
        };
        message.channel.send({ embed });

    }
    if (command === "say") {
        // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
        // To get the "message" itself we join the `args` back into a string with spaces: 
        const sayMessage = args.join(" ");
        // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
        message.delete().catch(O_o => {});
        // And we get the bot to say the thing: 
        message.channel.send(sayMessage);
    }
    if (command === 'xkcd') {
        let [comic, ...extra] = args;
        if (args[0] === undefined) {
            message.reply(`${message.author.username}, please specify a comic number after xkcd`);
        } else {
            message.reply(`${message.author.username}, here's xkcd comic number ${comic}.`);
            request('https://xkcd.com/' + args[0] + '/info.0.json', { json: true }, (err, res, body) => {
                if (err) { return console.log(err); }
                const embed = {
                    "title": (body.safe_title) + " - #" + args[0],
                    "description": (body.alt),
                    "color": 2216797,
                    "image": {
                        "url": (body.img)
                    }
                };
                message.channel.send({ embed });

            });
        }
        console.log(extra);
    }
    if (command === "purge") {
        if (!message.member.roles.some(r => ["Supreme Overlord", "Administrator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");
        // This command removes all messages from all users in the channel, up to 100.

        // get the delete count, as an actual number.
        const deleteCount = parseInt(args[0], 10);

        // Ooooh nice, combined conditions. <3
        if (!deleteCount || deleteCount < 2 || deleteCount > 100)
            return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");

        // So we get our messages, and delete them. Simple enough, right?
        const fetched = await message.channel.fetchMessages({ limit: deleteCount });
        message.channel.bulkDelete(fetched)
            .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }
    if (command === 'swanson') {
        let [...extra] = args;
        message.reply(`${message.author.username}, Ron Swanson once said:`);
        request('http://ron-swanson-quotes.herokuapp.com/v2/quotes', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            message.channel.send('"' + body + '"');
            console.log(extra);
        });
    }
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;
    if (command === 'invite') {
        message.channel.send(`${message.author.username}, you can invite BoxieBot to your own server with this link:`);
        message.channel.send(process.env.invite);
    }

    // if (command === 'join') {
    //     // Only try to join the sender's voice channel if they are in one themselves
    //     if (message.member.voiceChannel) {
    //         message.member.voiceChannel.join()
    //             .then(connection => { // Connection is an instance of VoiceConnection
    //                 message.reply('I have successfully connected to the channel!');
    //             })
    //             .catch(console.log);
    //     } else {
    //         message.reply('You need to join a voice channel first!');
    //     }
    // }
    if (command === "kick") {
        // This command must be limited to mods and admins. In this example we just hardcode the role names.
        // Please read on Array.some() to understand this bit: 
        // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
        if (!message.member.roles.some(r => ["Supreme Overlord", "Administrator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");

        // Let's first check if we have a member and if we can kick them!
        // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
        // We can also support getting the member by ID, which would be args[0]
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (!member)
            return message.reply("Please mention a valid member of this server");
        if (!member.kickable)
            return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

        // slice(1) removes the first part, which here should be the user mention or ID
        // join(' ') takes all the various parts to make it a single string.
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "No reason provided";

        // Now, time for a swift kick in the nuts!
        await member.kick(reason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
        message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

    }
    if (command === "ban") {
        // Most of this command is identical to kick, except that here we'll only let admins do it.
        // In the real world mods could ban too, but this is just an example, right? ;)
        if (!message.member.roles.some(r => ["Supreme Overlord", "Administrator"].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");

        let member = message.mentions.members.first();
        if (!member)
            return message.reply("Please mention a valid member of this server");
        if (!member.bannable)
            return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

        let reason = args.slice(1).join(' ');
        if (!reason) reason = "No reason provided";

        await member.ban(reason)
            .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
        message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
    }
});

// Log our bot in
// client.login(process.env.token);
client.login(process.env.tokenBoxie).catch(err => console.log(err));