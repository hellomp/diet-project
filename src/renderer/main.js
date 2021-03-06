import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faList, faTable, faCog, faSearch, faPlus, faTrashAlt, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VModal from 'vue-js-modal'
import { Table, TableColumn, Select, Option, Dialog, Pagination } from 'element-ui'
import Multiselect from 'vue-multiselect'
import { DataTables } from 'vue-data-tables'

library.add(faList, faTable, faCog, faSearch, faPlus, faTrashAlt, faSave)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('multiselect', Multiselect)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(DataTables)
Vue.use(VModal)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
