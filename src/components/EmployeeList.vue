<template>
  <div>
    <v-data-table 
      dense
      :headers="headers"
      :items="employees"
      :items-per-page="200"
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
          text: 'Employee No',
          align: 'left',
          sortable: true,
          value: 'id',
        },
        { text: 'Name', value: 'name' },
        { text: 'Salary', value: 'salary' },
        { text: 'Project', value: 'project' },
        { text: 'Skill', value: 'skill' },
        { text: 'Level', value: 'level' }  
      ],
      employees: []
    }
  },
  created() {
    this.getEmployees()
  },
  methods: {
    getEmployees() {
      // webflux gateway에 접근할 경우 명시저으로 header 셋팅(default 방식은 이슈가 있음)
      let token = localStorage.getItem('access-token')
      axios.get(`${target}/all`, { 
        headers: {
          'access-token': token
        }
      }).then(res => { 
          this.employees = res.data 
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