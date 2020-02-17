<template>
  <v-container>
    <v-alert 
      type="success"
      :value="orderComplete" 
    >주문이 완료되었습니다. Order Status에서 주문정보를 확인하세요.
    </v-alert>
    <v-card v-show="!orderComplete">
      <v-card-title>{{ product.name }}</v-card-title>
      <v-card-subtitle class="pb-0">가격 {{ product.price | currency }} 원</v-card-subtitle>
      <v-divider></v-divider>
      <v-img
        height="400"
        width="600"
        :src="displayImage(product.image)"
      ></v-img>
    </v-card>
    <v-card v-show="!orderComplete">
      <v-row>
        <v-col cols="2" class="ma-5">
          <v-select
            v-model="orderQty"
            :items="qty"
            label="수량선택"
          ></v-select>
        </v-col>
        <v-col class="ma-5">
          <v-row>
            <v-select
              v-model="orderPayment"
              :items="payment"
              label="카드사선택"
            ></v-select>
          </v-row>
          <v-row>
            <v-text-field
              v-model="cardNo" 
              v-mask="cardMask"
              label="카드번호"
              placeholder="카드번호입력"
              outlined
              dense
            ></v-text-field>
          </v-row>
        </v-col>
        <v-col class="ma-5">
          <v-row>
            <v-select
              v-model="orderDelivery"
              :items="delivery"
              label="배송방식선택"
            ></v-select>
          </v-row>
          <v-row>
            <v-text-field
              v-model="address" 
              label="주소"
              placeholder="주소입력"
              outlined
              dense
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="phone" 
              v-mask="phoneMask"
              label="핸드폰"
              placeholder="핸드폰번호입력"
              outlined
              dense
            ></v-text-field>
          </v-row>
        </v-col>
      </v-row>    
      <v-row class="d-flex align-baseline justify-center">
        <v-col class="d-flex">
          총 주문가격 : {{ total | currency }}원
        </v-col>
        <v-col class="d-flex">
          <v-btn 
            color="primary"
            :disabled="notorder" 
            @click="order">주문하기</v-btn>
        </v-col>
      </v-row>     
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios"
import { mapState } from "vuex"
import { catchStatus } from "../mixins/catchStatus"
import { commonFunc } from "../mixins/commonFunc"
import { mask } from 'vue-the-mask'
const product_target = 'http://127.0.0.1:8081/product'
const stock_target = 'http://127.0.0.1:8082/stock'
const order_target = 'http://127.0.0.1:8082/order'


export default {
  directives: {
      mask
  },
  data () {
    return {
      qty: [],
      payment: ['신한카드', 'KB국민카드', '삼성카드', '현대카드', 'BC카드'],
      delivery: ['일반배송', '총알배송', '드론배송', '편의점배송'],
      orderQty: '',
      orderPayment: '',
      orderDelivery: '',
      cardNo: '',
      cardMask: '####-####-####-####',
      phoneMask: '###-####-####',
      address: '',
      phone: '',
      orderComplete: false,
      notorder: false
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
    },
    total: function() {
      return this.product.price * this.orderQty
    },
    ...mapState(['userInfo'])
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
        if(stock.qty === 0) {
          this.qty = [0]
          this.notorder = true
        } else {
          let temp = new Array()   
          for ( let idx = 0; idx < stock.qty; idx++ ) {
            temp[idx] = idx+1;
          }
          this.qty = temp
          this.notorder = false
        }
      }).catch(err => {
        this.catchStatus(err)
      })
    },   
    order() {
      if(this.orderQty == '') {
        alert('수량을 선택하세요')
        return
      }
      if(this.orderPayment == '') {
        alert('카드사를 선택하세요')
        return
      }
      if(this.orderDelivery == '') {
        alert('배송업체를 선택하세요')
        return
      }

      axios.post(order_target + '/create', {
        qty: this.orderQty,
        product: this.product,
        user: this.userInfo,
        payment: {company: this.orderPayment, cardNo: this.cardNo, total: this.total},
        delivery: {type: this.orderDelivery, address: this.address, phone: this.phone}
      }).then((res) => {
        this.orderComplete = true
      }).catch(err => {
        this.catchStatus(err)
      })
    }
  },
  mixins: [catchStatus]
}
</script>