import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card } from 'antd';

import DescriptionList from 'components/DescriptionList';

const { Description } = DescriptionList;

// const UPLOADERS = ['companyLogo', 'reachGradeAccessory', 'safetyFourPicture'];
const dspItems = [
  {
    name: 'regulatoryClassification',
    cName: '监管分类',
  }, {
    name: 'regulatoryGrade',
    cName: '安全监管等级',
  }, {
    name: 'reachGrade',
    cName: '标准化达标等级',
  }, {
    name: 'subjection',
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

const idMap = {};
const textMap = {};

function traverse(tree) {
  tree.forEach(({ id, parentIds, text, children  }) => {
    idMap[id] = [...parentIds.split(','), id].filter(item => item);
    textMap[id] = text;
    children && traverse(children);
  });
}

function renderDsp(items, detail, menus) {
  return items.map(({ name, cName }) => {
    let val = null;
    const v = detail[name];
    // console.log(name, cName, menus[name], detail[name]);
    // 如果菜单或detail还没获取
    if (!Object.keys(menus).length || !Object.keys(detail).length)
      val = '暂无信息';
    else if (v === null || v === undefined || v === '' && name !== 'validity')
      val = '暂无信息';
    else if (name === 'validity') {
      if (!detail.startTime || detail.endTime)
        val = '暂无信息';
      else
        val = [detail.startTime, detail.endTime].map(timestamp => moment(Number.parseInt(timestamp, 10)).format('YYYY/MM/DD')).join('~');
    } else
      switch(name) {
        case 'regulatoryOrganization':
          val = v;
          break;
        case 'companyLogo':
        case 'reachGradeAccessory':
        case 'safetyFourPicture':
          val = <a href={`http://pak93s58x.bkt.clouddn.com/development${v.slice(v.indexOf('/gsafe'))}`}>链接</a>
          break;
        default:
            // console.log(name, menus[name], detail[name], menus[name].find(item => item.value === detail[name]));
            val = menus[name].find(item => item.value === detail[name]).label;
      }
    return <Description key={name} term={cName}>{typeof val === 'object' ? val : val.toString()}</Description>
  });
}

@connect(({ safety }) => ({ safety }))
export default class SafetyDetail extends PureComponent {

  componentDidMount() {
    const { dispatch, companyId } = this.props;
    dispatch({ type: 'safety/fetch', payload: companyId });
    dispatch({ type: 'safety/fetchMenus', callback(menus) { traverse(JSON.parse(menus.gridList)); } });
  }

  render() {
    const { safety: { detail, menus } } = this.props;
    // console.log(detail, menus);
    // 若detail中包含standardLevel且standardLevel不为未评级，则先把那两个item渲染出来
    // const items = detail.reachLevel !== undefined && detail.reachLevel !== menus.reachLevel[4].value ? [...moreItems, ...dspItems1] : dspItems1;
    const items = detail.reachGrade !== undefined && detail.reachGrade !== '5' ? [...moreItems, ...dspItems1] : dspItems1;

    const grid = detail.gridId;
    console.log(grid, menus.gridList, idMap);

    return (
      <Card title="安监信息">
        <DescriptionList col={1} style={{ marginBottom: 13 }}>
          <Description term="所属网格">{ grid && menus.gridList && idMap[grid].map(id => textMap[id]).join('-') }</Description>
        </DescriptionList>
        <DescriptionList col={3} style={{ marginBottom: 13 }}>
          {renderDsp(dspItems, detail, menus)}
        </DescriptionList>
        <DescriptionList col={1}>
          {renderDsp(items, detail, menus)}
        </DescriptionList>
      </Card>
    );
  }
}
