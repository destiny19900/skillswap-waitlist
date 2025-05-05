/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // Expose non-sensitive SMTP details to the client for testing UI
    NEXT_PUBLIC_SMTP_HOST: process.env.SMTP_HOST,
    NEXT_PUBLIC_SMTP_PORT: process.env.SMTP_PORT,
    NEXT_PUBLIC_SMTP_SECURE: process.env.SMTP_SECURE,
    // DO NOT expose passwords or sensitive info
  },
};

module.exports = nextConfig; 