export const NAMESPACE = 'workingBill';

export const LIST_API = `${NAMESPACE}/getList`;

export const MAP_API = `${NAMESPACE}/getMap`;

export const DETAIL_API = `${NAMESPACE}/getDetail`;

export const ADD_API = `${NAMESPACE}/add`;

export const EDIT_API = `${NAMESPACE}/edit`;

export const DELETE_API = `${NAMESPACE}/remove`;

export const APPROVE_API = `${NAMESPACE}/approve`;

export const REAPPLY_API = `${NAMESPACE}/reapply`;

export const SAVE_API = `${NAMESPACE}/save`;

export const DETAIL_CODE = `operationSafety.${NAMESPACE}.detail`;

export const ADD_CODE = `operationSafety.${NAMESPACE}.add`;

export const EDIT_CODE = `operationSafety.${NAMESPACE}.edit`;

export const DELETE_CODE = `operationSafety.${NAMESPACE}.delete`;

export const APPROVE_CODE = `operationSafety.${NAMESPACE}.approve`;

export const BREADCRUMB_LIST_PREFIX = [
  { title: '首页', name: '首页', href: '/' },
  { title: '作业安全管理', name: '作业安全管理' },
];

export const DISPLAYS = [{ key: '1', value: '列表' }, { key: '2', value: '地图' }];

export const TYPES = [
  { key: '1', value: '动火作业' },
  { key: '2', value: '受限空间作业' },
  { key: '4', value: '高处作业' },
  { key: '5', value: '吊装作业' },
  { key: '6', value: '临时用电' },
  { key: '9', value: '设备检修' },
  { key: '3', value: '盲板抽堵' },
  { key: '8', value: '断路作业' },
  { key: '7', value: '动土作业' },
];

