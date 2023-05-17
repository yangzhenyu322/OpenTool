<template>
    <div style="display: flex;justify-content: center;">
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="仿真数据集" v-bind="validateInfos.dataset">
          <a-select v-model:value="modelRef.dataset" placeholder="选择仿真数据集">
            <a-select-option value="卫星巡航侦查">卫星巡航侦查</a-select-option>
            <a-select-option value="卫星地质勘测">卫星地质勘测</a-select-option>
            <a-select-option value="雷达目标检测">雷达目标检测</a-select-option>
            <a-select-option value="网络漏洞安全攻防">网络漏洞安全攻防</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="数据集数量" v-bind="validateInfos.numbers">
          <a-input v-model:value="modelRef.numbers" type="number" placeholder="Input a number" style="text-align: center;" />
        </a-form-item>
        <a-form-item label="模型选择" v-bind="validateInfos.modelName">
          <a-select v-model:value="modelRef.modelName" placeholder="选择关联分析模型">
            <a-select-option value="Apriori">Apriori</a-select-option>
            <a-select-option value="SETM">SETM</a-select-option>
            <a-select-option value="FP-Tree">FP-Tre</a-select-option>
            <a-select-option value="Bayesian">Bayesian</a-select-option>
          </a-select>
        </a-form-item>
        <!-- <a-form-item label="Batch-size" v-bind="validateInfos.batch">
          <a-input v-model:value="modelRef.batch" type="number" placeholder="Input a number" style="text-align: center;" />
        </a-form-item> -->
        <a-form-item label="效能指标" v-bind="validateInfos.efficiencies">
          <a-checkbox-group v-model:value="modelRef.efficiencies">
            <a-checkbox value="count" name="efficiencies">count</a-checkbox>
            <a-checkbox value="windowAvg" name="efficiencies">windowAvg</a-checkbox>
            <a-checkbox value="windowMax" name="efficiencies">windowMax</a-checkbox>
            <a-checkbox value="windowMin" name="efficiencies">windowMin</a-checkbox>
            <a-checkbox value="respTimeAvg" name="efficiencies">respTimeAvg</a-checkbox>
            <a-checkbox value="timelinessAvg" name="efficiencies">timelinessAvg</a-checkbox>
            <a-checkbox value="closeLoopTimeAvg" name="efficiencies">closeLoopTimeAvg</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button  @click="resetFields">重置</a-button>
          <a-button style="margin-left: 10px" type="primary" @click.prevent="onSubmit">创建</a-button>
        </a-form-item>
      </a-form>
    </div>
  </template>
  <script>
    import { defineComponent, getCurrentInstance, reactive } from 'vue';
    import { Form } from 'ant-design-vue';
    
    const useForm = Form.useForm;
    export default defineComponent({
        name: "StepOne",
        setup() {
        const modelRef = reactive({
            dataset: '卫星地质勘测',
            numbers: 100,
            modelName: 'Bayesian',
            // batch: 60,
            efficiencies: ['count','windowAvg','windowMax','windowMin','respTimeAvg','timelinessAvg','closeLoopTimeAvg'],
        });

        const rulesRef = reactive({
            dataset: [
                {
                    required: true,
                    message: '请选择仿真数据集',
                }
            ],
            numbers: [
                {
                    required: true,
                    message: '请输入数据集大小（数字）',
                }
            ],
            modelName: [
                {
                    required: true,
                    message: '请选择关联分析模型',
                }
            ],
            // batch: [
            //     {
            //         required: true,
            //         message: '请输入模型训练batch-size(60~200)',
            //     }
            // ],
            efficiencies: [
                {
                    required: true,
                    message: '选择目标效能指标',
                    type: 'array',
                }
            ],
        });
        const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);
        const instance = getCurrentInstance();
        const onSubmit = () => {
            validate()
            .then(() => {
                console.log("create succesful")
                instance.emit('submit', modelRef)
            })
            .catch(err => {
                console.log('error', err);
            });
        };
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            validateInfos,
            resetFields,
            modelRef,
            onSubmit,
        };
        },
    });
  </script>
  