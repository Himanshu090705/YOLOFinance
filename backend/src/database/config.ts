import { connect } from "mongoose";
export async function connectToMongodb(connectionString: string) {
  try {
    await connect(connectionString);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
}
