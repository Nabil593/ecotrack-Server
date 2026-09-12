import app from "../src/app.js";
import connectDB from "../src/config/db.js";

let isConnected = false;

export default async function handler(req: any, res: any) {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }

    return app(req, res);
  } catch (error) {
    console.error("Database connection failed:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
}