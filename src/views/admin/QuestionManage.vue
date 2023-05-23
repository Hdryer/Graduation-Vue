<template>
    <div class="file-list">
        <!-- 上部分盒子 -->
        <div class="file-list__header">
            <el-form :model="searchForm" inline>
                <el-form-item label="题目ID">
                    <el-input v-model="searchForm.questionID" placeholder="请输入ID"></el-input>
                </el-form-item>
                <el-form-item label="课题方向">
                    <el-cascader :options="options"  placeholder="请选择" style="width:100%"  v-model="searchForm.typeOne" clearable />
                </el-form-item>
                <el-form-item label="题型">
                    <el-select v-model="searchForm.type" placeholder="请选择" clearable>
                        <el-option label="单选题" value="1" />
                        <el-option label="多选题" value="2" />
                        <el-option label="判断题" value="3" />
                        <el-option label="简答题" value="4" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 下部分盒子 -->
        <el-table :data="fileList" size ="large" border style="width: 100%">
            <el-table-column prop="id"  label="ID"></el-table-column>
            <el-table-column prop="typeTwo"  label="方向" width="150"></el-table-column>
            <el-table-column prop="type"  label="题型">
                <template #default="scope">
                    <span> {{getTypeText(scope.row.type)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="题目" width="400"></el-table-column>
            <el-table-column prop="score" label="分数" width="80"></el-table-column>
            <el-table-column prop="difficulty" label="难度" width="80">
                <template #default="scope">
                    <span> {{getDiffcultyText(scope.row.difficulty)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="出题者"></el-table-column>
            <el-table-column  label="操作" width="250">
                <template v-slot:default="scope">
                    <el-button size = "middle" @click="query(scope.row.id)">查看</el-button>
                    <el-button size = "middle"  type="primary" @click="edit(scope.row.id,scope.row.type)" >编辑</el-button>
                    <el-popconfirm title="确认删除吗" confirm-button-text="是" cancel-button-text="否"  hide-after=10 @confirm="delCourse(scope.row.id)" hide-icon=true>
                        <template #reference>
                            <el-button  size = "middle" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog  v-model="previewtype1" >
            <div style="display: flex; align-items: center;">{{question.content}}</div>
            <div style="display: flex; align-items: center;">
                <label style="margin-right: 20px">A.{{question.optionA}}</label>
                <label style="margin-right: 20px">B.{{question.optionB}}</label>
                <label style="margin-right: 20px">C.{{question.optionC}}</label>
                <label style="margin-right: 20px">D.{{question.optionD}}</label>
            </div>
        </el-dialog>
        <el-dialog  v-model="previewtype2" >
            <div style="display: flex; align-items: center;">{{question.content}}</div>
            <div style="display: flex; align-items: center;">
                <label style="margin-right: 20px">A.{{question.optionA}}</label>
                <label style="margin-right: 20px">B.{{question.optionB}}</label>
                <label style="margin-right: 20px">C.{{question.optionC}}</label>
                <label style="margin-right: 20px">D.{{question.optionD}}</label>
            </div>
        </el-dialog>
        <el-dialog  v-model="previewtype3" >
            <div style="display: flex; align-items: center;">{{question.content}}</div>
            <div style="display: flex; align-items: center;">
                <el-radio label="1" size="large">{{question.optionA}}</el-radio>
                <el-radio label="2" size="large">{{question.optionB}}</el-radio>
            </div>
        </el-dialog>
        <el-dialog  v-model="previewtype4" >
            <div style="display: flex; align-items: center;">{{question.content}}</div>
        </el-dialog>

        <el-pagination
                :page-count="searchForm.pages"
                :current-page="searchForm.currentPage"
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange" hide-on-single-page />
    </div>
</template>

<script>
    import { ref } from 'vue'

    import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElRadioGroup, ElRadio, ElButton, ElTable, ElTableColumn, ElTag } from 'element-plus'
    import {course, exam} from '@/api/axios'
    import service from "@/api";
    import user from "@/api/axios/user";

    export default {
        name:"QuerstionManage",
        data() {
            return {
                searchForm: {
                    questionID:undefined,
                    typeOne:"",
                    type:"",
                    currentPage:1,
                    pages:100,
                },
                question:{
                    content:"",
                    optionA:"",
                    optionB:"",
                    optionC:"",
                    optionD:""
                }
                ,
                fileList: [],
                options:[],
                previewtype1:false,
                previewtype2:false,
                previewtype3:false,
                previewtype4:false,
            }
        },

        methods: {
            // 根据类型值获取对应的类型文本
            getTypeText(status) {
                switch (status) {
                    case "1":
                        return '单选题';
                    case "2":
                        return '多选题';
                    case "3":
                        return '判断题';
                    case "4":
                        return '简答题';
                    default:
                        return '';
                }
            },
            getDiffcultyText(status) {
                switch (status) {
                    case 1:
                        return '入门';
                    case 2:
                        return '简单';
                    case 3:
                        return '一般';
                    case 4:
                        return '困难';
                    case 5:
                        return '专家';
                    default:
                        return '';
                }
            },
            delCourse(id){  //删除课程
                exam.delOne({id:id}).then(res=>{
                    if (res.data.code==200){
                        ElMessage({
                            message: "删除成功",
                            type: 'success',
                        })
                        this.handleSearch()
                    }
                }).catch(error=>{
                    ElMessage({
                        message: res.data.message,
                        type: 'error',
                    })
                })
            },
            handleCurrentChange(val){

            },
            getQueryQuestionDTO(){
                const queryDTO={
                    id:this.searchForm.questionID,
                    typeOne:this.searchForm.typeOne[0],
                    typeTwo:this.searchForm.typeOne[1],
                    type:this.searchForm.type,
                    pages:0,
                    size:0,
                    total:0,
                    records:[],
                    current:this.searchForm.currentPage,
                }
                return queryDTO
            },

            // 搜索课程
            handleSearch() {
                exam.queryQuestion(this.getQueryQuestionDTO()).then(res=>{
                    const jsonData = res.data.data.records
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    console.log(arr)
                    this.fileList=[]
                    for (var i = 0; i <arr.length ; i++) {
                        this.fileList.push({id:arr[i].id,typeTwo:arr[i].typeTwo,type:arr[i].type,title:arr[i].context,score:arr[i].score,difficulty:arr[i].difficulty,userName:arr[i].creatorName})
                    }
                    this.searchForm.pages=res.data.data.pages
                    this.searchForm.currentPage =res.data.data.current
                }).catch(error=>{
                    console.log(error.data)
                })
            },
            // 处理重置
            handleReset() {
                this.searchForm.domain = ''
                this.searchForm.direction = ''
                this.searchForm.title = ''
                this.searchForm.type = ''
            },
            edit(id,type){
                if (type=="1"){
                    this.$router.push({
                        name:"SingleChoice",
                        query:{
                            id:id
                        }
                    })
                }
                if (type=="2"){

                }
                if (type=="3"){
                    this.$router.push({
                        name:"checkQuestion",
                        query:{
                            id:id
                        }
                    })
                }
                if (type=="4"){

                }
            },
            query(id){   //查看课程
                exam.queryOne({id:id}).then(res=>{
                    const entity=res.data.data
                    this.question.content=entity.context
                    this.question.optionA=entity.optionA
                    this.question.optionB=entity.optionB
                    this.question.optionC=entity.optionC
                    this.question.optionD=entity.optionD
                    if (entity.type=="1")
                        this.previewtype1=true
                    if (entity.type=="2")
                        this.previewtype2=true
                    if (entity.type=="3")
                        this.previewtype3=true
                    if (entity.type=="4")
                        this.previewtype4=true
                }).catch(error=>{
                    console.log(error.data)
                })
            },
        },
        beforeMount() {
            exam.queryQuestion(this.getQueryQuestionDTO()).then(res=>{
                const jsonData = res.data.data.records
                const arr =Array.isArray(jsonData)?jsonData:[];
                console.log(arr)
                this.fileList=[]
                for (var i = 0; i <arr.length ; i++) {
                    this.fileList.push({id:arr[i].id,typeTwo:arr[i].typeTwo,type:arr[i].type,title:arr[i].context,score:arr[i].score,difficulty:arr[i].difficulty,userName:arr[i].creatorName})
                }
                this.searchForm.pages=res.data.data.pages
                this.searchForm.currentPage =res.data.data.current
            }).catch(error=>{
                console.log(error.data)
            })

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
        }
    }
</script>

<style scoped>
    .file-list__header{

    }

    .status-unpublished {
        color: #f89b9b; /* 设置未发布状态下文本颜色为灰色 */
    }

    .status-published {
        color: green; /* 设置已上线状态下文本颜色为绿色 */
    }
</style>