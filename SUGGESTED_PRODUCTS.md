# Suggested Products Feature

## Overview

This feature adds suggested products to the product page using Hydrogen's deferred loading pattern. The suggested products are fetched from the same collection as the current product and displayed below the main product information.

## Implementation Details

### Components

1. **SuggestedProducts.tsx** - A reusable component that displays a grid of suggested products
2. **Product Page Integration** - Modified `products.$handle.tsx` to include suggested products

### Data Flow

1. **Deferred Loading**: Suggested products are loaded using the `loadDeferredData` function, which means they don't block the initial page render
2. **GraphQL Query**: Uses `SUGGESTED_PRODUCTS_QUERY` to fetch products from the same collection as the current product
3. **Suspense Boundary**: The suggested products are wrapped in a Suspense boundary with a loading fallback
4. **Data Processing**: The component filters out the current product from the suggestions

### GraphQL Query Structure

```graphql
query SuggestedProducts($handle: String!, $first: Int!) {
  product(handle: $handle) {
    collections(first: 1) {
      nodes {
        products(first: $first, filters: {available: true}) {
          nodes {
            ...SuggestedProduct
          }
        }
      }
    }
  }
}
```

### Features

- **Responsive Design**: Grid layout that adapts to different screen sizes
- **Hover Effects**: Smooth transitions and hover states for better UX
- **Loading States**: Proper loading indicators while data is being fetched
- **Error Handling**: Graceful handling of missing or invalid data
- **Performance**: Deferred loading ensures fast initial page render

### Styling

The component uses CSS Grid for responsive layout and includes:
- Hover animations (scale and translate effects)
- Proper spacing and typography
- Mobile-responsive design
- Consistent with the existing design system

## Usage

The suggested products will automatically appear on all product pages. The component:
1. Fetches products from the same collection as the current product
2. Filters out the current product from the suggestions
3. Displays up to 4 suggested products in a responsive grid
4. Includes proper loading states and error handling

## Customization

To customize the suggested products:
1. Modify the `SUGGESTED_PRODUCTS_QUERY` to change the selection criteria
2. Update the `SuggestedProducts` component styling
3. Adjust the number of products shown by changing the `first` parameter
4. Modify the title by passing a custom `title` prop to the component
