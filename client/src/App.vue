<template>
  <div>
    <Loader v-if="isLoading" />
    <div class="container p-4">
      <div class="row">
        <div class="col-sm-4 col-md-3">
          <form>
            <div class="well pb-4">
              <div class="row">
                <div class="col-sm-12">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Поиск товаров..."
                    />
                    <span class="input-group-btn">
                      <button class="btn btn-primary" type="submit">
                        <i class="fa fa-search"></i>
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <form class="shop__filter">
            <h3 class="headline">
              <span>Price</span>
            </h3>
            <div class="radio">
              <input
                type="radio"
                name="shop-filter__price"
                id="shop-filter-price_1"
                value=""
                checked=""
              />
              <label for="shop-filter-price_1">Under $25</label>
            </div>
            <div class="radio">
              <input
                type="radio"
                name="shop-filter__price"
                id="shop-filter-price_2"
                value=""
              />
              <label for="shop-filter-price_2">$25 to $50</label>
            </div>
            <div class="radio">
              <input
                type="radio"
                name="shop-filter__price"
                id="shop-filter-price_3"
                value=""
              />
              <label for="shop-filter-price_3">$50 to $100</label>
            </div>
            <div class="radio">
              <input
                type="radio"
                name="shop-filter__price"
                id="shop-filter-price_4"
                value="specify"
              />
              <label for="shop-filter-price_4">Other (specify)</label>
            </div>
            <div class="form-group shop-filter__price">
              <div class="d-flex">
                <div class="col-xs-4">
                  <label for="shop-filter-price_from" class="sr-only"></label>
                  <input
                    id="shop-filter-price_from"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="From"
                    disabled=""
                  />
                </div>
                <div class="col-xs-4">
                  <label for="shop-filter-price_to" class="sr-only"></label>
                  <input
                    id="shop-filter-price_to"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="To"
                    disabled=""
                  />
                </div>
                <div class="col-xs-4">
                  <button type="submit" class="btn btn-block btn-default" disabled="">
                    Go
                  </button>
                </div>
              </div>
            </div>

            <!-- Checkboxes -->
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
                  @change="filtersProducts"
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

          <ul class="shop__sorting">
            <li :class="{active:activeSort}" @click.prevent="sortProducts(false)"><a href="#">От дорогих к дешёвым</a></li>
            <li :class="{active:!activeSort}" @click.prevent="sortProducts(true)" ><a href="#">От дешёвым к дорогим</a></li>
          </ul>

          <div class="row">
            <div
              class="col-sm-6 col-md-4"
              v-for="product in products"
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

        <div class="col-sm-8 col-md-9"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "./Loader";
export default {
  name: "App",
  components: {
    Loader,
  },
  data: () => ({
    products: [],
    filters: [],
    allProducts: [],
    isLoading: true,
    topThreeProducts:[],
    checkedFilter: {},
    sorted: null,
    activeSort : false,
  }),
  async mounted() {
    try {
      const responseBefore = await fetch("http://localhost:3333/api/products");
      const response = await responseBefore.json();

      this.topThreeProducts = response.products.slice(0,3); 

      this.allProducts = response.products.slice(3);
      this.products = response.products.slice(3)

      this.filters = response.filters;
      this.getAllOptionFilters();

      this.isLoading = false;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    sortProducts(param) {
      let curProd = this.emptyFilter()?this.allProducts.slice(3):this.products;
      this.products = curProd.sort((cur,next)=>{
        return param?cur.pricePerGramm-next.pricePerGramm:next.pricePerGramm-cur.pricePerGramm;
      });
      this.activeSort = !this.activeSort;
    },
    getAllOptionFilters() {
      this.filters.forEach((element) => {
        this.checkedFilter[element.type] = [];
      });
    },
    filtersProducts() {
      function satisfiesFilter(property, filter) {
        return !filter.length || filter.includes(property);
      }

      function satisfiesAllFilters(product, filters) {
        return Object.keys(filters)
          .map((key) => satisfiesFilter(product[key], filters[key]))
          .reduce((acc, satisfies) => acc && satisfies, true);
      }
      this.products = this.allProducts
        .slice(3)
        .filter((product) => satisfiesAllFilters(product, this.checkedFilter));
      console.log(this.products);
    },
    emptyFilter(){
      for(let i in this.checkedFilter){
        if(!(this.checkedFilter[i].lenght >0)){
          return false;
        }
      }
      return true;
    }
  },

  computed: {
    topProduct() {
      return this.products[0];
    },
    dateNow() {
      const today = new Date();
      return today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    },
    allProductsFilterSort(){
      return 
    }
  },
};
</script>

<style scoped>
.shop-index__section {
  position: relative;
  margin-bottom: 60px;
}
.shop-index__section.alt {
  background-color: #f5f5f5;
  padding-top: 60px;
  padding-bottom: 60px;
  border-width: 1px 0 1px 0;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.05);
}
.shop-index__heading {
  margin-top: 0;
  margin-bottom: 60px;
  font-family: "Questrial", sans-serif;
}
.shop-index__heading + p {
  margin-top: -50px;
  margin-bottom: 60px;
  color: #777777;
}

