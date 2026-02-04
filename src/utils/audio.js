
// 通用音效播放器
export const createSoundPlayer = (src) => {
  const audio = new Audio(src);
  audio.preload = 'auto';
  return {
    play: () => {
      audio.currentTime = 0;
      return audio.play().catch(e => console.warn('音效播放失败', e));
    },
    pause: () => audio.pause()
  };
};

// 初始化常用音效
export const sound = {
  send: createSoundPlayer(require('@/assets/audio/send.mp3')),
  receive: createSoundPlayer(require('@/assets/audio/receive.mp3'))
};