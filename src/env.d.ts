// env.d.ts
/// <reference types="vite/client" />


interface ImportMetaEnv {
    VITE_ASTRA_LANGFLOW_TOKEN: string;
    VITE_LANGFLOW_BASE_PATH: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }