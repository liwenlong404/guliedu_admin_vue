import request from '@/utils/request' // 模板提供的axios的封装

export default {

  getNestedTreeList() {
    return request({
      url: '/eduservice/subject/getAllSubject/',
      //提交方式
      method: 'get',
      //传递条件对象，如果传递json数据，使用data，不是json，使用params
    })
  }
}

