import { ledgerLivePreset } from '@ledgerhq/lumen-design-core'

/** @type {import('tailwindcss').Config} */
export default {
  // Lumen's own sources are registered by its `@ledgerhq/lumen-ui-react/tailwind.css`.
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  presets: [ledgerLivePreset],
}
