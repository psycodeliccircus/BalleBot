import { MessageActionRow, MessageSelectMenu } from 'discord.js';

export default {
  name: 'removeRoles',
  description: `comando para remover cargos em um menu de Escolha de Cargos, para usar mande apenas crie um embed em um canal com o bot e envie prefix + addRoles + <channelID/Mention> + <messageID bot>. Vá removendo seguindo a estrutura `,
  permissions: ['staff'],
  aliases: ['removerCargo', 'removeRole'],
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
        `Por favor, envie um canal de texto junto ao comando ${prefix}removeRoles <channelID/Menção> <messageID>`
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

    function removeRoleInMessage() {
      message.channel.send(
        `Remova um Cargo enviando uma mensagem com o cargo a ser removido: Ex: @cargo. Caso não queira adicionar mais cargos envie "none"`
      );
      const filter = (m) => m.author.id === message.author.id;
      const collector = message.channel.createMessageCollector({
        filter,
        max: 1,
        time: 1000 * 60 * 1,
      });
      let answered = false;
      collector.on('collect', async (m) => {
        answered = true;
        if (m.content.trim() === 'none' || m.content.startsWith(prefix))
          return message.channel.send('Comando de remover cargos finalizado');

        const argsRole = m.content.trim().split(' ');

        const role = message.guild.roles.cache.find(
          (rol) =>
            rol.id === argsRole[0].replace(/(<)|(@&)|(>)/g, '') ||
            rol.name === argsRole[0]
        );
        if (!role) {
          message.channel.send('envie um cargo válido');
          return removeRoleInMessage();
        }

        const menu =
          row.components[0] instanceof MessageSelectMenu
            ? row.components[0]
            : new MessageSelectMenu();
        if (menu.options.length > 0) {
          for (let i = 0; i < menu.options.length; i++) {
            if (menu.options[i].value === role.id) {
              menu.options.splice(i, 1);
              if (menu.options.length === 0) {
                return message.channel.send(
                  'O menu precisa ter ao menos 1 opção, não foi possível excluir está última opção'
                );
              }

              menu.setMaxValues(menu.options.length);
              await targetMessage.edit({ components: [row] });
              m.react(reactionEmoji);
              message.channel.send('removido');
              return removeRoleInMessage();
            }
          }
          message.channel.send('O cargo não está no menu');
          return removeRoleInMessage();
        }

        message.channel.send('A mensagem não possui menu');
      });

      collector.on('end', () => {
        if (!answered) {
          message.channel.send(
            `${message.author} O tempo acabou e o comando foi cancelado`
          );
        }
      });
    }
    removeRoleInMessage();
  },
};
