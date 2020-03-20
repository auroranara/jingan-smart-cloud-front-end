import React, { Fragment, PureComponent } from 'react';
import { Button, Card, Empty, Form, Input, Select, Slider, message } from 'antd';
import router from 'umi/router';

import styles from './FireControl.less';

const { Item: FormItem } = Form;
const { Option } = Select;

const FIELDS = [
  { key: 'appName', label: '地图名称' },
  { key: 'mapId', label: '地图ID' },
  { key: 'key', label: 'key值' },
  { key: 'theme', label: '主题' },
];

const fengMap = fengmap; // eslint-disable-line
const LABEL_COL = { xs: { span: 24 }, sm: { span: 4 } };
const WRAPPER_COL = { xs: { span: 24 }, sm: { span: 16 } };
const INIT_THEME = '2001';
const INIT_MODE = fengMap.FMViewMode.MODE_3D;
const INIT_SCALE = 19;
// const INIT_RANGE = [16, 23];
const [MIN, MAX] = [16, 23];
const INIT_TILT_ANGLE = 50;
const INIT_ROTATE_ANGLE = 60;
const MIN_ANGLE = -180;
const MAX_ANGLE = 180;
const MODES = [
  { name: '2D', value: fengMap.FMViewMode.MODE_2D },
  { name: '3D', value: fengMap.FMViewMode.MODE_3D },
];

function getDefaultViewCenter(center) {
  if (!center)
    return;

  const c = center.split(',').map(s => Number.parseFloat(s.trim()));
  if (c.length === 2 && c.every(n => !Number.isNaN(n)))
    return { x: c[0], y: c[1] };
}

@Form.create()
export default class ThreeDMap extends PureComponent {
  state = {
    mapVisible: false,
    // scaleRange: INIT_RANGE,
    // scale: INIT_SCALE,
  };

  componentDidMount() {
    this.getMapList(list => {
      const { form: { setFieldsValue } } = this.props;
      if (list.length){
        const vals = list[0];
        const { theme, defaultViewMode, defaultMapScaleLevel, mapScaleLevelRangeList } = vals;
        const [tiltAngle, rotateAngle] = mapScaleLevelRangeList || [];
        const fieldsValue = {
          ...vals,
          theme: theme || INIT_THEME,
          defaultViewMode: defaultViewMode || INIT_MODE,
          defaultMapScaleLevel: defaultMapScaleLevel || INIT_SCALE,
          tiltAngle: typeof tiltAngle === 'number' ? tiltAngle : INIT_TILT_ANGLE,
          rotateAngle: typeof rotateAngle === 'number' ? rotateAngle : INIT_ROTATE_ANGLE,
          // mapScaleLevelRangeList: mapScaleLevelRangeList || INIT_RANGE,
        };
        setFieldsValue(fieldsValue);
        // this.initMap(fieldsValue); // 初始化有问题，手动点击
      }
    });
  }

  map = null;

  handleSubmit = e => {
    const {
      form: { validateFields },
    } = this.props;
    e.preventDefault();
    validateFields((err, fieldsValue) => {
      if (err) return;
      this.getMapList(list => {
        const isPost = !list.length;
        const detail = list[0] || {};
        const { tiltAngle, rotateAngle } = fieldsValue;
        const vals = { ...fieldsValue };
        vals.mapScaleLevelRangeList = [tiltAngle, rotateAngle];
        this.editMap(isPost, vals, detail.id);
      });
    });
  };

