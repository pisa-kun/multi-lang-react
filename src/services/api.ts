export type UserSettings = {
  preferredLocale: string;
};

export async function login(): Promise<{ success: boolean; userId: string }> {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  return response.json();
}

export async function fetchUserSettings(): Promise<UserSettings> {
  const response = await fetch('/api/user-settings');
  if (!response.ok) {
    throw new Error('Failed to fetch user settings');
  }
  return response.json();
}

export async function saveUserSettings(payload: Partial<UserSettings>): Promise<UserSettings> {
  const response = await fetch('/api/user-settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to save user settings');
  }
  return response.json();
}
