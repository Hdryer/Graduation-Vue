import request from '@/api'

const sources={
    queryAllSources:(data={})=>{  //查询所有资源
        return request.post('/sources/queryAll',data)
    },
    delSources:(params={})=>{  //删除资源
        return request.delete('/sources/del',{params})
    }
}

export default {
    ...sources
}