<template>
    <div class="container">
        <!-- 课程分类导航 -->
        <el-container class="class-container">
            <el-aside class="class-aside" width="220px"  >
                <el-card shadow="hover" class="class-card">
                    <template #header>
                        <span>全部分类</span>
                    </template>
                    <el-tree :data="classData"></el-tree>
                </el-card>
            </el-aside>
            <el-main class="class-main">
                <div>
                    <el-input v-model="courseName" style="width:400px;margin-right: 10px" placeholder="输入课程名称"/>
                    <el-button type="primary" @click="queryCourse">搜索</el-button>
                </div>
                <el-row class="class-list">
                    <el-col :xs="24" :sm="12" :md="6" class="class-item" v-for="item in classList" :key="item.id">
                        <el-card shadow="hover" class="class-card" @click="toVideo(item.courseId)">
                            <img :src= "require('../../../assets/'+item.img)" alt="课程封面" />
                            <h4>{{ item.title }}</h4>
                            <div class="class-info">
                                <span>{{ item.teacher }}</span>
                                <span class="price">{{ item.price }}</span>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
        <el-footer class="footer">
            <span>基于产学研数据协同的智慧课堂教学系统</span>
        </el-footer>
    </div>
</template>

<script>
    import Header from "@/components/Header";
    import {course} from "@/api/axios";
    export default {
        name: 'Course',
        components: {Header},
        data() {
            return {
                currentPage:1,
                courseName:"",
                pages:100,
                subjectArray: [],
                classData: [],
                classList: []
            }
        },
        methods:{
            toVideo(id){
                this.$router.push({
                    name:"videoPlayPage",
                    query:{
                        id:id
                    }
                })
            },
            queryCourse(){
                course.queryAllCourse(this.getCourseQueryDTO()).then(res=>{
                    const jsonData = res.data.data.records
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    console.log(arr)
                    this.classList=[]
                    for (var i = 0; i < arr.length ; i++) {
                        this.classList.push({title: arr[i].name,id: i+1,img: (i+1)%7+'.jpg',teacher: arr[i].academicTeacherName,courseId:arr[i].id})
                    }
                    this.pages=res.data.data.pages
                    this.currentPage = res.data.data.current
                }).catch(error=>{
                    console.log( error )
                })
            },
            getCourseQueryDTO(){
                const courseQueryDTO = {
                    current:this.currentPage,
                    pages:0,
                    size:12,
                    total:0,
                    records:[],
                    typeOne:"",
                    typeTwo:"",
                    title:this.courseName,
                    teacher:"",
                    status:1
                }
                return courseQueryDTO
            },
            handleCurrentChange(){
                course.queryAllCourse(this.getCourseQueryDTO()).then(res=>{
                    const jsonData = res.data.data.records
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    console.log(arr)
                    this.classList=[]
                    for (var i = 0; i < arr.length ; i++) {
                        this.classList.push({title: arr[i].name,id: i+1,img: (i+1)%7+'.jpg',teacher: arr[i].academicTeacherName,courseId:arr[i].id})
                    }
                    this.pages=res.data.data.pages
                    this.currentPage = res.data.data.current
                }).catch(error=>{
                    console.log( error )
                })
            }
        },
        beforeMount() {
            //将科目数据渲染上
            if (this.classData.length===0){
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
                        this.classData.push({label: typeOneArray[i],value:typeOneArray[i],children: []});
                        for (var j = 0; j <dataArray.length ; j++) {
                            if (typeOneArray[i]==dataArray[j].typeOne){
                                this.classData[i].children.push({label:dataArray[j].typeTwo,value:dataArray[j].typeTwo})
                            }
                        }
                    }
                }).catch(error=>{
                    console.log(error)
                })
            }

            course.queryAllCourse(this.getCourseQueryDTO()).then(res=>{
                const jsonData = res.data.data.records
                const arr =Array.isArray(jsonData)?jsonData:[];
                console.log(arr)
                this.classList=[]
                for (var i = 0; i < arr.length ; i++) {
                    this.classList.push({title: arr[i].name,id: i+1,img: (i+1)%7+'.jpg',teacher: arr[i].academicTeacherName,courseId:arr[i].id})
                }
                this.pages=res.data.data.pages
                this.currentPage = res.data.data.current
            }).catch(error=>{
                console.log( error )
            })
        }
    }
</script>

<style scoped>
    .container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .logo img {
        width: 36px;
        height: 36px;
        margin-right: 10px;
    }

    .user-info img {
        width: 40px;
        height: 40px;
        margin-right: 10px;
    }

    .class-container {
        flex: 1;
        height: 630px;
    }

    .class-main{
        height: 630px;
    }

    .class-aside {
        background-color: #f5f5f5;
    }

    .class-card {
        margin: 20px;
    }

    .class-list {
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .class-item {
        margin-bottom: 20px;
    }

    .class-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .class-card h4 {
        margin-top: 10px;
        font-size: 16px;
        font-weight: bold;
    }

    .class-info {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        font-size: 14px;
        color: #999;
    }

    .price {
        color: #f60;
    }
    .example-showcase .el-dropdown-link {
        cursor: pointer;
        color: var(--el-color-primary);
        display: flex;
        align-items: center;
    }

    .footer {
        height: 50px;
        line-height: 50px;
        text-align: center;
        background-color: #333;
        color: #fff;
        bottom: 5px;
    }
</style>
