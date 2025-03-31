<template>
  <div class="github-success">
    <h1 v-if="loading">Github login in progress</h1>
    <h1 v-else>GitHub Login Successful!</h1>
    <div v-if="loading">Loading user information...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <h2>Welcome, {{ userInfo.name || userInfo.login }}!</h2>
      <p><strong>Username:</strong> {{ userInfo.login }}</p>
      <p><strong>Email:</strong> {{ userInfo.email || "Not available" }}</p>
      <p><strong>GitHub URL:</strong> <a :href="userInfo.html_url" target="_blank">{{ userInfo.html_url }}</a></p>
      <img :src="userInfo.avatar_url" alt="User Avatar" width="100" height="100" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  name: "GitHubSuccess",
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const userInfo = ref({});

    // GitHub OAuth Config
    // const clientId = "Ov23li8UwlxVAIOjBuUV";
    // // const clientSecret = "87c85021fa17fff2307503b0b303b3a5a22b81a6"
    // const tokenEndpoint = "https://github.com/login/oauth/access_token";
    // const redirectUri = "http://localhost:5173/success";

    /**
     * Parse URL and extract the "code" parameter.
     */
    const getCodeFromUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("code");
    };

    /**
     * Exchange the authorization code for an access token.
     */
    const fetchAccessToken = async (code) => {
      try {
        const response = await fetch("http://localhost:3000/login?code=" + code)
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error_description || "Unable to fetch access token.");
        }
        return data.access_token;
      } catch (err) {
        throw new Error("Error fetching access token: " + err.message);
      }
    };

    /**
     * Fetch GitHub user data using the access token.
     */
    const fetchGitHubUser = async (accessToken) => {
      try {
        const response = await fetch("http://localhost:3000/user");
        return await response.json();
      } catch (err) {
        throw new Error("Error fetching GitHub user data: " + err.message);
      }
    };

    /**
     * Initialize by handling the redirect.
     */
    const handleRedirect = async () => {
      try {
        const code = getCodeFromUrl();

        if (!code) {
          throw new Error("Authorization code not found in the URL.");
        }
        // Step 1: Exchange the authorization code for an access token
        const accessToken = await fetchAccessToken(code);

        // Step 2: Use the access token to fetch the GitHub user's info
        const user = await fetchGitHubUser(accessToken);

        // Step 3: Display the user info
        userInfo.value = user;
        loading.value = false;
      } catch (err) {
        error.value = err.message;
        loading.value = false;
      }
    };

    // Call the logic after component is mounted
    onMounted(() => {
      handleRedirect();
    });

    return {
      loading,
      error,
      userInfo,
    };
  },
});
</script>

<style scoped>
.github-success {
  text-align: center;
  padding: 20px;
}
.error {
  color: red;
  font-weight: bold;
}
img {
  border-radius: 50%;
  margin-top: 10px;
}
</style>