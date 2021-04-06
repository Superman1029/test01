<template>
  <div>
    <risk-layout :stepcode="$route.name" :stepname="$route.meta.title" :is-tinymce="true" @setTinyMceHeight="setTinyMceHeight" @resizeChange="setTinyMceHeight" @isFoldChange="setTinyMceHeight" @onloaded="onloaded">
      <div slot="title-left">审计结论
        <!-- {{ $route.meta.title }} -->
      </div>
      <div slot="content" style="height: 100%;">
        <div ref="tinyMceBox" style="width: 100%;height: 100%;overflow: auto;">
          <tinymce v-if="isShow" v-model="content" :toolbar="toolbar" :height="tinyMceHeight" @getTinyMceId="getTinyMceId" />
        </div>
      </div>
    </risk-layout>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import riskLayout from '@/views/risk/components/riskLayout'
import { getApiData } from '@/api/common'
import { mapGetters } from 'vuex'

export default {
  name: 'Tinymace',
  components: { Tinymce, riskLayout },
  data() {
    return {
      isShow: false, // 是否展示富文本
      tinyMceId: '', // 富文本的id
      tinyMceHeight: 200, // 富文本的高度
      toolbar: ['bold italic underline strikethrough'], // 富文本工具栏展示信息
      content: '' // 富文本中展示的信息
    }
  },
  computed: {
    ...mapGetters(['curProject'])
  },
  created() {

  },
  mounted() {
    this.setTinyMceHeight()
    var self = this
    window.onresize = () => {
      self.setTinyMceHeight()
    }
  },
  methods: {
    // 风险界面加载
    onloaded() {
      this.getAuditConclusion()
    },
    // 获取审计结论
    getAuditConclusion() {
      getApiData('risk.getConclusion', {
        dbname: this.curProject.dbname,
        zcbfid: this.curProject.zcbfid,
        stepcode: this.$route.name,
        item: ''
      }).then(res => {
        if (res.data.length > 0) {
          this.content = res.data[0].RichText
        } else {
          this.content = ''
        }
      })
    },
    // 获取id
    getTinyMceId(id) {
      this.tinyMceId = id + '_ifr'
    },
    // 设置富文本的高度
    setTinyMceHeight() {
      const height = this.$refs.tinyMceBox.offsetHeight - 38
      if (this.tinyMceId) {
        document.getElementById(this.tinyMceId).style.height = height + 'px'
      }
      this.tinyMceHeight = height
      this.isShow = true
    }
  }
}
</script>
<style lang="scss" scoped></style>
