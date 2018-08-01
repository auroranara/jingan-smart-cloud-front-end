import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card } from 'antd';

import DescriptionList from 'components/DescriptionList';

const { Description } = DescriptionList;

const dspItems = [
  {
    name: 'grid',
    cName: '所属网格',
  }, {
    name: 'category',
    cName: '监管分类',
  }, {
    name: 'safetyLevel',
    cName: '安全监管等级',
  }, {
    name: 'standardLevel',
    cName: '标准化达标等级',
  }, {
    name: 'relationship',
    cName: '企业行政隶属关系',
  }, {
    name: 'organization',
    cName: '属地安监机构',
  }, {
    name: 'validity',
    cName: '服务有效期',
  },
];

const dspItems1 = [{
  name: 'logo',
  cName: '单位LOGO',
}];

const moreItems = [
  {
    name: 'appendix',
    cName: '标准化达标等级附件',
  }, {
    name: 'fourColorImage',
    cName: '安全四色图',
  },
];

function renderDsp(items, detail) {
  return items.map(({ name, cName }) => {
    let val = null;
    if (name === 'validity' && detail[name]) {
      // console.log(detail[name].split(','));
      val = detail[name].split(',').map(timestamp => moment(Number.parseInt(timestamp, 10)).format('YYYY/MM/DD')).join('~');
    }
    else
      val = detail[`${name}Label`];
    return <Description key={name} term={cName}>{val === null || val === undefined ? '暂无信息' : val.toString()}</Description>
  });
}

@connect(({ safety }) => ({ safety }))
export default class SafetyDetail extends PureComponent {
  state = { showMore: false };

  componentDidMount() {
    const that = this;
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'safety/fetch',
      payload: companyId,
      callback(menus = {standardLevel: [{id: '@@none'}]}, detail = {}) {
        // 若标准化达标等级不为未评级，则先把那两个item渲染出来，再设初值
        if (menus.standardLevel[0].id !== detail.standardLevel)
          that.setState({ showMore: true });
      },
    });
  }

  render() {
    const { safety: { detail } } = this.props;
    const items = this.state.showMore ? [...moreItems, ...dspItems1] : dspItems1;

    return (
      <Card title="安监信息">
        <DescriptionList col={3} style={{ marginBottom: 13 }}>
          {renderDsp(dspItems, detail)}
        </DescriptionList>
        <DescriptionList col={1}>
          {renderDsp(items, detail)}
        </DescriptionList>
      </Card>
    );
  }
}
