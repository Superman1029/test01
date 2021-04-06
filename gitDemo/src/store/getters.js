const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userinfo: state => state.user.userinfo,
  curProject: state => state.common.curProject,
  permission_routes: state => state.permission.routes,
  isShowChangePro: state => state.common.isShowChangePro,
  language: state => state.app.language
}
export default getters