export const TYPE_MAP_SAFETY_MEASURES = {
  1: [
    ['动火设备内部构件清理干净，蒸汽吹扫或水洗合格，达到用火条件'],
    ['断开与动火设备相连接的所有管线，加盲板 ? 块', 'blindPlateNum'],
    ['动火点周围的下水井、地漏、地沟、电缆沟等手段进行隔离'],
    ['罐区内动火点同一围堰和防火间距内的油罐不同时进行脱水作业'],
    ['高处作业已采取防火花飞溅措施'],
    ['动火点周围易燃物已清除'],
    ['电焊回路线已接在焊件上，把线未穿过下水井或其他设备搭接'],
    ['乙炔气瓶（直立放置）、氧气瓶与火源间的距离大于10m'],
    [
      '现场配备消防蒸汽带 ? 根，灭火器 ? 台，铁锹 ? 把，石棉布 ? 块',
      'fireSteamBeltNum',
      'extinguisherNum',
      'shovelNum',
      'asbestosClothNum',
    ],
  ],
  2: [
    ['对进入受限空间危险性进行分析'],
    ['所有与受限空间有联系的阀门、管线加盲板隔离，列出盲板清单，落实抽堵盲板责任人'],
    ['设备经过置换、吹扫、蒸煮'],
    [
      '设备打开通风孔进行自然通风，温度适宜人员作业；必要时采用强制通风或佩戴空气呼吸器，不能用通氧气或富氧空气的方法补充氧',
    ],
    ['相关设备进行处理，带搅拌机的设备已切断电源，电源开关处加锁或挂“禁止合闸”标志牌，设专人监护'],
    ['检查受限空间内部已具备作业条件，清罐时（无需用/已采用）防爆工具'],
    ['检查受限空间进出口通道，无阻碍人员进出的障碍物'],
    ['分析盛装过可燃有毒液体、气体的受限空间内的可燃、有毒有害气体含量'],
    ['作业人员清楚受限空间内存在的其他危险因素，如内部附件、集渣坑等'],
    [
      '作业监护措施：消防器材 ?、救生绳 ?、气防装备 ?',
      'fireEquipmentNum',
      'lifeLineNum',
      'gasControlEquipmentNum',
    ],
  ],
  4: [
    ['作业人员身体条件符合要求'],
    ['作业人员着装符合工作要求'],
    ['作业人员佩戴合格的安全帽'],
    ['作业人员佩戴安全带、安全带高挂低用'],
    ['作业人员携带有工具袋及安全绳'],
    ['作业人员佩戴：A.过滤式防毒面具或口罩，B.空气呼吸器'],
    ['现场搭设的脚手架、防护网、围栏符合安全规定'],
    ['垂直分层作业中间有隔离设施'],
    ['梯子、绳子符合安全规定'],
    ['石棉瓦等轻型棚的承重梁、柱能承重负荷的要求'],
    ['作业人员在石棉瓦等不承重物作业所搭设的承重板稳定牢固'],
    ['采光、夜间作业照明符合作业要求，（需采用并已采用/无需采用）防爆灯'],
    ['30m以上高处作业配备通讯、联络工具'],
  ],
  5: [
    [
      '吊装质量大于等于40t的重物和土建工程主体结构；吊装物体虽不足40t，但形状复杂、刚度小、长径比大、精密贵重，作业条件特殊，已编制吊装作业方案，且经设备管理科和安全科审查，报公司安全总监批准',
    ],
    ['指派专人监护，并监守岗位，非作业人员禁止入内'],
    ['作业人员已按规定佩戴防护器具和个体防护用品'],
    ['已与分厂（车间）负责人取得联系，建立联系信号'],
    ['已在吊装现场设置安全警戒标志，无关人员不许进入作业现场'],
    ['夜间作业采用足够的照明'],
    ['室外作业遇到（大雪/暴雨/大雾/六级以上大风），已停止作业'],
    ['检查起重吊装设备、钢丝绳、缆风绳、链条、吊钩等各种机具，保证安全可靠'],
    ['明确分工、坚守岗位，并按规定的联络信号，统一指挥'],
    ['将建筑物、构筑物作为锚点，需经工程处审查核算并批准'],
    ['吊装绳索、缆风绳、拖拉绳等避免同带电线路接触，并保持安全距离'],
    ['人员随同吊装重物或吊装机械升降，应采取可靠的安全措施，并经过现场指挥人员批准'],
    ['利用管道、管架、电杆、机电设备等作吊装锚点，不准吊装'],
    ['悬吊重物下方站人、通行和工作，不准吊装'],
    ['超负荷或重物质量不明，不准吊装'],
    ['斜拉重物、重物埋在地下或重物坚固不牢，绳打结、绳不齐，不准吊装'],
    ['棱角重物没有衬垫措施，不准吊装'],
    ['安全装置失灵，不准吊装'],
    ['用定型起重吊装机械（履带吊车/轮胎吊车/矫式吊车等）进行吊装作业，遵守该定型机械的操作规程'],
    ['作业过程中应先用低高度、短行程试吊'],
    ['作业现场出现危险品泄漏，立即停止作业，撤离人员'],
    ['作业完成后现场杂物已清理'],
    ['吊装作业人员持有法定的有效的证件'],
    [
      '地下通讯电（光）缆、局域网络电（光）缆、排水沟的盖板，承重吊装机械的负重量已确认，保护措施已落实',
    ],
    ['起吊物的质量 ? t，经确认，在吊装机械的承重范围', 'quality'],
    ['在吊装高度的管线、电缆桥架已做好防护措施'],
    ['作业现场围栏、警戒线、警告牌、夜间警示灯已按要求设置'],
    ['作业高度和转臂范围内，无架空线路'],
    ['人员出入口和撤离安全措施已落实：A.指示牌；B.指示灯'],
    ['在爆炸危险生产区域内作业，机动车排气管已装火星熄灭器'],
    ['现场夜间有充足照明：36V、24V、12V防水型灯；36V、24V、12V防爆型灯'],
    ['作业人员已佩戴防护器具'],
  ],
  6: [
    ['安装临时线路人员持有电工作业操作证'],
    ['在防爆场所使用的临时电源、元器件和线路达到相应的防爆等级要求'],
    ['临时用电的单项和混用线路采用五线制'],
    ['临时用电线路在装置内不低于2.5m，道路不低于5m'],
    ['临时用电线路架空进线未采用裸线，未在树或脚手架上架设'],
    ['暗管埋设及地下电缆线路设有“走向标志”和“安全标志”，电缆埋深大于0.7m'],
    ['现场临时用配电盘、箱有防雨措施'],
    ['临时用电设施有漏电保护器，移动工具、手持工具“一机一闸一保护”'],
    ['用电设备、线路容量、负荷符合要求'],
  ],
  9: [
    ['安装临时线路人员持有电工作业操作证'],
    ['在防爆场所使用的临时电源、元器件和线路达到相应的防爆等级要求'],
    ['临时用电的单项和混用线路采用五线制'],
    ['临时用电线路在装置内不低于2.5m，道路不低于5m'],
    ['临时用电线路架空进线未采用裸线，未在树或脚手架上架设'],
    ['暗管埋设及地下电缆线路设有“走向标志”和“安全标志”，电缆埋深大于0.7m'],
    ['现场临时用配电盘、箱有防雨措施'],
    ['临时用电设施有漏电保护器，移动工具、手持工具“一机一闸一保护”'],
    ['用电设备、线路容量、负荷符合要求'],
  ],
  3: [
    ['在有毒介质的管道、设备上作业时，尽可能降低系统压力，作业点应为常压'],
    ['在有毒介质的管道、设备上作业时，作业人员穿戴适合的防护用具'],
    ['易燃易爆场所，作业人员穿防静电工作服、工作鞋；作业时使用防爆灯具和防爆工具'],
    ['易燃易爆场所，距作业地点30m内无其他动火作业'],
    ['在强腐蚀性介质的管道、设备上作业时，作业人员已采取防止酸碱灼伤的措施'],
    ['介质温度较高、可能造成烫伤的情况下，作业人员已采取防烫措施'],
    ['同一管道上不同时进行两处以上的盲板抽堵作业'],
  ],
  8: [
    ['作业前，制定交通组织方案（附后），并已通知相关部门或单位'],
    [
      '作业前，在断路的路口和相关道路上设置交通警示标志，在作业区附近设置路栏、道路作业警示灯、导向标等交通警示设施',
    ],
    ['夜间作业设置警示灯'],
  ],
  7: [
    ['作业人员作业前已进行了安全教育'],
    ['作业地点处于易燃易爆场所，需要动火时已办理了动火证'],
    ['地下电力电缆已确认保护措施已落实'],
    ['地下通讯电（光）缆，局域网络电（光）缆已确认保护措施已落实'],
    ['地下供排水、消防管线、工艺管线已确认保护措施已落实'],
    ['已按作业方案图规划线和立桩'],
    [
      '动土地点有电线、管道等地下设施，已向作业单位交待并派人监护；作业时轻挖，未使用铁棒、铁镐或抓斗等机械工具',
    ],
    ['作业现场围栏、警戒线、警告牌夜间警示灯已按要求设置'],
    ['已进行放坡处理和固壁支撑'],
    ['人员出入口和撤离安全措施已落实：A.梯子；B.修坡道'],
    ['道路施工作业已报：交通、消防、安全监督部门、应急中心'],
    ['备有可燃气体检测仪、有毒介质检测仪'],
    ['现场夜间有充足照明：A.36V、24V、12V防水型灯；B.36V、24V、12V防爆型灯'],
    ['作业人员已佩戴防护器具'],
    ['动土范围内无障碍物，并已在总图上做标记'],
  ],
};

