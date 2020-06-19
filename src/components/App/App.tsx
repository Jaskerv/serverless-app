import React, { useState } from 'react';
import Amplify, { Hub, Logger } from 'aws-amplify';
import {
  createMuiTheme, responsiveFontSizes, ThemeProvider, Container, Typography,
} from '@material-ui/core';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { HubCapsule } from '@aws-amplify/core/lib-esm/Hub';
import { purple, orange } from '@material-ui/core/colors';
import SignIn from '../Authentication/Signin';
import Register from '../Authentication/Register';
import NavBar from '../NavBar/NavBar';
import './App.css';
import { User } from './types';

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
  const [user, setUser] = useState<User|null>(null);

  const listener = (data: HubCapsule) => {
    const { payload } = data;
    switch (payload.event) {
      case 'signIn': {
        logger.info('user signed in');
        const signedInUser: User = {
          cognitoUser: payload.data,
          name: payload?.data?.attributes?.name,
        };
        setUser(signedInUser);
        break; }
      case 'signUp':
        logger.info('user signed up');
        break;
      case 'signOut':
        logger.info('user signed out');
        setUser(null);
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

  Hub.listen('auth', listener);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <div className="full-size">
          <nav>
            <NavBar user={user} />
          </nav>
          <Switch>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/sign-in">
              <SignIn />
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
