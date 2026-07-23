const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || data?.error || "Something went wrong");
  }
  return data;
}

/** Register a new patient user */
export async function registerUser({ firstName, lastName, email, password, gender, phone, age, bloodGroup }) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ firstName, lastName, email, password, gender, phone, age, bloodGroup }),
  });
}

/** Verify email OTP */
export async function verifyOtp({ email, otp }) {
  return request("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
}

/** Resend OTP to email */
export async function resendOtp({ email }) {
  return request("/api/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/** Login with email + password */
export async function loginWithPassword({ email, password }) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
