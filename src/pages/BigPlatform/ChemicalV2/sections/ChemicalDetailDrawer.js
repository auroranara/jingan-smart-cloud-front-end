import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './ChemicalDetailDrawer.less';
import { CardItem } from '../components/Components';

const basicList = [
  {
    name: '氯',
    cas: '7782-50-5',
    type: '急性毒性物质',
    acture: '6t',
    store: '氯气气柜（1号楼1车间）',
    isPoison: '是',
    isEasy: '否',
  },
];
const basicFields = [
  { label: '化学品名称', value: 'name' },
  { label: 'CAS号', value: 'cas' },
  { label: '危险性类别', value: 'type' },
  { label: '实际存储量', value: 'acture' },
  { label: '存储场所', value: 'store' },
  { label: '是否剧毒化学品', value: 'isPoison' },
  { label: '是否易制毒', value: 'isEasy' },
];

export default class ChemicalDetailDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visible, onClose } = this.props;
    const {} = this.state;

    return (
      <DrawerContainer
        // title="重大危险源监测"
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1322}
        left={
          <div className={styles.container}>
            <div className={styles.title} style={{ marginTop: 0 }}>
              基本信息：
            </div>
            {basicList.map((item, index) => (
              <CardItem key={index} data={item} fields={basicFields} />
            ))}
            <div className={styles.title}>安全措施：</div>
            <div className={styles.content}>
              <div className={styles.subTitle}>【一般要求】</div>
              操作人员必须经过专门培训，严格遵守操作规程，熟练掌握操作技能，具备应急处置知识。
              <br />
              严加密闭，提供充分的局部排风和全面通风，工作场所严禁吸烟。提供安全淋浴和洗眼设备。
              <br />
              生产、使用氯气的车间及贮氯场所应设置氯气泄漏检测报警仪，配置两套以上重型防护服。戴化学安全防护眼镜，穿防静电工作服，戴防化学品手套。工作场所浓度超标时，操作人员必须戴防毒面具，紧急事态抢救或撤离时应佩戴正压自给式空气呼吸器。
              <br />
              液氯汽化器、储罐等压力容器和设备应设置安全阀、压力表、液位计、温度计，并应装有带压力、液位、温度带远传记录和报警功能的安全装置。设置整流装置与氯压机、动力电源、管线压力、通风设施或相应的吸收装置的联锁装置。氯气输入、输出管线应设置紧急切断设施。
              <br />
              避免与易燃或可燃物、醇类、乙醚、氢接触。
              <br />
              生产、储存区域应设置安全警示标志。搬运时轻装轻卸，防止钢瓶及附件破损。吊装时，应将气瓶防止在符合安全要求的专用框中进行吊运。禁止使用电磁起重机和用链绳捆扎、或将瓶阀作为吊运着力点。配备相应品种和数量的消防器材及泄露应急处理设备。倒空的容器可能存在残留有害物时应及时处理。
              <br />
              <div className={styles.subTitle}>【特殊要求】</div>
              <div className={styles.subTitle}>【操作安全】</div>
              （1）氯化设备、管道处、阀门的连接垫料应选用石棉板、石棉橡胶板、氟塑料、浸石墨的石棉绳等高强度耐氯垫料，严禁使用橡胶垫。
              <br />
              （2）采用压缩空气充装液氯时，空气含水应0.01%。采用液氨气化器充装液氨时，只许用温水加热气化器，不准使用蒸汽直接加热。
              <br />
              （3）液氯气化器、预冷器及热交换器等设备，必须装有排污装置和污物处理设置，并定期分析三氯化氮含量。如果操作人员未按规定及时排污，并且操作不当，易发生三氯化氮爆炸、大量氯气泄漏等危害。
              <br />
              （4）严禁在泄露的钢瓶上喷水。
              <br />
              （5）充装量未50kg和100kg的气瓶应保留2kg以上的余量，充装量未500kg和1000kg的气瓶应保留5kg以上的余量。充装前要确认气瓶内无异物。
              <br />
              （6）充装时，使用万向节管道充装系统，严防超装。
              <br />
              <div className={styles.subTitle}>【储存安全】</div>
              （1）储存于阴凉、通风仓库内，库房温度不宜超过30℃，相对湿度不超过80%，防止阳光直射。
              <br />
              （2）应与易（可）燃物、醇类、食用化学品分开存放，切记混储。储罐远离火种、热源。保持容器密封，储存区要建在低于自然地面的围堤内。气瓶储存时，空瓶和实瓶应分开放置，并应设置明显标志。储存区应备有泄露应急处理设备。
              <br />
              （3）对于大量使用氯气钢瓶的单位，为及时处理钢瓶漏气，现场应备应急堵漏工具和个体防护用具。
              <br />
              （4）禁止将储罐设备及氯气处理装置设置在学校、医院、居民区等人口稠密区附近，并远离频繁出入处和紧急通道。
              <br />
              （5）应严格执行剧毒化学品双人收发，双人保管制度。
              <br />
              <div className={styles.subTitle}>【运输安全】</div>
              （1）运输车辆应有危险货物运输标志、安装具有行驶记录功能的卫星定位装置。未经公安机关批准，运输车辆不得进入危险化学品车辆限制通行的区域。不得在人口稠密区和有明火等场所停靠。夏季应早晚运输，防止日光曝晒。
              <br />
              （2）运输液氯钢瓶的车辆不准从隧道过江。
              <br />
              （3）汽车运输充装量50KG及以上钢瓶时，应卧放，瓶阀端应朝向车辆行驶的右方。用三角木垫卡牢，防止滚动，垛高不得超过2层且不得超过车厢高度。不准同车混装有抵触性质的物品和让无关人员搭车。严禁与易燃物或可燃物、醇类、食用化学品等混装混运。车上应有应急堵漏工具和个体防护用品，押运人员应会使用。
              <br />
              （4）搬运人员必须注意防护，按规定穿戴必要的防护用品；搬运时，管理人员必须到现场监卸监装；夜晚或光线不足时、雨天不宜搬运。若遇特殊情况必须搬运时，必须得到部门负责人的同意，还应有遮雨等相关措施；严禁在搬运时吸烟。
              <br />
              （5）采用液氨气化法向储罐压送液氨时，要严格控制气化器的压力和温度，釜式气化器加热夹套不得包底，应用温水加热，严禁用蒸汽加热，出口水温不应超过45℃，气化压力不得超过1MPa。
              <br />
            </div>

            <div className={styles.title}>应急处置措施：</div>
            <div className={styles.content}>
              <div className={styles.subTitle}>【泄漏应急处置】</div>
              根据气体扩散的影响区域划定警戒区，无关人员从侧风、上风向搬离至安全区。建议应急处理人员穿内置正压自给式空气呼吸器的全封闭防化服，戴橡胶手套。如果是液体泄漏，还应注意防冻伤。禁止解除或跨越泄漏物。勿使泄漏物与可燃物质（如木材、纸、油等）接触。尽可能切断泄露源。喷雾状水抑制蒸气或改变蒸气云流向，避免水流解除泄漏物。禁止用水直接冲击泄漏或泄露源。若可能翻转容器，使之逸出气体而非液体。防止气体通过下水道、通风系统和限制性空间扩散。构筑围堤堵截液体泄漏物。喷稀碱液中和、稀释。隔离泄漏区直至气体散尽。泄漏场所保持通风。
              <br />
              不同泄漏情况下的具体措施：
              <br />
              瓶阀密封填料处泄漏时，应查压紧螺帽是否松动或拧紧压紧螺帽；瓶阀出口泄漏时，应查瓶阀是否关紧或关紧瓶阀，或用铜六角螺帽封闭瓶阀口。
              <br />
              瓶体泄漏点为孔洞，可使用堵漏器材（如竹签、木塞、止漏器等）处理，并注意对堵漏器材紧固，防止脱落。上述处理均无效时，应迅速将泄漏气瓶浸没于备有足够体积的烧碱或石灰水溶液吸收池进行无害化处理，并控制吸收液温度不高于45℃、PH不小于7，防止吸收液失效分解。
              <br />
              隔离与疏散距离：小量泄漏，初始隔离60m，下风向疏散白天400m、夜晚1600m；大量泄漏，初始隔离600m，下风向疏散白天3500m、夜晚8000m。
              <br />
            </div>
          </div>
        }
      />
    );
  }
}
