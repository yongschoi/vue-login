<template>
  <div>
    <h1>주문하기</h1>
    <OrderForm />
  </div>
</template>

<script>
// @ is an alias to /src
import OrderForm from "@/components/OrderForm.vue";
export default {
  name: "selectproduct",
  components: {
    OrderForm
  },
  data() {
    return {

    }
  }
};
</script>