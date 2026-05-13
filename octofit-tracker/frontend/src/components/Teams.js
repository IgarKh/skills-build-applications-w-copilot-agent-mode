import React from 'react';
import DataResourceView from './DataResourceView';

function Teams() {
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  return (
    <DataResourceView
      title="Teams"
      resource="teams"
      endpoint={endpoint}
      description="Manage team rosters and monitor collective performance."
      addLabel="Create Team"
    />
  );
}

export default Teams;
