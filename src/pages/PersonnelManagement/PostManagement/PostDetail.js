import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Icon } from 'antd';
import { routerRedux } from 'dva/router';

import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
import styles from './PostList.less';

const { Description } = DescriptionList;

// 标题
const title = '查看人员信息';

// 获取code
const {
  personnelManagement: {
    personnelInfo: { edit: editCode },
  },
} = codes;

// 获取无数据
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

const sexList = {
  1: '男',
  2: '女',
};

const personList = {
  1: '员工',
  2: '外协人员',
  3: '临时人员',
};

@connect(({ personnelInfo, user, loading }) => ({
  personnelInfo,
  user,
  loading: loading.models.personnelInfo,
}))
@Form.create()
export default class PersonnelDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uploadPic: [], // 上传的照片
      detailList: {}, // 当前详情列表
      showImg: false,
      picList: [],
    };
  }

  /* 生命周期函数 */
  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      dispatch,
      location: {
        query: { listId },
      },
    } = this.props;
    dispatch({
      type: 'personnelInfo/fetchPersonInfoList',
      payload: {
        pageSize: 18,
        pageNum: 1,
        companyId: listId,
      },
      callback: res => {
        const { list } = res;
        const currentList = list.find(item => item.id === id) || {};
        const { photoDetails } = currentList;
        this.setState({
          uploadPic: photoDetails,
          detailList: currentList,
        });
      },
    });
  }

  // 返回
  goBack = () => {
    const {
      dispatch,
      location: {
        query: { listId },
      },
    } = this.props;
    dispatch(routerRedux.push(`/personnel-management/personnel-info/personnel-list/${listId}`));
  };

  // 编辑
  goToEdit = () => {
    const {
      match: {
        params: { id },
      },
      location: {
        query: { listId },
      },
      dispatch,
    } = this.props;
    dispatch(
      routerRedux.push(`/personnel-management/personnel-info/personnel-edit/${id}?listId=${listId}`)
    );
  };

  handleMorePic = picList => {
    this.setState({ showImg: true, picList: picList });
  };

  handleCloseImg = () => {
    this.setState({ showImg: false });
  };

  /* 渲染详情 */
  renderDetail() {
    const {
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    const { detailList, uploadPic } = this.state;

    // 是否有编辑权限
    const editAuth = hasAuthority(editCode, permissionCodes);
    const { name, sex, tel, duty, profession, personType, workCode, personCompany } = detailList;

    return (
      <Card title="人员信息详情" bordered={false} className={styles.cardDetail}>
        <DescriptionList col={3} style={{ marginBottom: 16 }}>
          <Description term="姓名">{name || getEmptyData()}</Description>
          <Description term="性别">{sexList[sex] || getEmptyData()}</Description>
          <Description term="手机号">{tel || getEmptyData()}</Description>
          <Description term="职务">{duty || getEmptyData()}</Description>
          <Description term="工种">{profession || getEmptyData()}</Description>
          <Description term="人员类型">{personList[personType] || getEmptyData()}</Description>
          <Description term="所属单位">{personCompany || getEmptyData()}</Description>
          <Description term="作业证书编号">{workCode || getEmptyData()}</Description>
        </DescriptionList>
        <DescriptionList col={3} style={{ marginBottom: 16 }}>
          <Description term="照片">
            {uploadPic.length > 0 ? (
              <div
                onClick={() => this.handleMorePic(uploadPic)}
                className={styles.imgSection}
                style={{
                  backgroundImage: `url(${uploadPic.map(item => item.webUrl).join('')})`,
                  backgroundSize: 'cover',
                }}
              />
            ) : (
              getEmptyData()
            )}
          </Description>
        </DescriptionList>
        <div style={{ textAlign: 'center' }}>
          <Button onClick={this.goBack} style={{ marginRight: '24px' }}>
            返回
          </Button>
          <Button type="primary" disabled={!editAuth} onClick={this.goToEdit}>
            编辑
          </Button>
        </div>
      </Card>
    );
  }

  render() {
    const {
      location: {
        query: { listId },
      },
    } = this.props;

    const { showImg, picList } = this.state;

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '人员在岗在位管理',
        name: '人员在岗在位管理',
      },
      {
        title: '人员基本信息',
        name: '人员基本信息',
        href: `/personnel-management/personnel-info/personnel-list/${listId}`,
      },
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderDetail()}
        <div
          className={styles.magnify}
          onClick={this.handleCloseImg}
          style={{ display: showImg ? 'block' : 'none' }}
        >
          <Icon type="close" onClick={this.handleCloseImg} className={styles.iconClose} />
          <img
            className={styles.imgStyle}
            src={picList.map(item => item.webUrl).join('')}
            alt="照片"
            onClick={e => e.stopPropagation()}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
