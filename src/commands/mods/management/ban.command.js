import { getUserOfCommand } from '../../../utils/getUserMention/getUserOfCommand.js';
import { confirmMessage } from '../../../utils/confirmMessage/confirmMessage.js';
import { helpWithASpecificCommand } from '../../everyone/comandosCommon/help.command.js';
import Icons from '../../../utils/layoutEmbed/iconsMessage.js';
import Colors from '../../../utils/layoutEmbed/colors.js';
import { uploadImage } from '../../../services/uploadImageImgur/uploadImage.js';

export default {
  name: 'ban',
  description: `<prefix>ban @Usuários/TAGs/Nomes/IDs/Citações <motivo> para banir membros`,
  permissions: ['mods'],
  aliases: ['banir'],
  category: 'Moderação ⚔️',
  dm: false,
  run: async ({ message, client, args, prefix }) => {
    const { users, restOfMessage } = await getUserOfCommand(
      client,
      message,
      prefix
    );
    if (!args[0] && !users) {
      const [command] = message.content.slice(prefix.length).split(/ +/);
      helpWithASpecificCommand(command, client, message);
      return;
    }

    if (users === undefined) {
      return message.channel
        .send({
          content: `${message.author}`,
          embeds: [
            {
              color: Colors.pink_red,
              thumbnail: Icons.erro,
              title: `Não encontrei o usuário!`,
              description: `** Tente usar **\`\`\`${prefix}ban @Usuários/TAGs/Nomes/IDs/Citações <motivo>\`\`\``,
              footer: {
                text: `${message.author.tag}`,
                icon_url: `${message.author.displayAvatarURL({
                  dynamic: true,
                })}`,
              },
              timestamp: new Date(),
            },
          ],
        })
        .then((msg) => setTimeout(() => msg.delete(), 15000));
    }

    let reason = restOfMessage || '<Motivo não especificado>';

    const attachmentsLinks = message.attachments.map((anex) => anex.url);

    if (attachmentsLinks.length > 0) {
      if (attachmentsLinks.length > 3) {
        return message.channel.send({
          content: `${message.author} Você pode enviar no máximo 3 imagens como prova`,
        });
      }
      reason += `\n**Arquivos anexados**: ${attachmentsLinks.join('\n')}`;
    }

    const messageAnt = await message.channel.send({
      content: `${message.author}`,
      embeds: [
        {
          color: Colors.red,
          thumbnail: Icons.sledgehammer,
          author: {
            name: message.author.tag,
            icon_url: message.author.displayAvatarURL({ dynamic: true }),
          },
          title: `Você está prestes a Banir os usuários:`,
          description: `**Usuários: ${users.join('|')}**
**Pelo Motivo de: **
${reason}

✅ Para confirmar
❎ Para cancelar
🕵️‍♀️ Para confirmar e não avisar que foi você que aplicou`,
          timestamp: new Date(),
        },
      ],
    });
    await confirmMessage(message, messageAnt).then(async (res) => {
      await messageAnt.delete();

      if (res) {
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
          message.channel
            .send({
              content: `${message.author}`,
              embeds: [
                {
                  color: Colors.pink_red,
                  thumbnail: Icons.erro,
                  author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL({
                      dynamic: true,
                    }),
                  },
                  description: `Ative a permissão de banir para mim, para que você possa usar o comando`,
                  title: `Eu não tenho permissão para banir usuários`,

                  footer: {
                    text: `A permissão pode ser ativada no cargo do bot em configurações ${message.author.tag}`,
                    icon_url: `${message.author.displayAvatarURL({
                      dynamic: true,
                    })}`,
                  },

                  timestamp: new Date(),
                },
              ],
            })
            .then((msg) => setTimeout(() => msg.delete(), 15000));
        }

        if (!message.member.permissions.has('BAN_MEMBERS')) {
          message.channel
            .send({
              content: `${message.author}`,
              embeds: [
                {
                  color: Colors.pink_red,
                  thumbnail: Icons.erro,
                  author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL({
                      dynamic: true,
                    }),
                  },
                  title: `Você não tem permissão para banir os usuários`,
                  description: `Você não pode banir usuários nesse servidor`,
                  timestamp: new Date(),
                },
              ],
            })
            .then((msg) => setTimeout(() => msg.delete(), 15000));
        }

        users.forEach(async (user) => {
          if (user.id === message.guild.me.id) {
            return message.channel
              .send({
                content: `${message.author}`,
                embeds: [
                  {
                    color: Colors.pink_red,
                    thumbnail: Icons.erro,
                    author: {
                      name: message.author.tag,
                      icon_url: message.author.displayAvatarURL({
                        dynamic: true,
                      }),
                    },
                    title: `Hey, você não pode me banir e isso não é legal :(`,
                    timestamp: new Date(),
                  },
                ],
              })
              .then((msg) => setTimeout(() => msg.delete(), 15000));
          }

          const memberUser = client.guilds.cache
            .get(message.guild.id)
            .members.cache.get(user.id);
          if (
            memberUser?.roles.highest.position >=
            message.guild.me.roles.highest.position
          ) {
            return message.channel
              .send({
                content: `${message.author}`,
                embeds: [
                  {
                    color: Colors.pink_red,
                    thumbnail: Icons.erro,
                    author: {
                      name: message.author.tag,
                      icon_url: message.author.displayAvatarURL({
                        dynamic: true,
                      }),
                    },
                    title: `Eu não tenho permissão para banir o usuário ${user.tag}`,
                    description: `O usuário ${user} tem um cargo acima ou igual a mim, eleve meu cargo acima do dele`,
                    timestamp: new Date(),
                  },
                ],
              })
              .then((msg) => setTimeout(() => msg.delete(), 15000));
          }
          let reasonOfBan = `${restOfMessage}` || '<Motivo não especificado>';
          if (attachmentsLinks.length > 0) {
            await uploadImage(message).then((linksImages) => {
              reasonOfBan += `\n**Arquivos anexados**:\n${linksImages.join(
                '\n'
              )}`;
            });
          }

          await message.guild.members
            .ban(user, {
              reason: `Punido por ${message.author.tag} | ${message.author.id}
               — Data: ${message.createdAt.toISOString()} — Motivo: ${reasonOfBan}`,
            })
            .then(() => {
              const inviteDmAutor =
                res === 'anonimo' ? 'a administração' : message.author;
              user
                .send({
                  embeds: [
                    {
                      color: Colors.pink_red,
                      thumbnail: message.guild.iconURL(),
                      title: `Você foi banido do servidor **${message.guild.name}**`,
                      description: `**Motivo: **\n${reason}\nCaso ache que o banimento foi injusto, **fale com ${inviteDmAutor.tag}**`,
                      footer: `ID do usuário: ${user.id}`,
                      timestamp: new Date(),
                    },
                  ],
                })
                .catch(() =>
                  message.channel.send({
                    content: `${message.author}`,
                    embeds: [
                      {
                        author: {
                          name: message.author.tag,
                          icon_url: message.author.displayAvatarURL({
                            dynamic: true,
                          }),
                        },
                        thumbnail: user.displayAvatarURL({ dynamic: true }),
                        color: Colors.pink_red,
                        title: `Não foi possível avisar na DM do usuário ${user.tag}!`,
                      },
                    ],
                  })
                );
            })
            .catch(() => {
              message.channel.send({
                content: 'Dê um motivo que tenha menos caracteres',
              });
            });
        });
      }
    });
  },
};
