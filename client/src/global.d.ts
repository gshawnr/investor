// src/global.d.ts
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  // add other vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
