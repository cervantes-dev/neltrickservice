import mongoose from "mongoose";

const connectionToDatabase = async () => {
    try {
        if (!process.env.MongoUrl) throw new Error("MongoUrl is not defined")
        await mongoose.connect(process.env.MongoUrl)
        console.log("DB Connected Successfully")
    } catch(err) {
        console.log(err)
    }
}

export default connectionToDatabase