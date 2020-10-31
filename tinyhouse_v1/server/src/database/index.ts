/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MongoClient } from "mongodb";



const url = `mongodb+srv://${user}:${userPassword}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;

export const connectDatabase = async () => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db("main");

  return {
    listings: db.collection("test_listings")
  };
};