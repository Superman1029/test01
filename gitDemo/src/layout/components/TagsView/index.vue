<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll">
      <div class="tabs-line">
        <router-link
          v-for="tag in visitedViews"
          ref="tag"
          :key="tag.path"
          :class="isActive(tag)?'active':''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
          class="tags-view-item"
          @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
          @contextmenu.prevent.native="openMenu(tag,$event)"
        >
          <svg-icon class="icon-size" :icon-class="tag.meta.icon" />
          {{ tag.title }}
          <svg-icon v-if="!isAffix(tag)" class="el-icon-close" icon-class="close" @click.prevent.stop="closeSelectedTag(tag)" />
        </router-link>
      </div>
    </scroll-pane>
    <el-dropdown trigger="click" class="tags-cliick">
      <span class="el-dropdown-link">
        <svg-icon icon-class="menu" class="hover-effect" />
      </span>
      <el-dropdown-menu slot="dropdown" style="min-width: 100px;">
        <el-dropdown-item @click.native="refreshSelectedTag($route)">刷新</el-dropdown-item>
        <el-dropdown-item @click.native="closeOthersTags($route)">关闭其他</el-dropdown-item>
        <el-dropdown-item @click.native="closeAllTags(selectedTag)">关闭所有</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li @click="closeOthersTags(selectedTag)">关闭其他</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from '@/layout/components/TagsView/ScrollPane'
import path from 'path'

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    },
    routes() {
      return this.$store.state.tagsView.routes
    },
    sidebar() {
      return this.$store.state.app.sidebar
    }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.initTags()
    this.addTags()
  },
  methods: {
    toggleSideBar(status) {
      this.$emit('toggleSideBar', status)
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    isAffix(tag) {
      return tag.meta && tag.meta.affix
    },
    filterAffixTags(routes, basePath = '/') {
      let tags = []
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path)
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          })
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path)
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags]
          }
        }
      })
      return tags
    },
    initTags() {
      const affixTags = this.affixTags = this.filterAffixTags(this.routes)
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch('tagsView/addVisitedView', tag)
        }
      }
    },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('tagsView/updateVisitedView', this.$route)
            }
            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view)
        }
      })
    },
    closeOthersTags(view) {
      this.$router.push(view)
      this.$store.dispatch('tagsView/delOthersViews', view).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags(view) {
      this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return
        }
        this.toLastView(visitedViews, view)
      })
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0]
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === 'Dashboard') {
          // to reload home page
          this.$router.replace({ path: '/redirect' + view.fullPath })
        } else {
          this.$router.push('/')
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 90
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY - 30
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    },
    handleScroll() {
      this.closeMenu()
    }
  }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  /*padding-top: 5px;*/
  height: 35px;
  overflow: hidden;
  width: 100%;
  background: #fff;
  /*border-bottom: 1px solid #d8dce5;*/
  // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  z-index: 9;
  display: flex;
  border-bottom: 1px solid #d8dce5;
  .hamburger-container {
    background: #fff;
    z-index: 2;
    line-height: 33px;
    // border-right: 1px solid #ccc;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  .tags-view-wrapper {
    width: 100%;
    height: 50px;
    .tabs-line {
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 35px;
        line-height: 35px;
        /*border: 1px solid #d8dce5;*/
        /*border-bottom: none;*/
        /*border-top-right-radius: 5px;*/
        /*border-top-left-radius: 5px;*/
        color: #495060;
        /*background: rgb(245,247,250);*/
        padding: 0 8px;
        font-size: 12px;
        /*margin-left: 10px;*/
        /*margin-top: 2px;*/
        &:first-of-type {
          margin-left: 0;
        }
        &:last-of-type {
        margin-right: 5px;
        }
        &.active::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 3px;
          bottom: 0;
          left: 0;
          background-color: var(--defaultColor);
        }
        &.active {
          /*background-color: var(--defaultColor);*/
          color: var(--defaultColor);
          background: rgba(var(--defaultColorRGB),0.1);
        }
        &:hover {
          color: var(--defaultColor);
          background: rgba(var(--defaultColorRGB),0.1);
        }
      }
    }
  }
  .tags-cliick {
    background: #fff;
    z-index: 2;
    line-height: 33px;
    // border-left: 1px solid #ccc;
    padding: 0 5px;
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      margin-left: 5px;
      &:hover {
        transform: scale(1.2);
      }
    }
  }
}
</style>
