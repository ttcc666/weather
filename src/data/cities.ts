export interface CityOption {
  value: string;
  label: string;
  province: string;
}

export const chineseCities: CityOption[] = [
  // 直辖市
  { value: 'Beijing', label: '北京', province: '直辖市' },
  { value: 'Shanghai', label: '上海', province: '直辖市' },
  { value: 'Tianjin', label: '天津', province: '直辖市' },
  { value: 'Chongqing', label: '重庆', province: '直辖市' },

  // 河北省
  { value: 'Shijiazhuang', label: '石家庄', province: '河北省' },
  { value: 'Tangshan', label: '唐山', province: '河北省' },
  { value: 'Qinhuangdao', label: '秦皇岛', province: '河北省' },
  { value: 'Handan', label: '邯郸', province: '河北省' },
  { value: 'Baoding', label: '保定', province: '河北省' },
  { value: 'Zhangjiakou', label: '张家口', province: '河北省' },
  { value: 'Langfang', label: '廊坊', province: '河北省' },

  // 山西省
  { value: 'Taiyuan', label: '太原', province: '山西省' },
  { value: 'Datong', label: '大同', province: '山西省' },
  { value: 'Yangquan', label: '阳泉', province: '山西省' },
  { value: 'Changzhi', label: '长治', province: '山西省' },
  { value: 'Jincheng', label: '晋城', province: '山西省' },

  // 内蒙古自治区
  { value: 'Hohhot', label: '呼和浩特', province: '内蒙古自治区' },
  { value: 'Baotou', label: '包头', province: '内蒙古自治区' },
  { value: 'Wuhai', label: '乌海', province: '内蒙古自治区' },
  { value: 'Ordos', label: '鄂尔多斯', province: '内蒙古自治区' },

  // 辽宁省
  { value: 'Shenyang', label: '沈阳', province: '辽宁省' },
  { value: 'Dalian', label: '大连', province: '辽宁省' },
  { value: 'Anshan', label: '鞍山', province: '辽宁省' },
  { value: 'Fushun', label: '抚顺', province: '辽宁省' },
  { value: 'Benxi', label: '本溪', province: '辽宁省' },
  { value: 'Dandong', label: '丹东', province: '辽宁省' },

  // 吉林省
  { value: 'Changchun', label: '长春', province: '吉林省' },
  { value: 'Jilin', label: '吉林', province: '吉林省' },
  { value: 'Siping', label: '四平', province: '吉林省' },
  { value: 'Liaoyuan', label: '辽源', province: '吉林省' },

  // 黑龙江省
  { value: 'Harbin', label: '哈尔滨', province: '黑龙江省' },
  { value: 'Qiqihar', label: '齐齐哈尔', province: '黑龙江省' },
  { value: 'Daqing', label: '大庆', province: '黑龙江省' },
  { value: 'Jixi', label: '鸡西', province: '黑龙江省' },

  // 江苏省
  { value: 'Nanjing', label: '南京', province: '江苏省' },
  { value: 'Wuxi', label: '无锡', province: '江苏省' },
  { value: 'Xuzhou', label: '徐州', province: '江苏省' },
  { value: 'Changzhou', label: '常州', province: '江苏省' },
  { value: 'Suzhou', label: '苏州', province: '江苏省' },
  { value: 'Nantong', label: '南通', province: '江苏省' },
  { value: 'Lianyungang', label: '连云港', province: '江苏省' },
  { value: 'Yangzhou', label: '扬州', province: '江苏省' },

  // 浙江省
  { value: 'Hangzhou', label: '杭州', province: '浙江省' },
  { value: 'Ningbo', label: '宁波', province: '浙江省' },
  { value: 'Wenzhou', label: '温州', province: '浙江省' },
  { value: 'Jiaxing', label: '嘉兴', province: '浙江省' },
  { value: 'Huzhou', label: '湖州', province: '浙江省' },
  { value: 'Shaoxing', label: '绍兴', province: '浙江省' },
  { value: 'Jinhua', label: '金华', province: '浙江省' },
  { value: 'Taizhou', label: '台州', province: '浙江省' },

  // 安徽省
  { value: 'Hefei', label: '合肥', province: '安徽省' },
  { value: 'Wuhu', label: '芜湖', province: '安徽省' },
  { value: 'Bengbu', label: '蚌埠', province: '安徽省' },
  { value: 'Huainan', label: '淮南', province: '安徽省' },
  { value: 'Huaibei', label: '淮北', province: '安徽省' },
  { value: 'Anqing', label: '安庆', province: '安徽省' },

  // 福建省
  { value: 'Fuzhou', label: '福州', province: '福建省' },
  { value: 'Xiamen', label: '厦门', province: '福建省' },
  { value: 'Putian', label: '莆田', province: '福建省' },
  { value: 'Sanming', label: '三明', province: '福建省' },
  { value: 'Quanzhou', label: '泉州', province: '福建省' },
  { value: 'Zhangzhou', label: '漳州', province: '福建省' },

  // 江西省
  { value: 'Nanchang', label: '南昌', province: '江西省' },
  { value: 'Jingdezhen', label: '景德镇', province: '江西省' },
  { value: 'Pingxiang', label: '萍乡', province: '江西省' },
  { value: 'Jiujiang', label: '九江', province: '江西省' },
  { value: 'Xinyu', label: '新余', province: '江西省' },
  { value: 'Ganzhou', label: '赣州', province: '江西省' },

  // 山东省
  { value: 'Jinan', label: '济南', province: '山东省' },
  { value: 'Qingdao', label: '青岛', province: '山东省' },
  { value: 'Zibo', label: '淄博', province: '山东省' },
  { value: 'Zaozhuang', label: '枣庄', province: '山东省' },
  { value: 'Dongying', label: '东营', province: '山东省' },
  { value: 'Yantai', label: '烟台', province: '山东省' },
  { value: 'Weifang', label: '潍坊', province: '山东省' },
  { value: 'Weihai', label: '威海', province: '山东省' },

  // 河南省
  { value: 'Zhengzhou', label: '郑州', province: '河南省' },
  { value: 'Kaifeng', label: '开封', province: '河南省' },
  { value: 'Luoyang', label: '洛阳', province: '河南省' },
  { value: 'Pingdingshan', label: '平顶山', province: '河南省' },
  { value: 'Anyang', label: '安阳', province: '河南省' },
  { value: 'Hebi', label: '鹤壁', province: '河南省' },
  { value: 'Xinxiang', label: '新乡', province: '河南省' },

  // 湖北省
  { value: 'Wuhan', label: '武汉', province: '湖北省' },
  { value: 'Huangshi', label: '黄石', province: '湖北省' },
  { value: 'Shiyan', label: '十堰', province: '湖北省' },
  { value: 'Yichang', label: '宜昌', province: '湖北省' },
  { value: 'Xiangyang', label: '襄阳', province: '湖北省' },
  { value: 'Ezhou', label: '鄂州', province: '湖北省' },

  // 湖南省
  { value: 'Changsha', label: '长沙', province: '湖南省' },
  { value: 'Zhuzhou', label: '株洲', province: '湖南省' },
  { value: 'Xiangtan', label: '湘潭', province: '湖南省' },
  { value: 'Hengyang', label: '衡阳', province: '湖南省' },
  { value: 'Shaoyang', label: '邵阳', province: '湖南省' },
  { value: 'Yueyang', label: '岳阳', province: '湖南省' },

  // 广东省
  { value: 'Guangzhou', label: '广州', province: '广东省' },
  { value: 'Shaoguan', label: '韶关', province: '广东省' },
  { value: 'Shenzhen', label: '深圳', province: '广东省' },
  { value: 'Zhuhai', label: '珠海', province: '广东省' },
  { value: 'Shantou', label: '汕头', province: '广东省' },
  { value: 'Foshan', label: '佛山', province: '广东省' },
  { value: 'Jiangmen', label: '江门', province: '广东省' },
  { value: 'Zhanjiang', label: '湛江', province: '广东省' },
  { value: 'Dongguan', label: '东莞', province: '广东省' },

  // 广西壮族自治区
  { value: 'Nanning', label: '南宁', province: '广西壮族自治区' },
  { value: 'Liuzhou', label: '柳州', province: '广西壮族自治区' },
  { value: 'Guilin', label: '桂林', province: '广西壮族自治区' },
  { value: 'Wuzhou', label: '梧州', province: '广西壮族自治区' },
  { value: 'Beihai', label: '北海', province: '广西壮族自治区' },

  // 海南省
  { value: 'Haikou', label: '海口', province: '海南省' },
  { value: 'Sanya', label: '三亚', province: '海南省' },
  { value: 'Sansha', label: '三沙', province: '海南省' },
  { value: 'Danzhou', label: '儋州', province: '海南省' },

  // 四川省
  { value: 'Chengdu', label: '成都', province: '四川省' },
  { value: 'Zigong', label: '自贡', province: '四川省' },
  { value: 'Panzhihua', label: '攀枝花', province: '四川省' },
  { value: 'Luzhou', label: '泸州', province: '四川省' },
  { value: 'Deyang', label: '德阳', province: '四川省' },
  { value: 'Mianyang', label: '绵阳', province: '四川省' },

  // 贵州省
  { value: 'Guiyang', label: '贵阳', province: '贵州省' },
  { value: 'Liupanshui', label: '六盘水', province: '贵州省' },
  { value: 'Zunyi', label: '遵义', province: '贵州省' },
  { value: 'Anshun', label: '安顺', province: '贵州省' },

  // 云南省
  { value: 'Kunming', label: '昆明', province: '云南省' },
  { value: 'Qujing', label: '曲靖', province: '云南省' },
  { value: 'Yuxi', label: '玉溪', province: '云南省' },
  { value: 'Baoshan', label: '保山', province: '云南省' },
  { value: 'Dali', label: '大理', province: '云南省' },
  { value: 'Lijiang', label: '丽江', province: '云南省' },

  // 西藏自治区
  { value: 'Lhasa', label: '拉萨', province: '西藏自治区' },
  { value: 'Shigatse', label: '日喀则', province: '西藏自治区' },
  { value: 'Chamdo', label: '昌都', province: '西藏自治区' },
  { value: 'Nyingchi', label: '林芝', province: '西藏自治区' },

  // 陕西省
  { value: 'Xian', label: '西安', province: '陕西省' },
  { value: 'Tongchuan', label: '铜川', province: '陕西省' },
  { value: 'Baoji', label: '宝鸡', province: '陕西省' },
  { value: 'Xianyang', label: '咸阳', province: '陕西省' },
  { value: 'Weinan', label: '渭南', province: '陕西省' },
  { value: 'Yanan', label: '延安', province: '陕西省' },

  // 甘肃省
  { value: 'Lanzhou', label: '兰州', province: '甘肃省' },
  { value: 'Jiayuguan', label: '嘉峪关', province: '甘肃省' },
  { value: 'Jinchang', label: '金昌', province: '甘肃省' },
  { value: 'Baiyin', label: '白银', province: '甘肃省' },
  { value: 'Tianshui', label: '天水', province: '甘肃省' },

  // 青海省
  { value: 'Xining', label: '西宁', province: '青海省' },
  { value: 'Haidong', label: '海东', province: '青海省' },

  // 宁夏回族自治区
  { value: 'Yinchuan', label: '银川', province: '宁夏回族自治区' },
  { value: 'Shizuishan', label: '石嘴山', province: '宁夏回族自治区' },
  { value: 'Wuzhong', label: '吴忠', province: '宁夏回族自治区' },
  { value: 'Guyuan', label: '固原', province: '宁夏回族自治区' },

  // 新疆维吾尔自治区
  { value: 'Urumqi', label: '乌鲁木齐', province: '新疆维吾尔自治区' },
  { value: 'Karamay', label: '克拉玛依', province: '新疆维吾尔自治区' },
  { value: 'Turpan', label: '吐鲁番', province: '新疆维吾尔自治区' },
  { value: 'Hami', label: '哈密', province: '新疆维吾尔自治区' },
  { value: 'Kashgar', label: '喀什', province: '新疆维吾尔自治区' },

  // 特别行政区
  { value: 'Hong Kong', label: '香港', province: '特别行政区' },
  { value: 'Macao', label: '澳门', province: '特别行政区' },
];

export const groupedCities = chineseCities.reduce((acc, city) => {
  if (!acc[city.province]) {
    acc[city.province] = [];
  }
  acc[city.province].push(city);
  return acc;
}, {} as Record<string, CityOption[]>);