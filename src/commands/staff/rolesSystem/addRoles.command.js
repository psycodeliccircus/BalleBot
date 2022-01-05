import { MessageActionRow, MessageSelectMenu } from 'discord.js';

export default {
  name: 'addRoles',
  description: `comando para adicionar cargos em um menu de Escolha de Cargos, para usar mande apenas crie um embed em um canal com o bot e envie prefix + addRoles + <channelID/Mention> + <messageID bot>. Vá adicionando seguindo a estrutura `,
  permissions: ['staff'],
  aliases: ['adicionarCargo', 'addrole'],
  dm: false,
  category: 'RolesSystem 👔',
  run: async ({ client, message, args, prefix }) => {
    const channel = message.guild.channels.cache.find(
      (chan) =>
        chan.id === args[0]?.replace(/(<)|(#)|(>)/g, '') ||
        chan.name === args[0]
    );
    if (!channel || channel.type !== 'GUILD_TEXT') {
      return message.channel.send(
        `Por favor, envie um canal de texto junto ao comando ${prefix}addRoles <channelID/Menção> <messageID>`
      );
    }

    const messageId = args[1];
    let targetMessage;
    try {
      targetMessage =
        (await channel.messages.fetch(messageId, {
          cache: true,
          force: true,
        })) || null;
    } catch (e) {
      return message.channel.send(
        'Não encontrei a mensagem enviada pelo bot, selecione o ID correto'
      );
    }
    if (!targetMessage || targetMessage.author.id !== client.user.id) {
      return message.channel.send(
        `O MessageID deve ser uma mensagem enviada pelo bot, você pode enviar uma com o comando ${prefix}sendEmbed #channel`
      );
    }
    const row =
      targetMessage.components[0] instanceof MessageActionRow
        ? targetMessage.components[0]
        : new MessageActionRow();

    const reactionEmoji = client.guilds.cache
      .get('836004917973614662')
      .emojis.cache.find((emoji) => emoji.name === 'sucess');

    function addRoleInMessage() {
      message.channel.send(
        `Adicione um Cargo enviando uma mensagem com essa estrutura: @cargo emoji descrição do cargo. Caso não queira adicionar mais cargos envie "none"`
      );
      const filter = (m) => m.author.id === message.author.id;
      const collector = message.channel.createMessageCollector({
        filter,
        max: 1,
        time: 1000 * 60 * 2,
      });
      let answered = false;
      collector.on('collect', async (m) => {
        answered = true;
        if (m.content.trim() === 'none' || m.content.startsWith(prefix))
          return message.channel.send('Comando de adicionar cargos finalizado');

        const argsRole = m.content.trim().split(' ');

        const role = message.guild.roles.cache.find(
          (rol) =>
            rol.id === argsRole[0].replace(/(<)|(@&)|(>)/g, '') ||
            rol.name === argsRole[0]
        );
        if (!role) {
          message.channel.send('envie um cargo válido');
          return addRoleInMessage();
        }

        const newOptionRole = {
          label: role.name,
          value: role.id,
        };

        const regexEmojiUnicode =
          /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;

        if (regexEmojiUnicode.test(argsRole[1])) {
          newOptionRole.emoji = { id: null, name: argsRole[1] };
        } else {
          const regexEmojiID = /([0-9]{18})/g;
          const regexEmojiName = /:.*(?=[0-9]{18})/g;

          if (regexEmojiName.test(argsRole[1])) {
            newOptionRole.emoji = {
              id: argsRole[1].match(regexEmojiID)[0],
              name: argsRole[1].match(regexEmojiName)[0].slice(1, -1),
            };
          } else {
            message.channel.send(
              'Utilize um emoji do servidor ou um emoji unicode'
            );
            return addRoleInMessage();
          }
        }
        argsRole.splice(0, 2);
        newOptionRole.description = argsRole.join(' ');

        const menu =
          row.components[0] instanceof MessageSelectMenu
            ? row.components[0]
            : new MessageSelectMenu();
        if (menu.options.length > 0) {
          for (const o of menu.options) {
            if (o.value === newOptionRole.value) {
              message.channel.send(`O cargo ${role.name} já está no menu`);
              return addRoleInMessage();
            }
          }
          menu.addOptions(newOptionRole);
          menu.setMaxValues(menu.options.length);
        } else {
          row.addComponents(
            new MessageSelectMenu({
              custom_id: 'auto_roles',
              minValues: 0,
              maxValues: 1,
              placeholder: 'Selecione seus cargos...',
              options: [newOptionRole],
            })
          );
        }

        await targetMessage.edit({ components: [row] });
        m.react(reactionEmoji);
        return addRoleInMessage();
      });

      collector.on('end', () => {
        if (!answered) {
          message.channel.send(
            `${message.author} O tempo acabou e o comando foi cancelado`
          );
        }
      });
    }

    addRoleInMessage();
  },
};
