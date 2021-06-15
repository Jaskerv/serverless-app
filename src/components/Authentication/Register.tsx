import React, { ReactElement, useState } from 'react';
import { useFormik } from 'formik';
import { Auth, Logger } from 'aws-amplify';
import {
  Container, Typography, makeStyles, TextField, Button, Divider, Fade,
} from '@material-ui/core';
import {
  object, string, date, ref,
} from 'yup';
import { Alert } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { ISignUpResult } from 'amazon-cognito-identity-js';
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
  passwordConfirm: string()
    .required('Confirm your password')
    .oneOf([ref('password')], 'Passwords must match'),
});

const logger = new Logger('Sign Up');

const initialValues: RegistrationForm = {
  name: 'John Doe',
  email: 'bagit36766@lege4h.com',
  birthdate: '01/01/1990',
  password: 'Password123!',
  passwordConfirm: 'Password123!',
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
  registerText: {
    marginTop: theme.spacing(2),
  },
}));

const InputProps = {
  shrink: true,
};

export default function Register():ReactElement {
  const classes = useStyles();
  const [userSignUp, setUserSignUp] = useState<ISignUpResult|null>(null);
  const [AWSError, setAWSError] = useState<Error|null>(null);
  const formik = useFormik({
    initialValues,
    validationSchema: RegistrationSchema,
    onSubmit: ({
      email, password, birthdate, name,
    }, { setSubmitting }) => {
      setAWSError(null);
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
      }).catch((error:Error) => {
        logger.error(error);
        setSubmitting(false);
        setAWSError(error);
      });
    },
  });

  const {
    values: {
      name, email, birthdate, password, passwordConfirm,
    }, handleSubmit, handleChange, submitForm, touched, errors, handleBlur, isSubmitting,
  } = formik;

  return (
    <Container
      maxWidth="sm"
      className={classes.container}
    >
      <Typography
        variant="h2"
        className={classes.header}
      >
        Register
      </Typography>
      <Divider
        className={classes.divider}
      />
      {!userSignUp && (
      <form
        onSubmit={handleSubmit}
        className={userSignUp ? classes.hidden : ''}
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
            InputLabelProps={InputProps}
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
            InputLabelProps={InputProps}
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
            InputLabelProps={InputProps}
            error={Boolean(errors.password && touched.password)}
            helperText={errors.password && touched.password ? errors.password : PasswordHint}
            disabled={isSubmitting}
          />
          <TextField
            value={passwordConfirm}
            name="passwordConfirm"
            onChange={handleChange}
            onBlur={handleBlur}
            required
            type="password"
            fullWidth
            label="Confirm Password"
            placeholder=""
            InputLabelProps={InputProps}
            error={Boolean(errors.passwordConfirm && touched.passwordConfirm)}
            helperText={errors.passwordConfirm && touched.passwordConfirm ? errors.passwordConfirm : ' '}
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
          <Typography
            variant="subtitle2"
            color="textSecondary"
            className={classes.registerText}
          >
            {'Already have an account? Click here to '}
            <Link to="/sign-in">
              sign in
            </Link>
          </Typography>
        </Container>
      </form>
      )}
      {userSignUp && <SignUpVerification username={userSignUp.user.getUsername()} />}
    </Container>
  );
}
