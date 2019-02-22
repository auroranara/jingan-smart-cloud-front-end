import React, { PureComponent } from 'react';
// import { Button } from 'antd';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
import styles from './MapSearch.less';

const Input = props => <input {...props} />;

class MapSearch extends PureComponent {
  // state = { selectedItem: {} };

  onSelect = (value, option) => {
    const { handleSelect } = this.props;
    const {
      props: { label },
    } = option;
    handleSelect(label);
    // console.log('select', value);
    // this.setState({ selectedItem: label });
  };

  // jump = item => {
  //   const { methods: { handleSelect } } = this.props;
  //   handleSelect(item);
  // };

  handleChange = (value, option) => {
    const { handleChange } = this.props;
    handleChange(value, option);
  };

  render() {
    const { selectList, value, style } = this.props;
    let options = [];
    if (!value) options = [];
    else {
      options = selectList.map(item => {
        const { companyName, companyId } = item;
        let children = companyName;
        // 字符串中不包含value值时，直接渲染字符串，包含时才显示高亮
        if (companyName.includes(value)) {
          const [front, end] = companyName.split(value);
          children = [
            front,
            <span key={companyId} className={styles.highlight}>
              {value}
            </span>,
            end,
          ];
        }

        return (
          <Option key={item.companyId} label={item} style={{ color: '#FFF' }}>
            {children}
          </Option>
        );
      });
    }
    // const { selectList, value, style, handleChange } = this.props;
    // const { selectedItem: { id, name } } = this.state;

    // console.log('render value', value);
    // console.log('render selectList', selectList);
    // console.log('render options', options);
    /* Select中的Option <Option key={id} value={id}>xxx</Option>
       实际上应该设置的是value值，当Option中需要设置key时，应该保证与value值一致，此时可以省略设置value值，若不需要设置key时，就只需要设置value值
       而onChange,onSelect事件中传入的value值都对应Option的value值，当把某个value值设置给Select时，Select会去找到其Options中具有该value值的Option
       然后将<Option>xx</Option>中的xx渲染到Select的input上，若xx不是一个字符串，将其转成字符串，若没有找到value值对应的Option，则直接在Select的input
       中显示该value值
    */
    return (
      <div className={styles.mapSearchMain}>
        <div>
          <Select
            style={{ width: 300, ...style }}
            combobox
            optionLabelProp="children"
            value={value}
            // 这里就是最后判断一下，若不是自己输入的字符串，而是点击选中之后的值，则为一个id，将其对应的企业名字name渲染出来即可，不然会把对应Option.children
            // [front, <span />, end]转成字符串 'compnanyName,[Object object],',显示在Select的input中
            // value={id === value ? name : value}
            placeholder="单位名称"
            defaultActiveFirstOption={false}
            getInputElement={() => <Input />}
            showArrow={false}
            notFoundContent=""
            onChange={this.handleChange}
            onSelect={this.onSelect}
            filterOption={false}
          >
            {options}
          </Select>
        </div>
      </div>
    );
  }
}

export default MapSearch;
