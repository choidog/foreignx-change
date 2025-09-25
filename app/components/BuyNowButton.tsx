import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

export function BuyNowButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  // Create checkout URL from lines
  const createCheckoutUrl = () => {
    if (!lines || lines.length === 0) return '#';
    
    const checkoutItems = lines.map(line => {
      const variantId = line.merchandiseId?.replace('gid://shopify/ProductVariant/', '') || '';
      const quantity = line.quantity || 1;
      return `${variantId}:${quantity}`;
    }).join(',');
    
    return `/cart/${checkoutItems}`;
  };

  const checkoutUrl = createCheckoutUrl();

  return (
    <a 
      href={checkoutUrl}
      className="btn btn-secondary"
      onClick={onClick}
      style={{ textDecoration: 'none' }}
    >
      {children}
    </a>
  );
}
