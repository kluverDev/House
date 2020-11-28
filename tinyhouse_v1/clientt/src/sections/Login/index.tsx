import React, { useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { Card, Layout, Typography , Spin} from "antd";
import { Viewer } from "../../lib/types";
import { AUTH_URL } from "../../lib/graphql/queries";
import { LOG_IN } from "../../lib/graphql/mutations";
import { AuthUrl as AuthUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import {
  LogIn as LogInData,
  LogInVariables,
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import { displaySuccessNotification, displayErrorMessage } from "../../lib/utils";
import { ErrorBanner } from "../../lib/components";


import googleLogo from "./assets/google_logo.jpg";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient(); //so we can make queries manually
  const [
    logIn,
    { data: logInData, loading: logInLoading, error: logInError },
  ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);
        displaySuccessNotification("You've successfully logged in!");
      }
    },
  });
  logInData ? console.log(logInData) : console.log("DATA NOT AVAILABLE");
  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      });
      window.location.href = data.authUrl; //redirecting our app to the url from google
    } catch {
      displayErrorMessage("Sorry! We weren't able to log you in. Please try again later!");
    }
  };
  const logInRef = useRef(logIn);
  //The `useRef` Hook accepts an argument with which it returns **a mutable object which will persist for the lifetime of the component**.

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    console.log("in effect");
    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      });

      console.log("hi code", code);
    }
  }, []);
  console.log("in login");
  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..." />
      </Content>
    );
  }
  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="We weren't able to log you in. Please try again soon." />
  ) : null;
  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn;
    return <Redirect to={`/user/${viewerId}`} />;
  }
  return (
    <Content className="log-in">
      {logInErrorBannerElement}

      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋 {console.log("in return")}
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>
        <button
          className="log-in-card__google-button"
          onClick={handleAuthorize}
        >
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google
          </span>
        </button>
        <Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form
          to sign in with your Google account.
        </Text>
      </Card>
    </Content>
  );
};
