import axios from "axios";

const { githubToken } = process.env;

export class GithubRequests {
  async tryCreateRepo(group) {
    try {
      const { data, status } = await axios.post(`https://api.github.com/user/repos`,
        {
          name: group.name,
          description: `Repositório para entrega do projeto da equipe ${group.name} liderada por ${group.lider}.`,
          private: true,
          auto_init: false,
          delete_branch_on_merge: false,
          is_template: false
        }, {
        headers: {
          "Authorization": `token ${githubToken}`
        }
      })

      group.repo = data.name;
      return {
        message: `O grupo ${group.name} foi criado com sucesso!`,
        status,
        group
      };
    } catch (error) {
      const data = error.response.data;
      return {
        message: 'Ocorreu algum erro para criar o repositório',
        error: data,
        status: error.response.status,
        group
      };
    }
  }

  async findUser(username) {
    const { data } = await axios.get(`https://api.github.com/users/${username}`);
    return data;
  }

  async inviteToRepo(name, liderGH) {
    const github = liderGH.split('/')
    try {
      const { status, data } = await axios.put(
        `https://api.github.com/repos/Matan18/${name}/collaborators/${liderGH.endsWith('/') ? github[github.length - 2] : github[github.length - 1]}`,
        {
          "permission": "permission"
        },
        {
          headers: {
            "Authorization": `token ${githubToken}`
          }
        });
      return {
        status,
        html_url: data.html_url
      }
    } catch (error) {
      console.log(error.response.status)
      return {
        errorData: {
          message: error.response.data.message,
          documentation_url: error.response.data.documentation_url,
          status: error.response.status,
        }
      }
    }
  }

  async getCollaborators(name) {
    const { data } = await axios.get(
      `https://api.github.com/repos/Matan18/${name}/collaborators`,
      {
        headers: {
          "Authorization": `token ${githubToken}`
        }
      });

    return { collaborators: data };
  }

  async getCommits(name) {
    try {
      const { data } = await axios.get(
        `https://api.github.com/repos/Matan18/${name}/commits`,
        {
          headers: {
            "Authorization": `token ${githubToken}`
          }
        });
      return { commits: data }
    } catch (error) {
      if (error.response.status !== 409) {
        console.log(error)
      }
      return {};
    }
  }
}
