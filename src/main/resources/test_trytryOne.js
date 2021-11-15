/*
 * 由ZCY01二次修改：脚本默认不运行
 * 由 X1a0He 修复：依然保持脚本默认不运行
 * 如需运行请自行添加环境变量：JD_TRY，值填 true 即可运行
 * TG交流群：https://t.me/jd_zero205
 * TG通知频道：https://t.me/jd_zero205_tz
 *
 update 2021/09/05
 京东试用：脚本更新地址 https://github.com/zero205/JD_tencent_scf/raw/main/jd_try.js
 脚本兼容: Node.js
 每天最多关注300个商店，但用户商店关注上限为500个。
 请配合取关脚本试用，使用 jd_unsubscribe.js 提前取关至少250个商店确保京东试用脚本正常运行。
 *
 * X1a0He留
 * 由于没有兼容Qx，原脚本已失效，建议原脚本的兼容Qx注释删了
 * 脚本是否耗时只看args_xh.maxLength的大小
 * 上一作者说了每天最多300个商店，总上限为500个，jd_unsubscribe.js我已更新为批量取关版
 * 请提前取关至少250个商店确保京东试用脚本正常运行
 * 没有写通知，是否申请成功没有进行通知，但脚本会把状态log出日志
 */
let showDate = [0,1,12,13,17,18]
let dingtalk = "https://oapi.dingtalk.com/robot/send?access_token=d2b6042cb38f0df63e20797c002208d2710104750c18a1dc84d54106a859a3f0"
let dingtalk1 = "https://oapi.dingtalk.com/robot/send?access_token=a3e80da6f064321881fc38e43a07bfde7a61b6f18245454520fb749556cebfcd"
let dingtalk2 = "https://oapi.dingtalk.com/robot/send?access_token=1832f969da101ef8273e8ba2258f06f15ec34bc22282066b28ab617042a7a9b6"
let getManName = ""
let totalPages = 999999 //总页数
const $ = new Env('京东试用')
let roleMap = {
  "jd_4521b375ebb5d": "锟子怪",
  "jd_542c10c0222bc": "康子怪",
  "jd_66dcb31363ef6": "涛子怪",
  "jd_45d917547c763": "跑腿小怪",
  "417040678_m": "斌子怪",
  "jd_73d88459d908e": "杰杰子",
  "381550701lol": "漪漪子",
  "jd_4333d5dc1ac5f": "舒楠子",
  "jd_66ea783827d30": "军子",
  "jd_4311ac0ff4456": "居子",
  "realm_":"泽子怪"
}

