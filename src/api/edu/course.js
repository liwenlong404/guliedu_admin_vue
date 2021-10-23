import request from '@/utils/request'
import id from 'element-ui/src/locale/lang/id' // 模板提供的axios的封装

export default {
  //添加课程信息
  addCourseInfo(CourseInfo) {
    return request({
      url: '/eduservice/course/addCourseInfo/',
      //提交方式
      method: 'post',
      //传递条件对象，如果传递json数据，使用data，不是json，使用params
      data: CourseInfo
    })
  },

  //查询所有讲师
  getListTeacher(){
    return request({
      url: '/eduservice/teacher/findAll/',
      //提交方式
      method: 'get',
    })
  },

  //根据课程id查询课程基本信息

  //查询所有讲师
  getCourseInfo(id){
    return request({
      url: '/eduservice/course/getCourseInfo/'+id,
      //提交方式
      method: 'get',
    })
  },

  //修改课程基本信息
  updateCourseInfo(courseInfo){
    return request({
      url: '/eduservice/course/updateCourseInfo/',
      //提交方式
      method: 'post',
      data: courseInfo
    })
  },

  //课程确认信息显示
  getPublishCourseInfo(id){
    return request({
      url: '/eduservice/course/getPublishCourseInfo/'+id,
      //提交方式
      method: 'get',
    })
  },
  //课程最终发布
  publishCourse(id){
    return request({
      url: '/eduservice/course/publishCourse/'+id,
      //提交方式
      method: 'post',
    })
  },
  //查询课程列表
  getCourseList(page,limit){
    return request({
      url: '/eduservice/course/getCourseList/'+page+"/"+limit,
      //提交方式
      method: 'get',
    })
  },
  //多条件查询

  conditionCourseList(page,limit,courseQuery){
    return request({
      url: '/eduservice/course/conditionCourseList/'+page+"/"+limit,
      //提交方式
      method: 'post',
      data: courseQuery
    })
  },

  //删除课程
  deleteCourse(id){
    return request({
      url: '/eduservice/course/deleteCourse/'+id,
      //提交方式
      method: 'delete',
    })
  }

}
