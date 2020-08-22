<template>
  <div>
    <h1>Yongs Market</h1>
    <ProductList />
  </div>
</template>

<script>
// @ is an alias to /src
import ProductList from "@/components/ProductList.vue";
export default {
  name: "market", 
  components: {
    ProductList
  }
};
</script>