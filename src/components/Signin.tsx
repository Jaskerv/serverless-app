import React from 'react';
import { useFormik } from 'formik';
import { Auth } from 'aws-amplify';
import { Link } from 'react-router-dom';

interface ISignInProps {
}

interface SignIn {
  email: string;
  password: string;
}

const initialValues: SignIn = {
  email: '',
  password: '',
};

const SignIn: React.FunctionComponent<ISignInProps> = (props) => {
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
    },
  });

  const { handleSubmit, values, handleChange } = formik;
  const { email, password } = values;

  return (
    <div>
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
      <li>
        <Link to="/sign-up">Sign Up</Link>
      </li>
    </div>
  );
};

export default SignIn;
