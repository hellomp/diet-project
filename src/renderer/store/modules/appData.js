import fs from 'fs'
import sqlite from 'sqlite-sync'
import {remote} from 'electron'
const dietsPath = remote.app.getPath('userData') + '/diets.json'
export default{
  state: {
    diets: [],
    compositions: []
  },
  getters: {
    getDiets (state) {
      return state.diets
    },
    getCompositions (state) {
      console.log('GET COMPOSITIONS')
      return state.compositions
    }
  },
  mutations: {
    SET_DIETS: (state, diets) => {
      console.log('Diets list set')
      state.diets = diets
    },
    SET_COMPOSITIONS: (state, compositions) => {
      state.compositions = compositions
    }
  },
  actions: {
    setDiets: ({commit}) => {
      fs.readFile(dietsPath, 'utf-8', (err, data) => {
        if (err == null) {
          console.log('File found')
          commit('SET_DIETS', JSON.parse(data))
        } else if (err.code === 'ENOENT') {
          console.log('Create file')
          fs.writeFile(dietsPath, JSON.stringify(this.state.diets), 'utf-8', (err) => {
            if (err) throw err
          })
        } else {
          console.log('Some other error: ', err.code)
        }
      })
    },
    updateDiets: ({commit, state}, diet) => {
      // Adicionar a dieta salva à lista de dietas do app
      let diets = state.diets
      let thisDiet = {name: diet.name, path: diet.path}
      diets.push(thisDiet)
      fs.writeFile(dietsPath, JSON.stringify(diets), 'utf-8', (err) => {
        if (err) throw err
        console.log('Dieta adicionada à lista adasd:' + dietsPath)
        console.log('Dietas:' + diets)
        commit('SET_DIETS', diets)
      })
    },
    setCompositions: ({commit}) => {
      sqlite.connect('src/renderer/database/composition-data.db')
      sqlite.run('SELECT * FROM compositions', (res) => {
        if (res.error) throw res.error
        commit('SET_COMPOSITIONS', res)
        sqlite.close()
        console.log('Read database')
      })
    }
  }
}
