<template>
  <v-container style="max-width:450px;">
    <v-alert 
      type="success"
      :value="complete_alert" 
    >가입이 완료되었습니다. <router-link :to="{name: 'login'}">로그인하기</router-link>
    </v-alert>
    <v-form v-if="!complete_alert" ref="form" v-model="valid">
      <v-container>
        <v-row no-gutters class="align-baseline">
          <v-col cols="10">
            <v-form 
              ref="emailform"
              v-model="emailvalid">
              <v-text-field
                dense
                outlined
                label="아이디(e-mail)"
                placeholder="등록아이디(e-mail)을 입력하세요"
                clearable             
                v-model="email"
                :rules="emailRules"
              ></v-text-field>
            </v-form>
          </v-col>
          <v-col cols="2" class="pa-1">
            <v-btn
              outlined 
              color="error"
              :disabled="!emailvalid"
              @click="duplicate"
              >중복체크</v-btn>
              <v-overlay :value="overlay">
                <v-btn icon @click="overlay = false; email = ''">
                  이미 존재하는 아이디입니다.
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-overlay>
              <v-overlay :value="validoverlay">
                <v-btn icon @click="validoverlay = false">
                  사용 가능한 아이디입니다.
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-overlay>
          </v-col>
        </v-row>
        <v-text-field
          dense
          outlined
          counter
          type="password"
          label="비밀번호"
          v-model="password"
          :rules="passwordRules"    
        ></v-text-field>
        <v-text-field
              dense
              outlined
              counter
              type="password"
              label="비밀번호확인"
              :rules="passwordConfirmRules"
        ></v-text-field>
        <v-text-field
              dense
              outlined
              label="이름"
              v-model="name"
              :rules="nameRules"
        ></v-text-field>
        <v-checkbox
              v-model="checkbox"
              :rules="[v => !!v || 'You must agree to continue!']"
              label="가입을 동의합니까?"
              required
        ></v-checkbox>
        <v-row>
          <v-col align="right">
            <v-btn 
              color="primary"
              :disabled="!valid"
              @click="createUser"
              >가입하기</v-btn>
          </v-col>
          <v-col align="left">
            <v-btn 
              color="error"
              @click="reset"
            >다시입력</v-btn>
          </v-col>
        </v-row>        
      </v-container>
    </v-form>
  </v-container>  
</template>

<script>
import axios from "axios"
const target = 'http://127.0.0.1:8082/any'

export default {
  data() {
    return {
      valid: true, // form 전체
      emailvalid: true, // email
      email: '',
      password: '',
      name: '',
      checkbox: false,
      complete_alert: false,
      overlay:false,
      validoverlay:false,
      passwordRules: [
        v => !!v || 'Password is required',
      ],
      passwordConfirmRules: [
        v => this.password === v || 'password missmatch',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 50) || 'Name must be less than 50 characters',
      ]
    }
  },
  methods: {
    duplicate() {
      // if(this.email !== '' && this.emailRules) {
      if(this.$refs.emailform.validate()) {
        axios.get(`${target}/${this.email}`)
          .then(res => { 
            // 이미 존재하는 아이디
            this.overlay = true         
          })
          .catch(err => {
            this.validoverlay = true 
          }
        )
      }
    },
    createUser() {
      if(this.$refs.emailform.validate() && this.$refs.form.validate()) {
        axios.post(target + '/create', {
          email: this.email,
          password: this.password,
          name: this.name
        }).then((res) => {
          this.complete_alert = true
          console.log('create:', res.data)
        })
      }   
    },
    reset() {
      this.$refs.emailform.reset()
      this.$refs.form.reset()
    } 
  }
}
</script>

<style>

</style>