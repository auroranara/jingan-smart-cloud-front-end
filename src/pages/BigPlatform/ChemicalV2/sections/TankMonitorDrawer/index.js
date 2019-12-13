import React, { Component } from 'react';
import { message } from 'antd';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import classNames from 'classnames';
import moment from 'moment';
import { connect } from 'dva';
import styles from './index.less';

const API = 'xxx/getTankMonitor';
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const VIDEO_LIST = [
  {
      "device_id":"111",
      "company_id":"DccBRhlrSiu9gMV7fmvizw",
      "inherit_nvr":0,
      "key_id":"111",
      "rtsp_address":"111",
      "isInspection":"0",
      "photo":"deviceId[111]keyId[111]非法，不能为空/有空格/中文",
      "nvr":"ndll4s4uy537rv1m",
      "x_fire":"0.751",
      "fix_img_id":"vpawiw6avqvvkebn",
      "plug_flow_equipment":"",
      "company_name":"无锡晶安智慧科技有限公司",
      "name":"111111",
      "y_fire":"0.816",
      "fix_fire_id":"eua17823vls7wwf3",
      "connect_type":1,
      "id":"xcb82x3lww8ls7ed",
      "create_date":1564536937853,
      "status":1,
  },
  {
      "device_id":"12313",
      "company_id":"DccBRhlrSiu9gMV7fmvizw",
      "key_id":"21312",
      "company_name":"无锡晶安智慧科技有限公司",
      "name":"312",
      "isInspection":"0",
      "photo":"deviceId[12313]keyId[21312]非法，不能为空/有空格/中文",
      "fix_fire_id":"eua17823vls7wwf3",
      "id":"a8s9gh29dks2l8hc",
      "create_date":1562035589380,
      "status":1,
      "fix_img_id":"vpawiw6avqvvkebn",
  },
  {
      "building_id":"bgax388wd7eucs77",
      "building_name":"乙磷铝厂房",
      "device_id":"12er_11",
      "company_id":"DccBRhlrSiu9gMV7fmvizw",
      "key_id":"12er_11",
      "rtsp_address":"32423",
      "isInspection":"1",
      "photo":"推流设备没有登记到系统中[12er_11]",
      "x_fire":"0.273",
      "y_num":"0.720",
      "company_name":"无锡晶安智慧科技有限公司",
      "name":"1213",
      "x_num":"0.748",
      "y_fire":"0.929",
      "fix_fire_id":"eua17823vls7wwf3",
      "id":"0Vgal9GcR5W63fiYnCJo2w",
      "create_date":1539054319470,
      "status":1,
  },
  {
      "device_id":"1qw_123",
      "company_id":"DccBRhlrSiu9gMV7fmvizw",
      "key_id":"1qw_123",
      "rtsp_address":"234532",
      "isInspection":"1",
      "photo":"推流设备没有登记到系统中[1qw_123]",
      "fix_img_id":"vpawiw6avqvvkebn",
      "y_num":"0.936",
      "company_name":"无锡晶安智慧科技有限公司",
      "name":"12",
      "x_num":"0.302",
      "id":"LfnLcUceTiyIlXgQiTbowQ",
      "create_date":1539054572897,
      "status":1,
  },
  {
      "building_id":"o_daq93fqgfotow5",
      "building_name":"储罐区1号楼",
      "device_id":"1qw_123",
      "company_id":"DccBRhlrSiu9gMV7fmvizw",
      "key_id":"1qw_123",
      "rtsp_address":"42342",
      "isInspection":"1",
      "fix_img_id":"esiMnDiBSQKY2Hfmy8FWww",
      "floor_name":"2层",
      "y_num":"0.836",
      "company_name":"无锡晶安智慧科技有限公司",
      "name":"12314",
      "x_num":"0.406",
      "floor_id":"lhcxau5mhfs3pzr2",
      "id":"Is_Z_1oAS9io3E2Q4CiNtQ",
      "create_date":1539054529910,
      "status":1,
  },
  {
      "device_id":"23_111d",
      "company_id":"DccBRhlrSiu9gMV7fmvizw",
      "key_id":"23_111d",
      "photo_address":"2423",
      "rtsp_address":"23423",
      "isInspection":"0",
      "x_fire":"0.453",
      "fix_img_id":"vpawiw6avqvvkebn",
      "y_num":"0.406",
      "company_name":"无锡晶安智慧科技有限公司",
      "name":"32234",
      "x_num":"0.744",
      "y_fire":"0.573",
      "fix_fire_id":"cnk6sx9btntapeaz",
      "id":"urcgz32s7_e6zirn",
      "create_date":1547447668817,
      "status":1,
  },
  {
      "device_id":"433_111s",
      "company_id":"DccBRhlrSiu9gMV7fmvizw",
      "key_id":"433_111s",
      "photo_address":"23423",
      "rtsp_address":"23423",
      "isInspection":"0",
      "fix_img_id":"luq7ph_iueoxqlz9",
      "y_num":"0.613",
      "company_name":"无锡晶安智慧科技有限公司",
      "name":"2342",
      "x_num":"0.855",
      "id":"ys4b8_4x8urzshby",
      "create_date":1547195925687,
      "status":1,
  },
  {
      "building_id":"bgax388wd7eucs77",
      "building_name":"乙磷铝厂房",
      "device_id":"5678",
      "company_id":"DccBRhlrSiu9gMV7fmvizw",
      "inherit_nvr":1,
      "key_id":"56789",
      "photo_address":"http:www.baidu1.com",
      "rtsp_address":"http:www.baidu.com",
      "isInspection":"0",
      "nvr":"",
      "floor_name":"1",
      "plug_flow_equipment":"807wa51nvd_reb1m",
      "company_name":"无锡晶安智慧科技有限公司",
      "name":"测试视频A",
      "floor_id":"wx96c_1gup_hwch7",
      "connect_type":1,
      "id":"aur14x1dw_sylo_v",
      "status":1,
  },
  {
      "device_id":"678",
      "company_id":"DccBRhlrSiu9gMV7fmvizw",
      "inherit_nvr":0,
      "key_id":"6786",
      "photo_address":"6867",
      "rtsp_address":"86786",
      "isInspection":"0",
      "nvr":"ndll4s4uy537rv1m",
      "x_fire":"0.651",
      "fix_img_id":"vpawiw6avqvvkebn",
      "y_num":"0.666",
      "plug_flow_equipment":"",
      "company_name":"无锡晶安智慧科技有限公司",
      "name":"8678678",
      "x_num":"0.828",
      "y_fire":"0.729",
      "fix_fire_id":"eua17823vls7wwf3",
      "connect_type":1,
      "id":"w79jr791rf85_63v",
      "create_date":1564537077240,
      "status":1,
  },
  {
      "device_id":"7897",
      "company_id":"DccBRhlrSiu9gMV7fmvizw",
      "key_id":"7897",
      "photo_address":"78978",
      "rtsp_address":"78976",
      "isInspection":"0",
      "fix_img_id":"vpawiw6avqvvkebn",
      "company_name":"无锡晶安智慧科技有限公司",
      "name":"9789",
      "fix_fire_id":"eua17823vls7wwf3",
      "id":"i0hexh30xspo1wxp",
      "create_date":1564536742577,
      "status":1,
  },
  {
      "device_id":"ee45_44",
      "company_id":"DccBRhlrSiu9gMV7fmvizw",
      "key_id":"ee45_44",
      "photo_address":"ee45_44",
      "rtsp_address":"ee45_44",
      "isInspection":"0",
      "fix_img_id":"lcZk9TXhTJSZBndHzd2LDQ",
      "y_num":"0.531",
      "company_name":"无锡晶安智慧科技有限公司",
      "name":"ee45_44",
      "x_num":"0.406",
      "id":"pvn32h7xc73m4mva",
      "create_date":1540448813403,
      "status":1,
  },
  {
      "building_id":"o_daq93fqgfotow5",
      "building_name":"储罐区1号楼",
      "device_id":"jingan_zhihui",
      "company_id":"DccBRhlrSiu9gMV7fmvizw",
      "key_id":"240ch233_f1",
      "photo_address":"",
      "rtsp_address":"rtsp://admin:12345@192.168.16.249:554/h264/ch6/sub/av_stream",
      "isInspection":"1",
      "x_fire":"0.513",
      "fix_img_id":"vpawiw6avqvvkebn",
      "floor_name":"1层",
      "y_num":"0.360",
      "company_name":"无锡晶安智慧科技有限公司",
      "name":"1",
      "x_num":"0.349",
      "y_fire":"0.554",
      "fix_fire_id":"eua17823vls7wwf3",
      "floor_id":"ernuei68db6pad8c",
      "id":"H_X8GPOHT_2mlG71kblk1w",
      "create_date":1537943399197,
      "status":1,
  },
  {
      "device_id":"jingan_zhihui",
      "company_id":"DccBRhlrSiu9gMV7fmvizw",
      "key_id":"faceCamera",
      "rtsp_address":"rtsp://admin:jingan123@192.168.10.98:554/Streaming/Channels/101?transportmode=unicast",
      "company_name":"无锡晶安智慧科技有限公司",
      "name":"人脸相机",
      "x_num":"",
      "isInspection":"0",
      "id":"963tum37gy3pgl4q",
      "create_date":1567490921020,
      "status":1,
  },
];

