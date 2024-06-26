// from: https://github.com/clerk/javascript/blob/9fa8831808fae5c97df18e78e7418bd08c4c8da9/packages/nextjs/src/server/routeMatcher.ts#L10

import { paths } from "./pathMatchers";
import type { Link, Location } from "react-router-dom";

type WithPathPatternWildcard<T> = `${T & string}(.*)`;
type NextTypedRoute<T = Parameters<typeof Link>["0"]["to"]> = T extends string
  ? T
  : never;
type Autocomplete<U extends T, T = string> = U | (T & Record<never, never>);

type RouteMatcherWithNextTypedRoutes = Autocomplete<
  WithPathPatternWildcard<NextTypedRoute> | NextTypedRoute
>;

export type RouteMatcherParam =
  | Array<RegExp | RouteMatcherWithNextTypedRoutes>
  | RegExp
  | RouteMatcherWithNextTypedRoutes
  | ((req: Location) => boolean);

/**
 * Returns a function that accepts a `Request` object and returns whether the request matches the list of
 * predefined routes that can be passed in as the first argument.

 *
 * You can use glob patterns to match multiple routes or a function to match against the request object.
 * Path patterns and regular expressions are supported, for example: `['/foo', '/bar(.*)'] or `[/^\/foo\/.*$/]`
 * For more information, see: https://clerk.com/docs
 */

export const createRouteMatcher = (routes: RouteMatcherParam) => {
  if (typeof routes === "function") {
    return (req: Location) => routes(req);
  }

  const routePatterns = [routes || ""].flat().filter(Boolean);
  const matchers = precomputePathRegex(routePatterns);
  return (location: Location) =>
    matchers.some((matcher) => matcher.test(location.pathname));
};

const precomputePathRegex = (patterns: Array<string | RegExp>) => {
  return patterns.map((pattern) =>
    pattern instanceof RegExp ? pattern : paths.toRegexp(pattern)
  );
};
