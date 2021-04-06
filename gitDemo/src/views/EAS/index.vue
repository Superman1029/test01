<template>
  <div class="app-container">
    <iframe
      id="show-iframe"
      class="iframe"
      frameborder="0"
      name="showHere"
      scrolling="auto"
      :src="'/UACheck/index?loginType=2&token=' + token"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
  .app-container {
    padding: 0;
    .iframe {
      width: 100%;
      height: 100%;
    }
  }
</style>
