import Vue from 'vue'
import Router from 'vue-router'
import diets from '@/components/Diets.vue'
import diet from '@/components/Diet.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: require('@/layouts/MainLayout').default,
      children: [
        {path: '', name: 'diets', component: diets},
        {path: 'diet/:dietPath', name: 'diet', component: diet}
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
