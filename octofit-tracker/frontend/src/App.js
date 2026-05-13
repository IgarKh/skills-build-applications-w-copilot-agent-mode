import React from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  const navLinkClass = ({ isActive }) => `nav-link px-3 ${isActive ? 'active' : ''}`;

  return (
    <div className="app-shell min-vh-100">
      <header className="app-top py-4">
        <div className="container">
          <div className="card app-hero shadow-sm border-0">
            <div className="card-body px-4 py-4 d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3">
              <div className="d-flex align-items-start gap-3 app-brand-wrap">
                <img
                  src={`${process.env.PUBLIC_URL}/octofitapp-small.png`}
                  alt="OctoFit logo"
                  className="app-logo"
                />
                <div>
                  <h1 className="display-6 mb-2 fw-semibold">OctoFit Tracker</h1>
                  <p className="lead mb-0">Train together, track progress, and climb the leaderboard.</p>
                </div>
              </div>
              <a
                href="https://getbootstrap.com/docs/5.3/components/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-dark"
              >
                Bootstrap Components
              </a>
            </div>
          </div>
        </div>
      </header>

      <nav className="navbar navbar-expand-lg app-nav sticky-top">
        <div className="container">
          <span className="navbar-brand fw-semibold">Navigation</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#octofitNav"
            aria-controls="octofitNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="octofitNav">
            <ul className="navbar-nav nav-pills gap-1 me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className={navLinkClass} to="/activities">
                  Activities
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={navLinkClass} to="/leaderboard">
                  Leaderboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={navLinkClass} to="/teams">
                  Teams
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={navLinkClass} to="/users">
                  Users
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={navLinkClass} to="/workouts">
                  Workouts
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="py-4">
        <Routes>
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate to="/activities" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
