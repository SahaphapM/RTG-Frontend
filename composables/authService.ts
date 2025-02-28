import { useFetch } from "#app";

export const useApiFetch = async (url: string, options = {}) => {
  return useFetch(url, {
    ...options,
    credentials: "include", // ✅ ให้ส่ง Cookie ไปกับทุก Request
  });
};
