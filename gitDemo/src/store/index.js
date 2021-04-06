import Vue from 'vue'
import Vuex from 'vuex'
import getters from '@/store/getters'
import app from '@/store/modules/app'
import settings from '@/store/modules/settings'
import user from '@/store/modules/user'
import tagsView from '@/store/modules/tagsView'
import common from '@/store/modules/common'
import permission from '@/store/modules/permission'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    tagsView,
    common,
    permission
  },
  getters
})

export default store
