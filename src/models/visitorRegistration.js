import {} from '@/services/visitorRegistration';

const defaultData = {
  list: [],
  pagination: { pageNum: 1, pageSize: 10, total: 0 },
};

export default {
  namespace: 'visitorRegistration',

  state: {
    registrationData: defaultData,
    cardData: defaultData,
  },

  effects: {},

  reducers: {},
};
