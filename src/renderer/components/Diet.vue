<template>
  <div id="content">
    <div id="content-header" class="h-12 flex items-center">
      <div class="bg-black flex-grow"></div>
      <div id="version" class="flex-grow flex justify-center text-sm font-semibold">{{diet.name}}</div>
      <div id="control-icons" class="flex-grow flex justify-end text-grey pr-4">
        <button @click="saveDiet">
          <font-awesome-icon icon="save" />
        </button>
        <button @click="exportDiet">
          <font-awesome-icon icon="table" />
        </button>
      </div>
    </div>

    <div id="content-body">
      <div id="tables" class="p-4 pr-2 flex flex-col">
        <div v-for="(meal, mealIndex) in diet.meals" :key="meal.id" id="diets-table" class="bg-white rounded-lg mb-4 shadow">
          <div id="table-header" class="px-4 pt-4 pb-2 flex justify-between items-center">
            <div id="table-title" class="font-semibold text-xl">{{meal.name}}</div>
            <div id="table-action">
              <button @click="openModal(mealIndex)" class="text-primary mx-4">Novo alimento</button>
              <button @click="deleteIMeal(mealIndex)" class="text-grey"><font-awesome-icon icon="trash-alt"/></button>
              </div>
          </div>
          <el-table :data="meal.items" row-key="item_id" :value="mealIndex" show-summary :summary-method="getSummaries" @selection-change="selectItemsChange" style="width: 100%">
            <el-table-column fixed type="selection" width="55">
            </el-table-column>
            <el-table-column prop="description" label="Descrição" width="300" fixed>
            </el-table-column>
            <el-table-column prop="qty" label="Quantidade" fixed>
              <template slot-scope="scope">
                <input type="number" v-model.number="scope.row.qty" @input="updateQty(mealIndex, scope.row.item_id)">
              </template>
            </el-table-column>
            <el-table-column  v-for="(column, index) in selectedColumns" :key="index" :prop="column.name" :label="column.label" :width="column.width" :fixed="column.fixed" :sortable="column.sortable">
            </el-table-column>
          </el-table>
        </div>
        <div>
          <multiselect v-model="selectedColumns" :options="columns" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" label="label" track-by="name" :preselect-first="true">
          </multiselect>
        </div>
        <button class="mx-auto bg-primary py-2 px-4 text-white rounded-full shadow" @click="createMeal"> 
          <font-awesome-icon icon="plus" class="mr-2"/>
          <span >Nova refeição</span>
        </button>
      </div>
      <div id="results" class="p-4 pl-2">
        <div class="w-full h-auto pt-4 bg-white rounded-lg shadow">
          <div class="flex flex-col mb-4 items-center">
            <span class="px-3 py-1 mb-2 text-sm border rounded-full">Energia</span>
            <div class="flex w-full justify-between">
              <div class="w-full flex items-center justify-center">{{this.diet.energyTotal}} kcal</div>
              <div class="w-auto px-2 py-1 bg-positive rounded-full text-white font-bold text-sm">{{updatePercentage(this.diet.energyTotal, this.diet.energyTarget)}}%</div>
              <div class="w-full flex items-center justify-center">{{this.diet.energyTarget}} kcal</div>
            </div>
          </div>
          <div class="flex flex-col mb-4 items-center">
            <span class="px-3 py-1 mb-2 text-sm border rounded-full">Carboidrato</span>
            <div class="flex items-center w-full justify-between">
              <div class="w-full flex flex-col items-center justify-center">
                <span>{{this.diet.carbohydrateTotal}} kcal</span>
                <span>20%</span>
                <span>5 g/kg</span>
              </div>
              <div class="w-auto h-full px-2 py-1 bg-negative rounded-full text-white font-bold text-sm">100%</div>
              <div class="w-full flex flex-col items-center justify-center">
                <span>{{this.diet.carbohydrateTarget}} kcal</span>
                <span>20%</span>
                <span>5 g/kg</span>
              </div>            
            </div>
          </div>
        </div>
      </div>
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
    <button v-if="selectedItems.length > 0" class="bg-negative py-2 px-4 mb-6 mr-6 text-white rounded-full shadow fixed pin-b pin-r" @click="deleteItems"> 
          <font-awesome-icon icon="trash-alt" class="mr-2"/>
          <span>Excluir</span>
    </button>
  </div>
