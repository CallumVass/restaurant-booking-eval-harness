const knipConfig = {
  entry: ['src/main.tsx'],
  project: ['src/**/*.{ts,tsx}'],
  ignore: ['src/api/**', 'src/components/ui/**'],
  ignoreDependencies: ['shadcn', 'tailwindcss', 'tw-animate-css'],
};

export default knipConfig;
