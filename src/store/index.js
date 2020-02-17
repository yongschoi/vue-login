import Vue from "vue";
import Vuex from "vuex";
import router from "../router"
import axios from "axios"
import { commonFunc } from "../mixins/commonFunc"

const target = 'http://127.0.0.1:8082/any' 

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /*
    allUsers: [
      {id:1, name: 'yongs', email: 'yongs@naver.com', password: '12'},
      {id:2, name: 'janny', email: 'janny@naver.com', password: '12'}
    ],
    */
    //================= Login =================
    userInfo: null,
    isLogin: false,
    isLoginError: false,
    isAdmin: false
  },
  mutations: {
    // 로그인 성공
    loginSuccess(state, payload) {
      state.isLogin = true
      state.isLoginError = false
      state.userInfo = payload
      // Admin 권한 체크
      if(payload.roles.includes('ADMIN')) {
        state.isAdmin = true
      }
    },
    // 로그인  실패
    loginError(state) {
      state.isLogin = false
      state.isLoginError = true
      state.isAdmin = false
    },
    logout(state) {
      state.isLogin = false
      state.isLoginError = false
      state.userInfo = null
      state.isAdmin = false
    }
  },
  actions: {
    // login에서는 server에서 token data만 가져오고
    // 새로고침 방지를 위해 token정보를 localStorage에 저장한다.
    login({commit, dispatch}, loginUser) {
      axios.post(target+'/login', loginUser)
        .then(res => {
          // 서버에서 data로 access-token 정보만 보냄
          let token = res.data;
          // token정보를 로컬스토리지에 저장
          localStorage.setItem('access-token', token)
          // axios 헤더에 default로 설정
          axios.defaults.headers.common['access-token'] = token
          this.dispatch('getUserInfo')          
      }).catch(err => {
          commit('loginError')
      });  
      /*
      let selectedUser = null
      state.allUsers.forEach(user => {
        if(user.email === loginUser.email) selectedUser = user
      })
      if(selectedUser === null || selectedUser.password !== loginUser.password) {
        commit('loginError')
      } else {
        commit('loginSuccess', selectedUser)
        router.push({name:'mypage'})
      }
      */
    },
    logout({commit}) {
      commit('logout')
      localStorage.removeItem('access-token')
      router.push({name:'login'})
    },
    // 새로고침을 할때마다 실행되어야 하는 getUserInfo는 localStorage에 저장된 token을 활용한다.
    getUserInfo({commit}) {
      // token정보를 로컬스토리지에서 가져온다
      let token = localStorage.getItem('access-token')

      // token을 파싱해서 사용자정보를 꺼냄
      if(token != null) {        
        let parsedToken = commonFunc.parseJwtToken(token)
        let userInfo = {
          email: parsedToken.sub,
          name: parsedToken.name,
          roles: parsedToken.roles
        }
  
        commit('loginSuccess', userInfo)
      }
    }
  },
  modules: {}
});
