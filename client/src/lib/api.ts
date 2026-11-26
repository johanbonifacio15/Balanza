
const API_URL = import.meta.env.VITE_API_URL ?? "";
const TOKEN_KEY = "balanza_token";

// Se guarde el token en localstorage para que se mantenga la sesion al hacer reload.
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// Envuelve fetch: agrega la URL base, el JSON, el token y se encarga de manejar errores
export async function api<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = getToken();

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
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