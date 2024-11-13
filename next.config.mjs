import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  // Your existing Next.js config (if any)
};

export default withNextIntl(nextConfig);