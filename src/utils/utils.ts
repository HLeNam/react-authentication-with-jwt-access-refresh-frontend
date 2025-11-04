export function mergeUrlPaths(...paths: string[]) {
    return (
        "/" +
        paths
            .map((path) => path.replace(/(^\/+|\/+$)/g, "")) // Remove leading and trailing slashes
            .filter(Boolean) // Filter out empty strings
            .join("/")
    ); // Join with a single slash
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmptyObject(obj: any): boolean {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
