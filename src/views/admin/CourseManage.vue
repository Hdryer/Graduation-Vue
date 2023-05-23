<template>
    <div class="file-list">
        <!-- 上部分盒子 -->
        <div class="file-list__header">
            <el-form :model="searchForm" inline>
                <el-form-item label="领域">
                    <el-input v-model.trim="searchForm.domain" placeholder="请输入领域"></el-input>
                </el-form-item>
                <el-form-item label="方向">
                    <el-input v-model.trim="searchForm.direction" placeholder="请输入方向"></el-input>
                </el-form-item>
                <el-form-item label="题目">
                    <el-input v-model.trim="searchForm.title" placeholder="请输入题目"></el-input>
                </el-form-item>
                <el-form-item label="老师">
                    <el-input v-model.trim="searchForm.teacher" placeholder="请输入授课老师"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchForm.status" placeholder="请选择">
                        <el-option label="已上线" value="1" />
                        <el-option label="未上线" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="newCourse">新建</el-button>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>

        </div>
        <el-dialog v-model="dialogFormVisible" title="设置一门课程">
            <el-form :model="form">
                <el-form-item  label="主题" :label-width="formLabelWidth">
                    <el-input v-model="form.name" placeholder="写一个概要标题吧"  style="width: 60%" autocomplete="off" />
                </el-form-item>
                <el-form-item  label="方向" :label-width="formLabelWidth">
                    <el-cascader :options="options"  placeholder="请选择资源领域" style="width: 60%"  v-model="form.typeOne" clearable />
                </el-form-item>
                <el-form-item   label="教学老师" :label-width="formLabelWidth">
                    <el-cascader :options="optionsTeacher"  placeholder="请选择授课老师" style="width: 60%"  v-model="form.teacher" clearable />
                </el-form-item>
                <el-form-item   label="企业老师" :label-width="formLabelWidth">
                    <el-cascader :options="optionsTeacher"  placeholder="请选择授课老师" style="width: 60%"  v-model="form.teacher1" clearable />
                </el-form-item>
                <el-form-item   label="研究院老师" :label-width="formLabelWidth">
                    <el-cascader :options="optionsTeacher"  placeholder="请选择授课老师" style="width: 60%"  v-model="form.teacher2" clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取消</el-button>
                        <el-button type="primary" @click="MySubmit">确认创建</el-button>
                      </span>
            </template>
        </el-dialog>

        <!-- 下部分盒子 -->
        <el-table :data="fileList" size ="large" border style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="date" sortable label="开课日期"></el-table-column>
            <el-table-column prop="title" label="题目"></el-table-column>
            <el-table-column v-if=false prop="id" label="id"></el-table-column>
            <el-table-column prop="domain" label="领域"></el-table-column>
            <el-table-column prop="direction" label="方向"></el-table-column>
            <el-table-column prop="userName" label="授课老师"></el-table-column>
            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <span :class="getStatusClass(scope.row.status)"></span>
                    <span> {{getStatusText(scope.row.status)}}</span>
                </template>
            </el-table-column>
            <el-table-column  label="操作" width="380">
                <template v-slot:default="scope">
                    <el-button size = "middle" @click="query(scope.row.id)">查看</el-button>
                    <el-button size = "middle"  type="primary" @click="edit(scope.row.id)" >编辑</el-button>
                    <el-button size = "middle"  type="primary" @click="publishCourse(scope.row.id)">上线</el-button>
                    <el-button  size = "middle"   @click="unPublishCourse(scope.row.id)">下架</el-button>
                    <el-popconfirm title="确认删除吗" confirm-button-text="是" cancel-button-text="否"  hide-after=10 @confirm="delCourse(scope.row.id)" hide-icon=true>
                        <template #reference>
                            <el-button  size = "middle" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

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
    import {course} from '@/api/axios'
    import service from "@/api";
    import user from "@/api/axios/user";

    export default {
        name:"CourseManage",
        components: {
            [ElForm.name]: ElForm,
            [ElFormItem.name]: ElFormItem,
            [ElInput.name]: ElInput,
            [ElSelect.name]: ElSelect,
            [ElOption.name]: ElOption,
            [ElRadioGroup.name]: ElRadioGroup,
            [ElRadio.name]: ElRadio,
            [ElButton.name]: ElButton,
            [ElTable.name]: ElTable,
            [ElTableColumn.name]: ElTableColumn,
            [ElTag.name]: ElTag
        },
        data() {
            return {
                dialogFormVisible: false,
                form:{
                    name:'',
                    typeOne:'',
                    teacher:'',
                    teacher1:'',
                    teacher2:''
                },
                options:[],
                optionsTeacher:[],

                searchForm: {
                    domain: '',
                    direction: '',
                    title: '',
                    teacher: '',
                    status:undefined,
                    currentPage:1,
                    pages:100
                },
                fileList: []
            }
        },

        methods: {
            publishCourse(id){  //上线课程
                course.publishCourse({id:id}).then(res=>{
                    if (res.data.code==200){
                        course.queryAllCourse(this.getCourseQueryDTO()).then(res=>{
                            const jsonData = res.data.data.records
                            const arr =Array.isArray(jsonData)?jsonData:[];
                            this.fileList=[]
                            for (var i = 0; i < arr.length ; i++) {
                                this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo,title:arr[i].name,userName:arr[i].teacherName+","+arr[i].companyTeacherName+","+arr[i].academicTeacherName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id,status:arr[i].isDeleted})
                            }
                            this.searchForm.pages=res.data.data.pages
                            this.searchForm.currentPage =res.data.data.current
                        }).catch(error=>{
                            console.log(error)
                        })
                        ElMessage({
                            message: res.data.message,
                            type: 'success',
                        })
                    }
                }).catch(error=>{
                    console.log(error.data)
                })
            },
            unPublishCourse(id){  //下架课程
                course.unPublishCourse({id:id}).then(res=>{
                    if (res.data.code==200){
                        course.queryAllCourse(this.getCourseQueryDTO()).then(res=>{
                            const jsonData = res.data.data.records
                            const arr =Array.isArray(jsonData)?jsonData:[];
                            this.fileList=[]
                            for (var i = 0; i < arr.length ; i++) {
                                this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo,title:arr[i].name,userName:arr[i].teacherName+","+arr[i].companyTeacherName+","+arr[i].academicTeacherName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id,status:arr[i].isDeleted})
                            }
                            this.searchForm.pages=res.data.data.pages
                            this.searchForm.currentPage =res.data.data.current
                        }).catch(error=>{
                            console.log(error)
                        })
                        ElMessage({
                            message: res.data.message,
                            type: 'success',
                        })
                    }
                }).catch(error=>{
                    console.log(error.data)
                })
            },
            // 根据状态值获取对应的 class 名称
            getStatusClass(status) {
                switch (status) {
                    case 0:
                        return 'status-unpublished';
                    case 1:
                        return 'status-published';
                    default:
                        return '';
                }
            },
            // 根据状态值获取对应的状态文本
            getStatusText(status) {
                switch (status) {
                    case 0:
                        return '未上线';
                    case 1:
                        return '已上线';
                    default:
                        return '';
                }
            },
            courseDTOData(){
                var type = this.form.typeOne
                const courseDTO ={
                    name:this.form.name,
                    typeOne:type[0],
                    typeTwo:type[1],
                    teacherId:this.form.teacher[0],
                    companyTeacherId:this.form.teacher1[0],
                    academicTeacherId:this.form.teacher2[0]
                }
                return courseDTO
            },

            //创建课程
            MySubmit(){
                // var type = this.form.typeOne
                const courseDTO = this.courseDTOData()
                console.log(courseDTO)
                console.log(this.form.teacher[0])
                console.log(this.form.teacher1[0])
                console.log(this.form.teacher2[0])
                course.addCourse(courseDTO).then(res=>{
                    if (res.data.code===200){
                        this.form.name=''
                        this.form.type=''
                        this.form.teacher=''
                        ElMessage({
                            message: '创建成功',
                            type: 'success',
                        })
                        course.queryAllCourse(this.getCourseQueryDTO()).then(res=>{
                            const jsonData = res.data.data.records
                            const arr =Array.isArray(jsonData)?jsonData:[];
                            this.fileList=[]
                            for (var i = 0; i < arr.length ; i++) {
                                this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo,title:arr[i].name,userName:arr[i].teacherName+","+arr[i].companyTeacherName+","+arr[i].academicTeacherName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id,status:arr[i].isDeleted})
                            }
                            this.searchForm.pages=res.data.data.pages
                            this.searchForm.currentPage =res.data.data.current
                        }).catch(error=>{
                            console.log(error)
                        })
                    }else {
                        ElMessage({
                            message: '网络波动,请稍后重试',
                            type: 'error',
                        })
                    }
                }).catch(error=>{
                    console.log(error)
                })
                this.dialogFormVisible = false
            },
            //去创建新课程
            newCourse(){
                this.dialogFormVisible=true
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
                if (this.optionsTeacher.length===0){
                    user.getTeacher().then(res=>{
                        const jsonData = res.data.data
                        const dataArray =Array.isArray(jsonData) ? jsonData : [];
                        for (var i = 0; i <dataArray.length ; i++) {
                            this.optionsTeacher.push({label:dataArray[i].user_name,value:dataArray[i].id})
                        }
                    }).catch(error=>{
                        console.log(error)
                    })
                }
            },
            delCourse(id){  //删除课程
                console.log(id)
                course.delCourse({id:id}).then(res=>{
                    if (res.data.code==200){
                        ElMessage({
                            message: '删除成功',
                            type: 'success',
                        })
                        course.queryAllCourse(this.getCourseQueryDTO()).then(res=>{
                            const jsonData = res.data.data.records
                            const arr =Array.isArray(jsonData)?jsonData:[];
                            this.fileList=[]
                            for (var i = 0; i < arr.length ; i++) {
                                this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo,title:arr[i].name,userName:arr[i].teacherName+","+arr[i].companyTeacherName+","+arr[i].academicTeacherName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id,status:arr[i].isDeleted})
                            }
                            this.searchForm.pages=res.data.data.pages
                            this.searchForm.currentPage =res.data.data.current
                        }).catch(error=>{
                            console.log(error)
                        })
                    }else {
                        ElMessage({
                            message: res.data.message,
                            type: 'error',
                        })
                    }
                }).catch(error=> {
                    console.log(error.data)
                })
            },
            handleCurrentChange(val){
                this.form.currentPage = val
                course.queryAllCourse(this.getCourseQueryDTO()).then(res=>{
                    const jsonData = res.data.data.records
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    this.fileList=[]
                    for (var i = 0; i < arr.length ; i++) {
                        this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo,title:arr[i].name,userName:arr[i].teacherName+","+arr[i].companyTeacherName+","+arr[i].academicTeacherName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id,status:arr[i].isDeleted})
                    }
                    this.searchForm.pages=res.data.data.pages
                    this.searchForm.currentPage =res.data.data.current
                }).catch(error=>{
                    console.log(error)
                })

            },
            getCourseQueryDTO(){
                const courseQueryDTO = {
                    current:this.searchForm.currentPage,
                    pages:0,
                    size:0,
                    total:0,
                    records:[],
                    typeOne:this.searchForm.domain,
                    typeTwo:this.searchForm.direction,
                    title:this.searchForm.title,
                    teacher:this.searchForm.teacher,
                    status:this.searchForm.status
                }
                return courseQueryDTO
            },

            // 搜索课程
            async handleSearch() {
                try {
                    const res = await course.queryAllCourse(this.getCourseQueryDTO())
                    console.log(res.data)
                    const jsonData = res.data.data.records
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    this.fileList=[]
                    for (var i = 0; i < arr.length ; i++) {
                        this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo,title:arr[i].name,userName:arr[i].teacherName+","+arr[i].companyTeacherName+","+arr[i].academicTeacherName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id,status:arr[i].isDeleted})
                    }
                    this.searchForm.pages=res.data.data.pages
                    this.searchForm.currentPage =res.data.data.current
                } catch (error) {
                    console.log(error.data)
                }
            },
            // 处理重置
            handleReset() {
                this.searchForm.domain = ''
                this.searchForm.direction = ''
                this.searchForm.title = ''
                this.searchForm.type = ''
            },
            query(id){   //查看课程
                this.$router.push({
                    name:"videoPlayPage",
                    query:{
                        id:id
                    }
                })
            },
            edit(id){  //编辑大纲
                this.$router.push({
                    name:"editOutline",
                    query:{
                        id:id
                    }
                })
            }
        },
        beforeMount() {
            course.queryAllCourse(this.getCourseQueryDTO()).then(res=>{
                const jsonData = res.data.data.records
                const arr =Array.isArray(jsonData)?jsonData:[];
                this.fileList=[]
                for (var i = 0; i < arr.length ; i++) {
                    this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo,title:arr[i].name,userName:arr[i].teacherName+","+arr[i].companyTeacherName+","+arr[i].academicTeacherName,date:new Date(arr[i].createTime).toLocaleDateString(),id:arr[i].id,status:arr[i].isDeleted})
                }
                this.searchForm.pages=res.data.data.pages
                this.searchForm.currentPage =res.data.data.current
            }).catch(error=>{
                console.log(error)
            })
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