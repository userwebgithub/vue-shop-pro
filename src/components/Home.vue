<template>
  <el-container>
    <el-header>
      <div class="logobox">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧导航栏 -->
      <el-aside :width="menushow ? '65px' : '200px'">
        <div id="off" @click="menushow=!menushow">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="menushow"
          :unique-opened="true"
          :collapse-transition="false"
          :router="true"
        >
          <el-submenu :index="v.id + ''" v-for="(v, k) in menulist" :key="v.id" :style="menushow ? 'width:65px' : 'width:200px'">
            <template slot="title">
              <i :class="'iconfont'+' '+ iconlist[k]"></i>
              <span>{{v.authName}}</span>
            </template>
            <el-menu-item :index="vv.path" v-for="vv in v.children" :key="vv.id">
              <i class="el-icon-menu"></i>
              <span>{{vv.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconlist: [
        'icon-users',
        'icon-tijikongjian',
        'icon-shangpin',
        'icon-danju',
        'icon-baobiao'
      ],
      menushow: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // 获取左侧列表数据
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) {
        return this.$message.error('获取左侧导航栏错误')
      }
      this.menulist = res.data
    },
    logout() {
      this.$confirm('确认要退出系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/')
          this.$message({
            type: 'success',
            message: '退出成功'
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    height: 60px;
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 0 0;
    .logobox {
      display: flex;
      color: #fff;
      font-size: 22px;
      align-items: center;
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
  }
  #off {
    height: 25px;
    background-color: #4a5064;
    text-align: center;
    letter-spacing: 0.1em;
    color: #fff;
    font-size: 12px;
    line-height: 25px;
    user-select: none;
    cursor: pointer;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
