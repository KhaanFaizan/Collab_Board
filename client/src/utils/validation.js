// Form validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateProjectForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.title)) {
    errors.title = 'Title is required';
  }

  if (!validateRequired(formData.description)) {
    errors.description = 'Description is required';
  }

  if (!formData.deadline) {
    errors.deadline = 'Deadline is required';
  } else {
    const deadlineDate = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deadlineDate <= today) {
      errors.deadline = 'Deadline must be in the future';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateTaskForm = (formData) => {
  const errors = {};

  if (!validateRequired(formData.title)) {
    errors.title = 'Title is required';
  }

  if (!validateRequired(formData.description)) {
    errors.description = 'Description is required';
  }

  if (!formData.assignedTo) {
    errors.assignedTo = 'Please assign the task to someone';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAuthForm = (formData, isLogin = false) => {
  const errors = {};

  if (!isLogin && !validateRequired(formData.name)) {
    errors.name = 'Name is required';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
