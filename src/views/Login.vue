<template>
  <v-container fill-height style="max-width:450px;">
    <v-layout align-center row wrap>
      <v-flex xs12>
        <v-alert 
          class="mb-2"
          type="error"
          :value="isLoginError" 
        >이메일과 비밀번호를 확인하세요.
        </v-alert>
        <v-alert 
          type="success"
          :value="isLogin" 
        >로그인이 완료되었습니다.
        </v-alert>
        <v-card v-show="!isLogin">
          <v-toolbar flat color="blue-grey darken-2">
            <v-toolbar-title class="white--text">로그인</v-toolbar-title>
          </v-toolbar>
          <div class="pa-3">
            <v-text-field 
              v-model="email"
              label="이메일을 입력하세요."
            ></v-text-field>
            <v-text-field 
              v-model="password"
              type="password"
              label="비밀번호를 입력하세요."
            ></v-text-field>
            <v-btn
              color="primary"
              large
              block
              depressed
              @click="login({email,password})"
            >로그인</v-btn>
          </div>
        </v-card>    
        <p v-if="!isLogin" class="text-center pa-3">회원이 아니면 <router-link :to="{name: 'registrationform'}">회원가입</router-link>하세요.</p>
      </v-flex>
    </v-layout> 
  </v-container>
</template>
<script>
import { mapState, mapActions } from "vuex"

export default {
  data() {
    return {
      email: null,
      password: null,
      
      alertType: null,
      visible: false,
      alertMessage: null
    }
  },
  computed: {
    ...mapState(['isLogin', 'isLoginError'])
  },
  methods: {
    ...mapActions(['login']),
    /*
    getTest() {
      axios.get(target + '/users')
        .then(res => {
          // handle success
          console.log(res);
        })
        .catch(err => {
          // handle error
          console.log(err);
        })
        .finally(() => {
          console.log('test');
          // always executed
        });
    },
    postTest() {
      axios.post(target + '/create', {
        email: 'yongs@naver.com',
        password: '12',
        name: 'Yongs'
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
    }

    login() {
      // 1. 이메일 찾기
      let selectedUser = null
      this.allUsers.forEach(user => {
        if(user.email === this.email) selectedUser = user
      })

      if(selectedUser === null) {
        this.loginAlert('error', '이메일이 존재하지 않습니다.')
        this.email = ''
        this.password = ''
      } else {
        if(selectedUser.password !== this.password) {
          this.loginAlert('error', '비밀번호가 틀립니다.')
          this.password = ''
        } else {
          this.loginAlert('success', '로그인이 완료되었습니다. (' + this.getDateAndTime(new Date()) + ')')
        }
      }
    },
    loginAlert(type, message) {
      this.visible = true
      this.alertType = type
      this.alertMessage = message;
    }
    */
  }
}
</script>

<style>

</style>
