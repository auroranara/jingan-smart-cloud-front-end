import React, { PureComponent, Fragment } from 'react';

import styles from './DangerDrawer.less';
// import DrawerContainer from '../components/DrawerContainer';
// import DrawerSection from '../components/DrawerSection';
// import GraphSwitch from '../components/GraphSwitch';
// import SearchBar from '../components/SearchBar';
// import DrawerStretchCard from '../components/DrawerStretchCard';
// import Ring from '../components/Ring';
import {
  DrawerContainer,
  DrawerSection,
  DrawerStretchCard,
  GraphSwitch,
  ChartBar,
  ChartLine,
  ChartRing,
  SearchBar,
} from '../components/Components';
import clockIcon from '../img/cardClock1.png';

const TYPE = 'danger';

const CARDS = [...Array(10).keys()].map(i => ({
  id: i,
  name: '无锡市新吴区机械制造有限公司',
  total: 10,
}));

export default class DangerDrawer extends PureComponent {
  state = { graph: 0 };

  handleSwitch = i => {
    this.setState({ graph: i });
  };

  render() {
    const {
      visible,
      selectedIndex=0,
      dangerType=0,
      handleDrawerVisibleChange,
      data: {
        overview: {
          overdueNum=0,
          rectifyNum=0,
          reviewNum=0,
        },
        dangerList=[],
      },
    } = this.props;
    const { graph } = this.state;

    const rings = [overdueNum, rectifyNum, reviewNum];
    const list = dangerList.slice(0, 10).map(({ companyId, companyName, total }) => ({ id: companyId, name: companyName, value: total }));
    const extra = <GraphSwitch handleSwitch={this.handleSwitch} />;

    const left = (
      <Fragment>
        <DrawerSection title="隐患状态统计" style={{ marginBottom: 50 }}>
          <ChartRing data={rings} />
        </DrawerSection>
        <DrawerSection title="隐患数量排名" extra={extra}>
          {graph ? <ChartBar data={list} /> : <ChartLine data={list} />}
        </DrawerSection>
      </Fragment>
    );

    const right = (
        <SearchBar>
          {dangerList.map(({ companyId, companyName, total=0, afterRectification=0, toReview=0, hasExtended=0 }, i) => {
            return (
              <DrawerStretchCard
                key={companyId}
                selected={i === selectedIndex}
                name={companyName}
                total={total}
                rectify={afterRectification}
                review={toReview}
                overdue={hasExtended}
              />
            );
          })}
        </SearchBar>
    );

    return (
      <DrawerContainer
        title="隐患列表"
        visible={visible}
        left={left}
        right={right}
        onClose={() => handleDrawerVisibleChange(TYPE)}
      />
    );
  }
}
