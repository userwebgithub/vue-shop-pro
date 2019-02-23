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
      <el-dialog title="添加角色" :visible.sync="dialogRole" @close="roleCole">
        <el-form
          :model="roleLsit"
          label-width="100px"
          class="demo-ruleForm"
          ref="addFormRole"
          :rules="rolesForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleLsit.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="roleLsit.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRole = false">取 消</el-button>
          <el-button type="primary" @click="dialogUserRoleClk">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改角色 -->
      <el-dialog title="添加角色" :visible.sync="dialogUpdateRole">
        <el-form
          :model="roleUpadateList"
          label-width="100px"
          class="demo-ruleForm"
          ref="addFormRole"
          :rules="rolesForm"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleUpadateList.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="roleUpadateList.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdateRole = false">取 消</el-button>
          <el-button type="primary" @click="dialogUpdateRoleClk">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分配权限 -->
      <el-dialog title="角色分配" :visible.sync="dialogUpdateRight" @close="dialogClose">
        <el-tree
          :data="RightsData"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          :default-checked-keys="checkboxUpdateRight"
          highlight-current
          :props="defaultProps"
        ></el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdateRight = false">取 消</el-button>
          <el-button type="primary" @click="setRight">确 定</el-button>
        </div>
      </el-dialog>

      <el-table :data="rolesData" border style="width: 100%; margin-top: 15px;font-size: 12px;">
        <el-table-column type="expand">
          <template slot-scope="info">
            <el-row
              v-for="(item,kk) in info.row.children"
              :key="item.id"
              :style="{'border-bottom': '1px solid #ebeef5','border-top':kk===0 ? '1px solid #ebeef5':''}"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  @close="deleteRight(info.row.id,item.id,item,info.row.children)"
                >{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2,kk) in item.children"
                  :key="item2.id"
                  :style="{'border-top':kk!==0 ? '1px solid #ebeef5':''}"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="deleteRight(info.row.id,item2.id,item2,item.children)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="deleteRight(info.row.id,item3.id,item3,item2.children)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" prop="id" width="50" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName" width="420"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" width="420"></el-table-column>
        <el-table-column label="操作" prop="desc">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="rUpdate(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="rDelete(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="rPut(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList()
    this.getRightsList()
  },
  data() {
    return {
      checkboxUpdateRight: [],
      dialogUpdateRight: false,
      RightsData: [],
      // 配置tree节点 内容名称
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 权限id字符串
      rightIds: '',
      dialogUpdateRole: false,
      dialogRole: false,
      rolesData: [],
      roleLsit: {
        roleName: '',
        roleDesc: ''
      },
      rolesForm: {
        roleName: [
          { required: true, message: '请填写角色名称', trigger: 'blur' }
        ]
      },
      roleUpadateList: {}
    }
  },
  methods: {
    // 角色授权
    async setRight() {
      const k1 = this.$refs.tree.getCheckedKeys()
      const k2 = this.$refs.tree.getHalfCheckedKeys()
      const strIds = [...k1, ...k2].join(',')
      const { data: res } = await this.$http.post(
        'roles/' + this.rightIds + '/rights',
        { rids: strIds }
      )
      if (res.meta.status !== 200) return this.$message.error('角色分配错误')
      this.dialogUpdateRight = false
      this.getRolesList()
      this.$message.success('角色分配成功')
    },
    // 清空分配权限列表
    dialogClose() {
      this.$refs.tree.setCheckedKeys([])
    },
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.RightsData = res.data
    },
    // 删除角色指定权限
    deleteRight(roleId, rightid, item, itemList) {
      this.$confirm('确认要删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            'roles/' + roleId + '/rights/' + rightid
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除改权限失败')
          }
          itemList.splice(itemList.indexOf(item), 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {})
    },

    // 分配角色
    rPut(role) {
      this.rightIds = role.id
      this.dialogUpdateRight = true
      const keys = []
      this.getids(role, keys)
      this.checkboxUpdateRight = keys
      this.dialogUpdateRight = true
    },

    getids(node, keyArr) {
      if (!node.children) {
        return keyArr.push(node.id)
      }
      node.children.forEach(item => this.getids(item, keyArr))
    },
    // 删除角色
    rDelete(roleId) {
      this.$confirm('是否要删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + roleId)
          if (res.meta.status !== 200) {
            return this.$message.error('删除角色失败')
          }
          this.getRolesList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {})
    },
    // 添加角色
    async dialogUserRoleClk() {
      const { data: res } = await this.$http.post('roles', this.roleLsit)
      if (res.meta.status !== 201) {
        return this.$message.error('添加角色出错')
      }
      this.dialogRole = false
      this.getRolesList()
      this.$message.success('添加角色成功')
    },

    // 清空添加啊角色表单信息
    roleCole() {
      this.$refs.addFormRole.resetFields()
    },

    // 查询角色信息
    async rUpdate(roleId) {
      const { data: res } = await this.$http.get(`roles/${roleId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息错误')
      }
      this.roleUpadateList = res.data
      this.dialogUpdateRole = true
    },

    // 修改角色信息
    async dialogUpdateRoleClk() {
      const { data: res } = await this.$http.put(
        'roles/' + this.roleUpadateList.roleId,
        this.roleUpadateList
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改角色信息失败')
      }
      this.dialogUpdateRole = false
      this.getRolesList()
      this.$message.success('修改角色信息成功')
    },

    // 查询角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
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
.el-tag {
  margin: 10px 5px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
