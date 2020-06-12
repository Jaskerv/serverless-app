import React, { useState } from 'react';
import Amplify, { Hub, Logger } from 'aws-amplify';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import SignIn from './components/Authentication/Signin';
import SignUp from './components/Authentication/SignUp';
import NavBar from './components/Authentication/NavBar';
import './App.css';

Amplify.Logger.LOG_LEVEL = 'INFO';

const logger = new Logger('App');

interface User {
  cognitoUser: CognitoUser;
  name: string;
}
function App() {
  const [user, setUser] = useState<User|null>();

  const listener = ({ payload }) => {
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
      <div className="full-size">
        <nav>
          <NavBar />
        </nav>
        <Switch>
          <Route path="/sign-up">
            <SignUp />
          </Route>
          <Route path="/">
            <SignIn />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
