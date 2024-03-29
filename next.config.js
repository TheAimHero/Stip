/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js');
import removeImports from 'next-remove-imports';

const remImports = removeImports();

/** @type {import("next").NextConfig} */
const config = {
  redirects: async () => [
    {
      source: '/dashboard',
      destination: '/dashboard/todos',
      permanent: true,
    },
    {
      source: '/settings',
      destination: '/settings/user',
      permanent: true,
    },
  ],
};

export default remImports(config);
