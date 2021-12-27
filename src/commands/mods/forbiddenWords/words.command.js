import Colors from '../../../utils/layoutEmbed/colors.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';

function removeWordsNull(array) {
  const filterArray = array.filter((item) => {
    return Boolean(item);
  });

  return filterArray;
}

export default {
  name: 'words',
  description: `<prefix>words para ver mensagens proibidas no servidor`,
  permissions: ['mods'],
  aliases: ['viewwords', 'words?'],
  dm: true,
  category: 'AntiSpam ⚠️',
  run: ({ message, client, prefix }) => {
    const guildIdDatabase = new client.Database.table(
      `guild_id_${message.guild.id}`
    );

    if (guildIdDatabase.has('listOfWordsBanned')) {
      const listOfWords = removeWordsNull(
        guildIdDatabase.get('listOfWordsBanned')
      ).sort();

      if (listOfWords.length > 0) {
        message.channel.send({
          content: `${message.author}`,
          embeds: [
            {
              color: Colors.pink_red,
              thumbnail: Icons.sucess,
              title: 'Banco encontrado!',
              description: `**Aqui está todas as palavras do banco de dados:**\n> \`${listOfWords.join(
                ' | '
              )}\`\n**Caso queira adicionar ou remover alguma palavra use os comandos de addWords e removeWords**`,
              footer: {
                text: `${message.author.tag}`,
                icon_url: `${message.author.displayAvatarURL({
                  dynamic: true,
                })}`,
              },

              timestamp: new Date(),
            },
          ],
        });

        return;
      }
    }

    message.channel.send({
      content: `${message.author}`,
      embeds: [
        {
          color: Colors.pink_red,
          title: `Seu servidor não foi encontrado: `,
          description: `** Para ativar o sistema de Forbbiden Words primeiro adicione palavras com o comando:**
> \`${prefix}addwords <palavra1> <palavra2> <palavra3> etc...\`

**Para configurar onde os report's irão ser mandados:**
> \`${prefix}addlog <#chat/ID>\`

**Para mais detalhes consulte o comando addwords:**
> \`${prefix}help addwords\``,
          thumbnail: Icons.erro,
          footer: {
            text: `${message.author.tag}`,
            icon_url: `${message.author.displayAvatarURL({ dynamic: true })}`,
          },
          timestamp: new Date(),
        },
      ],
    });
  },
};
