import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/slices/taskSlice';
import { fetchProjects } from '../store/slices/projectSlice';
import './Tasks.css';

const Tasks = () => {
  const { projectId } = useParams();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
  });

  const { tasks, isLoading, error } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  const project = projects.find(p => p._id === projectId);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasks(projectId));
      dispatch(fetchProjects());
    }
  }, [dispatch, projectId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTask({ ...formData, projectId }));
    setFormData({ title: '', description: '', assignedTo: '' });
    setShowCreateForm(false);
  };

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateTask({ id: taskId, taskData: { status: newStatus } }));
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId));
    }
  };


  if (!project) {
    return (
      <div className="tasks">
        <div className="loading">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="tasks">
      <div className="tasks-header">
        <div className="breadcrumb">
          <Link to="/projects">Projects</Link>
          <span>/</span>
          <Link to={`/projects/${project._id}`}>{project.title}</Link>
          <span>/</span>
          <span>Tasks</span>
        </div>
        <button
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <i className="fas fa-plus"></i>
          New Task
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form-container">
          <div className="create-form">
            <h3>Create New Task</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Task title"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Task description"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a team member</option>
                  {project.members?.map((member, index) => (
                    <option key={index} value={member.user._id}>
                      {member.user.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Create Task
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
        <div className="loading">Loading tasks...</div>
      ) : tasks.length > 0 ? (
        <div className="tasks-board">
          <div className="task-column">
            <h3>To Do</h3>
            <div className="task-list">
              {tasks.filter(task => task.status === 'todo').map((task) => (
                <div key={task._id} className="task-card">
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    <div className="task-actions">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="delete-btn"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <span className="task-assignee">
                      <i className="fas fa-user"></i>
                      {task.assignedTo?.name}
                    </span>
                    <span className="task-date">
                      <i className="fas fa-calendar"></i>
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="task-column">
            <h3>In Progress</h3>
            <div className="task-list">
              {tasks.filter(task => task.status === 'in-progress').map((task) => (
                <div key={task._id} className="task-card">
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    <div className="task-actions">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="delete-btn"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <span className="task-assignee">
                      <i className="fas fa-user"></i>
                      {task.assignedTo?.name}
                    </span>
                    <span className="task-date">
                      <i className="fas fa-calendar"></i>
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="task-column">
            <h3>Done</h3>
            <div className="task-list">
              {tasks.filter(task => task.status === 'done').map((task) => (
                <div key={task._id} className="task-card">
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    <div className="task-actions">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="delete-btn"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <span className="task-assignee">
                      <i className="fas fa-user"></i>
                      {task.assignedTo?.name}
                    </span>
                    <span className="task-date">
                      <i className="fas fa-calendar"></i>
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-tasks"></i>
          <h3>No tasks yet</h3>
          <p>Create your first task to get started</p>
          <button
            className="cta-btn"
            onClick={() => setShowCreateForm(true)}
          >
            Create Task
          </button>
        </div>
      )}
    </div>
  );
};

export default Tasks;
