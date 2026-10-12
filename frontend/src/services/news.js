const API_URL = import.meta.env.VITE_API_URL;

export async function getEvents() {
  const response = await fetch(
    `${API_URL}/api/events`
  );

  if (!response.ok) {
    throw new Error(
      `API gagal: ${response.status}`
    );
  }

  return response.json();
}
