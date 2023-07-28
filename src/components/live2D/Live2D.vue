<template>
    <div style="width: 100%;height: 100%;position:fixed;top: 0;left: 0;pointer-events: none;">
        <canvas id="live2DCanvas" style="z-index: 1000;"></canvas>
        <div class="tooltip" id="live2D-tooltip" v-if="showTooltip">{{ tooltipText }}</div>
    </div>
</template>

<script>
import { defineComponent, onBeforeMount, onMounted, ref } from 'vue'
import * as PIXI from 'pixi.js'
import {
  Live2DModel,
  MotionPreloadStrategy,
  InternalModel,
} from 'pixi-live2d-display';

export default defineComponent({
    setup() {
        var app
        var model
        const select_model = 2
        // 模型文件路径
        const model_files = [
            '../../../src/assets/models/姬萌/llny.model3.json',
            '../../../src/assets/models/兔兔/520兔兔.model3.json',
            '../../../src/assets/models/rem/rem.json',
            '../../../src/assets/models/akari_gril_vts/akari.model3.json'
        ]
        const model_file = model_files[select_model]
        // 缩放比例，根据模型大小不同调整
        const scale_sizes = [0.05, 0.04, 0.1, 0.05]
        const scale_size = scale_sizes[select_model]
        // 初始坐标
        const origin_xs = [1300, 1300, 1300, 1300]
        const origin_ys = [500, 500, 500, 200]
        const origin_x = origin_xs[select_model]
        const origin_y = origin_ys[select_model]
        // 表情类型: 配置model(3).json文件的Expressions
        const expressions_list = [
            ['水印', '生气', '吐舌', '外套', '星星', '- -','阿尼亚', '眼镜', '比心', '荷包蛋', '口罩', '哭', '脸黑', '脸红'],
            ['angry', 'cry', 'hands', 'shy'],
            [],
            ['EyesCry', 'EyesLove', 'SignAngry', 'SignShock']
        ]
        const expressions = expressions_list[select_model]
        // 动作类型: 配置model(3).json文件的Motions
        const motions_list = [
            [],
            [],
            ['idle', 'flick_head', 'tap_body', 'sleepy', 'rest', 'talk'],
            ['Idle_2', 'Love', 'Shock']
        ]
        const motions = motions_list[select_model]
        // 身体部位
        // const hit_areas_list = [
        //     [],
        //     [],
        //     [],
        //     []
        // ]
        // const hit_areas = hit_areas_list[select_model]
        // 提示词相关文字
        const showTooltip = ref(true);
        const tooltipText = ref('');
        const isClickProcessing = ref(false); // 添加isClickProcessing标志位

        var clickCount = 0 // 通过点击次数显示不同的台词 
        const tipTexts_list = [
            ['亲爱的小主，你好呀^_^', '请问有什么吩咐吗？', 'emmm，老是动人家会害羞的啦⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄', '生气啦，不理你了', '小主工作辛苦啦，给您递一杯卡布其诺~'],
            ['亲爱的小主，你好呀^_^', '请问有什么吩咐吗？', 'emmm，老是动人家会害羞的啦⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄', '生气啦，不理你了', '小主工作辛苦啦，给您递一杯卡布其诺~'],
            ['亲爱的小主，你好呀^_^', '请问有什么吩咐吗？', 'emmm，老是动人家会害羞的啦⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄', '生气啦，不理你了', '小主工作辛苦啦，给您递一杯卡布其诺~'],
            ['亲爱的小主，你好呀^_^', '请问有什么吩咐吗？', 'emmm，老是动人家会害羞的啦⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄', '生气啦，不理你了', '小主工作辛苦啦，给您递一杯卡布其诺~'],
            ['亲爱的小主，你好呀^_^', '请问有什么吩咐吗？', 'emmm，老是动人家会害羞的啦⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄', '生气啦，不理你了', '小主工作辛苦啦，给您递一杯卡布其诺~'],
            ['亲爱的小主，你好呀^_^', '请问有什么吩咐吗？', 'emmm，老是动人家会害羞的啦⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄', '生气啦，不理你了', '小主工作辛苦啦，给您递一杯卡布其诺~'],
            ['亲爱的小主，你好呀^_^', '请问有什么吩咐吗？', 'emmm，老是动人家会害羞的啦⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄', '生气啦，不理你了', '小主工作辛苦啦，给您递一杯卡布其诺~']
        ]
        const tipTexts = tipTexts_list[select_model]

        const initPosition = (model) => {
            // 0.03 特定模型的合适缩放比例
            model.x = origin_x * (window.innerWidth / 1536)
            model.y = origin_y * (window.innerHeight / 746)
        }

        const initeLive2D = async () => {
            // 挂载pixi
            window.PIXI = PIXI
            model = await Live2DModel.from(model_file, { motionPreload: MotionPreloadStrategy.NONE })

            app = new PIXI.Application({
                // 配置模型舞台
                view: document.getElementById('live2DCanvas'),
                // 背景是否透明
                backgroundAlpha: 0, // 设置背景透明度为0， 即完全透明
                autoDensity:true,
                autoResize: true,
                antialias: true,
                // 使用Canvas渲染器
                forceCanvas: true,
                // Canvas高度
                height: '2000',
                // Canvas宽度
                width:'3000'
            })

            // 鼠标跟踪方法
            model.trackedPointers.value = [{ id: 1, type: 'pointerdown', flags: true }, { id: 2, type: 'mousemove', flags: true }]
            // 添加模型到舞台
            app.stage.addChild(model)
            // 模型的缩放
            model.scale.set(scale_size)
            // 模型的初始位置,x,y相较于窗口左上角
            initPosition(model)
            // 添加模型状态管理器
            const a = new InternalModel(model)
            model.InternalModel = a
            // 使用无水印表情
            if(expressions.includes('水印')) {
                model.expression('水印')
            }

            // 绑定模型点击事件动作
            model.on('pointerdown', (hitAreas) => {
                // hitAreas:模型的一些上下文
                // const { x, y } = hitAreas.data.global 
                // const point = model.hitTest(x, y)

                // 配置不同点击身体区域触发的表情/动作
                // for(let i = 0; i < hit_areas.length; i++) {
                //     if(point.includes(hit_areas[i])) {
                //         console.log('-----')
                //         console.log('hit_area:' + hit_areas[i])
                //         console.log('-----')
                //         model.expression(expressions[i])
                //     }
                // }

                if (!isClickProcessing.value) { // 没有在进行的点击动作
                    isClickProcessing.value = true // 标志开始进行点击动作

                    // 搭配随机动作
                    const randomIndex = Math.floor(Math.random() * motions.length);
                    if(motions.length > 0){
                        console.log('random:' + randomIndex)
                        model.motion(motions[randomIndex])
                    }

                    // 设置提示文本和提示词
                    const tooltipElement = document.getElementById('live2D-tooltip');
                    tooltipElement.style.display = 'block'
                    tooltipText.value = tipTexts[clickCount % tipTexts.length]
                    updataTipPosition(model)

                    // 使用定时器来逐个显示文字
                    let index = 0;
                    const showNextChar = () => {
                        const tooltip = document.getElementById('live2D-tooltip');
                        if (tooltip && index < tooltipText.value.length) {
                            tooltip.textContent = tooltipText.value.slice(0, index + 1);
                            index++;
                            setTimeout(showNextChar, 200); // 每100毫秒显示下一个字符
                        }

                        // 显示完文字后结束点击动作
                        if (index == tooltipText.value.length) {
                            setTimeout(() => {
                                tooltipElement.style.display = 'none'
                                clickCount ++
                                isClickProcessing.value = false  // 标志点击动作完成
                            }, 3000);
                        }
                    };
                    showNextChar();
                }
            });

            // model.idleMotionPriority = "TapHead"
            // 绑定模型拖拽方法
            draggable(model);
            //添加模型范围遮罩
            addFrame(model);
            /**
             * 模型区域范围遮罩
             * @param {Live2DModel} model -模型对象
             */
            function addFrame(model) {
                const foreground = PIXI.Sprite.from(PIXI.Texture.WHITE);
                foreground.width = model.internalModel.width;
                foreground.height = model.internalModel.height;
                foreground.alpha = 0.02;

                model.addChild(foreground);
                foreground.visible = true
            }
            /**
            * 模型拖拽方法
            * @param {Live2DModel} model -模型对象
            */
            function draggable(model) {
                model.buttonMode = true;
                model.on("pointerdown", (e) => {
                    model.dragging = true;
                    model._pointerX = e.data.global.x - model.x;
                    model._pointerY = e.data.global.y - model.y;

                    if(motions.length > 0) {
                        model.motion(motions[0])
                    }
                });
                model.on("pointermove", (e) => {
                    if (model.dragging) {
                        model.position.x = e.data.global.x - model._pointerX;
                        model.position.y = e.data.global.y - model._pointerY;

                        updataTipPosition(model)
                    }
                });
                model.on("pointerupoutside", () => (model.dragging = false));
                model.on("pointerup", () => (model.dragging = false));
            }

            function updataTipPosition(model) {
                const tooltipElement = document.getElementById('live2D-tooltip');
                if(tooltipElement) {
                    // 获取模型的宽度和高度
                    // const modelWidth = model.internalModel.width * model.scale.x;

                    // 获取提示框的宽度和高度
                    // const tooltipWidth = tooltipElement.clientWidth;

                    // 计算提示框的水平居中位置
                    // const tooltipX = model.position.x + modelWidth / 2 - tooltipWidth / 2;

                    // 更新提示框位置
                    // tooltipElement.style.left = `${tooltipX}px`;
                    tooltipElement.style.left = `${model.position.x}px`;
                    tooltipElement.style.top = `${model.position.y - 50}px`;
                }
            }

            // 查看模型触发区域
            // var hitAreas = model.internalModel.hitAreas;
            // console.log('hitAreas:' + hitAreas)
            // console.log('model:' + model)
        }

        // 设置快捷键
        var enableCanvasMouse = false
        var enableCanvasDisplay = true
        const handleKeyDown = (event) => {
            const canvasElement = document.getElementById('live2DCanvas');
            const tooltipElement = document.getElementById('live2D-tooltip');

            // 通过快捷键Ctrl + M:开启canvas的pointerEvents, 使其能够响应鼠标事件
            if (event.ctrlKey && event.key === 'm' || event.ctrlKey && event.key === 'M') {
                enableCanvasMouse = !enableCanvasMouse; // 切换canvas元素的交互状态
                canvasElement.style.pointerEvents = enableCanvasMouse ? 'auto' : 'none';
                console.log('ctrl + M')
            }
            // 通过快捷键Ctrl + I: 显示或隐藏canvas
            if (event.ctrlKey && event.key === 'i' || event.ctrlKey && event.key === 'I') {
                enableCanvasDisplay = !enableCanvasDisplay
                canvasElement.style.display = enableCanvasDisplay ? 'inline' : 'none'
                tooltipElement.style.display = enableCanvasDisplay ? 'block' : 'none'
                console.log('ctrl + I')
            }

            // 通过数字键，显示live2D人物不同表情
            if (!event.altKey && event.key >= '0' && event.key <= '9') {
                // 获取对应的数字键索引
                const index = parseInt(event.key);
                // 设置表情
                if(index >=0 && index < expressions.length) {
                    model.expression(expressions[index])
                    // console.log(expressions[index])
                }
            }

            // 通过Alt + 数字键，显示live2D人物不同动作
            if (event.altKey && event.key >= '0' && event.key <= '9') {
                // 获取对应的数字键索引
                const index = parseInt(event.key);
                // 设置模型的动作
                if(index >=0 && index < motions.length) {
                    // 设置模型的表情
                    model.motion(motions[index])
                    // console.log(motions[index])
                }
            }
        };

        // 绑定canvas点击事件处理程序
        onMounted(() => {
            initeLive2D()
            // 将快捷键绑定到全局
            document.addEventListener('keydown', handleKeyDown);
        });

        onBeforeMount(() => {
            document.removeEventListener('keydown', handleKeyDown);
            model?.destroy()
            app?.destroy()
        })

        // 窗口大小改变时重新设置live2D位置
        window.addEventListener('resize', ()=>{
            initPosition(model)
        })

        return {
            showTooltip,
            tooltipText
        }
    },
})
</script>


<style>
.tooltip {
  max-width: 15%;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);; /* 提示框的背景颜色 */
  color: #fff; /* 文本颜色 */
  user-select: none; /* 禁止选择文本内容 */
  border-radius: 4px; /* 边框圆角 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 提示框的阴影效果 */
  position: absolute;
  z-index: 1001;
}

.tooltip::before {
  content: ''; /* 伪元素用于创建三角形指示器 */
  position: absolute;
  top: -10px; /* 三角形指示器距离提示框顶部的距离 */
  left: 50%; /* 三角形指示器在提示框中水平居中 */
  transform: translateX(-50%);
  border-width: 6px 6px 0; /* 三角形指示器的大小 */
  border-style: solid;
  border-color: #333 transparent transparent; /* 三角形指示器颜色 */
}

/* 鼠标悬停时的样式 */
.tooltip:hover {
  background-color: #555; /* 悬停时的背景颜色 */
}
</style>