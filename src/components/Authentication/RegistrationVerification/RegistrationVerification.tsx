import React, { ReactElement, useState } from 'react';
import { useFormik } from 'formik';
import { Auth, Logger } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import {
  Typography, TextField, Button, Container, makeStyles, Fade,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { VerificationCode, IProps } from './types';

const logger = new Logger('Sign Up Verification');

const initialValues: VerificationCode = {
  code: '',
};

const useStyles = makeStyles((theme) => ({
  formContainer: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
    '& > :last-child': {
      marginBottom: 0,
    },
  },
  alert: {
    marginBottom: theme.spacing(3),
  },
  button: {
    backgroundImage: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, #4e4376 51%, #2b5876 100%)`,
    color: theme.palette.background.default,
  },
}));

function RegistrationVerification({ username }: IProps): ReactElement {
  const history = useHistory();
  const classes = useStyles();
  const [AWSError, setAWSError] = useState<Error|null>(null);
  const formik = useFormik({
    initialValues,
    onSubmit: ({ code }) => {
      Auth.confirmSignUp(username, code)
        .then((verificationResponse) => {
          logger.info({ verificationResponse });
          history.push('/');
        }).catch((error: Error) => {
          logger.error(error);
          setAWSError(error);
        });
    },
  });

  const { handleSubmit, handleChange, values: { code } } = formik;
  return (
    <Container
      maxWidth="sm"
    >
      <Fade
        in={Boolean(AWSError)}
      >
        <Alert
          className={classes.alert}
          severity="error"
        >
          {AWSError?.message}
        </Alert>
      </Fade>
      <Container
        maxWidth="xs"
      >
        <form
          onSubmit={handleSubmit}
          className={classes.formContainer}
        >
          <Typography
            color="textSecondary"
          >
            Enter your verification code for
          </Typography>
          <Typography
            variant="h4"
          >
            {/* {username} */}
            Asdasdasdasd
          </Typography>
          <TextField
            name="code"
            value={code}
            onChange={handleChange}
            label="Code"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            helperText="Check your registered email for the verification code"
          />
          <Button
            fullWidth
            variant="contained"
            className={classes.button}
          >
            Verify
          </Button>
        </form>
      </Container>
    </Container>
  );
}

export default RegistrationVerification;
