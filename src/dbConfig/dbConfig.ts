import mongoose from "mongoose";

const connectToDb = async() => {
  try {
    mongoose.connect(process.env.MONGO_URI!)
    const connection = mongoose.connection

    connection.on('connected',() => {
      console.log('connected to db');
    })
    connection.on('error',(err) => {
      console.log('err while connecting to db: +',err);
    })

  } catch (error) {
    console.log('something went wrong while connecting to db',error);
    process.exit(1)
  }
}

export default connectToDb