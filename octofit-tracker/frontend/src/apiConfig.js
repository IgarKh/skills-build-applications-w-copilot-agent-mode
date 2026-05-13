const codespaceName = process.env.REACT_APP_CODESPACE_NAME;

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';

export function buildApiEndpoint(resource) {
  return `${API_BASE_URL}/${resource}/`;
}
