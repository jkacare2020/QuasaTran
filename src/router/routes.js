// src/router/routes.js

// const routes = [
//   {
//     path: "/",
//     component: () => import("layouts/MainLayout.vue"),
//     children: [
//       { path: "", component: () => import("pages/PageHome.vue") }, // Home route
//       { path: "camera", component: () => import("pages/PageCamera.vue") }, // Camera page
//       { path: "users", component: () => import("pages/UsersPage.vue") }, // Users page
//       { path: "transacts", component: () => import("pages/TransactsPage.vue") }, // Transacts page
//       { path: "dashboard", component: () => import("pages/Dashboard.vue") }, // Dashboard page
//     ],
//   },
//   {
//     path: "/auth",
//     component: () => import("layouts/AuthLayout.vue"), // Separate layout for auth
//     children: [
//       { path: "login", component: () => import("pages/Login.vue") },
//       { path: "signup", component: () => import("pages/Signup.vue") },
//     ],
//   },
//   // Always leave this as the last route
//   {
//     path: "/:catchAll(.*)*",
//     component: () => import("pages/Error404.vue"),
//   },
// ];

// export default routes;

import Vue from "vue";
import VueRouter from "vue-router";

// src/router/routes.js

import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from "firebase/auth";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/PageHome.vue") },
      { path: "camera", component: () => import("pages/PageCamera.vue") },
      {
        path: "users",
        component: () => import("pages/UsersPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "transacts",
        component: () => import("pages/TransactsPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "dashboard",
        component: () => import("pages/Dashboard.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        component: () => import("pages/Login.vue"),
        meta: { requiresGuest: true },
      },
      {
        path: "signup",
        component: () => import("pages/Signup.vue"),
        meta: { requiresGuest: true },
      },
    ],
  },
  // Wildcard Route for 404 - Keep it last
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes, // make sure this is an array
});

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const auth = getAuth();
  const isAuthenticated = auth.currentUser;

  if (requiresAuth && !isAuthenticated) {
    // Redirect to the login page, modify this path based on your app's configuration
    next({ path: "/login" });
  } else {
    next(); // proceed to route
  }
});

export default routes;
