<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <div>
            <el-input placeholder="请输入搜索内容" clearable>
              <!-- @clear="getUserList" -->
              <!-- >@keyup.enter.native="getUserList" -->
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格部分 -->
      <el-table :data="goodsData" border style="width: 100%; margin-top: 15px;font-size: 12px;">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="710"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="88"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getGoodsInfo()
  },
  data() {
    return {
      goodsData: [],
      // 列表显示默认参数
      goodsList: {
        query: '',
        pagenum: 1,
        pagesize: 5
      }
    }
  },
  methods: {
    async getGoodsInfo() {
      const { data: res } = await this.$http.get('goods', {
        params: this.goodsList
      })
      const Moment = require('moment')
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      this.goodsData = res.data.goods
      this.goodsData.forEach(item => {
        item.add_time = Moment(item.add_time).format('YYYY-MM-DD hh:mm:ss')
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
