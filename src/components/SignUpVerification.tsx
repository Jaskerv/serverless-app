import React, { ReactElement } from 'react';
import { useFormik } from 'formik';
import { Auth, Logger } from 'aws-amplify';

const logger = new Logger('Sign Up Verification');

interface Props {
  username: string;
}

interface VerificationCode{
  code: string;
}

const initialValues: VerificationCode = {
  code: '',
};

function SignUpVerification({ username }: Props): ReactElement {
  const formik = useFormik({
    initialValues,
    onSubmit: ({ code }) => {
      Auth.confirmSignUp(username, code)
        .then((verificationResponse) => {
          logger.info({ verificationResponse });
        }).catch((error) => logger.error(error));
    },
  });

  const { handleSubmit, handleChange, values: { code } } = formik;
  return (
    <div>
      <h3>Enter your verification code for</h3>
      <h3>{username}</h3>
      <form
        onSubmit={handleSubmit}
      >
        <input
          name="code"
          value={code}
          onChange={handleChange}
        />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}

export default SignUpVerification;
