import Wave from '@/jingan-components/Wave';
import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';
import styles from './sections/MonitorDrawer.less';

const nbEdu = 'http://data.jingan-china.cn/v2/chem/chemScreen/niubinEdu.png';
const nbEngin = 'http://data.jingan-china.cn/v2/chem/chemScreen/niubinEngin.png';
const wangybEdu = 'http://data.jingan-china.cn/v2/chem/chemScreen/wangybEdu.png';
const wangybEngin = 'http://data.jingan-china.cn/v2/chem/chemScreen/wangybEngin.png';
const zhgEdu = 'http://data.jingan-china.cn/v2/chem/chemScreen/zhgEdu.png';
const zhgEngin = 'http://data.jingan-china.cn/v2/chem/chemScreen/zhgEngin.png';
const zhqEdu = 'http://data.jingan-china.cn/v2/chem/chemScreen/zhqEdu.png';
const zhqEngin = 'http://data.jingan-china.cn/v2/chem/chemScreen/zhqEngin.png';
const zskEdu = 'http://data.jingan-china.cn/v2/chem/chemScreen/zskEdu.png';
const zskEngin = 'http://data.jingan-china.cn/v2/chem/chemScreen/zskEngin.png';
const zblEdu = 'http://data.jingan-china.cn/v2/chem/chemScreen/zblEdu.png';
const zblEngin = 'http://data.jingan-china.cn/v2/chem/chemScreen/zblEngin.png';
const per1 = 'http://data.jingan-china.cn/v2/chem/chemScreen/personSafety.png';
const per2 = 'http://data.jingan-china.cn/v2/chem/chemScreen/perSafeSecond.png';
const per3 = 'http://data.jingan-china.cn/v2/chem/chemScreen/perSafeThird.png';
const per4 = 'http://data.jingan-china.cn/v2/chem/chemScreen/perSafeFourth.png';
const per5 = 'http://data.jingan-china.cn/v2/chem/chemScreen/perSafeFifth.png';
const per6 = 'http://data.jingan-china.cn/v2/chem/chemScreen/perSafeSixth.png';

const storageAreaImg = 'http://data.jingan-china.cn/v2/chem/screen/storage.png';
const storageImg = 'http://data.jingan-china.cn/v2/chem/chemScreen/icon-tank-empty.png';
const reservoirImg = 'http://data.jingan-china.cn/v2/chem/screen/reservoir.png';
const warehouseImg = 'http://data.jingan-china.cn/v2/chem/screen/warehouse.png';
const gasometerImg = 'http://data.jingan-china.cn/v2/chem/screen/gasometer.png';
const productDeviceImg = 'http://data.jingan-china.cn/v2/chem/screen/productDevice.png';
const pipelineImg = 'http://data.jingan-china.cn/v2/chem/screen/pipeline.png';

const renderEllipsis = val => (
  <Ellipsis tooltip length={40} style={{ overflow: 'visible' }}>
    {val}
  </Ellipsis>
);

export const TYPE_DESCES = ['应急避难场所', '应急仓库', '消防站'];
export const VideoList = [
  {
    building_id: 'o_daq93fqgfotow5',
    device_id: 'jingan_zhihui',
    company_id: 'DccBRhlrSiu9gMV7fmvizw',
    key_id: '250ch_11',
    photo_address: '',
    rtsp_address: 'rtsp://admin:12345@192.168.16.249:554/h264/ch6/sub/av_stream',
    isInspection: '1',
    x_fire: '0.513',
    fix_img_id: 'vpawiw6avqvvkebn',
    y_num: '0.360',
    name: '1',
    x_num: '0.349',
    y_fire: '0.554',
    fix_fire_id: 'eua17823vls7wwf3',
    floor_id: 'ernuei68db6pad8c',
    id: 'H_X8GPOHT_2mlG71kblk1w',
    create_date: 1537943399197,
    status: 1,
  },
];
// export const KeyList = ['企业管理员', '企业安全员'];
export const KeyList = [
  {
    key: '1',
    label: '企业管理员',
    value: '2',
  },
  {
    key: '2',
    label: '安全员',
    value: '4',
  },
  {
    key: '3',
    label: '本科',
    value: '1',
  },
  {
    key: '4',
    label: '专科',
    value: '5',
  },
  {
    key: '5',
    label: '注册工程师证',
    value: '6',
  },
];
export const PersonList = [
  {
    id: 1,
    name: '牛斌',
    sex: '男',
    age: '57',
    phone: '15857623543',
    education: '大专',
    work: '应用化工技术',
    sign: '安全管理员',
    personPic: per1,
    eduPic: nbEdu,
    enginPic: nbEngin,
  },
  {
    id: 2,
    name: '王银冰',
    sex: '男',
    age: '32',
    phone: '13925867749',
    education: '本科',
    work: '化工工艺',
    sign: '安全管理员',
    personPic: per2,
    eduPic: wangybEdu,
    enginPic: wangybEngin,
  },
  {
    id: 3,
    name: '张胡根',
    sex: '男',
    age: '58',
    phone: '18083412691',
    education: '大专',
    work: '应用化工技术',
    sign: '安全员',
    personPic: per3,
    eduPic: zhgEdu,
    enginPic: zhgEngin,
  },
  {
    id: 4,
    name: '张会强',
    sex: '男',
    age: '40',
    phone: '13952496637',
    education: '大专',
    work: '应用化工技术',
    sign: '安全员',
    personPic: per4,
    eduPic: zhqEdu,
    enginPic: zhqEngin,
  },
  {
    id: 5,
    name: '张世凯',
    sex: '男',
    age: '50',
    phone: '13677342963',
    education: '大专',
    work: '应用化工技术',
    sign: '安全员',
    personPic: per5,
    eduPic: zskEdu,
    enginPic: zskEngin,
  },
  {
    id: 6,
    name: '赵炳良',
    sex: '男',
    age: '41',
    phone: '18153654961',
    education: '大专',
    work: '应用化工技术',
    sign: '安全员',
    personPic: per6,
    eduPic: zblEdu,
    enginPic: zblEngin,
  },
];
export const ValueList = [
  [
    {
      role_name: '企业管理员',
      user_name: '宋辉俊',
      phone_number: '18762815877',
      id: 'lp4yo91ayifdvrpv',
    },
    {
      role_name: '企业管理员',
      user_name: '张晓东',
      phone_number: '18115380825',
      id: '_4L8zrOSQb2SXPwD1ZtduA',
    },
    {
      role_name: '企业管理员',
      user_name: '马丽',
      phone_number: '12864578945',
      id: 'dix1l47zr_ofgbwi',
    },
    {
      role_name: '企业管理员',
      user_name: '仲红辉',
      phone_number: '18762815546',
      id: 'agesDyCnT02OaJFiwrCtoQ',
    },
  ],
  [
    {
      role_name: '企业安全员',
      user_name: '朱小路',
      phone_number: '18115380836',
      id: 'yul_3u2atb7_zjqy',
    },
    {
      role_name: '企业安全员',
      user_name: '杨雄杰',
      phone_number: '15261540000',
      id: 'AEqtBuu_QceeeLslMIWP_A',
    },
    {
      role_name: '企业安全员',
      user_name: '袁高伟',
      phone_number: '18256256549',
      id: 'I6lpSKS8Tr20xrPbmEtHGQ',
    },
    {
      role_name: '企业安全员',
      user_name: '周伟强',
      phone_number: '17745454520',
      id: 'fa2joz3vs51f9roe',
    },
    {
      role_name: '企业安全员',
      user_name: '石传平',
      phone_number: '13771565523',
      id: 'i84ges5rqjy37vbq',
    },
    {
      role_name: '企业安全员',
      user_name: '倪静',
      phone_number: '13771565522',
      id: 'iq2c7o14vikujpbj',
    },
  ],
];

