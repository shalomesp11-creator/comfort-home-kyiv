import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin
        const today = new Date().toISOString().split('T')[0]
        const routes = [
          ['/', 'weekly', '1.0'],
          ['/remonty', 'monthly', '0.9'],
          ['/budivnytstvo', 'monthly', '0.9'],
          ['/dyzain', 'monthly', '0.9'],
          ['/portfolio', 'weekly', '0.9'],
          ['/kontakty', 'monthly', '0.8'],
        ]
        const urls = routes.flatMap(([path, frequency, priority]) => [
          '  <url>',
          `    <loc>${origin}${path === '/' ? '/' : path}</loc>`,
          `    <lastmod>${today}</lastmod>`,
          `    <changefreq>${frequency}</changefreq>`,
          `    <priority>${priority}</priority>`,
          '  </url>',
        ])
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          '</urlset>',
        ].join('\n')
        return new Response(xml, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
