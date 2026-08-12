import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';

interface Props {
  /** The marketing landing page, shown only to visitors with no session. */
  children: React.ReactNode;
}

/**
 * Guards "/" so returning learners land where they actually work.
 *
 * A visitor who already has a session (real Supabase login OR guest) has
 * already been through the front door, so send them straight to the portal
 * instead of making them scroll the marketing page every visit. Brand-new
 * visitors still get the full landing page.
 *
 * `?stay=1` bypasses the redirect, so the landing page stays reachable for
 * signed-in users (footer/logo links, and for anyone reviewing the copy).
 */
export const LandingOrPortal: React.FC<Props> = ({ children }) => {
  const [params] = useSearchParams();
  if (params.get('stay') === '1') return <>{children}</>;
  return isAuthenticated() ? <Navigate to="/portal" replace /> : <>{children}</>;
};

export default LandingOrPortal;
