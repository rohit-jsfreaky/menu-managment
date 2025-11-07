export const successResponse = (message, data) => {
  const payload = {
    success: true,
    message
  };

  if (typeof data !== 'undefined') {
    payload.data = data;
  }

  return payload;
};

export const errorResponse = (message, errors) => {
  const payload = {
    success: false,
    message
  };

  if (typeof errors !== 'undefined' && errors !== null) {
    payload.errors = errors;
  }

  return payload;
};
