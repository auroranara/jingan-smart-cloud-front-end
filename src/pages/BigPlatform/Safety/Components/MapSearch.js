import React, { PureComponent } from 'react';
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import Counter from 'components/flip-timer';

const Input = props => <input {...props} />;

@connect(({ bigPlatformSafetyCompany }) => ({ bigPlatformSafetyCompany }))
class MapSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      start: false,
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
    console.log('select ', value);
    console.log('option ', label);
    this.jump(value);
  };

  jump = v => {
    console.log('jump ', v);
    // location.href = 'https://s.taobao.com/search?q=' + encodeURIComponent(v);
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

  handleChange = value => {
    console.log('handleChange', value);
    this.fetchData(value);
    this.setState({
      value,
    });
  };

  handleStart = value => {
    this.setState({ start: true });
  };

  render() {
    return (
      <div>
        <Counter onStop={() => {}} stop={10 * 1000} start={this.state.start} />
        <button
          onClick={() => {
            this.handleStart();
          }}
        >
          按钮
        </button>
      </div>
    );
  }
}

export default MapSearch;
