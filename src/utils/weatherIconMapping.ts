/**
 * 天气图标映射系统
 * 将WeatherAPI的天气代码映射到本地SVG图标文件
 */

// SVG图标文件名映射表（基于文件名分析）
export const SVG_ICON_MAP = {
  // 晴天系列
  '1baitianqing': '白天晴', // 白天晴朗
  '2yejianqing': '夜间晴', // 夜间晴朗
  
  // 多云系列
  '3qingtianduoyun': '晴天多云', // 白天多云
  '4yewanduoyun': '夜晚多云', // 夜间多云
  '5yin': '阴天', // 阴天
  
  // 雨天系列
  '6baitianzhenyu': '白天阵雨', // 白天阵雨
  '7yewanzhenyu': '夜晚阵雨', // 夜间阵雨
  '8leizhenyu': '雷阵雨', // 雷阵雨
  '11xiaoyu': '小雨', // 小雨
  '12zhongyu': '中雨', // 中雨
  '13dayu': '大雨', // 大雨
  '14baoyu': '暴雨', // 暴雨
  '15dabaoyu': '大暴雨', // 大暴雨
  '16tedabaoyu': '特大暴雨', // 特大暴雨
  '25dongyu': '冻雨', // 冻雨
  
  // 雪天系列
  '9zhenyujiaxue': '阵雨夹雪', // 阵雨夹雪
  '10yujiaxue': '雨夹雪', // 雨夹雪
  '17qingtianzhenxue': '晴天阵雪', // 白天阵雪
  '18yejianzhenxue': '夜间阵雪', // 夜间阵雪
  '19xiaoxue': '小雪', // 小雪
  '20zhongxue': '中雪', // 中雪
  '21daxue': '大雪', // 大雪
  '22baoxue': '暴雪', // 暴雪
  
  // 雾霾系列
  '23qingtianwu': '晴天雾', // 白天雾
  '24yejianwu': '夜间雾', // 夜间雾
  '29wumai': '雾霾', // 雾霾
  
  // 沙尘系列
  '26shachenbao': '沙尘暴', // 沙尘暴
  '27fuchen': '浮尘', // 浮尘
  '28yangsha': '扬沙', // 扬沙
  
  // 极端天气
  '30taifeng': '台风', // 台风
  '31reqiwengao': '热气温高', // 高温
  '32lengqiwendi': '冷气温低', // 低温
};

