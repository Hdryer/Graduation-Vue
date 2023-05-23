<template>
    <div class="create-single-choice">
        <h1>判断题创编</h1>
        <el-form ref="form" :model="formData"  label-width="120px">
            <el-form-item label="题干" prop="content">
                <el-input v-model="formData.content" placeholder="请输入题目" @click="showPanel1=true"/>
                <el-dialog  v-model="showPanel1" >
                    <v-md-editor  height="300px" v-model="formData.content" />
                    <template #footer>
                      <span class="dialog-footer">
                        <el-button type="primary" @click="showPanel1 = false">确认</el-button>
                        <el-button @click="showPanel1 = false">取消</el-button>
                      </span>
                    </template>
                </el-dialog>
            </el-form-item>

            <el-form-item label="选项">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="A" prop="optionA" >
                            <el-input v-model="formData.optionA" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="B" prop="optionB">
                            <el-input v-model="formData.optionB" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>

            <el-form-item label="标准答案" prop="answer">
                <el-radio-group v-model="formData.answer">
                    <el-radio :label="formData.optionA" >A</el-radio>
                    <el-radio :label="formData.optionB" >B</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="答案解析" prop="analysis">
                <el-input v-model="formData.analysis" @click="showPanel6=true"/>
                <el-dialog  v-model="showPanel6" >
                    <v-md-editor  height="300px" v-model="formData.analysis" />
                    <template #footer>
                                      <span class="dialog-footer">
                                        <el-button type="primary" @click="showPanel6 = false">确认</el-button>
                                        <el-button @click="showPanel6 = false">取消</el-button>
                                      </span>
                    </template>
                </el-dialog>
            </el-form-item>

            <el-form-item label="分值" prop="score">
                <el-input-number v-model="formData.score" :min="1" :max="100" @change="handleChange" />
            </el-form-item>

            <el-form-item label="难度" prop="difficulty">
                <el-rate v-model="formData.difficulty" :texts="['入门', '简单', '中等', '困难', '专家']" show-text/>
            </el-form-item>

            <el-form-item  label="知识" prop="knowledgeOptions">
                <el-cascader :options="knowledgeOptions" placeholder="请选择知识点" v-model="formData.knowledge" clearable />
            </el-form-item>

            <el-dialog  v-model="previewPanel" >
                <div style="display: flex; align-items: center;">{{formData.content}}</div>
                <div style="display: flex; align-items: center;">
                    <el-radio :label="formData.optionA" size="large">{{formData.optionA}}</el-radio>
                    <el-radio :label="formData.optionB" size="large">{{formData.optionB}}</el-radio>
                </div>
            </el-dialog>

            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
                <el-button @click="preview">预览</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {course} from "@/api/axios";
    import exam from "@/api/axios/exam";
    import { $route } from 'vue-router'


    export default {
        name: "checkQuestion",
        data() {
            return {
                showPanel1:false,
                showPanel2:false,
                showPanel3:false,
                showPanel4:false,
                showPanel5:false,
                showPanel6:false,
                formData: {
                    id:"",
                    content: "",
                    optionA: "对",
                    optionB: "错",
                    optionC: "",
                    optionD: "",
                    answer: "",
                    analysis: "",
                    knowledge:[],
                    score: undefined,
                    difficulty: undefined
                },
                knowledgeOptions: [],

                previewPanel:false
            };
        },
        methods: {
            getQuestionDTO(){
                const questionDTO={
                    id:this.formData.id,
                    context:this.formData.content,
                    optionA:this.formData.optionA,
                    optionB:this.formData.optionB,
                    optionC:this.formData.optionC,
                    optionD:this.formData.optionD,
                    answer:this.formData.answer,
                    analysis:this.formData.analysis,
                    score:this.formData.score,
                    difficulty:this.formData.difficulty,
                    type:3,     //3表示判断题
                    typeOne:this.formData.knowledge[0],
                    typeTwo:this.formData.knowledge[1],
                }
                return questionDTO
            },
            async submitForm() {
                try {
                    const res = await exam.addQuestion(this.getQuestionDTO())
                    if (res.data.code==200){
                        ElMessage({
                            message: res.data.message,
                            type: 'success',
                        })
                        this.$router.push({name:"questionManage"})
                    }
                } catch (error) {
                    console.log(error.data)
                }
            },
            resetForm() {
                this.formData.course=""
                this.formData.content=""
                this.formData.optionA=""
                this.formData.optionB=""
                this.formData.optionC=""
                this.formData.optionD=""
                this.formData.analysis=""
                this.formData.answer=""
                this.formData.knowledge=""
                this.formData.score=undefined
                this.formData.difficulty=undefined
            },
            preview() {
                this.previewPanel=true
            },
        },

        mounted() {
            if (this.knowledgeOptions.length===0){
                course.getSubject().then(res=>{
                    const jsonData = res.data.data
                    const dataArray =Array.isArray(jsonData) ? jsonData : [];
                    this.subjectArray =dataArray;
                    const array = new Array();
                    for (var i = 0; i <dataArray.length ; i++) {
                        array.push(dataArray[i].typeOne)
                    }
                    const typeOneArray =Array.from(new Set(array))
                    for (var i = 0; i < typeOneArray.length; i++) {
                        this.knowledgeOptions.push({label: typeOneArray[i],value: typeOneArray[i],children: []})
                        for (var j = 0; j < dataArray.length; j++) {
                            if (typeOneArray[i]==dataArray[j].typeOne){
                                this.knowledgeOptions[i].children.push({label: dataArray[j].typeTwo,value: dataArray[j].typeTwo})
                            }
                        }
                    }
                })
            }
            console.log(this.$route.query.id)
            const id= this.$route.query.id
            if (id!=null){
                this.formData.id=this.$route.query.id
                exam.queryOne({id:id}).then(res=>{
                    const entity=res.data.data
                    this.formData.content=entity.context
                    this.formData.optionA=entity.optionA
                    this.formData.optionB=entity.optionB
                    this.formData.optionC=entity.optionC
                    this.formData.optionD=entity.optionD
                    this.formData.answer = entity.answer
                    this.formData.analysis = entity.analysis
                    this.formData.score = entity.score
                    this.formData.difficulty = entity.difficulty
                    this.formData.type=entity.type
                    this.formData.knowledge=[entity.typeOne,entity.typeTwo]
                }).catch(error=>{
                    console.log(error.data)
                })
            }
        }
    };
</script>

<style scoped>
    .create-single-choice {
        max-width: 800px;
        margin: 0 auto;
    }
</style>
