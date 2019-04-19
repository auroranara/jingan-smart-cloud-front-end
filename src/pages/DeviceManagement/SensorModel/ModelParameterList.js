import { PureComponent } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import codes from '@/utils/codes';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

const title = "传感器型号参数"

@connect(({ sensor }) => ({
  sensor,
}))
export default class ModelParameterList extends PureComponent {

}
