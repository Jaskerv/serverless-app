import React, { ReactElement, useState } from 'react';
import { useFormik } from 'formik';
import { Auth, Logger } from 'aws-amplify';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import {
  Container, Typography, makeStyles, TextField, Button, Divider, Fade,
} from '@material-ui/core';
import { object, string, date } from 'yup';
import { Alert } from '@material-ui/lab';
import SignUpVerification from './RegistrationVerification/RegistrationVerification';
import { RegistrationForm } from './types';

const PasswordHint = 'Must contain upper cased, lower cased, special and numeric characters';

const RegistrationSchema = object().shape({
  name: string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  birthdate: date()
    .max(new Date(), 'Select Your Real Birthdate!')
    .required('Required'),
  email: string()
    .email('Invalid email')
    .required('Required'),
  password: string()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, PasswordHint)
    .required('Required'),
});

const logger = new Logger('Sign Up');

const initialValues: RegistrationForm = {
  name: '',
  email: '',
  birthdate: '',
  password: '',
};

const useStyles = makeStyles((theme) => ({
  header: {
    background: `linear-gradient(${theme.palette.grey[400]}, ${theme.palette.primary.light})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginTop: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  container: {
    textAlign: 'center',
  },
  formContainer: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
    '& > :last-child': {
      marginBottom: 0,
    },
  },
  button: {
    backgroundImage: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, #4e4376 51%, #2b5876 100%)`,
    color: theme.palette.background.default,
  },
  alert: {
    marginBottom: theme.spacing(3),
  },
  hidden: {
    display: 'none',
  },
}));

export default function Register():ReactElement {
  const classes = useStyles();
  const [userSignUp, setUserSignUp] = useState<ISignUpResult|null>(null);
  const [AWSError, setAWSError] = useState<String|null>(null);
  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
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
      }).catch((error) => {
        setAWSError(error);
        logger.error(error);
      });
    },
  });

  const {
    values: {
      name, email, birthdate, password,
    }, handleSubmit, handleChange, submitForm, touched, errors, handleBlur, isSubmitting,
  } = formik;

  return (
    <Container
      maxWidth="sm"
      className={classes.container}
    >
      <Typography
        color="primary"
        variant="h2"
        className={classes.header}
      >
        Register
      </Typography>
      <Divider
        className={classes.divider}
      />
      <Fade
        in={Boolean(AWSError)}
      >
        <Alert
          className={classes.alert}
          severity="error"
        >
          {AWSError}
        </Alert>
      </Fade>
      <Fade in={!userSignUp}>
        <form
          onSubmit={handleSubmit}
          className={userSignUp ? classes.hidden : ''}
        >
          <Container
            maxWidth="xs"
            className={classes.formContainer}
          >
            <TextField
              value={name}
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              required
              fullWidth
              label="Name"
              InputLabelProps={{
                shrink: true,
              }}
              error={Boolean(errors.name && touched.name)}
              helperText={errors.name && touched.name ? errors.name : ' '}
              disabled={isSubmitting}
            />
            <TextField
              value={birthdate}
              name="birthdate"
              onChange={handleChange}
              onBlur={handleBlur}
              required
              type="date"
              fullWidth
              label="Birth Date"
              InputLabelProps={{
                shrink: true,
              }}
              error={Boolean(errors.birthdate && touched.birthdate)}
              helperText={errors.birthdate && touched.birthdate ? errors.birthdate : ' '}
              disabled={isSubmitting}
            />
            <TextField
              type="email"
              value={email}
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              required
              fullWidth
              label="Email"
              InputLabelProps={{
                shrink: true,
              }}
              error={Boolean(errors.email && touched.email)}
              helperText={errors.email && touched.email ? errors.email : ' '}
              disabled={isSubmitting}
            />
            <TextField
              value={password}
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              required
              type="password"
              fullWidth
              label="Password"
              placeholder=""
              InputLabelProps={{
                shrink: true,
              }}
              error={Boolean(errors.password && touched.password)}
              helperText={errors.password && touched.password ? errors.password : PasswordHint}
              disabled={isSubmitting}
            />
            <Button
              onClick={submitForm}
              fullWidth
              variant="contained"
              className={classes.button}
              disabled={isSubmitting}
            >
              Register
            </Button>
          </Container>
        </form>
      </Fade>
      <Fade in={Boolean(userSignUp)}>
        <div
          className={!userSignUp ? classes.hidden : ''}
        >
          <SignUpVerification username={userSignUp!.user?.getUsername()} />
        </div>
      </Fade>
    </Container>
  );
}
