<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类" @change="subjectLeveOneChanged">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

        <!--二级分类-->
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

      </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>
      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/ossservice/oss/uploadCourseImg'"
          class="avatar-uploader">
          <img :src="courseInfo.cover" width="400px" height="200px">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'//引入第三方组件

export default {
  //声明第三方组件
  components:{ Tinymce },
  data(){
    return {
      courseInfo : {
        title: '',
        subjectId: '',//二级分类id
        subjectParentId:'',//一级分类id
        teacherId: '',
        lessonNum: 0,
        description: '',
        // cover: 'https://edu-teacher-li.oss-cn-beijing.aliyuncs.com/2021/04/26/e67b8bf2-b828-4c78-930d-9f06bc6d52685.jpg',
        cover: '/static/fengmian.jpg',
        price: 0
      },
      courseId:'',
      teacherList:[],//封装所有的讲师
      saveBtnDisabled: false,
      subjectOneList: [],//一级分类
      subjectTwoList: [],//一级分类
      BASE_API: process.env.BASE_API,
    }
  },
  created() {
    //获取路由id
    if (this.$route.params&&this.$route.params.id){
      this.courseId=this.$route.params.id
      //调用方法
      this.getInfo();
    }else {
      //初始化所有讲师
      this.getTeacherList()
      //初始化一级分类
      this.getOneSubject()

    }


  },
  methods :{
    //根据courseId查询课程信息
    getInfo(){
      //调用接口方法，根据courseId查询课程信息
      course.getCourseInfo(this.courseId)
      .then(response=>{
       this.courseInfo = response.data.courseInfoVo

        //1.先查询所有一级分类与二级分类
        subject.getNestedTreeList()
        .then(response=>{
          //2,。获取所有一级分类
         this.subjectOneList = response.data.list

          //3.把所有一级分类数组进行遍历，比较当前的的courseInfo里面的一级分类id和所有一级分类id
          for(var i =0;i<this.subjectOneList.length;i++){
            //获取每个一级分类
            var  oneSubject=this.subjectOneList[i]
            //比较当前的的courseInfo里面的一级分类id和所有一级分类id
            if(this.courseInfo.subjectParentId==oneSubject.id){
              //获取一级分类的所有二级分类
              this.subjectTwoList=oneSubject.children
            }
          }
        })

      })
    },

    //成功上传封面
    handleAvatarSuccess(res,file){
     this.courseInfo.cover = res.data.imgUrl
    },

    //上传之前
    beforeAvatarUpload(file){
      //约定类型，大小
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 3

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },


    //点击某个一级分类，触发change，显示二级分类
    subjectLeveOneChanged(value){
      //value是一级分类的id值

      //遍历所有的分类
      for (var i=0;i<this.subjectOneList.length;i++){
        var oneSubject = this.subjectOneList[i]
        //判断：所有的一级分类id与点击的一级分类id是否一样
        if (value===oneSubject.id){
          //从一级分类中取二级分类
          this.subjectTwoList=oneSubject.children

          //清空二级分类id
          this.courseInfo.subjectId=''
        }
      }
    },

    //查询所有一级分类
    getOneSubject(){
      subject.getNestedTreeList()
      .then(response=>{
       this.subjectOneList = response.data.list
      })
    },

    //查询所有讲师
    getTeacherList(){
      course.getListTeacher()
      .then(response=>{
      this.teacherList = response.data.items
      })
    },

    //添加课程
    addCourse(){
      course.addCourseInfo(this.courseInfo)
        .then(response=>{
          //提示信息
          this.$message({
            type:'success',
            message:'添加课程信息成功'
          })
          //跳转到第二步
          this.$router.push({path:'/course/chapter/'+response.data.courseId})
        })
    },
    //修改课程
    updateCourse(){
      course.updateCourseInfo(this.courseInfo)
      .then(response =>{
        this.$message({
          type:'success',
          message:'修改课程信息成功'
        })
        //跳转到第二步
        this.$router.push({path:'/course/chapter/'+this.courseId})
      })
    },

    saveOrUpdate(){
      //判断添加还是修改
      if(!this.courseInfo.id){
        //添加
        this.addCourse()
      }else {
        this.updateCourse()
      }
    }
  }
}

</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>