export const DataList = [
  {
    id: 'bbnhms5_cuo_1_uv',
    ids: null,
    company_id: 'DccBRhlrSiu9gMV7fmvizw',
    company_name: '无锡晶安智慧科技有限公司',
    code: '20190100004',
    name: '磨床',
    location: '',
    status: '2',
    up_to_official: '0',
    source_type: '3',
    source_id: 'rxkswd2eaveloauo',
    report_user_id: 'wpbfcm6f0nqcxqlq',
    report_user_name: '夏媛媛',
    report_time: 1575943006940,
    check_type: null,
    classify: null,
    level: '一般隐患',
    check_type_name: null,
    classify_name: null,
    level_name: '一般隐患',
    desc: '油罐摆放杂乱',
    rectify_dept: '',
    rectify_user_id: 'maz2jm1ebpiehh5y',
    rectify_user_name: '关自霞',
    plan_rectify_time: 1575907200000,
    plan_rectify_money: null,
    rectify_desc: null,
    real_rectify_time: null,
    real_rectify_money: null,
    review_dept: null,
    review_user_id: 'wpbfcm6f0nqcxqlq',
    review_user_name: '夏媛媛',
    real_review_user_name: null,
    real_rectify_user_name: null,
    review_time: null,
    review_remark: null,
    item_id: 'a1imyt4awl1bbefb',
    item_name: '磨床',
    flow_name: '请检查回油罐是否正常运行',
    safety_phone: '13852145201',
    safety_name: '张丽',
    business_type: '1',
    phone_business_type: '1',
    risk_level: '3',
    accompany_person_ids: 'p40e9f5dcgmtveml',
    allCheckPersonNames: '夏媛媛、张鹏宪',
    accompany_persons: '夏媛媛、张鹏宪',
    checkCompanyIds: null,
    report_source: '1',
    report_source_name: '企业自查',
    over_time_days: 0,
    inspectionType: '',
    hiddenType: '',
    hiddenDept: '',
    analysis: null,
    rectifyCompanyName: null,
    reviewCompanyName: null,
    seq_num: 5,
    grid_id: '2xvu_whqS1OQq8cnlw4icA',
    grid_name: '景渎居(村)委',
    query_start_time: null,
    query_end_time: null,
    createImgs: null,
    rectifyImgs: null,
    companyInfoDto: null,
    hiddenDangerRecordDto: [
      {
        id: '6nvwx72watcfusvl',
        danger_id: 'bbnhms5_cuo_1_uv',
        type: '1',
        create_time: 1575943006947,
        create_time_str: null,
        finish_time: null,
        operator_id: 'wpbfcm6f0nqcxqlq',
        operator_name: '夏媛媛',
        operate_content: null,
        money: null,
        remark: null,
        comment: null,
        result: null,
        document_type: null,
        plan_rectify_time: 1575907200000,
        problems: null,
        del_flag: null,
        files: [
          {
            img: [
              'bmp',
              'jpg',
              'jpeg',
              'png',
              'tiff',
              'gif',
              'pcx',
              'tga',
              'exif',
              'fpx',
              'svg',
              'psd',
              'cdr',
              'pcd',
              'dxf',
              'ufo',
              'eps',
              'ai',
              'raw',
              'wmf',
            ],
            doc: ['txt', 'doc', 'docx', 'xls', 'rtf', 'wpd', 'pdf', 'ppt'],
            web: ['htm', 'html', 'jsp'],
            video: ['mp4', 'avi', 'mov', 'wmv', 'asf', 'navi', '3gp', 'mkv', 'f4v', 'rmvb', 'webm'],
            music: [
              'mp3',
              'wma',
              'wav',
              'mod',
              'ra',
              'cd',
              'md',
              'asf',
              'aac',
              'vqf',
              'ape',
              'mid',
              'ogg',
              'm4a',
              'vqf',
            ],
            id: 'vfz1md8vrebtamnt',
            danger_id: null,
            danger_record_id: null,
            path: '@@IPEXP_IMP_FILES_WEB/gsafe/hidden_danger/191210-095646-i0zi.png',
            type: '0',
            web_url: 'http://data.jingan-china.cn/hello/gsafe/hidden_danger/191210-095646-i0zi.png',
          },
        ],
        companyName: '无锡晶安智慧科技有限公司',
        analysis: null,
        deptName: null,
        fileWebUrl: 'http://data.jingan-china.cn/hello/gsafe/hidden_danger/191210-095646-i0zi.png',
        type_name: '创建隐患',
      },
    ],
    companyBuildingItem: {
      item_id: 'a1imyt4awl1bbefb',
      position_id: null,
      object_id: null,
      object_title: '磨床',
      place_type_id: null,
      relation_fire_system: null,
      item_type_code: null,
      check_validity: null,
      unit_code: null,
      remark: null,
      is_keep_check: null,
      order_index: null,
      floor_number: null,
      position_mark: null,
      building_id: null,
      building_name: null,
      next_check_date: null,
      nextCheckDate: null,
      status: 2,
      startTime: null,
      endTime: null,
      item_code: '006',
      area_name: null,
      accident_type_code: null,
      danger_factor: null,
      prevent_measures: null,
      emergency_measures: null,
      local_picture_urls: null,
      warning_sign_urls: null,
      x_mum: '',
      y_mum: '',
      check_cycle: null,
      risk_level: '3',
      risk_level_name: null,
      accident_type_name: null,
      l: null,
      e: null,
      c: null,
      risk_type: null,
      cycle_type: '1',
      checkCycleCode: null,
      checkCycleCodeName: null,
      nowDate: null,
      expire: null,
      waitCheck: null,
      message_send_status: null,
      user_name: null,
      originalStatus: null,
      dangerCount: null,
      fix_fire_id: '',
      x_fire: '',
      y_fire: '',
      last_status: null,
      last_check_date: 1575943006940,
      last_check_user_id: 'wpbfcm6f0nqcxqlq',
      last_check_user_name: null,
      building_type_code: null,
      is_delete: null,
      is_patrol: null,
      record_date: 1575941757530,
      recorder: 'admin',
      change_id: 'e622pb2u022glfwk',
      qrcode_must: null,
      last_check_user_type: null,
      nfc_must: null,
      nfc_code: '041AA142AD5C80    ',
      danger_level: null,
      label_code: null,
      item_type: '2',
      company_id: 'DccBRhlrSiu9gMV7fmvizw',
      company_name: null,
      company_type: null,
      grid_id: '2xvu_whqS1OQq8cnlw4icA',
      grid_name: null,
      location_code: 'jazh10017',
      qr_code: '39733563784034496',
      bind_date: '2019-12-10 01:35:57',
      grid_id_list: null,
      fix_img_id: '',
      lastReportSource: null,
      countCheck: null,
      position_name: '',
    },
    fileContentList: [],
    files: null,
    source_type_name: '风险点上报',
    risk_level_name: '黄',
  },
  {
    id: 'u3amdp6l7cfepebv',
    ids: null,
    company_id: 'DccBRhlrSiu9gMV7fmvizw',
    company_name: '无锡晶安智慧科技有限公司',
    code: '20190100003',
    name: '烘干区',
    location: '',
    status: '2',
    up_to_official: '0',
    source_type: '3',
    source_id: '27cvfb3d791nm6k9',
    report_user_id: 'wpbfcm6f0nqcxqlq',
    report_user_name: '夏媛媛',
    report_time: 1575942876883,
    check_type: null,
    classify: null,
    level: '一般隐患',
    check_type_name: null,
    classify_name: null,
    level_name: '一般隐患',
    desc: '电线杂乱',
    rectify_dept: null,
    rectify_user_id: 'p40e9f5dcgmtveml',
    rectify_user_name: '张鹏宪',
    plan_rectify_time: 1575993600000,
    plan_rectify_money: null,
    rectify_desc: null,
    real_rectify_time: null,
    real_rectify_money: null,
    review_dept: null,
    review_user_id: 'wpbfcm6f0nqcxqlq',
    review_user_name: '夏媛媛',
    real_review_user_name: null,
    real_rectify_user_name: null,
    review_time: null,
    review_remark: null,
    item_id: '3imr_c6bbv9pqv9e',
    item_name: '烘干区',
    flow_name: '请检查各电气设备、接线是否正常防爆',
    safety_phone: '13852145201',
    safety_name: '张丽',
    business_type: '1',
    phone_business_type: '1',
    risk_level: '4',
    accompany_person_ids: null,
    allCheckPersonNames: '夏媛媛',
    accompany_persons: '夏媛媛',
    checkCompanyIds: null,
    report_source: '1',
    report_source_name: '企业自查',
    over_time_days: 0,
    inspectionType: '',
    hiddenType: '',
    hiddenDept: '',
    analysis: null,
    rectifyCompanyName: null,
    reviewCompanyName: null,
    seq_num: 4,
    grid_id: '2xvu_whqS1OQq8cnlw4icA',
    grid_name: '景渎居(村)委',
    query_start_time: null,
    query_end_time: null,
    createImgs: null,
    rectifyImgs: null,
    companyInfoDto: null,
    hiddenDangerRecordDto: [
      {
        id: 'ulack46ng14_yd6b',
        danger_id: 'u3amdp6l7cfepebv',
        type: '1',
        create_time: 1575942876890,
        create_time_str: null,
        finish_time: null,
        operator_id: 'wpbfcm6f0nqcxqlq',
        operator_name: '夏媛媛',
        operate_content: null,
        money: null,
        remark: null,
        comment: null,
        result: null,
        document_type: null,
        plan_rectify_time: 1575993600000,
        problems: null,
        del_flag: null,
        files: [
          {
            img: [
              'bmp',
              'jpg',
              'jpeg',
              'png',
              'tiff',
              'gif',
              'pcx',
              'tga',
              'exif',
              'fpx',
              'svg',
              'psd',
              'cdr',
              'pcd',
              'dxf',
              'ufo',
              'eps',
              'ai',
              'raw',
              'wmf',
            ],
            doc: ['txt', 'doc', 'docx', 'xls', 'rtf', 'wpd', 'pdf', 'ppt'],
            web: ['htm', 'html', 'jsp'],
            video: ['mp4', 'avi', 'mov', 'wmv', 'asf', 'navi', '3gp', 'mkv', 'f4v', 'rmvb', 'webm'],
            music: [
              'mp3',
              'wma',
              'wav',
              'mod',
              'ra',
              'cd',
              'md',
              'asf',
              'aac',
              'vqf',
              'ape',
              'mid',
              'ogg',
              'm4a',
              'vqf',
            ],
            id: 'bhbdft37d8h8l9an',
            danger_id: null,
            danger_record_id: null,
            path: '@@IPEXP_IMP_FILES_WEB/gsafe/hidden_danger/191210-095436-uoqf.png',
            type: '0',
            web_url: 'http://data.jingan-china.cn/hello/gsafe/hidden_danger/191210-095436-uoqf.png',
          },
        ],
        companyName: '无锡晶安智慧科技有限公司',
        analysis: null,
        deptName: null,
        fileWebUrl: 'http://data.jingan-china.cn/hello/gsafe/hidden_danger/191210-095436-uoqf.png',
        type_name: '创建隐患',
      },
    ],
    companyBuildingItem: {
      item_id: '3imr_c6bbv9pqv9e',
      position_id: null,
      object_id: null,
      object_title: '烘干区',
      place_type_id: null,
      relation_fire_system: null,
      item_type_code: null,
      check_validity: null,
      unit_code: null,
      remark: null,
      is_keep_check: null,
      order_index: null,
      floor_number: null,
      position_mark: null,
      building_id: null,
      building_name: null,
      next_check_date: null,
      nextCheckDate: null,
      status: 2,
      startTime: null,
      endTime: null,
      item_code: null,
      area_name: null,
      accident_type_code: null,
      danger_factor: null,
      prevent_measures: null,
      emergency_measures: null,
      local_picture_urls: null,
      warning_sign_urls: null,
      x_mum: '',
      y_mum: '',
      check_cycle: 'every_quarter',
      risk_level: '4',
      risk_level_name: null,
      accident_type_name: null,
      l: '0.5',
      e: '0.5',
      c: '1',
      risk_type: null,
      cycle_type: '2',
      checkCycleCode: null,
      checkCycleCodeName: null,
      nowDate: null,
      expire: null,
      waitCheck: null,
      message_send_status: null,
      user_name: null,
      originalStatus: null,
      dangerCount: null,
      fix_fire_id: '',
      x_fire: '',
      y_fire: '',
      last_status: null,
      last_check_date: 1575942876873,
      last_check_user_id: 'wpbfcm6f0nqcxqlq',
      last_check_user_name: null,
      building_type_code: null,
      is_delete: null,
      is_patrol: null,
      record_date: 1575942173917,
      recorder: 'esfpfi1ktgyof7dz',
      change_id: 'obt9t74nudtle9ie',
      qrcode_must: null,
      last_check_user_type: null,
      nfc_must: null,
      nfc_code: '04D73622B85C80    ',
      danger_level: null,
      label_code: null,
      item_type: '2',
      company_id: 'DccBRhlrSiu9gMV7fmvizw',
      company_name: null,
      company_type: null,
      grid_id: '2xvu_whqS1OQq8cnlw4icA',
      grid_name: null,
      location_code: 'jazh10007',
      qr_code: '39854583364995775',
      bind_date: '2019-12-10 01:42:53',
      grid_id_list: null,
      fix_img_id: '',
      lastReportSource: null,
      countCheck: null,
      position_name: '',
    },
    fileContentList: [],
    files: null,
    source_type_name: '风险点上报',
    risk_level_name: '蓝',
  },
  {
    id: 'ucb4iv1qw2cwbd_t',
    ids: null,
    company_id: 'DccBRhlrSiu9gMV7fmvizw',
    company_name: '无锡晶安智慧科技有限公司',
    code: '20190100001',
    name: '钻床',
    location: '',
    status: '2',
    up_to_official: '0',
    source_type: '3',
    source_id: 'zchbqh_izn4ml67d',
    report_user_id: 'wpbfcm6f0nqcxqlq',
    report_user_name: '夏媛媛',
    report_time: 1575942412977,
    check_type: null,
    classify: null,
    level: '一般隐患',
    check_type_name: null,
    classify_name: null,
    level_name: '一般隐患',
    desc: '安装接线不牢固',
    rectify_dept: '',
    rectify_user_id: 'maz2jm1ebpiehh5y',
    rectify_user_name: '关自霞',
    plan_rectify_time: 1575907200000,
    plan_rectify_money: null,
    rectify_desc: null,
    real_rectify_time: null,
    real_rectify_money: null,
    review_dept: null,
    review_user_id: 'wpbfcm6f0nqcxqlq',
    review_user_name: '夏媛媛',
    real_review_user_name: null,
    real_rectify_user_name: null,
    review_time: null,
    review_remark: null,
    item_id: '18lyh95zwge96n0m',
    item_name: '钻床',
    flow_name: '操作前检查电源连接线是否正确完好。',
    safety_phone: '13852145201',
    safety_name: '张丽',
    business_type: '1',
    phone_business_type: '1',
    risk_level: '2',
    accompany_person_ids: null,
    allCheckPersonNames: '夏媛媛',
    accompany_persons: '夏媛媛',
    checkCompanyIds: null,
    report_source: '1',
    report_source_name: '企业自查',
    over_time_days: 0,
    inspectionType: '',
    hiddenType: '',
    hiddenDept: '',
    analysis: null,
    rectifyCompanyName: null,
    reviewCompanyName: null,
    seq_num: 2,
    grid_id: '2xvu_whqS1OQq8cnlw4icA',
    grid_name: '景渎居(村)委',
    query_start_time: null,
    query_end_time: null,
    createImgs: null,
    rectifyImgs: null,
    companyInfoDto: null,
    hiddenDangerRecordDto: [
      {
        id: '8n6fn6_dz79akk8g',
        danger_id: 'ucb4iv1qw2cwbd_t',
        type: '1',
        create_time: 1575942413010,
        create_time_str: null,
        finish_time: null,
        operator_id: 'wpbfcm6f0nqcxqlq',
        operator_name: '夏媛媛',
        operate_content: null,
        money: null,
        remark: null,
        comment: null,
        result: null,
        document_type: null,
        plan_rectify_time: 1575907200000,
        problems: null,
        del_flag: null,
        files: [
          {
            img: [
              'bmp',
              'jpg',
              'jpeg',
              'png',
              'tiff',
              'gif',
              'pcx',
              'tga',
              'exif',
              'fpx',
              'svg',
              'psd',
              'cdr',
              'pcd',
              'dxf',
              'ufo',
              'eps',
              'ai',
              'raw',
              'wmf',
            ],
            doc: ['txt', 'doc', 'docx', 'xls', 'rtf', 'wpd', 'pdf', 'ppt'],
            web: ['htm', 'html', 'jsp'],
            video: ['mp4', 'avi', 'mov', 'wmv', 'asf', 'navi', '3gp', 'mkv', 'f4v', 'rmvb', 'webm'],
            music: [
              'mp3',
              'wma',
              'wav',
              'mod',
              'ra',
              'cd',
              'md',
              'asf',
              'aac',
              'vqf',
              'ape',
              'mid',
              'ogg',
              'm4a',
              'vqf',
            ],
            id: '3_1cew8yrn3ad74z',
            danger_id: null,
            danger_record_id: null,
            path: '@@IPEXP_IMP_FILES_WEB/gsafe/hidden_danger/191210-094652-oonk.png',
            type: '0',
            web_url: 'http://data.jingan-china.cn/hello/gsafe/hidden_danger/191210-094652-oonk.png',
          },
        ],
        companyName: '无锡晶安智慧科技有限公司',
        analysis: null,
        deptName: null,
        fileWebUrl: 'http://data.jingan-china.cn/hello/gsafe/hidden_danger/191210-094652-oonk.png',
        type_name: '创建隐患',
      },
    ],
    companyBuildingItem: {
      item_id: '18lyh95zwge96n0m',
      position_id: null,
      object_id: null,
      object_title: '钻床',
      place_type_id: null,
      relation_fire_system: null,
      item_type_code: null,
      check_validity: null,
      unit_code: null,
      remark: null,
      is_keep_check: null,
      order_index: null,
      floor_number: null,
      position_mark: null,
      building_id: null,
      building_name: null,
      next_check_date: null,
      nextCheckDate: null,
      status: 2,
      startTime: null,
      endTime: null,
      item_code: '003',
      area_name: null,
      accident_type_code: null,
      danger_factor: null,
      prevent_measures: null,
      emergency_measures: null,
      local_picture_urls: null,
      warning_sign_urls: null,
      x_mum: '',
      y_mum: '',
      check_cycle: null,
      risk_level: '2',
      risk_level_name: null,
      accident_type_name: null,
      l: null,
      e: null,
      c: null,
      risk_type: null,
      cycle_type: '1',
      checkCycleCode: null,
      checkCycleCodeName: null,
      nowDate: null,
      expire: null,
      waitCheck: null,
      message_send_status: null,
      user_name: null,
      originalStatus: null,
      dangerCount: null,
      fix_fire_id: '',
      x_fire: '',
      y_fire: '',
      last_status: null,
      last_check_date: 1575942412953,
      last_check_user_id: 'wpbfcm6f0nqcxqlq',
      last_check_user_name: null,
      building_type_code: null,
      is_delete: null,
      is_patrol: null,
      record_date: 1575941607117,
      recorder: 'admin',
      change_id: 'ffnz_t2sbrxcurh8',
      qrcode_must: null,
      last_check_user_type: null,
      nfc_must: null,
      nfc_code: '047B9142AD5C80    ',
      danger_level: null,
      label_code: null,
      item_type: '2',
      company_id: 'DccBRhlrSiu9gMV7fmvizw',
      company_name: null,
      company_type: null,
      grid_id: '2xvu_whqS1OQq8cnlw4icA',
      grid_name: null,
      location_code: 'jazh10015',
      qr_code: '39680134885553279',
      bind_date: '2019-12-10 01:33:27',
      grid_id_list: null,
      fix_img_id: '',
      lastReportSource: null,
      countCheck: null,
      position_name: '',
    },
    fileContentList: [],
    files: null,
    source_type_name: '风险点上报',
    risk_level_name: '橙',
  },
  {
    id: 'mm_hef9yxhchl99j',
    ids: null,
    company_id: 'DccBRhlrSiu9gMV7fmvizw',
    company_name: '无锡晶安智慧科技有限公司',
    code: '20190100002',
    name: '随手拍',
    location: '',
    status: '3',
    up_to_official: '0',
    source_type: '2',
    source_id: '6j1u4c2uzxz5l6ie',
    report_user_id: 'wpbfcm6f0nqcxqlq',
    report_user_name: '夏媛媛',
    report_time: 1575942538263,
    check_type: null,
    classify: null,
    level: '一般隐患',
    check_type_name: null,
    classify_name: null,
    level_name: '一般隐患',
    desc: '皮带不紧',
    rectify_dept: null,
    rectify_user_id: 'p40e9f5dcgmtveml',
    rectify_user_name: '张鹏宪',
    plan_rectify_time: 1575907200000,
    plan_rectify_money: null,
    rectify_desc: '已整改',
    real_rectify_time: 1575942587267,
    real_rectify_money: 0.0,
    review_dept: null,
    review_user_id: 'wpbfcm6f0nqcxqlq',
    review_user_name: '夏媛媛',
    real_review_user_name: null,
    real_rectify_user_name: '夏媛媛',
    review_time: null,
    review_remark: null,
    item_id: null,
    item_name: '随手拍',
    flow_name: null,
    safety_phone: '13852145201',
    safety_name: '张丽',
    business_type: '1',
    phone_business_type: '1',
    risk_level: null,
    accompany_person_ids: 'maz2jm1ebpiehh5y,p40e9f5dcgmtveml',
    allCheckPersonNames: '夏媛媛、关自霞、张鹏宪',
    accompany_persons: '夏媛媛、关自霞、张鹏宪',
    checkCompanyIds: null,
    report_source: '1',
    report_source_name: '企业自查',
    over_time_days: 0,
    inspectionType: '',
    hiddenType: '',
    hiddenDept: '',
    analysis: '2',
    rectifyCompanyName: null,
    reviewCompanyName: null,
    seq_num: 3,
    grid_id: '2xvu_whqS1OQq8cnlw4icA',
    grid_name: '景渎居(村)委',
    query_start_time: null,
    query_end_time: null,
    createImgs: null,
    rectifyImgs: null,
    companyInfoDto: null,
    hiddenDangerRecordDto: [
      {
        id: 'e8l6dh9qzponmlgf',
        danger_id: 'mm_hef9yxhchl99j',
        type: '1',
        create_time: 1575942538270,
        create_time_str: null,
        finish_time: null,
        operator_id: 'wpbfcm6f0nqcxqlq',
        operator_name: '夏媛媛',
        operate_content: null,
        money: null,
        remark: null,
        comment: null,
        result: null,
        document_type: null,
        plan_rectify_time: 1575907200000,
        problems: null,
        del_flag: null,
        files: [
          {
            img: [
              'bmp',
              'jpg',
              'jpeg',
              'png',
              'tiff',
              'gif',
              'pcx',
              'tga',
              'exif',
              'fpx',
              'svg',
              'psd',
              'cdr',
              'pcd',
              'dxf',
              'ufo',
              'eps',
              'ai',
              'raw',
              'wmf',
            ],
            doc: ['txt', 'doc', 'docx', 'xls', 'rtf', 'wpd', 'pdf', 'ppt'],
            web: ['htm', 'html', 'jsp'],
            video: ['mp4', 'avi', 'mov', 'wmv', 'asf', 'navi', '3gp', 'mkv', 'f4v', 'rmvb', 'webm'],
            music: [
              'mp3',
              'wma',
              'wav',
              'mod',
              'ra',
              'cd',
              'md',
              'asf',
              'aac',
              'vqf',
              'ape',
              'mid',
              'ogg',
              'm4a',
              'vqf',
            ],
            id: 'ngbupm6_u3_3rfr3',
            danger_id: null,
            danger_record_id: null,
            path: '@@IPEXP_IMP_FILES_WEB/gsafe/hidden_danger/191210-094858-rhqo.png',
            type: '0',
            web_url: 'http://data.jingan-china.cn/hello/gsafe/hidden_danger/191210-094858-rhqo.png',
          },
        ],
        companyName: '无锡晶安智慧科技有限公司',
        analysis: null,
        deptName: null,
        fileWebUrl: 'http://data.jingan-china.cn/hello/gsafe/hidden_danger/191210-094858-rhqo.png',
        type_name: '创建隐患',
      },
      {
        id: 'vpcskc8hqgi9eud7',
        danger_id: 'mm_hef9yxhchl99j',
        type: '2',
        create_time: 1575942587270,
        create_time_str: null,
        finish_time: null,
        operator_id: 'wpbfcm6f0nqcxqlq',
        operator_name: '夏媛媛',
        operate_content: '已整改',
        money: 0.0,
        remark: '',
        comment: null,
        result: null,
        document_type: null,
        plan_rectify_time: 1575907200000,
        problems: null,
        del_flag: null,
        files: [
          {
            img: [
              'bmp',
              'jpg',
              'jpeg',
              'png',
              'tiff',
              'gif',
              'pcx',
              'tga',
              'exif',
              'fpx',
              'svg',
              'psd',
              'cdr',
              'pcd',
              'dxf',
              'ufo',
              'eps',
              'ai',
              'raw',
              'wmf',
            ],
            doc: ['txt', 'doc', 'docx', 'xls', 'rtf', 'wpd', 'pdf', 'ppt'],
            web: ['htm', 'html', 'jsp'],
            video: ['mp4', 'avi', 'mov', 'wmv', 'asf', 'navi', '3gp', 'mkv', 'f4v', 'rmvb', 'webm'],
            music: [
              'mp3',
              'wma',
              'wav',
              'mod',
              'ra',
              'cd',
              'md',
              'asf',
              'aac',
              'vqf',
              'ape',
              'mid',
              'ogg',
              'm4a',
              'vqf',
            ],
            id: '7i8msf31vke9naf5',
            danger_id: null,
            danger_record_id: null,
            path: '@@IPEXP_IMP_FILES_WEB/gsafe/hidden_danger/191210-094947-rdu3.png',
            type: '0',
            web_url: 'http://data.jingan-china.cn/hello/gsafe/hidden_danger/191210-094947-rdu3.png',
          },
        ],
        companyName: '无锡晶安智慧科技有限公司',
        analysis: '2',
        deptName: null,
        fileWebUrl: 'http://data.jingan-china.cn/hello/gsafe/hidden_danger/191210-094947-rdu3.png',
        type_name: '已整改',
      },
    ],
    companyBuildingItem: null,
    fileContentList: [],
    files: null,
    source_type_name: '随手拍',
    risk_level_name: null,
  },
];

