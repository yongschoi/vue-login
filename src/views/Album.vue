<template>
  <div>
    <h1>Album</h1>
    <AlbumExplorer />
  </div>
</template>

<script>
// @ is an alias to /src
import AlbumExplorer from "@/components/AlbumExplorer.vue";
export default {
  name: "Album",
  components: {
    AlbumExplorer
  }
};
</script>