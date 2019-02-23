<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-button type="primary" @click="eidetCatList">添加分类</el-button>
      <table-tree
        :data="categoriesList"
        :columns="categoriesListComs"
        :expand-type="false"
        :selection-type="false"
        show-index
        class="table-tree"
      >
        <template slot="del" slot-scope="scope">
          <i
            class="el-icon-circle-check"
            style="color:rgb(68, 178, 170)"
            v-if="scope.row.cat_deleted===false"
          ></i>
          <i class="el-icon-circle-close" style="color:red;" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="categoriesUpdate(scope.row.cat_id)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="categoriesDel(scope.row.cat_id)"
          >删除</el-button>
        </template>
      </table-tree>
      <!-- 添加分类 -->
      <el-dialog title="添加分类" :visible.sync="dialogCategoriesAdd" @close="addClose">
        <el-form :model="addForm" label-width="100px" :rules="catRules" ref="categoriesAddRef">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类上级">
            <el-cascader
              expand-trigger="hover"
              :options="catTowlist"
              :props="cateTwoListProps"
              v-model="selectedCateTwo"
              @change="cateTwoChange"
              change-on-select
              clearable
              style="width:100%"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCategoriesAdd= false">取 消</el-button>
          <el-button type="primary" @click="addCat">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑 dialog -->
      <el-dialog title="修改分类" :visible.sync="dialogCategoriesUpdate" @close="categoriesClose">
        <el-form :model="categoriesForm" label-width="100px" :rules="catRules" ref="categoriesRef">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="categoriesForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCategoriesUpdate = false">取 消</el-button>
          <el-button type="primary" @click="eidetCat">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="categoriesInfo.pagenum"
          :page-size="categoriesInfo.pagesize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCatInfo()
  },
  data() {
    return {
      addForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 添加分类下拉列表配置
      cateTwoListProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 添加分类下拉列表
      selectedCateTwo: [],
      catTowlist: [],
      dialogCategoriesAdd: false,
      catRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      //编辑弹框控制变量
      dialogCategoriesUpdate: false,
      categoriesForm: {},
      categoriesList: [],
      categoriesListComs: [
        { label: '分类名称', prop: 'cat_name', width: '290px' },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'del',
          width: '290px'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order',
          width: '290px'
        },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      categoriesInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0
    }
  },
  methods: {
    // 查询2级分类数据
    async eidetCatList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('获取2级列表失败')
      this.catTowlist = res.data
      this.dialogCategoriesAdd = true
    },

    // 添加分类
    addCat() {
      this.$refs.categoriesAddRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            'categories',
            this.addForm
          )
          if (res.meta.status !== 201)
            return this.$message.error('添加分类失败')
          this.dialogCategoriesAdd = false
          this.$message.success('添加分类成功')
          this.getCatInfo()
        }
      })
    },

    // 鼠标切换选中的分类触发
    cateTwoChange() {
      if (this.selectedCateTwo.length === 0) {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      } else {
        const len = this.selectedCateTwo.length
        this.addForm.cat_pid = this.selectedCateTwo[len - 1]
        this.addForm.cat_level = len
      }
    },
    // 删除单个分类商品
    categoriesDel(catId) {
      this.$confirm('是否要删除该分类', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('categories/' + catId)
          if (res.meta.status !== 200)
            return this.$message.error('删除分类失败')
          this.getCatInfo()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {})
    },
    // 清空单个分类信息列表
    categoriesClose() {
      this.$refs.categoriesRef.resetFields()
    },
    // 添加分类清空
    addClose() {
      this.$refs.categoriesAddRef.resetFields()
    },
    // 获取单个分类信息
    async categoriesUpdate(categoriesId) {
      this.dialogCategoriesUpdate = true
      const { data: res } = await this.$http.get('categories/' + categoriesId)
      if (res.meta.status !== 200)
        return this.$message.error('获取单个分类信息失败')
      this.categoriesForm = res.data
    },
    // 编辑单个分类信息提交
    eidetCat() {
      this.$refs.categoriesRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'categories/' + this.categoriesForm.cat_id,
            this.categoriesForm
          )
          if (res.meta.status !== 200)
            return this.$message.error('编辑提交分类失败')
          this.dialogCategoriesUpdate = false
          this.$message.success('修改分类成功')
        }
      })
    },
    // 获取商品分类列表
    async getCatInfo() {
      const { data: res } = await this.$http.get('categories', {
        params: this.categoriesInfo
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类列表失败')
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    // 页码切换处理
    handleCurrentChange(val) {
      this.categoriesInfo.pagenum = val
      this.getCatInfo()
    }
  }
}
</script>

<style lang="less" scoped>
.table-tree {
  margin-top: 15px;
}
</style>
