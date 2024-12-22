export const decodeBase64URL = (base64URL: string) => {
    const base64 = base64URL.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    return atob(base64 + padding);
}

export const validateJWT = (token: string | null): boolean => {
    console.log(token)
    if (!token) {
        console.log("No access token.");
        return false;
    }

    try {
        const payload = JSON.parse(decodeBase64URL(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch (error) {
        console.error("Failed to validate JWT:", error);
        return false;
    }
}