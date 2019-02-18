<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <div>
            <el-input
              placeholder="请输入搜索内容"
              v-model="queryInfo.query "
              clearable
              @clear="getUserList"
              @keyup.enter.native="getUserList"
            >
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 添加用户 dialog -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="dialogAddClose">
        <el-form
          :model="userForm"
          label-width="100px"
          class="demo-ruleForm"
          ref="addFormRef"
          :rules="rulesUserForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="moblie">
            <el-input v-model="userForm.moblie"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogForm">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改用户信息 -->
      <el-dialog title="修改用户" :visible.sync="dialogUserForm">
        <el-form :model="userObj" label-width="100px" class="demo-ruleForm" :rules="rulesUserForm">
          <el-form-item label="用户名">
            <el-input v-model="userObj.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userObj.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="userObj.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUserForm = false">取 消</el-button>
          <el-button type="primary" @click="dialogUser">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分配角色 -->
      <el-dialog title="用户分配角色" :visible.sync="dialogUserRole">
        <el-form :model="userRole" label-width="100px" class="demo-ruleForm">
          <el-form-item label="当前的用户:">
            <span>{{userRole.username}}</span>
          </el-form-item>
          <el-form-item label="当前的角色:">
            <span>{{userRole.role_name}}</span>
          </el-form-item>
          <el-form-item label="分配新角色:">
            <el-select v-model="roleValue" placeholder="请选择" clearable>
              <el-option
                v-for="item in userRoleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUserForm = false">取 消</el-button>
          <el-button type="primary" @click="dialogUserRoleClk">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 表格部分 -->
      <el-table :data="userList" border style="width: 100%; margin-top: 15px;font-size: 12px;">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="username" label="用户名" width="420"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="120"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="70">
          <!-- 插槽方式修改状态  row获取每条信息-->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeState(scope.row.id,scope.row.mg_state)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="updateUserData(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="roleUser(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 5, 10, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryInfo.totalNum"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义验证手机号码
    var checkMoblie = (rule, value, callback) => {
      if (!/^1[356789]\d{9}$/.test(value)) {
        return callback(new Error('手机号不正确'))
      }
      // 通过验证必须callback() 放行
      callback()
    }

    return {
      userForm: {
        username: '',
        password: '',
        email: '',
        moblie: ''
      },
      rulesUserForm: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        moblie: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            validator: checkMoblie,
            trigger: 'blur'
          }
        ]
      },
      roleValue: '',
      formLabelWidth: '120px',
      dialogUserForm: false,
      dialogFormVisible: false,
      dialogUserRole: false,
      userRole: {},
      userRoleList: [],
      userList: [],
      userObj: {},

      mgState: true,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
        totalNum: 0
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 添加用户
    dialogForm() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('users', this.userForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加用户失败')
          }
          this.dialogFormVisible = false
          this.getUserList()
          this.$message.success('添加用户成功')
        }
      })
    },

    // 添加用户表单清空
    dialogAddClose() {
      this.$refs.addFormRef.resetFields()
    },

    // 查询用户信息
    async updateUserData(user) {
      const { data: res } = await this.$http.get(`users/${user}`)
      if (res.meta.status !== 200) {
        return this.$message.error('用户不存在')
      }
      this.userObj = res.data
      this.dialogUserForm = true
    },

    // 修改用户信息
    async dialogUser() {
      const userid = this.userObj.id
      const { data: res } = await this.$http.put(
        `users/${userid}`,
        this.userObj
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户信息失败')
      }
      this.dialogUserForm = false
      this.getUserList()
      this.$message({
        message: '修改用户信息成功',
        type: 'success'
      })
    },

    // 删除用户
    async deleteUser(userid) {
      const cofm = await this.$confirm('是否要删除用户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
      if (cofm === 'confirm') {
        const { data: res } = await this.$http.delete(`users/${userid}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.getUserList()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }
    },

    // 获取角色列表
    async roleUser(user) {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.userRoleList = res.data
      this.dialogUserRole = true
      this.userRole = user
    },

    // 用户分配新角色
    async dialogUserRoleClk() {
      const roleObj = {
        id: this.userRole.id,
        rid: this.roleValue
      }
      const { data: res } = await this.$http.put(
        `users/${this.userRole.id}/role`,
        roleObj
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败')
      }
      this.dialogUserRole = false
      this.getUserList()
      this.$message({
        message: '修改用户状态成功',
        type: 'success'
      })
    },

    // 修改用户状态
    async changeState(userid, state) {
      const { data: res } = await this.$http.put(
        `users/${userid}/state/${state}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户状态失败')
      }
      this.$message({
        message: '修改用户状态成功',
        type: 'success'
      })
    },

    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.userList = res.data.users
      this.queryInfo.totalNum = res.data.total
    },

    // 分页相关
    // 设定每页显示条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 设定当前第几页
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
