<template>
  <div>
    <h1>주문목록</h1>
    <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">주문시간</th>
          <th class="text-center">제품정보</th>
          <th class="text-center">주문수량</th>
          <th class="text-center">주문금액</th>
          <th class="text-center">결제정보</th>
          <th class="text-center">주문상태</th>
          <th class="text-center">택배사/운송장번호</th>          
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orderlist" :key="order.no">
          <td class="text-left">{{ getDateFormat(order.opentime) }}</td>
          <td class="text-center">{{ order.product.name }}</td>
          <td class="text-center">{{ order.qty }}</td>
          <td class="text-center">{{ order.payment.total | currency }}</td>
          <td class="text-center">{{ order.payment.company }}/{{ order.payment.cardNo | cardmask }}</td>
          <td class="text-center">{{ status[order.status] }}</td>
         <td class="text-center">{{ order.delivery.company}}/{{ order.delivery.no }}</td>
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
      orderlist: [],
      status: ['주문/결제완료', '상품준비중', '배송중']
    }
  },
  filters: {
    cardmask: function(value) {
      return commonFunc.getCardNoMask(value)
    },
    currency: function(value) {
      return commonFunc.getCurrency(value)
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
      axios.get(`${target}/statusAll/${this.userInfo.email}`
       ).then(res => { 
          this.orderlist = res.data
      }).catch(err => {
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