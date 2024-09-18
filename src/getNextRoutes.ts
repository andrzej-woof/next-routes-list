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

export const getNextRoutes = (
	src: string = ".",
	extensions: string[] = ["tsx", "ts", "js", "jsx", "mdx"]
) => {
  const absoluteSrc = path.resolve(src);
  const dottedExtensions = extensions.map((ext) => ext.startsWith(".") ? ext : `.${ext}`);

	// next app routes
	const appPaths = getFilePaths(path.join(absoluteSrc, 'app'), dottedExtensions, 'page')

	// next pages routes
	const pagePaths = getFilePaths(path.join(absoluteSrc, 'pages'), dottedExtensions).filter((filePath) => !filePath.includes(`${path.sep}pages${path.sep}api${path.sep}`));

	/**
  appRoutes = [
    '/app/(group)/blog/page.tsx', => route should be '/blog'
    '/app/(group)/blog/[...slug]/page.tsx', => route should be '/blog/[...slug]'
    '/app/@component/blog/page.tsx', // should remove, because it's not a page
    '/app/blog/(..)list/page.tsx', // should remove, because it's not a page
		'/app/_private/page.tsx', // should remove, because it's a private folder
		'/app/%5Flog%5F/page.tsx', // should be '/_log_'
  ]
  */
	const appRoutes = appPaths
		.map((filePath) => {
			const parts = filePath.split(absoluteSrc)[1]?.split(path.sep).filter(Boolean) ?? [];
			const url: string[] = [];

			for (let i = 0; i < parts.length; i++) {
				let part = parts[i];
				if (!part) continue;

				if (i === 0 && part === "app") continue;

				const isPrivateRoute = part.startsWith("_");
				if (isPrivateRoute) return null;

				const isGroupRoute = part.startsWith("(") && part.endsWith(")");
				if (isGroupRoute) continue;

				const isInterceptingRoute = part.startsWith("(") && !part.endsWith(")");
				if (isInterceptingRoute) return null;

				const isParallelRoute = part.startsWith("@");
				if (isParallelRoute) return null;

				// ignore 'page.tsx' on url path
				if (i === parts.length - 1) continue;

				// replace %5F to _
				part = part.replace(/%5F/g, "_");

				url.push(part);
			}

			return `/${url.join("/")}`;
		})
		.filter(Boolean);

	/**
  pageRoutes = [
    '/pages/blog.js', => route should be '/blog'
    '/pages/[slug].js', => route should be '/[...slug]'
  ]
  */
	const pagesRoutes = pagePaths
		.map((filePath) => {
			const parts = filePath.split(absoluteSrc)[1]?.split(path.sep).filter(Boolean) ?? [];

			const url: string[] = [];

			for (let i = 0; i < parts.length; i++) {
				let part = parts[i];
				if (!part) continue;

				if (i === 0 && part === "pages") continue;

				if (i === parts.length - 1) {
					part = part.split(".").at(-2) ?? "";

					if (part === "index") {
						continue;
					}
				}

				url.push(part);
			}

			return `/${url.join("/")}`;
		})
		.filter(Boolean);

	const unDuplicatedRoutes = Array.from(
		new Set([...appRoutes, ...pagesRoutes])
	);
	return unDuplicatedRoutes;
}
