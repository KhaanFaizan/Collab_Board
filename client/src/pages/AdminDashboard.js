import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchAdminDashboard, 
  fetchUsers, 
  updateUserRole, 
  deleteUser,
  fetchAdminProjects,
  fetchAdminTasks,
  updateAdminProject,
  updateAdminTask,
  deleteAdminProject,
  deleteAdminTask
} from '../store/slices/adminSlice';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { dashboard, users, projects, tasks, pagination, projectsPagination, tasksPagination, isLoading, error } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Projects state
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState('');
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  
  // Tasks state
  const [taskSearchTerm, setTaskSearchTerm] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('');
  const [currentTaskPage, setCurrentTaskPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  
  // Active tab
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(fetchUsers({ page: currentPage, search: searchTerm }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dispatch, currentPage, searchTerm]);

  // Projects effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(fetchAdminProjects({ 
        page: currentProjectPage, 
        search: projectSearchTerm,
        status: projectStatusFilter 
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dispatch, currentProjectPage, projectSearchTerm, projectStatusFilter]);

  // Tasks effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(fetchAdminTasks({ 
        page: currentTaskPage, 
        search: taskSearchTerm,
        status: taskStatusFilter 
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dispatch, currentTaskPage, taskSearchTerm, taskStatusFilter]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleRoleChange = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmRoleChange = async () => {
    if (selectedUser) {
      const newRole = selectedUser.role === 'admin' ? 'member' : 'admin';
      try {
        await dispatch(updateUserRole({ userId: selectedUser._id, role: newRole }));
        setShowRoleModal(false);
        setSelectedUser(null);
        // Refresh the user list
        dispatch(fetchUsers({ page: currentPage, search: searchTerm }));
      } catch (error) {
        console.error('Failed to update user role:', error);
      }
    }
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await dispatch(deleteUser(selectedUser._id));
        setShowDeleteModal(false);
        setSelectedUser(null);
        // Refresh the user list
        dispatch(fetchUsers({ page: currentPage, search: searchTerm }));
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Project handlers
  const handleProjectSearch = useCallback((e) => {
    setProjectSearchTerm(e.target.value);
    setCurrentProjectPage(1);
  }, []);

  const handleProjectStatusFilter = useCallback((e) => {
    setProjectStatusFilter(e.target.value);
    setCurrentProjectPage(1);
  }, []);

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleDeleteProject = (project) => {
    setSelectedProject(project);
    setShowDeleteProjectModal(true);
  };

  const confirmProjectUpdate = async () => {
    if (selectedProject) {
      try {
        await dispatch(updateAdminProject({ 
          projectId: selectedProject._id, 
          updates: selectedProject 
        }));
        setShowProjectModal(false);
        setSelectedProject(null);
        dispatch(fetchAdminProjects({ 
          page: currentProjectPage, 
          search: projectSearchTerm,
          status: projectStatusFilter 
        }));
      } catch (error) {
        console.error('Failed to update project:', error);
      }
    }
  };

  const confirmProjectDelete = async () => {
    if (selectedProject) {
      try {
        await dispatch(deleteAdminProject(selectedProject._id));
        setShowDeleteProjectModal(false);
        setSelectedProject(null);
        dispatch(fetchAdminProjects({ 
          page: currentProjectPage, 
          search: projectSearchTerm,
          status: projectStatusFilter 
        }));
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  // Task handlers
  const handleTaskSearch = useCallback((e) => {
    setTaskSearchTerm(e.target.value);
    setCurrentTaskPage(1);
  }, []);

  const handleTaskStatusFilter = useCallback((e) => {
    setTaskStatusFilter(e.target.value);
    setCurrentTaskPage(1);
  }, []);

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = (task) => {
    setSelectedTask(task);
    setShowDeleteTaskModal(true);
  };

  const confirmTaskUpdate = async () => {
    if (selectedTask) {
      try {
        await dispatch(updateAdminTask({ 
          taskId: selectedTask._id, 
          updates: selectedTask 
        }));
        setShowTaskModal(false);
        setSelectedTask(null);
        dispatch(fetchAdminTasks({ 
          page: currentTaskPage, 
          search: taskSearchTerm,
          status: taskStatusFilter 
        }));
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    }
  };

  const confirmTaskDelete = async () => {
    if (selectedTask) {
      try {
        await dispatch(deleteAdminTask(selectedTask._id));
        setShowDeleteTaskModal(false);
        setSelectedTask(null);
        dispatch(fetchAdminTasks({ 
          page: currentTaskPage, 
          search: taskSearchTerm,
          status: taskStatusFilter 
        }));
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <i className="fas fa-lock"></i>
          <h2>Access Denied</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and monitor system activity</p>
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-content">
              <h3>{dashboard.stats.totalUsers}</h3>
              <p>Total Users</p>
              <span className="stat-change">+{dashboard.stats.recentUsers} this week</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-project-diagram"></i>
            </div>
            <div className="stat-content">
              <h3>{dashboard.stats.totalProjects}</h3>
              <p>Total Projects</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <div className="stat-content">
              <h3>{dashboard.stats.totalTasks}</h3>
              <p>Total Tasks</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-bell"></i>
            </div>
            <div className="stat-content">
              <h3>{dashboard.stats.totalNotifications}</h3>
              <p>Notifications</p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <i className="fas fa-users"></i>
          Users ({pagination?.total || 0})
        </button>
        <button 
          className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <i className="fas fa-project-diagram"></i>
          Projects ({projectsPagination?.total || 0})
        </button>
        <button 
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <i className="fas fa-tasks"></i>
          Tasks ({tasksPagination?.total || 0})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <div className="users-section">
        <div className="section-header">
          <h2>User Management</h2>
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Loading users...</span>
          </div>
        ) : users && users.length > 0 ? (
          <>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.length > 0 ? users.map((userItem) => (
                    <tr key={userItem._id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            <i className="fas fa-user"></i>
                          </div>
                          <span>{userItem.name}</span>
                        </div>
                      </td>
                      <td>{userItem.email}</td>
                      <td>
                        <span className={`role-badge ${userItem.role}`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td>{formatDate(userItem.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="role-btn"
                            onClick={() => handleRoleChange(userItem)}
                            disabled={userItem._id === user?._id} // Prevent self-role change
                          >
                            <i className="fas fa-user-edit"></i>
                            Change Role
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteUser(userItem)}
                            disabled={userItem._id === user?._id} // Prevent self-deletion
                          >
                            <i className="fas fa-trash"></i>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="no-data">
                        <div className="no-data-content">
                          <i className="fas fa-users"></i>
                          <p>No users found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                  Previous
                </button>
                <span>
                  Page {pagination?.current || 1} of {pagination?.pages || 1}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === (pagination?.pages || 1)}
                >
                  Next
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-users">
            <div className="no-users-content">
              <i className="fas fa-users"></i>
              <h3>No users found</h3>
              <p>Try adjusting your search criteria or check back later.</p>
            </div>
          </div>
        )}
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Change User Role</h3>
              <button onClick={() => setShowRoleModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <p>
                Are you sure you want to change <strong>{selectedUser.name}</strong>'s role from{' '}
                <span className={`role-badge ${selectedUser.role}`}>{selectedUser.role}</span> to{' '}
                <span className={`role-badge ${selectedUser.role === 'admin' ? 'member' : 'admin'}`}>
                  {selectedUser.role === 'admin' ? 'member' : 'admin'}
                </span>?
              </p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowRoleModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmRoleChange} className="confirm-btn">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Management */}
      {activeTab === 'projects' && (
        <div className="projects-section">
          <div className="section-header">
            <h2>Project Management</h2>
            <div className="filters">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearchTerm}
                  onChange={handleProjectSearch}
                />
              </div>
              <select
                value={projectStatusFilter}
                onChange={handleProjectStatusFilter}
                className="filter-select"
              >
                <option value="">All Projects</option>
                <option value="active">Active</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Loading projects...</span>
            </div>
          ) : projects && projects.length > 0 ? (
            <>
              <div className="projects-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Created By</th>
                      <th>Deadline</th>
                      <th>Members</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project._id}>
                        <td>
                          <div className="project-title">
                            <strong>{project.title}</strong>
                          </div>
                        </td>
                        <td>
                          <div className="project-description">
                            {project.description?.substring(0, 50)}
                            {project.description?.length > 50 && '...'}
                          </div>
                        </td>
                        <td>{project.createdBy?.name}</td>
                        <td>
                          <span className={`deadline ${new Date(project.deadline) < new Date() ? 'overdue' : ''}`}>
                            {formatDate(project.deadline)}
                          </span>
                        </td>
                        <td>
                          <span className="member-count">
                            {project.members?.length || 0} members
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-btn"
                              onClick={() => handleEditProject(project)}
                            >
                              <i className="fas fa-edit"></i>
                              Edit
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteProject(project)}
                            >
                              <i className="fas fa-trash"></i>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Projects Pagination */}
              {projectsPagination && projectsPagination.pages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentProjectPage(currentProjectPage - 1)}
                    disabled={currentProjectPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                    Previous
                  </button>
                  <span>
                    Page {projectsPagination.current} of {projectsPagination.pages}
                  </span>
                  <button
                    onClick={() => setCurrentProjectPage(currentProjectPage + 1)}
                    disabled={currentProjectPage === projectsPagination.pages}
                  >
                    Next
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-data">
              <i className="fas fa-project-diagram"></i>
              <h3>No projects found</h3>
              <p>No projects match your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Tasks Management */}
      {activeTab === 'tasks' && (
        <div className="tasks-section">
          <div className="section-header">
            <h2>Task Management</h2>
            <div className="filters">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={taskSearchTerm}
                  onChange={handleTaskSearch}
                />
              </div>
              <select
                value={taskStatusFilter}
                onChange={handleTaskStatusFilter}
                className="filter-select"
              >
                <option value="">All Tasks</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Loading tasks...</span>
            </div>
          ) : tasks && tasks.length > 0 ? (
            <>
              <div className="tasks-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Project</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task._id}>
                        <td>
                          <div className="task-title">
                            <strong>{task.title}</strong>
                          </div>
                        </td>
                        <td>
                          <div className="task-description">
                            {task.description?.substring(0, 50)}
                            {task.description?.length > 50 && '...'}
                          </div>
                        </td>
                        <td>{task.projectId?.title}</td>
                        <td>{task.assignedTo?.name || 'Unassigned'}</td>
                        <td>
                          <span className={`status-badge ${task.status}`}>
                            {task.status}
                          </span>
                        </td>
                        <td>{formatDate(task.createdAt)}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-btn"
                              onClick={() => handleEditTask(task)}
                            >
                              <i className="fas fa-edit"></i>
                              Edit
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteTask(task)}
                            >
                              <i className="fas fa-trash"></i>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tasks Pagination */}
              {tasksPagination && tasksPagination.pages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentTaskPage(currentTaskPage - 1)}
                    disabled={currentTaskPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                    Previous
                  </button>
                  <span>
                    Page {tasksPagination.current} of {tasksPagination.pages}
                  </span>
                  <button
                    onClick={() => setCurrentTaskPage(currentTaskPage + 1)}
                    disabled={currentTaskPage === tasksPagination.pages}
                  >
                    Next
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-data">
              <i className="fas fa-tasks"></i>
              <h3>No tasks found</h3>
              <p>No tasks match your search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Delete User</h3>
              <button onClick={() => setShowDeleteModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <p>
                Are you sure you want to delete user <strong>{selectedUser.name}</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmDelete} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Edit Modal */}
      {showProjectModal && selectedProject && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Project</h3>
              <button onClick={() => setShowProjectModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={selectedProject.title || ''}
                  onChange={(e) => setSelectedProject({...selectedProject, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={selectedProject.description || ''}
                  onChange={(e) => setSelectedProject({...selectedProject, description: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Deadline:</label>
                <input
                  type="datetime-local"
                  value={selectedProject.deadline ? new Date(selectedProject.deadline).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setSelectedProject({...selectedProject, deadline: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowProjectModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmProjectUpdate} className="confirm-btn">
                Update Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Delete Modal */}
      {showDeleteProjectModal && selectedProject && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Delete Project</h3>
              <button onClick={() => setShowDeleteProjectModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <p>
                Are you sure you want to delete project <strong>{selectedProject.title}</strong>?
                This will also delete all associated tasks and chat messages. This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteProjectModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmProjectDelete} className="delete-btn">
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Edit Modal */}
      {showTaskModal && selectedTask && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Task</h3>
              <button onClick={() => setShowTaskModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={selectedTask.title || ''}
                  onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={selectedTask.description || ''}
                  onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={selectedTask.status || 'todo'}
                  onChange={(e) => setSelectedTask({...selectedTask, status: e.target.value})}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowTaskModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmTaskUpdate} className="confirm-btn">
                Update Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Delete Modal */}
      {showDeleteTaskModal && selectedTask && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Delete Task</h3>
              <button onClick={() => setShowDeleteTaskModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <p>
                Are you sure you want to delete task <strong>{selectedTask.title}</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteTaskModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmTaskDelete} className="delete-btn">
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