export const MonitorList = [
  // 罐区
  [
    {
      title: '溶剂罐区',
      status: 1,
      location: '仓库-7号仓库',
      isDanger: 1,
      store: '甲醛、乙炔、一氧化碳',
      monitors: [
        {
          gaugeData: { value: 52, title: '可燃气体浓度', unit: 'mg/m³' },
        },
        {
          gaugeData: { value: 65, title: '有毒气体浓度', unit: 'mg/m³' },
          extra: 5,
        },
      ],
    },
  ],
  // 库区
  [
    {
      title: '甲类库区',
      status: 1,
      location: '甲类库区监测点A',
      isDanger: 1,
      store: '甲醛、乙炔、一氧化碳',
      monitors: [
        {
          gaugeData: { value: 52, title: '可燃气体浓度', unit: 'mg/m³' },
        },
        {
          gaugeData: { value: 65, title: '有毒气体浓度', unit: 'mg/m³' },
          extra: 5,
        },
      ],
    },
  ],
  // 储罐
  [
    {
      title: '甲烷气体储罐',
      status: 1,
      number: '64501B',
      isDanger: 1,
      store: '甲醛、乙炔、一氧化碳',
      location: '储罐监测点A',
      monitors: [
        {
          gaugeData: { value: 52, title: '压力', unit: 'Mpa' },
        },
        {
          gaugeData: { value: 68, title: '温度', unit: '℃' },
          extra: 8,
        },
      ],
    },
    {
      title: '甲醇储罐',
      status: 1,
      number: '3621C',
      isDanger: 1,
      store: '甲醛、乙炔、一氧化碳',
      location: '储罐监测点B',
      monitors: [
        {
          gaugeData: { value: 52, title: '压力', unit: 'Mpa' },
        },
        {
          gaugeData: { value: 65, title: '温度', unit: '℃' },
          extra: 5,
        },
      ],
    },
    {
      title: '溶剂储罐',
      status: 2,
      number: '4305A',
      isDanger: 0,
      store: '甲醛、乙炔、一氧化碳',
      location: '储罐监测点C',
      monitors: [
        {
          gaugeData: { value: 52, title: '压力', unit: 'Mpa' },
        },
        {
          gaugeData: { value: 42, title: '温度', unit: '℃' },
        },
      ],
    },
  ],
  // 生产装置
  [
    {
      title: '催化装置',
      status: 1,
      location: '监测点B',
      isDanger: 1,
      store: '甲醛、乙炔、一氧化碳',
      monitors: [
        {
          gaugeData: { value: 52, title: '压力', unit: 'Mpa' },
        },
        {
          gaugeData: { value: 65, title: '温度', unit: '℃' },
          extra: 5,
        },
      ],
    },
    {
      title: '甲醇生产装置',
      status: 2,
      location: '监测点A',
      isDanger: 0,
      store: '甲醛、乙炔、一氧化碳',
      monitors: [
        {
          gaugeData: { value: 52, title: '压力', unit: 'Mpa' },
        },
        {
          gaugeData: { value: 35, title: '温度', unit: '℃' },
        },
      ],
    },
    {
      title: '过滤装置',
      status: 2,
      location: '监测点C',
      isDanger: 0,
      store: '甲醛、乙炔、一氧化碳',
      monitors: [
        {
          gaugeData: { value: 52, title: '压力', unit: 'Mpa' },
        },
        {
          gaugeData: { value: 41, title: '温度', unit: '℃' },
        },
      ],
    },
  ],
  // 库房
  [
    {
      title: '原料库房',
      status: 1,
      location: '库房监测点A',
      isDanger: 1,
      store: '甲醛、乙炔、一氧化碳',
      monitors: [
        {
          gaugeData: { value: 70, title: '温度', unit: '℃' },
          extra: 10,
        },
        {
          gaugeData: { value: 52, title: '湿度', unit: '%' },
        },
      ],
    },
    {
      title: '产品库房',
      status: 2,
      location: '库房监测点B',
      isDanger: 0,
      store: '甲醛、乙炔、一氧化碳',
      monitors: [
        {
          gaugeData: { value: 27, title: '温度', unit: '℃' },
        },
        {
          gaugeData: { value: 52, title: '湿度', unit: '%' },
        },
      ],
    },
  ],
  // 气柜
  [
    {
      title: '甲烷气柜',
      status: 1,
      location: '气柜监测点A',
      isDanger: 1,
      store: '甲醛、乙炔、一氧化碳',
      monitors: [
        {
          gaugeData: { value: 52, title: '可燃气体浓度', unit: 'mg/m³' },
        },
        {
          gaugeData: { value: 81, title: '有毒气体浓度', unit: 'mg/m³' },
          extra: 21,
        },
      ],
    },
    {
      title: '乙烯气柜',
      status: 2,
      location: '气柜监测点B',
      isDanger: 0,
      store: '甲醛、乙炔、一氧化碳',
      monitors: [
        {
          gaugeData: { value: 52, title: '可燃气体浓度', unit: 'mg/m³' },
        },
        {
          gaugeData: { value: 47, title: '有毒气体浓度', unit: 'mg/m³' },
        },
      ],
    },
  ],
  // 可燃有毒气体
  [
    {
      title: '可燃气体监测',
      status: 1,
      location: '7号罐附近',
      isDanger: 1,
      monitors: [
        {
          gaugeData: { value: 24, title: '可燃气体浓度', unit: 'mg/m³' },
          extra: 15,
        },
        {
          gaugeData: { value: 65, title: '有毒气体浓度', unit: 'mg/m³' },
          extra: 12,
        },
      ],
    },
  ],
  // 可燃有毒气体
  [
    {
      title: '有毒气体监测',
      status: 1,
      location: '6号罐附近',
      isDanger: 1,
      monitors: [
        {
          gaugeData: { value: 6.2, title: '可燃气体浓度', unit: 'mg/m³' },
          extra: 6,
        },
        {
          gaugeData: { value: 65, title: '有毒气体浓度', unit: 'mg/m³' },
          extra: 12,
        },
      ],
    },
  ],
];

