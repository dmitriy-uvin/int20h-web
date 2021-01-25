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
      "От дешёвым к дорогим": false,
      "От дорогих к дешёвым": false,
    },
    activeSort: false,
  }),
  async mounted() {
      await this.fetchProducts();
  },
  methods: {
    getAllOptionFilters() {
      this.filters.forEach((element) => {
        this.$set(this.checkedFilter, element.type, []);
      });
    },
    sortProducts(allProducts, key, val) {
      for (let i in this.sorted) {
        this.sorted[i] = false;
      }
      this.sorted[key] = !val;

      return allProducts.sort((cur, next) => {
        return key == "От дешёвым к дорогим"
          ? cur.pricePerGramm - next.pricePerGramm
          : next.pricePerGramm - cur.pricePerGramm;
      });
    },
    satisfiesProducts(product, filters) {
      function satisfiesFilter(property, filter) {
        return !filter.length || filter.includes(property);
      }
      let result = Object.keys(filters)
        .map((key) => satisfiesFilter(product[key], filters[key]))
        .reduce((acc, satisfies) => acc && satisfies, true);
      return result;
    },

    filtersProducts(allProducts, filters) {
      return allProducts.filter((elem) => this.satisfiesProducts(elem, filters));
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
      console.log(this.allProducts);
      return this.filtersProducts(this.allProducts, this.checkedFilter);
    },
  },
};
</script>

<style scoped>

.shop__filter {
  margin-bottom: 40px;
}
.shop-filter__price {
  padding: 15px;
}
.shop-filter__price [class*="col-"] {
  padding: 2px;
}
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


</style>
