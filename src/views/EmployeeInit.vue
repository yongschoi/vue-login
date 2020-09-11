<template>
  <div>
    <h1>Data Initailize</h1>
    <v-container>
      <v-row>
        <v-col>
          <v-currency-field
            dense
            outlined
            label="Employee 수"
            v-model="numOfEmployee"
          ></v-currency-field>
        </v-col>
        <v-col>
          <v-btn color="error" @click="init">데이터생성</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios"
import { catchStatus } from "../mixins/catchStatus"
const target = 'http://127.0.0.1:8081/employeestatus'

export default {
  data() {
    return {
      numOfEmployee: 0
    }
  },
  methods: {
    init() {
      let token = localStorage.getItem('access-token')
      axios.post(target + '/init', {num: this.numOfEmployee}, 
      { 
        headers: {
          'access-token': token
        }
      }).then((res) => {
        alert('생성완료')
      }).catch(err => {
        this.catchStatus(err)
      })
    }
  }
}
</script>