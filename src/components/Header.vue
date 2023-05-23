<template>
    <div class="header-bar">
        <!-- 导航菜单 -->
        <el-menu :default-active="activeIndex" class="menu" mode="horizontal" active-text-color="#409EFF" @select="handleSelect">
            <el-menu-item index="home"><router-link style="text-decoration: none;font-size: large" to="/main/main">首页</router-link></el-menu-item>
            <el-menu-item index="teaching-classroom"><router-link style="text-decoration: none;font-size: large" to="/main/course" >教学课堂</router-link></el-menu-item>
<!--            <el-menu-item index="teacher-classroom"><router-link style="text-decoration: none;font-size: large" to="/main/onlineClass" >教学讲堂</router-link></el-menu-item>-->
            <el-menu-item index="question-bank"><router-link style="text-decoration: none;font-size: large" to="/main/paperCenter" >百宝题库</router-link></el-menu-item>
<!--            <el-menu-item index="community"><router-link style="text-decoration: none;font-size: large" to="/main/test" >交流论坛</router-link></el-menu-item>-->
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-menu-item index="community"></el-menu-item>
            <el-sub-menu  index="user" >
                <template #title>
                    <el-avatar :src="userInfo.avatar" size="middle"></el-avatar>
                </template>
                <el-menu-item  index="personal-center"><router-link style="text-decoration: none; color: #333333" to="/main/userPage" >个人中心</router-link></el-menu-item>
                <el-menu-item  index="logout" @click="toSubmit">上传资源</el-menu-item>
                <el-menu-item  index="logout" @click="logout">退出登录</el-menu-item>
            </el-sub-menu>
<!--            <el-button type="primary" round  @click="toSubmit">资源上传</el-button>-->
        </el-menu>

            <el-dialog v-model="dialogFormVisible" title="教学资源上传">
                <el-form :model="form">
                    <el-form-item  label="主题" :label-width="formLabelWidth">
                        <el-input v-model="form.title" placeholder="写一个概要标题吧"  style="width: 60%" autocomplete="off" />
                    </el-form-item>
                    <el-form-item  label="方向" :label-width="formLabelWidth">
                        <el-cascader :options="options"  placeholder="请选择资源领域" style="width: 60%"  v-model="form.typeOne" clearable />
                    </el-form-item>
                    <el-form-item   label="类型" :label-width="formLabelWidth">
                        <el-select v-model="form.type" style="width: 60%" placeholder="请选择资源类型">
                            <el-option label="视频" value=".mp4" />
                            <el-option label="PDF文档" value=".pdf" />
                            <el-option label="PPT" value=".ppt" />
                            <el-option label="Word文档" value=".docx" />
                            <el-option label="图片" value=".jpg" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-upload class="upload-demo" style="width: 95%"
                                   ref="upload"
                                   action="#"
                                   :on-change="onUploadChange"
                                   :before-upload="beforeFileUpload"
                                   :limit="1"
                                   :auto-upload="false"
                                   drag multiple>
                            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                            <div class="el-upload__text">拖拽<em>点击上传</em></div>
                        </el-upload>
                    </el-form-item>
                </el-form>

                <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取消</el-button>
                        <el-button type="primary" @click="MySubmit">上传</el-button>
                      </span>
                </template>
            </el-dialog>

        <router-view></router-view>
    </div>
</template>

<script>
    import { reactive } from 'vue'
    import {user} from "@/api/axios";
    import {course} from "@/api/axios";
    const formLabelWidth = '140px'

    export default {
        data() {
            return {
                activeIndex: 'home', // 当前选中的菜单项
                userInfo: reactive({
                    name: 'binjie09',
                    avatar: 'https://avatars.githubusercontent.com/u/58761084?v=4&s=120'
                }),
                dialogFormVisible:false,
                form:{
                    title:"",
                    typeOne:"",
                    type:"",
                    uploadFile:null,
                },
                subjectArray:[],
                options:[]
            }
        },
        methods: {
            //阻止默认上传
            beforeFileUpload( file ){
                return false;
            },
            onUploadChange (file) {
                //获取文件
                console.log(file.name)
                this.form.uploadFile = file.raw
                console.log(this.form.uploadFile)
            },
            handleSelect(index) {
                this.activeIndex = index
                // TODO: 处理菜单点击事件
            },
            toSubmit(){
                this.dialogFormVisible = true
                if (this.options.length===0){
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
                            this.options.push({label: typeOneArray[i],value: typeOneArray[i],children: []})
                            for (var j = 0; j < dataArray.length; j++) {
                                if (typeOneArray[i]==dataArray[j].typeOne){
                                    this.options[i].children.push({label: dataArray[j].typeTwo,value: dataArray[j].typeTwo})
                                }
                            }
                        }
                    })
                }
            },
            async MySubmit(){
                const formData = new FormData();
                var type=this.form.typeOne
                formData.append("typeOne",type[0])
                formData.append("typeTwo",type[1])
                formData.append("title",this.form.title)
                formData.append("type",this.form.type)
                formData.append("file",this.form.uploadFile)
                try {
                    const res = await course.uploadSources(formData);
                    if (res.data.code===200){
                        this.form.title=""
                        this.form.typeOne=""
                        this.form.type=""
                        this.form.uploadFile=null
                        this.$refs.upload.submit()
                        ElMessage({
                            message: '上传成功,等待管理员审核',
                            type: 'success',
                        })
                    }else {
                        ElMessage({
                            message: '网络波动,请稍后重试',
                            type: 'error',
                        })
                    }
                }catch (error) {
                    console.log(error)
                }
                this.dialogFormVisible = false
            },
            async logout(){
                try {
                    const response =await user.logout();
                    if (response.data.code===200){
                        this.$store.commit("delToken");
                        this.$store.commit("delUserDTO");
                        this.$router.push({name:"login"});
                        ElMessage({
                            message: '注销成功',
                            type: 'warning',
                        })
                    }
                }catch (error) {
                    console.log(error.data)
                    console.log(error.data.code)
                }
            }
        }
    }
</script>

<style scoped>
    .header-bar {
        padding: 12px 24px;
        background-color: #ffffff;
        color: #000000;
    }
    .menu .el-menu-item .router-link{
        text-decoration: none;
    }
    .el-sub-menu{
        margin-right: 0px;
    }
    .el-dialog{
        height: 300px;
        width: 300px;
    }

    .el-menu el-menu--popup el-menu--popup-bottom-start{
        min-width: 100px;
    }

</style>
