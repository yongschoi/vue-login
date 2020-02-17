<template>
  <div>
    <h1>주문목록</h1>
    <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">주문번호</th>
          <th class="text-center">주문자</th>
          <th class="text-center">제품정보</th>
          <th class="text-center">주문수량</th>
          <th class="text-center">결제정보</th>
          <th class="text-center">주문승인</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orderlist" :key="order.no">
          <td class="text-left">{{ order.no }}</td>
          <td class="text-center">{{ order.user.name }}</td>
          <td class="text-center">{{ order.product.name }}</td>
          <td class="text-center">{{ order.qty }}</td>
          <td class="text-center">{{ order.payment.company }}/{{ order.payment.cardNo | cardmask }}</td>
          <td class="text-center">
            <v-btn 
              @click="accept(order.no)"
              text icon color="deep-orange"
              ><v-icon>mdi-gift-outline</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
  </div>
  
</template>

<script>
import axios from "axios"
import { catchStatus } from "../mixins/catchStatus"
import { mapState } from "vuex"
import { commonFunc } from "../mixins/commonFunc"

const target = 'http://127.0.0.1:8082/order'

export default {
  data() {
    return {
      orderlist: []
    }
  },
  filters: {
    cardmask: function(value) {
      return commonFunc.getCardNoMask(value)
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      axios.get(`${target}/status/0`
       ).then(res => { 
          this.orderlist = res.data
      }).catch(err => {
        this.catchStatus(err)
      })
    },
    accept(orderNo) {
      axios.put(`${target}/accept/${orderNo}`
       ).then(res => { 
          this.orderlist = res.data
          this.getOrderList()
      }).catch(err => {
        this.catchStatus(err)
      })
    },
    getDateFormat(timemillis) {
      return commonFunc.getDateFormat(new Date(timemillis))
    }
  }
}
</script>