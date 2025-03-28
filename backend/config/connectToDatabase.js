import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
<<<<<<< HEAD
=======
    
>>>>>>> 687d0dfea03e5096786e58bade2cc327f16e3b3a
    console.log("MongoDB connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

<<<<<<< HEAD
export default connectDB;
=======
export default connectDB;
>>>>>>> 687d0dfea03e5096786e58bade2cc327f16e3b3a
