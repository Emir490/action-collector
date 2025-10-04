import { Hand, Package, Snowflake } from 'lucide-react';

export interface Phrase {
  text: string;
  category: string;
}

export interface Category {
  name: string;
  icon: typeof Hand;
  phrases: string[];
}

export const commonPhrases: Phrase[] = [
  { text: 'abrazar', category: 'acciones' },
  { text: 'caminar', category: 'acciones' },
  { text: 'jugar', category: 'acciones' },
  { text: 'libro', category: 'objetos' }
];

export const allPhrases: Phrase[] = [
  { text: 'abrazar', category: 'acciones' },
  { text: 'agarrar', category: 'acciones' },
  { text: 'aplastar', category: 'acciones' },
  { text: 'bailar', category: 'acciones' },
  { text: 'caminar', category: 'acciones' },
  { text: 'cerrar', category: 'acciones' },
  { text: 'golpear', category: 'acciones' },
  { text: 'guardar', category: 'acciones' },
  { text: 'invitar', category: 'acciones' },
  { text: 'jugar', category: 'acciones' },
  { text: 'libro', category: 'objetos' },
  { text: 'fabrica', category: 'objetos' },
  { text: 'luna', category: 'objetos' },
  { text: 'Tijuana', category: 'lugares' },
  { text: 'frio', category: 'otros' },
  { text: 'sin_accion', category: 'otros' }
];

export const phraseCategories: Category[] = [
  {
    name: 'Acciones',
    icon: Hand,
    phrases: [
      'abrazar', 'agarrar', 'aplastar', 'bailar', 'caminar', 
      'cerrar', 'golpear', 'invitar', 'jugar', 'guardar'
    ]
  },
  {
    name: 'Objetos / Lugares',
    icon: Package,
    phrases: ['libro', 'fabrica', 'luna', 'Tijuana']
  },
  {
    name: 'Otros',
    icon: Snowflake,
    phrases: ['frio', 'sin_accion']
  }
];