const URL = 'https://api.m.jd.com/client.action'
let trialActivityIdList = []
let sensMessage = "试用\n\n"
let trialActivityTitleList = []
let notifyMsg = ''
let message = ""
let minItemValue = 500
let wordLength = 1000
let process = {
  env: {
    "JD_TRY": "true"
  }
}
// default params
let args_xh = {
  channelEnd: Math.floor(Math.random() * (4) + 3),
  channel: [1, 2, 3, 4, 5, 10, 12, 15],
  maxSize: 15,
  listCount: 0,
  /*
   * 是否进行通知
   * 可设置环境变量：JD_TRY_NOTIFY
   * */
  //     isNotify: process.env.JD_TRY_NOTIFY || true,
  // 商品原价，低于这个价格都不会试用
  jdPrice: 15,
  /*
   * 获取试用商品类型，默认为1
   * 1 - 精选
   * 2 - 闪电试用
   * 3 - 家用电器(可能会有变化)
   * 4 - 手机数码(可能会有变化)
   * 5 - 电脑办公(可能会有变化)
   * 可设置环境变量：JD_TRY_TABID
   * */
  // TODO: tab ids as array(support multi tabIds)
  // tabId: process.env.JD_TRY_TABID && process.env.JD_TRY_TABID.split('@').map(Number) || [1],
  tabId: process.env.JD_TRY_TABID || 1,
  /*
   * 试用商品标题过滤
   * 可设置环境变量：JD_TRY_TITLEFILTERS，关键词与关键词之间用@分隔
   * */
  titleFilters: ["胖大海","菊花茶","手机充电线","刺梨糕","苦荞茶","拌饭海苔","丁香茶","吸油纸","晚安茶","金属合金","手电","宿便","纤维素","玛咖茶","书法", "决明子", "钢化膜", "保护贴膜", "手机壳", "自拍杆", "养生茶", "玉米须", "栀子茶", "黑芝麻丸", "赛柏瑞斯", "玫瑰花茶", "品雅有机茶", "雷气日式", "先徽葱油", "德生源氨基酸洗发水", "决明子茶", "悠悠球", "人参五宝茶", "遥控器", "蒲公英茶", "烘焙纸杯", "称斤积木", "拨浪鼓", "打包袋子", "按摩球", "帆睿", "登山包", "抵用券", "急救箱", "染头发膏", "变唇膏", "弹力带", "儿童零食", "儿童剪头发工具", "平剪牙剪刀打薄剪刀", "刘海内扣直发器", "益生菌小E条漱口水", "二锅头", "魔法士干脆面方便面24袋整箱装", "樱の色鱼子酱", "轻酸瓶3%", "青汁", "隔离霜", "去枣核", "川品社", "矶钓钓鱼配件", "棉线结矶杆", "半圆滑漂挡", "远投路滑配件", "滑漂座", "软电线", "激光剑", "灭鼠", "思维棋", "双层片", "猫用", "鼻腔喷雾", "电脑包", "鸥曼GTL", "卧铺毛毯", "双导向", "翻页笔", "蛋白肽", "T口弯头", "货车用品", "床垫套", "电焊护脚", "G100", "擦车清洁工具", "掸子", "射灯", "欧布圣剑", "超比乐", "滚梳直柄", "凝胶糖果", "DHA藻油", "水带", "摘果神器", "宝宝儿童零食", "总复习", "满分冲刺", "黄冈", "小状元", "钓鱼插件", "寒假作业", "作业", "菜罩", "手机线", "美容油", "贺卡", "眼贴", "小斗篷", "小孩子演奏", "砍柴刀", "消防应急灯", "食用色素", "烘焙彩针糖果", "德尔地板", "水管保温套", "水管道", "定位器", "追踪器", "电瓶", "快递纸箱", "尤克里里", "金龙鱼 面条挂面", "痛风", "KVM切换器", "水泥", "猫罐头", "去斑霜", "0-12岁", "4/3膜", "FMJ", "H10E", "HDMI", "HEISHA", "HPV", "KB216有线键盘", "LED", "MS116 有线鼠标", "N1162有线鼠标", "Ockered", "PVC板", "SD", "SD卡", "SMOVES", "SUP掌机", "U盘", "VGA", "hdmi", "hpv", "led开关电源", "uv镜", "win10", "windows", "一次性", "一片装", "一盒", "万向滑轮", "万用表", "万藓灵", "三角阀", "三轮车", "不干胶标签带", "专升本", "专用贴", "丝袜", "中国电信", "中国结", "中央扶手箱", "中性水笔", "中性笔", "中老年", "丰胸", "串珠玩具", "丸", "乒乓球", "九九乘法", "九九乘除", "书包", "乳液", "乳腺", "交换", "交换机", "产品体验", "享底价", "亲子互动", "亿优信", "仓鼠零食", "仿真小蛋糕", "伊威", "优盘", "会员", "会员卡", "会议杯子", "会议记录", "传菜铃", "体温计", "体验装", "侧挂式", "便秘", "保健", "保护壳", "保护套", "保护膜", "保护镜", "保暖女裤", "保暖裤", "保温棉", "保鲜膜", "信封", "信纸", "修护", "修正带", "修眉", "修眉剪", "倒车", "倒车镜", "假发", "假睫毛", "停车牌", "健康检测", "储奶袋", "儿童n95", "儿童串珠玩具", "儿童乐园", "儿童便捷", "儿童保温水杯", "儿童医生", "儿童口罩", "儿童吸管", "儿童奶粉", "儿童成长", "儿童拌饭", "儿童暖暖套", "儿童椅子", "儿童沐浴露", "儿童牙膏", "儿童玩具枪", "儿童电动牙刷", "儿童电话手表", "儿童益生菌", "儿童磨牙饼", "儿童背包", "儿童随身", "儿童雨伞", "充电头", "充电桩", "光和青春", "光驱", "免钉胶水", "八倍镜", "公主项链", "公文包", "养芝堂", "内胆包", "内衣", "内裤", "冰箱贴", "冰袋", "冷兵器", "冷凝胶", "冷敷贴", "冻干粉", "净水剂", "减关镜", "减肥", "凳子套", "刀头", "刀片", "分流", "分流器", "分线盒", "切割片", "切菜板", "创可贴", "刨木", "别针", "刮痧", "刮痧板", "刷头", "刷子", "刷牙头", "刹车油", "刺激贴", "剂", "剃须刀配件", "削皮刀", "前列腺", "剥虾", "剪", "剪钳", "割草机", "办公会议茶杯", "办公宝", "办公杯", "加密狗", "加温器", "勿拍", "包皮", "包装膜", "化妆", "匙扣", "医生", "半身不遂", "半身裙", "单拍不发货", "卡册", "卡套", "卡尺", "卡托", "卡牌", "卡针", "卧铺垫", "卸妆", "卸妆水", "压差表", "压片", "去毛器", "去角质", "参肽片", "双面板", "反光条贴", "反光板", "反光贴", "反光镜", "反弹器", "变身器", "口琴", "口红", "口罩", "口罩盒", "口腔", "口腔抑菌", "口香糖", "台灯", "台账本", "号码卡", "吃饭衣", "合成机油", "同仁堂", "后膜", "启动电源", "吸奶器", "吸顶灯", "告知牌", "周岁", "呼噜", "咖啡豆", "咬钩", "咽炎", "哑光", "哨", "哺乳", "哺乳套装", "唇釉", "唑溶液", "商务休闲", "啪啪", "喷壶", "喷雾器", "嚼片", "园艺工具", "围兜", "围裙", "固定器", "图钉", "圆珠笔", "土工布", "圣杯", "在线直播", "地吸", "地桩", "地漏", "地面清洁液", "坐便器", "坐便椅", "坐垫", "坐骨膏", "垃圾处理器", "垃圾袋", "垫片", "培训", "塑料士兵小军人玩具", "塑料杯", "塑身裤", "塔菲克", "墙纸", "增生贴", "增高", "墨块", "墨条", "墨水", "墨盒", "墨粉", "墨镜", "壁纸", "声卡套装", "复合肥", "外用", "多功能尺子", "多色笔", "大头围", "天线", "头皮", "夹", "女士内裤", "女士内裤，少女内裤", "女童裤子", "女童靴子", "奶瓶", "奶粉", "如意碗", "妆", "妇女", "婴儿", "婴幼儿", "孔明锁", "孕妇装", "存储卡", "学习卡", "学历", "学生文具", "孩儿乐", "安全帽", "安全裤", "安全锤", "定位器", "定做", "定做榻榻米", "定制", "宝塔糖", "宝宝口罩", "宝宝奶粉", "宝宝成长", "宝宝灯笼裤", "宝宝牙刷", "宝宝玩具车", "宝宝霜", "宝宝鞋子", "宝珠笔", "实验课", "宠物", "宣纸", "宫颈炎", "密封条", "密封袋", "密码锁", "富贵包", "对接头", "导购", "封口机", "小兔女士", "小勺子", "小塔糖", "小学", "少儿读物", "尤尖锐湿疣", "尺", "尼龙管", "尼龙网", "尿", "尿素", "尿素霜", "屏幕膜", "屏蔽袋", "屏风", "工作手册", "工作服", "巾", "布袋", "帽子", "幕布", "干洗剂", "干眼症", "干裂", "平光镜", "平衡线", "幼儿", "幼儿园", "幼儿配方", "床头台灯", "底座", "座垫", "座套", "康复", "延时", "延迟", "延迟喷雾", "延长器", "开果器", "弹力绳", "弹簧", "彩带", "彩铅", "徽墨", "情趣", "惯性小汽车", "成人票", "成长裤", "戒奶嘴", "戒烟", "手册", "手动幕", "手套", "手工DIY", "手工黏土", "手推车", "手提秤", "手术刀", "手机卡", "手机壳", "手机维修", "手电筒", "打包绳", "打印机碳带", "打底", "打草绳", "打虫糖", "打钉枪", "打飞机", "托盘", "扩音器", "扭扭车", "把手", "抑菌膏", "抓周", "抓痒器", "投屏器", "投影仪包", "折叠锯子", "抚奶嘴", "抛光机", "护具", "护手霜", "护栏", "护理", "护眼贴", "护肤", "护腕", "护腿套", "护膝", "护踝", "报警器", "抬头纹", "抵用券", "抽屉轨道", "抽水器", "拉力器", "拉力绳", "拉柳枪", "拐杖", "拔毒膏", "拾音器", "挂篓", "挂绳", "挂钟", "挂钩", "指套", "挑逗", "挡风板", "挡风玻璃", "挤奶器", "捆扎绳", "捆绑绳", "损伤膏贴", "掏耳", "掏耳朵", "排气扇", "接线式直管", "提示牌", "提词器", "插座", "插销", "握力器", "摄像头", "摄像头膜", "摄像头镜片", "摄影灯", "摆件车模", "摇步器", "撑衣杆", "擦玻璃", "擦窗", "擦银布", "收敛水", "收藏册", "收钱码", "收银机", "改光膜", "效果图", "敏感", "敏肌", "救生衣", "教具", "教学", "教学视频", "教材", "教育", "数据线", "整理棒", "文胸", "斗笔", "断奶", "方向盘", "方向盘套", "日历", "早教", "替换头", "月子", "有机肥", "木糖醇", "机油", "机顶盒", "材料包", "条码", "枇杷秋梨膏", "枇杷膏", "枇杷雪梨膏", "枕头套", "架", "染发", "染发剂", "柔肤水", "柜吸", "栅网", "标志牌", "标签纸", "标识牌", "树苗", "样板盒", "格子长袖", "框", "桌垫", "梯", "梯子", "梳子", "棉袜", "棒棒糖", "棒球", "椅子套", "椅背置物袋", "模具", "止痒", "死皮", "母乳", "毛囊", "毛孔", "气压杆", "气垫霜", "气雾棒", "水乳", "水凝膜", "水勺", "水平仪", "水晶头", "水晶泥", "水枪", "水龙头", "汤勺", "汤盅", "汽油锯", "汽车头枕腰靠套装", "汽车尾部挂件", "汽车摆件", "汽车椅背", "汽车脚垫", "沉香", "沐浴包", "油壶", "油漆", "油罐", "泡沫", "泡沫胶", "泡泡纸", "泡澡球", "泥灸", "注射器", "注射针", "泳衣", "洁面", "洋娃娃", "洗地专用", "洗地液", "洗面", "洗鼻器", "流量卡", "测电笔", "测评", "测试", "浮标", "浮漂", "涂鸦贴纸", "消化不良", "消化道出血", "消毒", "消毒液", "消防水带", "润唇膏", "润滑", "润滑液", "润颜乳", "清水剂", "清洁刷", "清洁套装", "清洁液", "清洁球", "清洁软胶", "清洁配件", "渔具", "温度计", "湿手器", "湿粮", "滋养霜", "滑块袋", "滑板车", "滤杯", "滤网", "滤芯", "滤镜", "漆", "漱口水", "潜水服", "火花塞", "灭蝇", "灯泡", "灶台贴纸", "炎膏贴", "炖盅", "烧水棒", "热敷包", "热熔胶枪", "煤油", "燃气报警器", "爬爬垫", "爸爸装", "爸爸鞋", "爽肤水", "牙刷", "牙刷头", "牙刷收纳盒", "牙刷替换头", "牙套", "牙签", "牙签盒", "牙签防水", "牙线", "牙膏", "牛仔裤", "牛舌", "牵引器", "犬粮", "狗狗沐浴露", "狗皮膏", "狗粮", "狗链", "狗零食", "猪油", "猫咪", "猫咪玩具", "猫玩具", "猫砂", "猫粮", "玉米粉", "玛咖片", "玩具女孩", "玻尿酸", "玻珠", "玻珠幕", "玻璃", "玻璃吊", "玻璃胶", "玻璃镜片", "玻璃防雾剂", "球帽", "球拍", "理发器", "理发推", "理疗贴", "琴弦", "瑶浴粉", "瓜刨", "用友", "甲醛", "电子秤", "电容笔", "电池", "电源线", "电磨组套", "电缆剪", "电脑电源", "电视遥控器", "电话卡", "电话牌", "电钻", "电风扇罩", "男士用品", "男童", "番茄丁", "疣", "疮", "痉挛", "痔疮", "瘙痒", "白板笔", "白酒", "百日宴", "百褶", "皮套", "皮带", "皮筋枪", "益生菌", "监狱", "盘香", "眉笔", "真空袋", "眼影", "眼线笔", "眼罩", "眼药水", "眼袋", "眼镜", "眼霜", "睡眠片", "睡裤", "睫毛", "矫正", "矫正器", "矫正带", "短裙", "砂盆", "砂纸", "砂锅", "砍菜刀", "硅胶", "硬笔", "碎发", "碟子", "碳粉", "磨砂壳", "磨脚", "磨脚石", "示宽灯", "祛斑霜", "祛疤", "神经痛贴", "神露", "福来油", "私处", "秋梨膏", "移动wifi", "空气滤芯", "空调滤", "空调罩", "空调遥控器", "窗帘", "竖笛", "童装", "童装男女童", "笔槽", "笼子", "筋骨贴", "筒灯", "筷子", "签字笔", "米小芽", "类纸膜", "粉刺", "粉底", "粉扑", "粉扑盒子", "粉饼", "精华", "精华乳", "精华露", "精油", "糖糖粉", "素颜霜", "红包封", "红包袋", "红绳", "红花手套", "纱窗", "纱网", "纳米砖", "纸尿裤", "纹眉", "纹眉色料", "线上", "线上课程", "练字", "细纹霜", "绑带", "绘图板", "维修", "维生素", "绷带", "绿幕", "绿草皮", "网卡", "网线", "美容棒", "美容院", "美工刀", "美工笔", "美甲", "美缝", "美肌霜", "美胸", "羽毛球", "翻分器", "翻板钩", "翻身", "老人用品", "老式鸣笛", "老爷车", "老花", "考", "耐火泥", "耳罩", "耳钉", "职业装", "肥佬", "肥料", "育苗盘", "背心马甲", "背膜", "胖子", "胶囊", "胶带", "胸包", "胸针", "脖套", "脚垫", "脱发", "脱毛", "腋毛", "腋毛神器", "腮红", "腰带", "腰椎突出", "腰肌劳损", "膝盖贴", "臂力器", "自弹器", "自慰", "自拍杆", "舒缓水", "色料", "艾叶", "艾条", "艾灸贴", "艾绒贴", "艾胜者", "艾脐贴", "艾草", "芦荟", "花洒", "花瓶", "花萃", "苍蝇拍", "苍蝇药", "茗杯", "茶具", "茶勺", "茶壶", "茶宠", "茶杯", "莆田官网", "菊粉", "菲妮小熊", "葛根", "虾青素", "蚊帐", "蚊香", "蚯蚓粪", "蟑螂药", "行车记录仪", "补光灯", "补发", "补墙", "补水", "表带", "衬衫", "袖套", "袜子", "裁纸刀", "装修", "裤", "裤头", "裸妆", "褪黑素", "西汀片", "覆盖膜", "视线盲区贴纸", "视频mv", "视频教程", "角磨机", "角阀", "解码线", "触控笔", "警示牌", "订书机", "训练器", "评估检测", "试听课", "试用装", "请勿下单", "课", "调音器", "购物券", "购物袋", "贴布", "贴纸", "贴膜", "赠品", "起雾棒", "足浴粉", "趴趴枕", "跳绳", "身体乳", "车内清洁", "车漆", "车篓子", "车轮", "车载u盘", "车锁", "轨道", "转换", "转换器", "转接", "轮胎", "轮胎专用胶水", "软糖", "软膏", "辅食", "输精管", "过家家", "过滤棉", "运势书", "运费专拍", "连衣裙", "适配", "适配器", "逍遥马", "透气贴", "通体砖", "遮挡布", "遮瑕", "遮瑕膏", "避光垫", "避孕套", "酒", "酵素", "金刚胶", "金属探测", "金属探测器", "针头", "钉子", "钓鱼手竿", "钙咀嚼片", "钙片", "钢丝", "钢丝球", "钢化膜", "钢化蛋", "钢笔", "钥匙扣", "钳", "铁丝", "铅笔", "铆管", "锁头", "锁精环", "锅铲", "键盘垫", "锯条", "锯片", "镜头膜", "镜头贴", "镜片", "镰刀", "长筒", "长筒袜", "门吸", "门帘", "门把手", "门档", "门槛条", "门锁", "闹钟", "防卫尖刺", "防撞条", "防晒乳", "防晒霜", "防水敷贴", "防水涂料", "防滑垫", "防疫", "防疫包", "防疫香包", "防蚊裤", "防裂膏", "防静电", "阴囊", "阴部", "陀螺", "陈皮鸡", "降葵花盘", "除菌洗地液", "陶瓷瓶", "隔热板", "隔热棉", "隔离网", "隔音耳塞", "雕刻工具", "雨刮", "雨披", "雨衣", "露指", "青春痘", "静电", "静脉曲张", "静音阻尼", "非卖品", "靠背收纳袋", "面碗", "面罩", "面膜", "面酱", "面霜", "鞋", "鞋垫", "鞋带", "音频线", "领带", "领结", "额头贴", "风水鱼", "风湿贴", "飞机杯", "食盐", "饭盒", "饲料", "香囊袋", "香薰", "香薰精油", "马丁靴", "马桶刷", "马桶垫", "驱虫", "高升专", "高清配件", "魔法棒", "鱼竿", "鱼线", "鱼缸", "鱼钩", "鱼饵", "鸡毛掸子", "鸭肠", "鸳鸯锅", "鹿鞭", "麦克风", "黄膏贴", "黄金卡", "黑头", "黑沙", "黑色水笔", "鼠标垫", "鼠标手", "鼻头", "鼻影", "鼻毛", "鼻毛器", "鼻炎", "龟头"],
  // 试用价格(中了要花多少钱)，高于这个价格都不会试用，小于等于才会试用
  trialPrice: 0,
  /*
   * 最小提供数量，例如试用商品只提供2份试用资格，当前设置为1，则会进行申请
   * 若只提供5分试用资格，当前设置为10，则不会申请
   * 可设置环境变量：JD_TRY_MINSUPPLYNUM
   * */
  minSupplyNum: 20,
  /*
   * 过滤大于设定值的已申请人数，例如下面设置的1000，A商品已经有1001人申请了，则A商品不会进行申请，会被跳过
   * 可设置环境变量：JD_TRY_APPLYNUMFILTER
   * */
  applyNumFilter: process.env.JD_TRY_APPLYNUMFILTER || 99999,
  /*
   * 商品试用之间和获取商品之间的间隔, 单位：毫秒(1秒=1000毫秒)
   * 可设置环境变量：JD_TRY_APPLYINTERVAL
   * */
  applyInterval: process.env.JD_TRY_APPLYINTERVAL || 5000,
  /*
   * 商品数组的最大长度，通俗来说就是即将申请的商品队列长度
   * 例如设置为20，当第一次获取后获得12件，过滤后剩下5件，将会进行第二次获取，过滤后加上第一次剩余件数
   * 例如是18件，将会进行第三次获取，直到过滤完毕后为20件才会停止，不建议设置太大
   * 可设置环境变量：JD_TRY_MAXLENGTH
   * */
  maxLength: 10

}

