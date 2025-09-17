import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../store/slices/projectSlice';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { projects, isLoading } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const recentProjects = projects.slice(0, 3);
  const totalProjects = projects.length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Here's what's happening with your projects</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-folder"></i>
          </div>
          <div className="stat-content">
            <h3>{totalProjects}</h3>
            <p>Total Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-content">
            <h3>0</h3>
            <p>Active Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <h3>0</h3>
            <p>Team Members</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-projects">
          <div className="section-header">
            <h2>Recent Projects</h2>
            <Link to="/projects" className="view-all-btn">
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="loading">Loading projects...</div>
          ) : recentProjects.length > 0 ? (
            <div className="project-grid">
              {recentProjects.map((project) => (
                <div key={project._id} className="project-card">
                  <div className="project-header">
                    <h3>{project.title}</h3>
                    <span className={`status-badge ${project.status || 'active'}`}>
                      {project.status || 'Active'}
                    </span>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-meta">
                    <span className="project-deadline">
                      <i className="fas fa-calendar"></i>
                      {new Date(project.deadline).toLocaleDateString()}
                    </span>
                    <span className="project-members">
                      <i className="fas fa-users"></i>
                      {project.members?.length || 0} members
                    </span>
                  </div>
                  <Link to={`/projects/${project._id}`} className="project-link">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-folder-open"></i>
              <h3>No projects yet</h3>
              <p>Create your first project to get started</p>
              <Link to="/projects" className="cta-btn">
                Create Project
              </Link>
            </div>
          )}
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/projects" className="action-btn">
              <i className="fas fa-plus"></i>
              New Project
            </Link>
            <Link to="/projects" className="action-btn">
              <i className="fas fa-search"></i>
              Browse Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
