export type Category = 
  | 'ALL'
  | 'SCULPTURE' 
  | 'GARDEN' 
  | 'FOUNTAINS' 
  | 'ANIMALS' 
  | 'DECORATIVE ART' 
  | 'INSTRUMENTS' 
  | 'MONUMENTAL';

export interface Artwork {
  id: string;
  title: string;
  frenchTitle?: string;
  subtitle: string;
  category: Category;
  year: number;
  dimensions: string;
  weight?: string;
  materials: string[];
  techniques: string[];
  finishes: string[];
  colorPalette: { name: string; hex: string }[];
  location?: string;
  description: string;
  curatorNotes: string;
  inspiration: string;
  image: string;
  secondaryImages: string[];
  availability: 'AVAILABLE' | 'PRIVATE_COLLECTION' | 'LIMITED_EDITION' | 'ARCHIVE' | 'COMMISSION_ONLY';
  edition?: string;
  priceEstimate?: string;
  featured?: boolean;
  isMonumental?: boolean;
}

export interface MonumentalProject {
  id: string;
  title: string;
  frenchTitle: string;
  clientOrLocation: string;
  year: number;
  dimensions: string;
  materials: string[];
  heroImage: string;
  galleryImages: string[];
  concept: string;
  architecturalContext: string;
  engineeringNotes: string;
  status: string;
}

export interface Technique {
  id: string;
  name: string;
  frenchName: string;
  category: string;
  tagline: string;
  description: string;
  process: string[];
  textureImage: string;
  processImage: string;
  artisanQuote: string;
  keyMaterials: string[];
}

export interface TimelineMilestone {
  id: string;
  year: string;
  period: string;
  title: string;
  subtitle: string;
  narrative: string;
  location: string;
  image: string;
  quote?: string;
}

export interface GardenZone {
  id: string;
  name: string;
  frenchName: string;
  description: string;
  flora: string[];
  focalPieceId: string;
  focalPieceTitle: string;
  atmosphere: string;
  xPercent: number; // For interactive garden map
  yPercent: number;
  image: string;
  audioSoundscape?: string;
}

export interface CommissionStep {
  number: string;
  title: string;
  frenchTitle: string;
  duration: string;
  description: string;
  deliverables: string[];
  image: string;
}

export interface MediaArticle {
  id: string;
  title: string;
  outlet: string;
  section: string;
  date: string;
  url: string;
  excerpt: string;
  extendedBody?: string;
  quote?: string;
  stats?: { label: string; value: string }[];
  tags: string[];
  image: string;
  isMainHeadline?: boolean;
}

export type BlogCategory =
  | 'ATELIER'
  | 'PROJETOS'
  | 'MATERIAIS'
  | 'JARDIM'
  | 'IMPRENSA'
  | 'COMUNIDADE';

export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'list'; items: string[] };

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: BlogCategory;
  date: string;
  author: string;
  authorRole?: string;
  readingTimeMinutes: number;
  excerpt: string;
  coverImage: string;
  tags: string[];
  featured?: boolean;
  blocks: BlogBlock[];
}

export type ProductCategory = 'ESCULTURAS' | 'OBRAS' | 'EDIÇÕES' | 'OBJETOS' | 'COLEÇÕES';

export type ProductStatus = 'AVAILABLE' | 'SOLD';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  description: string[];
  price: number;
  images: string[];
  dimensions?: string;
  materials?: string[];
  technique?: string;
  year?: number;
  weight?: string;
  edition?: string;
  stock: number;
  status: ProductStatus;
  featured?: boolean;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  clientType: 'PRIVATE_COLLECTOR' | 'INTERIOR_DESIGNER' | 'LANDSCAPE_ARCHITECT' | 'INSTITUTION' | 'HOSPITALITY';
  projectType: 'ACQUISITION' | 'MONUMENTAL_COMMISSION' | 'GARDEN_INSTALLATION' | 'CUSTOM_FOUNTAIN' | 'PRIVATE_VIEWING';
  preferredMaterials: string[];
  estimatedBudget: string;
  intendedLocation: string;
  message: string;
  selectedArtworks: string[];
}