</template>
<script>
  import _ from 'lodash'
  import fs from 'fs'
  /* eslint-disable */
  import { Document, Packer, Paragraph } from 'docx'
  import uniqid from 'uniqid'
  import Sortable from 'sortablejs'
  import { mapActions, mapGetters } from 'vuex'
import { currentId } from 'async_hooks';
  const {dialog} = require('electron').remote

  export default {
    data () {
      return {
        diet: {},
        columns: [
          {
            name: 'actualEnergy_kcal',
            label: 'Energia',
            sortable: true
          },
          {
            name: 'actualCarbohydrate_qty',
            label: 'Carboidrato',
            sortable: true
          },
          {
            name: 'actualProtein_qty',
            label: 'Proteína',
            sortable: true
          },
          {
            name: 'actualLipid_qty',
            label: 'Lipídeo',
            sortable: true
          }
        ],
        filters: [{
          prop: 'description',
          value: ''
        }],
        selectedColumns: [],
        selectedItems: [],
        selectedNewItems: [],
        selectedMealIndex: 0,
        modalOpened: false,
        tableProps: {
          height: '80vh'
        },
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
          this.diet.meals[this.selectedMealIndex].items.push({
            id: selectedNewItem.id,
            item_id: uniqid(),
            qty: 100,
            description: selectedNewItem.description,
            actualEnergy_kcal: selectedNewItem.energy_kcal,
            actualCarbohydrate_qty: selectedNewItem.carbohydrate_qty,
            actualProtein_qty: selectedNewItem.protein_qty,
            actualLipid_qty: selectedNewItem.lipid_qty,
            energy_kcal: selectedNewItem.energy_kcal,
            carbohydrate_qty: selectedNewItem.carbohydrate_qty,
            protein_qty: selectedNewItem.protein_qty,
            lipid_qty: selectedNewItem.lipid_qty
          })
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
      selectItemsChange (row) {
        this.selectedItems = row
      },
      selectNewItemsChange (row) {
        this.selectedNewItems = row
      },
      deleteIMeal (mealId) {
        this.diet.meals.splice(mealId, 1)
      },
      deleteItems () {
        this.selectedItems.forEach(selectedItem => {
          this.diet.meals.forEach(meal => {
            for (let i = 0; i < meal.items.length; i++) {
              if (meal.items[i].item_id === selectedItem.item_id) {
                meal.items.splice(i, 1)
              }
            }
          })
        })
      },
      getRowKey (row) {
        return row.id
      },
      getSummaries (param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            return
          }
          if (index === 1) {
            sums[index] = 'Total'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = _.round(values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0), 2)
          } else {
            sums[index] = 'N/A'
          }
        })

        return sums
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
      exportDiet () {
        let doc = new Document()
        let itemsExport = []
        let items = []
        let countItems = 0
        this.diet.meals.forEach(meal => {
          meal.items.forEach(item => {
            items.push({
              id: item.id,
              item_id: item.item_id,
              qty: item.qty,
              description: item.description,
              actualEnergy_kcal: item.actualEnergy_kcal,
              actualCarbohydrate_qty: item.actualCarbohydrate_qty,
              actualProtein_qty: item.actualProtein_qty,
              actualLipid_qty: item.actualLipid_qty,
            })
            countItems += 1
          })
        })
        /* Tabela qualitativa */
        let qualilativeTable = doc.createTable(countItems + 1, 3)
        let currentRow = 0
        qualilativeTable.getCell(0, 0).addContent(new Paragraph('REFEIÇÃO'))
        qualilativeTable.getCell(0, 1).addContent(new Paragraph('ALIMENTOS'))
        qualilativeTable.getCell(0, 2).addContent(new Paragraph('QUANT'))
        this.diet.meals.forEach(meal => {
          qualilativeTable.getCell(currentRow + 1, 0).addContent(new Paragraph(meal.name))
          meal.items.forEach(item => {
            qualilativeTable.getCell(currentRow + 1, 1).addContent(new Paragraph(item.description))
            qualilativeTable.getCell(currentRow + 1, 2).addContent(new Paragraph(item.qty))
            currentRow += 1
          })
        })
        /* Tabela de composição */      
        items.forEach(item => {
          if(itemsExport.length > 0){
            for(let i = 0; i < itemsExport.length; i++){
              let noItemEqual = true
              if(item.item_id === itemsExport[i].item_id){
                return
              }
              if(item.id === itemsExport[i].id) {
                console.log(item.description + 'Id: ' + item.id + ' ' + itemsExport[i].id + ' ItemId:' + item.item_id + ' ' + itemsExport[i].item_id) 
                console.log(this.diet.meals[0].items[2].qty)               
                itemsExport[i].qty += item.qty
                console.log(this.diet.meals[0].items[2].qty)
                console.log(this.diet.meals[0].items[2].actualEnergy_kcal)
                itemsExport[i].actualEnergy_kcal += item.actualEnergy_kcal
                console.log(this.diet.meals[0].items[2].actualEnergy_kcal)
                itemsExport[i].actualCarbohydrate_qty += item.actualCarbohydrate_qty
                itemsExport[i].actualProtein_qty += item.actualProtein_qty
                itemsExport[i].actualLipid_qty += item.actualLipid_qty
                noItemEqual = false
                return
              }
              if(i === itemsExport.length-1 && noItemEqual){
                itemsExport.push(item)
              }
            }
          }else{
            itemsExport.push(item)
          }
        })
        let compositionTable = doc.createTable(itemsExport.length + 2, 5)
        currentRow = 0
        compositionTable.getCell(0, 0).addContent(new Paragraph('ALIMENTO'))
        compositionTable.getCell(0, 1).addContent(new Paragraph('Kcal'))
        compositionTable.getCell(0, 2).addContent(new Paragraph('CARB'))
        compositionTable.getCell(0, 3).addContent(new Paragraph('PROT'))
        compositionTable.getCell(0, 4).addContent(new Paragraph('LIP'))
        itemsExport.forEach(itemExport => {
          compositionTable.getCell(currentRow + 1, 0).addContent(new Paragraph(itemExport.description))
          compositionTable.getCell(currentRow + 1, 1).addContent(new Paragraph(itemExport.actualEnergy_kcal))
          compositionTable.getCell(currentRow + 1, 2).addContent(new Paragraph(itemExport.actualCarbohydrate_qty))
          compositionTable.getCell(currentRow + 1, 3).addContent(new Paragraph(itemExport.actualProtein_qty))
          compositionTable.getCell(currentRow + 1, 4).addContent(new Paragraph(itemExport.actualLipid_qty))
          currentRow += 1
        })
        compositionTable.getCell(itemsExport.length + 1, 0).addContent(new Paragraph('TOTAL'))
        compositionTable.getCell(itemsExport.length + 1, 1).addContent(new Paragraph(this.diet.energyTotal))
        compositionTable.getCell(itemsExport.length + 1, 2).addContent(new Paragraph(this.diet.carbohydrateTotal))
        compositionTable.getCell(itemsExport.length + 1, 3).addContent(new Paragraph(this.diet.proteinTotal))
        compositionTable.getCell(itemsExport.length + 1, 4).addContent(new Paragraph(this.diet.lipidTotal))
        let packer = new Packer()
        packer.toBuffer(doc).then((buffer) => {
          fs.writeFileSync('Hello world.docx', buffer)
        })
      },
      updateQty (mealId, itemId) {
        let actualItemId = _.findIndex(this.diet.meals[mealId].items, {'item_id': itemId})
        let baseQty = _.divide(this.diet.meals[mealId].items[actualItemId].qty, 100)
        this.columns.forEach(column => {
          switch (column.name) {
            case 'actualEnergy_kcal':
              this.diet.meals[mealId].items[actualItemId].actualEnergy_kcal = _.round(_.multiply(this.diet.meals[mealId].items[actualItemId].energy_kcal, baseQty), 2)
              break
            case 'actualCarbohydrate_qty':
              this.diet.meals[mealId].items[actualItemId].actualCarbohydrate_qty = _.round(_.multiply(this.diet.meals[mealId].items[actualItemId].carbohydrate_qty, baseQty), 2)
              break
            case 'actualProtein_qty':
              this.diet.meals[mealId].items[actualItemId].actualProtein_qty = _.round(_.multiply(this.diet.meals[mealId].items[actualItemId].protein_qty, baseQty), 2)
              break
            case 'actualLipid_qty':
              this.diet.meals[mealId].items[actualItemId].actualLipid_qty = _.round(_.multiply(this.diet.meals[mealId].items[actualItemId].lipid_qty, baseQty), 2)
              break
          }
        })
        this.updateMealTotals(mealId)
      },
      updateMealTotals (mealId) {
        // let meal = _.findIndex(this.diet.meals, {'id': mealId})
        this.columns.forEach(column => {
          let values = _.sum(_.values(_.mapValues(this.diet.meals[mealId].items, column.name)))
          switch (column.name) {
            case 'description':
              break
            case 'qty':
              break
            case 'actualEnergy_kcal':
              this.diet.meals[mealId].energyTotal = _.round(values, 2)
              break
            case 'actualCarbohydrate_qty':
              this.diet.meals[mealId].carbohydrateTotal = _.round(values, 2)
              break
            case 'actualProtein_qty':
              this.diet.meals[mealId].proteinTotal = _.round(values, 2)
              break
            case 'actualLipid_qty':
              this.diet.meals[mealId].lipidTotal = _.round(values, 2)
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
            case 'qty':
              break
            case 'actualEnergy_kcal':
              this.diet.energyTotal = _.round(_.sum(_.values(_.mapValues(this.diet.meals, 'energyTotal'))), 2)
              break
            case 'actualCarbohydrate_qty':
              this.diet.carbohydrateTotal = _.round(_.sum(_.values(_.mapValues(this.diet.meals, 'carbohydrateTotal'))), 2)
              break
            case 'actualProtein_qty':
              this.diet.proteinTotal = _.round(_.sum(_.values(_.mapValues(this.diet.meals, 'proteinTotal'))), 2)
              break
            case 'actualLipid_qty':
              this.diet.lipidTotal = _.round(_.sum(_.values(_.mapValues(this.diet.meals, 'lipidTotal'))), 2)
              break
          }
        })
      },
      updatePercentage (totalValue, targetValue) {
        return _.round(_.multiply(_.divide(totalValue, targetValue), 100), 2)
      }
    },
    computed: {
      ...mapGetters(['getCompositions'])
    },
    watch: {
      diet: {
        handler(){
          console.log('Update Diet')
        },
        deep: true
      }
    },
    created () {
      fs.readFile(this.$route.params.dietPath, 'utf-8', (err, data) => {
        if (err) throw err
        this.diet = JSON.parse(data)
        console.log('Read new diet')
      })
    },
    updated () {
      const tables = document.querySelectorAll('.el-table__fixed-body-wrapper tbody')
      const self = this
      for (let i = 0; i < tables.length; i++) {
        Sortable.create(tables[i], {
          animation: 150,
          group: 'table',
          onEnd ({ newIndex, oldIndex, to, from }) {
            let fromValue = from.parentNode.parentNode.parentNode.parentNode.getAttribute('value')
            let toValue = to.parentNode.parentNode.parentNode.parentNode.getAttribute('value')
            if (fromValue === toValue) {
              const targetRow = self.diet.meals[i].items.splice(oldIndex, 1)[0]
              self.diet.meals[i].items.splice(newIndex, 0, targetRow)
            } else {
              const targetRow = self.diet.meals[fromValue].items.splice(oldIndex, 1)[0]
              self.diet.meals[toValue].items.splice(newIndex, 0, targetRow)
            }
          }
        })
      }
    }
  }
</script>
<style scoped>
#content-body{
  display: flex;
}
#tables{
  width: calc(100% - 350px)
}
#results{
  width: 350px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
