import { IResolvers } from "apollo-server-express";
import { Google } from "../../../lib/api";
import { Viewer, Database, User } from "../../../lib/types";
import { LogInArgs } from "./types";
import crypto from "crypto";

//When this asynchronous function is to be resolved successfully, we expect it to return a `Promise` that when resolved will return a `User` document from our `"users"`
//collection for the user that's just signed in. If unsuccessful it'll return a `Promise` of `undefined`.
const logInViaGoogle = async (
  code: string,
  token: string,
  db: Database
): Promise<User | undefined> => {
  const { user } = await Google.logIn(code); //this is to get the user data from google people api

  if (!user) {
    throw new Error("Google login error");
  }
  // Names/Photos/Email Lists
  const userNamesList = user.names && user.names.length ? user.names : null;
  const userPhotosList = user.photos && user.photos.length ? user.photos : null;
  const userEmailsList =
    user.emailAddresses && user.emailAddresses.length
      ? user.emailAddresses
      : null;

  // User Display Name
  const userName = userNamesList ? userNamesList[0].displayName : null;

  // User Id
  const userId =
    userNamesList &&
    userNamesList[0].metadata &&
    userNamesList[0].metadata.source
      ? userNamesList[0].metadata.source.id
      : null;

  // User Avatar
  const userAvatar =
    userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;

  // User Email
  const userEmail =
    userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error("Google login error");
  }
  // in updateRes fxn we check if the user is already in our db and update their data with the data from google
  const updateRes = await db.users.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        token,
      },
    },
    { returnOriginal: false }
  );

  let viewer = updateRes.value;

  //if viewer is not in our db..we create a new user with data returned from people api
  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id: userId,
      token,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      income: 0,
      bookings: [],
      listings: [],
    });

    viewer = insertResult.ops[0];
  }

  return viewer;
};

export const viewerResolvers: IResolvers = {
  Query: {
    authUrl: (): string => {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error(`Failed to query Google Auth Url: ${error}`);
      }
    },
  },
  Mutation: {
    logIn: async (
      _root: undefined,
      { input }: LogInArgs,
      { db }: { db: Database }
    ): Promise<Viewer> => {
      try {
        const code = input ? input.code : null;
        const token = crypto.randomBytes(16).toString("hex"); //session token

        const viewer: User | undefined = code
          ? await logInViaGoogle(code, token, db)
          : undefined;

        if (!viewer) {
          return { didRequest: true }; //if viewer is not available atleast we requested it.
        }

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
      }
    },
    logOut: (): Viewer => {
      try {
        return { didRequest: true };
      } catch (error) {
        throw new Error(`Failed to log out: ${error}`);
      }
    },
    Viewer: {
      id: (viewer: Viewer): string | undefined => {
        return viewer._id;
      },
      hasWallet: (viewer: Viewer): boolean | undefined => {
        return viewer.walletId ? true : undefined;
      },
    },
  },
};

// the login mutation would be fired Where the viewer signs-in with the Google authentication url and consent screen.
// Where the viewer signs-in with their cookie session.

//2 Though we're labeling the constant we've just created as `viewer`, we'll expect the `logInViaGoogle()` function to get the
//user information from Google's servers, store that information in the database, and **return the user document of the recently
//logged-in user**. As a result, we've specified the type of the `viewer` constant as `User` or `undefined`.
// The `logInViaGoogle()` function will return undefined if it is unable to get the appropriate user information or store that
// information in the database.