export const GUTTER = {
  xl: 8,
  md: 12,
  sm: 24,
  xs: 24,
};

export const SECOND_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const MINUTE_FORMAT = 'YYYY-MM-DD HH:mm';

export const DAY_FORMAT = 'YYYY-MM-DD';

export const WORKING_STATUSES = [
  { key: '1', value: '待作业' },
  { key: '2', value: '作业中' },
  { key: '3', value: '完成' },
];

export const WORKING_STATUS_MAPPER = {
  1: 'processing',
  2: 'warning',
  3: 'success',
};

export const APPROVE_STATUSES = [
  { key: '1', value: '待审批' },
  { key: '2', value: '通过' },
  { key: '3', value: '不通过' },
];

export const APPROVE_STATUS_MAPPER = {
  1: 'processing',
  2: 'success',
  3: 'error',
};

export const PLAN_TYPES = [{ key: '1', value: '计划性' }, { key: '0', value: '非计划性' }];

export const IMPLEMENT_STATUSES = [{ key: '0', value: '未实施' }, { key: '1', value: '已实施' }];

export const APPROVAL_OPINIONS = [{ key: '2', value: '通过' }, { key: '3', value: '不通过' }];

export const HOT_WORK_TYPES = [
  { key: '1', value: '特级危险动火' },
  { key: '2', value: '一级动火' },
  { key: '3', value: '二级动火' },
];

export const HIGH_WORK_TYPES = [
  { key: '4', value: '特殊高处作业证' },
  { key: '7', value: '三级高处作业证' },
  { key: '6', value: '二级高处作业证' },
  { key: '5', value: '一级高处作业证' },
];

export const HOISTING_WORK_TYPES = [
  { key: '8', value: '一级吊装作业' },
  { key: '9', value: '二级吊装作业' },
  { key: '10', value: '三级吊装作业' },
];

export const BLIND_PLATE_WORK_TYPES = [
  { key: '11', value: '装盲板' },
  { key: '12', value: '拆盲板' },
];

export const UNIT_TYPES = [{ key: '1', value: '本单位' }, { key: '2', value: '外来单位' }];

export const COMPANY_LIST_MAPPER = {
  namespace: 'common',
  list: 'unitList',
  getList: 'getUnitList',
};

export const COMPANY_LIST_FIELDNAMES = {
  key: 'id',
  value: 'name',
};

export const DEPARTMENT_LIST_MAPPER = {
  namespace: 'common',
  list: 'departmentList',
  getList: 'getDepartmentList',
};

export const DEPARTMENT_LIST_FIELDNAMES = {
  key: 'id',
  value: 'name',
};

export const PERSON_MAPPER = {
  namespace: 'common',
  list: 'staffList',
  getList: 'getStaffList',
};

export const PERSON_FILEDNAMES = {
  key: 'id',
  value: 'userName',
};
