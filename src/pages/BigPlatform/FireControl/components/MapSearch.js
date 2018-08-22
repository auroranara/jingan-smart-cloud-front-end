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
      selectedItem: null,
    };
    this.fetchData = debounce(this.fetchData, 500);
  }

  onSelect = (value, option) => {
    const { props: { label } } = option;
    this.jump(label);
    console.log('select', label.name);
    this.setState({ selectedName: label.name });
  };

  jump = item => {
    this.props.handleSelect(item);
  };

  fetchData = value => {
    const { list } = this.props;
    const selectList = value ? list.filter(item => item.name.includes(value)) : [];
    this.setState({
      value,
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
    const { selectList, value, selectedName } = this.state;
    console.log(selectedName);
    const options = selectList.map(item => {
      const { name } = item;
      const [front, end] = name.split(value);

      return (
        <Option key={item.id} label={item} style={{ color: '#FFF' }}>
          {front}
          <span className={styles.highlight}>{value}</span>
          {end}
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
            value={selectedName ? selectedName : this.state.value}
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
