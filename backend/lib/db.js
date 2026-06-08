import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const ConnectMongooseDB = async () => {
  try {
    const mongoDB = await mongoose.connect(process.env.Moongo_URL);
    console.log("Mongoose Connected ", mongoDB.connection.host);
  } catch (error) {
    console.log("error in ConnectMongooseDB", error);
  }
};