// 请把xxx替换成对应model
@connect(
  ({ xxx, loading }) => ({
    xxx,
    loading: loading.effects[API],
  }),
  (dispatch, { id }) => ({
    getTankMonitor(payload, callback) {
      if (id) {
        dispatch({
          type: API,
          payload: {
            id,
            ...payload,
          },
          callback: (success, data) => {
            if (!success) {
              message.error('获取储罐监测数据失败，请稍后重试或联系管理人员！');
            }
            callback && callback(success, data);
          },
        });
      }
    },
  })
)
export default class TankMonitorDrawer extends Component {
  state = {
    videoVisible: false,
    videoKeyId: undefined,
  };

  componentDidMount() {
    this.props.getTankMonitor();
  }

  componentDidUpdate({ id: prevId }) {
    const { id } = this.props;
    if (prevId !== id) {
      this.props.getTankMonitor();
      this.scroll && this.scroll.scrollTop();
    }
  }

  setScrollReference = scroll => {
    this.scroll = (scroll && scroll.dom) || scroll;
  };

  showVideo = () => {
    const { xxx: { videoList=VIDEO_LIST } = {} } = this.props;
    this.setState({
      videoVisible: true,
      videoKeyId: videoList[0].key_id,
    });
  };

  hideVideo = () => {
    this.setState({
      videoVisible: false,
    });
  };

