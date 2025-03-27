<template>
  <div class="github-login">
    <h1>GitHub OAuth PKCE Login Demo</h1>
    <button @click="loginWithGitHub">Login with GitHub</button>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "GitHubLoginPKCE",
  setup() {
    // GitHub OAuth configuration
    const clientId = "Ov23li8UwlxVAIOjBuUV";
    const redirectUri = "http://localhost:5173/success";
    const authorizationEndpoint = "https://github.com/login/oauth/authorize";
    const scopes = "read:user user:email";

    /**
     * Generate a random string to serve as the code verifier (PKCE mechanism).
     */
    const generateCodeVerifier = () => {
      const array = new Uint32Array(56);
      crypto.getRandomValues(array);
      return Array.from(array, (num) => num.toString(36)).join("");
    };

    /**
     * Create a base64-encoded SHA256 hash of the code verifier.
     */
    const generateCodeChallenge = async (codeVerifier) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return btoa(
          hashArray.map((byte) => String.fromCharCode(byte)).join("")
      )
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
    };

    /**
     * Handle the GitHub login flow.
     */
    const loginWithGitHub = async () => {
      // Step 1: Generate PKCE code verifier and challenge
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Save the code verifier to session storage for later use
      sessionStorage.setItem("pkce_code_verifier", codeVerifier);

      // Step 2: Redirect user to GitHub's authorization endpoint
      const authUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
          redirectUri
      )}&scope=${encodeURIComponent(scopes)}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256`;
      window.location.href = authUrl;
    };

    /**
     * Handle the callback from GitHub after the user authorizes.
     */
    const handleGitHubCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const codeVerifier = sessionStorage.getItem("pkce_code_verifier");

      if (code && codeVerifier) {
        // Exchange the authorization code for an access token
        const response = await fetch(tokenEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            client_id: clientId,
            code: code,
            code_verifier: codeVerifier,
            redirect_uri: redirectUri,
          }),
        });

        const data = await response.json();

        if (data.access_token) {
          console.log("Access Token:", data.access_token);

          // Use the access token to fetch the user's GitHub profile
          const userResponse = await fetch("https://api.github.com/user", {
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          });

          const userData = await userResponse.json();
          console.log("GitHub User Data:", userData);
        } else {
          console.error("Failed to exchange code for token:", data);
        }
      }
    };

    // Auto-handle the GitHub callback if `code` exists in the URL
    if (window.location.search.includes("code")) {
      handleGitHubCallback();
    }

    return {
      loginWithGitHub,
    };
  },
});
</script>

<style scoped>
button {
  background-color: #24292e;
  color: #ffffff;
  font-weight: bold;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #444d56;
}
</style>