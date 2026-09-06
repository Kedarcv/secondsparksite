import { SITE } from '@/lib/content';

// required for output: 'export'
export const dynamic = 'force-static';

export default function sitemap() {
  const routes = ['/', '/battery-passport/', '/miki/', '/studio/', '/contact/'];
  return routes.map((r) => ({
    url: `${SITE.url}${r}`,
    changeFrequency: r === '/' ? 'monthly' : 'yearly',
    priority: r === '/' ? 1 : 0.8,
  }));
}
