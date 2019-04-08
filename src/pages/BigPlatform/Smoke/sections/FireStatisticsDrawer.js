import React, { PureComponent, Fragment } from 'react';
import { DatePicker, Form } from 'antd';
import moment from 'moment';
import { connect } from 'dva';

import styles from './FireStatisticsDrawer.less';
import {
  DrawerContainer,
  DrawerSection,
  ChartRing,
  ChartBar,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
// import { ChartBar } from '../components/Components';

const FormItem = Form.Item;
const TYPE = 'fire';
const { RangePicker } = DatePicker;
const RING_LABELS = ['处理中', '已处理', '超时结束'];
const RING_COLORS = ['0,255,255', '0,186,255', '188,188,189'];

@connect(({ smoke }) => ({
  smoke,
}))
@Form.create()
export default class FireStatisticsDrawer extends PureComponent {
  state = { selected: 0, searchValue: '' };

  handleClose = () => {
    const { handleDrawerVisibleChange } = this.props;
    handleDrawerVisibleChange(TYPE);
    this.setState({ searchValue: '', grahp: 0, selected: 0 });
  };

  handleOk = type => {
    const {
      gridId,
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const data = getFieldsValue();
    const { checkDate, ...restValues } = data;
    const startDate = checkDate && checkDate.length > 0 ? checkDate[0] : undefined;
    const endDate = checkDate && checkDate.length > 0 ? checkDate[1] : undefined;
    // 修改表单数据
    this.formData = data;
    // 获取火警统计
    dispatch({
      type: 'smoke/fetchFireHistory',
      payload: {
        ...restValues,
        startDate: startDate && startDate.format('YYYY-MM-DD'),
        endDate: endDate && endDate.format('YYYY-MM-DD'),
        type,
        gridId,
      },
    });
  };

  render() {
    const {
      visible,
      form: { getFieldDecorator },
      smoke: {
        fireHistoryData: {
          fireCompanyList: { startDate, endDate, list = [] },
        },
      },
      type,
    } = this.props;

    const rings = [0, 0, 0].map((n, i) => ({
      name: RING_LABELS[i],
      value: n,
      itemStyle: { color: `rgb(${RING_COLORS[i]})` },
    }));

    const newList = list.slice(0, 10).map(({ company_name, num }, i) => {
      let newName = company_name;
      if (i === 9 && company_name.length > 10) newName = `${company_name.slice(0, 10)}...`;
      return { id: i, name: newName, value: num };
    });

    const left = (
      <Fragment>
        <FormItem>
          {getFieldDecorator('checkDate', {
            initialValue: [moment(startDate), moment(endDate)],
          })(
            <RangePicker
              format="YYYY-MM-DD"
              className={styles.rangePicker}
              dropdownClassName={styles.rangePicker}
              placeholder={['开始时间', '结束时间']}
              showTime={{
                defaultValue: [moment('0:0:0', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }}
              onOk={() => this.handleOk(type)}
              popupStyle={{ zIndex: 3000 }}
            />
          )}
        </FormItem>
        <DrawerSection title="处理状态统计" style={{ marginBottom: 50 }}>
          <ChartRing data={rings} />
        </DrawerSection>

        <DrawerSection title="火警单位排行" titleInfo={`共${list.length}家`}>
          <ChartBar data={newList} labelRotate={-60} />
        </DrawerSection>
      </Fragment>
    );

    return (
      <DrawerContainer
        title="火警统计"
        width={535}
        zIndex={1050}
        visible={visible}
        left={left}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={this.handleClose}
      />
    );
  }
}
