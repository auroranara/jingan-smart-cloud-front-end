

export default {
  namespace: 'department',
  state: {
    data: {
      list: [
        {
          id: '001',
          name: 'test01啊打打打打打打打打打打打打打打打打打打',
          number: 123,
          children: [
            {
              id: 'oo2',
              name: 'test0啊是大2',
              number: 45,
            },
          ],
        },
        {
          id: '003',
          name: 'test03阿萨大大大苏打的',
          number: 445,
        },
      ],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
    },
  },

  effects: {

  },
  reducers: {

  },
}
