import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchProjects } from '../store/slices/projectSlice';
import Chat from '../components/Chat';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const { projects } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const project = projects.find(p => p._id === id);

  if (!project) {
    return (
      <div className="project-details">
        <div className="loading">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="project-details">
      <div className="project-header">
        <div className="breadcrumb">
          <Link to="/projects">Projects</Link>
          <span>/</span>
          <span>{project.title}</span>
        </div>
        <div className="project-actions">
          <Link to={`/tasks/${project._id}`} className="action-btn">
            <i className="fas fa-tasks"></i>
            View Tasks
          </Link>
        </div>
      </div>

      <div className="project-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-info-circle"></i>
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <i className="fas fa-comments"></i>
          Chat
        </button>
      </div>

      <div className="project-content">
        {activeTab === 'overview' ? (
          <>
            <div className="project-info">
              <h1>{project.title}</h1>
              <p className="project-description">{project.description}</p>
              
              <div className="project-meta">
                <div className="meta-card">
                  <h3>Project Details</h3>
                  <div className="meta-item">
                    <i className="fas fa-calendar"></i>
                    <div>
                      <strong>Deadline:</strong>
                      <span>{new Date(project.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-user"></i>
                    <div>
                      <strong>Created by:</strong>
                      <span>{project.createdBy?.name}</span>
                    </div>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-clock"></i>
                    <div>
                      <strong>Created:</strong>
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="members-card">
                  <h3>Team Members</h3>
                  <div className="members-list">
                    {project.members?.map((member, index) => (
                      <div key={index} className="member-item">
                        <div className="member-avatar">
                          <i className="fas fa-user"></i>
                        </div>
                        <div className="member-info">
                          <span className="member-name">{member.user?.name}</span>
                          <span className={`member-role ${member.role}`}>
                            {member.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="project-sidebar">
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <Link to={`/tasks/${project._id}`} className="quick-action">
                  <i className="fas fa-tasks"></i>
                  Manage Tasks
                </Link>
                <button className="quick-action">
                  <i className="fas fa-user-plus"></i>
                  Add Member
                </button>
                <button className="quick-action">
                  <i className="fas fa-edit"></i>
                  Edit Project
                </button>
              </div>

              <div className="project-stats">
                <h3>Project Stats</h3>
                <div className="stat-item">
                  <span>Total Members:</span>
                  <span>{project.members?.length || 0}</span>
                </div>
                <div className="stat-item">
                  <span>Days Remaining:</span>
                  <span>
                    {Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24))}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="chat-section">
            <Chat projectId={project._id} projectName={project.title} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
