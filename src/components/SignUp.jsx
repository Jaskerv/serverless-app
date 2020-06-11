import React, { ReactElement, useState } from 'react';
import { useFormik } from 'formik';
import { Auth, Logger } from 'aws-amplify';
import SignUpVerification from './SignUpVerification';

const logger = new Logger('Sign Up');

// interface SignUp {
//   name: string;
//   email: string;
//   birthdate: string
//   password: string;
// }

const initialValues = {
  name: '',
  email: '',
  birthdate: '',
  password: '',
};

function SignUp() {
  const [userSignUp, setUserSignUp] = useState(null);
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
      {userSignUp && <SignUpVerification username={userSignUp.user.username} />}
    </>
  );
}

export default SignUp;