  handleWorkOrderIconClick = () => {
    const { xxx: { id = 1 } = {} } = this.props;
    window.open(`${window.publicPath}#/company-iot/alarm-work-order/detail/${id}`);
  };

  handleMonitorTrendIconClick = () => {
    const { xxx: { id = 1 } = {} } = this.props;
    window.open(`${window.publicPath}#/company-iot/alarm-work-order/monitor-trend/${id}`);
  };

  render() {
    const {
      className,
      style,
      visible,
      onClose,
      loading = false,
      xxx: {
        name = '1号罐',
        upateTime = +new Date(),
        designPressure = 0.1,
        designStore = 16,
        realTimeStore = 5,
        realTimeStoreStatus=0,
        temperature = 30,
        temperatureStatus = 0,
        liquidLevel = 23,
        liquidLevelStatus = 0,
        pressure = 0.15,
        pressureStatus = 1,
        videoList=VIDEO_LIST,
      } = {},
    } = this.props;
    const { videoVisible, videoKeyId } = this.state;
    console.log(videoList);

    return (
      <CustomDrawer
        className={classNames(styles.container, className)}
        style={style}
        // width="30em"
        title="储罐监测"
        visible={visible}
        onClose={onClose}
        sectionProps={{
          scrollProps: { ref: this.setScrollReference },
          spinProps: { loading },
        }}
        zIndex={1566}
        width={535}
      >
        <div className={styles.top}>
          <div className={styles.line}>
            <div className={styles.label}>储罐名称：</div>
            <div className={styles.value}>
              1号罐
              {videoList &&
                videoList.length > 0 && <span className={styles.video} onClick={this.showVideo} />}
              <div className={styles.jumperWrapper}>
                <span onClick={this.handleWorkOrderIconClick} />
                <span onClick={this.handleMonitorTrendIconClick} />
              </div>
            </div>
          </div>
          <div className={styles.line}>
            <div className={styles.label}>
              <span className={styles.number}>位号</span>：
            </div>
            <div className={styles.value}>0001</div>
          </div>
          <div className={styles.line}>
            <div className={styles.label}>存储物质：</div>
            <div className={styles.value}>无水乙醇</div>
          </div>
          <div className={styles.line}>
            <div className={styles.label}>区域位置：</div>
            <div className={styles.value}>东厂区1号楼危险品液体原料储罐区</div>
          </div>
        </div>
        <div className={styles.middle}>
          <div className={styles.icon}>{name}</div>
          <div className={styles.infoWrapper}>
            <div className={styles.line}>
              <div className={styles.label}>更新时间：</div>
              <div className={styles.value}>
                {upateTime && moment(upateTime).format(DEFAULT_FORMAT)}
              </div>
            </div>
            <div className={styles.line}>
              <div className={styles.label}>设计压力（MPa）：</div>
              <div className={styles.value}>{designPressure}</div>
            </div>
            <div className={styles.line}>
              <div className={styles.label}>设计储量（t）：</div>
              <div className={styles.value}>{designStore}</div>
            </div>
            <div className={styles.lineWrapper}>
              <div className={styles.line}>
                <div className={styles.label}>实时储量（t）：</div>
                <div className={styles.value}>{realTimeStore}</div>
              </div>
              <div className={styles.line}>
                <div className={styles.label}>状态：</div>
                <div
                  className={styles.value}
                  style={{ color: realTimeStoreStatus > 0 ? '#ff4848' : '#0ff' }}
                >
                  {realTimeStoreStatus > 0 ? '报警' : '正常'}
                </div>
              </div>
            </div>
            <div className={styles.lineWrapper}>
              <div className={styles.line}>
                <div className={styles.label}>温度（℃）：</div>
                <div className={styles.value}>{temperature}</div>
              </div>
              <div className={styles.line}>
                <div className={styles.label}>状态：</div>
                <div
                  className={styles.value}
                  style={{ color: temperatureStatus > 0 ? '#ff4848' : '#0ff' }}
                >
                  {temperatureStatus > 0 ? '报警' : '正常'}
                </div>
              </div>
            </div>
            <div className={styles.lineWrapper}>
              <div className={styles.line}>
                <div className={styles.label}>液位（cm）：</div>
                <div className={styles.value}>{liquidLevel}</div>
              </div>
              <div className={styles.line}>
                <div className={styles.label}>状态：</div>
                <div
                  className={styles.value}
                  style={{ color: liquidLevelStatus > 0 ? '#ff4848' : '#0ff' }}
                >
                  {liquidLevelStatus > 0 ? '报警' : '正常'}
                </div>
              </div>
            </div>
            <div className={styles.lineWrapper}>
              <div className={styles.line}>
                <div className={styles.label}>压力（MPa）：</div>
                <div className={styles.value}>{pressure}</div>
              </div>
              <div className={styles.line}>
                <div className={styles.label}>状态：</div>
                <div
                  className={styles.value}
                  style={{ color: pressureStatus > 0 ? '#ff4848' : '#0ff' }}
                >
                  {pressureStatus > 0 ? '报警' : '正常'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.bottomTitle}>
            <div className={styles.bottomTitleIcon} />
            <div className={styles.bottomTitleLabel}>应急处置措施</div>
          </div>
          <div className={styles.bottomContent}>
            迅速撤离泄漏污染区人员至安全区，并进行隔离，严格限制出入。切断火源。建议应急处理人员戴自给正压式呼吸器，穿防静电工作服。尽可能切断泄漏源。防止流入下水道、排洪沟等限制性空间。小量泄漏：用砂土或者是其它具有阻燃性能的材料进行吸附或吸收。也可以用大量水冲洗，利用水将泄露的无水乙醇进行稀释，然后将稀释后的污水排进废水系统。大量泄漏：构筑围堤或者挖坑收容。用泡沫覆盖，降低蒸汽造成的灾害。用防爆泵将其转移到槽车或者是专用的收集器内，回收或运至废物处理场所进行处置。
          </div>
        </div>
        <NewVideoPlay
          style={{ zIndex: 9999 }}
          videoList={videoList}
          visible={videoVisible}
          showList={true}
          keyId={videoKeyId}
          handleVideoClose={this.hideVideo}
        />
      </CustomDrawer>
    );
  }
}