/* Blog post */
.shop-index-blog__posts > [class*="col-"] {
  padding-top: 20px;
  padding-bottom: 20px;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}
.shop-index-blog__posts > [class*="col-"]:last-child {
  border-right: 0;
}
.shop-index-blog__post {
  width: 80%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.shop-index-blog__img {
  position: relative;
  float: left;
  margin-right: 30px;
  margin-bottom: 20px;
  width: 90px;
  height: 100px;
  overflow: hidden;
}
.shop-index-blog__img:before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.shop-index-blog__img > img {
  height: 100%;
  width: auto;
}
.shop-index-blog__body {
  overflow: hidden;
}
.shop-index-blog__heading {
  position: relative;
  margin-top: 0;
  margin-bottom: 30px;
  line-height: 1.5;
}
.shop-index-blog__heading:after {
  content: "";
  position: absolute;
  bottom: -15px;
  left: 0;
  width: 30px;
  height: 2px;
  background-color: rgba(0, 0, 0, 0.1);
}
.shop-index-blog__content {
  margin-bottom: 20px;
  color: #777777;
}
@media (max-width: 991px) {
  .shop-index-blog__img {
    float: none;
    margin-right: 0;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .shop-index-blog__heading {
    text-align: center;
  }
  .shop-index-blog__heading:after {
    left: 50%;
    margin-left: -15px;
  }
}
@media (max-width: 767px) {
  .shop-index-blog__posts > [class*="col-"] {
    padding-top: 0;
    padding-bottom: 60px;
    border-right: 0;
  }
  .shop-index-blog__posts > [class*="col-"]:last-child {
    padding-bottom: 0;
  }
  .shop-index-blog__post {
    width: 100%;
  }
}
/* Newsletter */
.shop-index__newsletter {
  padding-bottom: 20px;
}
.shop-index__newsletter .shop-index__heading {
  margin-bottom: 20px;
  line-height: 42px;
  text-align: center;
}
.shop-index__newsletter input[type="email"] {
  height: 42px;
  padding: 11px 12px;
}
.shop-index__newsletter button[type="submit"] {
  padding: 11px 30px;
  width: 100%;
}
@media (min-width: 768px) {
  .shop-index__newsletter .shop-index__heading {
    margin-bottom: 0px;
    text-align: right;
  }
  .shop-index__newsletter input[type="email"] {
    border-radius: 21px 0 0 21px;
  }
  .shop-index__newsletter button[type="submit"] {
    margin-left: -3px;
    border-radius: 0 21px 21px 0;
    width: auto;
  }
}
/** Shop: Thumbnails **/
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
/** Shop: Item **/
.shop-item__info {
  padding: 30px;
  margin-bottom: 40px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.shop-item-cart__title {
  margin-bottom: 20px;
  line-height: 1.3;
}
.shop-item-cart__price {
  font-size: 28px;
  font-weight: 400;
  color: #f7c41f;
}
.shop-item__intro {
  color: #777777;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: 10px;
  margin-bottom: 20px;
}
.shop-item__add button[type="submit"] {
  padding: 15px 20px;
}
.shop-item__img {
  margin-bottom: 40px;
}
.shop-item-img__main {
  width: -webkit-calc(100% - 110px);
  width: calc(100% - 110px);
  height: auto;
  float: left;
}
.shop-item-img__aside {
  width: 100px;
  height: auto;
  float: left;
}
.shop-item-img__aside > img {
  cursor: pointer;
  margin-bottom: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  opacity: 0.5;
}
.shop-item-img__aside > img:hover,
.shop-item-img__aside > img.active {
  border-color: rgba(0, 0, 0, 0.05);
  opacity: 1;
}
@media (max-width: 767px) {
  .shop-item-img__main {
    width: -webkit-calc(100% - 60px);
    width: calc(100% - 60px);
  }
  .shop-item-img__aside {
    width: 50px;
  }
}
/** Shop: Filter **/
.shop__filter {
  margin-bottom: 40px;
}
/* Shop filter: Pricing */
.shop-filter__price {
  padding: 15px;
}
.shop-filter__price [class*="col-"] {
  padding: 2px;
}
/* Shop filter: Colors */
.shop-filter__color {
  display: inline-block;
  margin: 0 2px 2px 0;
}
.shop-filter__color input[type="text"] {
  display: none;
}
.shop-filter__color label {
  width: 30px;
  height: 30px;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  cursor: pointer;
}
/** Shop: Sorting **/
.shop__sorting {
  list-style: none;
  padding-left: 0;
  margin-bottom: 40px;
  margin-top: -20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  text-align: right;
}
.shop__sorting > li {
  display: inline-block;
}
.shop__sorting > li > a {
  display: block;
  padding: 20px 10px;
  margin-bottom: -1px;
  border-bottom: 2px solid transparent;
  color: #757575;
  -webkit-transition: all 0.05s linear;
  -o-transition: all 0.05s linear;
  transition: all 0.05s linear;
}
.shop__sorting > li > a:hover,
.shop__sorting > li > a:focus {
  color: #333333;
  text-decoration: none;
}
.shop__sorting > li.active > a {
  color: #ed3e49;
  border-bottom-color: #ed3e49;
}
@media (max-width: 767px) {
  .shop__sorting {
    text-align: left;
    border-bottom: 0;
  }
  .shop__sorting > li {
    display: block;
  }
  .shop__sorting > li > a {
    padding: 10px 15px;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  .shop__sorting > li.active > a {
    font-weight: 600;
  }
}
/** Shop: Checkout **/
.checkout__block {
  margin-bottom: 40px;
}
.checkout-cart__item {
  margin-bottom: 15px;
}
.checkout-cart-item__img {
  max-width: 80px;
  margin-right: 10px;
  float: left;
}
.checkout-cart-item__content {
  overflow: hidden;
}
.checkout-cart-item__heading {
  margin-top: 0;
}
.checkout-cart-item__footer {
  padding: 10px 0;
  margin-top: 10px;
  border-top: 1px solid #eee;
}
.checkout-cart-item__price {
  font-weight: 600;
}
.checkout-total__block {
  margin-bottom: 40px;
  border-top: 1px solid #e9e9e9;
  border-bottom: 1px solid #e9e9e9;
}
.checkout-total__block > .row > [class*="col-"] {
  padding: 40px 40px;
  border-right: 1px solid #e9e9e9;
  color: #aaa;
}
.checkout-total__block > .row > [class*="col-"]:last-child {
  border-right: 0;
  color: #333333;
}
@media (max-width: 767px) {
  .checkout-total__block {
    border: 0;
  }
  .checkout-total__block > .row > [class*="col-"] {
    padding: 15px 20px;
    border: 0;
    border-top: 1px solid #e9e9e9;
  }
  .checkout-total__block > .row > [class*="col-"]:last-child {
    border-bottom: 1px solid #e9e9e9;
  }
}
.checkout-total__heading {
  float: left;
}
.checkout-total__price {
  float: right;
  margin: 9px 0;
  font-size: 17px;
}
.checkout__submit {
  padding: 15px 40px;
}
/** Shop: Order Confirmation */
.shop-conf__heading {
  margin-bottom: 40px;
}
.shop-conf__heading + p {
  margin-bottom: 100px;
}

/**
 * Forms
 */
.form-control,
.form-control:focus {
  -webkit-box-shadow: none;
  box-shadow: none;
  outline: none;
}
/* Has error */
.has-error .form-control {
  border-color: #d9534f;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
.has-error .form-control:focus {
  border-color: #b52b27;
}
.has-error .help-block {
  color: #d9534f;
}
/* Checkboxes */
.checkbox input[type="checkbox"] {
  display: none;
}
.checkbox label {
  padding-left: 0;
}
.checkbox label:before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  margin-right: 15px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  background-color: #eee;
  text-align: center;
  font-family: "FontAwesome";
  border: 1px solid #8e8e8e;
}

.checkbox input[type="checkbox"]:checked + label::before {
  content: "\f00c";
  border: 1px solid green;
}
/* Radios */
.radio input[type="radio"] {
  display: none;
}
.radio label {
  padding-left: 0;
}
.radio label:before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  margin-right: 15px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 10px solid #eee;
  background-color: #333333;
}
.radio input[type="radio"]:checked + label:before {
  border-width: 7px;
}
/* Quantity */
.input_qty {
  margin-bottom: 10px;
}
.input_qty input[type="text"] {
  display: none;
}
.input_qty label {
  width: 100%;
  height: 40px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  line-height: 40px;
  text-align: center;
}
.input_qty label > span:not(.output) {
  width: 40px;
  height: 40px;
  float: left;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.input_qty label > span:not(.output):last-child {
  float: right;
  border-right: 0;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}
.input_qty label > span:not(.output):hover {
  background-color: rgba(0, 0, 0, 0.02);
}
.input_qty label > output {
  display: inline-block;
  line-height: inherit;
  padding: 0;
}
.input_qty_sm label {
  width: 80px;
  height: 20px;
  border: 0;
  line-height: 20px;
  color: #ccc;
}
.input_qty_sm label > span:not(.output) {
  width: 20px;
  height: 20px;
  border: 0 !important;
}
.input_qty_sm label > span:not(.output):hover {
  background-color: transparent;
  color: #333333;
}
.input_qty_sm label output {
  color: #ccc;
  font-weight: 600;
}
</style>
