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

const product_target = 'http://127.0.0.1:8081/product'

// orderform에서 acceess-token이 만료되는 것을 최소화 하기 위해
// JWT을 새로생성(지금부터 1시간 유효)
const jwt_target = 'http://127.0.0.1:7071/jwt'

export default {
  data () {
    return {
      products: [],
      name: ''
    }
  },
  created() {
    this.search('')
  },
  filters: {
    currency: function(value) {
      return commonFunc.getCurrency(value)
    }
  },
  methods: {
    search(name) {
      if(name == "") {
        axios.get(`${product_target}/all`
        ).then(res => { 
            this.products = res.data 
        }).catch(err => {
          this.catchStatus(err)
        }) 
      } else {   
        axios.get(`${product_target}/name/${name}`
        ).then(res => { 
            this.products = res.data 
        }).catch(err => {
          this.catchStatus(err)
        })     
      }
    },
    displayImage(name) {
      let token = localStorage.getItem('access-token')
      return `${product_target}/displayImg?name=${name}&access-token=${token}`
    },
    selectProduct(product) {
      // orderform에서 acceess-token이 만료되는 것을 최소화 하기 위해
      // acceess-token을 새로생성(지금부터 1시간 유효)
      let accessToken  = localStorage.getItem('access-token')
      let parsedToken = commonFunc.parseJwtToken(accessToken)
      let userInfo = {
        email: parsedToken.sub,
        name: parsedToken.name,
        roles: parsedToken.roles
      } 
      axios.post(jwt_target+'/recreate', userInfo
         ).then(res => {
        // 서버에서 data로 token 정보만 보냄
        let newAccesstoken = res.data;
        // token정보를 로컬스토리지에 저장
        localStorage.setItem('access-token', newAccesstoken)
        // orderform으로 이동
        this.$router.push({ name: 'selectproduct', params:product })
      }).catch(err => {
        // refresh-token이 invalid(401)되어 세션 종료
        if(err.response.status === 401) {
          alert("세션이 종료되었습니다. 다시 로그인 하세요.")
          store.dispatch('logout')
        }
        if(err.response.status === 500) {
          alert("시스템에 문제가 발생했습니다. 잠시후에 다시 접속하세요.")
          store.dispatch('logout')
          router.push({name:'home'})
        } 
      })
    }
  },
  mixins: [catchStatus]
}
</script>