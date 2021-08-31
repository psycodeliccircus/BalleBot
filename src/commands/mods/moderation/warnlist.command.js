import Discord from 'discord.js'
import { prefix } from '../../../assets/prefix.js'
import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js'

export default {
    name: 'warnlist',
    description: `${prefix}warnlist @user ou ${prefix}warnlist <tagUser> ou ${prefix}warnlist <idUser> para adicionar o chat de report do bot`,
    permissions: ['everyone'],
    aliases: ['warns'],
    category: 'Moderação ⚔️',
    run: ({ message, client }) => {

        const guildIdDatabase = new client.Database.table(`guild_id_${message.guild.id}`)

        const { user } = getUserOfCommand(client, message)

        if (!user) {
            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`Não encontrei o usuário!`)
                .setDescription(`**Tente usar**` + '```' + `${prefix}warnlist @usuário` + '```')
                .setTimestamp())
            return
        }

        if (guildIdDatabase.has(`user_id_${user.id}`)) {
            const myUser = guildIdDatabase.get(`user_id_${user.id}`),
                warnUser = myUser.reasons;

            if (warnUser) {
                const messageCommands = warnUser.reduce((previous, current, index) =>
                    previous + `**Aviso ${index+1}:** \n ${current}\n\n`, '');

                message.channel.send(message.author, new Discord.MessageEmbed()
                    .setColor('#ff8997')
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .setTitle(`Lista de warns do usuário ${myUser.name + '#' + myUser.discriminator}`)
                    .setDescription(messageCommands))
                return;
            }

        }
        message.channel.send('usuário não encontrado no banco')
    }
}