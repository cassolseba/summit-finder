import { createRouter, createWebHistory } from "vue-router";
import { Home } from "../views/Home.vue"
import { Search } from "../views/Search.vue"
import { Wishlist } from "../views/Wishlist.vue"

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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});