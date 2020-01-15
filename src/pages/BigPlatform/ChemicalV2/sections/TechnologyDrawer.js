import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
// import styles from './MonitorDrawer.less';
import { CardItem } from '../components/Components';

const fields = [
  { label: '统一编码', value: 'unifiedCode' },
  { label: '生产工艺名称', value: 'processName' },
  { label: '反应类型', value: 'reactionType' },
  { label: '重点监管单元', value: 'keyMonitoringUnit' },
  { label: '工艺危险特点', value: 'dangerousCharacter', render: val => <div>{val}</div> },
];

export default class TechnologyDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visible, onClose, highRiskProcessList } = this.props;
    // const {} = this.state;
    return (
      <DrawerContainer
        title="重点监管危险化工工艺"
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        left={
          <div>
            {highRiskProcessList.map((item, index) => (
              <CardItem key={index} data={item} fields={fields} />
            ))}
          </div>
        }
      />
    );
  }
}
