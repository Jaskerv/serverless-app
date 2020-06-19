import React from 'react';
import { useFormik } from 'formik';
import { Auth, Logger } from 'aws-amplify';
import { Link } from 'react-router-dom';
import { SignInForm } from './types';

const logger = new Logger('Sign In');


const initialValues: SignInForm = {
  email: '',
  password: '',
};

const SignIn: React.FunctionComponent = () => {
  const formik = useFormik({
    initialValues,
    onSubmit: ({ email, password }) => {
      Auth.signIn(email, password)
        .then((signInResponse) => {
          logger.info('Successful', signInResponse);
        }).catch((error) => logger.error('Error', error));
    },
  });

  const { handleSubmit, values, handleChange } = formik;
  const { email, password } = values;

  return (
    <>
      <form
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          name="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          name="password"
          onChange={handleChange}
        />
        <button
          type="submit"
        >
          Sign In
        </button>
      </form>
      <Link to="/sign-up">Sign Up</Link>
    </>
  );
};

export default SignIn;
