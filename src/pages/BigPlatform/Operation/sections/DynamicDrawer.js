import DynamicDrawerTop from '@/pages/BigPlatform/Operation/components/DynamicDrawerTop';
import old_AlarmDynamicDrawer from '@/pages/BigPlatform/NewUnitFireControl/Section/AlarmDynamicDrawer';
import old_FaultMessageDrawer from '@/pages/BigPlatform/NewUnitFireControl/Section/FaultMessageDrawer';


const AlarmDynamicDrawer = <old_AlarmDynamicDrawer drawerTitle="报警处理动态" head={DynamicDrawerTop} />
const FaultMessageDrawer = <old_FaultMessageDrawer drawerTitle="故障处理动态" head={DynamicDrawerTop} />

export {
  AlarmDynamicDrawer,
  FaultMessageDrawer,
}
