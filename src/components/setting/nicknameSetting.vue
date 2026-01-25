<template>
  <div class="username-edit-container">
    <h3 class="edit-title">用户名</h3>
    
    <!-- 用户名输入框 -->
    <div class="input-wrapper">
      <label class="input-label" for="username">
        <!-- <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M19 21C19 21 19 19 19 19C19 19 16 18 12 18C8 18 5 19 5 19C5 19 5 21 5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg> -->
        <!-- 用户名 -->
      </label>
      
      <input
        ref="usernameInput"
        v-model="username"
        id="username"
        class="username-input"
        type="text"
        placeholder="请输入新的用户名"
        @input="validateUsername"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <!-- 验证状态提示 -->
      <div v-if="showTip" class="tip-text" :class="{ success: isValid, error: !isValid && username.length > 0 }">
        {{ tipText }}
      </div>
    </div>
    
    <!-- 提交按钮 -->
    <button 
      class="submit-btn"
      :disabled="!isValid || !username"
      @click="handleSubmit"
    >
      保存 / 修改
    </button>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'
const emit = defineEmits(['change'])

// 响应式数据
const username = ref('')
const isFocused = ref(false)
const isValid = ref(false)
const showTip = ref(false)
const usernameInput = ref(null)

// 验证提示文本
const tipText = computed(() => {
  if (!username.value) return '用户名不能为空'
  if (username.value.length < 3) return '用户名至少3个字符'
  if (username.value.length > 16) return '用户名最多16个字符'
  if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username.value)) return '仅支持字母、数字、下划线、中文字符'
  return '用户名格式正确😊'
})

// 验证用户名
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
    // 这里替换为你的实际提交逻辑
    emit('change', username.value)
    // 示例：清空输入框
    username.value = ''
    showTip.value = false
  }
}
</script>

<style scoped>
/* 容器样式 */
.username-edit-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
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

/* 提交按钮 */
.submit-btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 按钮禁用状态 */
.submit-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  opacity: 0.8;
}

/* 按钮悬停状态 */
.submit-btn:not(:disabled):hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* 按钮点击状态 */
.submit-btn:not(:disabled):active {
  transform: translateY(0);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>