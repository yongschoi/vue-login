<template>
  <v-container>
    <v-container>
      <v-text-field
        outlined
        v-model="name"
        label="제품명을 입력하세요"
        append-icon="mdi-magnify"
        @click:append="search(name)"
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
            ></v-img>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="mx-auto" height="170" flat>
          <v-card-title>{{ product.name }}</v-card-title>
          <v-divider></v-divider>
          <v-card-subtitle class="pb-0">가격 {{ product.price | currency }} 원</v-card-subtitle>
        </v-card>
        
        <div align="center">
          <v-dialog v-model="qtyDialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
                @click="getStockQty(product.code)"
              >입고처리
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">입고 처리</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                    현재수량 : {{ asisQty }}
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-currency-field
                        dense
                        outlined
                        label="입고수량"
                        v-model="tobeQty"
                      ></v-currency-field>
                    </v-col>                 
                  </v-row>      
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="addQty(product.code)">Save</v-btn>
                <v-btn color="blue darken-1" text @click="cancelQty">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>  
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

const product_R_target = 'http://127.0.0.1:8081/product'
const stock_target = 'http://127.0.0.1:8082/stock'

export default {
  data() {
    return {
      snackbar: false,
      text: '제품명을 입력하세요.',
      products: [],
      name: '',
      asisQty: 0,
      tobeQty: 0,
      qtyDialog: false
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
        this.text = '제품명을 입력하세요.'
      } else {   
        axios.get(`${product_R_target}/search/${name}`
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
      return `${product_R_target}/displayImg?name=${name}&access-token=${token}`
    },
    add() {
      // ProductNewForm으로 이동
      this.$router.push({ name: 'productnewform'})
    },
    getStockQty(code) {
      let token = localStorage.getItem('access-token')
      axios.get(`${stock_target}/code/${code}`, { 
        headers: {
          'access-token': token
        }
      }).then(res => {
        this.asisQty = res.data.qty
      }).catch(err => {
        this.catchStatus(err)
      })
    },
    addQty(code) {
      this.qtyDialog = false
      let token = localStorage.getItem('access-token')
      axios.post(stock_target + '/addQty', {
        code: code,
        qty: this.tobeQty,
      }, 
      { 
        headers: {
          'access-token': token
        }
      }).then((res) => {
        this.asisQty = 0
        this.tobeQty = 0
      }).catch(err => {
        this.catchStatus(err)
      })
    },
    cancelQty() {
      this.qtyDialog = false
      this.asisQty = 0
      this.tobeQty = 0
    }
  },
  mixins: [catchStatus]
}
</script>