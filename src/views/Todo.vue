<template>
  <div>
    <h1>To do List</h1>
    <v-container fill-height style="max-width:450px;">
      <v-flex>
        <v-text-field 
          placeholder="해야 할 일"
          v-model="title"
          append-icon="mdi-plus-circle"
          @click:append="addTodo(title)"
          v-on:keyup.enter="addTodo(title)">
        ></v-text-field>
        <div>
          <todo-list
            v-bind:todos="todos"
            v-on:complete-todo="completeTodo"
            v-on:del-todo="delTodo"
          ></todo-list>
        </div>
      </v-flex>
    </v-container>
  </div>
</template>

<script>
import axios from "axios"
import TodoList from '@/components/TodoList' // todo-list 컴포넌트 import
import { catchStatus } from "../mixins/catchStatus"
const target = 'http://127.0.0.1:8081/todo'

export default {
  name: 'Todo',
  data() {
    return {
      title: '',
      todos: []
    }
  },
  methods: {
    getTodos () {
      let token = localStorage.getItem('access-token')
      // root 위치 vue.config.js에 /api 가 정의되어 있음.
      axios.get(`${target}/all`, { 
        headers: {
          'access-token': token
        }
      }).then(res => { 
          this.todos = res.data
      }).catch(err => {
        this.catchStatus(err)
      })

      /*
      var req = new XMLHttpRequest();
      req.open('GET', 'http://127.0.0.1:8081/todo/all', true);
      req.setRequestHeader('Access-Control-Allow-Origin', '*')
      req.setRequestHeader('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS')
      req.setRequestHeader('Access-Control-Allow-Headers', '*')
      req.setRequestHeader('access-token', token)
      req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
          console.log("Status: ", req.status);
          console.log("Response message: ", req.responseText);
        }
      }
      req.send(null)
      */
    },
    addTodo(title) {
      if(title) {
        const newId = new Date().getTime();
        // access-token은 store/index.js에서 axios.defaults.headers로 설정함
        axios.post(target + '/create', {
          id: newId,
          title: title,
          complete: 'N'
        }).then((res) => {
          this.todos.push(res.data)
          this.title = ''
        }).catch(err => {
          this.catchStatus(err)
        })
      }
    },
    completeTodo(id) {
      const idx = this.todos.findIndex(function(item) {return item.id === id})      
      if(idx > -1) {
        // access-token은 store/index.js에서 axios.defaults.headers로 설정함
        axios.put(target + '/update', {
          id: id,
          title: this.todos[idx].title,
          complete: this.todos[idx].complete === 'N' ? 'Y' : 'N'
        }).then((res) => {
          this.todos[idx].complete = this.todos[idx].complete === 'N' ? 'Y' : 'N'
        }).catch(err => {
          this.catchStatus(err)
        })
      }
    },
    delTodo(id) {
      const idx = this.todos.findIndex(function(item) {return item.id === id})
      if(idx > -1) {
        // access-token은 store/index.js에서 axios.defaults.headers로 설정함
        axios.delete(target + '/delete/' + id)
        .then((res) => {
          this.todos.splice(idx, 1)
        }).catch(err => {
          this.catchStatus(err)
        })
      }
    }
  },
  components: {
    'todo-list': TodoList
  },
  mounted() {
    this.getTodos()
  },
  mixins: [catchStatus]
}
</script>