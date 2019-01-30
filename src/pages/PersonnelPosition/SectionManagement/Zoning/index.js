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
  }

  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    // 获取区域信息
    dispatch({
      type: 'zoning/fetchZone',
      payload: {
        id,
      },
      callback: (data) => {
        if (data) {
          const { url, image, name } = data;
          this.setState({
            url,
            images: [image],
            reference: image,
            name,
          });
        }
        else {
          message.error('获取数据失败，请稍后重试！');
        }
      },
    });
  }

  goBack = () => {
    const { match: { params: { companyId } } } = this.props;
    router.push(`/personnel-position/section-management/company/${companyId}`);
  };

  handleSubmit = () => {
    const { dispatch, match: { params: { id } } } = this.props;
    const { data } = this.state;
    console.log(data);
    dispatch({
      type: 'zoning/zoning',
      payload: {
        id,
        data: JSON.stringify(data),
      },
      callback: (flag) => {
        if (flag) {
          this.goBack();
        }
        else {
          message.error('提交失败，请联系开发人员！');
        }
      },
    });
  }

  onUpdate = (data) => {
    // 创建
    if (data.length > 0 && !data[0].name) {
      const { name } = this.state;
      this.setState({
        data: [{ ...data[0], name }],
      })
    }
    // 编辑或删除
    else {
      this.setState({
        data,
      })
    }
  }

  render() {
    const { loading, match: { params: { companyId } } } = this.props;
    const { data, url, images, reference } = this.state;
    // 面包屑
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '人员定位', name: '人员定位' },
      { title: '区域管理', name: '区域管理', href: '/personnel-position/section-management/companies' },
      { title: '区域列表', name: '区域列表', href: `/personnel-position/section-management/company/${companyId}` },
      { title, name: title },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
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
              color='#00a8ff'
            />
            <div style={{ textAlign: 'center', padding: 24 }}>
              <Button onClick={this.goBack} style={{ marginRight: 24 }}>取消</Button>
              <Button type="primary" onClick={this.handleSubmit}>确定</Button>
            </div>
          </Spin>
        </Card>
      </PageHeaderLayout>
    )
  }
}
