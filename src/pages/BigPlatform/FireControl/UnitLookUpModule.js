import React, { PureComponent } from 'react';

import FcModule from '../FcModule';
import FcSection from './FcSection';

import UnitLookUp from './UnitLookUp';
import UintLookUpBack from './UintLookUpBack';

export default class UnitLookUpModule extends PureComponent {
  render() {
    const {
      isRotated,
      handleRotateMethods,
      lookUpShow,
      startLookUp,
      handleRotateBack,
      ...restProps
    } = this.props;

    return (
      <FcModule isRotated={isRotated} {...restProps}>
        <FcSection title="单位查岗">
          <UnitLookUp handleRotateMethods={handleRotateMethods} />
        </FcSection>
        <UintLookUpBack
          handleRotateBack={handleRotateBack}
          lookUpShow={lookUpShow}
          startLookUp={startLookUp}
        />
      </FcModule>
    );
  }
}
