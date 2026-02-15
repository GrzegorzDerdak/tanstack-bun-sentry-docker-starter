import * as Sentry from "@sentry/tanstackstart-react";

const sentryEnvironment = process.env.SENTRY_ENVIRONMENT ?? "production";
const isProduction = sentryEnvironment === "production";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,

  // Release is the version of the application that is being used.
  release: process.env.npm_package_version,

  // environment
  environment: sentryEnvironment,

  // Debug mode
  debug: process.env.DEBUG === "true",

  // Adds request headers and IP for users
  // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  enableLogs: true,

  // Capture 100% of transactions for tracing in development.
  // Adjust this value in production (e.g. 0.1 for 10%).
  tracesSampleRate: isProduction ? 0.1 : 1.0,
});
