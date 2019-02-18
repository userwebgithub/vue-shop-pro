<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addRole">添加角色</el-button>

      <!-- 添加角色 -->
      <el-dialog title="添加角色" :visible.sync="dialogRole">
        <el-form :model="roleLsit" label-width="100px" class="demo-ruleForm" :rules="roleForm">
          <el-form-item label="角色名称" prop="rolesName">
            <el-input v-model="roleLsit.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleLsit.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUserForm = false">取 消</el-button>
          <el-button type="primary" @click="dialogUserRoleClk">确 定</el-button>
        </div>
      </el-dialog>

      <el-table :data="rolesData" border style="width: 100%; margin-top: 15px;font-size: 12px;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="角色名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属店铺">
                <span>{{ props.row.shop }}</span>
              </el-form-item>
              <el-form-item label="序号">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.shopId }}</span>
              </el-form-item>
              <el-form-item label="商品分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="序号" prop="id" width="50"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="420"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" width="420"></el-table-column>
        <el-table-column label="操作" prop="desc">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList()
  },
  data() {
    return {
      dialogRole: false,
      rolesData: [],
      roleLsit: {
        roleName: '',
        roleDesc: ''
      },
      roleForm: {
        rolesName: [
          { required: true, message: '请填写角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 添加角色
    dialogUserRoleClk() {

    },
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesData = res.data
    },
    addRole() {
      this.dialogRole = true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
