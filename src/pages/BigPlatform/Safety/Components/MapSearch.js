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
      console.log('onEnter', this.state.value);
      this.jump(this.state.value);
    }
  };

  onSelect = (value, { props: { label } }) => {
    this.jump(label);
  };

  jump = item => {
    console.log('jump ', item);
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

  render() {
    const {
      bigPlatformSafetyCompany: { selectList },
      style,
    } = this.props;
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
