import store from "../store";
import router from "../router";
import axios from "axios"
import { commonFunc } from "./commonFunc"

// target 인증서버 정보
const target = 'http://127.0.0.1:7071/jwt'

export const catchStatus = {
  methods: {
    catchStatus(err) {
      // access-token이 invalid(401) 되어 재발급 수행
      if(err.response.status === 401) { // 401 Unauthorized
        let accessToken  = localStorage.getItem('access-token')
        let parsedToken = commonFunc.parseJwtToken(accessToken)
        let userInfo = {
          email: parsedToken.sub,
          name: parsedToken.name,
          roles: parsedToken.roles
        } 

        axios.post(target+'/recreate', userInfo)
          .then(res => {
            // 서버에서 data로 token 정보만 보냄
            let newAccesstoken = res.data;
            // token정보를 로컬스토리지에 저장
            localStorage.setItem('access-token', newAccesstoken)
            // reload를 하게되면 브라우저(메모리)의 모든 정보가 사라짐
            window.location.reload()
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
        });         
      }
      if(err.response.status === 500) {
        alert("시스템에 문제가 발생했습니다. 잠시후에 다시 접속하세요.")
        store.dispatch('logout')
        router.push({name:'home'})
      }   
    },
    invalidOrderStatus(err) {
      alert("비정상인 주문입니다. 다시 진행하시기 바랍니다.")
      router.push({name:'home'})
    }
  
  }
}