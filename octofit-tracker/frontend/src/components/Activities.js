import React from 'react';
import DataResourceView from './DataResourceView';

function Activities() {
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';

  return (
    <DataResourceView
      title="Activities"
      resource="activities"
      endpoint={endpoint}
      description="Track and review recent workouts, runs, and sessions."
      addLabel="Log Activity"
    />
  );
}

export default Activities;
