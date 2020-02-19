<template>
  <div>
    <h1>배송처리</h1>
    <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">주문번호</th>
          <th class="text-center">주문자</th>
          <th class="text-center">제품정보</th>
          <th class="text-center">주문수량</th>
          <th class="text-center">배송지</th>
          <th class="text-center">배송업체</th>
          <th class="text-center">배송처리</th>          
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orderlist" :key="order.no">
          <td class="text-left">{{ order.no }}</td>
          <td class="text-center">{{ order.user.name }}</td>
          <td class="text-center">{{ order.product.name }}</td>
          <td class="text-center">{{ order.qty }}</td>
          <td class="text-center">{{ order.delivery.address }}</td>
          <td class="text-center" style="width: 150px;">
            <v-select
              v-model="selectedCompany[order.no]"
              :items="deliveryCompanyList"
              label="배송업체선택"
            ></v-select>
          </td>
          <td class="text-center">
            <v-btn 
              @click="update(order.no)"
              text icon color="deep-orange"
              ><v-icon>mdi-truck-check</v-icon>
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

const order_target = 'http://127.0.0.1:8082/order'
const delivery_target = 'http://127.0.0.1:8082/delivery'

export default {
  data() {
    return {
      orderlist: [],
      selectedCompany: [],
      deliveryCompanyList: ['CJ대한통운', '우체국택배', '로젠택배', '한진택배', '롯데택배'],
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
      let token = localStorage.getItem('access-token')
      axios.get(`${order_target}/admin/onPrepare`, { 
        headers: {
          'access-token': token
        }
      }).then(res => { 
          this.orderlist = res.data
      }).catch(err => {
        this.catchStatus(err)
      })
    },
    update(orderNo) {
      if(this.selectedCompany[orderNo] === undefined) {
        alert("배송업체를 선택하세요.")
        return
      }

      let token = localStorage.getItem('access-token')
      axios.put(`${delivery_target}/update`, { 
        orderNo: orderNo,
        company: this.selectedCompany[orderNo]
      }, 
      { 
        headers: {
          'access-token': token
        }
      }).then(res => { 
          this.orderlist = res.data
          this.getOrderList()
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