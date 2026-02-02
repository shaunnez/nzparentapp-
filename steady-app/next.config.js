/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',

  // Set base path if deploying to github.io/repo-name
  // Uncomment and set your repo name:
  // basePath: '/nzparentapp-',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
