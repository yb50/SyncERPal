export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function handleApiResponse(response, fallbackMessage) {
  if (!response.ok) {
    return response.text().then((message) => {
      throw new ApiError(message || fallbackMessage, response.status);
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