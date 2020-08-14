import React, { ReactElement, useState } from 'react';
import { useFormik } from 'formik';
import { Auth, Logger } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import {
  Typography, TextField, Button, Container, makeStyles, Fade, FormHelperText,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { string, object } from 'yup';
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

const validationSchema = object().shape({
  code: string()
    .required('Required')
    .min(6, 'Invalid verification code')
    .max(6, 'Invalid verification code'),
});

function RegistrationVerification({ username }: IProps): ReactElement {
  const history = useHistory();
  const classes = useStyles();
  const [AWSError, setAWSError] = useState<Error|null>(null);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: ({ code }, { setSubmitting }) => {
      setAWSError(null);
      Auth.confirmSignUp(username, code)
        .then((verificationResponse) => {
          logger.info({ verificationResponse });
          history.push('/');
        }).catch((error: Error) => {
          logger.error(error);
          setSubmitting(false);
          setAWSError(error);
        });
    },
  });

  const {
    values: { code },
    isSubmitting, handleSubmit, handleChange, errors, touched, handleBlur, submitForm,
  } = formik;
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
            {username}
          </Typography>
          <TextField
            name="code"
            value={code}
            onChange={handleChange}
            label="Verification Code"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            onBlur={handleBlur}
            error={Boolean(errors.code) && touched.code}
            helperText={Boolean(errors.code) && touched.code ? errors.code : ' '}
            disabled={isSubmitting}
          />
          <FormHelperText>
            Check your registered email for the verification code
          </FormHelperText>
          <Button
            fullWidth
            variant="contained"
            className={classes.button}
            disabled={isSubmitting}
            onClick={submitForm}
          >
            Verify
          </Button>
        </form>
      </Container>
    </Container>
  );
}

export default RegistrationVerification;
