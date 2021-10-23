<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <!-- v-model绑定数据 -->
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名称"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option :value="'Normal'" label="已发布"/>
          <el-option :value="'Draft'" label="未发布"/>
        </el-select>
      </el-form-item>



      <el-button type="primary" icon="el-icon-search" @click="getCourseList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="300" />

      <el-table-column label="课程状态" width="100">
        <template slot-scope="scope"> <!--插槽    固定格式取值-->
          {{ scope.row.status==="Normal"?'已发布':'未发布' }}<!-- 三元运算符判断 -->
        </template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时数" width="100" />

      <el-table-column prop="gmtCreate" label="添加时间" width="200"/>

      <el-table-column prop="viewCount" label="浏览数量" width="100" />

      <el-table-column label="操作" width="400" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲信息</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除课程信息</el-button>
        </template>
      </el-table-column>
    </el-table>

        <!-- 分页 -->
        <el-pagination
          :current-page="page"
          :page-size="limit"
          :total="total"
          style="padding: 30px 0; text-align: center;"
          layout="total, prev, pager, next, jumper"
          @current-change="getCourseList"
        />
  </div>
</template>


<script>
import course from '@/api/edu/course'
export default {
  //变量与初始值
  data() {
    return {
      listLoading: true,
      list: null,//list集合
      page: 1,//当前页
      total: 0,//总记录数
      limit: 10,//每页显示记录数
      courseQuery:{}//条件封装对象
    }
  },
  created() {
    this.getCourseList()
  },
  methods: {

    getCourseList(page=1){
      this.page=page
      course.conditionCourseList(this.page,this.limit,this.courseQuery)
        .then(response => {
          this.list=response.data.records
          this.total=response.data.total
          this.listLoading=false;
        })//如果请求成功，返回状态码20000，执行then操作
        .catch(response => {
          console.log(response)
        })
    },

    // getListTeacher(page=1){
    //   this.page = page
    //   teacher.getTeacherPageList(this.page,this.limit,this.searchObj)
    //   .then(response => {
    //     this.list=response.data.items
    //     this.total=response.data.total
    //     this.listLoading=false;
    //   })//如果请求成功，返回状态码20000，执行then操作
    //   .catch(response => {
    //     console.log(response)
    //   })
    // },



    //删除
    removeDataById(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return course.deleteCourse(id)
      }).then(() => {
        this.getCourseList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((response) => { // 失败
        console.log(response)
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        }
      })
    },
    //清空
    resetData(){
      this.courseQuery= {  }
      this.getCourseList()
    }
  }
}

</script>

