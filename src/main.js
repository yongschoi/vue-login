import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  // F5효과가 발행하면 관련된 모든 정보가 clear
  beforeCreate() {
    // 새로고침 로그인해제 방지 로직
    store.dispatch('getUserInfo')   
    // axios 헤더에 default로 설정
    axios.defaults.headers.common['access-token'] = localStorage.getItem('access-token')
  },
  // 브라우저 close 시 로그아웃 event (동시에 새로고침하면 자동 log out 됨)
  /*
  created() {
    window.addEventListener('beforeunload', this.handler)
  },
  methods: {
    handler: function (event) {
      store.dispatch('logout')
    }
  },
  */
  ////////////////////////////////
  
  vuetify,
  render: h => h(App)
}).$mount("#app");
