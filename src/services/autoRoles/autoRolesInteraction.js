import { GuildMember } from 'discord.js';

export function autoRolesInteraction(client, interaction) {
  if (!interaction.isSelectMenu()) return;
  const { customId, values, member } = interaction;

  if (customId === 'auto_roles' && member instanceof GuildMember) {
    const { component } = interaction;
    const removed = component.options.filter((option) => {
      return !values.includes(option.value);
    });

    for (const id of removed) {
      member.roles.remove(id.value);
    }
    for (const id of values) {
      member.roles.add(id);
    }
    interaction.reply({ content: 'Cargos Atualizados!', ephemeral: true });
  }
}
