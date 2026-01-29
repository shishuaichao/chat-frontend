/**
 * 格式化时间为人性化文本（完美兼容 GMT/UTC 格式，强制中国时区 UTC+8）
 * @param {Number|String|Date} time - 任意时间格式（时间戳/字符串/Date对象，含GMT格式）
 * @returns {String} 人性化时间文本（刚刚/1分钟前/昨天 12:30:25/2026-01-25 10:15:30）
 */
export function formatRelativeTime(time) {
  // 1. 工具函数：补零
  const padZero = (num) => num.toString().padStart(2, '0');

  // 2. 统一转为【中国时区】的毫秒级时间戳（核心修复GMT解析）
  // let targetTimestamp;
  try {
    let utcTimestamp; // 先统一转为UTC时间戳，再转中国时区
    if (typeof time === 'number') {
      // 时间戳（秒级→毫秒级）：本身是UTC，直接用
      utcTimestamp = time.toString().length === 10 ? time * 1000 : time;
    } else if (typeof time === 'string') {
      time += '+8'
      // 处理所有字符串格式（重点修复GMT/UTC格式）
      const date = new Date(time);
      if (isNaN(date.getTime())) throw new Error('无效时间字符串');
      // 无论输入字符串是什么时区，先转为UTC时间戳
      utcTimestamp = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      );
    } else if (time instanceof Date) {
      // Date对象：转为UTC时间戳
      utcTimestamp = Date.UTC(
        time.getUTCFullYear(),
        time.getUTCMonth(),
        time.getUTCDate(),
        time.getUTCHours(),
        time.getUTCMinutes(),
        time.getUTCSeconds()
      );
    } else {
      return '无效时间';
    }

    // 3. UTC时间戳 → 中国时区（UTC+8）时间戳
    const chinaTimezoneOffset = 0; // 8小时偏移
    const chinaTimestamp = utcTimestamp + chinaTimezoneOffset;
    const chinaDate = new Date(chinaTimestamp);

    // 4. 当前中国时间的UTC戳 + 8小时偏移（用于对比）
    const nowUTC = Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      new Date().getUTCHours(),
      new Date().getUTCMinutes(),
      new Date().getUTCSeconds()
    );
    const nowChinaTimestamp = nowUTC + chinaTimezoneOffset;
    const nowChinaDate = new Date(nowChinaTimestamp);

    // 5. 计算时间差（秒）
    const diffSeconds = Math.floor((nowChinaTimestamp - chinaTimestamp) / 1000);

    // 6. 解析中国时区的时分秒/年月日
    const hh = padZero(chinaDate.getHours());
    const mm = padZero(chinaDate.getMinutes());
    // const ss = padZero(chinaDate.getSeconds());
    const timeStr = `${hh}:${mm}`;

    const year = padZero(chinaDate.getFullYear());
    const month = padZero(chinaDate.getMonth() + 1);
    const day = padZero(chinaDate.getDate());
    const dateStr = `${year}-${month}-${day}`;

    // 7. 计算中国时区「今天/昨天/前天」00:00:00 的时间戳
    const todayStart = new Date(nowChinaDate);
    todayStart.setHours(0, 0, 0, 0);
    const todayStartTimestamp = todayStart.getTime();

    const yesterdayStartTimestamp = todayStartTimestamp - 24 * 60 * 60 * 1000;
    const beforeYesterdayStartTimestamp = yesterdayStartTimestamp - 24 * 60 * 60 * 1000;

    // 8. 分级返回结果
    if (diffSeconds < 60) {
      return '刚刚';
    } else if (diffSeconds < 120) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes}分钟前`;
    } else if (chinaTimestamp >= todayStartTimestamp) {
      return timeStr;
    } else if (chinaTimestamp >= yesterdayStartTimestamp) {
      return `昨天 ${timeStr}`;
    } else if (chinaTimestamp >= beforeYesterdayStartTimestamp) {
      return `前天 ${timeStr}`;
    } else {
      return `${dateStr} ${timeStr}`;
    }
  } catch (error) {
    console.warn('时间格式化失败：', error, '输入值：', time);
    return '无效时间';
  }
}

export default formatRelativeTime