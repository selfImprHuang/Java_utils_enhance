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
let showDate = [0, 1, 12, 13, 17, 18]
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
  "realm_": "泽子怪"
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
  titleFilters: ["鞋", "钳", "酒", "课", "裤", "考", "疮", "疣", "漆", "梯", "框", "架", "巾", "尿", "尺", "妆", "夹", "哨", "剪", "剂", "丸", "sd", "SD", "鼻炎", "鼻影", "龟头", "鼻膏", "鼻毛", "鼻头", "鼻塞", "黑沙", "黑头", "黄冈", "鹿鞭", "鸭肠", "鸡胗", "鱼饵", "鱼钩", "鱼缸", "鱼线", "鱼竿", "驱虫", "香薰", "饲料", "饭盒", "食盐", "领结", "领带", "鞋带", "鞋垫", "面霜", "面酱", "面膜", "面罩", "面碗", "静电", "青汁", "露指", "雨衣", "雨披", "雨刮", "陀螺", "阴部", "阴囊", "防疫", "闹钟", "门锁", "门档", "门帘", "门吸", "长筒", "镰刀", "镜片", "锯片", "锯条", "锅铲", "锁头", "U盘", "铆管", "铅笔", "铁丝", "钢笔", "钢丝", "钙片", "钓箱", "钉子", "针头", "酵素", "遮瑕", "适配", "辅食", "软膏", "软糖", "轮胎", "转接", "转换", "轨道", "车锁", "车轮", "车漆", "跳绳", "赠品", "贺卡", "贴膜", "贴纸", "贴布", "角阀", "裸妆", "裤头", "装修", "袜子", "袖套", "衬衫", "表带", "补水", "补墙", "补发", "蚊香", "蚊帐", "葛根", "菜罩", "菊粉", "莘月", "茶杯", "茶宠", "茶壶", "茶勺", "茶具", "茗杯", "花萃", "花瓶", "花洒", "芦荟", "艾草", "艾条", "艾叶", "色料", "自慰", "腰带", "腮红", "腋毛", "脱毛", "脱发", "脚垫", "脖套", "胸针", "胸包", "胶枪", "胶带", "胶囊", "胖子", "背膜", "肥料", "肥佬", "耳钉", "耳罩", "老花", "翻身", "美胸", "美缝", "美甲", "网线", "网卡", "网兜", "绿幕", "绷带", "维修", "绑带", "练字", "线上", "纹眉", "纱网", "纱窗", "红绳", "精油", "精华", "粉饼", "粉扑", "粉底", "粉刺", "筷子", "筒灯", "笼子", "笔槽", "童装", "竖笛", "窗帘", "私处", "神露", "祛疤", "磨脚", "碳粉", "碟子", "碎发", "硬笔", "硅胶", "砂锅", "砂纸", "砂盆", "短裙", "矫正", "睫毛", "睡裤", "眼霜", "眼镜", "眼贴", "眼袋", "眼罩", "眼影", "眉笔", "相纸", "盘香", "盖世", "监狱", "皮带", "皮套", "百褶", "白酒", "瘙痒", "痛风", "痔疮", "痉挛", "男童", "电钻", "电瓶", "电池", "甲醛", "用友", "瓜刨", "琴弦", "球拍", "球帽", "玻璃", "玻珠", "玛咖", "猫粮", "猫砂", "猫用", "猫咪", "猪油", "狗链", "狗粮", "犬粮", "牛舌", "牙膏", "牙线", "牙签", "牙套", "牙刷", "燮乐", "煤油", "炖盅", "灯膜", "灯泡", "灭鼠", "灭蝇", "滤镜", "滤芯", "滤网", "滤杯", "湿粮", "渔具", "润滑", "消毒", "浮漂", "浮标", "测试", "测评", "洗面", "洁面", "泳衣", "泥灸", "泡沫", "油罐", "油漆", "油壶", "沉香", "汤盅", "汤勺", "水泥", "水枪", "水带", "水勺", "水乳", "毛孔", "毛囊", "母乳", "死皮", "止痒", "模具", "棒球", "棉袜", "梳子", "梯子", "桌垫", "树苗", "栅网", "柜吸", "染发", "条码", "机油", "月子", "早教", "日历", "断奶", "斗笔", "文胸", "教育", "教材", "教学", "教具", "敏肌", "敏感", "擦窗", "插销", "插座", "掸子", "掏耳", "挑逗", "指套", "挂钩", "挂钟", "挂绳", "挂篓", "拐杖", "护踝", "护膝", "护腕", "护肤", "护理", "护栏", "护具", "抓周", "把手", "托盘", "打底", "手电", "手套", "手册", "戒烟", "情趣", "徽墨", "彩铅", "彩带", "弹簧", "延迟", "延时", "康复", "座套", "座垫", "底座", "幼儿", "干裂", "幕布", "帽子", "帆睿", "布袋", "屏风", "尿素", "小学", "射灯", "导购", "宿便", "宣纸", "宠物", "宝佩", "定制", "定做", "学历", "婴儿", "妇女", "奶粉", "奶瓶", "头绳", "头皮", "天线", "外用", "壁纸", "墨镜", "墨粉", "墨盒", "墨水", "墨条", "墨块", "增高", "墙纸", "培训", "垫片", "坐垫", "地漏", "地桩", "地吸", "圣杯", "图钉", "围裙", "围兜", "嚼片", "喷壶", "啪啪", "唇釉", "哺乳", "哑光", "咽炎", "咳嗽", "咬钩", "呼噜", "周岁", "后膜", "台灯", "口腔", "口罩", "口红", "口琴", "发绳", "压片", "卸妆", "卡针", "卡牌", "卡托", "卡尺", "卡套", "卡册", "医生", "匙扣", "化妆", "包皮", "勿拍", "勺子", "剪钳", "剥虾", "刷子", "刷头", "刮痧", "别针", "刨木", "分流", "刀片", "刀头", "减肥", "冰袋", "农亨", "内裤", "内衣", "光驱", "假发", "倒车", "修眉", "修护", "信纸", "信封", "保健", "便秘", "侧包", "作业", "会员", "优盘", "伊威", "交换", "乳腺", "乳液", "书法", "书包", "丰胸", "丝袜", "一盒", "uv镜", "SD卡", "鼻气膏", "FMJ", "LED", "VGA", "hpv", "HPV", "鼻毛器", "鼻康爽", "鼠标手", "鼠标垫", "黄金卡", "黄膏贴", "麦克风", "鸳鸯锅", "鱼塘膜", "魔法棒", "高升专", "马桶垫", "马桶刷", "马克笔", "马丁靴", "香囊袋", "飞机杯", "风湿贴", "风水鱼", "额头贴", "音频线", "韩味多", "非卖品", "青春痘", "雅翔仕", "隔离霜", "隔离网", "隔热棉", "隔热板", "陶瓷瓶", "陈皮鸡", "防静电", "防裂膏", "防蚊裤", "防疫包", "防滑垫", "防渗膜", "防晒霜", "防晒乳", "防撞条", "门槛条", "门把手", "长筒袜", "镜头贴", "镜头膜", "键盘垫", "锁精环", "钥匙扣", "钥匙套", "钢化蛋", "钢化膜", "钢丝球", "金刚胶", "配件盒", "避孕套", "避光垫", "遮瑕膏", "遮挡布", "遥控器", "通体砖", "透气贴", "逍遥马", "适配器", "追踪器", "连衣裙", "运势书", "过滤棉", "过敏性", "过家家", "输精管", "软电线", "转换器", "车篓子", "身体乳", "趴趴枕", "足浴粉", "超比乐", "起雾棒", "购物袋", "购物券", "调音器", "试用装", "试听课", "训练器", "订账本", "订书机", "警示牌", "触控笔", "解码线", "角磨机", "覆盖膜", "西汀片", "褪黑素", "裁纸刀", "补光灯", "蟑螂药", "蛋白肽", "蚯蚓粪", "虾青素", "萨瑞斯", "菊花茶", "荧光笔", "苦荞茶", "苏兰卡", "苍蝇药", "苍蝇拍", "艾脐贴", "艾胜者", "艾绒贴", "艾灸贴", "舒缓水", "自拍杆", "自弹器", "臂力器", "膝盖贴", "胜平堂", "胖大海", "育苗盘", "肩周炎", "职业装", "耐火泥", "老爷车", "翻页笔", "翻板钩", "翻分器", "羽毛球", "美肌霜", "美工笔", "美工刀", "美容院", "美容油", "美容棒", "绿草皮", "维生素", "绘图板", "细纹霜", "纸尿裤", "纳米砖", "纤维素", "红包袋", "红包封", "素颜霜", "糖糖粉", "精华露", "精华乳", "类纸膜", "米小芽", "签字笔", "筹划税", "筋骨贴", "空调罩", "空调滤", "秋梨膏", "福来油", "祛斑霜", "示宽灯", "磨脚石", "磨砂壳", "砍菜刀", "砍柴刀", "矫正带", "矫正器", "睡眠片", "眼药水", "眼线笔", "真空袋", "益生菌", "皮筋枪", "百日宴", "白板笔", "番茄丁", "男人茶", "电话牌", "电话卡", "电脑包", "电缆剪", "电源线", "电容笔", "电子秤", "甜品勺", "瑶浴粉", "琮德轩", "理疗贴", "理发推", "理发器", "玻璃胶", "玻璃吊", "玻珠幕", "玻尿酸", "玛咖茶", "玛咖片", "玉米须", "玉米粉", "猫罐头", "猫玩具", "狗零食", "狗皮膏", "牵引器", "牛仔裤", "牙签盒", "牙刷头", "爽肤水", "爸爸鞋", "爸爸装", "爬爬垫", "热敷包", "烧水棒", "炎膏贴", "火花塞", "激光剑", "潜水服", "漱口水", "滑漂座", "滑板车", "滑块袋", "滋养霜", "湿手器", "温度计", "清洁球", "清洁液", "清洁刷", "清水剂", "润颜乳", "润滑液", "润唇膏", "消毒液", "测电笔", "流量卡", "洗鼻器", "洗地液", "洋娃娃", "注射针", "注射器", "泡澡球", "泡泡纸", "泡沫胶", "沐浴包", "汽油锯", "水龙头", "水管道", "水果泥", "水晶泥", "水晶头", "水平仪", "水凝膜", "气雾棒", "气垫霜", "气压杆", "椅子套", "棒棒糖", "样板盒", "标识牌", "标签纸", "标志牌", "栀子茶", "柔肤水", "染发剂", "枕头套", "枇杷膏", "材料包", "机顶盒", "木糖醇", "有机肥", "替换头", "晨铭轩", "晚安茶", "方向盘", "整理棒", "数据线", "救生衣", "效果图", "改光膜", "收银机", "收钱码", "收藏册", "收敛水", "擦银布", "擦玻璃", "撑衣杆", "摇步器", "摄影灯", "摄像头", "搅拌勺", "握力器", "提词器", "提示牌", "排气扇", "掏耳朵", "捆绑绳", "捆扎绳", "挤奶器", "挡风板", "按摩球", "拾音器", "拨浪鼓", "拔毒膏", "拉柳枪", "拉力绳", "拉力器", "抽水器", "抵用券", "抬头纹", "报警器", "护腿套", "护眼贴", "护手霜", "抛光机", "抚奶嘴", "投屏器", "抓痒器", "抑菌膏", "扭扭车", "扩音器", "打飞机", "打钉枪", "打虫糖", "打草绳", "打包绳", "手电筒", "手机袋", "手机线", "手机壳", "手机卡", "手术刀", "手提秤", "手推车", "手动幕", "戒奶嘴", "成长裤", "成人票", "悠悠球", "总复习", "思维棋", "弹力绳", "开果器", "开关盒", "延长器", "床垫套", "幼儿园", "平衡线", "平光镜", "干眼症", "干洗剂", "工作服", "川品社", "屏蔽袋", "屏幕膜", "尿素霜", "尾灯膜", "尼龙网", "尼龙管", "小状元", "小汤匙", "小斗篷", "小塔糖", "小勺子", "封口机", "对接头", "富贵包", "密码锁", "密封袋", "密封条", "宫颈炎", "实验课", "宝珠笔", "宝宝霜", "宝塔糖", "定位器", "安全锤", "安全裤", "安全帽", "孩儿乐", "学习卡", "存储卡", "孕妇装", "孔明锁", "婴幼儿", "如意碗", "大头围", "多色笔", "外包税", "复合肽", "复合肥", "增生贴", "塔菲克", "塑身裤", "塑料杯", "垃圾袋", "坐骨膏", "坐便椅", "坐便器", "土工膜", "土工布", "圆珠笔", "固定器", "喷雾器", "唑溶液", "咖啡豆", "咖啡勺", "告知牌", "吸顶灯", "吸油纸", "吸奶器", "同仁堂", "吃饭衣", "号码卡", "台账本", "口香糖", "口罩盒", "变身器", "反弹器", "反光镜", "反光贴", "反光板", "双黄连", "双面板", "双层片", "双导向", "参肽片", "去角质", "去毛器", "去枣核", "去斑霜", "压差表", "卸妆水", "卧铺垫", "协尔聪", "半身裙", "包装膜", "加温器", "加密狗", "办公杯", "办公宝", "割草机", "前列腺", "削皮刀", "刺激贴", "刺梨糕", "刹车油", "刷牙头", "刮痧板", "创可贴", "切菜板", "切割片", "分线盒", "分流器", "凳子套", "减关镜", "净水剂", "冻干粉", "冷敷贴", "冷凝胶", "冷兵器", "决明子", "冰箱贴", "内胆包", "养芝堂", "养生茶", "养殖膜", "公文包", "八宝茶", "八倍镜", "充电桩", "充电头", "储奶袋", "停车牌", "假睫毛", "倒车镜", "修眉剪", "修正带", "修复乳", "保鲜膜", "保温棉", "保暖裤", "保护镜", "保护膜", "保护套", "保护壳", "侧挂式", "体验装", "体温计", "传菜铃", "会员卡", "亿优信", "享底价", "交换机", "五宝茶", "五参茶", "乒乓球", "中老年", "中性笔", "中国结", "专用贴", "专升本", "三轮车", "三角阀", "三清茶", "万藓灵", "万用表", "丁香茶", "一片装", "一次性", "hdmi", "静音阻尼", "防水敷贴", "防疫香包", "钓鱼手竿", "视频mv", "防水涂料", "运费专拍", "钓箱边网", "黑芝麻丸", "软件系统", "货车用品", "隔音耳塞", "请勿下单", "防卫尖刺", "雷气日式", "PVC板", "钓鱼插件", "车内清洁", "金属探测", "车载u盘", "钓箱侧袋", "赛柏瑞斯", "鼻腔喷雾", "食用色素", "香薰精油", "黑色水笔", "防臭盖子", "4/3膜", "调羹冰勺", "金属合金", "雕刻工具", "钙咀嚼片", "T口弯头", "静脉曲张", "降葵花盘", "钓箱配件", "评估检测", "鸡毛掸子", "HDMI", "H10E", "G100", "高清配件", "视频教程", "蒲公英茶", "落花啼春", "菲妮小熊", "莆田官网", "芊乔珠宝", "腰肌劳损", "腰椎突出", "腋毛神器", "背心马甲", "老式鸣笛", "老人用品", "线上课程", "纹眉色料", "红花手套", "粉扑盒子", "空气滤芯", "称斤积木", "神经痛贴", "礼品链接", "男士用品", "电风扇罩", "电脑电源", "电磨组套", "电焊护脚", "玻璃镜片", "玫瑰花茶", "玩具女孩", "猫咪玩具", "牙签防水", "热熔胶枪", "烘焙纸杯", "灶台贴纸", "满分冲刺", "滚梳直柄", "清洁配件", "清洁软胶", "清洁套装", "消防水带", "消化不良", "涂鸦贴纸", "海狸先生", "洗地专用", "泸州老窖", "汽车车灯", "汽车脚垫", "汽车椅背", "汽车摆件", "水管配件", "欧布圣剑", "格子长袖", "查询软件", "方向盘套", "教学视频", "摘果神器", "摆件车模", "摄像头膜", "损伤膏贴", "挡风玻璃", "拌饭海苔", "抽屉轨道", "折叠锯子", "投影仪包", "打包袋子", "手机维修", "手工黏土", "快递纸箱", "德尔地板", "延迟喷雾", "床头台灯", "幼儿配方", "工作手册", "尤克里里", "少儿读物", "小兔女士", "寒假作业", "宝宝鞋子", "宝宝牙刷", "宝宝成长", "宝宝奶粉", "宝宝口罩", "学生文具", "女童靴子", "女童裤子", "女士内裤", "声卡套装", "增生膏贴", "在线直播", "园艺工具", "商务休闲", "哺乳套装", "启动电源", "合成机油", "口腔抑菌", "反光条贴", "卧铺毛毯", "南疆巴朗", "半身不遂", "凝胶糖果", "决明子茶", "公主项链", "免钉胶水", "光和青春", "先徽葱油", "儿童雨伞", "儿童随身", "儿童背包", "儿童牙膏", "儿童椅子", "儿童拌饭", "儿童成长", "儿童奶粉", "儿童吸管", "儿童口罩", "儿童医生", "儿童便捷", "儿童乐园", "健康检测", "保暖背心", "保暖女裤", "保护贴膜", "会议记录", "会议杯子", "代餐奶昔", "仓鼠零食", "亲子互动", "产品体验", "事后入怀", "九九乘除", "九九乘法", "串珠玩具", "中性水笔", "中国电信", "下关沱茶", "万向滑轮", "鸥曼GTL", "手工DIY", "儿童n95", "SUP掌机", "行车记录仪", "消化道出血", "0-12岁", "电视遥控器", "棉线结矶杆", "金属探测器", "椅背置物袋", "鱼塘专用膜", "牙刷收纳盒", "燃气报警器", "慢性鼻1炎", "玻璃防雾剂", "摄像头镜片", "接线式直管", "枇杷秋梨膏", "童装男女童", "轻酸瓶3%", "水管保温套", "惯性小汽车", "鱼池防水膜", "狗狗沐浴露", "消防应急灯", "手机充电线", "钓箱置物袋", "打印机碳带", "靠背收纳袋", "牙刷替换头", "枇杷雪梨膏", "win10", "除菌洗地液", "DHA藻油", "空调遥控器", "尤尖锐湿疣", "小孩子演奏", "宝宝玩具车", "宝宝灯笼裤", "定做榻榻米", "多功能尺子", "垃圾处理器", "地面清洁液", "品雅有机茶", "单拍不发货", "半圆滑漂挡", "剃须刀配件", "儿童磨牙饼", "儿童益生菌", "儿童玩具枪", "儿童沐浴露", "儿童暖暖套", "仿真小蛋糕", "人参五宝茶", "中央扶手箱", "KVM切换器", "移动wifi", "SMOVES", "HEISHA", "黑色塑料薄膜", "远投路滑配件", "轮胎专用胶水", "视线盲区贴纸", "矶钓钓鱼配件", "烘焙彩针糖果", "汽车尾部挂件", "樱の色鱼子酱", "擦车清洁工具", "小苍兰沐浴露", "宝宝儿童零食", "奥咖云南特产", "办公会议茶杯", "儿童电话手表", "儿童电动牙刷", "儿童保温水杯", "儿童串珠玩具", "不干胶标签带", "人参黄精枸杞茶", "led开关电源", "QHE+ 其嘉", "windows", "Ockered", "汽车头枕腰靠套装", "金龙鱼 面条挂面", "德生源氨基酸洗发水", "女士内裤，少女内裤", "塑料士兵小军人玩具", "N1162有线鼠标", "KB216有线键盘", "奇异果嫩肤磨砂沐浴乳", "MS116 有线鼠标", "乐凡希 三明治火腿片", "生鲜火锅 250g墨鱼饼", "生鲜 方便菜 500g排骨*2", "破壳茶叶正味碳焙铁观音一级罐装100g", "破壳茶叶铁观音正味浓香型一级罐装100g", "正宗农家鸡蛋散养农村柴鸡蛋营养美味健康轻食", "新鲜羊肉卷肥牛卷涮火锅套餐烧烤配菜火锅食材", "夕恒手机散热器吃鸡神器半导体冰冻冷风散热器", "新鲜鱼类海鲜水产 健康轻食 生鲜 2斤装鳕鱼", "野铺子雪媚娘蛋黄酥6枚装 野铺子蛋黄酥【6枚装】", "安宝笛蓓缦水养柔肤茉莉海盐磨砂沐浴露40ml*3", "奥咖云南特产贡菊茶40g/罐无硫天然生态贡菊茶罐装", "破壳茶叶poke福建安溪铁观音浓香型圆罐装散茶100g", "羊蝎子批发现杀羊脊骨内蒙古新鲜火锅食材 羊蝎子1000g", "方便食品 烧烤火锅食材海鲜水产 原味烤肠200g/包*1", "落花啼春 吊坠女佛公弥勒笑佛玉坠玉石阿富汗项链挂坠玉佩玉器", "正宗内蒙古羊肉卷 羔羊卷 涮火锅食材火锅料 1000g羊肉卷", "奥咖姜枣黑糖茶300克/盒云南特产女生大姨妈月经期温暖小肚肚", "新鲜雪花肥牛卷牛肉片牛肉卷涮火锅套餐配菜火锅食材 2斤肥牛卷", "瑞发德 藤椒琵琶腿 400g 烤鸡腿 鸡肉 冷冻油炸半成品小吃", "a1雪绒蛋糕550g早餐食品小面包蒸蛋糕 a1雪绒蛋糕550g", "羊杂清真 原味羊杂 熟食速食火锅食材新鲜免切批发 纯羊杂4斤装", "礼物金大福珠宝小雏菊银手链女款925银气质韩版简约手链 小雏菊", "THISE利斯欧洲原装进口全脂纯牛奶500ml高钙有机健康高端奶", "【5盒装】丹麦风味曲奇饼干休闲零食小吃 【5盒装】丹麦风味曲奇饼干", "乐凡希 三明治火腿片 三连包 150克(50克 X 3) 冷藏熟食", "3份起正宗武汉热干面过早速食拌面碱水面带调料酱包方便面条湖北 6包", "3份起正宗武汉热干面过早速食拌面碱水面带调料酱包方便面条湖北 12包", "老北京炸酱面杂酱面休闲食品韩国拌面方便面速食特产网红面条102g/包", "奇异果嫩肤磨砂沐浴乳 香氛清洁香水沐浴露留香沐浴液 红樱桃300ml", "盖世 美人唇杏鲍菇木耳海茸/裙带菜150g*4袋 解冻即食 海鲜水产", "新鲜 猪胸骨 猪脆骨 散养土猪肉 软骨 猪排骨 批发 猪胸骨1000g", "满沃 黑枸杞（大果＞7MM）100克 青海柴达木大果黑枸杞 天然花青素", "牛黄喉烧烤新鲜配菜牛杂牛喉管涮锅麻辣烫凉拌火锅食材 250g*2牛黄喉", "牛杂牛肚牛百叶白千层毛肚丝黑毛肚配菜批发新鲜火锅食材 1000g白千层", "牛杂牛肚牛百叶白千层毛肚丝黑毛肚配菜批发新鲜火锅食材 1000g黑毛肚丝", "丹麦风味曲奇饼干大分量盒装休闲零食饼干礼包 丹麦风味曲奇饼干360g/盒", "宝佩 印尼五瓣小金刚菩提子双龙肉纹国潮复古单圈手链文玩佛珠手串男女 松石款", "正宗农家鸡蛋 散养农村柴鸡蛋 营养美味早餐 现捡 玉米黄虫草蛋 鸡蛋20枚", "猫村长泰式榴莲糖238g桶装特浓泰式风味榴莲奶糖 泰式风味榴莲糖238g/桶", "老北京炸酱面杂酱面休闲食品韩国拌面方便面速食特产网红面条102g/包 10包", "金汤佛跳墙正宗即食袋装海参鲍鱼捞饭盆菜海鲜大礼包熟食海鲜 2袋佛跳墙250g", "惠发 速冻炸鸡食品 裹粉鸡胸肉 鸡米花 鸡排 半成品 烧烤食材 400g鸡米花", "厚切猪五花肉片韩国烤肉食材新鲜烧烤食材韩式烤肉片生猪肉 五花肉片250g*2盒", "老北京炸酱面杂酱面休闲食品韩国拌面方便面速食特产网红面条102g/包 3包尝鲜装", "宝藏驼 猴头菇驼奶饼干代餐膳食纤维休闲零食小吃独立包装开袋即食饼干400g*1盒", "舟山 黄花鱼新鲜冷冻 小黄鱼海鲜水产 清蒸红烧烧烤油炸皆可 整箱六斤装中号黄花鱼", "中国龙瓷 生日礼物送女生男友情人节十二生肖摆件创意礼品工艺品德化白瓷器摆件伴手礼物", "啡趣精品挂耳咖啡现磨美式黑咖啡无糖滤挂式手冲咖啡粉新鲜烘焙风味原产地新朋友入会礼盒装", "野生金鲳鱼大号新鲜冷冻鲜活白鲳鱼海昌鱼平鱼海鲜水产 大号金鲳鱼*1条（约8两-1斤）", "SeeHe喜氢485ml瓶装 含氢饮用水 富氢水 水素水 弱碱性 办公室用水 12瓶装", "MASIL 玛丝兰韩国三次方氨基酸洗发水便携旅行装8ml去屑控油（8ml*20条/盒）", "中秋节送礼 广式月饼 手工酥皮 莲蓉乌月饼 休闲零食 散装蛋黄莲蓉乌米月饼*6个 50g", "黄海大鲅鱼新鲜鲅鱼鲅鱼整条鲅鱼马鲛鱼批发野生海捕鲅鱼 小号鲅鱼2500g（6两-8两/条）", "TIMESWIND天然新疆玉多彩葫芦莲花手串戈壁玉黄玉古风个性女款玉石手链 玉莲花珠葫芦手链", "S925银几何显脸瘦的耳环女潮时尚长款气质蝴蝶结流苏耳坠个性超仙百搭网红同款耳饰品 金色一对价", "中国龙瓷 生日礼物送女生男友情人节十二生肖摆件创意礼品工艺品德化白瓷器摆件伴手礼物 十二生肖-牛", "朗言 机器人项链男小丑嘻哈蹦迪毛衣卫衣潮网红ins吊坠欧美时尚百搭锁骨链男女情侣 机器人小丑项链", "【JD空运】云南高原种植丹东99草莓新鲜奶油草莓 平安夜送礼盒孕妇水果 坏果包赔 2盒中果 礼盒装", "国拓 地道纯猪肉脆皮烤肠300g 早餐热狗肠 纯肉肠 香肠 烧烤囤货食材 脆皮火山石烤肠 台湾烤肠", "排骨正宗香酥炸排骨速冻菜肴 快手菜 速食方便菜 蒜香腌制半成品 黑椒 半成品菜 排骨2包*500g", "荷美尔（Hormel）精选低温午餐肉300g/包 囤货必备全程冷链植物配料慢煮工艺口感绵密 火锅食材泡面搭档", "利客(RIKAY) 无线蓝牙耳机双唛长续航AI降噪挂耳式商务运动跑步开车代驾外卖适用苹果华为小米OPPO手机", "斐济原装进口 Fitsui斐粹 理疗级饮用天然矿泉水 高偏硅酸型高端饮用水 整箱1.5L*12瓶 1.5L整箱", "女士香水三件套装淡香清新自由之水反转巴黎香水礼盒套装情人节生日礼物节日送礼 【黑鸦片香水三件套/每瓶30ml】", "乐凡希 三明治火腿片 三连包 150克(50克 X 3) 冷藏熟食 早餐 西餐烘焙 烧烤食材 火锅食材 西餐食材", "康佳（KONKA）燃气灶单眼灶具 5.0KW猛火台式单灶液化气灶 家用不锈钢大火力灶台 JZY-D502Y（液化气）", "长杆粘毛器两用伸缩杆大号地板粘毛滚筒长柄粘毛神器可撕式替换芯拖地滚毛器沾尘纸清理沙发 长杆两用+（19CM共6卷粘纸）", "AULTRON牙结石去除器超声波洁牙器家用洁牙器洁牙仪可视洗牙器神器去黑黄牙结石牙垢茶渍烟渍清除器 金属蓝色【太空铝合金质感】", "柯梦迪（ Chredina）国潮无线充电器华为苹果通用桌面卡通图案迷你便携式 玲珑CR-W09 Type-C输入(安卓10W/苹果7.5W)", "全麦面包代餐吐司切片0脂肪0蔗糖健身粗粮面包片轻食早餐零食整箱装 真全麦0脂肪0蔗糖代餐面包 整箱1 真全麦0脂0蔗糖代餐面包 整箱1斤装(约24片)"],
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