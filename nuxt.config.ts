// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  typescript: {
    strict: true,
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    // and more...
  },
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3001", // NestJS API base URL
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  pages: true, // Ensure automatic routing is enabled
});
