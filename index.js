const Discord = require('discord.js')

// Load environment config
require('dotenv').config()

// Define Intents
const intents = new Discord.Intents([
  Discord.Intents.NON_PRIVILEGED,
  'GUILD_MEMBERS',
])

// Setup a discord client
const client = new Discord.Client({ ws: { intents } })
client.on('ready', () => {
  console.log('Connected to discord')
})

client.on('message', async message => {
  const match = message.content.match(/!!distribute\s?(.*)/)
  if (match) {
    const parameter = match[1]
    const contentMatch = parameter.match(/\|\|(.*)\|\|/)
    if (!contentMatch)
      return message.reply('Invalid parameter. Must be wrapped in spoiler tags `||`')
    const content = contentMatch[1]
    const success = await distribute(message, content)
    message.react(success ? '👍' : '🚫')
  }
})

const distribute = async (message, content) => {
  const members = await message.guild.members.fetch()
  const players = members.filter(
    member => !member.bot && member.roles.cache.some(r => r.name === 'player')
  ).map(m => m)
  
  const fake = players[Math.floor(Math.random() * players.length)]
  for (let player of players) {
    if (player === fake) {
      await player.send('You are an imposter! :smiling_imp:')
    } else {
      await player.send(`:sparkles: The prompt is "${content}" :sparkles:`)
    }
  }

  return players.length > 0
}

client.login(process.env.DISCORD_TOKEN)
