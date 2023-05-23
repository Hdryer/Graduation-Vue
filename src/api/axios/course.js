import request from '@/api'

const course={
    getSubject:()=>{                    //获取科目列表
        return request.get('/subject/list')
    },
    getVideo:(params={})=>{          //获取视频流
        return request.get('/course/video/play',{params})
    },
    uploadSources:(data={})=>{       //上传教学资源
        return request.post('/sources/upload',data)
    },
    sourcesList:(params={})=>{       //获取资源列表
        return request.get('/sources/list',{params})
    },
    querySources:(params={})=>{      //获取资源
        return request.get('/course/video/play1',{params})
    },
    checkSourcesList:(params={})=>{   //获取资源
        return request.get('/sources/queryChecking',{params})
    },
    downLoadSources: (filename)=>{     //下载文件
        return request.get('/file/downLoad?fileName='+filename)
    },
    checkSources:(params={})=>{    //审核资源
        return request.get('/sources/check',{params})
    },
    dismissSources:(params={})=>{   //驳回资源
        return request.get('/sources/dismiss',{params})
    },
    addCourse:(data={})=>{      //新建课程
        return request.post('/course/add',data)
    },
    queryCourse:(params={})=>{    //查询课程
        return request.get('/course/query',{params})
    },
    queryAllCourse:(data={})=>{   //查询所有课程
        return request.post('/course/queryAll',data)
    },
    delCourse:(params={})=> {    //删除课程
        return request.delete('/course/del',{params})
    },
    saveOutline:(data={})=>{     //保存编辑大纲
        return request.put('/course/updateOutlin',data)
    },
    queryOutline:(params={})=>{   //查询大纲
        return request.get('/course/queryOutlin',{params})
    },
    publishCourse:(params={})=>{   //上线
        return request.put('/course/publishCourse',null,{params})
    },
    unPublishCourse:(params={})=>{   //下线
        return request.put('/course/unPublishCourse',null,{params})
    },
    queryCoursePaper:(params={})=>{
        return request.get('/course/queryCoursePaper',{params})
    }
}

export default {
    ...course
}