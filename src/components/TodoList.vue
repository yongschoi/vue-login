<template>
  <div>
    <div>
      <v-row justify="space-around">
        <v-radio-group v-model="completeType" row dense>
          <v-radio label="해야할일" color="red" value="N"></v-radio>
          <v-radio label="완료한일" color="green" value="Y"></v-radio>
        </v-radio-group>
      </v-row>
    </div>
    <v-simple-table>
      <template v-slot:default>
        <tbody>
          <tr v-for="(todo, idx) in todos" 
            :key="idx"
            v-show="todo.complete === completeType"
          >
            <td>{{ todo.title }}</td>
            <td>
              <v-row justify="end">
                <v-btn 
                  color="primary"
                  class="mr-1"
                  small
                  @click="complete(todo.id)"
                >{{ viewCompleteText }}</v-btn>
                <v-btn 
                  color="error"
                  class="mr-1"
                  small
                  @click="del(todo.id)"
                >삭제</v-btn>
              </v-row>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
  export default {
    name: 'TodoList',
    props: ['todos'],
    data() {
      return {
        completeType: 'N',
        todothing: 'red',
        completething: 'primary'
      }
    },
    computed: {
      viewCompleteText() {
        let completeText
        if(this.completeType === 'Y')
          completeText = '미완료'
        else
          completeText = '완료'

        return completeText
      }
    },
    methods: {
      del(id) {
        this.$emit('del-todo', id)
      },
      complete(id) {
        this.$emit('complete-todo', id)
      }
    }
  }
</script>
