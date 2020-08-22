<template>
  <v-container>
    <v-container>
      <v-text-field
        outlined
        v-model="name"
        label="상품명을 입력하세요"
        append-outer-icon="mdi-magnify"
        @click:append-outer="search(name)"
        v-on:keyup.enter="search(name)">
      ></v-text-field>
      <v-snackbar v-model="snackbar">
        {{ text }}
        <template v-slot:action="{ attrs }">
          <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
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
        <v-card class="mx-auto" height="170" flat>
          <v-card-title>{{ product.name }}</v-card-title>
          <v-divider></v-divider>
          <v-card-subtitle class="pb-0">가격 {{ product.price | currency}} 원</v-card-subtitle>
        </v-card>
        <div class="text-center"> 
          <v-btn rounded color="primary" dark>상품수정</v-btn>
        </div>
      </v-col>
    </v-row>
    <div class="text-center">
      <v-btn
        outlined 
        fab 
        color="indigo"
        @click="add"
      >
        <v-icon>mdi-plus-box-multiple</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import axios from "axios"
import { catchStatus } from "../mixins/catchStatus"
import { commonFunc } from "../mixins/commonFunc"

const product_target = 'http://127.0.0.1:8081/product'

export default {
  data() {
    return {
      snackbar: false,
      text: '상품명을 입력하세요.',
      products: [],
      name: ''
    }
  },
  filters: {
    currency: function(value) {
      return commonFunc.getCurrency(value)
    }
  },
  methods: {
    search(name) {
      if(name == "") {
        this.snackbar = true  
        this.text = '상품명을 입력하세요.'
      } else {   
        axios.get(`${product_target}/name/${name}`
        ).then(res => { 
          this.products = res.data
          if(this.products.length == 0 ) {
            this.snackbar = true
            this.text = '존재하지 않는 상품입니다.'
          }
        }).catch(err => {
          this.catchStatus(err)
        })     
      }
    },
    displayImage(name) {
      let token = localStorage.getItem('access-token')
      return `${product_target}/displayImg?name=${name}&access-token=${token}`
    },
    add() {
      // ProductNewForm으로 이동
      this.$router.push({ name: 'productnewform'})
    },
    update() {
      
    }
  },
  mixins: [catchStatus]
}
</script>