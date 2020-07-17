import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Auth, Logger } from 'aws-amplify';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Divider, makeStyles, TextField, Fade, Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { object, string } from 'yup';
import { SignInForm } from './types';

const logger = new Logger('Sign In');

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

const initialValues: SignInForm = {
  email: '',
  password: '',
};

const InputProps = {
  shrink: true,
};

const LoginSchema = object().shape({
  email: string()
    .email('Invalid email')
    .required('Required'),
  password: string()
    .required('Required'),
});

const SignIn: React.FunctionComponent = () => {
  const classes = useStyles();
  const [AWSError, setAWSError] = useState<Error|null>(null);
  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: ({ email, password }, { setSubmitting }) => {
      Auth.signIn(email, password)
        .then((signInResponse) => {
          logger.info('Successful', signInResponse);
        })
        .catch((error: Error) => {
          logger.error('Error', error);
          setAWSError(error);
        })
        .finally(() => setSubmitting(false));
    },
  });

  const {
    values: { email, password },
    handleSubmit,
    handleChange,
    submitForm,
    isSubmitting,
    errors,
    touched,
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
        Sign In
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
          {AWSError?.message}
        </Alert>
      </Fade>
      <form
        onSubmit={handleSubmit}
      >
        <Container
          maxWidth="xs"
          className={classes.formContainer}
        >
          <TextField
            type="email"
            label="Email"
            required
            value={email}
            name="email"
            onChange={handleChange}
            fullWidth
            InputLabelProps={InputProps}
            error={Boolean(errors.email && touched.email)}
            helperText={errors.email && touched.email ? errors.email : ' '}
          />
          <TextField
            type="password"
            label="Password"
            required
            value={password}
            name="password"
            onChange={handleChange}
            fullWidth
            InputLabelProps={InputProps}
            error={Boolean(errors.password && touched.password)}
            helperText={errors.password && touched.password ? errors.password : ' '}
          />
          <Button
            onClick={submitForm}
            fullWidth
            variant="contained"
            className={classes.button}
            disabled={isSubmitting}
            type="submit"
            formNoValidate
          >
            Sign In
          </Button>
        </Container>
      </form>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        className={classes.registerText}
      >
        {'Don\'t have an account? Click here to '}
        <Link to="/register">
          register
        </Link>
      </Typography>
    </Container>
  );
};

export default SignIn;
