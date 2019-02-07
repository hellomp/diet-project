<template>
  <div id="content">
    <div id="content-header" class="h-12 flex items-center">
      <div class="bg-black flex-grow"></div>
      <div id="version" class="flex-grow flex justify-center text-sm font-semibold">{{diet.name}}</div>
      <div id="control-icons" class="flex-grow flex justify-end text-grey pr-4">
        <font-awesome-icon icon="table" class="mr-2"/>
        <button @click="saveDiet">
          <font-awesome-icon icon="table" />
        </button>
      </div>
    </div>

    <div id="content-body" class="p-4 flex flex-col">
      <div v-for="(meal, mealIndex) in diet.meals" :key="meal.id" id="diets-table" class="bg-white rounded-lg mb-4 shadow">
        <div id="table-header" class="px-4 pt-4 pb-2 flex justify-between items-center">
          <div id="table-title" class="font-semibold text-xl">{{meal.name}}</div>
          <div id="table-action"><button @click="openModal(mealIndex)" class="text-primary">Novo alimento</button></div>
        </div>
        <el-table :data="meal.items" show-summary style="width: 100%">
          <el-table-column fixed type="selection" width="55">
          </el-table-column>
          <el-table-column v-for="(column, index) of columns" :key="index" :prop="column.name" :label="column.label" :width="column.width" :fixed="column.fixed" :sortable="column.sortable">
          </el-table-column>
        </el-table>
      </div>
      <button class="mx-auto bg-primary py-2 px-4 text-white rounded-full shadow" @click="createMeal"> 
        <font-awesome-icon icon="plus" class="mr-2"/>
        <span >Nova refeição</span>
      </button>
    </div>
    <el-dialog :visible.sync="modalOpened" :show-close="false" width="90%" top="5vh">
        <div id="diets-table" class="bg-white rounded-lg">
        <div id="table-header" class="px-4 pt-4 pb-2 flex justify-between items-center">
          <div id="table-search">
            <font-awesome-icon icon="search" class="text-lg mr-4" />
            <input type="text" class="text-base" placeholder="Procure um alimento" v-model="filters[0].value">  
          </div>
          <div id="table-action"><button @click="addSelectedItems" class="text-primary">Adicionar</button></div>
        </div>
        <data-tables ref="newItemTable" :data="getCompositions" :row-key="getRowKey" :table-props="tableProps" :filters="filters" @selection-change="selectNewItemsChange">
          <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
          <el-table-column prop="description" label="Alimento" width="350px" fixed>
          </el-table-column>
          <el-table-column prop="energy_kcal" label="Energia">
          </el-table-column>
          <el-table-column prop="carbohydrate_qty" label="Carboidrato">
          </el-table-column>
          <el-table-column prop="protein_qty" label="Proteína">
          </el-table-column>
          <el-table-column prop="lipid_qty" label="Lipídeo">
          </el-table-column>
          <el-table-column prop="fiber_qty" label="Fibra">
          </el-table-column>
          <el-table-column prop="iron_qty" label="Ferro">
          </el-table-column>
          <el-table-column prop="calcium_qty" label="Cálcio">
          </el-table-column>
          <el-table-column prop="sodium_qty" label="Sódio">
          </el-table-column>
          <el-table-column prop="magnesium_qty" label="Magnésio">
          </el-table-column>
          <el-table-column prop="zinc_qty" label="Zinco">
          </el-table-column>
        </data-tables>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import _ from 'lodash'
  import fs from 'fs'
  import uniqid from 'uniqid'
  import { mapActions, mapGetters } from 'vuex'
  const {dialog} = require('electron').remote

  export default {
    data () {
      return {
        diet: [],
        columns: [
          {
            name: 'description',
            label: 'Descrição',
            sortable: true,
            width: 300,
            fixed: true
          },
          {
            name: 'energy_kcal',
            label: 'Energia',
            sortable: true
          },
          {
            name: 'carbohydrate_qty',
            label: 'Carboidrato',
            sortable: true
          },
          {
            name: 'protein_qty',
            label: 'Proteína',
            sortable: true
          },
          {
            name: 'lipid_qty',
            label: 'Lipídeo',
            sortable: true
          }
        ],
        filters: [{
          prop: 'description',
          value: ''
        }],
        selectedItems: [],
        selectedNewItems: [],
        selectedMealIndex: 0,
        modalOpened: false,
        tableProps: {
          height: '80vh'
        }
      }
    },
    methods: {
      ...mapActions(['updateDiets']),
      createMeal () {
        this.diet.meals.push({
          id: uniqid(),
          name: 'Refeição',
          items: []
        })
      },
      addSelectedItems () {
        this.selectedNewItems.forEach(selectedNewItem => {
          selectedNewItem.item_id = uniqid()
          selectedNewItem.qty = 100
          this.diet.meals[this.selectedMealIndex].items.push(selectedNewItem)
        })
        this.cancelModal()
        this.updateMealTotals(this.selectedMealIndex)
      },
      openModal (mealIndex) {
        this.modalOpened = true
        this.selectedMealIndex = mealIndex
      },
      cancelModal () {
        this.modalOpened = false
        this.$refs.newItemTable.$refs.elTable.clearSelection()
        this.selectedNewItems = []
      },
      selectNewItemsChange (row) {
        this.selectedNewItems = row
      },
      getRowKey (row) {
        return row.id
      },
      getSummaries () {
        console.log('teste')
        /* const sums = []
        this.columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = ''
            return
          }
          if (index === 1) {
            sums[index] = 'Total'
        })
        return sums */

        /* const {
          columns,
          data
        } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = ''
            return
          }
          if (index === 1) {
            sums[index] = 'Total'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = 'N/A'
          }
        })
        return sums */
      },
      saveDiet () {
        // Primeira vez que a dieta é salva localmente
        if (this.diet.path === '') {
          dialog.showSaveDialog({
            filters: [{
              name: 'Diet files',
              extensions: ['json']
            },
            {
              name: 'All files',
              extensions: ['*']
            }
            ]
          }, (fileName) => {
            this.diet.path = fileName
            // Escrever dieta na pasta escolhida
            fs.writeFile(fileName, JSON.stringify(this.diet), 'utf-8', (err) => {
              if (err) throw err
              this.updateDiets(this.diet)
            })
          })
        // Sobreescrever arquivo da dieta caso ele já exista
        } else {
          fs.writeFile(this.diet.path, JSON.stringify(this.diet), 'utf-8', (err) => {
            if (err) throw err
          })
        }
      },
      updateMealTotals (mealId) {
        // let meal = _.findIndex(this.diet.meals, {'id': mealId})
        this.columns.forEach(column => {
          let values = _.sum(_.values(_.mapValues(this.diet.meals[mealId].items, column.name)))
          switch (column.name) {
            case 'description':
              break
            case 'energy_kcal':
              this.diet.meals[mealId].energyTotal = values
              break
            case 'carbohydrate_qty':
              this.diet.meals[mealId].carbohydrateTotal = values
              break
            case 'protein_qty':
              this.diet.meals[mealId].proteinTotal = values
              break
            case 'lipid_qty':
              this.diet.meals[mealId].lipidTotal = values
              break
          }
        })
        this.updateDietTotals()
      },
      updateDietTotals () {
        this.columns.forEach(column => {
          switch (column.name) {
            case 'description':
              break
            case 'energy_kcal':
              this.diet.energyTotal = _.sum(_.values(_.mapValues(this.diet.meals, 'energyTotal')))
              break
            case 'carbohydrate_qty':
              this.diet.carbohydrateTotal = _.sum(_.values(_.mapValues(this.diet.meals, 'carbohydrateTotal')))
              break
            case 'protein_qty':
              this.diet.proteinTotal = _.sum(_.values(_.mapValues(this.diet.meals, 'proteinTotal')))
              break
            case 'lipid_qty':
              this.diet.lipidTotal = _.sum(_.values(_.mapValues(this.diet.meals, 'lipidTotal')))
              break
          }
        })
      }
    },
    computed: {
      ...mapGetters(['getCompositions'])
    },
    created () {
      fs.readFile(this.$route.params.dietPath, 'utf-8', (err, data) => {
        if (err) throw err
        this.diet = JSON.parse(data)
        console.log('Read new diet')
      })
    }
  }
</script>