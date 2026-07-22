export type PackItem = { id: string; label: string };

export type Route = {
  id: string;
  name: string;
  country: string;
  eyebrow: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  ascentM: number;
  descentM: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  days: number;
  hero: string;
  thumb: string;
  summary: string;
  huts: { name: string; night: number; pricePerNight: number; image: string }[];
  transport: { label: string; detail: string }[];
  packingList: PackItem[];
  reviews: { name: string; date: string; rating: number; text: string }[];
};

export const routes: Route[] = [
  {
    id: 'alta-via-1',
    name: 'Alta Via 1 Ridge Traverse',
    country: 'Italy',
    eyebrow: 'Curated route · Dolomites',
    rating: 4.9,
    reviewCount: 2140,
    distanceKm: 62,
    ascentM: 3240,
    descentM: 2110,
    difficulty: 'Hard',
    days: 6,
    hero: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
    summary: 'A six-day ridge traverse through the Dolomites, hut to hut, with one exposed via ferrata section on day 3.',
    huts: [
      { name: 'Rifugio Lagazuoi', night: 1, pricePerNight: 48, image: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?auto=format&fit=crop&w=500&q=80' },
      { name: 'Rifugio Averau', night: 2, pricePerNight: 52, image: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=500&q=80' }
    ],
    transport: [
      { label: 'Fly to Venice', detail: '1h 20m from most EU hubs' },
      { label: 'Shuttle to Cortina', detail: '2h 10m, about €25' },
      { label: 'Car rental option', detail: 'From €39/day' }
    ],
    packingList: [
      { id: 'boots', label: 'Waterproof hiking boots' },
      { id: 'pack', label: '40L trekking backpack' },
      { id: 'ferrata', label: 'Via ferrata kit (harness, lanyard, helmet)' },
      { id: 'down', label: 'Insulated down layer' },
      { id: 'rain', label: 'Rain jacket' },
      { id: 'poles', label: 'Trekking poles' }
    ],
    reviews: [
      { name: 'Marta H.', date: 'June 2026', rating: 5, text: "The Lagazuoi sunrise made every climbing step worth it. Book huts early, they fill fast in summer." },
      { name: 'Dario F.', date: 'August 2025', rating: 5, text: "Harder than expected on day 3. Bring poles for the descents." }
    ]
  },
  {
    id: 'tour-du-mont-blanc',
    name: 'Tour du Mont Blanc',
    country: 'France / Italy / Switzerland',
    eyebrow: 'Curated route · Mont Blanc massif',
    rating: 4.8,
    reviewCount: 3860,
    distanceKm: 170,
    ascentM: 10000,
    descentM: 9800,
    difficulty: 'Hard',
    days: 11,
    hero: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80',
    summary: 'The classic 11-day circuit around Mont Blanc, crossing three countries and dozens of mountain refuges.',
    huts: [
      { name: 'Refuge du Nant Borrant', night: 1, pricePerNight: 55, image: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=500&q=80' }
    ],
    transport: [
      { label: 'Fly to Geneva', detail: '1h from most EU hubs' },
      { label: 'Bus to Les Houches', detail: '1h, about €20' }
    ],
    packingList: [
      { id: 'boots', label: 'Broken-in hiking boots' },
      { id: 'pack', label: '45-55L trekking backpack' },
      { id: 'layers', label: 'Layering system for alpine weather' },
      { id: 'poles', label: 'Trekking poles' }
    ],
    reviews: [
      { name: 'Elke V.', date: 'July 2025', rating: 5, text: 'Book refuges months ahead for July/August. The scenery on day 4 is unreal.' }
    ]
  },
  {
    id: 'path-of-the-gods',
    name: 'Path of the Gods',
    country: 'Italy',
    eyebrow: 'Curated route · Amalfi Coast',
    rating: 4.7,
    reviewCount: 5220,
    distanceKm: 13,
    ascentM: 650,
    descentM: 680,
    difficulty: 'Easy',
    days: 1,
    hero: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=400&q=80',
    summary: 'A half-day coastal walk above the Amalfi Coast, easy enough for a first multi-hour hike.',
    huts: [],
    transport: [
      { label: 'Ferry or bus to Bomerano', detail: 'From Amalfi, about 1h' }
    ],
    packingList: [
      { id: 'shoes', label: 'Trail runners or light hiking shoes' },
      { id: 'water', label: '1.5L water' },
      { id: 'sun', label: 'Sun hat and sunscreen' }
    ],
    reviews: [
      { name: 'Noa P.', date: 'May 2026', rating: 5, text: 'Go early morning to beat the heat and the crowds. Worth every step.' }
    ]
  }
];

export function getRoute(id: string) {
  return routes.find((r) => r.id === id);
}
