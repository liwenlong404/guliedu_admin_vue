<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
    v-show：是否显示上传组件
    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
    :url：后台上传的url地址
    @close：关闭上传组件
    @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/ossservice/oss/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>

      </el-form-item>







      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from '@/api/teacher'

import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

const defaultForm={
  name: '',
  sort: 0,
  level: '',
  career: '',
  intro: '',
  avatar: ''
}

export default {
  //声明额外组件
  components: {ImageCropper,PanThumb},


  data() {
    return {
      BASE_API: process.env.BASE_API,
      imagecropperShow: false, //关闭弹框
      imagecropperKey: 0,
      teacher: {
       teacher: defaultForm
      },
    }
  },

  //监听路由变化，执行init方法
  watch: {
    $route(to, from) {
      console.log('watch $route')
      this.init()
    }
  },

  created() {
    this.init()
  },
  methods: {
    //页面加载前。判断，路由里是否有id值
    //判断添加还是修改，来确定是否查询数据并回显
    //从路由里获取值
    init(){
      if(this.$route.params && this.$route.params.id){
        const id =this.$route.params.id
        //调用方法查询,并数据回显
        this.getTeacherById(id)
      }else {
        //不是添加，则清空表单数据
        this.teacher = {...defaultForm}
      }
    },

    //添加，修改使用同一表单
    saveOrUpdate() {
      //判断添加还是修改
      if(!this.teacher.id){
        this.saveTeacher()
      }else {
        this.updateTeacher()
      }
    },

    //添加讲师
    saveTeacher() {
      //调用后台接口方法，实现添加
      teacher.saveTeacher(this.teacher)
        .then(response => {
          //请求之后，添加之后，提示用户
          return this.$message({
            type: 'success',
            message: '添加成功!'
          })
        }).then(response => {
        //回到列表页面中，通过路由跳转
        this.$router.push({ path: '/teacher' })
      }).catch((response) => {
          this.$message({
            type: 'error',
            message: '添加失败!'
          })
        })
    },

    //修改讲师
    updateTeacher() {
      teacher.updateTeacherById(this.teacher.id, this.teacher)
        .then(() => {
          return this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }).then(()=>{
        this.$router.push({ path: '/teacher' })
      }).catch(()=>{
        this.$message({
          type: 'error',
          message: '修改失败!'
        })
      })
    },
    //查询讲师，数据回显
    getTeacherById(id){
      teacher.getTeacherById(id)
      .then(response=>{
      this.teacher = response.data.eduTeacher
      })
    },

    //头像部分
    //上传成功方法
    cropSuccess(data){
      //回显头像
      this.imagecropperShow=false;//关闭弹窗
      this.teacher.avatar=data.imgUrl
      this.imagecropperKey=this.imagecropperKey + 1
    },
    //关闭方法
    close(){
      //关闭弹框
      this.imagecropperShow=false;
      this.imagecropperKey=this.imagecropperKey + 1

    }

  }
}
</script>
