<script setup lang="ts">
// 检查小程序更新逻辑
// #ifdef MP
onLaunch(() => {
  const updateManager = uni.getUpdateManager();
  updateManager.onCheckForUpdate(() => {
  });
  updateManager.onUpdateReady(() => {
    uni.showModal({
      content: "新版本已经准备好，是否重启应用？",
      showCancel: false,
      confirmText: "确定",
      success: res => {
        if (res.confirm) {
          updateManager.applyUpdate();
        }
      },
    });
  });
  updateManager.onUpdateFailed(() => {
  });
});
// #endif
</script>
<style>
</style>