export const MonitorFields = [
  // 罐区
  [
    { label: '区域位置', value: 'location' },
    {
      label: '是否构成重大危险源',
      value: 'isDanger',
      render: val => {
        return val === 0 ? '否' : '是';
      },
    },
  ],
  // 库区
  [
    { label: '区域位置', value: 'location' },
    {
      label: '是否构成重大危险源',
      value: 'isDanger',
      render: val => {
        return val === 0 ? '否' : '是';
      },
    },
  ],
  // 储罐
  [
    { label: '位号', value: 'number' },
    {
      label: '是否构成重大危险源',
      value: 'isDanger',
      render: val => {
        return val === 0 ? '否' : '是';
      },
    },
  ],
  // 生产装置
  [
    { label: '区域位置', value: 'location' },
    {
      label: '是否构成重大危险源',
      value: 'isDanger',
      render: val => {
        return val === 0 ? '否' : '是';
      },
    },
  ],
  // 库房
  [
    { label: '区域位置', value: 'location' },
    {
      label: '是否构成重大危险源',
      value: 'isDanger',
      render: val => {
        return val === 0 ? '否' : '是';
      },
    },
  ],
  // 气柜
  [
    { label: '区域位置', value: 'location' },
    {
      label: '是否构成重大危险源',
      value: 'isDanger',
      render: val => {
        return val === 0 ? '否' : '是';
      },
    },
  ],
  // 可燃有毒气体
  [{ label: '监测区域名称', value: 'location' }],
  // 可燃有毒气体
  [{ label: '监测区域名称', value: 'location' }],
];

