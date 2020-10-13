export default {
  getRights() {
    // return Net.post('/signIn/', data);
    return [
      {
        id: 1,
        pid: 0,
        label: '基本功能',
        level: 1,
        showChildren: false,
        hasChildren: true,
        visible: true,
        isLeaf: false,
      }, {
        id: 2,
        pid: 1,
        label: '发起事项查看',
        level: 2,
        showChildren: false,
        hasChildren: false,
        visible: false,
        isLeaf: true,
      }, {
        id: 3,
        pid: 1,
        label: '我的任务查看',
        level: 2,
        showChildren: false,
        hasChildren: false,
        visible: false,
        isLeaf: true,
      }, {
        id: 4,
        pid: 0,
        label: '审计管理',
        level: 1,
        showChildren: false,
        hasChildren: true,
        visible: true,
        isLeaf: false,
      },
      {
        id: 5,
        pid: 4,
        label: '初审',
        level: 2,
        hasChildren: false,
        visible: false,
        isLeaf: true,
      }, {
        id: 6,
        pid: 0,
        label: '系统管理',
        level: 1,
        hasChildren: true,
        visible: true,
        showChildren: false,
        isLeaf: false,
      }, {
        id: 7,
        pid: 6,
        label: '学校组织机构',
        level: 2,
        hasChildren: false,
        visible: false,
        isLeaf: true,
      }, {
        id: 8,
        pid: 6,
        label: '中介机构信息',
        level: 2,
        hasChildren: true,
        visible: false,
        showChildren: false,
        isLeaf: false,
      }, {
        id: 9,
        pid: 8,
        label: 'TEST',
        level: 3,
        hasChildren: false,
        visible: false,
        isLeaf: true,
      },
    ];
  },
  getRoleRights(roldId) {
    // eslint-disable-next-line
        console.log(`获得角色${roldId}的权限`);
    return [2, 5, 9];
  },
};
