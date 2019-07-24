import React from 'react';

import { Gauge, WaterTankBase } from './Components';
import { isLengthUnit } from '../utils';

export default function WaterTank(props) {
  const {
    data,
    className,
    tankClassName,
    gaugeClassName,
    ...restProps
  } = props;

  const { value, status, unit, deviceParamsInfo: { normalLower, normalUpper, minValue, maxValue } } = data;

  const val = value || 0;

  return isLengthUnit(unit) ? (
    <WaterTankBase
      className={tankClassName}
      status={+status}
      dy={30}
      width={200}
      height={200}
      value={val}
      size={[100, 150]}
      limits={[normalLower, normalUpper]}
      range={[minValue, maxValue]}
      unit={unit}
      {...restProps}
    />
  ) : (
    <Gauge
      data={data}
      className={gaugeClassName}
      style={{ paddingTop: 35, height: 200 }}
      {...restProps}
    />
  );
}
