import React, { useState, useEffect } from 'react';
import Amplify, { Hub, Logger, Auth } from 'aws-amplify';
import {
  createMuiTheme, responsiveFontSizes, ThemeProvider, Container, Typography,
} from '@material-ui/core';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { HubCapsule, HubPayload } from '@aws-amplify/core/lib-esm/Hub';
import { purple, orange } from '@material-ui/core/colors';
import SignIn from '../Authentication/Signin';
import Register from '../Authentication/Register';
import NavBar from '../NavBar/NavBar';
import './App.css';
import ForgotPassoword from '../Authentication/RecoverPassoword';

Amplify.Logger.LOG_LEVEL = 'INFO';

const logger = new Logger('App');

const theme = responsiveFontSizes(createMuiTheme(
  {
    palette: {
      primary: {
        main: purple[400],
      },
      secondary: {
        main: orange[400],
      },
    },
  },
));

function App() {
  const [cognitoUser, setCognitoUser] = useState(null);
  const [userLoading, setUserLoading] = useState<Boolean>(true);

  const listener = (data: HubCapsule) => {
    const { payload }: { payload: HubPayload } = data;
    switch (payload.event) {
      case 'signIn': {
        logger.info('user signed in');
        setCognitoUser(payload.data);
        break;
      }
      case 'signUp':
        logger.info('user signed up');
        break;
      case 'signOut':
        logger.info('user signed out');
        setCognitoUser(null);
        break;
      case 'signIn_failure':
        logger.error('user sign in failed');
        break;
      case 'configured':
        logger.info('the Auth module is configured');
        break;
      default:
        logger.info('No Auth State Change');
        break;
    }
  };

  useEffect(() => {
    Hub.listen('auth', listener);
    Auth.currentAuthenticatedUser({
      bypassCache: false,
    }).then((user) => setCognitoUser(user))
      .catch((error: Error) => logger.debug(error))
      .finally(() => setUserLoading(false));
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <div className="full-size">
          <nav>
            <NavBar user={cognitoUser} userLoading={userLoading} />
          </nav>
          <Switch>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/sign-in">
              <SignIn />
            </Route>
            <Route path="/recover-password">
              <ForgotPassoword />
            </Route>
            <Route path="/">
              <Container>
                <Typography>Home</Typography>
              </Container>
            </Route>
          </Switch>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
