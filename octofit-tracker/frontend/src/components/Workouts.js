import React from 'react';
import DataResourceView from './DataResourceView';

function Workouts() {
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
    : 'http://localhost:8000/api/workouts/';

  return (
    <DataResourceView
      title="Workouts"
      resource="workouts"
      endpoint={endpoint}
      description="Review workout plans, durations, and intensity levels."
      addLabel="Create Workout"
    />
  );
}

export default Workouts;
