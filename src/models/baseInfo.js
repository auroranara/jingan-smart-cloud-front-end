const defaultPagination = { total: 0, pageNum: 1, pageSize: 10 }
export default {
  namespace: 'baseInfo',
  state: {
    specialoPerationPermit: {
      list: [
        {
          id: '1',
          companyName: '利民化工股份有限公司',
          name: '王进',
          gender: '男',
          birthDay: '1995-05-11',
          phone: '13815264532',
          type: '电工作业-高压电工作业',
          operationPermit: {},
          dannex: {},
        },
      ],
      pagination: defaultPagination,
    },
  },
  effects: {},
  reducers: {},
}
