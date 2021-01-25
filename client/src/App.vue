<template>
    <div>
        <Loader v-if="isLoading" />
        <div class="container p-4">
            <div class="row">
                <div class="col-sm-4 col-md-3">
                    <Sidebar
                            @search="search"
                            @resetSearch="fetchProducts"
                    />
                </div>

                <div v-if="products.length" class="col-sm-8 col-md-9">
                    <h2 class="text-center">ТОП-3 найдешевші</h2>
                    <div class="row" >
                        <div
                                class="col-sm-6 col-md-4"
                                v-for="product in topThreeProducts"
                                :key="product.link"
                        >
                            <div class="shop__thumb" >
                                <a :href="product.link" target="_blank">
                                    <div class="shop-thumb__img">
                                        <img :src="product.image" class="img-responsive" alt="..." />
                                    </div>
                                    <h5 class="shop-thumb__title">{{ product.title }}</h5>
                                    <p>
                                        <b>{{ product.price }}</b> грн.
                                    </p>
                                    <p v-if="product.producer"><b>Виробник: </b>{{ product.producer }}</p>
                                    <p><b>Ціна за грам: </b>{{ product.pricePerGramm.toFixed(3) }}</p>
                                </a>
                            </div>
                        </div>
                    </div>

                    <ul class="shop__sorting">
                        <li class="active"><a href="#">Popular</a></li>
                        <li><a href="#">Newest</a></li>
                        <li><a href="#">Bestselling</a></li>
                        <li><a href="#">Price (low)</a></li>
                        <li><a href="#">Price (high)</a></li>
                    </ul>

                    <div class="row">
                        <div
                                class="col-sm-6 col-md-4"
                                v-for="product in allProducts"
                                :key="product.link"
                        >
                            <div class="shop__thumb">
                                <a :href="product.link" target="_blank">
                                    <div class="shop-thumb__img">
                                        <img :src="product.image" class="img-responsive" alt="..." />
                                    </div>
                                    <h5 class="shop-thumb__title">{{ product.title }}</h5>
                                    <p>
                                        <b>{{ product.price }}</b> грн.
                                    </p>
                                    <p v-if="product.producer"><b>Виробник: </b>{{ product.producer }}</p>
                                    <p><b>Ціна за грам: </b>{{ product.pricePerGramm.toFixed(3) }}</p>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                <div v-else class="col-sm-8 col-md-9">
                    <h3>На жаль, ми не змогли нічого знайти</h3>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Loader from "./components/Loader";
import Sidebar from "./components/Sidebar";
import productsService from "./services/productsService";
import { productMapper } from "./services/mapper";

export default {
    name: "App",
    components: {
        Loader, Sidebar
    },
    data: () => ({
        products: [],
        isLoading: true,
        param: ""
    }),
    async mounted() {
        await this.fetchProducts();
    },
    methods: {
        async fetchProducts(searchString = '') {
            try {
                this.isLoading = true;
                const response = await productsService.fetchProducts(searchString);
                this.products = response.products.map(productMapper);
                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.log(error);
            }
        },
        async search(param) {
            await this.fetchProducts(param);
        }
    },
    computed: {
        topThreeProducts() {
            return this.products.slice(0, 3);
        },
        dateNow() {
            const today = new Date();
            return today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        },
        allProducts() {
            return this.products.slice(3);
        },
    },
};
</script>

<style scoped>
@import "assets/main.css";
</style>
