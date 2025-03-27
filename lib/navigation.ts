export function isPublicRoute(pathname: string): boolean {
  // List of routes that are always accessible
  const publicRoutes = ["/", "/om-oss", "/tjenester"]
  return publicRoutes.includes(pathname)
}

