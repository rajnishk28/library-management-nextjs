export function saveSession(session) {
  localStorage.setItem("library_access_token", session.access_token);
  localStorage.setItem("library_role", session.role);
}

export function clearSession() {
  localStorage.removeItem("library_access_token");
  localStorage.removeItem("library_role");
}

export function getSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem("library_access_token");
  const role = localStorage.getItem("library_role");

  if (!token || !role) {
    return null;
  }

  return { token, role, user: decodeToken(token) };
}

export function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch {
    return null;
  }
}
