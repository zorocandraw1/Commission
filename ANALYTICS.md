# Vercel Web Analytics Setup

This project has been configured with Vercel Web Analytics.

## How it works

1. The `@vercel/analytics` package is installed as a dependency
2. The `analytics.js` file imports and initializes the analytics
3. The build script bundles the analytics into `analytics.bundle.js`
4. The bundled script is loaded in `comm.html` before the main JavaScript

## Building

To rebuild the analytics bundle:

```bash
npm run build
```

## Deployment

When deployed to Vercel:
1. Ensure Web Analytics is enabled in your Vercel project dashboard
2. The analytics will automatically start tracking page views
3. No additional configuration is needed

## Development

The analytics script will load in development mode when running locally. To see analytics data:
- Deploy to Vercel
- Enable Web Analytics in your project settings
- Visit your site to generate analytics events

## Resources

- [Vercel Web Analytics Documentation](https://vercel.com/docs/analytics)
- [Quickstart Guide](https://vercel.com/docs/analytics/quickstart)
