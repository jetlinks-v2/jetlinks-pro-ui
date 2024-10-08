<template>
  <a-modal
    visible
    :title="modalType === 'add' ? '新增' : '编辑'"
    width="670px"
    @cancel="emits('update:visible', false)"
    @ok="confirm"
    :confirm-loading="loading"
  >
    <a-form ref="formRef" :model="form" layout="vertical">
      <a-form-item
        name="name"
        label="名称"
        :rules="[
          { required: true, message: '请输入名称' },
          { max: 64, message: '最多可输入64个字符' },
        ]"
      >
        <a-input v-model:value="form.name" placeholder="请输入角色名称" allow-clear />
      </a-form-item>
      <a-form-item name="groupId" label="分组" :rules="[{ required: true, message: '请选择分组' }]">
        <a-select v-model:value="form.groupId" placeholder="请选择分组" :options="groupOptions" />
      </a-form-item>
      <a-form-item name="name" label="说明">
        <a-textarea
          v-model:value="form.description"
          placeholder="请输入说明"
          allow-clear
          :maxlength="200"
          show-count
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts" name="RoleAddDialog">
import { saveRole_api, queryRoleGroup, updateRole_api } from '@/api/system/role';
import { useMenuStore } from '@/store/menu';
import { onlyMessage } from '@jetlinks-web/utils';
const route = useRoute();
const { jumpPage } = useMenuStore();

const emits = defineEmits(['update:visible']);
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  groupId: {
    type: String,
    default: '',
  },
  modalType: {
    type: String,
    default: 'add',
  },
  current: {
    type: Object,
    default: () => ({}),
  },
});
// 弹窗相关
const loading = ref(false);
const form = ref<any>({
  name: '',
  groupId: '',
  description: '',
});
const formRef = ref<any>();
const groupOptions = ref<any>([]);
const confirm = async () => {
  loading.value = true;
  formRef.value
    ?.validate()
    .then(() => {
      if (props.modalType === 'add') {
        saveRole_api(form.value)
          .then((resp: any) => {
            if (resp.status === 200) {
              onlyMessage('操作成功');
              emits('update:visible', false);
              if (route.query.save) {
                if ((window as any).onTabSaveSuccess) {
                  (window as any).onTabSaveSuccess(resp.result.id);
                  setTimeout(() => window.close(), 300);
                }
              } else jumpPage(`system/Role/Detail`, { params: { id: resp.result.id } });
            }
          })
          .catch(() => (loading.value = false));
      } else {
        updateRole_api(form.value)
          .then((resp: any) => {
            if (resp.status === 200) {
              onlyMessage('操作成功');
              emits('update:visible', false);
            }
          })
          .catch(() => (loading.value = false));
      }
    })
    .catch(() => (loading.value = false));
};
// 表单相关
const getGroupOptions = () => {
  queryRoleGroup({ sorts: [{ name: 'createTime', order: 'desc' }] }).then((res: any) => {
    if (res.status === 200) {
      groupOptions.value = res.result.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    }
  });
};
onMounted(() => {
  getGroupOptions();
  form.value.groupId = props.groupId;
  if (props.modalType === 'edit') {
    form.value = props.current;
  }
});
</script>

<style scoped></style>