!(async () => {
  // console.log(`\n本脚本默认不运行，也不建议运行\n如需运行请自行添加环境变量：JD_TRY，值填：true\n`)
  await $.wait(1000)
  if (process.env.JD_TRY && process.env.JD_TRY === 'true') {
    await requireConfig()
    if (!$.cookiesArr[0]) {
      $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
        "open-url": "https://bean.m.jd.com/"
      })
      return
    }
    for (let i = 0; i < $.cookiesArr.length; i++) {
      message += "<font color=\'#FFA500\'>[通知] </font><font color=\'#006400\' size='3'>随机试用</font> \n\n --- \n\n"
      await $.wait(Math.floor(Math.random() * (175000) + 5000));
      if ($.cookiesArr[i]) {
        $.cookie = $.cookiesArr[i];
        $.UserName = decodeURIComponent($.cookie.match(/pt_pin=(.+?);/) && $.cookie.match(/pt_pin=(.+?);/)[1])
        $.index = i + 1;
        $.isLogin = true;
        $.nickName = '';
        await totalBean();
        console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
        if (!$.isLogin) {
          $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
            "open-url": "https://bean.m.jd.com/bean/signIndex.action"
          });
          await $.notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
          continue
        }


        //下一个要重新去拉列表
        trialActivityIdList = []
        trialActivityTitleList = []
        args_xh.listCount = 0
        message = ""
        totalPages == 999999
        username = $.UserName

        //走另外的途径另外处理
        if ($.UserName == "jd_66ea783827d30" || $.UserName == "jd_45d917547c763" || $.UserName == "jd_4311ac0ff4456") {
          getManName = roleMap[username]
          message = message + "<font color=\'#778899\' size=2>【羊毛姐妹】<font color=\'#FFA500\' size=3>" + username + " </font> </font> \n\n "
          await try_MyTrials(1, 2)    //申请成功的商品
          await showMsg()
          postToDingTalk(message)
          continue
        }

        if (roleMap[username] != undefined) {
          username = roleMap[username]
        }

        getManName = username
        args_xh.maxLength = Math.floor(Math.random() * (20) + 10)
        let list = getList()
        //加上名称
        message = message + "<font color=\'#778899\' size=2>【羊毛姐妹】<font color=\'#FFA500\' size=3>" + username + " </font> </font> \n\n "
        message = message + "<font color=\'#778899\' size=2>" + "数量大小:" + args_xh.maxLength + "申请列表：" + list + "</font> </font> \n\n "

        $.totalTry = 0
        $.totalSuccess = 0
        let size = 1;

        m = i
        for (let i = 0; i < list.length; i++) {
          args_xh.maxSize = Math.floor(Math.random() * (30) + 10)
          message = message + "<font color=\'#FF0000\' size=2>" + "最大列表长度：" + args_xh.maxSize + "  申请列表：" + list[i] + "</font> </font> \n\n"
          while (args_xh.listCount + trialActivityIdList.length < args_xh.maxLength && size < args_xh.maxSize && size < totalPages - 1) {
            console.log(`\n正在进行第 ${size} 次获取试用商品\n`)
            console.log(`\n当前产品页面总长度为${totalPages} 页\n`)
            await try_feedsList(list[i], size++)
            if (m == 3 && sensMessage.length > wordLength) {
              console.log("-----------------------------------")
              console.log("-----------------------------------")
              console.log("-----------------------------------")
              console.log("-----------------------------------")
              console.log("-----------------------------------")
              console.log("-----------------------------------")
              console.log("-----------------------------------")
              postToDingTalk1(sensMessage)
              sensMessage = "试用\n\n"
            } else {
              console.log("------------清空------------")
              console.log("------------清空------------")
              sensMessage = "试用\n\n"
            }
            if (args_xh.listCount + trialActivityIdList.length < args_xh.maxLength) {
              args_xh.applyInterval = Math.floor(Math.random() * (4000) + 5000)
              console.log(`间隔延时中，请等待 ${args_xh.applyInterval} ms`)
              await $.wait(args_xh.applyInterval);
            }
          }
          args_xh.listCount += trialActivityIdList.length
          console.log("正在执行试用申请...")
          await $.wait(args_xh.applyInterval);
          for (let i = 0; i < trialActivityIdList.length; i++) {
            args_xh.applyInterval = Math.floor(Math.random() * (4000) + 5000)
            await try_apply(trialActivityTitleList[i], trialActivityIdList[i])
            console.log(`间隔延时中，请等待 ${args_xh.applyInterval} ms\n`)
            await $.wait(args_xh.applyInterval);
          }
          message = message + "<font color=\'#33ff00\' size=2>" + "本循环申请数量：" + trialActivityIdList.length + "总量限制为：" + args_xh.listCount + "</font> </font> \n\n "
          trialActivityIdList = []
          trialActivityTitleList = []
          size = 1
          totalPages == 999999
        }


        console.log("试用申请执行完毕...")

        // await try_MyTrials(1, 1)    //申请中的商品
        await try_MyTrials(1, 2)    //申请成功的商品
        // await try_MyTrials(1, 3)    //申请失败的商品
        await showMsg()
        //下一个要重新去拉列表
        trialActivityIdList = []
        trialActivityTitleList = []
        await $.wait(Math.floor(Math.random() * (15000) + 5000));
      }

      args_xh.listCount = 0
      postToDingTalk(message)
      message = ""
      totalPages == 999999
    }
    await $.notify.sendNotify(`${$.name}`, notifyMsg);
  } else {
    console.log(`\n您未设置运行【京东试用】脚本，结束运行！\n`)
  }
})().catch((e) => {
  postToDingTalk(e + message)
  console.log(`❗️ ${$.name} 运行错误！\n${e}`)
}).finally(() => {
  $.done()
})

