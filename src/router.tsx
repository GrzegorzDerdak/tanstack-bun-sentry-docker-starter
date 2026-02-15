import * as Sentry from "@sentry/tanstackstart-react";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const sentryEnvironment = process.env.SENTRY_ENVIRONMENT ?? "production";
const isProduction = sentryEnvironment === "production";

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  // Exclude server-side initialization of Sentry
  // because it's already initialized in instrument.server.mjs
  if (!router.isServer) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,

      // Release is the version of the application that is being used.
      release: process.env.npm_package_version,

      // environment
      environment: sentryEnvironment,

      // Debug mode
      debug: process.env.DEBUG === "true",

      // Adds request headers and IP for users
      // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
      sendDefaultPii: true,

      integrations: [
        Sentry.tanstackRouterBrowserTracingIntegration(router),
        Sentry.replayIntegration(),
      ],

      // Enable logs
      enableLogs: true,

      // Capture 100% of transactions for tracing in development.
      // Adjust this value in production (e.g. 0.1 for 10%).
      tracesSampleRate: isProduction ? 0.1 : 1.0,

      // Capture Replay for 10% of all sessions,
      // plus 100% of sessions with an error.
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
