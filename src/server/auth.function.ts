import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

export const getAuthCookie = createServerFn().handler(async () => {
  return getCookie("SERVER_ONLY_COOKIE");
});
