import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Link, Outlet, Scripts, createRootRouteWithContext, useRouter } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";
import appMetaJson from "../app-meta.json";
import { reportHiggsfieldError } from "../lib/higgsfield-error-reporting";

declare const __HF_DESIGN_INSPECTOR__: boolean;

const appMeta = appMetaJson as {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: appMeta.og_title ?? "COMFORT HOME — Ремонти під ключ" },
      { name: "description", content: appMeta.og_description ?? "Ремонт квартир і будинків під ключ у Києві та області." },
      { name: "author", content: "COMFORT HOME" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "theme-color", content: "#FAF5ED" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "COMFORT HOME" },
      { property: "og:locale", content: "uk_UA" },
      { property: "og:title", content: appMeta.og_title ?? "COMFORT HOME — Ремонти під ключ" },
      { property: "og:description", content: appMeta.og_description ?? "Ремонт квартир і будинків під ключ у Києві та області." },
      { property: "og:image", content: "https://www.comforthome.kyiv.ua/projects/varshavsky-living-hero.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.comforthome.kyiv.ua/projects/varshavsky-living-hero.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: appMeta.favicon_url ?? "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/brand/comfort-home-logo.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    if (!__HF_DESIGN_INSPECTOR__) return;
    void import("../module/design-inspector/runtime")
      .then(({ installHiggsfieldDesignInspector }) => installHiggsfieldDesignInspector())
      .catch((error) => reportHiggsfieldError(error instanceof Error ? error : new Error("Design inspector failed"), { boundary: "design_inspector_import" }));
  }, []);
  return <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>;
}

function NotFoundComponent() {
  return <main className="lead-success"><span className="lead-success-number">404</span><h1>Сторінку не знайдено.</h1><p>Можливо, адресу було змінено. Поверніться на головну сторінку COMFORT HOME.</p><Link className="lead-success-action" to="/">На головну</Link></main>;
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportHiggsfieldError(error instanceof Error ? error : new Error("Unknown route error"), { boundary: "root_error" }); }, [error]);
  return <main className="lead-success"><span className="lead-success-number">!</span><h1>Сторінка не завантажилась.</h1><p>Оновіть сторінку або поверніться на головну.</p><button className="lead-success-action" type="button" onClick={() => { router.invalidate(); reset(); }}>Спробувати ще раз</button></main>;
}
