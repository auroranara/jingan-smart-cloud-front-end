import React, { PureComponent } from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import styles from './MapSearch.less';

const Input = props => <input {...props} />;

@connect(({ bigPlatformSafetyCompany }) => ({ bigPlatformSafetyCompany }))
class MapSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.fetchData = debounce(this.fetchData, 500);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.jump(this.state.value);
    }
  };

  onSelect = (value, { props: { label } }) => {
    this.jump(label);
  };

  jump = item => {
    this.props.handleSelect(item);
  };

  fetchData = value => {
    this.props.dispatch({
      type: 'bigPlatformSafetyCompany/fetchSelectList',
      payload: {
        name: value,
      },
      callback: () => {},
    });

    this.setState({
      value: value,
    });
  };

  handleChange = (value, { props: { label } }) => {
    this.fetchData(value);
    this.setState({
      value,
    });
  };

  handleClear = () => {
    this.setState({ value: '' });
  };

  render() {
    const {
      bigPlatformSafetyCompany: { selectList },
      style,
    } = this.props;
    const { value } = this.state;
    const options = selectList.map(item => {
      const { name } = item;
      let children = name;
      // 字符串中不包含value值时，直接渲染字符串，包含时才显示高亮
      if (name.includes(value)) {
        const [front, end] = name.split(value);
        children = [
          front,
          <span key={value} className={styles.dropHighlight}>
            {value}
          </span>,
          end,
        ];
      }
      return (
        <Option key={item.id} label={item}>
          {children}
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
            value={value}
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
