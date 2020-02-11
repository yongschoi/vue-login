<template>
<v-container>
  <div>
    <h1>{{ userInfo.name }}환영합니다.</h1>
  </div>
  <AccountList />
</v-container>
</template>

<script>
import { mapState } from "vuex"
// @ is an alias to /src
import AccountList from "@/components/AccountList.vue";

export default {
  name: 'Mypage',
  components: {
    AccountList
  }, 
  computed: {
    ...mapState(['userInfo'])
  }
}
</script>