<template>
  <div class="login-container">
    <span>
        <h2>{{msg}}</h2>
        <p><input type="text" v-model="msg"></p>
        <span><p v-html="innerhtml"></p></span>
        <span :id="xx"></span>
        <span>{{num+10}}</span>
        <p></p>
        <span>{{flag ? "真猴子":"假猴子"}}</span>
    </span>
  </div>
</template>

<script>
export default {
    name:'test',
    data(){
        return{
            msg: "bindada",
            innerhtml:"<a href='https://www.baidu.com'>百度</a>",
            xx:1001,
            num:10,
            flag:false
        }
    }
}
</script>
