import React, { ReactElement } from 'react';

interface Props {

}

export default function NavBar(): ReactElement {
  return (
    <div className="nav-bar">
      <div className="flex-1 flex-container" />
      <div className="flex-1 flex-container">
        <p>
          Welcome
        </p>
      </div>
      <div className="flex-1 flex-container">
        <button
          type="button"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
