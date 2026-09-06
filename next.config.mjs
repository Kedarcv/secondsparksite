/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export -> ./out  (upload the contents of `out/` to cPanel public_html)
  output: 'export',
  trailingSlash: true, // emits /miki/index.html so Apache serves clean URLs without rewrites
  images: { unoptimized: true },
};

export default nextConfig;
