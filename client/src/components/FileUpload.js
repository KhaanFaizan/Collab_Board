import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uploadFile } from '../store/slices/fileSlice';
import './FileUpload.css';

const FileUpload = ({ projectId }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.files);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    setUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
          continue;
        }

        // Validate file type
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar/;
        const isValidType = allowedTypes.test(file.name.toLowerCase());
        
        if (!isValidType) {
          alert(`File ${file.name} is not a supported file type.`);
          continue;
        }

        await dispatch(uploadFile({ projectId, file }));
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };


  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          style={{ display: 'none' }}
          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip,.rar"
        />
        
        <div className="upload-content">
          <i className="fas fa-cloud-upload-alt upload-icon"></i>
          <h3>Upload Files</h3>
          <p>Drag and drop files here, or click to select files</p>
          <p className="upload-info">
            Supported formats: JPG, PNG, GIF, PDF, DOC, DOCX, TXT, ZIP, RAR
          </p>
          <p className="upload-info">Maximum file size: 10MB</p>
          
          <button
            type="button"
            onClick={onButtonClick}
            disabled={isLoading || uploading}
            className="upload-button"
          >
            {isLoading || uploading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Uploading...
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i>
                Choose Files
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
