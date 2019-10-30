import { RouteConfig } from "vue-router";

const routes: RouteConfig[] = [
  {
    path: "/",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      {
        path: "/problem/new",
        component: () => import("pages/ProblemRecording.vue")
      },
      { path: "/rating", component: () => import("pages/Rating.vue") }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
