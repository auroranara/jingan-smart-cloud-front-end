export const lecSettings = {
  l: { // 事件发生可能性（L）
    columns: [
      {
        title: '分值',
        key: 'score',
        dataIndex: 'score',
        width: 200,
      },
      {
        title: '事故、事件或偏差发生的可能性',
        key: 'label',
        dataIndex: 'label',
      },
    ],
    list: [
      {
        score: 10,
        label: '完全可以预料',
      },
      {
        score: 6,
        label: '相当可能；或危害的发生不能被发现（没有监测系统）；或在现场没有采取防范、监测、保护、控制措施；或在正常情况下经常发生此类事故、事件或偏差',
      },
      {
        score: 3,
        label: '可能，但不经常；或危害的发生不容易被发现；现场没有检测系统或保护措施（如没有保护装置、没有个人防护用品等），也未作过任何监测；或未严格按操作规程执行；或在现场有控制措施，但未有效执行或控制措施不当；或危害在预期情况下发生',
      },
      {
        score: 1,
        label: '可能性小，完全意外；或危害的发生容易被发现；现场有监测系统或曾经作过监测；或过去曾经发生类似事故、事件或偏差；或在异常情况下发生过类似事故、事件或偏差',
      },
      {
        score: 0.5,
        label: '很不可能，可以设想；危害一旦发生能及时发现，并能定期进行监测',
      },
      {
        score: 0.2,
        label: '极不可能；有充分、有效的防范、控制、监测、保护措施；或员工安全卫生意识相当高，严格执行操作规程',
      },
      {
        score: 0.1,
        label: '实际不可能',
      },
    ],
  },
  e: { // 暴露于危险环境的频繁程度（E）
    columns: [
      {
        title: '分值',
        key: 'score',
        dataIndex: 'score',
        width: 200,
      },
      {
        title: '频繁程度',
        key: 'label',
        dataIndex: 'label',
      },
    ],
    list: [
      {
        score: 10,
        label: '连续暴露',
      },
      {
        score: 6,
        label: '每天工作时间内暴露',
      },
      {
        score: 3,
        label: '每周一次或偶然暴露',
      },
      {
        score: 2,
        label: '每月一次暴露',
      },
      {
        score: 1,
        label: '每年几次暴露',
      },
      {
        score: 0.5,
        label: '非常罕见地暴露',
      },
    ],
  },
  c: { // 发生事故事件偏差产生的后果严重性（C）
    columns: [
      {
        title: '分值',
        key: 'score',
        dataIndex: 'score',
        width: 200,
      },
      {
        title: '法律法规及其他要求',
        key: 'law',
        dataIndex: 'law',
        width: 200,
      },
      {
        title: '人员伤亡',
        key: 'death',
        dataIndex: 'death',
        width: 200,
      },
      {
        title: '直接经济损失（万元）',
        key: 'loss',
        dataIndex: 'loss',
        width: 200,
      },
      {
        title: '停工',
        key: 'lockout',
        dataIndex: 'lockout',
        width: 200,
      },
      {
        title: '公司形象',
        key: 'image',
        dataIndex: 'image',
        width: 200,
      },
    ],
    list: [
      {
        score: 100,
        law: '严重违反法律法规和标准',
        death: '10人以上死亡，或50人以上重伤',
        loss: '5000以上',
        lockout: '公司停产',
        image: '重大国际、国内影响',
      },
      {
        score: 40,
        law: '违反法律法规和标准',
        death: '3人以上10人以下死亡，或10人以上50人以下重伤',
        loss: '1000以上',
        lockout: '装置停工',
        image: '行业内、省内影响',
      },
      {
        score: 15,
        law: '潜在违反法规和标准',
        death: '3人以下死亡，或10人以下重伤',
        loss: '100以上',
        lockout: '部分装置停工',
        image: '地区影响',
      },
      {
        score: 7,
        law: '不符合上级或行业的安全方针、制度、规定等',
        death: '丧失劳动力、截肢、骨折、听力丧失、慢性病',
        loss: '10万以上',
        lockout: '部分设备停工',
        image: '公司及周边范围',
      },
      {
        score: 2,
        law: '不符合公司的安全操作程序、规定',
        death: '轻微受伤、间歇不舒服',
        loss: '1万以上',
        lockout: '1套设备停工',
        image: '引人关注，不利于基本的安全卫生要求',
      },
      {
        score: 1,
        law: '完全符合',
        death: '无伤亡',
        loss: '1万以下',
        lockout: '没有停工',
        image: '形象没有受损',
      },
    ],
  },
  riskLevelList: [
    {
      range: value => value > 320,
      level: '1',
      colorName: '红色',
      color: 'red',
      degree: '重大风险',
      controllevel: '公司（厂）级、车间（部室）级、班组、岗位管控',
    },
    {
      range: value => value >= 160 && value <= 319,
      level: '2',
      colorName: '橙色',
      color: 'orange',
      degree: '较大风险',
      controllevel: '公司（厂）级、车间（部室）级、班组、岗位管控',
    },
    {
      range: value => value >= 70 && value <= 159,
      level: '3',
      colorName: '黄色',
      color: '#FFCC33',
      degree: '一般风险',
      controllevel: '车间（部室）级、班组、岗位管控',
    },
    {
      range: value => value < 70,
      level: '4',
      colorName: '蓝色',
      color: '#00b0f0',
      degree: '低风险',
      controllevel: '班组、岗位管控',
    },
  ],
};

