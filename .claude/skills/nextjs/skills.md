# Next.js Skills Reference

## Overview
Next.js is a React-based framework that enables functionality such as server-side rendering and generating static websites. It provides a full-stack development experience with built-in features for production applications.

## Core Concepts

### Pages and Routing
- Next.js uses a file-based routing system in the `pages/` directory
- Each file corresponds to a route based on its filename
- Dynamic routes use brackets: `[id].js` becomes `/[id]`
- Nested routes are created with folders: `blog/[slug].js` becomes `/blog/[slug]`

### Components
- Use React functional components with hooks
- Server-side rendered components use `getServerSideProps`
- Static generation uses `getStaticProps` and `getStaticPaths`
- Client-side rendering happens by default for interactive components

### API Routes
- API endpoints are created in the `pages/api` directory
- Files in this directory are server-side code that doesn't run client-side
- Export a function handler that receives req and res objects

## Key Features

### Server-Side Rendering (SSR)
- Content is pre-rendered on the server for each request
- Use `getServerSideProps` to fetch data on each request
- Ideal for frequently updated content

### Static Site Generation (SSG)
- Content is pre-built at build time
- Use `getStaticProps` and `getStaticPaths`
- Ideal for content that doesn't change often

### Incremental Static Regeneration (ISR)
- Updates static content after build time
- Configure revalidation time with `revalidate` property
- Combines benefits of static generation with dynamic content

### Image Optimization
- Built-in `next/image` component for optimized images
- Automatic resizing, lazy loading, and format optimization
- Use `layout`, `placeholder`, and `blurDataURL` props for better UX

## File Structure
```
my-app/
├── pages/
│   ├── index.js
│   └── api/
│       └── hello.js
├── public/
├── styles/
└── components/
```

## Best Practices

### Performance
- Use dynamic imports (`import()` or `<Dynamic />`) for code splitting
- Leverage Next.js's automatic code splitting by route
- Optimize images with the `next/image` component
- Implement proper caching strategies

### SEO
- Use the `Head` component from `next/head` for meta tags
- Implement structured data for rich snippets
- Ensure fast loading times with optimization features

### Styling
- Use CSS Modules for component-scoped styles
- Leverage styled-jsx for component-level styling
- Integrate Tailwind CSS for utility-first styling

## Common Patterns

### Layouts
```jsx
export default function Layout({ children }) {
  return (
    <>
      <nav>...</nav>
      <main>{children}</main>
      <footer>...</footer>
    </>
  )
}
```

### Error Handling
- Create `_error.js` in the pages directory for global error handling
- Use `try/catch` blocks in data fetching functions
- Implement proper HTTP status codes

### Environment Variables
- Store secret keys in `.env.local` (server-side only)
- Prefix public variables with `NEXT_PUBLIC_`
- Access via `process.env.VARIABLE_NAME`

## Deployment
- Next.js apps can be deployed on Vercel with zero configuration
- Can also be deployed on any Node.js server or as static exports
- Use `next build` to create an optimized production build