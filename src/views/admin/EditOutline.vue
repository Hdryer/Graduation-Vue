<template>
    <div class="course-outline-container">
        <h1 class="outline-title">《{{ courseName }}》教学大纲</h1>
        <div class="basic-information">
            <h3>一、基本信息</h3>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="课程代码">
                        <el-input v-model="courseInfo.courseCode" :disabled="isDisabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="课程名称">
                        <el-input v-model="courseInfo.courseName" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="课程性质">
                        <el-select v-model="courseInfo.courseNature" placeholder="请选择" :disabled="isDisabled" >
                            <el-option label="必修课" value="必修课"></el-option>
                            <el-option label="选修课" value="选修课"></el-option>
                            <el-option label="校选修" value="校选修"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="开课年级">
                        <el-select v-model="courseInfo.grade" placeholder="请选择" :disabled="isDisabled" >
                            <el-option label="大一" value="大一"></el-option>
                            <el-option label="大二" value="大二"></el-option>
                            <el-option label="大三" value="大三"></el-option>
                            <el-option label="大四" value="大四"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="学分">
                        <el-input-number v-model="courseInfo.credit" :min="1" :max="10"  :disabled="isDisabled"/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="学时">
                        <el-input-number v-model="courseInfo.classHours" :min="1" :max="100" :disabled="isDisabled" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="适用专业">
                        <el-input v-model="courseInfo.major" :disabled="isDisabled"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="教学人">
                        <el-input v-model="courseInfo.teacher" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </div>
        <div class="course-nature-and-learning-target">
            <h3>二、课程性质与学习目标</h3>
            <el-form-item>
                <el-input type="textarea" :rows="4" v-model="natureAndTarget" :disabled="isDisabled"></el-input>
            </el-form-item>
        </div>
        <div class="course-requirement">
            <h3>三、课程要求</h3>
            <el-form-item>
                <el-input type="textarea" :rows="4" v-model="requirement" :disabled="isDisabled"></el-input>
            </el-form-item>
        </div>
        <div class="teaching-mode-allocation">
            <h3>四、教学方式的分配</h3>
            <el-form-item>
                <el-input type="textarea" :rows="4" v-model="modeAllocation" :disabled="isDisabled"></el-input>
            </el-form-item>
        </div>
        <div class="teaching-content">
            <h3>五、教学内容</h3>
            <div style="border: 5px solid #dadfe2">
                <el-row>
                    <el-col :span="12" :offset="6">
                        <div style="display: flex; align-items: center;">
                            <h4 style="margin-right: 50px">学业教学</h4>
                        </div>
                        <div class="inputs-container">
                            <div style="display: flex; align-items: center;">
                                <el-input v-model="academicTeaching" :disabled="isDisabled"></el-input>
                                <el-button type="primary" size="small" @click="querySources(1)">添加课件</el-button>
                            </div>
                            <el-popover v-if="url1=='' ? false : true" placement="right" >
                                <template #reference>
                                    <label  style="margin-right: 320px;color: darkred;font-family: 微軟正黑體;font-size: small">课件已添加</label>
                                </template>
                                <template #default>
                                    <el-button size="small"  @click="this.url1=''">删除</el-button>
                                </template>
                            </el-popover>
                        </div>
                    </el-col>
                </el-row>
                <el-divider />
                <el-row>
                    <el-col :span="12" :offset="6">
                        <div style="display: flex; align-items: center;">
                            <h4 style="margin-right: 50px">企业教学</h4>
                        </div>
                        <div class="inputs-container">
                            <div style="display: flex; align-items: center;">
                                <el-input v-model="enterpriseTeaching" :disabled="isDisabled"></el-input>
                                <el-button type="primary" size="small" @click="querySources(2)">添加课件</el-button>
                            </div>
                            <el-popover v-if="url2 =='' ? false : true " placement="right" >
                                <template #reference>
                                    <label  style="margin-right: 320px;color: darkred;font-family: 微軟正黑體;font-size: small">课件已添加</label>
                                </template>
                                <template #default>
                                    <el-button size="small"  @click="this.url2=''">删除</el-button>
                                </template>
                            </el-popover>
                        </div>
                    </el-col>
                </el-row>
                <el-divider />
                <el-row>
                    <el-col :span="12" :offset="6">
                        <div style="display: flex; align-items: center;">
                            <h4 style="margin-right: 50px">科研教学</h4>
                        </div>
                        <div class="inputs-container">
                            <div style="display: flex; align-items: center;">
                                <el-input v-model="researchTeaching" :disabled="isDisabled"></el-input>
                                <el-button type="primary" size="small" @click="querySources(3)">添加课件</el-button>
                            </div>
                            <el-popover v-if="url3 =='' ? false : true " placement="right" >
                                <template #reference>
                                    <label  style="margin-right: 320px;color: darkred;font-family: 微軟正黑體;font-size: small">课件已添加</label>
                                </template>
                                <template #default>
                                    <el-button size="small"  @click="this.url3=''">删除</el-button>
                                </template>
                            </el-popover>
                        </div>
                    </el-col>
                </el-row>
                <p></p>
            </div>
        </div>
        <div class="score-assessment-method">
            <h3>六、成绩考核方式</h3>
            <el-form-item>
                <el-input type="textarea" :rows="4" v-model="assessmentMethod" :disabled="isDisabled"></el-input>
            </el-form-item>
        </div>
    </div>
    <el-dialog v-model="dialogFormVisible" title="添加课件">
        <el-form :model="searchForm" inline>
            <el-form-item label="题目">
                <el-input v-model.trim="searchForm.title" placeholder="请输入题目"></el-input>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="searchForm.type" placeholder="请选择">
                    <el-option label="视频" value=".mp4" />
                    <el-option label="PDF文档" value=".pdf" />
                    <el-option label="PPT" value=".ppt" />
                    <el-option label="Word文档" value=".docx" />
                    <el-option label="图片" value=".jpg" />
                </el-select>
                <el-button style="margin-left: 20px" type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="fileList" @selection-change="handleSelectionChange" border style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column v-if="false" prop="domain" label="领域"></el-table-column>
            <el-table-column v-if="false" prop="direction" label="方向"></el-table-column>
            <el-table-column prop="title" label="题目"></el-table-column>
            <el-table-column v-if="true" prop="fileName" label="文件名"></el-table-column>
            <el-table-column v-if="false" prop="id" label="id"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column v-if="false" prop="userName" label="上传者"></el-table-column>
            <el-table-column prop="date" sortable  label="上传日期"></el-table-column>
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
    <div style="position: fixed; right:250px; top: 200px">
        <el-button  type="primary" @click="saveEdit">保存</el-button>
        <p></p>
        <el-button  type="danger" @click="edit">编辑</el-button>
        <p></p>
        <el-button  type="default" @click="toback">返回</el-button>
    </div>
