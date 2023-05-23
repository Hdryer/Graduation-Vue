<template>
    <div class="video-play-page">
        <!-- 上半部分 -->
        <div class="video-top">
            <div class="video-title"><h2>{{ video.title }}</h2></div>
            <div class="video-author">
                <div class="author-name"><h3>{{ video.author }}</h3></div>
                <el-button type="primary" size="large">加入课堂</el-button>
            </div>
        </div>

        <!-- 下半部分 -->
        <div class="video-bottom">
            <!-- 视频播放区域 -->
            <div class="video-player-wrapper">
                <div class="video-player" :style="{ marginLeft: playerMarginLeft }">
                    <video ref="videoPlayerRef" :src="video.src" controls></video>
                    <div class="video-progress"></div>
                    <div class="video-control">
                        <el-button type="text" icon="el-icon-full-screen" @click="fullScreen"></el-button>
                    </div>
                </div>
            </div>

            <!-- 章节目录 -->
            <el-card class="box-card">
                <div class="video-catalogue">
                    <div class="catalogue-title"><h4>课程列表</h4></div>
                    <el-tree :data="catalogueData"  @node-click="handleNodeClick"></el-tree>
                </div>
                <span><h5 class="toexam" v-if="paperId!=''? true:false" @click="centerDialogVisible = true">{{video.title}}课程考试</h5></span>
            </el-card>
        </div>

        <el-dialog
                v-model="centerDialogVisible"
                width="30%"
                align-center>
            <span>是否跳转考试</span>
            <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="gotoExam">确认</el-button>
                  </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import { ref } from 'vue'
    import {course, exam} from '@/api/axios';

    export default {
        name: 'VideoPlayPage',
        data() {
            return {
                centerDialogVisible:false,
                //试卷信息
                paperId:"",
                // 视频信息
                video: {
                    title: '',
                    author: '产学研智慧课堂',
                    src: ''
                },
                // 章节目录数据
                catalogueData: [],
                playerMarginLeft: '20px', // 视频播放区域的左侧间距
            };
        },
        methods: {
            gotoExam(){
                console.log("paperID:"+this.paperId)
                this.$router.push({
                    name:"onlineExam",
                    query:{
                        id:this.paperId
                    }
                })
            },
            fullScreen() {
                if (document.fullscreenElement) {
                    document.exitFullscreen()
                } else {
                    this.videoPlayer.requestFullscreen()
                }
            },
            handleNodeClick(data) {
                console.log(data.url)
                this.video.src = 'http://localhost:8080/api/course/video/play?fileName='+data.url
                console.log(this.video.src)
            },
        },
        mounted() {
            course.queryOutline({id:this.$route.query.id}).then(res=>{
                const outlin = res.data.data
                console.log(outlin)
                if (outlin!=null){
                    if (outlin.url1 =="" || outlin.url2 =="" || outlin.url3 ==""){
                        ElMessage({
                            message: "该课程课件暂未上传完成",
                            type: 'error',
                        })
                    }else {
                        this.video.title=outlin.courseName
                        this.catalogueData.push({id: 1,label: "学业教学",url:outlin.url1,children: [{id: 1,label: outlin.academicTeaching,url:outlin.url1}]})
                        this.catalogueData.push({id: 2,label: "企业教学",url:outlin.url2,children: [{id: 2,label: outlin.enterpriseTeaching,url:outlin.url2}]})
                        this.catalogueData.push({id: 3,label: "科研教学",url:outlin.url3,children: [{id: 3,label: outlin.researchTeaching,url:outlin.url3}]})
                        this.video.src = 'http://localhost:8080/api/course/video/play?fileName='+outlin.url1
                    }
                }else {
                    ElMessage({
                        message: "该课程课件暂未上传完成",
                        type: 'error',
                    })
                }
            }).catch(error=>{
                console.log(error.data)
            })

            course.queryCoursePaper({id:this.$route.query.id}).then(res=>{
                if (res.data.data!=null){
                    console.log(res.data.data)
                    this.paperId = res.data.data
                }
            }).catch(error=>{
                console.log(error.data)
            })
        },

    }
</script>

<style scoped>

    .toexam{
        color: #666666;
    }
    .toexam:hover{
        cursor: pointer;
        text-decoration: underline;
    }

    .video-play-page {
        margin-top: 20px;
        margin-left: 10%;
        margin-right: 5%;
        margin-bottom: 20px;
    }

    .video-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        background-color: #fff;
        padding: 0 20px;
    }

    .box-card{
        height: 600px;
        width: 250px;
        margin-left: 10px;
    }
    .video-author {
        display: flex;
        align-items: center;
    }

    .author-name {
        margin-right: 20px;
    }
    .el-tree {
        font-size: 15px;
    }
    .video-bottom {
        display: flex;
        flex: 1;
        height: 650px;
    }

    .video-player-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 600px;
        width: 1000px;
    }

    .video-player {
        position: relative;
        height: 100%;
        width: 100%;
    }

    video {
        width: 100%;
        height: 100%;
    }

    .video-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background-color: #ddd;
    }

    .video-control {
        position: absolute;
        bottom: 10px;
        right: 10px;
    }

    .video-catalogue {
        flex-basis: 300px;
        padding: 10px;
        background-color: #fff;
    }

    .catalogue-title {
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: bold;
    }
</style>
