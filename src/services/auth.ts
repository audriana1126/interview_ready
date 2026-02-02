export type User = {
    id: string;
    name: string;
    email: string;
};

export type LoginInput = {
    email: string;
    password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export async function register(input: RegisterInput): Promise<User> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Registration failed.");
  }

  localStorage.setItem("token", data.token);
  return data.user;
}

const API_URL = "http://localhost:4000";

export async function login(input: LoginInput): Promise<User> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    if (!res.ok) {
        throw new Error("Invalid email or password.");
    }

    const data = await res.json();

    //save JWT token
    localStorage.setItem("token", data.token);

    return data.user;
}

export async function getMe(): Promise<User | null> {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) return null;

    return res.json();
}
















