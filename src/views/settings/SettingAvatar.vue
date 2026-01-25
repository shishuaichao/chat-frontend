
<template>
  <van-nav-bar
    :title="route.meta.title"
    left-arrow
    @click-left="onClickLeft"
  />
  <!-- 提交按钮 -->
  <div class="submit-btn-container">
    <van-button :disabled="isLoading" size="small" plain hairline type="primary" @click="changeImgs">换一批</van-button>
    <van-button :disabled="activeImgId === null || isLoading" size="small" type="primary" @click="handleSubmit">确认</van-button>
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast } from 'vant';
const router = useRouter()
const route = useRoute() 

const handleSubmit = () => {
  let imgUrl = smallImgList.value.find(img => img.id === activeImgId.value).smallUrl
  localStorage.setItem('avatar', imgUrl)
  isLoading.value = false
  activeImgId.value = null
  showToast({
    message: '设置成功',
    duration: 500
  })
  setInterval(() => {
    router.back()
  }, 500)
};

const smallImgList = ref([]); // 存储批量小图
// 批量获取小图方法
const getBatchSmallImgs = async (size, limit, page) => {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0,
  });
  loadNum = 0
  const res = await fetch(`https://picsum.photos/v2/list?limit=${limit}&page=${page}`);
  const imgData = await res.json();
  smallImgList.value = imgData.map(item => ({
    id: item.id,
    smallUrl: `https://picsum.photos/${size}?image=${item.id}`
  }));
};

const onClickLeft = () => {
  router.back()
}

let loadNum = 0
const imgLoad = () => {
  loadNum++
  if (loadNum > imgNum/2) {
    isLoading.value = false
    closeToast()
  }
}

const isLoading = ref(true);
const imgNum = 18
const pageMaxNum = 20
const imgSize = '30/30'
const changeImgs = () => {
  smallImgList.value = [];
  isLoading.value = true;
  let pageNum = Math.floor(Math.random() * pageMaxNum) + 1
  getBatchSmallImgs(imgSize, imgNum, pageNum);
};

const activeImgId = ref(null); 
const imageCheck = (id) => {
  activeImgId.value = id;
};

onMounted(() => {
  let pageNum = Math.floor(Math.random() * pageMaxNum) + 1
  getBatchSmallImgs(imgSize, imgNum, pageNum);
});
</script>
<style scoped lang="scss">
.submit-btn-container {
  display: flex;
  justify-content: center;
  margin: 20px;
  .van-button:last-child {
    margin-left: 20px;
  }
}
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
.loading {
  flex: 1;
  text-align: center;
  margin-bottom: 20px; 
  opacity: 0.3;
}
</style>