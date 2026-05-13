import React from 'react';
import DataResourceView from './DataResourceView';

function Leaderboard() {
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
    : 'http://localhost:8000/api/leaderboard/';

  return (
    <DataResourceView
      title="Leaderboard"
      resource="leaderboard"
      endpoint={endpoint}
      description="See top performers and compare progress across members."
      addLabel="Add Score Entry"
    />
  );
}

export default Leaderboard;