function getList() {
  for (i = 0; i < Math.floor(Math.random() * (5001) + 500); i++) {
    index1 = Math.floor(Math.random() * (args_xh.channel.length) + 0)
    index2 = Math.floor(Math.random() * (args_xh.channel.length) + 0)
    temp = args_xh.channel[index1]
    args_xh.channel[index1] = args_xh.channel[index2]
    args_xh.channel[index2] = temp
  }

  return args_xh.channel.slice(0, args_xh.channelEnd)
}

function requireConfig() {
  return new Promise(resolve => {
    console.log('开始获取配置文件\n')
    $.notify = $.isNode() ? require('./sendNotify') : { sendNotify: async () => { } }
    //获取 Cookies
    $.cookiesArr = []
    if ($.isNode()) {
      //Node.js用户请在jdCookie.js处填写京东ck;
      const jdCookieNode = require('./jdCookie.js');
      Object.keys(jdCookieNode).forEach((item) => {
        if (jdCookieNode[item]) {
          $.cookiesArr.push(jdCookieNode[item])
        }
      })
      if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
    } else {
      //IOS等用户直接用NobyDa的jd $.cookie
      $.cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
    }
    console.log(`共${$.cookiesArr.length}个京东账号\n`)
    for (const key in args_xh) {
      if (typeof args_xh[key] == 'string') {
        args_xh[key] = Number(args_xh[key])
      }
    }
    // console.debug(args_xh)
    resolve()
  })
}

