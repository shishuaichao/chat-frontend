/**
 * 格式化时间为人性化文本
 * @param {Number|String|Date} time - 任意时间格式（时间戳/字符串/Date对象）
 * @returns {String} 人性化时间文本（如：刚刚、1分钟前、昨天 12:30:25、2026-01-25 10:15:30）
 */
export function formatRelativeTime(time) {
  // 1. 处理入参，统一转为时间戳（兼容各种时间格式）
  let timestamp;
  if (typeof time === 'number') {
    // 处理秒级/毫秒级时间戳（补全13位）
    timestamp = time.toString().length === 10 ? time * 1000 : time;
  } else if (typeof time === 'string') {
    timestamp = new Date(time).getTime();
  } else if (time instanceof Date) {
    timestamp = time.getTime();
  } else {
    return '无效时间'; // 入参不合法时返回
  }

  // 2. 计算时间差（秒）
  const now = Date.now();
  const diff = (now - timestamp) / 1000; // 时间差（秒）

  // 3. 定义格式化工具函数（补零）
  const padZero = (num) => num.toString().padStart(2, '0');

  // 4. 格式化目标时间为 hh:mm:ss
  const targetDate = new Date(timestamp);
  const hh = padZero(targetDate.getHours());
  const mm = padZero(targetDate.getMinutes());
  const ss = padZero(targetDate.getSeconds());
  const timeStr = `${hh}:${mm}:${ss}`;

  // 5. 格式化目标时间为 yyyy-mm-dd
  const year = targetDate.getFullYear();
  const month = padZero(targetDate.getMonth() + 1);
  const day = padZero(targetDate.getDate());
  const dateStr = `${year}-${month}-${day}`;

  // 6. 计算今天/昨天/前天的日期戳（用于对比）
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime(); // 今天 00:00:00 时间戳
  const yesterdayTimestamp = todayTimestamp - 24 * 60 * 60 * 1000; // 昨天 00:00:00
  const beforeYesterdayTimestamp = yesterdayTimestamp - 24 * 60 * 60 * 1000; // 前天 00:00:00

  // 7. 按时间差分级返回
  if (diff < 60) {
    return '刚刚'; // 1分钟内
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes}分钟前`; // 1小时内
  } else if (timestamp >= todayTimestamp) {
    return timeStr; // 今天（1小时后），返回时分秒
  } else if (timestamp >= yesterdayTimestamp) {
    return `昨天 ${timeStr}`; // 昨天
  } else if (timestamp >= beforeYesterdayTimestamp) {
    return `前天 ${timeStr}`; // 前天
  } else {
    return `${dateStr} ${timeStr}`; // 更早时间，返回完整日期+时分秒
  }
}

export default formatRelativeTime