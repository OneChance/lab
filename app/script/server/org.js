export default {
  getCompOrg() {
    // return Net.post('/signIn/', data);
    return [{
      value: 1,
      label: '扬州大学',
      className: 'fa fa-building tree-icon',
      sort: 1,
      children: [{
        value: 2,
        label: '后勤保障处',
        className: 'fa fa-building tree-icon',
        sort: 1,
        children: [{
          value: 3,
          label: '绿化科',
          className: 'fa fa-building-o tree-icon',
          sort: 1,
        }, {
          value: 4,
          label: '水电科',
          className: 'fa fa-building-o tree-icon',
          sort: 2,
        }],
      }, {
        value: 5,
        label: '信息化建设中心',
        className: 'fa fa-building tree-icon',
        sort: 2,
        children: [{
          value: 6,
          label: '用户服务科',
          className: 'fa fa-building-o tree-icon',
          sort: 1,
        }, {
          value: 7,
          label: '规划科',
          className: 'fa fa-building-o tree-icon',
          sort: 2,
        }],
      }],
    }];
  },
};
