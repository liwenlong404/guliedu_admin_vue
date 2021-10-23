import request from '@/utils/request' // 模板提供的axios的封装

export default {
  // 条件，分页查询的方法
  // 三个参数：当前页，每页记录数，条件封装对象
  getTeacherPageList(page, limit, searchObj) {
    return request({
      //后端controller路径
      url: '/eduservice/teacher/moreConditionPageList/'+page+'/'+limit,
      //提交方式
      method: 'post',
      //传递条件对象，如果传递json数据，使用data，不是json，使用params
      data: searchObj
    })
  },
  //根据id逻辑删除
  deleteTeacherById(id){
    return request({
      url: '/eduservice/teacher/'+id,
      method: 'delete',
      }
    )
  },
  //保存
  saveTeacher(teacher){
    return request({
        url: '/eduservice/teacher/addTeacher',
        method: 'post',
        data: teacher
      }
    )
  },
  //根据id查询
  getTeacherById(id){
    return request({
      url: '/eduservice/teacher/getTeacherInfo/'+id,
      method: 'get'
    })
  },

  //修改讲师
  updateTeacherById(id,teacher){
    return request({
      url: '/eduservice/teacher/updateTeacher/'+id,
      method: 'post',
      data: teacher
    })
  }
}
