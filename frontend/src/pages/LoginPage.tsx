/**
 * LoginPage — Facade re-export.
 *
 * The visual auth UI now lives in AuthWorkstation.tsx (spatial 3D glass
 * substrate with crypto terminal animation). This file preserves the
 * named export that App.tsx lazy-loads via `named(() => import('./LoginPage'), 'LoginPage')`.
 */
export { AuthWorkstation as LoginPage } from './AuthWorkstation';