export const MonitorTitles = [
  '罐区',
  '库区',
  '储罐',
  '生产装置',
  '库房',
  '气柜',
  '可燃气体',
  '有毒气体',
];

export const MonitorDetailFields = [
  // 罐区
  [
    { label: '罐区名称', value: 'title' },
    { label: '存储物质', value: 'store' },
    { label: '区域位置', value: 'location' },
    {
      label: '是否构成重大危险源',
      value: 'isDanger',
      render: val => {
        return val === 0 ? '否' : '是';
      },
    },
  ],
  // 库区
  [
    { label: '库区名称', value: 'title' },
    { label: '存储物质', value: 'store' },
    { label: '区域位置', value: 'location' },
    {
      label: '是否构成重大危险源',
      value: 'isDanger',
      render: val => {
        return val === 0 ? '否' : '是';
      },
    },
  ],
  // 储罐
  [
    { label: '储罐名称', value: 'title' },
    { label: '位号', value: 'number' },
    { label: '存储物质', value: 'store' },
    {
      label: '是否构成重大危险源',
      value: 'isDanger',
      render: val => {
        return val === 0 ? '否' : '是';
      },
    },
  ],
  // 生产装置
  [
    { label: '生产装置名称', value: 'title' },
    { label: '存储物质', value: 'store' },
    { label: '区域位置', value: 'location' },
    {
      label: '是否构成重大危险源',
      value: 'isDanger',
      render: val => {
        return val === 0 ? '否' : '是';
      },
    },
  ],
  // 库房
  [
    { label: '库房名称', value: 'title' },
    { label: '区域位置', value: 'location' },
    {
      label: '是否构成重大危险源',
      value: 'isDanger',
      render: val => {
        return val === 0 ? '否' : '是';
      },
    },
  ],
  // 气柜
  [
    { label: '气柜名称', value: 'title' },
    { label: '区域位置', value: 'location' },
    {
      label: '是否构成重大危险源',
      value: 'isDanger',
      render: val => {
        return val === 0 ? '否' : '是';
      },
    },
  ],
  // 可燃气体
  [{ label: '监测区域名称', value: 'location' }],
  // 有毒气体
  [{ label: '监测区域名称', value: 'location' }],
];

