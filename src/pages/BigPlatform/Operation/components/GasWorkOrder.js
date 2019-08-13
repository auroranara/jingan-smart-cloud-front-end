import React, { Fragment, PureComponent } from 'react';

import { AlarmCount, DrawerSection, GasFlow, OvSelect } from './Components';
import { DATE_OPTIONS } from '@/pages/BigPlatform/GasStation/utils';

export default class GasWorkOrder extends PureComponent{
  state = { dateType: 1 };

  handleDateChange = value => {
    const { fetchGasTotal, data: { item: { deviceDataForAppList: [{ deviceId }] } } } = this.props;
    this.setState({ dateType: value });
    fetchGasTotal(deviceId, value);
  };

  render() {
    const { data } = this.props;
    const { dateType } = this.state;
    const extra = <OvSelect cssType="1" options={DATE_OPTIONS} value={dateType} handleChange={this.handleDateChange} />;
    return (
      <Fragment>
        <DrawerSection
          title="工单处理流程"
          style={{ padding: 0 }}
        >
          <GasFlow data={data} />
        </DrawerSection>
        <DrawerSection
          title="问题统计"
          style={{ padding: '10px 0 0 0', borderTop: '1px solid rgb(76, 206, 240)' }}
          extra={extra}
        >
          <AlarmCount data={data.gasTotal} />
        </DrawerSection>
      </Fragment>
    );
  }
}
