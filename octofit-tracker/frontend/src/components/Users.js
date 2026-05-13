import React from 'react';
import DataResourceView from './DataResourceView';

function Users() {
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
    : 'http://localhost:8000/api/users/';

  return (
    <DataResourceView
      title="Users"
      resource="users"
      endpoint={endpoint}
      description="Browse members, profile details, and engagement stats."
      addLabel="Add User"
    />
  );
}

export default Users;
