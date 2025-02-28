import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  // ✅ ป้องกันหน้าทุกหน้าที่ยกเว้น `/login`
  if (!authStore.user) {
    nextTick(async () => {
      await authStore.getUser();
      if (!authStore.isAuthenticated && to.path !== "/") return navigateTo("/");
    });
  }
});
