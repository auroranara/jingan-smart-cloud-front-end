const defaultPagination = { total: 0, pageNum: 1, pageSize: 10 }
export default {
  namespace: 'baseInfo',
  state: {
    // 特种作业操作证人员
    specialoPerationPermit: {
      list: [
        {
          id: '1',
          companyName: '利民化工股份有限公司',
          name: '王进',
          gender: '男',
          birthDay: '1995.05.11',
          phone: '13815264532',
          type: '电工作业-高压电工作业',
          operationPermit: {},
          dannex: {},
        },
      ],
      pagination: defaultPagination,
    },
    // 特种设备作业人员
    specialEquipmentOperators: {
      list: [
        {
          id: '1',
          companyName: '利民化工股份有限公司',
          name: '李逵',
          gender: '男',
          birthDay: '1994.03.21',
          phone: '13815264532',
          type: '锅炉作业',
          project: '工业锅炉司炉',
          operationPermit: {},
          dannex: {},
        },
      ],
      pagination: defaultPagination,
    },
    // 危险化学品企业安全许可证
    dangerChemicalsPermit: {
      list: [
        {
          id: '1',
          companyName: '利民化工股份有限公司',
          name: '李明',
          permitStatus: '现用',
          validityPeriod: '2019.8.1',
          dannex: {},
        },
        {
          id: '2',
          companyName: '利民化工股份有限公司',
          name: '王思',
          permitStatus: '吊销',
          validityPeriod: '2020.3.1',
          dannex: {},
        },
      ],
      pagination: defaultPagination,
    },
  },
  effects: {},
  reducers: {},
}
