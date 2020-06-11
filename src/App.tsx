import React, { useState } from 'react';
import Amplify, { Hub, Logger } from 'aws-amplify';
import SignIn from './components/Signin';
import SignUp from './components/SignUp.jsx';

Amplify.Logger.LOG_LEVEL = 'VERBOSE';

const logger = new Logger('App');

function App() {
  const [user, setUser] = useState();
  const listener = (data) => {
    switch (data.payload.event) {
      case 'signIn':
        logger.info('user signed in'); // [ERROR] My-Logger - user signed in
        break;
      case 'signUp':
        logger.info('user signed up');
        break;
      case 'signOut':
        logger.info('user signed out');
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
    <div>
      <SignIn />
      <SignUp />
    </div>
  );
}

export default App;
