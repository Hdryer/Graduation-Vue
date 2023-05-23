<template>
    <div class="file-list">
 <!--       &lt;!&ndash; 上部分盒子 &ndash;&gt;
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
                <el-form-item label="类型">
                    <el-select v-model="searchForm.type" placeholder="请选择">
                        <el-option label="视频" value=".mp4" />
                        <el-option label="PDF文档" value=".pdf" />
                        <el-option label="PPT" value=".ppt" />
                        <el-option label="Word文档" value=".docx" />
                        <el-option label="图片" value=".jpg" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>

        </div>-->
        <!-- 下部分盒子 -->
        <el-table :data="fileList" border style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="domain" label="领域"></el-table-column>
            <el-table-column prop="direction" label="方向"></el-table-column>
            <el-table-column prop="title" label="题目"></el-table-column>
            <el-table-column v-if="false" prop="fileName" label="文件名"></el-table-column>
<!--            <el-table-column v-if="false" prop="id" label="id"></el-table-column>-->
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column prop="userName" label="上传者"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="date" sortable label="上传日期"></el-table-column>
            <el-table-column  label="操作" width="250">
                <template v-slot:default="scope">
                    <el-button  @click="query(scope.row.fileName,scope.row.type)">查看</el-button>
<!--
                    <el-button  @click="test(scope.row.id)">查看</el-button>
-->
                    <el-button type="primary" @click="checked(scope.row.id)">审核</el-button>
                    <el-button type="danger" @click="dismissed(scope.row.id)">驳回</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import { ref } from 'vue'

    import { ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElRadioGroup, ElRadio, ElButton, ElTable, ElTableColumn, ElTag } from 'element-plus'
    import {course} from '@/api/axios'
    import service from "@/api";

    export default {
        name:"checkSources",
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
                searchForm: {
                    domain: '',
                    direction: '',
                    title: '',
                    type: '',
                },
                fileList: []
            }
        },
        methods: {
            // 处理搜索
            handleSearch() {
                console.log(this.searchForm)
                // 这里可以调用接口请求数据，并把结果赋值给 this.fileList
            },
            // 处理重置
            handleReset() {
                this.searchForm.domain = ''
                this.searchForm.direction = ''
                this.searchForm.title = ''
                this.searchForm.type = ''
            },
            // 判断状态标签类型
            statusTagType(status) {
                return status === 'published' ? 'success' : 'warning'
            },
            checked(id){   //审核
                console.log(id)
                course.checkSources({id:id}).then(res=>{
                    if (res.data.code===200){
                        ElMessage({
                            message: '审核成功',
                            type: 'success',
                        })
                        course.checkSourcesList().then(res=>{
                            this.fileList=[]
                            const jsonData = res.data.data
                            const arr =Array.isArray(jsonData) ? jsonData : [];
                            for (var i = 0; i < arr.length; i++) {
                                this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo, status:arr[i].status,fileName:arr[i].fileName, id:arr[i].id,title:arr[i].title, type:arr[i].type,userName:arr[i].userName,date:new Date(arr[i].createTime).toLocaleDateString()})
                            }
                        }).catch(error=>{
                            console.log(error)
                        })
                    }else {
                        ElMessage({
                            message: '操作失败，请重试',
                            type: 'warning',
                        })
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            dismissed(id){  //驳回
                console.log(id)
                course.dismissSources({id:id}).then(res=>{
                    if (res.data.code===200){
                        ElMessage({
                            message: '驳回成功',
                            type: 'success',
                        })
                        course.checkSourcesList().then(res=>{
                            this.fileList=[]
                            const jsonData = res.data.data
                            const arr =Array.isArray(jsonData) ? jsonData : [];
                            for (var i = 0; i < arr.length; i++) {
                                this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo, status:arr[i].status,fileName:arr[i].fileName, id:arr[i].id,title:arr[i].title, type:arr[i].type,userName:arr[i].userName,date:new Date(arr[i].createTime).toLocaleDateString()})
                                console.log(arr[i])
                            }
                        }).catch(error=>{
                            console.log(error)
                        })
                    }else {
                        ElMessage({
                            message: '操作失败，请重试',
                            type: 'warning',
                        })
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            test(id){
                console.log(id)
            },
            query(fileName,type){
                if (type==".mp4"){
                    const url = "http://localhost:8080/api/course/video/play1?fileName="+fileName
                    window.open(url,fileName)
                }else {
                    console.log(fileName)
                    var name =encodeURI(encodeURI(fileName));
                    const urls = "http://localhost:8080/api/file/downLoad?fileName="+name
                    window.open(urls,fileName)
                }
            }
        },
        beforeMount() {
            course.checkSourcesList().then(res=>{
                const jsonData = res.data.data
                const arr =Array.isArray(jsonData) ? jsonData : [];
                for (var i = 0; i < arr.length; i++) {
                    this.fileList.push({domain:arr[i].typeOne,direction:arr[i].typeTwo, status:arr[i].status,fileName:arr[i].fileName, id:arr[i].id,title:arr[i].title, type:arr[i].type,userName:arr[i].userName,date:new Date(arr[i].createTime).toLocaleDateString()})
                    console.log(arr[i])
                }
            }).catch(error=>{
                console.log(error)
            })
        }
    }
</script>

<style scoped>
    .file-list__header{

    }
</style>