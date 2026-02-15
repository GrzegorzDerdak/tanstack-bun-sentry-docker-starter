import { getAuthCookie } from "@/server/auth.function";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/")({
  component: App,
  validateSearch: z.object({
    authCookie: z.string().optional(),
  }),
  loader: async () => {
    const authCookie = await getAuthCookie();

    return {
      authCookie,
    };
  },
});

function App() {
  const { authCookie } = Route.useLoaderData();

  return <main>{authCookie}</main>;
}
