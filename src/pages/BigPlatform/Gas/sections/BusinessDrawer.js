import React, { PureComponent, Fragment } from 'react';

import styles from './AlarmDrawer.less';
import {
  DrawerCard,
  DrawerContainer,
  DrawerSection,
  GraphSwitch,
  OvSelect,
  SearchBar,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
import {
  DotItem,
  BussinessChartBar,
  BussinessChartLine,
  AlarmChartBar,
  AlarmChartLine,
} from '../components/Components';

const TYPE = 'business';
const NO_DATA = '暂无信息';
// const LABELS = ['未处理报警', '未处理故障'];
// const COLORS = ['248,51,41', '255,180,0'];
const OPTIONS = ['  全部业务 ', '未处理故障', '未处理报警'].map((d, i) => ({ value: i, desc: d }));

export default class BusinessDrawer extends PureComponent {
  state = { graph: 0, otherGraph: 0, selected: 0, searchValue: '' };

  handleSwitch = i => {
    this.setState({ graph: i });
  };

  handleSwitchAlarm = i => {
    this.setState({ otherGraph: i });
  };

  handleSelectChange = i => {
    this.setState({ selected: i });
  };

  genProgressClick = v => {
    return e => {
      this.handleSelectChange(v);
    };
  };

  handleSearch = v => {
    this.setState({ searchValue: v });
  };

  handleClose = () => {
    const { handleDrawerVisibleChange } = this.props;
    handleDrawerVisibleChange(TYPE);
    this.setState({ searchValue: '', grahp: 0, selected: 0 });
  };

  render() {
    const { visible, data: { list = [], graphList = [] } = {} } = this.props;
    const { graph, selected, searchValue, otherGraph } = this.state;

    const faultList = [
      {
        date: '2018-04',
        finishGas: 0,
        untreatedGas: 0,
      },
      {
        date: '2018-05',
        finishGas: 0,
        untreatedGas: 0,
      },
      {
        date: '2018-06',
        finishGas: 0,
        untreatedGas: 0,
      },
      {
        date: '2018-07',
        finishGas: 0,
        untreatedGas: 0,
      },
      {
        date: '2018-08',
        finishGas: 0,
        untreatedGas: 0,
      },
      {
        date: '2018-09',
        finishGas: 0,
        untreatedGas: 0,
      },
      {
        date: '2018-10',
        finishGas: 0,
        untreatedGas: 0,
      },
      {
        date: '2018-11',
        finishGas: 0,
        untreatedGas: 0,
      },
      {
        date: '2018-12',
        finishGas: 0,
        untreatedGas: 0,
      },
      {
        date: '2018-01',
        finishGas: 0,
        untreatedGas: 0,
      },
      {
        date: '2019-02',
        finishGas: 0,
        untreatedGas: 0,
      },
      {
        date: '2019-03',
        finishGas: 0,
        untreatedGas: 0,
      },
    ];

    const filteredList = list
      .filter(({ company_name }) => company_name.includes(searchValue))
      .filter(item => {
        switch (selected) {
          case 0:
            return true;
          case 1:
            return item.common;
          case 2:
            return item.gasFire;
          default:
            return false;
        }
      });

    const extra = <GraphSwitch handleSwitch={this.handleSwitch} />;
    const extraOther = <GraphSwitch handleSwitch={this.handleSwitchAlarm} />;
    const select = (
      <OvSelect
        cssType={1}
        options={OPTIONS}
        value={selected}
        handleChange={this.handleSelectChange}
      />
    );

    const left = (
      <Fragment>
        <DrawerSection title="报警业务处理统计" titleInfo="最近12个月" extra={extra}>
          {graph ? (
            graphList.length > 0 ? (
              <BussinessChartBar data={graphList} labelRotate={0} />
            ) : (
              <div style={{ height: '22em', textAlign: 'center', lineHeight: '22em' }}>
                暂无数据
              </div>
            )
          ) : graphList.length > 0 ? (
            <BussinessChartLine data={graphList} labelRotate={0} />
          ) : (
            <div style={{ height: '22em', textAlign: 'center', lineHeight: '22em' }}>暂无数据</div>
          )}
        </DrawerSection>
        <DrawerSection title="故障业务处理统计" titleInfo="最近12个月" extra={extraOther}>
          {otherGraph ? (
            <AlarmChartBar data={faultList} labelRotate={0} />
          ) : (
            <AlarmChartLine data={faultList} labelRotate={0} />
          )}
        </DrawerSection>
      </Fragment>
    );

    const right = (
      <SearchBar onSearch={this.handleSearch} extra={select}>
        {filteredList.map(
          ({
            company_id,
            company_name,
            address,
            principal_name,
            principal_phone,
            gasFire,
            fault = 0,
          }) => (
            <div style={{ marginBottom: '10px' }}>
              {gasFire > 0 && (
                <DrawerCard
                  key={company_id}
                  name={company_name || NO_DATA}
                  location={address || NO_DATA}
                  person={principal_name || NO_DATA}
                  phone={principal_phone || NO_DATA}
                  style={{ cursor: 'auto' }}
                  more={
                    <p className={styles.more}>
                      {gasFire > 0 && (
                        <DotItem title="未处理报警" color={`rgb(248,51,41)`} quantity={gasFire} />
                      )}
                      {fault > 0 && (
                        <DotItem title="未处理故障" color={`rgb(255,180,0)`} quantity={fault} />
                      )}
                    </p>
                  }
                />
              )}
            </div>
          )
        )}
      </SearchBar>
    );

    return (
      <DrawerContainer
        title="待处理业务"
        visible={visible}
        left={left}
        right={right}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={this.handleClose}
      />
    );
  }
}
