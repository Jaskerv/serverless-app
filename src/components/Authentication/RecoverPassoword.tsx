import React, { ReactElement, useState } from 'react';
import {
  TextField, Fade, Container, Typography, makeStyles, Divider, Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { Logger, Auth } from 'aws-amplify';

const logger = new Logger('Recover Password');

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
  quote: {
    marginBottom: theme.spacing(6),
  },
}));

const InputProps = {
  shrink: true,
};

const validationSchema = object().shape(
  {
    email: string()
      .email('Invalid email')
      .required('Required'),
  },
);

export default function RecoverPassoword(): ReactElement {
  const classes = useStyles();
  const [AWSError, setAWSError] = useState<Error|null>(null);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: ({ email }, { setSubmitting }) => {
      Auth.forgotPassword(email)
        .then((data) => logger.info('Successful', data))
        .catch((error:Error) => {
          logger.error(error);
          setAWSError(error);
        })
        .finally(() => setSubmitting(false));
    },
  });

  const {
    values, errors, touched, submitForm, isSubmitting, handleBlur, handleChange,
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
        Reset Password
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
      <form>
        <Container
          maxWidth="xs"
          className={classes.formContainer}
        >
          <Typography
            variant="h6"
            color="textSecondary"
            className={classes.quote}
          >
            Don’t worry, it happens to the best of us.
          </Typography>
          <TextField
            label="Email"
            fullWidth
            InputLabelProps={InputProps}
            disabled={isSubmitting}
            error={Boolean(errors.email && touched.email)}
            helperText={errors.email && touched.email ? errors.email : ' '}
            value={values.email}
            name="email"
            onBlur={handleBlur}
            onChange={handleChange}
            type="email"
            autoComplete="email"
          />
          <Button
            onClick={submitForm}
            fullWidth
            variant="contained"
            className={classes.button}
            disabled={isSubmitting}
          >
            Reset
          </Button>
        </Container>
      </form>
    </Container>
  );
}
