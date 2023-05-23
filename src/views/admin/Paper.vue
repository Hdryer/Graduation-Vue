<template>
    <div class="create-single-choice">
        <h1>试卷创编</h1>
        <el-form ref="form" :model="formData"  label-width="120px">
            <el-form-item label="名称" prop="content">
                <el-input v-model="formData.name" placeholder="请输入名称"/>
            </el-form-item>

            <el-form-item label="课程">
                <el-cascader :options="options"  placeholder="请选择" style="width:100%"  v-model="formData.courseId" clearable />
            </el-form-item>

            <el-form-item label="题目" prop="answer">
                <el-input v-model="formData.questions" style="width:580px"/>
                <el-button style="margin-left: 10px" type="success" @click="toadd">添加题目</el-button>
                <div style="width: 700px; margin-top: 10px;box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15)">
                    <div v-for="(item,index) in questions" :key="index">
                        <div style="display: flex; margin-top: 10px;margin-left: 20px; align-items: center;">题目{{index+1}}:&nbsp;&nbsp;&nbsp;&nbsp;{{item.content}}</div>
                        <div style="display: flex; align-items: center;">
                            <label style="margin-right: 20px;margin-left: 80px">A.{{item.optionA}}</label>
                            <label style="margin-right: 20px">B.{{item.optionB}}</label>
                            <label v-if="item.optionC==''?false:true" style="margin-right: 20px">C.{{item.optionC}}</label>
                            <label v-if="item.optionD==''?false:true" style="margin-right: 20px">D.{{item.optionD}}</label>
                            <el-button type="danger" style="margin-right: 50px;" @click="del(index)">删除</el-button>
                        </div>
                        <el-divider />
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="分值" prop="score">
                <el-input-number v-model="formData.score" :min="1" :max="100" @change="handleChange" />
            </el-form-item>

            <el-form-item label="时长(分钟)" prop="time">
                <el-input-number v-model="formData.time" :min="1" :max="150" @change="handleChange" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>

        <el-dialog v-model="dialogFormVisible" title="选择题目">
            <el-form :model="searchForm" inline>
                <el-form-item label="题目ID">
                    <el-input v-model="searchForm.id" placeholder="请输入ID"></el-input>
                </el-form-item>
                <el-form-item label="题型">
                    <el-select v-model="searchForm.type" placeholder="请选择">
                        <el-option label="单选题" value="1" />
                        <el-option label="多选题" value="2" />
                        <el-option label="判断题" value="3" />
                        <el-option label="简答题" value="4" />
                    </el-select>
                    <el-button style="margin-left: 20px" type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="dataList" @selection-change="handleSelectionChange" border style="width: 100%">
                <el-table-column type="selection" />
                <el-table-column prop="id"  label="ID"></el-table-column>
                <el-table-column prop="type"  label="题型">
                    <template #default="scope">
                        <span> {{getTypeText(scope.row.type)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="题目" ></el-table-column>
                <el-table-column prop="score" label="分数" ></el-table-column>
                <el-table-column v-if="false" prop="optionA" label="A" ></el-table-column>
                <el-table-column v-if="false" prop="optionB" label="B" ></el-table-column>
                <el-table-column v-if="false" prop="optionC" label="C" ></el-table-column>
                <el-table-column v-if="false" prop="optionD" label="D" ></el-table-column>
                <el-table-column prop="difficulty" label="难度" >
                    <template #default="scope">
                        <span> {{getDiffcultyText(scope.row.difficulty)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="出题者"></el-table-column>
            </el-table>

            <el-pagination
                    :page-count="searchForm.pages"
                    :current-page="searchForm.currentPage"
                    background
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"  hide-on-single-page/>
            <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取消</el-button>
                        <el-button type="primary" @click="MySubmit">确认添加</el-button>
                      </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {exam,course} from "@/api/axios";
    export default {
        name: "paper",
        data() {
            return {
                dialogFormVisible:false,
                formData: {
                    id:"",
                    name:"",
                    courseId: "",
                    score: "",
                    questions:[],
                    time: ""
                },
                searchForm:{
                    id:"",
                    type:"",
                    pages:100,
                    currentPage:1,
                },
                dataList:[],
                options:[],
                selectedQuestionList:[],
                questions: [],
            };
        },
        methods: {
            MySubmit(){
                for (var i = 0; i < this.selectedQuestionList.length; i++) {
                    const arr=Object.values(this.selectedQuestionList[i])
                    this.questions.push({
                        id: arr[0],
                        type:arr[1],
                        content: arr[2],
                        optionA:arr[6],
                        optionB: arr[7],
                        optionC: arr[8],
                        optionD: arr[9]
                    })
                    this.formData.questions.push(arr[0])
                }
                this.selectedQuestionList=[]
                this.dialogFormVisible=false
            },
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
            handleSelectionChange(val){
                this.selectedQuestionList = val
            },
            handleSearch(){
                exam.queryQuestion(this.getQueryQuestionDTO()).then(res=>{
                    const jsonData = res.data.data.records
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    this.dataList=[]
                    for (var i = 0; i <arr.length ; i++) {
                        this.dataList.push({id:arr[i].id,type:arr[i].type,title:arr[i].context,score:arr[i].score,difficulty:arr[i].difficulty,userName:arr[i].creatorName,optionA:arr[i].optionA,optionB:arr[i].optionB,optionC:arr[i].optionC,optionD:arr[i].optionD})
                    }
                    this.searchForm.pages=res.data.data.pages
                    this.searchForm.currentPage =res.data.data.current
                }).catch(error=>{
                    console.log(error.data)
                })
            },
            handleReset(){
              this.searchForm.id=""
              this.searchForm.type=""
            },
            handleCurrentChange(){

            },
            del(index){
                this.questions.splice(index,1)
                this.formData.questions.splice(index,1)
            },
            getPaperDTO(){
                const arr=Array.from(this.formData.courseId)
                const paperDTO={
                    id:this.formData.id,
                    name:this.formData.name,
                    courseId:arr[0],
                    score:this.formData.score,
                    time:this.formData.time,
                    questions:Array.from(this.formData.questions),
                }
                return paperDTO
            },
            submitForm() {
                const paperDTO = this.getPaperDTO()
                console.log(paperDTO)
                exam.addPaper(paperDTO).then(res=>{
                    if (res.data.code==200){
                        ElMessage({
                            message: res.data.message,
                            type: 'success',
                        })
                        this.$router.push({name:"paperManage"})
                    }
                }).catch(error=>{
                    console.log(error.data)
                })
            },
            resetForm() {
                this.formData.name=""
                this.formData.courseId=""
                this.formData.score=""
                this.formData.questions=[]
                this.formData.time=""
                this.questions=[]
            },
            getQueryQuestionDTO(){
                const queryDTO={
                    id:this.searchForm.id,
                    typeOne:"",
                    typeTwo:"",
                    type:this.searchForm.type,
                    pages:0,
                    size:0,
                    total:0,
                    records:[],
                    current:this.searchForm.currentPage,
                }
                return queryDTO
            },
            toadd(){
                this.dialogFormVisible=true
                this.selectedQuestionList=[]
                if (this.dataList.length==0){
                    exam.queryQuestion(this.getQueryQuestionDTO()).then(res=>{
                        const jsonData = res.data.data.records
                        const arr =Array.isArray(jsonData)?jsonData:[];
                        console.log(arr)
                        this.dataList=[]
                        for (var i = 0; i <arr.length ; i++) {
                            this.dataList.push({id:arr[i].id,type:arr[i].type,title:arr[i].context,score:arr[i].score,difficulty:arr[i].difficulty,userName:arr[i].creatorName,optionA:arr[i].optionA,optionB:arr[i].optionB,optionC:arr[i].optionC,optionD:arr[i].optionD})
                        }
                        this.searchForm.pages=res.data.data.pages
                        this.searchForm.currentPage =res.data.data.current
                    }).catch(error=>{
                        console.log(error.data)
                    })
                }
            },
            getCourseQueryDTO(){
                const courseQueryDTO = {
                    current:0,
                    pages:0,
                    size:1000,
                    total:0,
                    records:[],
                    typeOne:"",
                    typeTwo:"",
                    title:"",
                    teacher:"",
                    status:1
                }
                return courseQueryDTO
            },
        },
        mounted() {
            course.queryAllCourse(this.getCourseQueryDTO()).then(res=>{
                const jsonData = res.data.data.records
                const dataArray =Array.isArray(jsonData) ? jsonData : [];
                for (var i = 0; i <dataArray.length ; i++) {
                    this.options.push({label:dataArray[i].name,value:dataArray[i].id})
                    console.log(dataArray[i].id)
                }
            }).catch(error=>{
                console.log(error.data)
            })

            if (this.$route.query.id!=null){
                const id =this.$route.query.id
                exam.queryPaper({id:id}).then(res=>{
                    const paperEntity=res.data.data.paperEntity
                    const questions = res.data.data.questions
                    if (res.data.code=200){
                        this.formData.id=id
                        this.formData.time=paperEntity.time
                        this.formData.name=paperEntity.name
                        this.formData.score=paperEntity.score
                        this.formData.courseId=[paperEntity.courseId]

                        for (var i = 0; i < questions.length; i++) {
                            this.questions.push({
                                id: questions[i].id,
                                type:questions[i].type,
                                content: questions[i].context,
                                optionA:questions[i].optionA,
                                optionB: questions[i].optionB,
                                optionC: questions[i].optionC,
                                optionD: questions[i].optionD
                            })
                            this.formData.questions.push(questions[i].id)
                        }
                    }
                }).catch(error=>{
                    console.log(error.data)
                })
            }
        }
    };
</script>

<style scoped>
    .create-single-choice {
        overflow-y: hidden;
        max-width: 800px;
        margin: 0 auto;
    }
</style>
