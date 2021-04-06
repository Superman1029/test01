import { constantRoutes } from '@/router'
import { common } from '@/utils/common'
import { getApiData } from '@/api/common'
import Layout from '@/layout'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, usercode) {
    return new Promise((resolve, reject) => {
      getApiData('getRoutes', {
        usercode: usercode
      }).then(res => {
        const accessedRoutes = []
        res.data.forEach(item => {
          if (item.pid === '') {
            accessedRoutes.push({ id: item.id, pid: '', path: item.path, component: Layout, name: item.name, meta: { title: item.title, icon: item.icon, noCache: !item.keepAlive }})
          } else {
            item.component = item.component.split('@/views/')[1]
            accessedRoutes.push({ id: item.id, pid: item.pid, path: item.path, name: item.name, component: resolve => require([`@/views/${item.component}`], resolve), meta: { title: item.title, icon: item.icon, noCache: !item.keepAlive }})
          }
        })
        commit('SET_ROUTES', common.list2Tree(accessedRoutes, ''))
        resolve(common.list2Tree(accessedRoutes, ''))
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
