import { createRouter, createWebHistory } from "vue-router";
import GitHubSuccess from "@/components/GithubSuccess.vue";
import GithubLogin from "@/components/GithubLogin.vue";

const routes = [
    {
        path: "/success", // GitHub redirect URI
        name: "GitHubSuccess",
        component: GitHubSuccess, // Renders the component responsible for handling GitHub OAuth
    },
    // default homepage route
    {
        path: "/",
        name: "GitHubLogin",
        component: GithubLogin
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;