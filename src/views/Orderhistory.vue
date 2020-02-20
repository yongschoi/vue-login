<template>
  <div>
    <h1>주문이력</h1>
    <v-subheader>{{ title }} {{ orderlist.length}}건 총금액 {{ total | currency }}원</v-subheader>
    <v-row class="d-inline-flex">
      <v-col>
        <v-btn @click=getOrderList(7)>최근1주(7일)</v-btn>
      </v-col>
      <v-col>
        <v-btn @click=getOrderList(30)>최근1개월(30일)</v-btn>
      </v-col>
      <v-col>
        <v-btn @click=getOrderList(180)>최근6개월(180일)</v-btn>
      </v-col>
    </v-row>
    <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">주문시간</th>
          <th class="text-center">제품정보</th>
          <th class="text-center">주문수량</th>
          <th class="text-center">주문금액</th>
          <th class="text-center">결제정보</th>
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
      title: '최근1주',
      total: 0
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
    this.getOrderList(7)
  },
  methods: {
    getOrderList(period) {
      switch (period) {
        case 7:
          this.title = "최근1주"
          break;
        case 30:
          this.title = "최근1개월"
          break;
        case 180:
          this.title = "최근6개월"
          break;
      }

      axios.get(`${target}/onPeriod/${this.userInfo.email}/${period}`
       ).then(res => { 
          this.orderlist = res.data
          this.total = 0
          for(let idx=0; idx <res.data.length; idx++) {
            this.total += this.orderlist[idx].payment.total
          }            
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