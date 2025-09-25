import {CloseIcon} from './Icons';

/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```ts
 * <Aside id="search-aside" heading="SEARCH">`
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  id = 'aside',
  type,
}: {
  children?: React.ReactNode;
  heading: React.ReactNode;
  id?: string;
  type?: string;
}) {
  return (
    <div aria-modal className="overlay" id={id} role="dialog">
      <button
        className="close-outside"
        onClick={() => {
          history.go(-1);
          window.location.hash = '';
        }}
      />
      <aside>
        <header className="aside-header">
          <div className="aside-title-section">
            <h3>{heading}</h3>
            {type === 'cart' && <CartCountBadge />}
          </div>
          <CloseAside />
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

function CartCountBadge() {
  // This would need to be connected to cart data in a real implementation
  // For now, we'll return null to avoid the duplicate
  return null;
}

function CloseAside() {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a className="close" href="#" onChange={() => history.go(-1)}>
      <CloseIcon size={20} />
    </a>
  );
}

// Export a dummy useAside function for compatibility
export function useAside() {
  return {
    type: 'closed',
    open: () => {},
    close: () => {},
  };
}
