<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
      <el-row>
        <span>选择商品分类：</span>
        <el-cascader
          expand-trigger="hover"
          :options="catInfos"
          :props="catInfosProps"
          v-model="selecteCat"
          @change="handleChange"
          clearable
        ></el-cascader>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="showButton"
            @click="dialogManyAdd = true"
          >添加参数</el-button>
          <el-table :data="manyTableData" border style="width: 100%">
            <el-table-column width="48" type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="(tag,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="true"
                  @close="tagClose(scope.row,i)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column width="48" type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEdit(scope.row)"
                >编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="showButton"
            @click="dialogOnlyAdd=true"
          >添加属性</el-button>
          <el-table :data="onlyTableData" border style="width: 100%">
            <el-table-column width="48" type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="tag"
                  v-for="(tag,i) in scope.row.attr_vals"
                  closable
                  :disable-transitions="true"
                  @close="tagClose(scope.row,i)"
                >{{tag}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column width="48" type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEdit(scope.row)"
                >编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加动态参数 -->
      <el-dialog title="添加动态参数" :visible.sync="dialogManyAdd" @close="addParamClose" width="30%">
        <el-form :model="addForm" label-width="100px" :rules="paramRules" ref="paramAddRef">
          <el-form-item label="参数名称" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogManyAdd= false">取 消</el-button>
          <el-button type="primary" @click="addParam">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 添加静态属性 -->
      <el-dialog title="添加静态属性" :visible.sync="dialogOnlyAdd" @close="addParamClose" width="30%">
        <el-form :model="addForm" label-width="100px" :rules="paramORules" ref="paramAddRef">
          <el-form-item label="属性名称" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogOnlyAdd= false">取 消</el-button>
          <el-button type="primary" @click="addParam">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改静态属性或动态参数 -->
      <el-dialog
        :title="this.activeName==='many'? '修改动态参数': '修改静态属性'"
        :visible.sync="dialogEdit"
        @close="addParamClose"
        width="30%"
      >
        <el-form :model="editForm" label-width="100px" :rules="paramORules" ref="paramAddRef">
          <el-form-item :label="this.activeName==='many'? '参数名称': '属性名称'" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEdit= false">取 消</el-button>
          <el-button type="primary" @click="editParam">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCatinfos()
  },
  data() {
    return {
      dialogEdit: false,
      paramRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      paramORules: {
        attr_name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ]
      },
      addForm: {
        attr_name: ''
      },
      editForm: {
        attr_name: ''
      },
      dialogOnlyAdd: false,
      dialogManyAdd: false,
      // 按钮转输入框开关
      inputVisible: false,
      //  参数输入框数据
      inputValue: '',
      // 3级分类id
      catTreeId: 0,
      // 静态属性
      onlyTableData: [],
      // 动态参数
      manyTableData: [],
      // 添加按钮开关
      showButton: true,
      activeName: 'many',
      // 分类
      catInfos: [],
      selecteCat: [],
      catInfosProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  methods: {

    // 编辑提交
    editParam() {
      this.$refs.paramAddRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'categories/' +this.editForm.cat_id +'attributes/' +this.editForm.attr_id,
            {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName
            }
          )
          this.dialogEdit = false
          console.log(this.editForm)
          console.log(res)
        }
      })
    },
    // 显示修改的dialog
    async showEdit(newParam) {
      this.dialogEdit = true
      // 克隆对象
      this.editForm = JSON.parse(JSON.stringify(newParam))
    },
    // 添加参数 // 添加属性
    addParam() {
      this.$refs.paramAddRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            'categories/' + this.catTreeId + '/attributes',
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName
            }
          )
          if (res.meta.status !== 201)
            return this.$message.error('添加参数或属性失败')
          this.dialogOnlyAdd = false
          this.dialogManyAdd = false
          this.getParam()
          this.$message.success('添加参数或属性成功')
        }
      })
    },
    // 清空dialog输入框
    addParamClose() {
      this.$refs.paramAddRef.resetFields()
    },
    // 删除
    async tagClose(newParam, index) {
      newParam.attr_vals.splice(index, 1)
      const attrVals = newParam.attr_vals.join(' ')
      const { data: res } = await this.$http.put(
        'categories/' + newParam.cat_id + '/attributes/' + newParam.attr_id,
        {
          attr_name: newParam.attr_name,
          attr_sel: newParam.attr_sel,
          attr_vals: attrVals
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除可选选项失败')
      }
    },
    // 获取参数列表
    async getParam() {
      const { data: res } = await this.$http.get(
        'categories/' + this.catTreeId + '/attributes',
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }

      if (this.activeName === 'many') {
        this.manyTableData = res.data
        this.manyTableData.forEach(item => {
          if (item.attr_vals === '') return null
          item.attr_vals = item.attr_vals.split(' ')
        })
      } else {
        this.onlyTableData = res.data
        this.onlyTableData.forEach(item => {
          if (item.attr_vals === '') return null
          item.attr_vals = item.attr_vals.split(' ')
        })
      }
    },
    // 获取分类数据
    async getCatinfos() {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 3
        }
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取分类信息失败')
      this.catInfos = res.data
    },
    // 级联切换方法
    handleChange() {
      if (this.selecteCat.length !== 3) {
        this.selecteCat = []
        this.onlyTableData = []
        this.manyTableData = []
        this.showButton = true
        this.catTreeId = 0
      } else {
        this.showButton = false
        this.catTreeId = this.selecteCat[2]
        this.getParam()
      }
    },
    // 标签切换事件
    handleClick() {
      if (this.catTreeId === 0) return null
      this.getParam()
    },
    // 参数输入框回车,失去焦点触发
    async handleInputConfirm(newInput) {
      if (this.inputValue.trim().length === 0) {
        this.inputValue = ''
        this.inputVisible = false
        return null
      }
      newInput.attr_vals.push(this.inputValue.trim())
      this.inputVisible = false
      this.inputValue = ''
      const attVals = newInput.attr_vals.join(' ')
      const { data: res } = await this.$http.put(
        'categories/' + newInput.cat_id + '/attributes/' + newInput.attr_id,
        {
          attr_name: newInput.attr_name,
          attr_sel: newInput.attr_sel,
          attr_vals: attVals
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('添加可选选项失败')
      }
    },
    // 点击添加参数按钮的回调
    showInput() {
      this.inputVisible = true
      // 页面渲染完毕执行
      // 输入框自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
.el-tag {
  margin-right: 15px;
}
.input-new-tag {
  width: 90px;
  vertical-align: bottom;
}
</style>
