<template>
  <div class="home" align="center">
    <h2>{{ now }}</h2>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { commonFunc } from "../mixins/commonFunc"

export default {
  name: "home",
  data() {
    return {
      now: null
    }
  },
  components: {
    HelloWorld
  },
  created() {
    this.now = commonFunc.getDateAndTime(new Date())
  }
};
</script>
