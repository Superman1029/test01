/**
 * 数据权限控制，目前 有，超级管理员，系统管理员，档案管理员
 * modfiy by  on 16/11/18.
 */
import store from '@/store'
/**
 * 用户角色 相关权限
 */
const userRole = {
  // 获取 英文的 rolename 因为现在系统中存的都是 中文的。
  getRoleName() {
    const rolename = store.getters.userinfo.rolename
    if (rolename === '超级管理员') {
      return 'superAdmin'
    } else if (rolename === '系统管理员') {
      return 'sysAdmin'
    } else if (rolename === '档案管理员') {
      return 'archivist'
    }
  },
  // 当前用户 是否包含 roles 中的角色（系统角色）
  isInclude(roles) {
    const rolename = userRole.getRoleName()
    if (!roles) return false
    if (typeof (roles) === 'string') {
      return rolename === roles
    }
    // 否则按 数组处理
    for (let i = 0, len = roles.length; i < len; i++) {
      if (roles[i] === rolename) return true
    }
    return false
  },
  isUser() {

  }
}

export { userRole }
