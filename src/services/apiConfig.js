const API_BASE_URL = (
    process.env.REACT_APP_API_URL || ""
).replace(/\/+$/, "");

export function getApiBaseUrl() {
    if (!API_BASE_URL) {
        throw new Error(
            "Falta configurar REACT_APP_API_URL en el archivo .env.local."
        );
    }

    return API_BASE_URL;
}