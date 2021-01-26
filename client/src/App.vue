<template>
    <div>
        <Loader v-if="isLoading" />
        <div class="container p-4">
            <div class="row">
                <div class="col-sm-4 col-md-3">
                    <Search @search="search" @resetSearch="fetchProducts" />
                    <form class="shop__filter">
                        <div class="filters" v-for="(options, keyOption) in filters" :key="keyOption">
                            <h3 class="headline">
                                <span>{{ options.name }}</span>
                            </h3>
                            <div
                                    class="checkbox"
                                    v-for="(param, keyParam) in options.options"
                                    :key="keyParam"
                            >
                                <input
                                        @change="function (e) {
                      filtersProducts(allProducts, checkedFilter);
                    }
                  "
                                        type="checkbox"
                                        class="checkbox"
                                        :value="param.name"
                                        :id="'shop-filter-checkbox' + param.__ob__.dep.id"
                                        v-model="checkedFilter[options.type]"
                                />
                                <label :for="'shop-filter-checkbox' + param.__ob__.dep.id">{{
                                    param.name
                                    }}</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="col-sm-8 col-md-9">
                    <h2 class="text-center">ТОП-3 найдешевші</h2>
                    <div class="row">
                        <div
                                class="col-sm-6 col-md-4"
                                v-for="product in topThreeProducts"
                                :key="product.id"
                        >
                            <Card :product="product" />
                        </div>
                    </div>
                    <ul class="shop__sorting">
                        <li
                                :class="{ active: val }"
                                @click.prevent="sortProducts(allProducts, key, val)"
                                v-for="(val, key) in sorted"
                                :key="key"
                        >
                            <a href="#">{{ key }}</a>
                        </li>
                    </ul>

                    <div class="row">
                        <div
                                class="col-sm-6 col-md-4"
                                v-for="product in allProductsFilterSort"
                                :key="product.link"
                        >
                            <Card :product="product" />
                        </div>
                    </div>
                </div>

                <div class="col-sm-8 col-md-9"></div>
            </div>
        </div>
    </div>
</template>

<script>
import Card from "./components/Card.vue";
import Search from "./components/Search.vue";
import Loader from "./Loader";
import productsService from "./services/productsService";
import { productMapper } from "./services/mapper";

export default {
    name: "App",
    components: {
        Loader,
        Card,
        Search,
    },
    data: () => ({
        products: [],
        filters: [],
        allProducts: [],
        isLoading: true,
        topThreeProducts: [],
        checkedFilter: {},
        param: "",
        sorted: {
            "Від дешевих до дорогих": false,
            "Від дорогих до дешевих": false,
        },
        activeSort: false,
    }),
    async mounted() {
        await this.fetchProducts();
    },
    methods: {
        getAllOptionFilters() {
            this.filters.forEach(element => {
                this.$set(this.checkedFilter, element.type, []);
            });
        },
        sortProducts(allProducts, key, val) {
            for (let i in this.sorted) {
                this.sorted[i] = false;
            }
            this.sorted[key] = !val;

            return allProducts.sort((cur, next) => {
                return key == "Від дешевих до дорогих"
                    ? cur.pricePerGramm - next.pricePerGramm
                    : next.pricePerGramm - cur.pricePerGramm;
            });
        },
        satisfiesProducts(product, filters) {
            function satisfiesFilter(property, filter) {
                return !filter.length || filter.includes(property);
            }
            return Object.keys(filters)
                .map(key => satisfiesFilter(product[key], filters[key]))
                .reduce((acc, satisfies) => acc && satisfies, true);
        },

        filtersProducts(allProducts, filters) {
            return allProducts.filter(elem => this.satisfiesProducts(elem, filters));
        },
        async fetchProducts(searchString = "") {
            try {
                this.isLoading = true;
                const response = await productsService.fetchProducts(searchString);

                this.allProducts = response.products.map(productMapper);
                this.topThreeProducts = this.allProducts.slice(0, 3);
                this.allProducts = this.allProducts.slice(3);

                this.filters = response.filters;
                this.getAllOptionFilters();

                this.isLoading = false;
            } catch (error) {
                this.isLoading = false;
                console.log(error);
            }
        },
        async search(param) {
            await this.fetchProducts(param);
        },
    },

    computed: {
        topProduct() {
            return this.products[0];
        },
        dateNow() {
            const today = new Date();
            return today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        },
        allProductsFilterSort() {
            return this.filtersProducts(this.allProducts, this.checkedFilter);
        },
    },
};
</script>

<style >
@import url('./assets/main.css');
</style>
