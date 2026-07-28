import { describe, it, expect, vi } from 'vitest';
import type { Request, Response } from 'express';
import { requirePermission, requireSuperAdmin, type AuthUser } from './auth.middleware';

function run(
  guard: (req: Request, res: Response, next: () => void) => void,
  authUser: AuthUser | undefined,
  method = 'GET',
) {
  const req = { authUser, method } as unknown as Request;
  const status = vi.fn().mockReturnThis();
  const json = vi.fn().mockReturnThis();
  const res = { status, json } as unknown as Response;
  const next = vi.fn();

  guard(req, res, next);
  const statusCode = status.mock.calls[0]?.[0];
  return { allowed: next.mock.calls.length > 0, statusCode };
}

const superAdmin: AuthUser = { id: '1', role: 'Super Admin', email: 'a@b.c' };
const marketing: AuthUser = {
  id: '2',
  role: 'Marketing',
  email: 'm@b.c',
  permissions: { newsAndRegulations: { view: true, edit: false } },
};

describe('requirePermission', () => {
  it('lets Super Admin through regardless of matrix', () => {
    expect(run(requirePermission('properties'), superAdmin, 'DELETE').allowed).toBe(true);
  });

  it('allows a GET when the user has view', () => {
    expect(run(requirePermission('newsAndRegulations'), marketing, 'GET').allowed).toBe(true);
  });

  it('denies a write when the user only has view', () => {
    const { allowed, statusCode } = run(requirePermission('newsAndRegulations'), marketing, 'POST');
    expect(allowed).toBe(false);
    expect(statusCode).toBe(403);
  });

  it('denies a key the user has no entry for', () => {
    expect(run(requirePermission('properties'), marketing, 'GET').allowed).toBe(false);
  });

  it('denies when there is no authenticated user', () => {
    const { allowed, statusCode } = run(requirePermission('properties'), undefined);
    expect(allowed).toBe(false);
    expect(statusCode).toBe(401);
  });
});

describe('requireSuperAdmin', () => {
  it('allows Super Admin', () => {
    expect(run(requireSuperAdmin, superAdmin).allowed).toBe(true);
  });

  it('rejects non Super Admin with 403', () => {
    const { allowed, statusCode } = run(requireSuperAdmin, marketing);
    expect(allowed).toBe(false);
    expect(statusCode).toBe(403);
  });
});
