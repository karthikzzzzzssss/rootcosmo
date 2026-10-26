import { Request, Response, NextFunction } from 'express';

/**
 * Guards admin-only endpoints (reading, exporting, updating and deleting
 * appointments — all of which expose patient PII) behind a shared secret.
 *
 * The client sends the admin password in the `x-admin-token` header; it must
 * match the ADMIN_TOKEN env var configured on the server. Public endpoints
 * (catalog reads, creating a booking) do not use this middleware.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    // Fail closed: if no token is configured, admin data must not be served.
    return res
      .status(503)
      .json({ success: false, error: 'Admin access is not configured on the server.' });
  }

  const provided = req.header('x-admin-token');
  if (!provided || provided !== expected) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  next();
}
