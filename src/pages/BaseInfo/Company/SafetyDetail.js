import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card } from 'antd';

import DescriptionList from 'components/DescriptionList';

const { Description } = DescriptionList;

const dspItems = [
  {
    name: 'gridId',
    cName: '所属网格',
  }, {
    name: 'industryCategory',
    cName: '监管分类',
  }, {
    name: 'standardLevel',
    cName: '安全监管等级',
  }, {
    name: 'reachLevel',
    cName: '标准化达标等级',
  }, {
    name: 'administratiRelation',
    cName: '企业行政隶属关系',
  }, {
    name: 'regulatoryOrganization',
    cName: '属地安监机构',
  }, {
    name: 'validity',
    cName: '服务有效期',
  },
];

const dspItems1 = [{
  name: 'companyLogo',
  cName: '单位LOGO',
}];

const moreItems = [
  {
    name: 'reachGradeAccessory',
    cName: '标准化达标等级附件',
  }, {
    name: 'safetyFourPicture',
    cName: '安全四色图',
  },
];

function renderDsp(items, detail) {
  return items.map(({ name, cName }) => {
    let val = null;
    // validity对应undoTime
    if (name === 'startTime' && detail.startTime) {
      // console.log(detail[name].split(','));
      val = [detail.startTime, detail.endTime].map(timestamp => moment(Number.parseInt(timestamp, 10)).format('YYYY/MM/DD')).join('~');
    }
    else if (name !== 'endTime')
      val = detail[`${name}Label`];
    return <Description key={name} term={cName}>{val === null || val === undefined ? '暂无信息' : val.toString()}</Description>
  });
}

@connect(({ safety }) => ({ safety }))
export default class SafetyDetail extends PureComponent {

  componentDidMount() {
    const { dispatch, companyId } = this.props;
    dispatch({ type: 'safety/fetch', payload: companyId });
    dispatch({ type: 'safety/fetchMenus' });
  }

  render() {
    const { safety: { menus, detail } } = this.props;
    // 若detail中包含standardLevel且standardLevel不为未评级，则先把那两个item渲染出来
    // const items = detail.reachLevel !== undefined && detail.reachLevel !== menus.reachLevel[4].value ? [...moreItems, ...dspItems1] : dspItems1;
    const items = detail.reachLevel !== undefined && detail.reachLevel !== '5' ? [...moreItems, ...dspItems1] : dspItems1;

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