//获取商品列表并且过滤 By X1a0He
function try_feedsList(tabId, page) {
  return new Promise((resolve, reject) => {

    const body = JSON.stringify({
      "tabId": `${tabId}`,
      "page": page,
      "previewTime": ""
    });
    let option = taskurl_xh('newtry', 'try_feedsList', body)
    $.get(option, (err, resp, data) => {
      try {
        if (err) {
          console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
        } else {
          // console.debug(data)
          // return
          data = JSON.parse(data)
          if (totalPages == 999999) {
            message = message + "<font color=\'#FF0000\' size=2>" + " 当前最大页数为：" + data.data.pages + "</font> </font> \n\n"
          }
          if (data.success) {
            $.totalPages = data.data.pages
            totalPages = data.data.pages
            console.log(`获取到商品 ${data.data.feedList.length} 条\n`)
            for (let i = 0; i < data.data.feedList.length; i++) {
              if (args_xh.listCount + trialActivityIdList.length >= args_xh.maxLength) {
                console.log('商品列表长度已满.结束获取')
              } else
                if (data.data.feedList[i].applyState === 1) {
                  console.log(`商品已申请试用：${data.data.feedList[i].skuTitle}`)
                  continue
                } else
                  if (data.data.feedList[i].applyState !== null) {
                    console.log(`商品状态异常,跳过：${data.data.feedList[i].skuTitle}`)
                    continue
                  } else
                    if (data.data.feedList[i].skuTitle) {
                      console.log(`检测第 ${page} 页 第 ${i + 1} 个商品\n${data.data.feedList[i].skuTitle}`)
                      if (parseFloat(data.data.feedList[i].jdPrice) <= args_xh.jdPrice) {
                        console.log(`商品被过滤，${data.data.feedList[i].jdPrice} < ${args_xh.jdPrice} \n`)
                      } else if (parseFloat(data.data.feedList[i].applyNum) > args_xh.applyNumFilter && data.data.feedList[i].applyNum !== null) {
                        console.log(`商品被过滤，已申请试用人数大于预设人数 \n`)
                      } else if (args_xh.titleFilters.some(fileter_word => data.data.feedList[i].skuTitle.includes(fileter_word))) {
                        sensMessage += "<font color=\'#FF0000\' size=2>" + data.data.feedList[i].skuTitle + "</font> </font> \n\n"
                        args_xh.titleFilters.some(fileter_word => {
                          if (data.data.feedList[i].skuTitle.includes(fileter_word)) {
                            sensMessage += "<font color=\'#000099\' size=2>" + "敏感词汇：" + fileter_word + "</font> </font> \n\n"
                          }
                        })
                        console.log('商品被过滤，含有关键词 \n')
                      } else if (parseFloat(data.data.feedList[i].trialPrice) > args_xh.trialPrice && data.data.feedList[i].jdPrice < minItemValue) {
                        sensMessage += "<font color=\'#FF0000\' size=2>" + data.data.feedList[i].skuTitle + "</font> </font> \n\n"
                        sensMessage += "<font color=\'#FF0000\' size=2>" + "需要花费:" + parseFloat(data.data.feedList[i].trialPrice) + "</font> </font> \n\n"
                        sensMessage += "<font color=\'#FF0000\' size=2>" + "实际价值:" + parseFloat(data.data.feedList[i].jdPrice) + "</font> </font> \n\n"
                        console.log(`商品被过滤，期待价格高于预设价格 \n`)
                      } else if (parseFloat(data.data.feedList[i].supplyNum) > args_xh.minSupplyNum && data.data.feedList[i].supplyNum !== null) {
                        console.log(`商品被过滤，提供申请的份数大于预设申请的份数 \n`)
                        sensMessage += "<font color=\'#FF0000\' size=2>" + data.data.feedList[i].skuTitle + "</font> </font> \n\n"
                        sensMessage += "<font color=\'#FF0000\' size=2>" + "提供申请的份数为:" + parseFloat(data.data.feedList[i].supplyNum) + "</font> </font> \n\n"
                      } else {
                        console.log(`商品通过，将加入试用组，trialActivityId为${data.data.feedList[i].trialActivityId}\n`)
                        trialActivityIdList.push(data.data.feedList[i].trialActivityId)
                        trialActivityTitleList.push(data.data.feedList[i].skuTitle)
                      }
                    } else {
                      console.log('skuTitle解析异常')
                      return
                    }
            }
            console.log(`当前试用组id如下，长度为：${trialActivityIdList.length}\n${trialActivityIdList}\n`)
          } else {
            console.log(`💩 获得试用列表失败: ${data.message}`)
          }
        }
      } catch (e) {
        console.log(e);
        reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
        console.log(`${JSON.stringify(data)}`)
      } finally {
        resolve()
      }
    })
  })
}

function try_apply(title, activityId) {
  return new Promise((resolve, reject) => {
    console.log(`申请试用商品中...`)
    console.log(`商品：${title}`)
    console.log(`id为：${activityId}`)
    const body = JSON.stringify({
      "activityId": activityId,
      "previewTime": ""
    });
    let option = taskurl_xh('newtry', 'try_apply', body)
    $.get(option, (err, resp, data) => {
      try {
        if (err) {
          console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
        } else {
          $.totalTry++
          data = JSON.parse(data)
          if (data.success && data.code === "1") {  // 申请成功
            message += "<font color=\'#778899\' size=2>" + title + "</font>\n\n"
            message += "<font color=\'#778899\' size=2>" + `-------\n\n` + "</font>\n\n"
            console.log(data.message)
            $.totalSuccess++
          } else if (data.code === "-106") {
            console.log(data.message)   // 未在申请时间内！
          } else if (data.code === "-110") {
            console.log(data.message)   // 您的申请已成功提交，请勿重复申请…
          } else if (data.code === "-120") {
            console.log(data.message)   // 您还不是会员，本品只限会员申请试用，请注册会员后申请！
          } else if (data.code === "-167") {
            console.log(data.message)   // 抱歉，此试用需为种草官才能申请。查看下方详情了解更多。
          } else {
            console.log("申请失败", JSON.stringify(data))
          }
        }
      } catch (e) {
        reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
      } finally {
        resolve()
      }
    })
  })
}

