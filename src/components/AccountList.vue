<template>
  <v-container>
    <v-row v-if="!certi">
      <v-col cols="12">
        <v-sheet
          class="d-flex justify-center align-center"
          color="blue-grey darken-4"
          height="700"
        >
          <v-sheet width="250" color="blue-grey darken-4">
            <v-flex xs12>
              <v-alert 
                class="mb-2"
                type="error"
                :value="certiFail" 
              >비밀번호를 확인하세요.
              </v-alert>
            </v-flex>
            <v-text-field
              solo
              label="비밀번호를 입력하세요."
              v-model="password"
              type="password"
              :rules="passwordRules" 
            ></v-text-field>
            <div class="text-center">
              <v-btn 
                class="mx-2" 
                fab 
                small 
                color="blue-grey darken-2"
                @click="certificate">
                <v-icon>mdi-cached</v-icon>
              </v-btn>
            </div>
          </v-sheet>
        </v-sheet>
      </v-col>
    </v-row>
    <v-card 
      v-else
      flat
      max-width="400"
      class="mx-auto"
    >
      <v-row>
        <v-col cols="12">
          <v-card
            color="yellow darken-1"
            height="130"
          >
          <v-card-title class="headline">Unlimited music now</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex"
import axios from "axios"
import { catchStatus } from "../mixins/catchStatus"

const target = 'http://127.0.0.1:8082/user'

export default {
  name: "Account",
  data() {
    return {
      password: null,
      passwordRules: [
        v => !!v || 'Password is required',
      ],
      certi: false,
      certiFail: false
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    certificate() {
      let token = localStorage.getItem('access-token')
      this.userInfo.password = this.password
      axios.post(target + '/certificate', this.userInfo, { 
        headers : {
          'access-token': token
        }
      })
        .then(res => {
          this.certi = true
        })
        .catch(err => {
          this.certi = false
          this.certiFail = true

          this.catchStatus(err)
        });  
    },
  },
  mixins: [catchStatus]
};
</script>