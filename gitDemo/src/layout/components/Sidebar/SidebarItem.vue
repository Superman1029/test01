<template>
  <li v-if="!item.hidden" class="menu-item-box">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <!--<el-tooltip :disabled="!sidebar.opened" effect="dark" :content="onlyOneChild.meta.title" placement="right" :open-delay="1000">-->
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" class="submenu-title-noDropdown">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
      <!--</el-tooltip>-->
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
        <!--<el-tooltip v-model="item.meta.showToolTip" :disabled="!sidebar.opened" effect="dark" :content="item.meta.title" placement="right" :open-delay="1000">-->
        <div class="menu-tooltip-box" />
        <!--</el-tooltip>-->
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </li>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from '@/layout/components/Sidebar/Item'
import AppLink from '@/layout/components/Sidebar/Link'
import FixiOSBug from '@/layout/components/Sidebar/FixiOSBug'
import { mapGetters } from 'vuex'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {
      test: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  created() {
    const self = this
    setTimeout(function() {
      self.test = true
    }, 3000)
  },
  methods: {
    showToolTipFunc(item, type) {
      console.log('showToolTip: ', item)
      item.meta.showToolTip = type
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
<style>
  .el-menu--horizontal>.menu-item-box{
    float: left;
  }
  .menu-tooltip-box {
    width: 100%;
    /*height: 56px;*/
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