function try_MyTrials(page, selected) {
  return new Promise((resolve, reject) => {
    switch (selected) {
      case 1:
        console.log('正在获取已申请的商品...')
        break;
      case 2:
        console.log('正在获取申请成功的商品...')
        break;
      case 3:
        console.log('正在获取申请失败的商品...')
        break;
      default:
        console.log('selected错误')
    }
    const body = JSON.stringify({
      "page": page,
      "selected": selected,   // 1 - 已申请 2 - 成功列表，3 - 失败列表
      "previewTime": ""
    });
    let option = taskurl_xh('newtry', 'try_MyTrials', body)
    option.headers.Referer = 'https://pro.m.jd.com/'
    $.get(option, (err, resp, data) => {
      try {
        if (err) {
          console.log(`🚫 ${arguments.callee.name.toString()} API请求失败，请检查网路\n${JSON.stringify(err)}`)
        } else {
          // console.log(data)
          // return
          data = JSON.parse(data)
          if (data.success) {
            //temp adjustment
            if (selected == 2) {
              if (data.success && data.data) {
                $.successList = data.data.list.filter(item => {
                  return item.text.text.includes('试用资格将保留10天')
                })
                console.log(`待领取: ${$.successList.length}个`)
              } else {
                console.log(`获得成功列表失败: ${data.message}`)
              }
            }
            if (data.data.list.length > 0) {
              let count = 0
              for (let item of data.data.list) {
                console.log(`申请时间：${new Date(parseInt(item.applyTime)).toLocaleString()}`)
                console.log(`申请商品：${item.trialName}`)
                console.log(`当前状态：${item.text.text}`)
                console.log(`剩余时间：${remaining(item.leftTime)}`)

                if (count < 3) {
                  message += "<font color=\'#8552a1\' size=1>" + `成功获取：${item.trialName}` + "</font>\n\n"
                  message += "<font color=\'#4B0082\' size=1>" + `申请时间：${new Date(parseInt(item.applyTime)).toLocaleString()}` + "</font>\n\n"
                  message += "<font color=\'#4B0082\' size=1>" + `当前状态：${item.text.text}` + "</font>\n\n"
                  message += "<font color=\'#ef5b9c\' size=1>" + `剩余时间：${remaining(item.leftTime)}` + "</font>\n\n"
                  message += "<font color=\'#4B0082\' size=1>" + `-----\n\n` + "</font>\n\n"
                  count++
                }
                date = new Date()
                if (item.text.text.includes('试用资格将保留10天') && showDate.includes(date.getHours())) {
                  message1 = "<font color=\'##130c0e\' size=3>" + getManName + "</font>"
                  message1 += "<font color=\'#4B0082\' size=1>" + `,你的商品待领取,请尽快领取` + "</font>\n\n"
                  message1 += "<font color=\'#ef5b9c\' size=1>" + `成功获取：${item.trialName}` + "</font>\n\n"
                  message1 += "<font color=\'#4B0082\' size=1>" + `剩余时间：${remaining(item.leftTime)}` + "</font>\n\n"
                  postToDingTalk2(message1)
                }

                console.log()
              }
            }
            // else {
            //     switch(selected){
            //         case 1:
            //             console.log('无已申请的商品\n')
            //             break;
            //         case 2:
            //             console.log('无申请成功的商品\n')
            //             break;
            //         case 3:
            //             console.log('无申请失败的商品\n')
            //             break;
            //         default:
            //             console.log('selected错误')
            //     }
            // }
          } else {
            console.log(`ERROR:try_MyTrials`)
          }
        }
      } catch (e) {
        reject(`⚠️ ${arguments.callee.name.toString()} API返回结果解析出错\n${e}\n${JSON.stringify(data)}`)
      } finally {
        resolve()
      }
    })
  })
}

function remaining(time) {
  let days = parseInt(time / (1000 * 60 * 60 * 24));
  let hours = parseInt((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = parseInt((time % (1000 * 60 * 60)) / (1000 * 60));
  return `${days} 天 ${hours} 小时 ${minutes} 分`
}

function taskurl_xh(appid, functionId, body = JSON.stringify({})) {
  return {
    "url": `${URL}?appid=${appid}&functionId=${functionId}&clientVersion=10.1.2&client=wh5&body=${encodeURIComponent(body)}`,
    'headers': {
      'Host': 'api.m.jd.com',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cookie': $.cookie,
      'Connection': 'keep-alive',
      'UserAgent': 'jdapp;iPhone;10.1.2;15.0;ff2caa92a8529e4788a34b3d8d4df66d9573f499;network/wifi;model/iPhone13,4;addressid/2074196292;appBuild/167802;jdSupportDarkMode/1;Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1',
      'Accept-Language': 'zh-cn',
      'Referer': 'https://prodev.m.jd.com/'
    },
  }
}

async function showMsg() {
  let message1 = `京东账号${$.index} ${$.nickName || $.UserName}\n🎉 本次申请：${$.totalSuccess}/${$.totalTry}个商品🛒\n🎉 ${$.successList.length}个商品待领取`
  message += "<font color=\'#778899\' size=2>" + `🎉 本次申请：${$.totalSuccess}/${$.totalTry}个商品🛒\n🎉 ${$.successList.length}个商品待领取` + "</font>\n\n"
  if (!args_xh.jdNotify || args_xh.jdNotify === 'false') {
    $.msg($.name, ``, message1, {
      "open-url": 'https://try.m.jd.com/user'
    })
    if ($.isNode())
      notifyMsg += `${message1}\n\n`
  } else {
    console.log(message1)
  }
}

function totalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": $.cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
      },
      "timeout": 10000,
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}

