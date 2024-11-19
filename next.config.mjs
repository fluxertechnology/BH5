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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ph.bnmnm1.cn",
        pathname: "*", // You can specify the path pattern if needed
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
