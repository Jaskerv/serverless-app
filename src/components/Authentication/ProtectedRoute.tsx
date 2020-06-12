import React, { ReactElement, ReactNode } from 'react';
import { Route, Redirect } from 'react-router-dom';

interface Props {
  children: ReactNode;
  isAuthenticated: boolean;
}

export default function ProtectedRoute({ children, isAuthenticated }: Props): ReactElement {
  return (
    <Route
      render={({ location }) => (isAuthenticated ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: location },
          }}
        />
      ))}
    />
  );
}
