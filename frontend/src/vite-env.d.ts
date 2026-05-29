/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public site origin used for Supabase email-verification redirects. */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