// 来自 @chavyleung 大佬
// https://raw.githubusercontent.com/chavyleung/scripts/master/Env.js
function Env(name, opts) {
  class Http {
    constructor(env) {
      this.env = env
    }

    send(opts, method = 'GET') {
      opts = typeof opts === 'string' ? {
        url: opts
      } : opts
      let sender = this.get
      if (method === 'POST') {
        sender = this.post
      }
      return new Promise((resolve, reject) => {
        sender.call(this, opts, (err, resp, body) => {
          if (err) reject(err)
          else resolve(resp)
        })
      })
    }

    get(opts) {
      return this.send.call(this.env, opts)
    }

    post(opts) {
      return this.send.call(this.env, opts, 'POST')
    }
  }

  return new (class {
    constructor(name, opts) {
      this.name = name
      this.http = new Http(this)
      this.data = null
      this.dataFile = 'box.dat'
      this.logs = []
      this.isMute = false
      this.isNeedRewrite = false
      this.logSeparator = '\n'
      this.startTime = new Date().getTime()
      Object.assign(this, opts)
      this.log('', `🔔${this.name}, 开始!`)
    }

    isNode() {
      return 'undefined' !== typeof module && !!module.exports
    }

    isQuanX() {
      return 'undefined' !== typeof $task
    }

    isSurge() {
      return 'undefined' !== typeof $httpClient && 'undefined' === typeof $loon
    }

    isLoon() {
      return 'undefined' !== typeof $loon
    }

    toObj(str, defaultValue = null) {
      try {
        return JSON.parse(str)
      } catch {
        return defaultValue
      }
    }

    toStr(obj, defaultValue = null) {
      try {
        return JSON.stringify(obj)
      } catch {
        return defaultValue
      }
    }

    getjson(key, defaultValue) {
      let json = defaultValue
      const val = this.getdata(key)
      if (val) {
        try {
          json = JSON.parse(this.getdata(key))
        } catch { }
      }
      return json
    }

    setjson(val, key) {
      try {
        return this.setdata(JSON.stringify(val), key)
      } catch {
        return false
      }
    }

    getScript(url) {
      return new Promise((resolve) => {
        this.get({
          url
        }, (err, resp, body) => resolve(body))
      })
    }

    runScript(script, runOpts) {
      return new Promise((resolve) => {
        let httpapi = this.getdata('@chavy_boxjs_userCfgs.httpapi')
        httpapi = httpapi ? httpapi.replace(/\n/g, '').trim() : httpapi
        let httpapi_timeout = this.getdata('@chavy_boxjs_userCfgs.httpapi_timeout')
        httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20
        httpapi_timeout = runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout
        const [key, addr] = httpapi.split('@')
        const opts = {
          url: `http://${addr}/v1/scripting/evaluate`,
          body: {
            script_text: script,
            mock_type: 'cron',
            timeout: httpapi_timeout
          },
          headers: {
            'X-Key': key,
            'Accept': '*/*'
          }
        }
        this.post(opts, (err, resp, body) => resolve(body))
      }).catch((e) => this.logErr(e))
    }

    loaddata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require('fs')
        this.path = this.path ? this.path : require('path')
        const curDirDataFilePath = this.path.resolve(this.dataFile)
        const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
        const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
        const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
        if (isCurDirDataFile || isRootDirDataFile) {
          const datPath = isCurDirDataFile ? curDirDataFilePath : rootDirDataFilePath
          try {
            return JSON.parse(this.fs.readFileSync(datPath))
          } catch (e) {
            return {}
          }
        } else return {}
      } else return {}
    }

    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require('fs')
        this.path = this.path ? this.path : require('path')
        const curDirDataFilePath = this.path.resolve(this.dataFile)
        const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
        const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
        const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
        const jsondata = JSON.stringify(this.data)
        if (isCurDirDataFile) {
          this.fs.writeFileSync(curDirDataFilePath, jsondata)
        } else if (isRootDirDataFile) {
          this.fs.writeFileSync(rootDirDataFilePath, jsondata)
        } else {
          this.fs.writeFileSync(curDirDataFilePath, jsondata)
        }
      }
    }

    lodash_get(source, path, defaultValue = undefined) {
      const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
      let result = source
      for (const p of paths) {
        result = Object(result)[p]
        if (result === undefined) {
          return defaultValue
        }
      }
      return result
    }

    lodash_set(obj, path, value) {
      if (Object(obj) !== obj) return obj
      if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []
      path.slice(0, -1).reduce((a, c, i) => (Object(a[c]) === a[c] ? a[c] : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {})), obj)[
        path[path.length - 1]
      ] = value
      return obj
    }

    getdata(key) {
      let val = this.getval(key)
      // 如果以 @
      if (/^@/.test(key)) {
        const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
        const objval = objkey ? this.getval(objkey) : ''
        if (objval) {
          try {
            const objedval = JSON.parse(objval)
            val = objedval ? this.lodash_get(objedval, paths, '') : val
          } catch (e) {
            val = ''
          }
        }
      }
      return val
    }

    setdata(val, key) {
      let issuc = false
      if (/^@/.test(key)) {
        const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
        const objdat = this.getval(objkey)
        const objval = objkey ? (objdat === 'null' ? null : objdat || '{}') : '{}'
        try {
          const objedval = JSON.parse(objval)
          this.lodash_set(objedval, paths, val)
          issuc = this.setval(JSON.stringify(objedval), objkey)
        } catch (e) {
          const objedval = {}
          this.lodash_set(objedval, paths, val)
          issuc = this.setval(JSON.stringify(objedval), objkey)
        }
      } else {
        issuc = this.setval(val, key)
      }
      return issuc
    }

    getval(key) {
      if (this.isSurge() || this.isLoon()) {
        return $persistentStore.read(key)
      } else if (this.isQuanX()) {
        return $prefs.valueForKey(key)
      } else if (this.isNode()) {
        this.data = this.loaddata()
        return this.data[key]
      } else {
        return (this.data && this.data[key]) || null
      }
    }

    setval(val, key) {
      if (this.isSurge() || this.isLoon()) {
        return $persistentStore.write(val, key)
      } else if (this.isQuanX()) {
        return $prefs.setValueForKey(val, key)
      } else if (this.isNode()) {
        this.data = this.loaddata()
        this.data[key] = val
        this.writedata()
        return true
      } else {
        return (this.data && this.data[key]) || null
      }
    }

    initGotEnv(opts) {
      this.got = this.got ? this.got : require('got')
      this.cktough = this.cktough ? this.cktough : require('tough-cookie')
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()
      if (opts) {
        opts.headers = opts.headers ? opts.headers : {}
        if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
          opts.cookieJar = this.ckjar
        }
      }
    }

    get(opts, callback = () => { }) {
      if (opts.headers) {
        delete opts.headers['Content-Type']
        delete opts.headers['Content-Length']
      }
      if (this.isSurge() || this.isLoon()) {
        if (this.isSurge() && this.isNeedRewrite) {
          opts.headers = opts.headers || {}
          Object.assign(opts.headers, {
            'X-Surge-Skip-Scripting': false
          })
        }
        $httpClient.get(opts, (err, resp, body) => {
          if (!err && resp) {
            resp.body = body
            resp.statusCode = resp.status
          }
          callback(err, resp, body)
        })
      } else if (this.isQuanX()) {
        if (this.isNeedRewrite) {
          opts.opts = opts.opts || {}
          Object.assign(opts.opts, {
            hints: false
          })
        }
        $task.fetch(opts).then(
          (resp) => {
            const {
              statusCode: status,
              statusCode,
              headers,
              body
            } = resp
            callback(null, {
              status,
              statusCode,
              headers,
              body
            }, body)
          },
          (err) => callback(err)
        )
      } else if (this.isNode()) {
        this.initGotEnv(opts)
        this.got(opts).on('redirect', (resp, nextOpts) => {
          try {
            if (resp.headers['set-cookie']) {
              const ck = resp.headers['set-cookie'].map(this.cktough.Cookie.parse).toString()
              if (ck) {
                this.ckjar.setCookieSync(ck, null)
              }
              nextOpts.cookieJar = this.ckjar
            }
          } catch (e) {
            this.logErr(e)
          }
          // this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
        }).then(
          (resp) => {
            const {
              statusCode: status,
              statusCode,
              headers,
              body
            } = resp
            callback(null, {
              status,
              statusCode,
              headers,
              body
            }, body)
          },
          (err) => {
            const {
              message: error,
              response: resp
            } = err
            callback(error, resp, resp && resp.body)
          }
        )
      }
    }

    post(opts, callback = () => { }) {
      // 如果指定了请求体, 但没指定`Content-Type`, 则自动生成
      if (opts.body && opts.headers && !opts.headers['Content-Type']) {
        opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }
      if (opts.headers) delete opts.headers['Content-Length']
      if (this.isSurge() || this.isLoon()) {
        if (this.isSurge() && this.isNeedRewrite) {
          opts.headers = opts.headers || {}
          Object.assign(opts.headers, {
            'X-Surge-Skip-Scripting': false
          })
        }
        $httpClient.post(opts, (err, resp, body) => {
          if (!err && resp) {
            resp.body = body
            resp.statusCode = resp.status
          }
          callback(err, resp, body)
        })
      } else if (this.isQuanX()) {
        opts.method = 'POST'
        if (this.isNeedRewrite) {
          opts.opts = opts.opts || {}
          Object.assign(opts.opts, {
            hints: false
          })
        }
        $task.fetch(opts).then(
          (resp) => {
            const {
              statusCode: status,
              statusCode,
              headers,
              body
            } = resp
            callback(null, {
              status,
              statusCode,
              headers,
              body
            }, body)
          },
          (err) => callback(err)
        )
      } else if (this.isNode()) {
        this.initGotEnv(opts)
        const {
          url,
          ..._opts
        } = opts
        this.got.post(url, _opts).then(
          (resp) => {
            const {
              statusCode: status,
              statusCode,
              headers,
              body
            } = resp
            callback(null, {
              status,
              statusCode,
              headers,
              body
            }, body)
          },
          (err) => {
            const {
              message: error,
              response: resp
            } = err
            callback(error, resp, resp && resp.body)
          }
        )
      }
    }

    /**
     *
     * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
     *    :$.time('yyyyMMddHHmmssS')
     *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
     *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
     * @param {*} fmt 格式化参数
     *
     */
    time(fmt) {
      let o = {
        'M+': new Date().getMonth() + 1,
        'd+': new Date().getDate(),
        'H+': new Date().getHours(),
        'm+': new Date().getMinutes(),
        's+': new Date().getSeconds(),
        'q+': Math.floor((new Date().getMonth() + 3) / 3),
        'S': new Date().getMilliseconds()
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (new Date().getFullYear() + '').substr(4 - RegExp.$1.length))
      for (let k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      return fmt
    }

    /**
     * 系统通知
     *
     * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
     *
     * 示例:
     * $.msg(title, subt, desc, 'twitter://')
     * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
     * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
     *
     * @param {*} title 标题
     * @param {*} subt 副标题
     * @param {*} desc 通知详情
     * @param {*} opts 通知参数
     *
     */
    msg(title = name, subt = '', desc = '', opts) {
      const toEnvOpts = (rawopts) => {
        if (!rawopts) return rawopts
        if (typeof rawopts === 'string') {
          if (this.isLoon()) return rawopts
          else if (this.isQuanX()) return {
            'open-url': rawopts
          }
          else if (this.isSurge()) return {
            url: rawopts
          }
          else return undefined
        } else if (typeof rawopts === 'object') {
          if (this.isLoon()) {
            let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
            let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
            return {
              openUrl,
              mediaUrl
            }
          } else if (this.isQuanX()) {
            let openUrl = rawopts['open-url'] || rawopts.url || rawopts.openUrl
            let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
            return {
              'open-url': openUrl,
              'media-url': mediaUrl
            }
          } else if (this.isSurge()) {
            let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
            return {
              url: openUrl
            }
          }
        } else {
          return undefined
        }
      }
      if (!this.isMute) {
        if (this.isSurge() || this.isLoon()) {
          $notification.post(title, subt, desc, toEnvOpts(opts))
        } else if (this.isQuanX()) {
          $notify(title, subt, desc, toEnvOpts(opts))
        }
      }
      if (!this.isMuteLog) {
        let logs = ['', '==============📣系统通知📣==============']
        logs.push(title)
        subt ? logs.push(subt) : ''
        desc ? logs.push(desc) : ''
        console.log(logs.join('\n'))
        this.logs = this.logs.concat(logs)
      }
    }

    log(...logs) {
      if (logs.length > 0) {
        this.logs = [...this.logs, ...logs]
      }
      console.log(logs.join(this.logSeparator))
    }

    logErr(err, msg) {
      const isPrintSack = !this.isSurge() && !this.isQuanX() && !this.isLoon()
      if (!isPrintSack) {
        this.log('', `❗️${this.name}, 错误!`, err)
      } else {
        this.log('', `❗️${this.name}, 错误!`, err.stack)
      }
    }

    wait(time) {
      return new Promise((resolve) => setTimeout(resolve, time))
    }

    done(val = {}) {
      const endTime = new Date().getTime()
      const costTime = (endTime - this.startTime) / 1000
      this.log('', `🔔${this.name}, 结束! 🕛 ${costTime} 秒`)
      this.log()
      if (this.isSurge() || this.isQuanX() || this.isLoon()) {
        $done(val)
      }
    }
  })(name, opts)
}


