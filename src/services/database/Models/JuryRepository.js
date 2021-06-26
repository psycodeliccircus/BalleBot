import mongoose from "mongoose";
import Jury from "../Schemas/Jury.js";

class JuryRepository {
  constructor() {
    this.repository = mongoose.model('juries', Jury);
  }
  async insertOne(jury) {
    try {
      await this.repository.create(jury);
    } catch (error) {
      if (error instanceof MongoError) {
        console.log(error.message)
        console.log(error.stack)
      }
    }
  }
  async listAll() {
    await this.repository.find()
    const list = await this.repository.find().exec()
    return list
  }
}

export default JuryRepository;
