<template>
  <div>
    <h1>Data Grid (Bulk)</h1>
    <v-container>
      <v-row>        
        <v-col>        
          <v-btn color="success" @click="$refs.emplist.getEmployees()">Full 조회</v-btn>
        </v-col>
        <v-divider class="mx-4" vertical></v-divider>
        <v-col>
          <v-currency-field
            dense
            outlined
            label="페이지"
            v-model="page"
          ></v-currency-field>
        </v-col>
        <v-col>
          <v-currency-field
            dense
            outlined
            label="조회건수"
            v-model="total"
          ></v-currency-field>
        </v-col>
        <v-col>        
          <v-btn color="primary" @click="$refs.emplist.getPageEmployees(page, total)">Paging 조회(Salary기준)</v-btn>
        </v-col>
        <v-divider class="mx-4" vertical></v-divider>
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
    <EmployeeList ref="emplist"></EmployeeList>
  </div>
</template>

<script>
import axios from "axios"
import { catchStatus } from "../mixins/catchStatus"
const target = 'http://127.0.0.1:8081/employee'

// @ is an alias to /src
import EmployeeList from "@/components/EmployeeList.vue";
export default {
  name: "Grid",
  components: {
    EmployeeList
  },
  data() {
    return {
      numOfEmployee: 0,
      page: 0,
      total: 1000
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