//我加的函数
function postToDingTalk(messgae) {
  const message1 = "" + messgae
  // that.log(messgae)

  const body = {
    "msgtype": "markdown",
    "markdown": {
      "title": "随机试用",
      "text": message1
    },
    "at": {
      "atMobiles": [],
      "isAtAll": false
    }
  }


  $.post(toDingtalk(dingtalk, JSON.stringify(body)), (data, status, xhr) => {
    try {
      that.log(resp)
      that.log(data)
      if (err) {
        that.log(JSON.stringify(err));
        $.logErr(err);
      } else {
        if (safeGet(data)) {
          $.duckRes = JSON.parse(data);
        }
      }
    } catch (e) {
      $.logErr(e, resp)
    } finally {
      resolve();
    }
  }, "json")
}


function toDingtalk(urlmain, bodyMain) {
  return {
    url: urlmain,
    body: bodyMain,
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    timeout: 10000,
  }
}


function postToDingTalk1(messgae) {
  const message1 = "" + messgae
  // that.log(messgae)

  const body = {
    "msgtype": "markdown",
    "markdown": {
      "title": "错误筛选",
      "text": message1
    },
    "at": {
      "atMobiles": [],
      "isAtAll": false
    }
  }

  $.post(toDingtalk(dingtalk1, JSON.stringify(body)), (data, status, xhr) => {
    try {
      that.log(resp)
      that.log(data)
      if (err) {
        that.log(JSON.stringify(err));
        $.logErr(err);
      } else {
        if (safeGet(data)) {
          $.duckRes = JSON.parse(data);
        }
      }
    } catch (e) {
      $.logErr(e, resp)
    } finally {
      resolve();
    }
  }, "json")
}

function postToDingTalk2(messgae) {
  const message1 = "" + messgae
  // that.log(messgae)

  const body = {
    "msgtype": "markdown",
    "markdown": {
      "title": "中奖查询",
      "text": "中奖查询\n\n" + message1
    },
    "at": {
      "atMobiles": [],
      "isAtAll": true
    }
  }

  $.post(toDingtalk(dingtalk2, JSON.stringify(body)), (data, status, xhr) => {
    try {
      that.log(resp)
      that.log(data)
      if (err) {
        that.log(JSON.stringify(err));
        $.logErr(err);
      } else {
        if (safeGet(data)) {
          $.duckRes = JSON.parse(data);
        }
      }
    } catch (e) {
      $.logErr(e, resp)
    } finally {
      resolve();
    }
  }, "json")
}