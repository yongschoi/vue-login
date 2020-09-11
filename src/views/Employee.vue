<template>  
  <div>
    <h1>Employee</h1>
    <v-data-table 
      dense
      :headers="headers"
      :items="employees"
      :items-per-page="50"
      class="elevation-1"
    >
    </v-data-table>
  </div>
</template>

<script>
import axios from "axios"
import { catchStatus } from "../mixins/catchStatus"
const target = 'http://127.0.0.1:8081/employee'

export default {
  data () {
    return {
      headers: [
        {
          text: 'No',
          align: 'left',
          sortable: true,
          value: 'id',
        },
        { text: 'Name', value: 'name' },
        { text: 'Sex', value: 'sex' },
        { text: 'Salary', value: 'salary' }
      ],
      employees: []
    }
  },
  created() {
    this.getEmployees()
  }, 
  methods: {
    getEmployees() {
      // webflux gateway에 접근할 경우 명시적으로 header 셋팅(default 방식은 이슈가 있음)
      let token = localStorage.getItem('access-token')
      axios.get(`${target}/all`, { 
        headers: {
          'access-token': token
        }
      }).then(res => { 
          this.employees = res.data 
          console.log(this.employees.length)
      })
      .catch(err => {
        this.catchStatus(err)
      })
    },
    // 페이징 방식으로 호출하는 함수
    getPageEmployees(page, size) {
      let token = localStorage.getItem('access-token')
      axios.get(`${target}/all-paged?page=${page}&size=${size}`, { 
        headers: {
          'access-token': token
        }
      }).then(res => { 
          this.employees = res.data 
          console.log(this.employees.length)
      })
      .catch(err => {
        this.catchStatus(err)
      })
    }
  },
  mixins: [catchStatus]
}
</script>

<style>

</style>