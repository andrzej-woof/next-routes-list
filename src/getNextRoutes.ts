import fs from "node:fs";
import path from "node:path";
import listPaths from "list-paths";

const getFilePaths = (dirPath: string, validExtensions?: string[], validName?: string): string[] => {
  if (!fs.existsSync(dirPath)) return [];
  return listPaths(dirPath, { includeFiles: true }).filter(
    (filePath) => {
      const { ext, name } = path.parse(filePath);
			return (!validExtensions?.length || ext && validExtensions.includes(ext)) && (!validName || name === validName);
    }
  );
};

const isPrivateRoute = (part: string) => part.startsWith("_");
const isInterceptingRoute = (part: string) => part.startsWith("(") && !part.endsWith(")");
const isParallelRoute = (part: string) => part.startsWith("@");

const isGroupRoute = (part: string) => part.startsWith("(") && part.endsWith(")");

const isAppIgnoredRoute = (part: string) => isPrivateRoute(part) || isParallelRoute(part) || isInterceptingRoute(part);


export const getNextRoutes = (
	src: string = ".",
	extensions: string[] = ["tsx", "ts", "js", "jsx", "mdx"]
) => {
  const absoluteSrc = path.resolve(src);
  const dottedExtensions = extensions.map((ext) => ext.startsWith(".") ? ext : `.${ext}`);

  const appRoot = path.join(absoluteSrc, 'app');
	const appPaths = getFilePaths(appRoot, dottedExtensions, 'page')
	const pagePaths = getFilePaths(path.join(absoluteSrc, 'pages'), dottedExtensions).filter((filePath) => !filePath.includes(`${path.sep}pages${path.sep}api${path.sep}`));

  const mapToRoutes = (paths: string[]): string[] => {
    return paths
      .map((filePath) => {
        const isApp = filePath.startsWith(appRoot);
        const parts = filePath.split(absoluteSrc)[1]?.split(path.sep).filter(Boolean) ?? [];
        const urlParts: string[] = [];

        for (let i = 1; i < parts.length; i++) {
          let part = parts[i] as string;

          if (isApp && isAppIgnoredRoute(part)) {
            return '';
          }

          if (isApp && isGroupRoute(part)) {
            continue;
          }

          if (i === parts.length - 1) {
            if (isApp) {
              continue;
            }
            part = part.split(".").at(-2) ?? "";
            if (part === "index") {
              continue;
            }
          }

          part = part.replace(/%5F/g, "_"); // Decode URL-encoded underscores
          urlParts.push(part);
        }

        return `/${urlParts.join("/")}`;
      })
      .filter(Boolean);
  };

  const appRoutes = mapToRoutes(appPaths);
  const pagesRoutes = mapToRoutes(pagePaths);

  return Array.from(new Set([...appRoutes, ...pagesRoutes]));
};