</template>

<script>
    import {course, sources} from '@/api/axios'
    import { $route } from 'vue-router'

    export default {
        name:"editOutline",
        data() {
            return {
                dialogFormVisible:false,
                isDisabled:false,
                courseName: '',
                courseInfo: {
                    courseCode: '',
                    courseName: '',
                    courseNature: '',
                    classHours: 1,
                    credit: 1,
                    grade: '',
                    major: '',
                    teacher: '',
                },
                natureAndTarget: '',
                requirement: '',
                modeAllocation: '',
                assessmentMethod: '',
                academicTeaching: '',
                url1:"",
                enterpriseTeaching: '',
                url2:"",
                researchTeaching: '',
                url3:"",
                num:0,
                searchForm:{
                    title:"",
                    type:"",
                    domain:"",
                    direction:"",
                    currentPage:1,
                    pages:100
                },

                fileList: [],
                urlList: []
            }
        },
        methods: {
            handleReset(){
              this.searchForm.title=""
              this.searchForm.type=""
            },
            handleSelectionChange(val){
                this.urlList = val
            },
            MySubmit(){
                const arr=Object.values(this.urlList[0])
                console.log("url: "+arr[2])
                if (this.num==1){
                    this.url1=arr[2]
                    console.log("url1:"+this.url1)
                }else if (this.num==2){
                    this.url2=arr[2]
                    console.log("url2:"+this.url2)
                }else if (this.num==3){
                    this.url3=arr[2]
                    console.log("url3:"+this.url3)
                }
                ElMessage({
                    message: '添加成功',
                    type: 'success',
                })
                this.num=0
                this.dialogFormVisible=false
            },
            getSourcesQueryDTO(){
                const sourcesQueryDTO = {
                    current:this.searchForm.currentPage,
                    pages:0,
                    size:5,
                    total:0,
                    records:[],
                    typeOne:this.searchForm.domain,
                    typeTwo:this.searchForm.direction,
                    title:this.searchForm.title,
                    type:this.searchForm.type
                }
                return sourcesQueryDTO
            },
            handleCurrentChange(val){  //分页切换方法
                this.searchForm.currentPage = val
                sources.queryAllSources(this.getSourcesQueryDTO()).then(res=>{
                    const jsonData = res.data.data.records
                    console.log(jsonData)
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    this.fileList=[]
                    for (var i = 0; i < arr.length; i++) {
                        this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo, fileName:arr[i].fileName, title:arr[i].title,type:arr[i].type,userName:arr[i].userName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id})
                    }
                    this.searchForm.pages=res.data.data.pages
                    this.searchForm.currentPage =res.data.data.current
                }).catch(error=>{
                    console.log(error.data)
                })
            },

            querySources(num){
                this.dialogFormVisible =true
                this.num = num
                sources.queryAllSources(this.getSourcesQueryDTO()).then(res=>{
                    const jsonData = res.data.data.records
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    this.fileList=[]
                    for (var i = 0; i < arr.length; i++) {
                        this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo, fileName:arr[i].fileName, title:arr[i].title,type:arr[i].type,userName:arr[i].userName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id})
                    }
                    this.searchForm.pages=res.data.data.pages
                    this.searchForm.currentPage =res.data.data.current
                }).catch(error=>{
                    console.log(error.data)
                })
            },
            toback(){
                history.back()
            }
            ,
            getOutlineDTO(){
                const outlinDTO={
                    courseId:this.$route.query.id,
                    courseName:this.courseInfo.courseName,
                    courseCode:this.courseInfo.courseCode,
                    courseNature:this.courseInfo.courseNature,
                    grade:this.courseInfo.grade,
                    credit:this.courseInfo.credit,
                    classHours:this.courseInfo.classHours,
                    major:this.courseInfo.major,
                    natureAndTarget:this.natureAndTarget,
                    requirement:this.requirement,
                    modeAllocation:this.modeAllocation,
                    assessmentMethod:this.assessmentMethod,
                    academicTeaching:this.academicTeaching,
                    url1:this.url1,
                    enterpriseTeaching:this.enterpriseTeaching,
                    url2:this.url2,
                    researchTeaching: this.researchTeaching,
                    url3:this.url3
                }
                return outlinDTO
            },
            async saveEdit(){
                this.isDisabled = true;
                const outlineDTO= this.getOutlineDTO();
                try {
                    const res = await course.saveOutline(outlineDTO)
                    ElMessage({
                        message: '保存成功',
                        type: 'success',
                    })
                } catch (error) {
                    ElMessage({
                        message: error.data.message,
                        type: 'error',
                    })
                }
            },
            edit(){
                this.isDisabled =false;
            }
        },
        mounted() {
            const id =this.$route.query.id
            course.queryCourse({id:id}).then(res=>{
                console.log(res.data.data)
                const courseEntity= res.data.data
                if (res.data.code=200){
                    this.courseName=courseEntity.name
                    this.courseInfo.courseName = courseEntity.name
                    this.courseInfo.teacher = courseEntity.teacherName+","+courseEntity.companyTeacherName+","+courseEntity.academicTeacherName
                }
            }).catch(error=>{
                console.log(error.data)
            })
            course.queryOutline({id:id}).then(res=>{
                if(res.data.code==200){
                    if (res.data.data!=null){
                        const outline= res.data.data
                        this.courseInfo.courseCode = outline.courseCode
                        this.courseInfo.courseNature = outline.courseNature
                        this.courseInfo.grade = outline.grade
                        this.courseInfo.credit = outline.credit
                        this.courseInfo.classHours = outline.classHours
                        this.courseInfo.major =  outline.major
                        this.natureAndTarget = outline.natureAndTarget
                        this.requirement = outline.requirement
                        this.modeAllocation = outline.modeAllocation
                        this.assessmentMethod = outline.assessmentMethod
                        this.academicTeaching = outline.academicTeaching
                        this.enterpriseTeaching = outline.enterpriseTeaching
                        this.researchTeaching = outline.researchTeaching
                        this.url1 = outline.url1
                        this.url2 = outline.url2
                        this.url3 = outline.url3
                    }
                }
            }).catch(error=>{
                console.log(error.data)
            })
        },
    }
</script>

<style>
    .course-outline-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }

    .outline-title {
        text-align: center;
        margin-bottom: 20px;
    }

    .basic-information,
    .course-nature-and-learning-target,
    .course-requirement,
    .teaching-mode-allocation,
    .teaching-content,
    .score-assessment-method {
        margin-bottom: 30px;
    }
    .input-delete-icon {
        opacity: 1;
        cursor: pointer;
        color: #909399;
        transition: all 0.2s;
    }

    .el-input:hover ~ .input-delete-icon {
        opacity: 1;
    }

    .inputs-container {
        position: relative;
    }

    .inputs-container .el-input {
        margin-bottom: 10px;
        position: relative;
    }

    .inputs-container .el-input__inner {
        padding-right: 30px;
    }

    .inputs-container .input-delete-icon {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translate(0, -50%);
    }
    .inputs-container .el-button {
        margin-left: 10px;
    }


</style>
