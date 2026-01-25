<template>
  <van-nav-bar
    :title="route.meta.title"
    left-arrow
    @click-left="onClickLeft"
  />
  <div class="username-edit-container">
    <!-- 昵称输入框 -->
    <div class="input-wrapper">
      <label class="input-label" for="username">
      </label>
      
      <input
        ref="usernameInput"
        v-model="username"
        id="username"
        class="username-input"
        type="text"
        placeholder="请输入新的昵称"
        @input="validateUsername"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="handleSubmit"
      />
      
      <!-- 验证状态提示 -->
      <div v-if="showTip" class="tip-text" :class="{ success: isValid, error: !isValid && username.length > 0 }">
        {{ tipText }}
      </div>
    </div>
    
    <van-button type="primary" :disabled="!isValid || !username" block @click="handleSubmit">保  存</van-button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
const router = useRouter()
const route = useRoute() 

// 响应式数据
const username = ref('')
const isFocused = ref(false)
const isValid = ref(false)
const showTip = ref(false)

// 验证提示文本
const tipText = computed(() => {
  if (!username.value) return '昵称不能为空'
  if (username.value.length < 3) return '昵称至少3个字符'
  if (username.value.length > 16) return '昵称最多16个字符'
  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username.value)) return '仅支持字母、数字、下划线、中文字符'
  return '昵称格式正确'
})

// 验证昵称
const validateUsername = () => {
  showTip.value = true
  // 验证规则：3-16位，仅字母、数字、下划线、中文字符
  const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{3,16}$/
  isValid.value = reg.test(username.value)
}

// 输入框聚焦
const handleFocus = () => {
  isFocused.value = true
  if (username.value) showTip.value = true
}

// 输入框失焦
const handleBlur = () => {
  isFocused.value = false
  if (!username.value) showTip.value = false
}

// 提交处理
const handleSubmit = () => {
  if (isValid.value) {
    showToast({
      message: localStorage.getItem('nickname') ? '修改成功' : '设置成功',
      duration: 500,
    })
    localStorage.setItem('nickname', username.value)
    setTimeout(() => {
      onClickLeft()
    }, 500) 
  }
}
const onClickLeft = () => {
  router.back()
}
</script>

<style scoped>
/* 容器样式 */
.username-edit-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  /* background: #ffffff; */
  border-radius: 12px;
  /* box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); */
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* 标题样式 */
.edit-title {
  margin: 0 0 1.5rem 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
}

/* 输入框包装器 */
.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

/* 标签样式 */
.input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
}

/* 输入框样式 */
.username-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f2937;
  background: #f9fafb;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

/* 输入框聚焦状态 */
.username-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

/* 验证提示文本 */
.tip-text {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  line-height: 1.2;
  transition: all 0.2s ease;
}

/* 错误提示 */
.tip-text.error {
  color: #ef4444;
}

/* 成功提示 */
.tip-text.success {
  color: #10b981;
}

</style>