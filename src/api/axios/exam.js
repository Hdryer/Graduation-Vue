import request from '@/api'

const exam={
    addQuestion:(data={})=>{   //增加试题
        return request.post('/exam/addQuestion',data)
    },
    queryQuestion:(data={})=>{  //查询试题
        return request.post('/exam/queryQuestion',data)
    },
    queryOne:(params={})=>{     //查看单个试题
        return request.get('/exam/query',{params})
    },
    delOne:(params={})=>{     //删除单个试题
        return request.delete('/exam/del',{params})
    },
    addPaper:(data={})=>{     //新增试卷
        return request.post('/exam/addPaper',data)
    },
    queryAllPaper:(data={})=>{  //查询所有试卷
        return request.post('/exam/queryPaper',data)
    },
    queryPaper:(params={})=>{  //查看试卷
        return request.get('/exam/queryOnePaper',{params})
    },
    delPaper:(params={})=>{   //删除试卷
        return request.delete('/exam/delPaper',{params})
    },
    submit:(data={})=>{  //提交试卷
        return request.post('/exam/submit',data)
    }
}

export default {
    ...exam
}