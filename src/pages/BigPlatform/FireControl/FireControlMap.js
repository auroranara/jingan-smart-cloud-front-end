import React, { PureComponent } from 'react';
import { Map as GDMap, Marker, InfoWindow } from 'react-amap';

const { location } = global.PROJECT_CONFIG;

export default class AlarmSection extends PureComponent {
  state = {
    center: [location.x, location.y],
    zoom: location.zoom,
  };

  render() {
    return (
      <div>
        <GDMap
          amapkey="665bd904a802559d49a33335f1e4aa0d"
          plugins={[
            { name: 'Scale', options: { locate: false } },
            { name: 'ToolBar', options: { locate: false } },
          ]}
          status={{
            keyboardEnable: false,
          }}
          useAMapUI
          mapStyle="amap://styles/88a73b344f8608540c84a2d7acd75f18"
        >
          {this.renderCompanyMarker()}
          {this.renderInfoWindow()}
        </GDMap>
      </div>
    );
  }
}
