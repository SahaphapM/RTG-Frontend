import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  // ✅ Ensure the user is loaded before checking access
  if (!authStore.user) {
    console.warn("User data not available yet, skipping redirect.");
    return;
  }

  // ✅ If not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    console.warn("User is not authenticated, redirecting to login.");
    return navigateTo("/");
  }

  if (authStore.user) {
    console.log("User authenticated Checking role:", authStore.user.role);
  }

  const role = authStore.user?.role;

  // ✅ Allow admin to access all pages
  if (role === "admin") {
    return;
  }

  // ✅ Define restricted routes for users
  const userAllowedRoutes = [
    "/projects",
    "/purchase-orders",
    "/certificates",
    "/subcontractors",
    "/customers",
  ];

  // ✅ Allow users to access `/purchase-orders/:id` and `/certificates/:id`
  if (
    role === "user" &&
    (to.path.startsWith("/purchase-orders/") ||
      to.path.startsWith("/certificates/"))
  ) {
    return;
  }

  // ✅ Block user from accessing `/users` explicitly
  if (role === "user" && to.path.startsWith("/users")) {
    console.warn(
      "User is restricted from accessing /users, redirecting to /projects"
    );
    return navigateTo("/projects");
  }
  // ✅ Prevent users from accessing restricted pages
  if (role === "user" && !userAllowedRoutes.includes(to.path)) {
    console.warn("User is restricted, redirecting to /projects");
    return navigateTo("/projects");
  }
});
