import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Change base to match your repo name
export default defineConfig({
  plugins: [react()],
  base: "/frontend/", 
});
