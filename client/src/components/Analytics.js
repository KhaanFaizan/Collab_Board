import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjectAnalytics, clearAnalytics } from '../store/slices/analyticsSlice';
import LoadingSpinner from './LoadingSpinner';
import './Analytics.css';

const Analytics = ({ projectId }) => {
  const dispatch = useDispatch();
  const { analytics, isLoading, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectAnalytics(projectId));
    }

    return () => {
      dispatch(clearAnalytics());
    };
  }, [dispatch, projectId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="analytics-error">
        <i className="fas fa-exclamation-triangle"></i>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchProjectAnalytics(projectId))} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="analytics-empty">
        <i className="fas fa-chart-bar"></i>
        <p>No analytics data available</p>
      </div>
    );
  }

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'overdue': return '#ff4444';
      case 'critical': return '#ff8800';
      case 'urgent': return '#ffaa00';
      case 'moderate': return '#ffcc00';
      default: return '#4CAF50';
    }
  };

  const getUrgencyText = (level) => {
    switch (level) {
      case 'overdue': return 'Overdue';
      case 'critical': return 'Critical';
      case 'urgent': return 'Urgent';
      case 'moderate': return 'Moderate';
      default: return 'Low';
    }
  };

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>
          <i className="fas fa-chart-line"></i>
          Project Analytics
        </h2>
        <div className="project-status">
          <span 
            className={`urgency-badge ${analytics.urgencyLevel}`}
            style={{ backgroundColor: getUrgencyColor(analytics.urgencyLevel) }}
          >
            {getUrgencyText(analytics.urgencyLevel)}
          </span>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Overview Cards */}
        <div className="overview-cards">
          <div className="overview-card">
            <div className="card-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <div className="card-content">
              <h3>{analytics.totalTasks}</h3>
              <p>Total Tasks</p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="card-content">
              <h3>{analytics.completionPercentage}%</h3>
              <p>Completion</p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="card-content">
              <h3>{analytics.workloadDistribution.length}</h3>
              <p>Team Members</p>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">
              <i className="fas fa-calendar"></i>
            </div>
            <div className="card-content">
              <h3>{analytics.daysRemaining}</h3>
              <p>Days Left</p>
            </div>
          </div>
        </div>

        {/* Task Status Chart */}
        <div className="chart-section">
          <h3>Task Status Distribution</h3>
          <div className="status-chart">
            <div className="status-item">
              <div className="status-bar">
                <div 
                  className="status-fill todo" 
                  style={{ width: `${analytics.totalTasks > 0 ? (analytics.taskCounts.todo / analytics.totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="status-info">
                <span className="status-label">To Do</span>
                <span className="status-count">{analytics.taskCounts.todo}</span>
              </div>
            </div>

            <div className="status-item">
              <div className="status-bar">
                <div 
                  className="status-fill in-progress" 
                  style={{ width: `${analytics.totalTasks > 0 ? (analytics.taskCounts['in-progress'] / analytics.totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="status-info">
                <span className="status-label">In Progress</span>
                <span className="status-count">{analytics.taskCounts['in-progress']}</span>
              </div>
            </div>

            <div className="status-item">
              <div className="status-bar">
                <div 
                  className="status-fill done" 
                  style={{ width: `${analytics.totalTasks > 0 ? (analytics.taskCounts.done / analytics.totalTasks) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="status-info">
                <span className="status-label">Done</span>
                <span className="status-count">{analytics.taskCounts.done}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workload Distribution */}
        <div className="workload-section">
          <h3>Team Workload Distribution</h3>
          <div className="workload-list">
            {analytics.workloadDistribution.map((member, index) => (
              <div key={member.userId} className="workload-item">
                <div className="member-info">
                  <div className="member-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="member-details">
                    <h4>{member.userName}</h4>
                    <p>{member.userEmail}</p>
                  </div>
                </div>
                
                <div className="workload-stats">
                  <div className="total-tasks">
                    <span className="number">{member.totalTasks}</span>
                    <span className="label">Total Tasks</span>
                  </div>
                  
                  <div className="task-breakdown">
                    <div className="breakdown-item">
                      <span className="count todo">{member.tasksByStatus.todo}</span>
                      <span className="label">To Do</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="count in-progress">{member.tasksByStatus['in-progress']}</span>
                      <span className="label">In Progress</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="count done">{member.tasksByStatus.done}</span>
                      <span className="label">Done</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Insights */}
        <div className="insights-section">
          <h3>Project Insights</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <i className="fas fa-trophy"></i>
              <h4>Most Active Member</h4>
              <p>{analytics.mostActiveMember?.userName || 'N/A'}</p>
              <span className="insight-value">{analytics.mostActiveMember?.totalTasks || 0} tasks</span>
            </div>

            <div className="insight-card">
              <i className="fas fa-chart-pie"></i>
              <h4>Average per Member</h4>
              <p>{analytics.averageTasksPerMember} tasks</p>
              <span className="insight-value">per team member</span>
            </div>

            <div className="insight-card">
              <i className="fas fa-flag-checkered"></i>
              <h4>Project Status</h4>
              <p>{analytics.isOnTrack ? 'On Track' : 'Needs Attention'}</p>
              <span className={`insight-value ${analytics.isOnTrack ? 'success' : 'warning'}`}>
                {analytics.completionPercentage}% complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
