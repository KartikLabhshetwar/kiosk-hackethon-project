/**
 * API Client
 * Axios instance with interceptors for request/response handling
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, API_ERROR_MESSAGES } from './config';

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    ...API_CONFIG.headers,
    'Accept': 'application/json',
  },
  withCredentials: false,
  // Force IPv4 to avoid IPv6 connection issues
  family: 4,
  // Additional network configuration
  maxRedirects: 5,
  validateStatus: (status) => status < 500, // Don't throw on 4xx errors
});

/**
 * Request interceptor
 * Add authentication tokens, logging, etc.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp for request tracking
    config.headers['X-Request-Time'] = new Date().toISOString();
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        data: config.data,
        headers: config.headers,
        timeout: config.timeout
      });
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handle responses, errors, and logging
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.baseURL}${response.config.url}`, {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
    }
    
    return response;
  },
  (error: AxiosError) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      
      switch (status) {
        case 400:
          console.error('[API Error 400] Bad Request:', error.response.data);
          break;
        case 401:
          console.error('[API Error 401] Unauthorized');
          break;
        case 403:
          console.error('[API Error 403] Forbidden');
          break;
        case 404:
          console.error('[API Error 404] Not Found');
          break;
        case 500:
          console.error('[API Error 500] Internal Server Error');
          break;
        default:
          console.error(`[API Error ${status}]`, error.response.data);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('[API Error] No response received:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          timeout: error.config?.timeout,
          family: error.config?.family
        },
        request: {
          readyState: error.request.readyState,
          status: error.request.status,
          statusText: error.request.statusText
        }
      });
    } else {
      // Error in request setup
      console.error('[API Error] Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * API Error Handler
 * Convert axios errors to user-friendly messages
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    console.error('[API Error Handler] Processing error:', {
      code: axiosError.code,
      message: axiosError.message,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      config: {
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        baseURL: axiosError.config?.baseURL,
        timeout: axiosError.config?.timeout
      }
    });
    
    if (axiosError.code === 'ECONNABORTED') {
      return API_ERROR_MESSAGES.timeout;
    }
    
    if (axiosError.code === 'ERR_NETWORK') {
      return `Network error: ${axiosError.message}. Backend URL: ${axiosError.config?.baseURL}`;
    }
    
    if (axiosError.response) {
      const status = axiosError.response.status;
      
      switch (status) {
        case 404:
          return API_ERROR_MESSAGES.notFound;
        case 401:
        case 403:
          return API_ERROR_MESSAGES.unauthorized;
        case 500:
        case 502:
        case 503:
          return API_ERROR_MESSAGES.server;
        default:
          // Try to extract error message from response
          const data = axiosError.response.data as any;
          return data?.detail || data?.message || API_ERROR_MESSAGES.unknown;
      }
    }
  }
  
  return API_ERROR_MESSAGES.unknown;
};

/**
 * Generic API request wrapper with error handling
 */
export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default apiClient;

