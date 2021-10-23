import request from '@/utils/request'
import vi from 'element-ui/src/locale/lang/vi'

export default {

  //添加小节
 addVideo(video) {
    return request({
      url: '/eduservice/video/addVideo/',
      method: 'post',
      data: video
    })
  },

  //根据id删除章节
  deleteVideo(id) {
    return request({
      url: '/eduservice/video/deleteVideo/'+id,
      method: 'delete'
    })
  },

  //根据i查询章节
  getVideo(id) {
    return request({
      url: '/eduservice/video/getVideo/'+id,
      method: 'get'
    })
  },

  updateVideo(video){
    return request({
      url: '/eduservice/video/updateVideo/',
      method: 'post',
      data: video
    })
  },

  //根据id删除章节
  deleteAliVideo(id) {
    return request({
      url: '/eduvod/video/deleteAliVideo/'+id,
      method: 'delete'
    })
  },
}
