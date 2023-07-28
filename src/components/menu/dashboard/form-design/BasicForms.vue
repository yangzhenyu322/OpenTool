<template>
  <a-page-header title="基础表单" class="header-content" style="margin-top: 2px;text-align: left;font-size: 14px;">
      <span>基础表单的常见用法</span>
  </a-page-header>

  <!-- 更多功能请参考：https://next.antdv.com/components/form-cn -->
  <div class="center-content" style="background-color: white;display: flex;justify-content: center;">
    <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    style="width: 70%;"
  >
    <a-form-item ref="name" label="姓名" name="name">
      <a-input v-model:value="formState.name" />
    </a-form-item>
    <a-form-item label="性别" name="sex">
      <a-select v-model:value="formState.sex" placeholder="please select your sex">
        <a-select-option value="男">男</a-select-option>
        <a-select-option value="女">女</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="生日" required name="birthDay">
      <a-date-picker
        v-model:value="formState.birthDay"
        show-time
        type="date"
        placeholder="Pick a date"
        style="width: 100%"
      />
    </a-form-item>
    <a-form-item label="已婚" name="isMarried">
      <a-switch v-model:checked="formState.isMarried" />
    </a-form-item>
    <a-form-item label="爱好" name="hobbies">
      <a-checkbox-group v-model:value="formState.hobbies">
        <a-checkbox value="羽毛球" name="type">羽毛球</a-checkbox>
        <a-checkbox value="乒乓球" name="type">乒乓球</a-checkbox>
        <a-checkbox value="爬山" name="type">爬山</a-checkbox>
        <a-checkbox value="越野" name="type">越野</a-checkbox>
        <a-checkbox value="其他" name="type">其他</a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item label="工作" name="isWork">
      <a-radio-group v-model:value="formState.isWork">
        <a-radio value="已工作">已工作</a-radio>
        <a-radio value="未工作">未工作</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="自我描述" name="desc">
      <a-textarea v-model:value="formState.desc" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">Create</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
    </a-form-item>
  </a-form>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRaw, toRefs } from 'vue';
import { message } from 'ant-design-vue';

export default defineComponent({
  setup(){
    const formRef = ref();
    const state = reactive({
      // label长度
      labelCol: {
        span: 5,
      },
      // 输入框长度
      wrapperCol : {
        span: 13,
      },
      // 表单数据
      formState: reactive({
        name: '',
        sex: undefined,
        birthDay: undefined,
        isMarried: false,
        hobbies: [],
        isWork: '',
        desc: '',
      }),
      // 表单验证规则
      rules: {
        name: [{
          required: true,
          message: '请填写您的名字',
          trigger: 'change',
        }, {
          min: 5,
          max: 30,
          message: '名字长度为5-30个字符',
          trigger: 'blur',
        }],
        sex: [{
          required: true,
          message: '请选择您的性别',
          trigger: 'change',
        }],
        birthDay: [{
          required: true,
          message: '请选择您的出生日期',
          trigger: 'change',
          type: 'object',
        }],
        hobbies: [{
          type: 'array',
          required: true,
          message: '请选择至少一个爱好',
          trigger: 'change',
        }],
        isWork: [{
          required: true,
          message: '请选择您的工作情况',
          trigger: 'change',
        }],
        desc: [{
          required: false,
          message: '请填写您的自我描述',
          trigger: 'blur',
        }],
      },
    })

    // 提交表单
    const onSubmit = () => {
      formRef.value.validate().then(() => {
        console.log('values', state.formState, toRaw(state.formState));
        message.success('已提交',3)
      }).catch(error => {
        console.log('error', error);
        message.error('信息有误，请检查后重新提交',5)
      });
    };

    // 重置表单
    const resetForm = () => {
      formRef.value.resetFields();
    };

    return{
      formRef,
      ...toRefs(state),
      onSubmit,
      resetForm
    }
  }
})
</script>