<template>
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
</template>

<script>
export default {

    props:{
        product:{type:Object}, 
    }
}
</script>

<style scopedSlots>
.shop__thumb {
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 20px;
  background-color: white;
  text-align: center;
  -webkit-transition: border-color 0.1s, -webkit-box-shadow 0.1s;
  -o-transition: border-color 0.1s, box-shadow 0.1s;
  transition: border-color 0.1s, box-shadow 0.1s;
}
.shop__thumb:hover {
  border-color: rgba(0, 0, 0, 0.07);
  -webkit-box-shadow: 0 5px 30px rgba(0, 0, 0, 0.07);
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.07);
}
.shop__thumb > a {
  color: #333333;
}
.shop__thumb > a:hover {
  text-decoration: none;
}
.shop-thumb__img {
  position: relative;
  margin-bottom: 20px;
  overflow: hidden;
}
.shop-thumb__title {
  font-weight: 600;
  overflow: hidden;
  height: 100px;
  text-overflow: ellipsis;
}
.shop-thumb__price {
  color: #777777;
}
.shop-thumb-price_old {
  text-decoration: line-through;
}
.shop-thumb-price_new {
  color: red;
}
</style>