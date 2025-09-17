import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProjects, createProject, deleteProject } from '../store/slices/projectSlice';
import './Projects.css';

const Projects = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  const { projects, isLoading, error } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createProject(formData));
    setFormData({ title: '', description: '', deadline: '' });
    setShowCreateForm(false);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(projectId));
    }
  };

  return (
    <div className="projects">
      <div className="projects-header">
        <h1>Projects</h1>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <i className="fas fa-plus"></i>
          New Project
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form-container">
          <div className="create-form">
            <h3>Create New Project</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Project title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Project description"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Create Project
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading projects...</div>
      ) : projects.length > 0 ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <div className="project-header">
                <h3>{project.title}</h3>
                <div className="project-actions">
                  <Link to={`/projects/${project._id}`} className="action-link">
                    <i className="fas fa-eye"></i>
                  </Link>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="action-link delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-meta">
                <div className="meta-item">
                  <i className="fas fa-calendar"></i>
                  <span>{new Date(project.deadline).toLocaleDateString()}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-users"></i>
                  <span>{project.members?.length || 0} members</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-user"></i>
                  <span>{project.createdBy?.name}</span>
                </div>
              </div>
              <div className="project-footer">
                <Link to={`/projects/${project._id}`} className="view-btn">
                  View Details
                </Link>
                <Link to={`/tasks/${project._id}`} className="tasks-btn">
                  View Tasks
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-folder-open"></i>
          <h3>No projects found</h3>
          <p>Create your first project to get started</p>
          <button
            className="cta-btn"
            onClick={() => setShowCreateForm(true)}
          >
            Create Project
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;
