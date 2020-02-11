<template>
  <div>
    <h1>Data Grid (Bulk)</h1>
    <EmployeeList />
  </div>
</template>

<script>
// @ is an alias to /src
import EmployeeList from "@/components/EmployeeList.vue";
export default {
  name: "Grid",
  components: {
    EmployeeList
  }
};
</script>