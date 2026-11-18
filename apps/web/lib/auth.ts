// Client-side authentication and session management for Cortexa AI

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  persona: "school_student" | "college_student" | "job_seeker";
  institution?: string;
  targetRole?: string;
  createdAt: string;
};

const USERS_STORAGE_KEY = "cortexa_registered_users";
const SESSION_STORAGE_KEY = "cortexa_active_session";

export function getRegisteredUsers(): Array<UserProfile & { passwordHash: string }> {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function registerUser(params: {
  name: string;
  email: string;
  password: string;
  persona?: "school_student" | "college_student" | "job_seeker";
  institution?: string;
  targetRole?: string;
}): UserProfile {
  if (typeof window === "undefined") {
    throw new Error("Cannot register in server context");
  }

  const emailClean = params.email.trim().toLowerCase();
  const users = getRegisteredUsers();

  const existing = users.find((u) => u.email.toLowerCase() === emailClean);
  if (existing) {
    throw new Error("An account with this email address already exists. Please sign in.");
  }

  const newUser: UserProfile = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: params.name.trim() || "Student Scholar",
    email: emailClean,
    persona: params.persona || "college_student",
    institution: params.institution || "Tech Institute",
    targetRole: params.targetRole || "Software Engineer",
    createdAt: new Date().toISOString(),
  };

  users.push({
    ...newUser,
    passwordHash: params.password, // Local authentication credential store
  });

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  // Auto establish active session upon successful registration
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
  return newUser;
}

export function loginUser(email: string, password: string): UserProfile {
  if (typeof window === "undefined") {
    throw new Error("Cannot login in server context");
  }

  const emailClean = email.trim().toLowerCase();
  const users = getRegisteredUsers();

  // Find user by exact email and password match
  const user = users.find(
    (u) => u.email.toLowerCase() === emailClean && u.passwordHash === password
  );

  if (!user) {
    throw new Error("Invalid email or password. Please verify your credentials or create an account.");
  }

  const profile: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    persona: user.persona,
    institution: user.institution,
    targetRole: user.targetRole,
    createdAt: user.createdAt,
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

export function getCurrentUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
