import type {V2_MetaFunction} from '@shopify/remix-oxygen';
import {type LoaderArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {Carousel, getForeignImages} from '~/components/Carousel';
import {ScrollCarouselComponent, getScrollCarouselImages} from '~/components/ScrollCarousel';
import {useScrollAnimation} from '~/hooks/useScrollAnimation';
import {PageFade} from '~/components/PageFade';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Foreign X-Change | Home'}];
};

export async function loader({context}: LoaderArgs) {
  const {storefront} = context;
  
  console.log('🔍 HOMEPAGE LOADER: Starting...');

  try {
    // Re-enabled GraphQL queries with correct tokens
    const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);
    console.log('🔍 Recommended products query initiated');
    return {recommendedProducts};
  } catch (error) {
    console.error('❌ Homepage loader error:', error);
    // Return empty data to prevent crashes
    return {
      recommendedProducts: Promise.resolve({
        buffaloBison: null,
        buffaloBraves: null,
        lasVegas: null
      })
    };
  }
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <PageFade className="home">
      <ScrollCarouselSection />
      <Suspense fallback={<div>Loading products...</div>}>
        <Await resolve={(data as any).recommendedProducts}>
          {(products) => {
            try {
              return <RecommendedProducts products={products} />;
            } catch (error) {
              console.error('❌ RecommendedProducts render error:', error);
              return (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-4">Unable to Load Products</h3>
                  <p className="text-gray-600 mb-4">
                    There was an error loading the products. Please try again later.
                  </p>
                </div>
              );
            }
          }}
        </Await>
      </Suspense>
    </PageFade>
  );
}

function ScrollCarouselSection() {
  const images = getScrollCarouselImages();
  const { isVisible, isFadingOut, elementRef } = useScrollAnimation({
    threshold: 0.2,
    rootMargin: '0px 0px -150px 0px'
  });
  
  return (
    <section 
      ref={elementRef}
      className={`scroll-carousel-section scroll-animate ${
        isVisible ? 'animate-in' : ''
      } ${
        isFadingOut ? 'fade-out' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <ScrollCarouselComponent 
          images={images}
          speed={3}
          smartSpeed={true}
          autoplay={true}
          autoplaySpeed={8}
          direction="rtl"
          margin={15}
          className=""
        />
      </div>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  const { isVisible, isFadingOut, elementRef } = useScrollAnimation({
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  });
  
  return (
    <div 
      ref={elementRef}
      className={`recommended-products max-w-7xl mx-auto px-4 py-12 scroll-animate ${
        isVisible ? 'animate-in' : ''
      } ${
        isFadingOut ? 'fade-out' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Products</h2>
        <Link
          to="/collections"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View all
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({buffaloBison, buffaloBraves, lasVegas}) => {
            // 🔍 DEBUG: Log products data on client side
            console.log('🔍 CLIENT SIDE DEBUG - RecommendedProducts:');
            console.log('Buffalo Bison:', buffaloBison);
            console.log('Buffalo Braves:', buffaloBraves);
            console.log('Las Vegas:', lasVegas);
            
            // Create ordered array: Buffalo Bison first, Buffalo Braves second, Las Vegas last
            const orderedProducts = [buffaloBison, buffaloBraves, lasVegas].filter(Boolean);
            
            if (!orderedProducts.length) {
              console.log('⚠️ No products to display');
              return (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-4">No Products Found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any products to display.
                  </p>
                </div>
              );
            }
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {orderedProducts.map((product, index) => {
                  console.log('🔍 Rendering product:', product.title, product.handle);
                  return (
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
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                        {product.images.nodes[0] ? (
                          <Image
                            data={product.images.nodes[0]}
                            aspectRatio="1/1"
                            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
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
                  );
                })}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}


const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    # Get Buffalo Bison jacket first
    buffaloBison: product(handle: "buffalo-bison-legend-jacket") {
      ...RecommendedProduct
    }
    # Get Buffalo Braves jacket second  
    buffaloBraves: product(handle: "buffalo-braves-legend-jacket") {
      ...RecommendedProduct
    }
    # Get Las Vegas jacket last
    lasVegas: product(handle: "las-vegas-legend-jacket") {
      ...RecommendedProduct
    }
  }
` as const;