import mongoose from "mongoose";
import Group from "../Schemas/Group.js";

class GroupRepository {
  constructor() {
    this.repository = mongoose.model('groups', Group);
  }

  async insertMany(list) {
    try {
      await this.repository.insertMany(list)
    } catch (error) {
      if (error instanceof MongoError) {
        console.log(error.message)
        console.log(error.stack)
      }
    }
  }

  async insertOne(group) {
    try {
      const findedGroup = await this.repository.findOne({ name: group.name }, { noCursorTimeout: false })
      if (findedGroup) {
        throw new Error("Já existe um grupo com esse nome");
      }
      await this.repository.create(group)
    } catch (error) {
      if (error) {
        console.log(error.message)
        console.log(error.stack)
      }
      throw error;
    }
  }

  async findOne(name) {
    const item = await this.repository.findOne({ name }, { noCursorTimeout: false })
    if (item !== undefined) {
      return item;
    }
    throw new Error('Group not found');
  }

  async findById(id) {
    const item = await this.repository.findOne({ id }, { noCursorTimeout: false })
    if (item !== undefined) {
      return item;
    }
    throw new Error('Group not found');
  }

  async listAll() {
    const list = await this.repository.find({}, { noCursorTimeout: false }).map((item) => item)
    return list
  }

  async updateRepo(group) {
    try {
      await this.repository.updateOne(
        {
          'id': group.id
        }, {
        $set: {
          'repo': group.repo
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async updateOne(name, data) {
    try {
      await this.repository.updateOne(
        {
          'name': name
        }, {
        $set: {
          'name': data.group?.name,
          'inviteMessageId': data.inviteMessageId,
          'status': data.accepted ? 'aproved' : data.group?.status || 'unvalued'
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async insertGithub(id, liderGH) {
    try {
      await this.repository.updateOne(
        {
          'id': id
        }, {
        $set: {
          'liderGH': liderGH,
        }
      }
      )
    } catch (error) {

    }
  }

  async deleteOne(id) {
    await this.repository.deleteOne({ id });
  }
}

export default GroupRepository;
