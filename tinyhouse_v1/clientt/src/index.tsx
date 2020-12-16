import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider, useMutation } from "@apollo/react-hooks";
import {
  Home,
  Host,
  Listing,
  Listings,
  NotFound,
  User,
  Login,
} from "./sections";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./styles/index.css";
import { Affix, Spin, Layout } from "antd";
import { Viewer } from "./lib/types";
import { AppHeader } from "./sections/AppHeader";
import reportWebVitals from "./reportWebVitals";
import { LOG_IN } from "./lib/graphql/mutations";
import {
  LogIn as LogInData,
  LogInVariables,
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";
import { AppHeaderSkeleton, ErrorBanner } from "./lib/components";

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);
        if (data.logIn.token) {
          sessionStorage.setItem("token", data.logIn.token);
        } else {
          sessionStorage.removeItem("token");
        }
      }
    },
  });

  const logInRef = useRef(logIn); //if we put the login fxn in the useefect,
  //we would have to declare a dependency. we dont want that. so we use useref to make sure login remains the same

  useEffect(() => {
    logInRef.current();
  }, []);

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching Tinyhouse" />
        </div>
      </Layout>
    );
  }
  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  ) : null;

  console.log("in app");
  if (viewer.id) {
    console.log("i win.viewer id is available");
  }
  return (
    <Router>
      <Layout id="app">
        {logInErrorBannerElement}

        <Affix offsetTop={0} className="app__affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route
            exact
            path="/login"
            render={(props) => <Login {...props} setViewer={setViewer} />}
          />
          <Route exact path="/" component={Home} />
          <Route exact path="/host" component={Host} />
          <Route exact path="/listing/:id" component={Listing} />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route exact path="/user/:id" render={props => <User {...props} viewer={viewer} />} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};

const client = new ApolloClient({
  uri: "/api",
  request: async (operation) => {
    const token = sessionStorage.getItem("token");
    operation.setContext({
      headers: {
        "X-CSRF-TOKEN": token || "",
      },
    });
  },
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

//That's all we'll do for now. For every request made in our app, the `X-CSRF-TOKEN` will now be passed to our server as a header property. In our server, when we run the `authorize()` function, we'll check to see if the viewer can be found with this token in our database. In resolver functions where we want to verify that the request is coming from a valid viewer, we'll obtain the `viewer` information from the `authorize()` function and allow the request to query or manipulate sensitive information in our app.
