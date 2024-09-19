export const routeToRegex = (route: string, withQueryString?: boolean) =>
  new RegExp(
    `^${route
      .replace(/\/\[\[\.{3}[^\]]+\]\]/g, '###catch_all_optional###')
      .replace(/\[\[[^\]]+\]\]/g, '###catch_all###')
      .replace(/\[[^\]]+\]/g, '[^/]+')
      .replace(/###catch_all###/g, '[^?]+')
      .replace(/###catch_all_optional###/g, '(?:\\/[^?])*')
      .replace(/\//g, '\\/')}${withQueryString ? '?' : '$'}`,
  );
