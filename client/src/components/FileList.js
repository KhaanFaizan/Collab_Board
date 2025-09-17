import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProjectFiles, deleteFile } from '../store/slices/fileSlice';
import './FileList.css';

const FileList = ({ projectId }) => {
  const { files, isLoading, error } = useSelector((state) => state.files);
  const dispatch = useDispatch();

  useEffect(() => {
    if (projectId) {
      dispatch(getProjectFiles(projectId));
    }
  }, [projectId, dispatch]);

  const handleDelete = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      dispatch(deleteFile(fileId));
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) {
      return 'fas fa-image';
    } else if (mimeType.includes('pdf')) {
      return 'fas fa-file-pdf';
    } else if (mimeType.includes('word') || mimeType.includes('document')) {
      return 'fas fa-file-word';
    } else if (mimeType.includes('zip') || mimeType.includes('rar')) {
      return 'fas fa-file-archive';
    } else if (mimeType.includes('text')) {
      return 'fas fa-file-alt';
    } else {
      return 'fas fa-file';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="file-list-container">
        <div className="loading">Loading files...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="file-list-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="file-list-container">
      <div className="file-list-header">
        <h3>
          <i className="fas fa-folder"></i>
          Project Files ({files.length})
        </h3>
      </div>

      {files.length === 0 ? (
        <div className="no-files">
          <i className="fas fa-folder-open"></i>
          <p>No files uploaded yet</p>
        </div>
      ) : (
        <div className="file-list">
          {files.map((file) => (
            <div key={file._id} className="file-item">
              <div className="file-icon">
                <i className={getFileIcon(file.mimeType)}></i>
              </div>
              
              <div className="file-info">
                <div className="file-name" title={file.originalName}>
                  {file.originalName}
                </div>
                <div className="file-meta">
                  <span className="file-size">{formatFileSize(file.fileSize)}</span>
                  <span className="file-separator">•</span>
                  <span className="file-date">{formatDate(file.createdAt)}</span>
                  <span className="file-separator">•</span>
                  <span className="file-uploader">by {file.uploadedBy?.name}</span>
                </div>
              </div>

              <div className="file-actions">
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn download-btn"
                  title="Download file"
                >
                  <i className="fas fa-download"></i>
                </a>
                
                <button
                  onClick={() => handleDelete(file._id)}
                  className="action-btn delete-btn"
                  title="Delete file"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileList;
