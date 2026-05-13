import React, { useCallback, useEffect, useState } from 'react';

function formatDateForInput(dateValue) {
  return dateValue.toISOString().split('T')[0];
}

function Activities() {
  const endpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
    : 'http://localhost:8000/api/activities/';
  const teamsEndpoint = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
    : 'http://localhost:8000/api/teams/';

  const [activities, setActivities] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    distance: '',
    calories: '',
    date: formatDateForInput(new Date()),
    team_id: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [activitiesResponse, teamsResponse] = await Promise.all([
        fetch(endpoint),
        fetch(teamsEndpoint),
      ]);

      if (!activitiesResponse.ok) {
        throw new Error(`Activities request failed with status ${activitiesResponse.status}`);
      }

      if (!teamsResponse.ok) {
        throw new Error(`Teams request failed with status ${teamsResponse.status}`);
      }

      const activitiesData = await activitiesResponse.json();
      const teamsData = await teamsResponse.json();

      const normalizedActivities = Array.isArray(activitiesData)
        ? activitiesData
        : Array.isArray(activitiesData.results)
          ? activitiesData.results
          : [];

      const normalizedTeams = Array.isArray(teamsData)
        ? teamsData
        : Array.isArray(teamsData.results)
          ? teamsData.results
          : [];

      setActivities(normalizedActivities);
      setTeams(normalizedTeams);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError(err.message || 'Failed to fetch activities.');
    } finally {
      setLoading(false);
    }
  }, [endpoint, teamsEndpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSubmitError('');
  };

  const resetForm = () => {
    setFormData({
      type: '',
      duration: '',
      distance: '',
      calories: '',
      date: formatDateForInput(new Date()),
      team_id: '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setIsSaving(true);

    const payload = {
      type: formData.type.trim(),
      duration: Number(formData.duration),
      date: formData.date,
      distance: formData.distance === '' ? null : Number(formData.distance),
      calories: formData.calories === '' ? null : Number(formData.calories),
      team_id: formData.team_id === '' ? null : Number(formData.team_id),
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = `Failed to log activity (${response.status}).`;
        try {
          const details = await response.json();
          message = Object.values(details).flat().join(' ');
        } catch (parseError) {
          // Keep the default message when backend does not return JSON errors.
        }
        throw new Error(message);
      }

      handleModalClose();
      resetForm();
      await fetchData();
    } catch (err) {
      setSubmitError(err.message || 'Unable to log activity.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="container">
      <div className="card octo-card shadow-sm">
        <div className="card-header py-3">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
            <div>
              <h2 className="h3 mb-1 octo-title">Activities</h2>
              <p className="mb-0 octo-subtitle">Track and review recent workouts, runs, and sessions.</p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-outline-primary" onClick={fetchData}>
                Refresh
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
                Log Activity
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
                    <th scope="col">Type</th>
                    <th scope="col">Duration (min)</th>
                    <th scope="col">Distance (km)</th>
                    <th scope="col">Calories</th>
                    <th scope="col">Date</th>
                    <th scope="col">Team</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No activities available.
                      </td>
                    </tr>
                  ) : (
                    activities.map((activity, index) => (
                      <tr key={activity.id || activity.created_at || `activity-${index}`}>
                        <td>{activity.type || '-'}</td>
                        <td>{activity.duration ?? '-'}</td>
                        <td>{activity.distance ?? '-'}</td>
                        <td>{activity.calories ?? '-'}</td>
                        <td>{activity.date || '-'}</td>
                        <td>{activity.team?.name || '-'}</td>
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
                  <h3 className="modal-title h5 mb-0">Log Activity</h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleModalClose}
                  />
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {submitError && <p className="text-danger mb-3">{submitError}</p>}

                    <div className="mb-3">
                      <label htmlFor="activity-type" className="form-label">Activity Type</label>
                      <input
                        id="activity-type"
                        name="type"
                        type="text"
                        className="form-control"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="activity-duration" className="form-label">Duration (minutes)</label>
                      <input
                        id="activity-duration"
                        name="duration"
                        type="number"
                        className="form-control"
                        min="1"
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="activity-distance" className="form-label">Distance (km)</label>
                      <input
                        id="activity-distance"
                        name="distance"
                        type="number"
                        step="0.1"
                        min="0"
                        className="form-control"
                        value={formData.distance}
                        onChange={handleInputChange}
                        placeholder="Optional"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="activity-calories" className="form-label">Calories</label>
                      <input
                        id="activity-calories"
                        name="calories"
                        type="number"
                        min="0"
                        className="form-control"
                        value={formData.calories}
                        onChange={handleInputChange}
                        placeholder="Optional"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="activity-date" className="form-label">Date</label>
                      <input
                        id="activity-date"
                        name="date"
                        type="date"
                        className="form-control"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-0">
                      <label htmlFor="activity-team" className="form-label">Team</label>
                      <select
                        id="activity-team"
                        name="team_id"
                        className="form-select"
                        value={formData.team_id}
                        onChange={handleInputChange}
                      >
                        <option value="">No team</option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={handleModalClose}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save'}
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

export default Activities;
