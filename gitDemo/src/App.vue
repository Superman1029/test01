<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  beforeCreate() {
    if (!localStorage.getItem('tremePackers')) {
      window.localStorage['tremePackers'] = window.config.defTremePackers
      window.localStorage['logoBgindex'] = '3'
    }
  }
}
</script>
