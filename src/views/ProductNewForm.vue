<template>
  <v-container style="max-width:450px;">
    <v-alert 
      type="success"
      :value="complete" 
    >{{ completeText }}
    </v-alert>
    <v-form v-if="!complete" ref="form">
      <v-overlay :value="overlay">
        <v-btn icon @click="overlay = false">
          {{ overlayText }}
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-overlay>
      <v-overlay :value="validoverlay">
        <v-btn icon @click="validoverlay = false">
          {{ validoverlayText }}
        <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-overlay>

      <v-container>
        <v-text-field
          dense
          outlined
          label="제품코드(예: A00000)"
          append-outer-icon="mdi-check-circle-outline"
          @click:append-outer="codecheck"
          clearable             
          v-model="code"
          :rules="[v => !!v || '제품코드 입력은 필수입니다']"
        ></v-text-field>
        <v-text-field
          dense
          outlined
          label="제품명"
          append-outer-icon="mdi-check-circle-outline"
          @click:append-outer="namecheck"
          clearable             
          v-model="name"
          :rules="[v => !!v || '제품명 입력은 필수입니다']"
        ></v-text-field>
        <v-currency-field
          dense
          outlined
          label="제품가격"
          v-model="price"
        ></v-currency-field>
        <v-file-input 
          label="제품 이미지 올리기" 
          outlined 
          dense
          v-model="productImg">
        </v-file-input>
        <v-row>
          <v-col align="right">
            <v-btn 
              color="primary"
              @click="create"
              >등록하기</v-btn>
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
import { catchStatus } from "../mixins/catchStatus"
const R_target = 'http://127.0.0.1:8081/product'
const target = 'http://127.0.0.1:8082/product'

export default {
  data() {
    return {
      code: '',
      name: '',
      price: 0,    
      productImg: null,
      overlay:false,
      validoverlay:false,
      overlayText: '',
      validoverlayText: '',
      complete: false,
      completeText: ''
    }
  },
  methods: {
    codecheck() {
      if(this.code === '') {
        alert('제품코드를 입력하세요.')
        return
      }
      axios.get(`${R_target}/code/${this.code}`)
        .then(res => {
          if(res.data != '' || res.data == null) {
            // 이미 존재하는 코드
            this.overlay = true   
            this.overlayText = '이미 존재하는 제품코드입니다.'
            this.code = '' 
          } else {
            this.validoverlay = true
            this.validoverlayText = '사용 가능한 제품코드입니다.'
          }     
        })
        .catch(err => { 
          this.catchStatus(err)
        })
    },
    namecheck() {
      if(this.name == '') {
        alert('제품명을 입력하세요.')
        return
      }
      axios.get(`${R_target}/name/${this.name}`)
        .then(res => {
          if(res.data != '' || res.data == null) {
            // 이미 존재하는 제품명
            this.overlay = true  
            this.overlayText = '이미 존재하는 제품명입니다.' 
            this.name = '' 
          } else {
            this.validoverlay = true
            this.validoverlayText = '사용 가능한 제품명입니다.'
          }     
        })
        .catch(err => { 
          this.catchStatus(err)
        })
    },
    create() {
      if(this.code === '') {
        alert('제품코드를 입력하세요.')
        return
      }
      if(this.name == '') {
        alert('제품명을 입력하세요.')
        return
      }
      if(this.price == 0) {
        alert('제품가격을 입력하세요.')
        return
      }
      if(this.productImg == null) {
        alert('제품 이미지를 선택하세요.')
        return
      }

      let token = localStorage.getItem('access-token')
      let formData = new FormData()
      var json = {code: this.code, name: this.name, price: this.price}

      formData.append('file', this.productImg)

      // file과 여러개 String을 보낼수 없고
      // file과 JSON으로도 보낼수 없으므로
      // file과 JSON.stringify(json)로 보내야 한다.
      formData.append('productStr', JSON.stringify(json))

      axios.post(target + '/create', formData, { 
        headers: {
          'Content-Type': 'multipart/form-data',
          'access-token': token
        }
      }).then((res) => {
        this.completeText = '제품등록이 완료되었습니다.'
        this.complete = true
      }).catch(err => {
        if(err.response.status === 406) {
          this.completeText = '제품등록에 오류가 있습니다.(코드/이름중복)'
          this.complete = true
        } else
          this.catchStatus(err)
      })
    },
    reset() {
      this.$refs.form.reset()
      this.code = ''
      this.name = ''
      this.productImg = null
      this.price = 0
    } 
  },
  mixins: [catchStatus]
}
</script>
