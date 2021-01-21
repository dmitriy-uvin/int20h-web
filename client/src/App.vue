<template>
    <div>
        <Loader v-if="isLoading" />
        <div class="container">
            <div class="text-center">
                <h2>Ціни на гречку, станом на {{ dateNow }}</h2>
            </div>
            <div class="products">
                <h2 class="text-center">ТОП-3 найдешевші</h2>
                <div class="row">
                    <div class="col-4 product" v-for="product in topThreeProducts">
                        <p><a :href="product.link" target="_blank">{{ product.title }}</a></p>
                        <p v-if="product.producer"><b>Виробник: </b>{{ product.producer }}</p>
                        <p><b>Ціна за грам: </b>{{ product.pricePerGramm.toFixed(3) }} грн.</p>
                        <p><b>Ціна: {{ product.price }} грн.</b></p>
                        <p><b>Вага: {{ product.weight }} г.</b></p>
                        <p><img :src="product.image" alt="" class="product-image"></p>
                    </div>
                </div>
                <hr>
                <div class="row">
                    <div class="col-4 product" v-for="product in allProducts">
                        <p><a :href="product.link" target="_blank">{{ product.title }}</a></p>
                        <p v-if="product.producer"><b>Виробник: </b>{{ product.producer }}</p>
                        <p><b>Ціна за грам: </b>{{ product.pricePerGramm.toFixed(3) }} грн.</p>
                        <p><b>Ціна: {{ product.price }} грн.</b></p>
                        <p><b>Вага: {{ product.weight }} г.</b></p>
                        <p><img :src="product.image" alt="" class="product-image"></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Loader from "./Loader";
export default {
    name: "App",
    components: {
        Loader
    },
    data: () => ({
        products: [],
        isLoading: true
    }),
    async mounted() {
       const responseBefore = await fetch('/api/products');
       const response = await responseBefore.json();
       this.products = response.products;
       this.isLoading = false;
    },
    computed: {
        topThreeProducts() {
            return this.products.slice(0, 3);
        },
        dateNow() {
            const today = new Date();
            return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        },
        allProducts() {
            return this.products.slice(3);
        }
    }
}
</script>

<style scoped>
@import "assets/simple-grid.min.css";
.text-center {
    text-align: center;
}

.product {
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.5);
    border-radius: 10px;
    text-align: center;
}
.product-image {
    width: 100px;
    height: 100px;
}
</style>