// WeatherAPI天气代码到本地SVG图标的映射
export const WEATHER_CODE_TO_ICON: Record<number, { day: string; night: string }> = {
  // 1000: 晴天/晴朗
  1000: {
    day: '1baitianqing',
    night: '2yejianqing'
  },
  
  // 1003: 部分多云
  1003: {
    day: '3qingtianduoyun',
    night: '4yewanduoyun'
  },
  
  // 1006: 多云
  1006: {
    day: '3qingtianduoyun',
    night: '4yewanduoyun'
  },
  
  // 1009: 阴天
  1009: {
    day: '5yin',
    night: '5yin'
  },
  
  // 1030: 雾
  1030: {
    day: '23qingtianwu',
    night: '24yejianwu'
  },
  
  // 1063: 可能有小雨
  1063: {
    day: '6baitianzhenyu',
    night: '7yewanzhenyu'
  },
  
  // 1066: 可能有小雪
  1066: {
    day: '17qingtianzhenxue',
    night: '18yejianzhenxue'
  },
  
  // 1069: 可能有雨夹雪
  1069: {
    day: '10yujiaxue',
    night: '10yujiaxue'
  },
  
  // 1072: 可能有冻雨
  1072: {
    day: '25dongyu',
    night: '25dongyu'
  },
  
  // 1087: 可能有雷暴
  1087: {
    day: '8leizhenyu',
    night: '8leizhenyu'
  },
  
  // 1114: 吹雪
  1114: {
    day: '21daxue',
    night: '21daxue'
  },
  
  // 1117: 暴雪
  1117: {
    day: '22baoxue',
    night: '22baoxue'
  },
  
  // 1135: 雾
  1135: {
    day: '23qingtianwu',
    night: '24yejianwu'
  },
  
  // 1147: 冰雾
  1147: {
    day: '23qingtianwu',
    night: '24yejianwu'
  },
  
  // 1150: 小毛毛雨
  1150: {
    day: '11xiaoyu',
    night: '11xiaoyu'
  },
  
  // 1153: 毛毛雨
  1153: {
    day: '11xiaoyu',
    night: '11xiaoyu'
  },
  
  // 1168: 冻毛毛雨
  1168: {
    day: '25dongyu',
    night: '25dongyu'
  },
  
  // 1171: 大冻毛毛雨
  1171: {
    day: '25dongyu',
    night: '25dongyu'
  },
  
  // 1180: 小阵雨
  1180: {
    day: '6baitianzhenyu',
    night: '7yewanzhenyu'
  },
  
  // 1183: 小雨
  1183: {
    day: '11xiaoyu',
    night: '11xiaoyu'
  },
  
  // 1186: 中等阵雨
  1186: {
    day: '6baitianzhenyu',
    night: '7yewanzhenyu'
  },
  
  // 1189: 中雨
  1189: {
    day: '12zhongyu',
    night: '12zhongyu'
  },
  
  // 1192: 大阵雨
  1192: {
    day: '6baitianzhenyu',
    night: '7yewanzhenyu'
  },
  
  // 1195: 大雨
  1195: {
    day: '13dayu',
    night: '13dayu'
  },
  
  // 1198: 小冻雨
  1198: {
    day: '25dongyu',
    night: '25dongyu'
  },
  
  // 1201: 中到大冻雨
  1201: {
    day: '25dongyu',
    night: '25dongyu'
  },
  
  // 1204: 小雨夹雪
  1204: {
    day: '10yujiaxue',
    night: '10yujiaxue'
  },
  
  // 1207: 中到大雨夹雪
  1207: {
    day: '10yujiaxue',
    night: '10yujiaxue'
  },
  
  // 1210: 小阵雪
  1210: {
    day: '17qingtianzhenxue',
    night: '18yejianzhenxue'
  },
  
  // 1213: 小雪
  1213: {
    day: '19xiaoxue',
    night: '19xiaoxue'
  },
  
  // 1216: 中等阵雪
  1216: {
    day: '17qingtianzhenxue',
    night: '18yejianzhenxue'
  },
  
  // 1219: 中雪
  1219: {
    day: '20zhongxue',
    night: '20zhongxue'
  },
  
  // 1222: 大阵雪
  1222: {
    day: '17qingtianzhenxue',
    night: '18yejianzhenxue'
  },
  
  // 1225: 大雪
  1225: {
    day: '21daxue',
    night: '21daxue'
  },
  
  // 1237: 冰粒
  1237: {
    day: '10yujiaxue',
    night: '10yujiaxue'
  },
  
  // 1240: 小阵雨
  1240: {
    day: '6baitianzhenyu',
    night: '7yewanzhenyu'
  },
  
  // 1243: 中到大阵雨
  1243: {
    day: '6baitianzhenyu',
    night: '7yewanzhenyu'
  },
  
  // 1246: 暴雨
  1246: {
    day: '14baoyu',
    night: '14baoyu'
  },
  
  // 1249: 小雨夹雪阵雨
  1249: {
    day: '9zhenyujiaxue',
    night: '9zhenyujiaxue'
  },
  
  // 1252: 中到大雨夹雪阵雨
  1252: {
    day: '9zhenyujiaxue',
    night: '9zhenyujiaxue'
  },
  
  // 1255: 小阵雪
  1255: {
    day: '17qingtianzhenxue',
    night: '18yejianzhenxue'
  },
  
  // 1258: 中到大阵雪
  1258: {
    day: '17qingtianzhenxue',
    night: '18yejianzhenxue'
  },
  
  // 1261: 小冰粒阵雨
  1261: {
    day: '10yujiaxue',
    night: '10yujiaxue'
  },
  
  // 1264: 中到大冰粒阵雨
  1264: {
    day: '10yujiaxue',
    night: '10yujiaxue'
  },
  
  // 1273: 小雷阵雨
  1273: {
    day: '8leizhenyu',
    night: '8leizhenyu'
  },
  
  // 1276: 中到大雷阵雨
  1276: {
    day: '8leizhenyu',
    night: '8leizhenyu'
  },
  
  // 1279: 小雷阵雪
  1279: {
    day: '8leizhenyu', // 使用雷阵雨图标
    night: '8leizhenyu'
  },
  
  // 1282: 中到大雷阵雪
  1282: {
    day: '8leizhenyu', // 使用雷阵雨图标
    night: '8leizhenyu'
  }
};

/**
 * 根据天气代码和时间获取对应的SVG图标文件名
 * @param weatherCode WeatherAPI天气代码
 * @param isDay 是否为白天 (1为白天，0为夜间)
 * @returns SVG图标文件名
 */
export function getWeatherIcon(weatherCode: number, isDay: number): string {
  const iconMapping = WEATHER_CODE_TO_ICON[weatherCode];
  
  if (!iconMapping) {
    // 如果没有找到对应的映射，返回默认图标
    return isDay ? '1baitianqing' : '2yejianqing';
  }
  
  return isDay ? iconMapping.day : iconMapping.night;
}

/**
 * 获取SVG图标的完整路径
 * @param iconName 图标文件名（不含扩展名）
 * @returns 完整的图标路径
 */
export function getIconPath(iconName: string): string {
  return `/weather(SVG)/${iconName}.svg`;
}