export const lsSettings = {
  l: {
    columns: [
      {
        title: '等级',
        key: 'score',
        dataIndex: 'score',
        width: 200,
      },
      {
        title: '标准',
        key: 'label',
        dataIndex: 'label',
      },
    ],
    list: [
      {
        score: 5,
        label: '在现场没有采取防范、监测、保护、控制措施，或危险有害因素的发生不能被发现（没有监测系统），或在正常情况下经常发生此类事故或事件',
      },
      {
        score: 4,
        label: '危险有害因素的发生不能被发现，现场没有检测系统，也未作过任何监测，或在现场有控制措施，但未有效执行或控制措施不当，或危险有害因素常发生或在预期情况下发生',
      },
      {
        score: 3,
        label: '没有保护措施（如没有防护装置、没有个人防护用品等），或未严格按操作程序执行，或危险、有害因素的发生容易被发现（现场有监测系统），或曾经作过监测，或过去曾经发生类似事故或事件，或在异常情况下发生过类似事故或事件',
      },
      {
        score: 2,
        label: '危险有害因素一旦发生能及时发现，并定期进行监测，或现场有防范控制措施，并有有效执行或过去偶尔发生危险事故或事件',
      },
      {
        score: 1,
        label: '有充分、有限的防范、控制、监测、保护措施，或员工安全卫生意识相当高，严格执行操作规程，极不可能发生事故或事件',
      },
    ],
  },
  s: {
    columns: [
      {
        title: '等级',
        key: 'score',
        dataIndex: 'score',
        width: 200,
      },
      {
        title: '法律、法规及其他要求',
        key: 'law',
        dataIndex: 'law',
        width: 200,
      },
      {
        title: '人员',
        key: 'death',
        dataIndex: 'death',
        width: 200,
      },
      {
        title: '直接经济损失',
        key: 'loss',
        dataIndex: 'loss',
        width: 200,
      },
      {
        title: '停工',
        key: 'lockout',
        dataIndex: 'lockout',
        width: 200,
      },
      {
        title: '企业形象',
        key: 'image',
        dataIndex: 'image',
        width: 200,
      },
    ],
    list: [
      {
        score: 5,
        law: '违反法律、法规和标准',
        death: '死亡',
        loss: '100万元以上',
        lockout: '部分装置（>2 套）或设备',
        image: '重大国际影响',
      },
      {
        score: 4,
        law: '潜在违反法规和标准',
        death: '丧失劳动能力',
        loss: '50万元以上',
        lockout: '2套装置停工、或设备停工',
        image: '行业内、省内影响',
      },
      {
        score: 3,
        law: '不符合上级公司或行业的安全方针、制度、规定等',
        death: '截肢、骨折、听力丧失、慢性病',
        loss: '1万元以上',
        lockout: '1 套装置停工或设备',
        image: '地区影响',
      },
      {
        score: 2,
        law: '不符合企业的安全操作程序、规定',
        death: '轻微受伤、间歇不舒服',
        loss: '1万元以下',
        lockout: '受影响不大，几乎不停工',
        image: '公司及周边范围',
      },
      {
        score: 1,
        law: '完全符合',
        death: '无伤亡',
        loss: '无损失',
        lockout: '没有停工',
        image: '形象没有受损',
      },
    ],
  },
  riskLevelList: [
    {
      range: value => value >= 20 && value <= 25,
      level: '1',
      colorName: '红色',
      color: 'red',
      degree: '重大风险',
      controllevel: '公司（厂）级、车间（部室）级、班组、岗位管控',
    },
    {
      range: value => value >= 15 && value <= 16,
      level: '2',
      colorName: '橙色',
      color: 'orange',
      degree: '较大风险',
      controllevel: '公司（厂）级、车间（部室）级、班组、岗位管控',
    },
    {
      range: value => value >= 9 && value <= 12,
      level: '3',
      colorName: '黄色',
      color: '#FFCC33',
      degree: '一般风险',
      controllevel: '车间（部室）级、班组、岗位管控',
    },
    {
      range: value => value >= 1 && value <= 8,
      level: '4',
      colorName: '蓝色',
      color: '#00b0f0',
      degree: '低风险',
      controllevel: '班组、岗位管控',
    },
  ],
};
