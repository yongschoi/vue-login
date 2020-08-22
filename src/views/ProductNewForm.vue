<template>
  <v-container style="max-width:450px;">
    <v-alert 
      type="success"
      :value="complete_alert" 
    >등록이 완료되었습니다.
    </v-alert>
    <v-form v-if="!complete_alert" ref="form">
      <v-container>
        <v-form ref="codeform">
          <v-text-field
            dense
            outlined
            label="제품코드(예: A00000)"
            append-outer-icon="mdi-check-circle-outline"
            clearable             
            v-model="code"
            :rules="[v => !!v || '제품코드 입력은 필수입니다']"
          ></v-text-field>
         </v-form> 
         <v-form ref="nameform">
            <v-text-field
              dense
              outlined
              label="제품명"
              append-outer-icon="mdi-check-circle-outline"
              clearable             
              v-model="name"
              :rules="[v => !!v || '제품명 입력은 필수입니다']"
            ></v-text-field>
          </v-form>

      
          



        <v-text-field
              dense
              outlined
              label="이름"
              v-model="name"
              :rules="nameRules"
        ></v-text-field>

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
      code: '',
      name: '',
      price: ''
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