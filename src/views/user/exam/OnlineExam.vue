<template>
    <div class="container">
        <!-- 左侧盒子 -->
        <div class="left-box">
            <div class="paper-info">
                <h2>{{ paperInfo.name }}</h2> <!-- 试卷名称 -->
                <el-divider />
                <label style="margin-right: 20px">总分：{{ paperInfo.totalScore }}</label><!-- 总分 -->
                <label>时长：{{ paperInfo.duration }}分钟</label> <!-- 考试时长 -->
            </div>
            <el-divider />
            <div class="answer-sheet">

            </div>
            <div class="countdown">
                <h4>剩余时间</h4>
                <label class="time">{{paperInfo.duration-1}}分{{ countdown }}秒</label> <!-- 倒计时 -->
            </div>
            <el-button type="primary" class="submit-btn" @click="submitPaper">提交试卷</el-button>
        </div>
        <el-dialog v-model="isSubmitted" title="考试结果">
            <h5>考试得分：{{realScore}}分</h5>
            <template #footer>
                      <span class="dialog-footer">
                        <el-button type="primary" @click="tobackPaper">返回主页</el-button>
                      </span>
            </template>
        </el-dialog>
        <!-- 右侧盒子 -->
        <div class="right-box">
            <h3>试卷内容</h3>
            <div v-for="(item,index) in paperInfo.questions" :key="index">
                <div style="display: flex; margin-top: 10px;margin-left: 20px; align-items: center;">题目{{index+1}}:&nbsp;&nbsp;&nbsp;&nbsp;{{item.content}}</div>
                <div style="display: flex; align-items: center;">
                    <el-radio-group v-model="selected[index]" class="ml-4">
                        <el-radio :label="item.optionA" size="large">A.{{item.optionA}}</el-radio>
                        <el-radio :label="item.optionB" size="large">B.{{item.optionB}}</el-radio>
                        <el-radio v-if="item.optionC==''?false:true" :label="item.optionC" size="large">C.{{item.optionC}}</el-radio>
                        <el-radio v-if="item.optionD==''?false:true" :label="item.optionD" size="large">D.{{item.optionD}}</el-radio>
                    </el-radio-group>
                </div>
                <el-divider />
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import {exam} from "@/api/axios";

    export default {
        name:"onlineExam",
        data() {
            return {
                paperInfo:{
                    name:"Java基础考试",
                    totalScore:100,
                    duration:60,
                    questions:[]
                },
                realScore:"",
                selected:[],
                answer:[],
                times:0,
                countdown: 0,
                isSubmitted: false,
                isInTime: true,
            };
        },

        mounted() {
            this.times=this.paperInfo.duration
            this.countdown=60
            setInterval(() => {
                if (this.times > 0) {
                    this.countdown -= 1;
                    if (this.countdown==0){
                        this.countdown=60
                        this.times-=1
                    }
                }else{
                    this.isInTime = false;
                    clearInterval();
                }
            }, 1000);

            if (this.$route.query.id!=null){
                const id=this.$route.query.id
                exam.queryPaper({id:id}).then(res=>{
                    const paperEntity=res.data.data.paperEntity
                    const questions = res.data.data.questions
                    console.log(res.data.data)
                    if (res.data.code=200){
                        this.paperInfo.name=paperEntity.name
                        this.paperInfo.totalScore=paperEntity.score
                        this.paperInfo.duration=paperEntity.time

                        for (var i = 0; i < questions.length; i++) {
                            this.paperInfo.questions.push({
                                id: questions[i].id,
                                type:questions[i].type,
                                content: questions[i].context,
                                optionA:questions[i].optionA,
                                optionB: questions[i].optionB,
                                optionC: questions[i].optionC,
                                optionD: questions[i].optionD


                            })
                        }
                    }
                }).catch(error=>{
                    console.log(error.data)
                })
            }
        },
        methods: {
            tobackPaper(){  //返回上一个页面
                window.history.back()
            },
            getSunmitDTO(){
                const submitDTO={
                    id:this.$route.query.id,
                    answerList:Array.from(this.answer)
                }
                return submitDTO
            }
            ,
            submitPaper() {
                if (!this.isSubmitted) {
                    let index=0
                    for (let item of this.selected){
                        this.answer.push({id:this.paperInfo.questions[index].id,answer:item})
                        index=index+1
                    }
                    this.isSubmitted = true;
                    exam.submit(this.getSunmitDTO()).then(res=>{
                        if (res.data.code==200){
                            this.realScore=res.data.data;
                        }
                    }).catch(error=>{
                        console.log(error.data)
                    })
                }
            },
        },
    };
</script>

<style>
    .container {
        display: flex;
        justify-content: space-between;
        padding: 30px;
    }

    .left-box {
        width: 20%;
        position: sticky;
        top: 0;
        height: calc(100vh - 60px);
        padding: 20px;
        box-shadow: 1px 0 10px rgba(0, 0, 0, 0.2);
    }

    .right-box {
        margin-left: 10px;
        width: 78%;
        height: calc(100vh - 60px);
        overflow-y: scroll;
        padding: 20px;
        box-shadow: -1px 0 10px rgba(0, 0, 0, 0.2);
    }

    .paper-info {
        margin-bottom: 20px;
    }

    .answer-sheet {
        margin-bottom: 20px;
    }

    .countdown {
        margin-bottom: 20px;
        font-size: 30px;
        color: red;
    }

    .submit-btn {
        width: 100%;
        margin-top: 20px;
    }

    .question {
        margin-bottom: 20px;
    }
</style>
