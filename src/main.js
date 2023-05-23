import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import 'mavon-editor/dist/css/index.css'
import Prism from 'prismjs';


//默认请求域名
axios.defaults.baseURL = "/"
    //默认请求超时
axios.defaults.timeout = 5000;

VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});

//将axios挂载到全局
const app = createApp(App);
app.config.globalProperties.$axios = axios
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(store).use(router).use(VueMarkdownEditor).mount('#app')