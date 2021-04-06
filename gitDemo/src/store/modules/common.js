const state = {
  isShowChangePro: false,
  curProject: {
    dbname: '', // 项目库
    projectid: '', // 项目ID
    zcbfid: '', // 组成部分ID
    projectName: '', // 项目名称
    zcbfName: '', // 组成名称
    userRole: '', // 项目角色
    sjnd: '' // 审计年度
  }
}

const mutations = {
  CHANGE_CURPROJECT: (state, curProject) => {
    state.curProject = curProject
  },
  CHANGE_PROJECT: (state, isShowChangePro) => {
    state.isShowChangePro = isShowChangePro
  }
}

const actions = {
  changeCurProject({ commit }, curProject) {
    commit('CHANGE_CURPROJECT', curProject)
  },
  changeProject({ commit }, isShowChangePro) {
    commit('CHANGE_PROJECT', isShowChangePro)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
