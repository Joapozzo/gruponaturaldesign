const nextConfig = {
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          }
        ]
      }
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Variables de entorno públicas (solo las necesarias)
  env: {
    SITE_URL: process.env.SITE_URL || 'https://naturalonline.com.ar'
  }
};

module.exports = nextConfig;