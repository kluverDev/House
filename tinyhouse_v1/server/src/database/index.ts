/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MongoClient } from "mongodb";
import { Database, Listing, User, Booking } from "../lib/types";

const user = process.env.DB_USER;
const userPassword = process.env.DB_USER_PASSWORD;
const cluster = process.env.DB_CLUSTER;
const dbname = process.env.DBNAME;

const url = `mongodb+srv://${user}:${userPassword}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;

export const connectDatabase = async (): Promise<Database>=> {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = client.db("main");

  return {
    bookings: db.collection<Booking>("bookings"),

    listings: db.collection<Listing>("test_listings"),
    users: db.collection<User>("users"),

  };
};