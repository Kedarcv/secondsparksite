/** @type {import('next').NextConfig} */
const nextConfig = {
  // `output: 'export'` was removed: sending/receiving email and verifying a
  // webhook signature all need a server request to run on, which a static
  // export cannot provide. Vercel builds and hosts this as a normal Next.js
  // app now — marketing pages are still statically generated at build time
  // (nothing about them is dynamic), and /api/* runs as serverless functions.
  //
  // To go back to a pure static export (e.g. for cPanel or Cloudflare Pages),
  // restore `output: 'export'` here — but the /api/contact and
  // /api/webhooks/resend routes will then fail to build, since output:'export'
  // only allows static route handlers. Remove those two route folders first.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