export const MsgShowTypes = [
  1, // 发生监管
  2, // 联动
  3, // 反馈
  4, // 屏蔽
  7, // 主机报警
  9, // 主机报障
  11, // 一键报修
  13, // 安全巡查
  14, // 上报隐患
  15, // 整改隐患
  16, // 重新整改隐患
  17, // 复查隐患
  18, // 维保巡检
  32, // 电气火灾报警
  36, // 水系统报警
  37, // 水系统恢复
  38, // 独立烟感报警
  39, // 可燃气体报警
  40, // 独立烟感故障
  42, // 电气火灾失联
  43, // 电气火灾失联恢复
  44, // 电气火灾报警恢复
  45, // 燃气报警恢复
  46, // 独立烟感失联
  47, // 独立烟感失联恢复
  48, // 水系统失联
  49, // 水系统失联恢复
  50, // 独立烟感报警恢复
  51, // 独立烟感故障恢复
  54, // 可燃气体失联
  55, // 可燃气体失联恢复
  56, // 机械臂故障
  57, // 机械臂故障恢复
  58, // 人脸识别报警
  100, // 监测设备
];

export const TypeClickList = [100, 14, 15, 16, 17];

export const MonitorConfig = {
  '301': {
    // 储罐区
    title: '罐区监测',
    icon: (
      <div
        className={styles.iconWrapper}
        style={{ background: `url(${storageAreaImg}) center center / 100% auto no-repeat` }}
      />
    ),
    fields: [
      {
        value: 'areaName',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      { label: '在厂区的位置', value: 'location' },
      {
        label: '所处环境功能区',
        value: 'environmentArea',
        render: val => {
          const envirTypeList = [
            { key: '1', value: '一类区' },
            { key: '2', value: '二类区' },
            { key: '3', value: '三类区' },
          ];
          return <span>{envirTypeList[val - 1] ? envirTypeList[val - 1].value : ''}</span>;
        },
      },
      { label: '储罐区面积（㎡）', value: 'spaceArea' },
      {
        label: '有无围堰',
        value: 'hasCoffer',
        render: val => (+val === 0 ? '无' : '有'),
      },
      { label: '罐区总容积（m³）', value: 'areaVolume' },
      { label: '常规储量（t）', value: 'commonStore' },
    ],
  },
  '302': {
    // 储罐
    title: '储罐监测',
    icon: ({ tankName }) => (
      <div
        className={styles.iconWrapper}
        style={{
          background: `url(${storageImg}) center center / 100% auto no-repeat`,
        }}
      >
        <Wave
          frontStyle={{ height: '30%', color: 'rgba(178, 237, 255, 0.8)' }}
          backStyle={{ height: '30%', color: 'rgba(178, 237, 255, 0.3)' }}
        />
        <div className={styles.tankName}>{tankName}</div>
      </div>
    ),
    fields: [
      {
        value: 'tankName',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      { label: '位号', value: 'number' },
      { label: '存储物质', value: 'chineName' },
      {
        label: '区域位置',
        value: 'buildingName',
        render: (val, row) => {
          const { buildingName, floorName, areaName } = row;
          return (
            <span style={{ fontSize: 16 }}>
              {buildingName ? buildingName + (floorName || '') : areaName || '暂无'}
            </span>
          );
        },
      },
    ],
  },
  '303': {
    // 库区
    title: '库区监测',
    icon: (
      <div
        className={styles.iconWrapper}
        style={{ background: `url(${reservoirImg}) center center / 100% auto no-repeat` }}
      />
    ),
    fields: [
      {
        value: 'name',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      { label: '区域位置', value: 'position' },
      {
        label: '所处环境功能区',
        value: 'environment',
        render: val => {
          const envirTypeList = [
            { key: '1', value: '一类区' },
            { key: '2', value: '二类区' },
            { key: '3', value: '三类区' },
          ];
          return <span>{envirTypeList[val - 1] ? envirTypeList[val - 1].value : ''}</span>;
        },
      },
      { label: '库区面积（㎡）', value: 'area' },
    ],
  },
  '304': {
    // 库房
    title: '库房监测',
    icon: (
      <div
        className={styles.iconWrapper}
        style={{ background: `url(${warehouseImg}) center center / 100% auto no-repeat` }}
      />
    ),
    fields: [
      {
        value: 'name',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      { label: '区域位置', value: 'position' },
      { label: '所属库区', value: 'aname' },
      { label: '库房面积（㎡）', value: 'area' },
    ],
  },
  '311': {
    // 生产装置
    title: '生产装置监测',
    icon: (
      <div
        className={styles.iconWrapper}
        style={{ background: `url(${productDeviceImg}) center center / 100% auto no-repeat` }}
      />
    ),
    fields: [
      {
        value: 'name',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      { label: '区域位置', value: 'location' },
      { label: '是否关键装置', value: 'keyDevice', render: val => (+val === 1 ? '是' : '否') },
      { label: '设计压力（KPa）', value: 'pressure' },
    ],
  },
  '312': {
    // 气柜
    title: '气柜监测',
    icon: (
      <div
        className={styles.iconWrapper}
        style={{ background: `url(${gasometerImg}) center center / 100% auto no-repeat` }}
      />
    ),
    fields: [
      {
        value: 'gasholderName',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      { label: '区域位置', value: 'regionalLocation' },
      { label: '设计柜容（m³）', value: 'designCapacity' },
      { label: '设计压力（KPa）', value: 'designKpa' },
    ],
  },
  '314': {
    // 工业管道
    title: '工业管道监测',
    icon: (
      <div
        className={styles.iconWrapper}
        style={{ background: `url(${pipelineImg}) center center / 100% auto no-repeat` }}
      />
    ),
    fields: [
      {
        value: 'name',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      {
        label: '是否危化品管道',
        value: 'dangerPipeline',
        render: val => (+val === 1 ? '是' : '否'),
      },
      { label: '是否压力管道', value: 'pressure', render: val => (+val === 1 ? '是' : '否') },
      { label: '设计压力（KPa）', value: 'designPressure' },
    ],
  },
};

export const DangerFactorsColumns = [
  {
    title: '序号',
    key: 'index',
    dataIndex: 'index',
    align: 'center',
    width: 60,
  },
  {
    title: '风险点名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    width: 160,
  },
  {
    title: '所在位置',
    dataIndex: 'space',
    key: 'space',
    align: 'center',
    width: 160,
  },
  {
    title: '存在的主要危险（有害）因素',
    dataIndex: 'dangerFactor',
    key: 'dangerFactor',
    align: 'center',
    width: 300,
    render: renderEllipsis,
  },
  {
    title: '易发生的事故类型',
    dataIndex: 'consequence',
    key: 'consequence',
    align: 'center',
    width: 340,
    render: renderEllipsis,
  },
  {
    title: '排查人员',
    dataIndex: 'checkPerson',
    key: 'checkPerson',
    align: 'center',
    width: 340,
  },
  {
    title: '负责人',
    dataIndex: 'principal',
    key: 'principal ',
    align: 'center',
    width: 340,
    render: renderEllipsis,
  },
  {
    title: '时间',
    dataIndex: 'checkDate',
    key: 'checkDate',
    align: 'center',
    width: 340,
    render: val => <span>{val === null ? '' : moment(+val).format('YYYY年MM月DD日')}</span>,
  },
];
export const SafetyRiskColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 60,
  },
  {
    title: '风险点',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    width: 160,
  },
  {
    title: '所在位置',
    dataIndex: 'space',
    key: 'space',
    align: 'center',
    width: 160,
  },
  {
    title: '存在的主要危险（有害）因素',
    dataIndex: 'dangerFactor',
    key: 'dangerFactor',
    align: 'center',
    width: 340,
    render: renderEllipsis,
  },
  {
    title: '可能导致事故类别',
    dataIndex: 'consequence',
    key: 'consequence',
    align: 'center',
    width: 340,
    render: renderEllipsis,
  },
  {
    title: 'L',
    dataIndex: 'l',
    key: 'l',
    align: 'center',
  },
  {
    title: 'E',
    dataIndex: 'e',
    key: 'e',
    align: 'center',
  },
  {
    title: 'C',
    dataIndex: 'c',
    key: 'c',
    align: 'center',
  },
  {
    title: 'D',
    dataIndex: 'd',
    key: 'd',
    align: 'center',
  },
  {
    title: '风险等级/风险色度',
    dataIndex: 'dangerLevel',
    key: 'dangerLevel',
    align: 'center',
    width: 100,
  },
  {
    title: '辨识分级时间',
    dataIndex: 'checkDate',
    key: 'checkDate',
    align: 'center',
    width: 150,
    render: val => <span>{val === null ? '' : moment(+val).format('YYYY年MM月DD日')}</span>,
  },
  {
    title: '采取的主要管控措施',
    dataIndex: 'dangerMeasure',
    key: 'dangerMeasure',
    align: 'center',
    width: 340,
    render: renderEllipsis,
  },
  {
    title: '责任部门',
    dataIndex: 'department',
    key: 'department',
    align: 'center',
    width: 160,
  },
  {
    title: '责任人',
    dataIndex: 'principal',
    key: 'principal ',
    align: 'center',
    width: 160,
    render: renderEllipsis,
  },
];
export const AcceptCardFields = [
  {
    label: '承诺卡名称',
    value: 'name',
  },
  {
    label: '承诺卡内容',
    value: 'content',
  },
  {
    label: '承诺人',
    value: 'acceptor',
  },
  {
    label: '时间',
    value: 'time',
    render: val => (val ? moment(val).format('YYYY-MM-DD') : ''),
  },
];
export const EmergencyCardFields = [
  {
    label: '应急卡名称',
    value: 'name',
  },
  {
    label: '作业/设备名称',
    value: 'equipmentName',
  },
  {
    label: '风险提示',
    value: 'riskWarning',
  },
  {
    label: '应急处置方法',
    value: 'emergency',
  },
  {
    label: '注意事项',
    value: 'needAttention',
  },
];
