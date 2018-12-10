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
    const { visible, selectedIndex=0, isUnit, ovType, handleDrawerVisibleChange } = this.props;
    const { graph } = this.state;

    const extra = <GraphSwitch handleSwitch={this.handleSwitch} />;

    const left = (
      <Fragment>
        <DrawerSection title="隐患状态统计" style={{ marginBottom: 50 }}>
          <ChartRing />
        </DrawerSection>
        <DrawerSection title="隐患数量排名" extra={extra}>
          {graph ? <ChartLine /> : <ChartBar />}
        </DrawerSection>
      </Fragment>
    );

    const right = (
        <SearchBar>
          {CARDS.map((item, i) => {
            return (
              <DrawerStretchCard
                key={item.id}
                selected={i === selectedIndex}
                {...item}
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
