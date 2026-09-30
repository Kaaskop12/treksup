import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getRoute, routes } from '@/lib/routes';
import RouteDetail from '@/components/RouteDetail';

export function generateStaticParams() {
  return routes.map((r) => ({ id: r.id }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const route = getRoute(params.id);
  if (!route) return {};
  const what = route.huts.length ? 'huts and packing list' : 'transport and packing list';
  const title = `${route.name}: route, ${what}`;
  return {
    title,
    description: route.summary,
    alternates: { canonical: `/route/${route.id}` },
    openGraph: { title, description: route.summary, images: [{ url: route.hero }], siteName: 'Treksup', type: 'article' }
  };
}

export default function RouteDetailPage({ params }: { params: { id: string } }) {
  const route = getRoute(params.id);
  if (!route) notFound();
  return <RouteDetail route={route} />;
}
