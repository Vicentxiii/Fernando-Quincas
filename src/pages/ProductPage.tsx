import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ShieldCheck, Truck, Award, Mail } from 'lucide-react';
import { getProductBySlug, formatPrice, isAvailable } from '../data/products';
import { useCart } from '../context/CartContext';
import { ProductGallery } from '../components/shop/ProductGallery';
import { RelatedProducts } from '../components/shop/RelatedProducts';
import { Reveal } from '../components/shop/Reveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProductBySlug(slug);
  const { addItem } = useCart();

  useDocumentMeta({
    title: product ? `${product.name} — Loja` : 'Obra não encontrada — Loja',
    description: product?.shortDescription,
    image: product?.images[0],
    canonical: product ? `https://fernandoquincas.com.br/loja/${product.slug}` : 'https://fernandoquincas.com.br/loja',
    type: product ? 'product' : 'website',
    keywords: product ? `${product.name}, Fernando Quincas, fibra de vidro, ${product.category}` : undefined,
  });

  // JSON-LD structured data for the product (SPA navigation — prerender já injeta no HTML estático via scripts/prerender.ts:284)
  useEffect(() => {
    if (!product) return;
    const SITE_URL = 'https://fernandoquincas.com.br';
    const url = `https://fernandoquincas.com.br/loja/${product.slug}`;
    const absImages = product.images.map((img) => (img.startsWith('http') ? img : `${SITE_URL}${img}`));
    const availability =
      product.status !== 'AVAILABLE' || product.stock <= 0
        ? 'https://schema.org/OutOfStock'
        : product.stock === 1
          ? 'https://schema.org/LimitedAvailability'
          : 'https://schema.org/InStock';

    const payload = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${url}#product`,
      name: product.name,
      description: product.shortDescription,
      category: product.categories ? product.categories.join(', ') : product.category,
      image: absImages,
      sku: product.id,
      mpn: product.id,
      brand: { '@type': 'Brand', name: 'Ateliê Fernando Quincas' },
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'BRL',
        price: product.price,
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        availability,
        itemCondition: 'https://schema.org/NewCondition',
        seller: { '@type': 'Organization', name: 'Ateliê Fernando Quincas', url: SITE_URL },
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-jsonld';
    script.textContent = JSON.stringify(payload);
    document.head.appendChild(script);

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Loja', item: `${SITE_URL}/loja` },
        { '@type': 'ListItem', position: 3, name: product.name, item: url },
      ],
    };
    const bScript = document.createElement('script');
    bScript.type = 'application/ld+json';
    bScript.id = 'product-breadcrumb-jsonld';
    bScript.textContent = JSON.stringify(breadcrumb);
    document.head.appendChild(bScript);

    return () => {
      document.getElementById('product-jsonld')?.remove();
      document.getElementById('product-breadcrumb-jsonld')?.remove();
    };
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center space-y-6 bg-[#FAF8F5] text-[#1E1D1A] pt-24">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C8A86B]">Loja</span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold">Obra não encontrada</h1>
        <p className="font-serif italic text-[#8A82A5] max-w-md">
          A peça que você procura pode ter encontrado um novo lar ou nunca ter existido no acervo.
        </p>
        <Link
          to="/loja"
          className="px-6 py-3 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-xs font-mono tracking-widest uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors"
        >
          Voltar à Loja
        </Link>
      </div>
    );
  }

  const available = isAvailable(product);
  const isObra = product.category === 'OBRAS' || product.categories?.includes('OBRAS');

  const details: { label: string; value?: string | number }[] = [
    { label: 'Dimensões', value: product.dimensions },
    { label: 'Materiais', value: product.materials?.join(', ') },
    { label: 'Técnica', value: product.technique },
    { label: 'Ano', value: product.year },
    { label: 'Peso', value: product.weight },
    { label: 'Edição', value: product.edition },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1D1A]">
      {/* Breadcrumbs */}
      <nav aria-label="Trilha de navegação" className="pt-32 sm:pt-36 px-6 sm:px-8 md:px-12 max-w-7xl mx-auto">
        <Reveal>
          <ol className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-[#8A82A5]">
            <li>
              <Link to="/loja" className="hover:text-[#C8A86B] transition-colors">
                Loja
              </Link>
            </li>
            <li aria-hidden className="text-[#C8A86B]/60">
              /
            </li>
            <li className="hidden sm:block">
              <Link
                to={`/loja?categoria=${encodeURIComponent(product.category)}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/loja');
                }}
                className="hover:text-[#C8A86B] transition-colors"
              >
                {product.categories ? product.categories.join(' • ') : product.category}
              </Link>
            </li>
            <li aria-hidden className="hidden sm:block text-[#C8A86B]/60">
              /
            </li>
            <li className="text-[#1E1D1A] truncate max-w-[40vw]">{product.name}</li>
          </ol>
        </Reveal>

        {/* Mobile back link */}
        <button
          onClick={() => navigate('/loja')}
          className="sm:hidden mt-4 inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase text-[#C8A86B]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar à Loja
        </button>
      </nav>

      {/* Main composition */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <Reveal>
          <ProductGallery product={product} />
        </Reveal>

        <div className="space-y-8 lg:sticky lg:top-28 self-start">
          <Reveal delay={100}>
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A86B]">
                <span className="w-8 h-px bg-[#C8A86B]/60" />
                {product.categories ? product.categories.join(' • ') : product.category}
                {product.year ? ` · ${product.year}` : ''}
              </span>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight font-light">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4">
                <span className="font-serif text-2xl sm:text-3xl">{formatPrice(product.price)}</span>
                <span
                  className={`flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase ${
                    available ? 'text-[#6A7D69]' : 'text-[#8A82A5]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-[#C8A86B]' : 'bg-[#D8D2C4]'}`} />
                  {available
                    ? product.stock === 1
                      ? 'Peça Única · Disponível'
                      : `Disponível · ${product.stock} em estoque`
                    : 'Obra Adquirida'}
                </span>
              </div>

              <p className="font-serif italic text-lg text-[#8A82A5] leading-relaxed border-l-2 border-[#C8A86B]/50 pl-4">
                {product.shortDescription}
              </p>
            </div>
          </Reveal>

          <Reveal delay={180}>
            {available ? (
              <button
                onClick={() => addItem(product.slug)}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-[#1E1D1A] text-[#FAF8F5] text-[11px] font-mono tracking-[0.25em] uppercase hover:bg-[#C8A86B] hover:text-[#1E1D1A] transition-colors duration-300 min-h-[52px]"
              >
                {isObra ? 'Adquirir Obra' : 'Adquirir'}
                <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            ) : (
              <div className="space-y-4">
                <div className="inline-flex w-full sm:w-auto items-center justify-center px-10 py-4 rounded-full border border-[#C8A86B]/40 bg-[#FDFCFB] text-[11px] font-mono tracking-[0.25em] uppercase text-[#8A82A5] cursor-default">
                  {isObra ? 'Obra Adquirida' : 'Produto Esgotado'}
                </div>
                <a
                  href={`mailto:byfernandoscenesgarden@gmail.com?subject=${encodeURIComponent(
                    `Lista de interesse — ${product.name}`
                  )}`}
                  className="group flex items-center gap-2 text-[11px] font-mono tracking-[0.18em] uppercase text-[#C8A86B] hover:text-[#9C7D3E] transition-colors underline underline-offset-4 decoration-[#C8A86B]/40"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Entrar na lista de interesse
                </a>
              </div>
            )}
          </Reveal>

          <Reveal delay={240}>
            <dl className="divide-y divide-[#C8A86B]/15 border-y border-[#C8A86B]/15">
              {details
                .filter((d) => d.value !== undefined && d.value !== '')
                .map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-[110px_1fr] sm:grid-cols-[140px_1fr] gap-4 py-3.5">
                    <dt className="text-[9px] font-mono tracking-[0.22em] uppercase text-[#C8A86B] pt-0.5">
                      {label}
                    </dt>
                    <dd className="text-sm font-light text-[#2C2A26]/90 leading-relaxed">{value}</dd>
                  </div>
                ))}
            </dl>
          </Reveal>

          <Reveal delay={300}>
            <div className="rounded-2xl border border-[#C8A86B]/25 bg-[#FDFCFB] p-5 sm:p-6 space-y-3">
              <p className="flex items-start gap-3 text-xs font-light text-[#2C2A26]/80 leading-relaxed">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#C8A86B] mt-0.5" />
                Certificado de autenticidade assinado por Fernando Quincas acompanha todas as obras.
              </p>
              <p className="flex items-start gap-3 text-xs font-light text-[#2C2A26]/80 leading-relaxed">
                <Truck className="w-4 h-4 shrink-0 text-[#C8A86B] mt-0.5" />
                Envio em embalagem de museu com seguro total. Instalação assistida disponível para
                peças de grande porte.
              </p>
              <p className="flex items-start gap-3 text-xs font-light text-[#2C2A26]/80 leading-relaxed">
                <Award className="w-4 h-4 shrink-0 text-[#C8A86B] mt-0.5" />
                Aquisição conduzida diretamente pelo ateliê, com acompanhamento personalizado.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Full description */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 pb-24">
        <Reveal>
          <div className="max-w-2xl space-y-6 border-t border-[#C8A86B]/25 pt-14">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C8A86B] block">
              {isObra ? 'Sobre a Obra' : 'Sobre a Peça'}
            </span>
            {product.description.map((paragraph, i) => (
              <p key={i} className="text-base font-light text-[#2C2A26]/85 leading-[1.9]">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      <RelatedProducts product={product} />
    </div>
  );
};
