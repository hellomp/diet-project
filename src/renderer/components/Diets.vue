<template>
  <div id="content">
    <div id="content-header" class="h-12 flex items-center justify-center">
      <div id="version" class="text-sm font-semibold">0.0.1</div>
    </div>

    <div id="content-body" class="p-4">
      <div id="diets-table" class="bg-white rounded-lg shadow">
        <div id="table-title" class="pl-4 pt-4 pb-2 font-semibold text-xl">Dietas</div>
        <el-table :data="getDiets" @row-click="openDiet">
          <el-table-column prop="name" label="Nome" width="350px">
          </el-table-column>
          <el-table-column prop="created" label="Criado em">
          </el-table-column>
          <el-table-column prop="lastUpdate" label="Última atualização">
          </el-table-column>
        </el-table>
      </div>
    </div>

    <button class="bg-primary w-fit fixed pin-b pin-r mb-4 mr-4 py-2 px-4 text-lg text-white rounded-full shadow" @click="openModal">
      <font-awesome-icon icon="plus" class="mr-2" />
      <span>Nova dieta</span>
    </button>
    <el-dialog :visible.sync="modalOpened" :show-close="false" width="60%" top="5vh">
        <div id="dialog-header" class="font-semibold text-xl px-4 py-4">Nova Dieta</div>
        <div id="dialog-form" class="px-4 flex flex-col">
          <div class="flex mb-2">
            <input type="text" v-model="newDiet.name" placeholder="Nome" class="flex-grow px-4 py-2 border-2 border-grey text-lg rounded-full">
          </div>
          <div class="flex mb-2">
            <input type="text" placeholder="Refeição" class="flex-grow px-4 py-2 border-2 border-grey text-lg rounded-full">
          </div>
          <div class="flex mb-2">
            <input type="text" v-model="newDiet.energyTarget" placeholder="Energia" class="flex-grow w-full mr-1 px-4 py-2 border-2 border-grey text-lg rounded-full">
            <input type="text" v-model="newDiet.carbohydrateTarget" placeholder="Carboidrato" class="flex-grow w-full ml-1 px-4 py-2 border-2 border-grey text-lg rounded-full">
          </div>
          <div class="flex mb-3">
            <input type="text" v-model="newDiet.proteinTarget" placeholder="Proteína" class="flex-grow w-full mr-1 px-4 py-2 border-2 border-grey text-lg rounded-full">
            <input type="text" v-model="newDiet.lipidTarget" placeholder="Lipídeo" class="flex-grow w-full ml-1 px-4 py-2 border-2 border-grey text-lg rounded-full">
          </div>
          <div class="flex justify-end mb-4">
            <button @click="cancelModal" class="border-primary border-2 mr-2 py-2 px-4 text-lg text-primary rounded-full">Cancelar</button>
            <button @click="createDiet" class="bg-primary py-2 px-4 text-lg text-white rounded-full">Criar</button>
          </div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    remote
  } from 'electron'
  import tmp from 'tmp'
  import fs from 'fs'

  export default {
    name: 'diets',
    data () {
      return {
        modalOpened: false,
        newDiet: {
          name: '',
          path: '',
          energyTarget: '',
          carbohydrateTarget: '',
          proteinTarget: '',
          lipidTarget: '',
          energyTotal: '',
          carbohydrateTotal: '',
          proteinTotal: '',
          lipidTotal: '',
          meals: []
        }
      }
    },
    computed: {
      ...mapGetters(['getDiets'])
    },
    methods: {
      openDiet (row) {
        this.$router.push({
          name: 'diet',
          params: {
            dietPath: row.path
          }
        })
      },
      createDiet () {
        let newDietData = JSON.stringify(this.newDiet)
        let instance = this
        tmp.file({
          dir: remote.app.getPath('temp')
        }, function _tempFileCreated (err, path, fd, cleanupCallback) {
          if (err) throw err
          console.log('File: ', path)
          console.log('Filedescriptor: ', fd)
          fs.writeFile(path, newDietData, 'utf-8', (err) => {
            if (err) throw err
            instance.cancelModal()
            instance.$router.push({
              name: 'diet',
              params: {
                dietPath: path
              }
            })
          })
        })
      },
      openModal () {
        this.modalOpened = true
      },
      cancelModal () {
        this.resetNewDiet()
        this.modalOpened = false
      },
      resetNewDiet () {
        this.newDiet.name = ''
        this.newDiet.path = ''
        this.newDiet.energyTarget = ''
        this.newDiet.carbohydrateTarget = ''
        this.newDiet.proteinTarget = ''
        this.newDiet.lipidTarget = ''
        this.newDiet.meals = []
      }
    }
  }
</script>