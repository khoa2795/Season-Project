import mongoose from "mongoose";
import { DB_URI } from "./config/constants.js";
export const connectDB = async () => {
    if (DB_URI === undefined || DB_URI === "") {
        throw new Error("Please provide a MongoDB URI");
    }
    try {
        const connectionInstance = await mongoose.connect(DB_URI);
        console.log(`\n MongoDB connected ${connectionInstance.connection.host}`);
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=database.js.map