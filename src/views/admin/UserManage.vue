<template>
    <div class="userMain">
        <div class="userHeader">
            <div class="search" >
                <label>用户名</label>
                <el-input   v-model="form.username" style="width: 20%;margin: 10px" placeholder="请输入用户名" />
                <label>邮箱</label>
                <el-input   v-model="form.email" style="width: 20%;margin: 10px"  placeholder="请输入邮箱"/>
                <label>用户类型</label>
                <el-select  v-model="form.type" style="width: 20%;margin: 10px" placeholder="请选择用户类型">
                    <el-option label="学生用户" value="1" />
                    <el-option label="产学研人员" value="2" />
                </el-select>
                <br>
                <div>
                    <el-button type="primary" @click="resetForm">重置</el-button>
                    <el-button type="primary" @click="queryAll">搜索</el-button>
                </div>
            </div>
        </div>
        <div class="userBody">
            <el-table :data="tableData"  border style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column style="text-align: center" sortable prop="date" label="注册时间" width="120" />
                <el-table-column style="text-align: center" prop="name" label="用户名" width="120" />
                <el-table-column style="text-align: center" prop="email" label="邮箱" />
                <el-table-column style="text-align: center" prop="phone" label="手机号" />
                <el-table-column style="text-align: center" prop="education" label="学历" />
                <el-table-column style="text-align: center" prop="university" label="学校" />
                <el-table-column style="text-align: center" prop="major" label="专业" />
                <el-table-column style="text-align: center" label="操作" width="200">
                    <template v-slot:default="scope">
                        <label style="color: black; cursor: pointer" @click="queryOne(scope.row.UserId)">查看</label> |
                        <label style="color: #097880;cursor: pointer" @click="isFrozen(scope.row.UserId)">冻结</label> |
                        <label style="color: #f15858;cursor: pointer" @click="isDelete(scope.row.UserId)">删除</label>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                            :page-count="form.pages"
                            :current-page="form.currentPage"
                            background
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange" hide-on-single-page />

            <el-dialog v-model="dialogVisible" width="30%">
                <span><h2>确认要删除吗</h2></span>
                    <template #footer>
                          <span class="dialog-footer">
                                <el-button @click="dialogVisible = false">取消</el-button>
                                <el-button type="primary" @click="deleteUser">确认</el-button>
                          </span>
                    </template>
            </el-dialog>

            <el-dialog v-model="dialogVisible1" width="30%">
                <span><h2>确认要冻结吗</h2></span>
                <template #footer>
                          <span class="dialog-footer">
                                <el-button @click="dialogVisible1 = false">取消</el-button>
                                <el-button type="primary" @click="frozenUser">确认</el-button>
                          </span>
                </template>
            </el-dialog>

            <el-dialog v-model="dialogFormVisible2" title="查看用户">
                <el-form :model="userForm">
                    <el-form-item  :label-width="formLabelWidth">
                        <label> 用户ID </label> <el-input v-model="userForm.userId"  style="width: 35%" autocomplete="off" disabled  />
                        <label style="margin-left: 50px"> 用户名 </label> <el-input v-model="userForm.username"  style="width: 35%" autocomplete="off" disabled  />
                    </el-form-item>
                    <el-form-item  :label-width="formLabelWidth">
                        <label> 邮箱号 </label> <el-input v-model="userForm.email"  style="width: 35%" autocomplete="off"  disabled />
                        <label style="margin-left: 50px"> 手机号 </label> <el-input v-model="userForm.phone"  style="width: 35%" autocomplete="off" disabled  />
                    </el-form-item>
                    <el-form-item  :label-width="formLabelWidth">
                        <label> 性   别 </label> <el-input v-model="userForm.gender"  style="width: 35%" autocomplete="off" disabled  />
                        <label style="margin-left: 50px"> 年  龄 </label> <el-input v-model="userForm.age"  style="width: 35%" autocomplete="off" disabled  />
                    </el-form-item>
                    <el-form-item  :label-width="formLabelWidth">
                        <label> 学   校 </label> <el-input v-model="userForm.university"  style="width: 35%" autocomplete="off"  disabled />
                        <label style="margin-left: 50px"> 专  业 </label> <el-input v-model="userForm.major"  style="width: 35%" autocomplete="off" disabled  />
                    </el-form-item>
                    <el-form-item  :label-width="formLabelWidth">
                        <label> 学  历 </label> <el-input v-model="userForm.education"  style="width: 35%" autocomplete="off"  disabled />
                        <label style="margin-left: 50px"> 公  司 </label> <el-input v-model="userForm.company"  style="width: 35%" autocomplete="off" disabled  />
                    </el-form-item>
                    <el-form-item  :label-width="formLabelWidth">
                        <label> 行  业 </label> <el-input v-model="userForm.industry"  style="width: 35%" autocomplete="off"  disabled />
                        <label style="margin-left: 50px"> 职  位 </label> <el-input v-model="userForm.position"  style="width: 35%" autocomplete="off" disabled  />
                    </el-form-item>
                    <el-form-item label="个人介绍" :label-width="formLabelWidth">
                        <el-input
                                v-model="userForm.introduction"
                                :rows="3"
                                type="textarea"
                                disabled
                        />
                    </el-form-item>
                </el-form>

                <template #footer>
                      <span class="dialog-footer">
                        <el-button @click="dialogFormVisible2 = false">关闭</el-button>
                      </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {user} from "@/api/axios";

    const formLabelWidth = '140px'

    export default {
        name:"userManage",
        data(){
            return{
                dialogVisible:false,
                dialogVisible1:false,
                dialogFormVisible2:false,
                userId:"",
                tableData:[],
                form:{
                    username:"",
                    email:"",
                    type: null,
                    pages:100,
                    currentPage:1,
                },
                userForm:{
                    username: '',
                    userId: '',
                    phone:"",
                    email:"",
                    gender: "",
                    introduction: '',
                    university:'',
                    education: '',
                    major: '',
                    company: '',
                    industry:"",
                    position: '',
                    age:0
                }
            }
        },
        methods:{
            resetForm(){
              this.form.username=""
              this.form.email=""
              this.form.type=""
            },

            handleCurrentChange(val){
                this.form.currentPage = val
                user.queryUsers(this.getUserQueryDTO()).then(res=>{
                    const jsonData = res.data.data.records
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    this.tableData=[]
                    for (var i = 0; i < arr.length; i++) {
                        this.tableData.push({UserId:arr[i].id,date: new Date(arr[i].createTime).toLocaleDateString(),name: arr[i].userName,email:arr[i].email,phone:arr[i].phone,education:arr[i].education,university:arr[i].university,major:arr[i].major})
                    }
                    this.form.pages=res.data.data.pages
                    this.form.currentPage =res.data.data.current
                }).catch(error=>{
                    console.log(error.data)
                })
            },
            getUserQueryDTO(){
                const userQueryDTO = {
                    current:this.form.currentPage,
                    pages:0,
                    size:0,
                    total:0,
                    records:[],
                    email:this.form.email,
                    username:this.form.username,
                    type:this.form.type
                }
                return userQueryDTO
            },
            async queryAll(){
                try {
                    const res = await user.queryUsers(this.getUserQueryDTO())
                    console.log(res.data.data)
                    const jsonData = res.data.data.records
                    const arr =Array.isArray(jsonData)?jsonData:[];
                    this.tableData=[]
                    for (var i = 0; i < arr.length; i++) {
                        this.tableData.push({UserId:arr[i].id,date: new Date(arr[i].createTime).toLocaleDateString(),name: arr[i].userName,email:arr[i].email,phone:arr[i].phone,education:arr[i].education,university:arr[i].university,major:arr[i].major})
                    }
                    this.form.pages=res.data.data.pages
                    this.form.currentPage =res.data.data.current
                } catch (error) {
                    console.log(error.data);
                }
            },
            async queryOne(id){
                this.dialogFormVisible2=true
                console.log(id)
                try {
                    const res = await user.getUserInfo({id:id})
                    console.log(res.data.data)
                    const userDto = res.data.data;
                    this.userForm.userId = userDto.id
                    this.userForm.username = userDto.userName
                    this.userForm.email = userDto.email
                    this.userForm.phone = userDto.phone
                    this.userForm.gender = userDto.sex
                    this.userForm.age = userDto.age
                    this.userForm.university = userDto.university
                    this.userForm.major = userDto.major
                    this.userForm.education = userDto.education
                    this.userForm.company = userDto.company
                    this.userForm.industry = userDto.industry
                    this.userForm.position = userDto.position
                    this.userForm.introduction = userDto.description
                }catch (error) {
                    console.log(error)
                }
            },
            isFrozen(id){
                this.dialogVisible1=true
                this.userId = id
            },
            frozenUser(){
                this.dialogVisible1=false
                console.log(this.userId)
                user.frozenUser({id:this.userId}).then(res=>{
                    if (res.data.code===200){
                        ElMessage({
                            message: res.data.message,
                            type: 'success',
                        })
                    }else {
                        ElMessage({
                            message: res.data.message,
                            type: 'error',
                        })
                    }
                }).catch(error=>{
                    console.log(error)
                })
            },
            isDelete(id){
                this.dialogVisible=true
                this.userId = id
            },
            deleteUser(){
                this.dialogVisible=false
                console.log(this.userId)
                user.delUser({id:this.userId}).then(res=>{
                    if (res.data.code===200){
                        ElMessage({
                            message: '删除成功',
                            type: 'success',
                        })
                        for (var i = 0; i <this.tableData.length; i++) {
                            if (this.tableData[i].UserId===this.userId){
                                this.tableData=this.tableData.splice(i,1)
                            }
                        }
                    }else {
                        ElMessage({
                            message: '删除失败，请重试',
                            type: 'warning',
                        })
                    }
                }).catch(error=>{
                    console.log(error)
                })
            }
        },
        beforeMount() {
            user.queryUsers(this.getUserQueryDTO()).then(res=>{
                const jsonData = res.data.data.records
                const arr =Array.isArray(jsonData)?jsonData:[];
                this.tableData=[]
                for (var i = 0; i < arr.length; i++) {
                    this.tableData.push({UserId:arr[i].id,date: new Date(arr[i].createTime).toLocaleDateString(),name: arr[i].userName,email:arr[i].email,phone:arr[i].phone,education:arr[i].education,university:arr[i].university,major:arr[i].major})
                }
                this.form.pages=res.data.data.pages
                this.form.currentPage =res.data.data.current
            }).catch(error=>{
                console.log(error.data)
            })
        }
    }
</script>

<style scoped>
    .userMain{
        width: 100%;
        height: 88%;
    }
    .userMain .userHeader{
        width: 95%;
        height: 15%;
        margin: 5px 10px 20px 10px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    }

    .userMain .userBody{
        position: relative;
        width: 95%;
        height: 90%;
        margin: 10px ;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    }

    .el-pagination {
        position: absolute;
        bottom: 20px; /* 绝对定位至父级容器的底部 */
        left: 80%;
        transform: translateX(-50%);
    }

    .dialog-footer button:first-child {
        margin-right: 10px;
    }

    .el-table__header th div {
        background-color: #5c6168;
        background-image: linear-gradient(#5c6168, #5c6168);
        color: #fff;
    }

</style>