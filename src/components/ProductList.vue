<template>
  <v-container>
    <v-row 
      v-for="product in products"
      :key="product.code">
      <v-col>
        <v-card>
            <v-img
              height="250"
              width="400"
              lazy-src="require('../assets/loading.gif')"
              :src="displayImage(product.image)"
              @click="selectProduct(product)"
            ></v-img>
        </v-card>
      </v-col>
      <v-col>
        <v-card-title>{{ product.name }}</v-card-title>
        <v-divider></v-divider>
        <v-card-subtitle class="pb-0">가격 {{ product.price | currency}} 원</v-card-subtitle>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios"
import { catchStatus } from "../mixins/catchStatus"
import { commonFunc } from "../mixins/commonFunc"

const target = 'http://127.0.0.1:8081/product'

export default {
  data () {
    return {
      products: []
    }
  },
  created() {
    this.getProducts()
  },
  filters: {
    currency: function(value) {
      return commonFunc.getCurrency(value)
    }
  },
  methods: {
    getProducts() {
      // webflux gateway에 접근할 경우 명시저으로 header 셋팅(default 방식은 이슈가 있음)
      let token = localStorage.getItem('access-token')
      axios.get(`${target}/all`, { 
        headers: {
          'access-token': token
        }
      }).then(res => { 
          this.products = res.data 
      }).catch(err => {
        this.catchStatus(err)
      })
    },
    displayImage(name) {
      let token = localStorage.getItem('access-token')
      return `${target}/displayImg?name=${name}&access-token=${token}`
    },
    selectProduct(product) {
      this.$router.push({ name: 'selectproduct', params:product })
    }
  },
  mixins: [catchStatus]
}
</script>