
const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function api<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const body = await response.json().catch(() => null);

        throw new Error(body?.error ?? "Error en la petición");
    }

    // El DELETE no trae cuerpo
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}