export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function extractErrorMessage(text, fallbackMessage) {
  if (!text) {
    return fallbackMessage;
  }

  try {
    const errorBody = JSON.parse(text);

    if (errorBody.message) {
      return errorBody.message;
    }

    if (errorBody.error) {
      return errorBody.error;
    }

    return fallbackMessage;
  } catch {
    return text;
  }
}

export function handleApiResponse(response, fallbackMessage) {
  if (!response.ok) {
    return response.text().then((text) => {
      const message = extractErrorMessage(text, fallbackMessage);
      
      throw new ApiError(message, response.status);
    });
  }

  return Promise.resolve(response);
}

export function isUnauthorizedError(error) {
  return error instanceof ApiError && error.status === 401;
}

export function isForbiddenError(error) {
  return error instanceof ApiError && error.status === 403;
}