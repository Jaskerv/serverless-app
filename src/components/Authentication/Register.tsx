import React, { ReactElement, useState } from 'react';
import { useFormik } from 'formik';
import { Auth, Logger } from 'aws-amplify';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import {
  Container, Typography, makeStyles, TextField, Button, Divider,
} from '@material-ui/core';
import { object, string, date } from 'yup';
import SignUpVerification from './RegistrationVerification/RegistrationVerification';
import { RegistrationForm } from './types';

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
    .min(8, 'Too Short!')
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
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(5),
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
}));

export default function Register():ReactElement {
  const classes = useStyles();
  const [userSignUp, setUserSignUp] = useState<ISignUpResult|null>(null);
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
      })
        .catch((error) => logger.error(error));
    },
  });

  const {
    values: {
      name, email, birthdate, password,
    }, handleSubmit, handleChange, submitForm, touched, errors, handleBlur,
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
      <form
        onSubmit={handleSubmit}
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
            placeholder="John Doe"
            error={Boolean(errors.name && touched.name)}
            helperText={errors.name && touched.name ? errors.name : ' '}
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
            placeholder="JohnDoe@example.com"
            error={Boolean(errors.email && touched.email)}
            helperText={errors.email && touched.email ? errors.email : ' '}
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
            placeholder="Minimum 8 characters"
            InputLabelProps={{
              shrink: true,
            }}
            error={Boolean(errors.password && touched.password)}
            helperText={errors.password && touched.password ? errors.password : ' '}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.button}
          >
            Register
          </Button>
        </Container>
      </form>
      {userSignUp && <SignUpVerification username={userSignUp.user.getUsername()} />}
    </Container>
  );
}
