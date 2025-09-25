import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {SuggestedProductFragment} from 'storefrontapi.generated';
import {useScrollAnimation} from '~/hooks/useScrollAnimation';

interface SuggestedProductsProps {
  products: SuggestedProductFragment[];
  title?: string;
}

export function SuggestedProducts({products, title = "You might also like"}: SuggestedProductsProps) {
  const { isVisible, isFadingOut, elementRef } = useScrollAnimation({
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  });

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section 
      ref={elementRef}
      className={`suggested-products max-w-7xl mx-auto px-4 py-12 scroll-animate ${
        isVisible ? 'animate-in' : ''
      } ${
        isFadingOut ? 'fade-out' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Link
          to="/collections"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View all
        </Link>
      </div>
      
      <div className="suggested-products-grid">
        {products.map((product, index) => (
          <Link
            key={product.id}
            className={`group block scroll-animate-stagger ${
              isVisible ? 'animate-in' : ''
            } ${
              isFadingOut ? 'fade-out' : ''
            }`}
            style={{
              transitionDelay: `${index * 100}ms`
            }}
            to={`/products/${product.handle}`}
          >
            <div className="suggested-product-image">
              {product.featuredImage ? (
                <Image
                  data={product.featuredImage}
                  aspectRatio="1/1"
                  sizes="(min-width: 1024px) 200px, (min-width: 768px) 180px, 150px"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>
            <h4 className="font-medium text-lg mb-1">{product.title}</h4>
            <div className="text-gray-600">
              <Money data={product.priceRange.minVariantPrice} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
