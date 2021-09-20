import { MessageEmbed } from 'discord.js';

export function loadTemplate(group) {
  return new MessageEmbed({
    title: 'Apresentação da equipe',
    description: group.name,
    author: {
      name: group.name,
    },
    url: group.liderGH.startsWith('https')
      ? group.liderGH
      : `https://github.com/${group.liderGH}`,
    color: 0x582c48,
    fields: [
      { name: 'Lider', value: group.lider, inline: true },
      { name: 'Discord do Lider', value: group.liderDisc, inline: true },
      { name: 'Github do Lider', value: group.liderGH, inline: false },
      {
        name: 'Equipe',
        value: group.crew.map((member) => `- ${member}`).join('\n'),
        inline: true,
      },
    ],
    footer: {
      text: `Clique no botão Confirmar para confirmar seus dados!
Ou use o botão Cancelar para excluir essa equipe!`,
    },
  });
}

export function registeredGithubUser(user) {
  const embed = new MessageEmbed({
    title: `Jurado Registrado: ${user.github}`,
    author: { name: user.name },
    url: `https://github.com/${user.github}`,
    thumbnail: { url: user.avatar_url, height: 20, width: 20 },
    color: 0x582c48,
  });
  return embed;
}

export function repoCreatedTemplate({ group, message, status, error }) {
  if (error) {
    const embed = new MessageEmbed({
      title: message,
      description: `Resposta do github com status: ${status}`,
      color: 0x344e7f,
      author: {
        name: group.name,
      },
      fields: [
        { name: 'Repositório', value: group.repo, inline: false },
        ...error.errors.map((errorData) => ({
          name: errorData.field,
          value: errorData.message,
          inline: false,
        })),
      ],
      footer: {
        text: 'Confira os repositórios dessa conta, ou atualize os dados da equipe com o commando update.',
      },
    });
    return embed;
  }

  const embed = new MessageEmbed({
    title: 'Repositório criado!',
    description: message,
    url: `https://github.com/Matan18/${group.repo}`,
    color: 0x344e7f,
    author: {
      name: group.name,
    },
    fields: [
      { name: 'Repositório', value: group.repo, inline: false },
      { name: 'Github do Lider', value: group.liderGH, inline: false },
      { name: 'Discord do Lider', value: group.liderDisc, inline: true },
      { name: 'Lider', value: group.lider, inline: true },
    ],
    footer: { text: 'Reaja com ☑  para fazer o convite para o lider!' },
  });
  return embed;
}

// eslint-disable-next-line camelcase
export function invitationSentTemplate(group, html_url) {
  const embed = new MessageEmbed({
    title: 'Convite de equipe enviado',
    description: `O convite de acesso ao repositório ${group.name} foi enviado para ${group.liderGH}`,
    author: {
      name: group.name,
    },
    url: html_url,
    color: 0x714141,
    fields: [
      { name: 'Repositório', value: group.name, inline: false },
      { name: 'Lider', value: group.lider, inline: true },
      { name: 'LiderDisc', value: group.liderDisc, inline: true },
    ],
  });
  return embed;
}

export function invitationErrorTemplate(group, errorData) {
  const embed = new MessageEmbed({
    title: 'Erro ao enviar convite',
    description: `O convite de acesso ao repositório ${group.name} teve o seguinte erro: ${errorData.message}`,
    url: `https://github.com/Matan18/${group.name}`,
    color: 0xf50000,
    author: { name: group.name },
    footer: {
      text: 'Reaja com ☑  para tentar novamente, ou atualize os dados da equipe com o comando update',
    },
    fields: [
      { name: 'Repositório', value: group.name, inline: false },
      { name: 'LiderGH', value: group.liderGH, inline: false },
      { name: 'LiderDisc', value: group.liderDisc, inline: true },
      { name: 'Lider', value: group.lider, inline: true },
    ],
  });
  return embed;
}

export function getRepoInfoTemplate({ group, collaborators, commits }) {
  const collaboratorslist = collaborators
    .filter((collaborator) => collaborator.login !== 'Matan18')
    .map((collaborator) => {
      return { name: '*', value: collaborator.login, inline: false };
    });
  const fields = [
    { name: 'Lider', value: group.lider, inline: true },
    { name: 'Discord do Lider', value: group.liderDisc, inline: true },
    { name: 'Github do Lider', value: group.liderGH, inline: true },
    {
      name: 'Colaboradores',
      value: `${collaborators.length - 1}`,
      inline: false,
    },
    ...collaboratorslist,
  ];
  if (commits) {
    const commitsFields = [
      { name: '*', value: '==========', inline: false },
      { name: 'Commits', value: `${commits.length}`, inline: false },
      {
        name: 'Último commit',
        value: `${commits[0].commit.message}`,
        inline: false,
      },
    ];
    fields.push(...commitsFields);
  }

  const embed = new MessageEmbed({
    title: `Dados do Repositório ${group.name}`,
    description: 'Commits e lista de colaboradores',
    url: `https://github.com/Matan18/${group.repo}`,
    color: 0x344e7f,
    author: {
      name: group.name,
    },
    fields,
  });
  return embed;
}

export function invitedJuryToRepo(groups, jury) {
  const fields = groups.map((group) => ({
    name: group.name,
    value: group.liderDisc,
    inline: true,
  }));

  const embed = new MessageEmbed({
    title: `Convites enviados para o jurado: ${jury.name}`,
    author: { name: jury.github },
    color: 0xe63d3d,
    fields,
  });
  return embed;
}

export function showJuryTemplate(jury) {
  const embed = new MessageEmbed({
    title: `Apresentação de jurado: ${jury.name}`,
    author: { name: jury.github },
    thumbnail: {
      url: `https://github.com/${jury.github}.png`,
    },
    color: 0xe63d3d,
  });
  return embed;
}
