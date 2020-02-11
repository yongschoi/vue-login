<template>
  <v-card>
    <v-row
      class="pa-4"
      justify="space-between"
    >
      <v-col cols="5">
        <v-treeview
          :active.sync="active"
          :items="items"
          :load-children="fetchUsers"
          :open.sync="open"
          activatable
          color="primary"
          open-on-click
          transition
        >
          <template v-slot:prepend="{ item, active }">
            <v-icon v-if="!item.children">mdi-account</v-icon>
          </template>
        </v-treeview>
      </v-col>

      <v-divider vertical></v-divider>

      <v-col
        class="d-flex text-center"
      >
        <v-scroll-y-transition mode="out-in">
          <div
            v-if="!selected"
            class="title grey--text text--lighten-1 font-weight-light"
            style="align-self: center;"
          >
            Select a User
          </div>
          <v-card
            v-else
            :key="selected.id"
            class="pt-6 mx-auto"
            flat
            max-width="400"
          >
            <v-card-text>
              <v-avatar
                v-if="avatar"
                size="88"
              >
                <v-img
                  :src="`https://avataaars.io/${avatar}`"
                  class="mb-6"
                ></v-img>
              </v-avatar>
              <h3 class="headline mb-2">
                {{ selected.name }}
              </h3>
              <div class="blue--text mb-2">{{ selected.email }}</div>
            </v-card-text>
            <v-divider></v-divider>
            <v-container fluid>
              <v-row justify="space-between">
                <v-checkbox class="ma-3" v-model="roles" label="USER" value="USER" disabled></v-checkbox>
                <v-checkbox class="ma-3" v-model="roles" label="ADMIN" value="ADMIN" @change="roleChange"></v-checkbox>
              </v-row>
            </v-container>
            <v-btn 
              small
              class="mr-1"
              color="primary" 
              :disabled="!onSave"
              @click="updateRole(selected.email)">권한 변경</v-btn>
            <v-btn 
              small
              class="mr-1"
              color="error" 
              @click.stop="dialog = true">사용자삭제</v-btn>
              <v-dialog v-model="dialog" max-width="290">
                <v-card>
                  <v-card-title class="headline">사용자 삭제</v-card-title>
                  <v-card-text>선택하신 사용자를 삭제합니다.</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="green darken-1"
                      text
                      @click="dialog = false"
                    >취소</v-btn>
                    <v-btn
                      color="red darken-1"
                      text
                      @click="deleteUser(selected.email);dialog = false"
                    >삭제</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
          </v-card>
        </v-scroll-y-transition>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import axios from "axios"
import { catchStatus } from "../mixins/catchStatus"
const target = 'http://127.0.0.1:8082/user'

const avatars = [
    '?accessoriesType=Blank&avatarStyle=Circle&clotheColor=PastelGreen&clotheType=ShirtScoopNeck&eyeType=Wink&eyebrowType=UnibrowNatural&facialHairColor=Black&facialHairType=MoustacheMagnum&hairColor=Platinum&mouthType=Concerned&skinColor=Tanned&topType=Turban',
    '?accessoriesType=Sunglasses&avatarStyle=Circle&clotheColor=Gray02&clotheType=ShirtScoopNeck&eyeType=EyeRoll&eyebrowType=RaisedExcited&facialHairColor=Red&facialHairType=BeardMagestic&hairColor=Red&hatColor=White&mouthType=Twinkle&skinColor=DarkBrown&topType=LongHairBun',
    '?accessoriesType=Prescription02&avatarStyle=Circle&clotheColor=Black&clotheType=ShirtVNeck&eyeType=Surprised&eyebrowType=Angry&facialHairColor=Blonde&facialHairType=Blank&hairColor=Blonde&hatColor=PastelOrange&mouthType=Smile&skinColor=Black&topType=LongHairNotTooLong',
    '?accessoriesType=Round&avatarStyle=Circle&clotheColor=PastelOrange&clotheType=Overall&eyeType=Close&eyebrowType=AngryNatural&facialHairColor=Blonde&facialHairType=Blank&graphicType=Pizza&hairColor=Black&hatColor=PastelBlue&mouthType=Serious&skinColor=Light&topType=LongHairBigHair',
    '?accessoriesType=Kurt&avatarStyle=Circle&clotheColor=Gray01&clotheType=BlazerShirt&eyeType=Surprised&eyebrowType=Default&facialHairColor=Red&facialHairType=Blank&graphicType=Selena&hairColor=Red&hatColor=Blue02&mouthType=Twinkle&skinColor=Pale&topType=LongHairCurly',
  ]

  const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

  export default {
    data: () => ({
      active: [],
      avatar: null,
      open: [],
      users: [],
      roles: [],
      onSave: false,
      dialog: false
    }),

    computed: {
      items () {
        return [
          {
            name: 'Users',
            children: this.users,
          },
        ]
      },
      selected () {
        if (!this.active.length) return undefined
        // v-treeview를 사용할 경우 id(int)가 반드시 존재해야 함.
        const id = this.active[0]
        const result = this.users.find(user => user.id === id)
        this.roles = result.roles
        this.onSave = false
        return result
      },
    },

    watch: {
      selected: 'randomAvatar',
    },

    methods: {
      async fetchUsers (item) {
        let token = localStorage.getItem('access-token')
        // Remove in 6 months and say
        // you've made optimizations! :)
        await pause(1500)

        return fetch(target + '/all',  { 
          headers : {
            'access-token': token
          }
        }).then(res => res.json())
          .then(json => (item.children.push(...json)))
          .catch(err => {
            console.log(err)
            this.catchStatus(err)
        });
      },
      randomAvatar () {
        this.avatar = avatars[Math.floor(Math.random() * avatars.length)]
      },
      roleChange() {
        // 체크박스가 ADMIN 하나이므로 toggle 방식이 가능함
        // checkbox가 ADMIN외에 DBA, SWA 등 다수일 경우 기존 roles(배열)와 변경된 roles(배열)를 서로 비교해야 하는 이슈가 있음.
        this.onSave = !this.onSave                            
      },
      updateRole(email) {
        let token = localStorage.getItem('access-token')
        axios.post(target + '/role/update', {
          email: email,
          roles: this.roles
        }, 
        {
          headers : {
          'access-token': token
        }
        }).then((res) => {
          // users 데이터를 갱신시킨다.
          const id = this.active[0]
          // const idx = this.users.findIndex(function(item) {return item.id === id})
          const idx = this.users.findIndex(item => item.id === id)
          this.users[idx].roles = this.roles
          this.onSave = false
          console.log('/role/update:', res.data)
        }).catch(err => {
            console.log(err)
            this.catchStatus(err)
        });
      },
      deleteUser(email) {
        // access-token은 store/index.js에서 axios.defaults.headers로 설정함
        axios.post(target + '/delete', {
          email: email
        }).then((res) => {
          // users 데이터를 갱신시킨다.
          const id = this.active[0]
          // const idx = this.users.findIndex(function(item) {return item.id === id})
          const idx = this.users.findIndex(item => item.id === id)
          this.users.splice(idx, 1)
          // 삭제된 user를 화면에서도 날린다.
          this.active = ''
        }).catch(err => {
            console.log(err)
            this.catchStatus(err)
        });
      },
    },
    mixins: [catchStatus]
  }
</script>