import createNextIntlPlugin from "next-intl/plugin";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  // reactStrictMode: false,
  images: {
    // loader: "custom",
    // loaderFile: "./src/lib/services/imageLoader.js",
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "ph.bnmnm1.cn",
      //   pathname: "/**", // You can specify the path pattern if needed
      // },
      // {
      //   protocol: "https",
      //   hostname: "front.18acg.life",
      //   pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "ph2koedda-bapi.j23f8keeq.com",
      //   pathname: "/**",
      // },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
    // additionalData: `@import "src/styles/global.scss";`,
    // includePaths: [path.join(__dirname, "src", "styles")],
  },
};

export default withNextIntl(nextConfig);
