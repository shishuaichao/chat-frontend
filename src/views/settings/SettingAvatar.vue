
<template>
  <van-nav-bar
    :title="route.meta.title"
    :left-arrow="!!isChange"
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
import { ref, onMounted, onActivated } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { showLoadingToast, showSuccessToast, closeToast } from 'vant'
import { fetchUserUpdate } from '@/api/index.js'
import { IMG_LIST_URL, IMG_REAL_URL, IMG_ONEPAGE_NUM } from '@/utils/constant.js'

const router = useRouter()
const route = useRoute() 

const isChange = ref(null)
onActivated(() => {
  isChange.value = localStorage.getItem('avatar') !== null
})
const handleSubmit = () => {
  isLoading.value = true
  showLoadingToast({
    message: '上传中...',
    forbidClick: true,
    duration: 0,
  })
  let params = {
    username: localStorage.getItem('username'),
    avatar: IMG_REAL_URL + activeImgId.value
  }
  fetchUserUpdate(params)
    .then(res => {
      if (res.code === 200) {
        localStorage.setItem('avatar', IMG_REAL_URL + activeImgId.value)
        showSuccessToast({
          message: '头像上传成功',
          duration: 500,
        })
        setTimeout(() => {
          isChange.value ? router.back() : router.replace('/')
        }, 500)
      }
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      setTimeout(() => {
        isLoading.value = false
      }, 500)
  })
};

const smallImgList = ref([]); // 存储批量小图
// 批量获取小图方法
const getBatchSmallImgs = async () => {
  let pageNum = Math.floor(Math.random() * pageMaxNum) + 1
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 0,
  });
  loadNum = 0
  const res = await fetch(`${IMG_LIST_URL}?limit=${IMG_ONEPAGE_NUM}&page=${pageNum}`);
  const imgData = await res.json();
  smallImgList.value = imgData.map(item => ({
    id: item.id,
    smallUrl: `${IMG_REAL_URL}${item.id}`
  }));
};

const onClickLeft = () => {
  router.back()
}

let loadNum = 0
const imgLoad = () => {
  loadNum++
  if (loadNum > IMG_ONEPAGE_NUM/2) {
    isLoading.value = false
    closeToast()
  }
}

const isLoading = ref(true);
const pageMaxNum = 20
const changeImgs = () => {
  smallImgList.value = [];
  isLoading.value = true;
  getBatchSmallImgs();
};

const activeImgId = ref(null); 
const imageCheck = (id) => {
  activeImgId.value = id;
};

onMounted(() => {
  getBatchSmallImgs();
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