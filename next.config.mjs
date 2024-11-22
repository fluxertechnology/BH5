import createNextIntlPlugin from "next-intl/plugin";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/services/imageLoader.js",
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
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home/main",
        permanent: true, // Set to true for 301 redirects, false for 302
      },
    ];
  },
};

export default withNextIntl(nextConfig);
