module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: '2021',
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  // 仅保留这部分核心配置，其他不变
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  },
  rules: {
    'no-undef': 'off',
    'vue/no-undef': 'off'
  }
}