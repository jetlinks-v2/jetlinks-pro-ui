<template>
  <j-scrollbar :height="`calc(100% - 51px)`">
    <div class="box">
      <div class="content">
        <template v-if="bindList.length">
          <div class="content-item" v-for="item in bindList" :key="item.id">
            <div class="content-item-left">
              <img
                :src="item.logoUrl || getImage(bindIcon[item.provider])"
                style="height: 24px; width: 24px"
                alt=""
              />
              <j-ellipsis style="max-width: 200px; color: #333; margin: 0 8px 0 6px">
                {{ item?.name }}
              </j-ellipsis>
              <div>
                <span v-if="item.bound" style="color: #2ba245">已绑定</span>
                <span v-else style="color: #999">未绑定</span>
              </div>
              <div v-if="item.others?.name" style="color: #666666">
                {{ item.others?.name }}（已绑定的用户名）
              </div>
            </div>
            <div class="content-item-right">
              <a-popconfirm
                v-if="item.bound"
                title="确认解除绑定嘛?"
                @confirm="() => unBind(item.id)"
              >
                <a-button>解除绑定</a-button>
              </a-popconfirm>
              <a-button v-else ghost type="primary" @click="clickBind(item.id)">立即绑定</a-button>
            </div>
          </div>
        </template>
        <j-empty v-else style="margin: 200px 0" />
      </div>
    </div>
  </j-scrollbar>
</template>

<script setup lang="ts">
import { BASE_API } from '@jetlinks-web/constants';
import { getSsoBinds_api, unBind_api } from '@/api/account/center';
import { onlyMessage, getImage } from '@jetlinks-web/utils';

const bindList = ref<any[]>([]);
const bindIcon = {
  'dingtalk-ent-app': '/notice/dingtalk.png',
  'wechat-webapp': '/notice/wechat.png',
  'internal-standalone': '/apply/internal-standalone.png',
  'third-party': '/apply/third-party.png',
};
const unBind = (id: string) => {
  unBind_api(id).then(resp => {
    if (resp.status === 200) {
      onlyMessage('解绑成功', 'success');
      getSsoBinds();
    }
  });
};
const clickBind = (id: string) => {
  window.open(`${BASE_API}/application/sso/${id}/login?autoCreateUser=false`);
  localStorage.setItem('onBind', 'false');
  localStorage.setItem('onLogin', 'yes');
  window.onstorage = e => {
    if (e.newValue) {
      getSsoBinds();
    }
  };
};

/**
 * 获取绑定第三方账号
 */
function getSsoBinds() {
  getSsoBinds_api().then((resp: any) => {
    if (resp.status === 200) {
      bindList.value = resp.result.filter((item: any) => {
        return !item.features.includes('ssoUnsupportedRedirect');
      });
    }
  });
}

onMounted(() => {
  getSsoBinds();
});
</script>

<style lang="less" scoped>
.box {
  display: flex;
  justify-content: center;
  width: 100%;
  .content {
    width: 100%;
    .content-item {
      width: 100%;
      margin-bottom: 16px;
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      border-radius: 6px;
      background: #f7f8fa;

      .content-item-left {
        display: flex;
        gap: 24px;
        align-items: center;
      }
    }

    .content-item-right {
      :deep(button) {
        &:hover {
          background-color: @primary-color;
          color: #fff;
        }
      }
    }
  }
}
</style>
