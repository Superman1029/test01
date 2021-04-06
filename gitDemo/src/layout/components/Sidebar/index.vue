<template>
  <div :class="{'has-logo':showLogo}">
    <!--<logo v-if="showLogo" :collapse="isCollapse" />-->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :background-color="defaultColor"
        :text-color="textColor"
        :unique-opened="true"
        :active-text-color="textColor"
        :collapse-transition="true"
        mode="horizontal"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from '@/layout/components/Sidebar/SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  data() {
    return {
      defaultColor: localStorage.getItem('tremePackers') ? localStorage.getItem('tremePackers') : '#409EFF',
      textColor: '#fff'
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'permission_routes']),
    routes() {
      return this.$store.state.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'tremePackers') {
        e.newValue ? this.defaultColor = e.newValue : ''
      }
      if (e.key === 'logoBgindex') {
        if (e.newValue && e.newValue === '3') {
          this.textColor = '#1f2d3d'
        } else {
          this.textColor = '#fff'
        }
      }
    })
  }
}
</script>
<style>
  #app .hideSidebar .el-submenu>.el-submenu__title{
    transition-duration: 0s, 0s, 0s !important;
  }

</style>