  getMapList = callback => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'company/fetchMapList',
      payload: { pageSize: 0, pageNum: 1, companyId },
      callback,
    });
  };

  editMap = (isPost, fieldsValue, id) => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: `company/${isPost ? 'add' : 'edit'}Map`,
      payload: { ...fieldsValue, id, companyId },
      callback: (code, msg) => {
        if (code === 200) {
          message.success(msg);
          router.push('/base-info/company/list');
        } else
          message.error(msg);
      },
    });
  };

  // handleRangeChange = value => {
  //   this.setState({ scaleRange: value });
  // };

  renderBaseItems() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return FIELDS.map(({ key, label }) => (
      <FormItem
        key={key}
        label={label}
        labelCol={LABEL_COL}
        wrapperCol={WRAPPER_COL}
      >
        {getFieldDecorator(key, {
          rules: [{ required: true, message: `请输入${label}` }],
        })(
          <Input placeholder={`请输入${label}`} />
        )}
      </FormItem>
    ));
  }

  renderMoreItems() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    // const { scaleRange } = this.state;
    // const [min, max] = scaleRange;

    return (
      <Fragment>
        <p className={styles.tip}>默认中心位置请在地图上单击获取位置</p>
        <FormItem label="默认中心位置" labelCol={LABEL_COL} wrapperCol={WRAPPER_COL}>
          {getFieldDecorator('defaultViewCenter', {
          })(
            <Input disabled placeholder="默认中心位置请在地图上单击获取位置" />
          )}
        </FormItem>
        <FormItem label="默认视图模式" labelCol={LABEL_COL} wrapperCol={WRAPPER_COL}>
          {getFieldDecorator('defaultViewMode', {
            initialValue: INIT_MODE,
          })(
            <Select placeholder="请选择默认视图模式">
              {MODES.map(({ name, value }) => <Option key={value} value={value}>{name}</Option>)}
            </Select>
          )}
        </FormItem>
        <FormItem label="倾斜角度" labelCol={LABEL_COL} wrapperCol={WRAPPER_COL}>
          {getFieldDecorator('tiltAngle', {
            initialValue: INIT_TILT_ANGLE,
            rules: [{ required: true, message: "请选择倾斜角度" }],
          })(<Slider min={MIN_ANGLE} max={MAX_ANGLE} marks={{ [MIN_ANGLE]: MIN_ANGLE, [MAX_ANGLE]: MAX_ANGLE }} />)}
        </FormItem>
        <FormItem label="旋转角度" labelCol={LABEL_COL} wrapperCol={WRAPPER_COL}>
          {getFieldDecorator('rotateAngle', {
            initialValue: INIT_ROTATE_ANGLE,
            rules: [{ required: true, message: "请选择旋转角度" }],
          })(<Slider min={MIN_ANGLE} max={MAX_ANGLE} marks={{ [MIN_ANGLE]: MIN_ANGLE, [MAX_ANGLE]: MAX_ANGLE }} />)}
        </FormItem>
        {/* <FormItem label="缩放等级范围" labelCol={LABEL_COL} wrapperCol={WRAPPER_COL}>
          {getFieldDecorator('mapScaleLevelRangeList', {
            initialValue: INIT_RANGE,
          })(
            <Slider range min={16} max={23} onChange={this.handleRangeChange} marks={{ 16: 16, 23: 23 }} />
          )}
        </FormItem> */}
        <FormItem label="默认缩放等级" labelCol={LABEL_COL} wrapperCol={WRAPPER_COL}>
          {getFieldDecorator('defaultMapScaleLevel', {
            initialValue: INIT_SCALE,
          })(
            <Slider min={MIN} max={MAX} marks={{ [MIN]: MIN, [MAX]: MAX }} />
          )}
        </FormItem>
      </Fragment>
    );
  }

  initMap = ({ appName, key, mapId, theme, defaultMapScaleLevel, defaultViewMode, defaultViewCenter, tiltAngle, rotateAngle }) => {
    this.map && this.map.dispose();
    const { form: { setFieldsValue } } = this.props;

    if (!appName || !key || !mapId) {
      this.setState({ mapVisible: false })
      return;
    }

    const center = getDefaultViewCenter(defaultViewCenter);
    // const { scaleRange } = this.state;
    this.setState({ mapVisible: true });
    // const [minScaleLevel, maxScaleLevel] = scaleRange;
    const mapOptions = {
      container: document.getElementById('bird-map'), // 必要，地图容器
      appName,
      key,
      mapServerURL: './data/' + mapId, // 地图数据位置
      defaultViewCenter: center,
      defaultViewMode,
      defaultMapScaleLevel,
      // mapScaleLevelRange: scaleRange,
      defaultThemeName: theme, // 设置主题
      modelSelectedEffect: false,
    };

    //初始化地图对象
    const map = this.map = new fengMap.FMMap(mapOptions);
    //打开Fengmap服务器的地图数据和主题
    map.openMapById(mapId);
    map.on('loadComplete', e => {
      const map = this.map;
      // console.log('onload', defaultMapScaleLevel);

      map.tiltAngle = tiltAngle;
      map.rotateAngle = rotateAngle;
      map.mapScaleLevel = defaultMapScaleLevel;
      // isFirst && this.handlePreview();
    })
    // map.on('mapScaleLevelChanged', e => { // 有问题，不要用
    //   setFieldsValue({ defaultMapScaleLevel: e.mapScale });
    // });
    map.on('mapClickNode', e => {
      const { mapCoord } = e;
      if (!mapCoord)
        return;
      const { x, y } = mapCoord;
      if (!x && !y)
        return;
      setFieldsValue({ defaultViewCenter: `${x}, ${y}` });
    });
    // map.gestureEnableController.enableMapPan = false;
  }

  handlePreview = e => {
    const { form: { getFieldsValue } } = this.props;
    this.initMap(getFieldsValue());
  };

  render() {
    const { mapVisible } = this.state;

    return (
      <Card className={styles.threedCard}>
        <Form
          onSubmit={this.handleSubmit}
        >
          {this.renderBaseItems()}
          {this.renderMoreItems()}
          <FormItem wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 13, offset: 10 } }}>
            <Button type="primary" onClick={this.handlePreview} style={{ marginRight: 20 }}>预览地图</Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </FormItem>
        </Form>
        <div style={{ height: 600, display: mapVisible ? 'block' : 'none' }} id="bird-map" />
        {!mapVisible && <Empty />}
      </Card>
    );
  }
}
