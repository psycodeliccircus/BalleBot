import 'dotenv/config';
import mongoose from "mongoose";
import UserRepository from './Models/UserRepository.js';

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
  const userRepository = new UserRepository();
  await userRepository.clear();
})
