<template>
  <div id="container" class="bg-background">
    <div id="side-bar" class="h-screen w-14">
      <div id="side-bar-header" class="w-full h-12 flex items-center">
        D
      </div>
      <div id="side-bar-items" class="">
        <ul class="list-reset mt-4 flex flex-col items-center">
          <li class="h-10 w-10 mb-2 flex items-center justify-center rounded-full text-grey">
            <button>
              <router-link to="/diets">
              <font-awesome-icon icon="list"/>
              </router-link>
            </button>
          </li>
          <li class="h-10 w-10 mb-2 flex items-center justify-center rounded-full text-grey">
            <font-awesome-icon icon="table" />
          </li>
          <li class="h-10 w-10 mb-2 flex items-center justify-center rounded-full text-grey">
            <font-awesome-icon icon="cog" />
          </li>
        </ul>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import '../assets/main.css'
import '../assets/table.css'
import '../assets/font.css'
import {
  mapActions,
  mapGetters
} from 'vuex'
export default {
  name: 'Main',
  data () {
    return {
      isCollapse: true,
      columns: [
        'description', 'energy_kcal', 'carbohydrate_qty'
      ],
      options: {
        columnsDropdown: true,
        sortable: ['description']
      }
    }
  },
  methods: {
    ...mapActions(['setCompositions', 'setDiets'])
  },
  computed: {
    ...mapGetters(['getCompositions'])
  },
  created () {
    this.setDiets()
    this.setCompositions()
    // console.log(this.getCompositions)
  }
}
</script>

<style>
#container{
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  min-width: 0;
}
#content{
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  min-width: 0;
}
#content-body{
  /* display: block; */
  flex: 1;
  flex-basis: auto;
}
</style>