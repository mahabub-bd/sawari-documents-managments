const nextConfig = {
  // Turbopack needs the workspace root (monorepo root with the lockfile)
  turbopack: {
    root: "../..",
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sawaribd.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sawaridocument.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.sawaribd.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    // Requests passing through proxy.ts buffer the body in memory;
    // the 10MB default truncated large uploads ("Unexpected end of form").
    proxyClientMaxBodySize: "1gb",
    serverActions: {
      bodySizeLimit: "1gb",
    },
  },
};

export default nextConfig;
