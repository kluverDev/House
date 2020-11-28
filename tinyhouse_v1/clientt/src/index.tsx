import React, { useState } from "react";
import { render } from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
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
import { Layout } from "antd";
import { Viewer } from "./lib/types";
import {AppHeader} from "./sections/AppHeader"
import reportWebVitals from "./reportWebVitals";
import { Affix } from "antd";


const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);

  console.log("in app");
  if (viewer.id) {
    console.log("i win.viewer id is available");
  }
  return (
    <Router>
      <Affix offsetTop={0} className="app__affix-header">
        <AppHeader  viewer={viewer} setViewer={setViewer}/>
      </Affix>

      <Layout id="app">
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
          <Route exact path="/user/:id" component={User} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};

const client = new ApolloClient({
  uri: "/api",
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
