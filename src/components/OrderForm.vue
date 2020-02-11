<template>
  <v-container>
    <v-card class="justify-center">
      <v-card-title>{{ product.name }}</v-card-title>
      <v-card-subtitle class="pb-0">가격 {{ product.price | currency }} 원</v-card-subtitle>
      <v-divider></v-divider>
      <v-img
        height="400"
        width="600"
        :src="displayImage(product.image)"
      ></v-img>
    </v-card>
    <v-card>
      <v-row>
        <v-col class="d-flex">
          <v-select
            v-model="selectedQty"
            :items="qty"
            label="수량선택"
          ></v-select>
        </v-col>
        <v-col class="d-flex">
          <v-select
            v-model="selectedPay"
            :items="pay"
            label="카드사선택"
          ></v-select>
        </v-col>
        <v-col class="d-flex">
          <v-select
            v-model="selectedDelivery"
            :items="delivery"
            label="배송업체선택"
          ></v-select>
        </v-col>
      </v-row>
      <v-row class="d-flex align-baseline justify-center">
        <v-col class="d-flex">
          총 주문가격 : {{ product.price * this.selectedQty | currency }}원
        </v-col>
        <v-col class="d-flex">
          <v-btn color="primary" @click="order">주문하기</v-btn>
        </v-col>
      </v-row>     
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios"
import { catchStatus } from "../mixins/catchStatus"
import { commonFunc } from "../mixins/commonFunc"
const product_target = 'http://127.0.0.1:8081/product'
const stock_target = 'http://127.0.0.1:8082/stock'

export default {
  data () {
    return {
      qty: [],
      pay: ['신한카드', 'KB국민카드', '삼성카드', '현대카드', 'BC카드'],
      delivery: ['CJ대한통운', '우체국택배', '로젠택배', '한진택배', '롯데택배'],
      selectedQty: '',
      selectedPay: '',
      selectedDelivery: ''
    }
  },
  filters: {
    currency: function(value) {
      return commonFunc.getCurrency(value)
    }
  },
  computed: {
    product: function () {
      return this.$route.params;
    }
  },
  created() {
    this.getStockQty()
  },
  methods: {
    displayImage(name) {
      let token = localStorage.getItem('access-token')
      return `${product_target}/displayImg?name=${name}&access-token=${token}`
    },
    getStockQty() {
      let token = localStorage.getItem('access-token')
      let code = this.product.code
      axios.get(`${stock_target}/code/${code}`, { 
        headers: {
          'access-token': token
        }
      }).then(res => {
        let stock = res.data
        let temp = new Array()   
        for ( let idx = 0; idx < stock.qty; idx++ ) {
          temp[idx] = idx+1;
        }
        this.qty = temp
      }).catch(err => {
        this.catchStatus(err)
      })
    },   
    order() {
      if(this.selectedQty == '') {
        alert('수량을 선택하세요')
        return
      }
      if(this.selectedPay == '') {
        alert('카드사를 선택하세요')
        return
      }
      if(this.selectedDelivery == '') {
        alert('배송업체를 선택하세요')
        return
      }     
    }
  },
  mixins: [catchStatus]
}
</script>