
<template>
  <h3 class="edit-title">请选择头像</h3>
  <!-- 提交按钮 -->
  <div>
    <button 
      class="submit-btn change-btn"
      :disabled="isLoading"
      @click="changeImgs"
    >
      {{ isLoading ? '加载中...' : '换一批' }}
    </button>
    <button 
      class="submit-btn"
      :disabled="activeImgId === null"
      @click="handleSubmit"
    >
      确认
    </button>
  </div>
  <div class="loading" v-if="isLoading">
    <img :src="loadingImg" alt="">
  </div>
  <div class="img-batch">
    <img 
      :class="{ active: activeImgId === img.id }"
      v-for="img in smallImgList" 
      :key="img.id" 
      :src="img.smallUrl" 
      alt="小图"
      @click="imageCheck(img.id)"
      @load="imgLoad"
    >
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
const emit = defineEmits(['change'])

const handleSubmit = () => {
  let imgUrl = smallImgList.value.find(img => img.id === activeImgId.value).smallUrl
  emit('change', imgUrl)  
  activeImgId.value = null
};

const smallImgList = ref([]); // 存储批量小图
const loadingImg = require('@/assets/loading.gif')
// 批量获取小图方法
const getBatchSmallImgs = async (size, limit, page) => {
  loadNum = 0
  const res = await fetch(`https://picsum.photos/v2/list?limit=${limit}&page=${page}`);
  const imgData = await res.json();
  smallImgList.value = imgData.map(item => ({
    id: item.id,
    smallUrl: `https://picsum.photos/${size}?image=${item.id}`
  }));
};

let loadNum = 0
const imgLoad = () => {
  loadNum++
  if (loadNum > 30) {
    isLoading.value = false
  }
}

const isLoading = ref(true);
const imgNum = 48
const imgSize = '30/30'
const changeImgs = () => {
  smallImgList.value = [];
  isLoading.value = true;
  let pageNum = Math.floor(Math.random() * 10) + 1
  getBatchSmallImgs(imgSize, imgNum, pageNum);
};

const activeImgId = ref(null); 
const imageCheck = (id) => {
  activeImgId.value = id;
};

onMounted(() => {
  let pageNum = Math.floor(Math.random() * 10) + 1
  getBatchSmallImgs(imgSize, imgNum, pageNum);
});
</script>
<style scoped>
.img-batch {
  overflow-y: auto;
  padding: 20px 10px 10px;
  border-top: 1px solid #ddd;
  /* border-bottom: 1px solid #ddd; */
  
  display: flex; 
  flex-wrap: wrap; 
  justify-content: space-between;
  overflow: hidden;
}
img {
  border-radius: 8px;
  width: 15%; 
  height: auto;
  margin-bottom: 10px;
  border: 2px solid transparent;
}
img.active {
  border: #2563eb 2px solid;
}
  /* 提交按钮 */
.submit-btn {
  width: 30%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 20px;
}
.change-btn {
  margin-right: 20px;
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
.loading {
  flex: 1;
  text-align: center;
  margin-bottom: 20px; 
  opacity: 0.3;
}
</style>