<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <el-table :data="RightsData" border style="width: 100%; margin-top: 15px;font-size: 12px;">
        <el-table-column label="序号" width="200" type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="220"></el-table-column>
        <el-table-column prop="path" label="路径" width="200"></el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.level === '0' ? 'primary' : scope.row.level === '1' ? 'success' : 'warning'"
              disable-transitions
            >{{scope.row.level === '0' ? '一级' : scope.row.level === '1' ? '二级' : '三级'}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightsList()
  },
  data() {
    return {
      RightsData: []
    }
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.RightsData = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
