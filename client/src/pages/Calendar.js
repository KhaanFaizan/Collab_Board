import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCalendarData, clearCalendarError } from '../store/slices/calendarSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import './Calendar.css';

const Calendar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { calendarEntries, totalProjects, totalTasks, isLoading, error } = useSelector((state) => state.calendar);
  const [filter, setFilter] = useState('all'); // all, projects, tasks
  const [sortBy, setSortBy] = useState('deadline'); // deadline, created

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCalendarData(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    return () => {
      dispatch(clearCalendarError());
    };
  }, [dispatch]);

  const filteredEntries = calendarEntries.filter(entry => {
    if (filter === 'all') return true;
    return entry.type === filter;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.deadline) - new Date(b.deadline);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineStatus = (deadline) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return 'overdue';
    if (days === 0) return 'today';
    if (days <= 3) return 'urgent';
    if (days <= 7) return 'soon';
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue': return '#ff4444';
      case 'today': return '#ff8800';
      case 'urgent': return '#ffaa00';
      case 'soon': return '#ffcc00';
      default: return '#4CAF50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'overdue': return 'Overdue';
      case 'today': return 'Due Today';
      case 'urgent': return 'Due Soon';
      case 'soon': return 'Due This Week';
      default: return 'Upcoming';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="calendar-page">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={() => dispatch(fetchCalendarData(user.id))} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1>
          <i className="fas fa-calendar-alt"></i>
          My Calendar
        </h1>
        <div className="calendar-stats">
          <div className="stat-card">
            <i className="fas fa-project-diagram"></i>
            <span>{totalProjects} Projects</span>
          </div>
          <div className="stat-card">
            <i className="fas fa-tasks"></i>
            <span>{totalTasks} Tasks</span>
          </div>
        </div>
      </div>

      <div className="calendar-controls">
        <div className="filter-controls">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Items</option>
            <option value="project">Projects Only</option>
            <option value="task">Tasks Only</option>
          </select>
        </div>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="deadline">Deadline</option>
            <option value="created">Created Date</option>
          </select>
        </div>
      </div>

      <div className="calendar-content">
        {sortedEntries.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-calendar-times"></i>
            <h3>No calendar entries found</h3>
            <p>Create some projects and tasks to see them in your calendar.</p>
            <Link to="/projects" className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Create Project
            </Link>
          </div>
        ) : (
          <div className="calendar-list">
            {sortedEntries.map((entry) => {
              const status = getDeadlineStatus(entry.deadline);
              const days = getDaysUntilDeadline(entry.deadline);
              
              return (
                <div key={entry.id} className={`calendar-item ${entry.type}`}>
                  <div className="item-icon">
                    {entry.type === 'project' ? (
                      <i className="fas fa-project-diagram"></i>
                    ) : (
                      <i className="fas fa-tasks"></i>
                    )}
                  </div>
                  
                  <div className="item-content">
                    <div className="item-header">
                      <h3>{entry.title}</h3>
                      <span 
                        className="deadline-status"
                        style={{ backgroundColor: getStatusColor(status) }}
                      >
                        {getStatusText(status)}
                      </span>
                    </div>
                    
                    <div className="item-details">
                      <p className="project-info">
                        <i className="fas fa-folder"></i>
                        {entry.projectTitle}
                      </p>
                      
                      <div className="deadline-info">
                        <i className="fas fa-clock"></i>
                        <span>
                          {new Date(entry.deadline).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="days-remaining">
                          ({days < 0 ? `${Math.abs(days)} days overdue` : 
                            days === 0 ? 'Today' : 
                            days === 1 ? 'Tomorrow' : 
                            `${days} days remaining`})
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <Link 
                      to={`/projects/${entry.projectId}`} 
                      className="action-btn"
                    >
                      <i className="fas fa-external-link-alt"></i>
                      View Project
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
