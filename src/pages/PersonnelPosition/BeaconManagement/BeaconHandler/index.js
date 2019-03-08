import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Input,
  Button,
  Form,
  Select,
  Spin,
} from 'antd';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { mapMutations } from '@/utils/utils';
import ImageSelect from './ImageSelect';
import BeaconCoordinate from './BeaconCoordinate';
// 引入样式文件
import styles from './index.less';

@connect(({ beacon, loading }) => ({
  beacon,
  loading: loading.models.beacon,
}))
@Form.create()
export default class BeaconHandler extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 是否正在提交
      submitting: false,
      // 当前选中的图片
      image: undefined,
    };
    mapMutations(this, {
      namespace: 'beacon',
      types: [
        'init',
        'addBeacon',
        'editBeacon',
      ],
    });
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    this.init(params, (payload) => {
      if (payload) {
        const { detail: { mapId }={}, imagesMap={} } = payload;
        this.handleSelectImage(imagesMap[mapId], mapId !== undefined);
      }
    });
  }

  // 返回上一页
  goBack = () => {
    const { match: { params: { companyId } } } = this.props;
    router.push(`/personnel-position/beacon-management/company/${companyId}`);
  }

  /**
   * 提交事件
   */
  handleSubmit = () => {
    const { form: { validateFieldsAndScroll } } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ submitting: true });
        const { match: { params: { companyId, id } } } = this.props;
        const { coordinate: { xarea, yarea, zarea }, ...restProps } = values;
        const payload = {
          companyId,
          id,
          xarea,
          yarea,
          zarea,
          ...restProps,
        };
        const callback = (success) => {
          if (success) {
            this.goBack();
          }
          else {
            this.setState({ submitting: false });
          }
        };
        // 编辑
        if (id) {
          this.editBeacon(payload, callback);
        }
        // 新增
        else {
          this.addBeacon(payload, callback);
        }
      }
    });
  }

  /**
   * 图片选择确认的钩子函数
   * @param {object} image 当前选中的图片
   * @param {boolean} isMapIdChanged 选中的图片是否发生变化
   */
  handleSelectImage = (image, isMapIdChanged) => {
    if (isMapIdChanged) {
      const { form: { setFieldsValue } } = this.props;
      this.setState({ image });
      setFieldsValue({ coordinate: undefined });
    }
  }

  render() {
    const {
      beacon: {
        detail: {
          sysId,
          beaconCode,
          mapId,
          xarea,
          yarea,
          zarea,
        }={},
        systems=[],
        images=[],
        imagesMap={},
      },
      match: {
        params: {
          companyId,
          id,
        },
      },
      form: { getFieldDecorator },
      loading,
    } = this.props;
    const { submitting, image } = this.state;
    // 标题
    const title = id ? '编辑信标' : '新增信标';
    // 面包屑
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '人员定位', name: '人员定位' },
      { title: '信标管理', name: '信标管理', href: '/personnel-position/beacon-management/companies' },
      { title: '信标列表', name: '信标列表', href: `/personnel-position/beacon-management/company/${companyId}` },
      { title, name: title },
    ];
    return (
      <PageHeaderLayout
        breadcrumbList={breadcrumbList}
        title={title}
      >
        <Spin spinning={!!submitting || !!loading}>
          <Card>
            <Form className={styles.form}>
              <Form.Item label="所属系统">
                {getFieldDecorator('sysId', {
                  initialValue: sysId,
                  rules: [{ required: true, message: '请选择所属系统' }],
                })(
                  <Select placeholder="请选择所属系统" className={styles.systemSelect}>
                    {systems.map(({ sysName, id }) => (
                      <Select.Option key={id} value={id}>
                        {sysName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="信标编号">
                {getFieldDecorator('beaconCode', {
                  initialValue: beaconCode,
                  getValueFromEvent: e => e.target.value.trim(),
                  rules: [
                    { required: true, whitespace: true, message: '请输入信标编号' },
                  ],
                })(
                  <Input placeholder="请输入信标编号" className={styles.beaconCodeInput} />
                )}
              </Form.Item>
              <Form.Item label="所属地图">
                {getFieldDecorator('mapId', {
                  initialValue: mapId,
                  rules: [{ required: true, message: '请选择所属单位' }],
                })(
                  <ImageSelect
                    image={image}
                    images={images}
                    imagesMap={imagesMap}
                    onSelect={this.handleSelectImage}
                  />
                )}
              </Form.Item>
              <Form.Item label="信标位置">
                {getFieldDecorator('coordinate', {
                  initialValue: xarea && yarea && zarea ? { xarea: +xarea, yarea: +yarea, zarea: +zarea } : undefined,
                  rules: [{ required: true, message: '请选择信标位置' }],
                })(
                  <BeaconCoordinate
                    image={image}
                  />
                )}
              </Form.Item>
            </Form>
            <div className={styles.buttonContainer}>
              <Button className={styles.cancelButton} onClick={this.goBack}>取消</Button>
              <Button type="primary" onClick={this.handleSubmit}>确定</Button>
            </div>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}

