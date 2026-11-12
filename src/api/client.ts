/*
 * Future API interceptor template. Enable and adapt when the new project
 * has an API contract.
 *
 * import axios from "axios";
 *
 * const apiClient = axios.create({
 *   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
 * });
 *
 * apiClient.interceptors.request.use((config) => {
 *   // Add shared request headers here.
 *   return config;
 * });
 *
 * apiClient.interceptors.response.use(
 *   (response) => response,
 *   (error: unknown) => Promise.reject(error),
 * );
 *
 * export default apiClient;
 */
