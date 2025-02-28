import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const nuxtApp = useNuxtApp();

  // ✅ Ensure user is fetched before checking role
  if (!authStore.user) {
    await nuxtApp.runWithContext(async () => {
      await authStore.getUser();
    });
  }

  // ✅ If not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    return navigateTo("/");
  }

  const role = authStore.user?.role;

  // ✅ Allow admin to access all pages
  if (role === "admin") {
    return;
  }

  // ✅ Define restricted routes for users
  const userAllowedRoutes = ["/purchase-orders", "/projects", "/certificates"];

  // ✅ If user tries to access a restricted page, redirect to `/projects`
  if (role === "user" && !userAllowedRoutes.includes(to.path)) {
    return navigateTo("/projects");
  }
});
