<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-button type="text" @click="openChapterDialog">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterVideo"
        :key="chapter.id">
        <p>
          {{ chapter.title }}

          <span class="acts">
                <el-button style="" type="text" @click="openVideoDialog(chapter.id)">添加小节</el-button>
                <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                <el-button style="" type="text" @click="OpenEditVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
            </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/uploadAliVideo'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
export default {
  data(){
    return{
      chapterVideo:[],
      saveBtnDisabled: false,
      courseId:'',
      chapter:{
        title:'',
        sort: 0
      },//封装章节数据
      video:{
        title: '',
        sort: 0,
        isFree: 0,
        videoSourceId: ''
      },
      dialogChapterFormVisible: false,//章节弹框
      dialogVideoFormVisible: false,//小节弹框
      fileList: [],//上传文件列表
      BASE_API: process.env.BASE_API//接口api地址
    }
  },
  created() {
    //获取路由id值
    if (this.$route.params&&this.$route.params.id){
      this.courseId=this.$route.params.id
      this.getChapterVideo()
    }


  },
  methods:{
    //上传视频成功调用的方法
    handleVodUploadSuccess(response,file,fileList){
     this.video.videoSourceId= response.data.videoId
      this.video.videoOriginalName=file.name
    },
    //上传视频之前调用的方法
    handleUploadExceed(){
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },

    //点击删除框中的确定所调用的方法
    handleVodRemove(file,fileList){
      //调用接口，实现删除
      video.deleteAliVideo(this.video.videoSourceId)
        .then(response=>{
          this.$message({
            type: 'success',
            message: '删除视频成功'
          })
        });
      //把文件列表清空
      this.fileList=[]

      //清除视频id和名称
      this.video.videoSourceId=''
      this.video.videoOriginalName=''

    },

    //删除前调用的方法，即点×  所调用的方法
    beforeVodRemove(file,fileList){
      return  this.$confirm('确定移除?')

    },

    //=============================小节操作=================================

    //弹框
    openVideoDialog(chapterId){
      this.dialogVideoFormVisible=true
      this.video.title=''
      this.video.sort=0
      this.video.isfFree=0
      this.video.chapterId=chapterId
    },
    //弹框数据回显
    OpenEditVideo(videoId){
      //打开弹框
      this.dialogVideoFormVisible=true
      video.getVideo(videoId)
        .then(response=>{
          this.video=response.data.video
        })
    },

    //编辑小节
    updateVideo(){
      video.updateVideo(this.video)
        .then(response=>{
          //1.关弹框
          this.dialogVideoFormVisible=false

          //2.发出提示数据
          this.$message({
            type:'success',
            message:'修改小节成功'
          });
          //3.刷新页面，得到最新数据
          this.getChapterVideo()
        })
    },

    //删除小节
    deleteVideo(id){
      this.$confirm('此操作将永久删除小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return video.deleteVideo(id)
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        //刷新页面，得到最新数据
        this.getChapterVideo()
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
    //添加小节
    addVideo(){
      //设置小结的课程id
      this.video.courseId=this.courseId
      video.addVideo(this.video)
      .then(response=>{
        //1.关弹框
        this.dialogVideoFormVisible=false

        //2.发出提示数据
        this.$message({
          type:'success',
          message:'添加小节成功'
        });

        //3.刷新页面，得到最新数据
        this.getChapterVideo()
      })
    },

    //判断修改还是添加
    saveOrUpdateVideo(){
      if(!this.video.id){
        console.log("走添加")
        this.addVideo()
      }else {
        console.log("走编辑")
        // this.chapter.id=null
        this.updateVideo()

      }
    },

    //=============================章节操作=================================
    //删除
    deleteChapter(chapterId){
      this.$confirm('此操作将永久删除章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return chapter.deleteChapter(chapterId)
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        //刷新页面，得到最新数据
        this.getChapterVideo()
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

    //修改章节，弹框的数据回显
    openEditChapter(chapterId){
      //弹框
      this.dialogChapterFormVisible=true

      chapter.getChapter(chapterId)
      .then(response=>{
       this.chapter = response.data.chapter
      })

    },

    //弹框
    openChapterDialog(){
      this.dialogChapterFormVisible=true;
      //清空表单数据
      this.chapter.title=''
      this.chapter.sort=0
    },
    saveOrUpdate(){
      if(!this.chapter.id){
        this.addChapter()
      }else {
        this.updateChapter()
      }
    },

    //修改章节
    updateChapter(){
      chapter.updateChapter(this.chapter)
      .then(response=>{
        //1.关弹框
        this.dialogChapterFormVisible=false

        //2.发出提示数据
        this.$message({
          type:'success',
          message:'修改章节成功'
        });

        //3.刷新页面，得到最新数据
        this.getChapterVideo()
      })
    },

    //添加章节
    addChapter(){
      //设置课程id到chapter对象里去
      this.chapter.courseId=this.courseId

      chapter.addChapter(this.chapter)
      .then(response=>{
        //1.关弹框
        this.dialogChapterFormVisible=false

        //2.发出提示数据
        this.$message({
          type:'success',
          message:'添加章节成功'
        });

        //3.刷新页面，得到最新数据
        this.getChapterVideo()
      })
    },


    // 根据课程id，查询章节小节
    getChapterVideo(){
      chapter.getAllChapterVideo(this.courseId)
      .then(response=>{
       this.chapterVideo = response.data.allChapterVideo
      })
    },
    //上一步
    previous(){
      //跳转到第一步
      this.$router.push({path:'/course/info/'+this.courseId})
    },
    next(){
      //跳转到第三步
      this.$router.push({path:'/course/publish/'+this.courseId})
    }
  }
}
</script>

<style scoped>
.chanpterList{
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>
