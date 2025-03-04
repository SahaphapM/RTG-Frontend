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
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:3001", // NestJS API base URL
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  pages: true, // Ensure automatic routing is enabled
  routeRules: {
    "/users/**": { appMiddleware: "auth-role" }, // ✅ Ensure `/users` is protected
  },
  css: [
    "@/assets/css/global.css", // หรือ '@assets/css/global.scss' หากคุณใช้ SCSS
  ],
});
