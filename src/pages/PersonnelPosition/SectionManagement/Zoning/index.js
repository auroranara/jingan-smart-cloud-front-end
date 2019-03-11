import React, { PureComponent } from 'react';
import { Card, Button, Spin, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import ImageDraw from '@/components/ImageDraw';

const title = '划分区域';

@connect(({ zoning, user, loading }) => ({
  zoning,
  user,
  loading: loading.models.zoning,
}))
export default class Zoning extends PureComponent {
  state = {
    data: [],
    name: '区域1',
    url: undefined,
    images: undefined,
    reference: undefined,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // 获取区域信息
    dispatch({
      type: 'zoning/fetchZone',
      payload: {
        id,
      },
      callback: data => {
        if (data) {
          const {
            areaInfo: { name, range },
            companyMap: { id: id1, mapPhoto: image1 } = {},
            floorMap: { id: id2, mapPhoto: image2, jsonMap } = {},
          } = data;

          const { url: url1 } = JSON.parse(image1 || '{}');
          const { url: url2 } = JSON.parse(image2 || '{}');
          const json = JSON.parse(jsonMap || null);
          const item = JSON.parse(range || null);
          if (url1 && url2 && json) {
            const image = {
              id: id2,
              url: url2,
              ...json,
            };
            this.setState({
              url: url1,
              images: [image],
              reference: image,
              name,
              data: item ? [{ ...item, name }] : undefined,
            });
          } else if (url1) {
            const image = {
              id: id1,
              url: url1,
              latlngs: [
                { lat: 0, lng: 0 },
                { lat: 1, lng: 0 },
                { lat: 1, lng: 1 },
                { lat: 0, lng: 1 },
              ],
            };
            this.setState({
              url: url1,
              images: [image],
              reference: image,
              name,
              data: item ? [{ ...item, name }] : undefined,
            });
          } else {
            message.error('数据异常，请联系维护人员或稍后重试！');
          }
        } else {
          message.error('获取数据失败，请稍后重试！');
        }
      },
    });
  }

  goBack = () => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    router.push(`/personnel-position/section-management/company/${companyId}`);
  };

  handleSubmit = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    const {
      data: [range],
    } = this.state;
    dispatch({
      type: 'zoning/zoning',
      payload: {
        id,
        range: range ? JSON.stringify(range) : null,
      },
      callback: flag => {
        if (flag) {
          this.goBack();
        } else {
          message.error('提交失败，请联系维护人员！');
        }
      },
    });
  };

  onUpdate = data => {
    // 创建
    if (data.length > 0 && !data[0].name) {
      const { name } = this.state;
      this.setState({
        data: [{ ...data[0], name }],
      });
    }
    // 编辑或删除
    else {
      this.setState({
        data,
      });
    }
  };

  render() {
    const {
      loading,
      match: {
        params: { companyId },
      },
    } = this.props;
    const { data, url, images, reference } = this.state;
    // 面包屑
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '人员定位', name: '人员定位' },
      {
        title: '区域管理',
        name: '区域管理',
        href: '/personnel-position/section-management/companies',
      },
      {
        title: '区域列表',
        name: '区域列表',
        href: `/personnel-position/section-management/company/${companyId}`,
      },
      { title, name: title },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card bodyStyle={{ padding: 0 }}>
          <Spin spinning={loading}>
            <ImageDraw
              style={{ backgroundColor: '#ccc' }}
              reference={reference}
              url={url}
              data={data}
              images={images}
              onUpdate={this.onUpdate}
              limit={1}
              hideBackground
              drawable
              // maxBoundsRatio={1.2}
              color="#00a8ff"
              autoZoom
            />
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Button onClick={this.goBack} style={{ marginRight: 24 }}>
                取消
              </Button>
              <Button type="primary" onClick={this.handleSubmit}>
                确定
              </Button>
            </div>
          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}
