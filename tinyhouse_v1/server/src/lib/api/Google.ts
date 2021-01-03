//this file stores the methods we'll create that connect with Google's APIs.
import { google } from "googleapis";
import { createClient, AddressComponent } from "@google/maps";

const maps = createClient({ key: `${process.env.G_GEOCODE_KEY}`, Promise });

const parseAddress = (addressComponents: AddressComponent[]) => {
  let country = null;
  let admin = null;
  let city = null;

  for (const component of addressComponents) {
    if (component.types.includes("country")) {
      country = component.long_name;
    }

    if (component.types.includes("administrative_area_level_1")) {
      admin = component.long_name;
    }

    if (
      component.types.includes("locality") ||
      component.types.includes("postal_town")
    ) {
      city = component.long_name;
    }
  }

  return { country, admin, city };
};

//we need the auth object to generate an authentication URL for a consent
// form or use Google's **People API** to get information for a certain user.
const auth = new google.auth.OAuth2(
  process.env.G_CLIENT_ID,
  process.env.G_CLIENT_SECRET,
  `${process.env.PUBLIC_URL}/login`
);

export const Google = {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  geocode: async (address: string) => {
    const res = await maps.geocode({ address }).asPromise();

    if (res.status < 200 || res.status > 299) {
      throw new Error("failed to geocode address");
    }
    return parseAddress(res.json.results[0].address_components);
  },
  authUrl: auth.generateAuthUrl({
    access_type: "online",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  }),
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  logIn: async (code: string) => {
    // make a request to Google using a "code" argument to get a user's access token
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);
    const { data } = await google.people({ version: "v1", auth }).people.get({
      resourceName: "people/me",
      personFields: "emailAddresses,names,photos",
    });

    return { user: data };
  },
};

//0 we'll construct an object we'll label `Google` that is to expose exactly what we'll need in our app.

//1 the generateAuthUrl()` function from the constructed `auth` object enables us to create
//the authentication URL that can navigate the user to Google's consent screen.

//2 the authurl field holds the authentication URL Google is to provide
//where users can sign-in with their Google account

//3  A single access token can grant varying degrees of access to multiple APIs. A parameter called `scope` controls this.
//In the `scope` option, we'll state that we're interested in the user's email and basic user info profile
//4 the`getToken()` function from auth accepts a code and creates an HTTP request to Google's servers to obtain the user's `access_token`
// 5 The `tokens` value we've destructed contains both the `access_token` as well as a value called a `refresh_token`. For our app, we are just using
//the tokens to obtain the user's information right away so we won't need to save them in our database. If we were to
//develop an app that uses these tokens for other APIs (e.g. using Gmail or Google Calendar API), we would most likely
//need them saved in our database for later use.
//6 We'll then run the `setCredentials()` function from the `auth` object and pass in `tokens` to configure the `auth` object.
//7 we can now use the configured `auth` object to make a request to Google's **People API** to get the user information we'll need
