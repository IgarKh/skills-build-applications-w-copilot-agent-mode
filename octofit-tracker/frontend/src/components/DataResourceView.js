import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { buildApiEndpoint } from '../apiConfig';

function formatColumnTitle(columnName) {
  return columnName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatCellValue(value) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-muted">-</span>;
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function DataResourceView({ title, resource, description, addLabel, endpoint: endpointOverride }) {
  const endpoint = endpointOverride || buildApiEndpoint(resource);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    notes: '',
  });

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
          ? data.results
          : [];

      setRecords(normalized);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError(err.message || `Failed to fetch ${resource}.`);
    } finally {
      setLoading(false);
    }
  }, [endpoint, resource]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const columns = useMemo(() => {
    const fallbackColumns = ['id', 'name', 'notes'];
    if (!records.length) {
      return fallbackColumns;
    }

    const preferred = ['id', 'name', 'team', 'score', 'activity_type', 'duration', 'date'];
    const discovered = Array.from(
      new Set(records.flatMap((item) => Object.keys(item || {})))
    );

    const ordered = [
      ...preferred.filter((key) => discovered.includes(key)),
      ...discovered.filter((key) => !preferred.includes(key)),
    ];

    return ordered.slice(0, 6);
  }, [records]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowModal(false);
    setFormData({ name: '', notes: '' });
  };

  return (
    <section className="container">
      <div className="card octo-card shadow-sm">
        <div className="card-header py-3">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
            <div>
              <h2 className="h3 mb-1 octo-title">{title}</h2>
              <p className="mb-0 octo-subtitle">{description}</p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-outline-primary" onClick={fetchRecords}>
                Refresh
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
                {addLabel}
              </button>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="px-3 pt-3 pb-2 d-flex flex-column flex-md-row justify-content-between gap-2 octo-meta">
            <span>
              API:{' '}
              <a className="link-primary link-offset-2" href={endpoint} target="_blank" rel="noreferrer">
                Open endpoint
              </a>
            </span>
            <span>Last updated: {lastUpdated || 'Not loaded yet'}</span>
          </div>

          {loading && <p className="m-3">Loading data...</p>}
          {!loading && error && <p className="m-3 text-danger">{error}</p>}

          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle octo-table">
                <thead className="table-dark">
                  <tr>
                    {columns.map((column) => (
                      <th scope="col" key={column}>
                        {formatColumnTitle(column)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="text-center text-muted py-4">
                        No records available.
                      </td>
                    </tr>
                  ) : (
                    records.map((record, index) => (
                      <tr key={record.id || `${resource}-${index}`}>
                        {columns.map((column) => (
                          <td key={`${record.id || index}-${column}`} className="octo-value">
                            {formatCellValue(record[column])}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal fade show d-block octo-modal" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">{addLabel}</h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleModalClose}
                  />
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor={`${resource}-name`} className="form-label">
                        Name
                      </label>
                      <input
                        id={`${resource}-name`}
                        name="name"
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor={`${resource}-notes`} className="form-label">
                        Notes
                      </label>
                      <textarea
                        id={`${resource}-notes`}
                        name="notes"
                        className="form-control"
                        rows="3"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Capture quick details"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={handleModalClose}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={handleModalClose} />
        </>
      )}
    </section>
  );
}

export default DataResourceView;
