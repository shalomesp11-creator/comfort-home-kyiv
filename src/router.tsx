import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();
  // The prerenderer requests routes from the server at `/`, while browsers on
  // GitHub Pages load them beneath the repository path.
  const basepath = import.meta.env.SSR || import.meta.env.VITE_GITHUB_PAGES !== "true"
    ? "/"
    : "/comfort-home-kyiv";

  const router = createRouter({
    routeTree,
    context: { queryClient },
    basepath,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
