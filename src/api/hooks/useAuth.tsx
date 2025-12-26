"use client";

import { useAuthContext } from "@/AuthContext";
import axios from "axios";

export const apiUrl = process.env.NEXT_PUBLIC_BACKEND_API;

// Use the actual backend URL directly, with fallback
const BASE_URL = apiUrl || 'https://datacapture-backend.onrender.com';

export const useAuth = () => {
  const { token, signOut } = useAuthContext();

  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    withCredentials: false, // Set to false for CORS
  });

  // Add request interceptor to handle CORS
  client.interceptors.request.use(
    (config) => {
      // Ensure headers are set for each request
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        signOut();
      }
      return Promise.reject(error);
    }
  );

  return { client, SignOut: signOut };
};
