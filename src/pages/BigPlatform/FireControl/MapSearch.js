import React, { PureComponent } from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
import debounce from 'lodash/debounce';
import styles from './MapSearch.less';

const Input = props => <input {...props} />;

class MapSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      selectList: [],
    };
    this.fetchData = debounce(this.fetchData, 500);
  }

  onSelect = (value, { props: { label } }) => {
    this.jump(label);
  };

  jump = item => {
    this.props.handleSelect(item);
  };

  fetchData = value => {
    const { list } = this.props;
    const selectList = value ? list.filter(item => item.name.includes(value)) : [];
    this.setState({
      value: value,
      selectList: selectList.length > 10 ? selectList.slice(0, 9) : selectList,
    });
  };

  handleChange = (value, { props: { label } }) => {
    this.fetchData(value);
    this.setState({
      value,
    });
  };

  render() {
    const { style } = this.props;
    const { selectList } = this.state;
    const options = selectList.map(item => {
      return (
        <Option key={item.id} label={item}>
          {item.name}
        </Option>
      );
    });
    return (
      <div className={styles.mapSearchMain}>
        <div>
          <Select
            style={{ width: 300, ...style }}
            combobox
            optionLabelProp="children"
            value={this.state.value}
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
