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
];

const fengMap = fengmap; // eslint-disable-line
const LABEL_COL = { xs: { span: 24 }, sm: { span: 4 } };
const WRAPPER_COL = { xs: { span: 24 }, sm: { span: 16 } };
const INIT_MODE = fengMap.FMViewMode.MODE_3D;
const INIT_SCALE = 19;
const INIT_RANGE = [16, 23];
const MODES = [
  { name: '2D', value: fengMap.FMViewMode.MODE_2D },
  { name: '3D', value: fengMap.FMViewMode.MODE_3D },
];

@Form.create()
export default class ThreeDMap extends PureComponent {
  state = {
    mapVisible: false,
    scaleRange: INIT_RANGE,
    scale: INIT_SCALE,
  };

  componentDidMount() {
    this.getMapList(list => {
      const { form: { setFieldsValue } } = this.props;
      if (list.length){
        const vals = list[0];
        const { defaultViewMode, defaultMapScaleLevel, mapScaleLevelRangeList } = vals;
        const fieldsValue = {
          ...vals,
          defaultViewMode: defaultViewMode || INIT_MODE,
          defaultMapScaleLevel: defaultMapScaleLevel || INIT_SCALE,
          mapScaleLevelRangeList: mapScaleLevelRangeList || INIT_RANGE,
        };
        setFieldsValue(fieldsValue);
        this.initMap(fieldsValue);
      }
    });
  }

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
        this.editMap(isPost, fieldsValue, detail.id);
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

  genHandleRangeChange = prop => value => {
    this.setState({ [prop]: value });
  };

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
    const { scaleRange } = this.state;
    const [min, max] = scaleRange;

    return (
      <Fragment>
        <FormItem label="默认中心位置" labelCol={LABEL_COL} wrapperCol={WRAPPER_COL}>
          {getFieldDecorator('defaultViewCenter', {
          })(
            <Input placeholder="请输入默认中心位置并以英文逗号分割" />
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
        <FormItem label="缩放等级范围" labelCol={LABEL_COL} wrapperCol={WRAPPER_COL}>
          {getFieldDecorator('mapScaleLevelRangeList', {
            initialValue: INIT_RANGE,
          })(
            <Slider range min={16} max={23} onChange={this.handleRangeChange} marks={{ 16: 16, 23: 23 }} />
          )}
        </FormItem>
        <FormItem label="默认缩放等级" labelCol={LABEL_COL} wrapperCol={WRAPPER_COL}>
          {getFieldDecorator('defaultMapScaleLevel', {
            initialValue: INIT_SCALE,
          })(
            <Slider min={min} max={max} onChange={this.handleScaleChange} marks={{ [min]: min, [max]: max }} />
          )}
        </FormItem>
      </Fragment>
    );
  }

  initMap = ({ appName, key, mapId, defaultViewMode }) => {
    const { form: { setFieldsValue } } = this.props;

    if (!appName || !key || !mapId) {
      this.setState({ mapVisible: false })
      return;
    }

    const { scaleRange, scale } = this.state;
    this.setState({ mapVisible: true });
    const [minScale, maxScale] = scaleRange;
    const mapOptions = {
      container: document.getElementById('bird-map'), // 必要，地图容器
      appName,
      key,
      mapServerURL: './data/' + mapId, // 地图数据位置
      viewMode: defaultViewMode,
      mapScale: scale,
      minScale,
      maxScale,
      defaultThemeName: '2001', // 设置主题
      modelSelectedEffect: false,
    };

    //初始化地图对象
    const map = new fengMap.FMMap(mapOptions);
    //打开Fengmap服务器的地图数据和主题
    map.openMapById(mapId);
    map.on('mapScaleLevelChanged', e => setFieldsValue({ defaultMapScaleLevel: e.mapScale }))
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
        <div style={{ height: 400, display: mapVisible ? 'block' : 'none' }} id="bird-map" />
        {!mapVisible && <Empty />}
      </Card>
    );
  }
}
