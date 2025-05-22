import axios from 'axios';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true; 

const STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/',
  withCredentials: true,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error('Network error. Please try again.');
      return Promise.reject({ message: 'Network error. Please try again.' });
    }

    const { status, data: errorData } = error.response;

    switch (status) {
      case STATUS_CODES.BAD_REQUEST:
        if (errorData) {
          Object.entries(errorData).forEach(([key, value]) => {
            toast.error(typeof value === 'string' ? value : value?.[0] || 'Invalid input');
          });
        } else {
          toast.error('Bad Request');
        }
        break;

      case STATUS_CODES.UNAUTHORIZED:
        toast.error(errorData.error);
        break;

      case STATUS_CODES.FORBIDDEN:
        toast.error('Access Denied');
        break;

      case STATUS_CODES.NOT_FOUND:
        toast.error(errorData.error || 'Not Found');
        // Optionally redirect or handle route-specific logic
        break;

      case STATUS_CODES.INTERNAL_SERVER_ERROR:
        toast.error(errorData.message || 'Server Error');
        break;

      case STATUS_CODES.METHOD_NOT_ALLOWED:
        toast.error('Method Not Allowed');
        break;

      case STATUS_CODES.NOT_ACCEPTABLE:
        toast.error('Request Not Acceptable');
        break;

        case STATUS_CODES.CONFLICT:
          toast.error(errorData.error || errorData.message || 'Conflict: Resource already exists');
          break;

      case STATUS_CODES.REQUEST_TIMEOUT:
        toast.error('Request Timed Out');
        break;

      case STATUS_CODES.TOO_MANY_REQUESTS:
        toast.error('Too Many Requests. Please slow down.');
        break;

      default:
        toast.error(`Error ${status}: ${errorData.message || 'Unexpected error'}`);
    }

    return Promise.reject({
      status,
      message: errorData.message || 'An error occurred',
      errorData,
    });
  }
);
