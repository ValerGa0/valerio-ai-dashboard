import { defineConfig } from 'vite';

// Expose only explicitly public client-side variables. Never expose SUPABASE_SERVICE_ROLE_KEY.
export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_']
});
