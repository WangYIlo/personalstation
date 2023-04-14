import request from "@/utils/request";


//登录接口 URL:/api/login 请求方式:POST  data中接收username,password两个参数
export const loginAPI = ({ username, password }) => {
    return request({
        method: 'POST',
        url: '/api/login',
        data: {
            username,
            password
        }
    })
}


//注册接口 URL:/api/register 请求方式:POST  data中接收username,password两个参数
export const registerAPI = ({ username, password, repassword }) => {
    return request({
        method: 'POST',
        url: '/api/register',
        data: {
            username,
            password,
            repassword
        }
    })
}

//获取用户信息 URL:/my/userinfo method:GET
export const reqGetUserInfo = () => {
    return request({
        method: 'GET',
        url: '/my/userinfo',
    })
}

//获取侧边栏数据 URL:/my/menus  method:GET
export const getMenusAPI = () => {
    return request({
        url: '/my/menus',
    })
}

//更新用户基本资料 URL:/my/userinfo method:POST  data中接收id,nickname,email
export const updateUserInfoAPI = ({ id, email, nickname }) => {
    return request({
        method: 'POST',
        url: '/my/userinfo',
        data: {
            id,
            email,
            nickname,
        }
    })
}


//更改头像接口  URL: /my/update/avatar  method:POST  data中接收avatar
export const updateAvatarAPI = (avatar) => {
    return request({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar
        }
    })
}


//重置密码 URL：/my/updatepwd  method:POST  data接收oldPwd,newPwd
export const updatePwdAPI = ({ oldPwd, newPwd }) => {
    return request({
        method: 'POST',
        url: '/my/updatepwd',
        data: {
            oldPwd,
            newPwd
        }
    })
}

//获取文章分类 URL：/my/article/cates method:GET
export const getArtCateAPI = () => {
    return request({
        method: 'GET',
        url: '/my/article/cates'
    })
}


//添加文章分类 URL：/my/article/addcates method:POST  data接收 name alias
export const addArtCateAPI = (name, alias) => {
    return request({
        method: 'POST',
        url: '/my/article/addcates',
        data: {
            name,
            alias
        }
    })
}


//更新文章分类 URL:/my/article/updatecate method:POST data接收 id name alias
export const updateCateAPI = (name, alias, id) => {
    return request({
        method: 'POST',
        url: '/my/article/updatecate',
        data: {
            name,
            alias,
            id
        }
    })
}

//删除文章分类 URL：/my/article/deletecate/:id  method:DELETE
export const deleteCateAPI = (id) => {
    return request({
        method: 'delete',
        url: `/my/article/deletecate/${id}`,
    })
}

//添加文章 URL:/my/article/add  method:POST data接收表单对象
export const uploadArticleAPI = (fd) => {
    return request({
        url: '/my/article/add',
        method: 'POST',
        data: fd
    })
}


//获取所有文章  URL:/my/article/list  method:GET  
export const getAllArticleAPI = () => {
    return request({
        method: 'GET',
        url: '/my/article/list'
    })
}


//根据分类名字，状态获取文章 URL：/my/article/listByDetail   method:POST 接收cate_name state
export const getArticleByDetail = (cate_name,state) => {
    return request({
        method: 'POST',
        url:'/my/article/listByDetail',
        data: {
            cate_name,
            state
        }
    })
}


//获取文章详情 URL:/my/article/info  method:POST
export const getArticleInfo=(id)=>{
    return request({
        method:'GET',
        url:'/my/article/info',
        params:{
            id
        }
    })
}

//删除文章 URL：/my/article/info method:DELETE
export const deleteArticleInfo=(id)=>{
    return request({
        method:'DELETE',
        url:'/my/article/info',
        params:{
            id
        }
    })
}