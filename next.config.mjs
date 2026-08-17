/** @type {import('next').NextConfig} */

const CSP = [
  "default-src 'self'",
  // Next.js hydration + SW registration inline script in layout.tsx
  "script-src 'self' 'unsafe-inline'",
  // Framer Motion and Tailwind use inline styles extensively
  "style-src 'self' 'unsafe-inline'",
  // Local images + data URIs for generated content
  "img-src 'self' data: blob:",
  // Fonts served from the same origin
  "font-src 'self'",
  // Vercel Analytics beacon (anonymous page-view pings only)
  "connect-src 'self' https://vitals.vercel-insights.com",
  // Service worker scope
  "worker-src 'self' blob:",
  // PWA manifest
  "manifest-src 'self'",
  // Block this app being embedded in any iframe
  "frame-ancestors 'none'",
  // Block <base> hijacking
  "base-uri 'self'",
  // Block form submissions to external domains
  "form-action 'self'",
].join('; ');

const nextConfig = {
  async headers() {
    return [
      // ── Service worker ───────────────────────────────────────────────────
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },

      // ── Security headers on every route ──────────────────────────────────
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking — nobody puede embeber Bloom en un iframe
          { key: 'X-Frame-Options', value: 'DENY' },

          // Prevent MIME-type sniffing (browser must honor declared Content-Type)
          { key: 'X-Content-Type-Options', value: 'nosniff' },

          // Control what referrer info leaves the app
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // Restrict access to sensitive browser APIs — the app needs none of these
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
          },

          // Enforce HTTPS for 2 years (Vercel always serves over HTTPS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },

          // Content Security Policy — controls what can load and execute
          { key: 'Content-Security-Policy', value: CSP },
        ],
      },
    ];
  },
};

export default nextConfig;
