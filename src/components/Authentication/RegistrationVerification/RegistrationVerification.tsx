import React, { ReactElement } from 'react';
import { useFormik } from 'formik';
import { Auth, Logger } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import { VerificationCode, IProps } from './types';

const logger = new Logger('Sign Up Verification');


const initialValues: VerificationCode = {
  code: '',
};

function RegistrationVerification({ username }: IProps): ReactElement {
  const history = useHistory();
  const formik = useFormik({
    initialValues,
    onSubmit: ({ code }) => {
      Auth.confirmSignUp(username, code)
        .then((verificationResponse) => {
          logger.info({ verificationResponse });
          history.push('/');
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

export default RegistrationVerification;
