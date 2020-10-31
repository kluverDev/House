
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";

import { typeDefs, resolvers } from "./graphql";

const port = process.env.PORT;
console.log(process.env.DB_USER_PASSWORD)

const mount = async (app: Application) => {
  const db = await connectDatabase();

  const server = new ApolloServer({ typeDefs, resolvers });

  server.applyMiddleware({ app, path: "/api" });
  app.listen(port);

  const listings = await db.listings.find({}).toArray();
  console.log(listings);
  console.log(`[app]: http://localhost:${port}`);
};
mount(express());
