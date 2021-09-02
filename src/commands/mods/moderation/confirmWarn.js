import Discord from 'discord.js';

export async function confirmWarn(message, client, user, reason) {
  const messageAnt = await message.channel.send(
    new Discord.MessageEmbed()
      .setColor('#ff8997')
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`Você está preste a avisar ${user}`)
      .setDescription(
        `**Pelo Motivo de : **\n\n\`\`\`${reason}\`\`\` \nPara confirmar clique em ✅\n para cancelar clique em ❎`
      )
      .setFooter(`Id do user: ${user.id}`)
      .setTimestamp()
  );
  const reactions = ['✅', '❎'];
  reactions.forEach((emojiReact) => messageAnt.react(`${emojiReact}`));

  const filter = (reaction) => reactions.includes(reaction.emoji.name);

  const collector = messageAnt.createReactionCollector(filter, {
    time: 15000,
    dispose: true,
  });
  let sucess = false;
  collector.on('collect', async (emojiAnt, userAnt) => {
    switch (emojiAnt.emoji.name) {
      case '✅':
        if (message.author.id === userAnt.id) {
          const guildIdDatabase = new client.Database.table(
            `guild_id_${message.guild.id}`
          );

          if (guildIdDatabase.has(`user_id_${user.id}`)) {
            guildIdDatabase.set(`user_id_${user.id}.name`, user.username);
            guildIdDatabase.set(
              `user_id_${user.id}.discriminator`,
              user.discriminator
            );
            guildIdDatabase.add(`user_id_${user.id}.warnsCount`, 1);
            guildIdDatabase.push(`user_id_${user.id}.reasons`, reason);
          } else {
            guildIdDatabase.set(`user_id_${user.id}`, {
              name: user.username,
              discriminator: user.discriminator,
              id: user.id,
              warnsCount: 1,
              reasons: [reason],
            });
          }

          const channelLog = client.channels.cache.get(
            guildIdDatabase.get('channel_log')
          );

          if (channelLog) {
            channelLog.send(
              message.author,
              new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`O usuário ${user.tag} foi punido!`)
                .setDescription(`**Motivo: **\n\n\`\`\`${reason}\`\`\``)
                .setFooter(`Id do user: ${user.id}`)
                .setTimestamp()
            );
          } else {
            message.channel
              .send(
                message.author,
                new Discord.MessageEmbed()
                  .setColor('#ff8997')
                  .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                  .setTitle(`O usuário ${user.tag} foi punido!`)
                  .setDescription(`**Motivo: **\n\n\`\`\`${reason}\`\`\``)
                  .setFooter(`Id do user: ${user.id}`)
                  .setTimestamp()
              )
              .then((msg) => {
                msg.delete({ timeout: 15000 });
              });
          }
          user.send(
            new Discord.MessageEmbed()
              .setColor('#ff8997')
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setTitle(`Você recebeu um warn!`)
              .setDescription(
                `**Motivo: **\n\`\`\`${reason}\`\`\`\n**Aplicada por: ${message.author.tag}**`
              )
              .setFooter(`Id do user: ${user.id}`)
              .setTimestamp()
          );
          messageAnt.delete();
          sucess = true;
        }
        break;
      case '❎':
        if (message.author.id === userAnt.id) {
          messageAnt.delete();
          sucess = false;
        }
        break;
      default:
        break;
    }
  });

  collector.on('end', async () => {
    if (!sucess) {
      message.channel.send('você não confirmou').then((msg) => {
        msg.delete({ timeout: 15000 });
      });
    }
  });
}
