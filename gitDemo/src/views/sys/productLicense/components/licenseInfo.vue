<template>
  <div>
    <div v-for="(item) in licenseList" :key="item.LicenseID" style="padding-bottom: 10px;">
      <span>{{ item.LicenseName }} ( {{ item.cnt }}/{{ item.AuthCount }} )</span>
      <el-progress :percentage="item.percentage" :color="customColorMethod" />
      <span style="font-size: 12px;color: gray;">{{ item.Memo }} 有效期至：{{ item.DueDate }}
        <span v-if="!item.DueDate">永久</span>
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getApiData } from '@/api/common'

export default {
  props: {},
  data() {
    return {
      licenseList: []
    }
  },
  computed: {
    ...mapGetters([])
  },
  created() {},
  methods: {
    customColorMethod(percentage) {
      if (percentage < 40) {
        return '#409eff'
      } else if (percentage < 80) {
        return '#FFA500'
      } else {
        return '#DC143C'
      }
    },
    loadLicenseCnt() {
      getApiData('sys.LicenseCnt', {}).then(r => {
        this.licenseList = r.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
