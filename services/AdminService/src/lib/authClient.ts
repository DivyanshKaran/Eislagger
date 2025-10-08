const AUTH_BASE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3002/api/v1/auth';

interface ApiResult<T> {
  ok: boolean;
  status: number;
  data?: T;
  error?: { code: string; message: string };
}

export async function updateUserRoleInAuth(userId: string, role: string, token?: string): Promise<ApiResult<{ userId: string; role: string }>> {
  const url = `${AUTH_BASE_URL}/users/${encodeURIComponent(userId)}/role`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ role })
  });
  const body = await safeJson(res);
  if (!res.ok) return { ok: false, status: res.status, error: body?.error || { code: 'AUTH_ROLE_UPDATE_FAILED', message: 'Failed to update role' } };
  return { ok: true, status: res.status, data: { userId, role } };
}

export async function deleteUserInAuth(userId: string, token?: string): Promise<ApiResult<{}>> {
  const url = `${AUTH_BASE_URL}/users/${encodeURIComponent(userId)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const body = await safeJson(res);
  if (!res.ok) return { ok: false, status: res.status, error: body?.error || { code: 'AUTH_DELETE_FAILED', message: 'Failed to delete user' } };
  return { ok: true, status: res.status };
}

export async function getUserBasicFromAuth(userId: string, token?: string): Promise<ApiResult<{ id: string; email: string; role: string; name?: string }>> {
  const url = `${AUTH_BASE_URL}/users/${encodeURIComponent(userId)}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  });
  const body = await safeJson(res);
  if (!res.ok) return { ok: false, status: res.status, error: body?.error || { code: 'AUTH_USER_FETCH_FAILED', message: 'Failed to fetch user' } };
  return { ok: true, status: res.status, data: body?.user || body };
}

async function safeJson(res: Response): Promise<any | null> {
  try { return await res.json(); } catch { return null; }
}


