import keycloak from "./keycloak";

// The ONLY address the client knows: the API Gateway
const BASE_URL = "http://localhost:8080";

async function request(path, options = {}) {
    try {
        // If the token expires within 30 seconds, get a fresh one first
        await keycloak.updateToken(30);
    } catch {
        keycloak.login(); // the session expired: go back to the login page
        throw new Error("Session expired. Redirecting to the login page...");
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
            ...options.headers,
        },
    });

    if (response.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
    }

    if (!response.ok) {
        let message = `Request failed (${response.status})`;
        try {
            const body = await response.json();
            if (body.message) message = body.message;
        } catch {
            // the response had no JSON body
        }
        throw new Error(message);
    }

    if (response.status === 204) return null; // "No Content", e.g. after DELETE
    return response.json();
}

export const api = {
    get: (path) => request(path),
    post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
    put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
    patch: (path) => request(path, { method: "PATCH" }),
    delete: (path) => request(path, { method: "DELETE" }),
};