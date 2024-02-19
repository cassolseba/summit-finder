import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/HomeView.vue"
import Search from "@/views/SearchView.vue"
import Wishlist from "@/views/WishlistView.vue"
import Login from "@/views/LoginView.vue"

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: "Summit Finder"
        }
    },
    {
        path: '/wishlist',
        name: 'Wishlist',
        component: Wishlist,
        meta: {
            title: "Wishlist"
        }
    },
    {
        path: '/search',
        name: 'Search',
        component: Search,
        meta: {
            title: "Search tour"
        }
    },
    {
        path:'/login',
        name: 'Login',
        component: Login,
        meta: {
            title: "Login"
        }
    }
    // {
    //     path: "*",
    //     name: "NotFound",
    //     meta: {
    //         title: "Page not found"
    //     }
    // }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;