import { ledgerLivePreset } from '@ledgerhq/ldls-design-core'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Your project's files
    './node_modules/@ledgerhq/ldls-ui-react/dist/lib/**/*.{js,ts,jsx,tsx}', // Ledger UI Kit components
  ],
  presets: [ledgerLivePreset],
}

