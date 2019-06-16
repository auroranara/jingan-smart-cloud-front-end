import DynamicDrawerTop from '@/pages/BigPlatform/Operation/components/DynamicDrawerTop';
// import old_AlarmDynamicDrawer from '@/pages/BigPlatform/NewUnitFireControl/Section/AlarmDynamicDrawer';
// import old_FaultMessageDrawer from '@/pages/BigPlatform/NewUnitFireControl/Section/FaultMessageDrawer';
import old_FireFlowDrawer from '@/pages/BigPlatform/NewUnitFireControl/Section/FireFlowDrawer';
import old_SmokeFlowDrawer from '@/pages/BigPlatform/NewUnitFireControl/Section/SmokeFlowDrawer';
import old_OnekeyFlowDrawer from '@/pages/BigPlatform/NewUnitFireControl/Section/OnekeyFlowDrawer';
import old_GasFlowDrawer from '@/pages/BigPlatform/NewUnitFireControl/Section/GasFlowDrawer';

// const AlarmDynamicDrawer = <old_AlarmDynamicDrawer drawerTitle="报警处理动态" head={DynamicDrawerTop} />
// const FaultMessageDrawer = <old_FaultMessageDrawer drawerTitle="故障处理动态" head={DynamicDrawerTop} />
const FireFlowDrawer=<old_FireFlowDrawer head={DynamicDrawerTop} />
const SmokeFlowDrawer=<old_SmokeFlowDrawer head={DynamicDrawerTop} />
const OnekeyFlowDrawer=<old_OnekeyFlowDrawer head={DynamicDrawerTop} />
const GasFlowDrawer=<old_GasFlowDrawer head={DynamicDrawerTop} />

export {
  // AlarmDynamicDrawer,
  // FaultMessageDrawer,
  FireFlowDrawer,
  SmokeFlowDrawer,
  OnekeyFlowDrawer,
  GasFlowDrawer,
}
