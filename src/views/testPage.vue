<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 🌟 核心变量
const chatListRef = ref(null) // 聊天列表容器ref
const topTriggerRef = ref(null) // 顶部触发元素ref（监听的核心）
let observer = null // IntersectionObserver实例（单实例即可）
const isLoading = ref(false) // 加载锁：防止重复触发加载
const pageNo = ref(1) // 分页页码：加载历史消息用
const pageSize = ref(20) // 每页加载条数
const hasMore = ref(true) // 是否还有更多历史消息：防止无数据时重复请求

// 模拟消息列表（实际从后端获取，历史消息加载后添加到列表头部）
const msgList = ref([
  // 初始最新消息
  { id: 'msg1', content: '你好～', sender: 'other' },
  { id: 'msg2', content: '在吗？', sender: 'other' },
  { id: 'msg3', content: '在的，怎么了？', sender: 'me' }
])

// 🌟 核心2：初始化IntersectionObserver，监听顶部触发元素
const initTopObserver = () => {
  // 确保触发元素和列表容器DOM存在
  if (!topTriggerRef.value || !chatListRef.value) return

  // 创建单实例，仅监听顶部触发元素
  observer = new IntersectionObserver(
    (entries) => {
      // entries只有一个元素（仅监听了topTriggerRef），直接取[0]
      const entry = entries[0]
      // 🌟 触顶判定：触发元素进入可视区（isIntersecting为true）+ 有更多数据 + 未在加载
      if (entry.isIntersecting && hasMore.value && !isLoading.value) {
        console.log('滚动到顶部，开始加载历史消息')
        loadHistoryMsg() // 执行加载历史消息逻辑
      }
    },
    {
      root: chatListRef.value, // 🌟 关键：监听列表局部滚动，而非全局视口
      rootMargin: '0px',
      threshold: 0.1 // 触发元素露出10%即判定为触顶（可设0，刚露出就触发）
    }
  )

  // 监听顶部触发元素（单实例监听单个元素，核心）
  observer.observe(topTriggerRef.value)
}

// 🌟 核心3：加载历史消息的业务逻辑（实际替换为后端接口请求）
const loadHistoryMsg = async () => {
  // 加加载锁，防止重复触发
  isLoading.value = true
  try {
    // 模拟后端接口请求：分页获取历史消息
    // 实际代码替换为：const res = await api.getChatHistory({ pageNo: pageNo.value, pageSize: pageSize.value })
    console.log(`请求第${pageNo.value}页历史消息`)
    // 模拟返回的历史消息（时间更早的消息，id唯一）
    const historyMsg = Array.from({ length: pageSize.value }, (_, i) => ({
      id: `history_${pageNo.value}_${i}`,
      content: `历史消息${pageNo.value}-${i}`,
      sender: i % 2 === 0 ? 'other' : 'me'
    }))

    // 模拟无更多数据的情况（比如第3页后无数据）
    if (pageNo.value >= 3) {
      hasMore.value = false
    } else {
      // 🌟 历史消息添加到列表**头部**（聊天列表：旧消息在上，新消息在下）
      msgList.value = [...historyMsg, ...msgList.value]
      pageNo.value++ // 页码自增
    }
  } catch (err) {
    console.error('加载历史消息失败：', err)
  } finally {
    // 释放加载锁
    isLoading.value = false
  }
}

// 🌟 核心4：组件生命周期——初始化监听+销毁监听（防止内存泄漏）
onMounted(() => {
  initTopObserver() // 组件渲染完成后初始化监听
})

onUnmounted(() => {
  // 销毁实例，释放资源
  if (observer) {
    observer.unobserve(topTriggerRef.value) // 取消监听触发元素
    observer.disconnect() // 断开实例
    observer = null
  }
})
</script>