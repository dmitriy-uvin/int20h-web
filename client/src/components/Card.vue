<template>
    <div class="shop__thumb">
        <a :href="product.link" target="_blank">
        <div class="shop-thumb__img">
            <img :src="product.image" class="img-responsive" alt="..." />
        </div>
        <h5 class="shop-thumb__title">{{ product.title }}</h5>
        <p><b>{{ product.price }}</b> грн.</p>
        <p v-if="product.producer"><b>Виробник: </b>{{ product.producer }}</p>
        <p><b>Ціна за грам: </b>{{ product.pricePerGramm.toFixed(3) }}</p>
        </a>
    </div>
</template>

<script>
export default {
    props:{
        product: {
            type: Object
        }
    }
}
</script>

<style scoped>
@import url('../assets/card.css');
</style>