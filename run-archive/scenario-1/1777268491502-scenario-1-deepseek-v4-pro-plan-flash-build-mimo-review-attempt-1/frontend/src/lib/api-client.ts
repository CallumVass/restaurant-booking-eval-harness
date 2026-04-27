import axios, { type AxiosRequestConfig } from 'axios';

const instance = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return instance(config).then(({ data }) => data as T);
};
