import React, { ReactElement, useState } from 'react';
import { useFormik } from 'formik';
import { Auth, Logger } from 'aws-amplify';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import SignUpVerification from './RegistrationVerification/RegistrationVerification';
import { RegistrationForm } from './types';

const logger = new Logger('Sign Up');


const initialValues: RegistrationForm = {
  name: '',
  email: '',
  birthdate: '',
  password: '',
};

export default function Register():ReactElement {
  const [userSignUp, setUserSignUp] = useState<ISignUpResult|null>(null);
  const formik = useFormik({
    initialValues,
    onSubmit: ({
      email, password, birthdate, name,
    }) => {
      Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          birthdate,
          name,
        },
      }).then((signUpResponse) => {
        setUserSignUp(signUpResponse);
        logger.info({ signUpResponse });
      })
        .catch((error) => logger.error(error));
    },
  });

  const {
    values: {
      name, email, birthdate, password,
    }, handleSubmit, handleChange,
  } = formik;

  return (
    <>
      <form
        onSubmit={handleSubmit}
      >
        <input
          placeholder="Name"
          value={name}
          name="name"
          onChange={handleChange}
          required
        />
        <input
          placeholder="email"
          type="email"
          value={email}
          name="email"
          onChange={handleChange}
          required
        />
        <input
          placeholder="Birth date"
          value={birthdate}
          name="birthdate"
          onChange={handleChange}
          required
          type="date"
        />
        <input
          placeholder="password"
          value={password}
          name="password"
          onChange={handleChange}
          required
          type="password"
        />
        <button type="submit">Sign Up</button>
      </form>
      {userSignUp && <SignUpVerification username={userSignUp.user.getUsername()} />}
    </>
  );
}