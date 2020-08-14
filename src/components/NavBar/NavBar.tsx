import React, { ReactElement } from 'react';
import {
  makeStyles, Typography, Container, Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Logger, Auth } from 'aws-amplify';
import { INavBarProps } from './types';

const logger = new Logger('NavBar');

const useStyles = makeStyles((theme) => ({
  logo: {
    background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: 'Archivo Black, Roboto',
    textDecoration: 'none',
  },
  navBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    alignItems: 'center',
  },
  navActionContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  navButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.primary.dark,
    },
  },
}));

async function signOut() {
  try {
    await Auth.signOut();
  } catch (error) {
    logger.error(error);
  }
}

export default function NavBar({ user, userLoading }:INavBarProps): ReactElement {
  const classes = useStyles();
  return (
    <Container
      className={classes.navBar}
      maxWidth="xl"
    >
      <Typography
        variant="h3"
        className={classes.logo}
        component={Link}
        to="/"
      >
        JYan
      </Typography>
      <div className={`flex-1 ${classes.navActionContainer}`}>
        <div className={`flex-container ${classes.navButtonContainer}`}>
          {!user && (
          <>
            <Button
              className={classes.button}
              disableRipple
              component={Link}
              to="/sign-in"
            >
              Sign In
            </Button>
            <Button
              className={classes.button}
              disableRipple
              component={Link}
              to="/register"
            >
              Register
            </Button>
          </>
          )}
          {user && (
            <>
              <Typography>
                {user.attributes.name }
              </Typography>
              <Button
                className={classes.button}
                disableRipple
                onClick={signOut}
              >
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
