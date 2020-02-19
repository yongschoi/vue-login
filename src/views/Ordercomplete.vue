<template>
  <div>
    <h1>주문완료</h1>
    <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">주문시간</th>
          <th class="text-center">제품정보</th>
          <th class="text-center">주문수량</th>
          <th class="text-center">결제정보</th>
          <th class="text-center">택배사/운송장번호</th>   
          <th class="text-center">상품수령/완료</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orderlist" :key="order.no">
          <td class="text-left">{{ getDateFormat(order.opentime) }}</td>
          <td class="text-center">{{ order.product.name }}</td>
          <td class="text-center">{{ order.qty }}</td>
          <td class="text-center">{{ order.payment.company }}/{{ order.payment.cardNo | cardmask }}</td>
          <td class="text-center">{{ order.delivery.company}}/{{ order.delivery.no }}</td>
          <td class="text-center">
            <v-btn 
              @click="complete(order.no)"
              text icon color="deep-orange"
              ><v-icon>mdi-emoticon-outline</v-icon>
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
      axios.get(`${target}/delivery/${this.userInfo.email}`
       ).then(res => { 
          this.orderlist = res.data
      }).catch(err => {
        this.catchStatus(err)
      })
    },
    complete(orderNo) {
      axios.put(`${target}/complete/${orderNo}`
       ).then(res => { 
          this.orderlist = res.data
          this.getOrderList()
      }).catch(err => {
        console.log(err)
        this.catchStatus(err)
      })
    },
    getDateFormat(timemillis) {
      return commonFunc.getDateFormat(new Date(timemillis))
    }
  },
  mixins: [catchStatus]
}
</script>