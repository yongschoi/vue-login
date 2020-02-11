<template>
  <div>
    <h1>File Explorer<font color="darkgray"> {{ displayCurrent }}</font></h1>
    <v-container>
      <v-card class="mx-auto">
        <v-divider />
        <v-list dense>
          <v-list-item-group color="primary">
            <v-list-item
              v-for="(item, i) in fileList"
              :key="i"
              @click="selectFile(item.charAt(0), item.substring(1))"
            >
              <!-- file name에 첫번째 알파벳 구분자
                A : 상위 폴더
                B : 폴더
                C : 파일 
                그러므로 함수호출 시 substring(1)  
              -->
              <v-list-item-icon v-if="item.charAt(0) === 'A'">
                <v-icon color='orange'>mdi-arrow-top-left</v-icon>
              </v-list-item-icon>         
              <v-list-item-icon v-else-if="item.charAt(0) === 'B'">
                <v-icon color='orange'>mdi-folder</v-icon>
              </v-list-item-icon>
              <v-list-item-icon v-else>
                <v-icon>mdi-file-document-box-outline</v-icon>
              </v-list-item-icon>      
              <v-list-item-content>
                <v-list-item-title v-text="item.substring(1)"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>  
      <v-container fill-height style="max-width:400px;">
        <v-flex>
          <v-file-input 
            label="File upload" 
            v-model="fileForUpload"
            show-size 
            outlined 
            dense></v-file-input>
          <div class="text-center">
            <v-btn
              outlined fab color="indigo"
              @click="uploadFile"
              >
              <v-icon>mdi-file-upload-outline</v-icon>
            </v-btn>
          </div>
        </v-flex>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import axios from "axios"
import { catchStatus } from "../mixins/catchStatus"
const target = 'http://127.0.0.1:8082/file'

export default {
  data() {
    return {
      // 업로드용 파일 객체
      fileForUpload: null,
      // 현재 directory 파일 리스트(폴더포함)
      fileList: [],
      // 현재 directory 이름
      currentDir: null,
      // 상위 directory 파일 리스트(폴더포함)
      updirContents: []
    }
  },
  computed: {
    // 계산된 getter
    displayCurrent: function () {
      let upPath = ''
      this.updirContents.forEach(a => upPath = upPath + a.name + '/')

      return `${upPath}${this.currentDir}`
    }
  },
  created() {
    this.getFileList('')
  },
  methods: {
    /*
    // $refs로 DOM에 접근하는 방식
    selectFile() {
      this.fileForUpload = this.$refs.fileForUpload.files[0]
    },
    */
    selectFile(type, name) {   
      // 상위폴더 선택시
      if(type === 'A') {        
        let last = this.updirContents.length-1
        this.currentDir = this.updirContents[last].name
        this.fileList = this.updirContents[last].fileList
        this.updirContents.splice(last)

      // 폴더 선택시
      } else if(type === 'B') {
        this.updirContents.push({
          name: this.currentDir,
          fileList: this.fileList
        })
        this.getFileList(name)

      // 파일 선택시
      } else {
        this.downloadFile(name)
      }
    },
    getFileList(dir) {      
      let token = localStorage.getItem('access-token')
      // POST 방식으로 호출하는 이유는 upPath 형식이 /A/B/C/D 이므로 @GetMapping("/A/{B}")으로 호출이 불가능하다 
      let formData = new FormData()
      let upPath = ''
      this.updirContents.forEach(a => upPath = upPath + a.name + '/') 
      formData.append('upPath', `${upPath}/${dir}`);

      axios.post(target + '/list', formData, { 
        headers : {
          'access-token': token
        }
      }).then(res => {
        this.fileList = res.data
        if(dir === '') {
          this.currentDir = ''
        } else {
          this.fileList.unshift('A..')
          this.currentDir = dir 
        }  
      }).catch(err => {
        console.log(err)
        this.catchStatus(err)
      });
    },
    uploadFile() {
      if(this.fileForUpload === null) {
        alert('파일을 선택하세요')
        return
      }
 
      let token = localStorage.getItem('access-token')
      let formData = new FormData()
      let upPath = ''
      let curruntPath = ''
      
      if(this.currentDir !== '') {
        this.updirContents.forEach(a => upPath = upPath + a.name + '/')
        // root 를 ''로 초기화해서 하위 dir로 내려가면 최초 의미없는 '/'가 붙어서 substring 해준다
        curruntPath = `${upPath}${this.currentDir}`.substring(1)
      } 
      formData.append('uploadPath', curruntPath)
      formData.append('file', this.fileForUpload);

      axios.post(target + '/upload', formData, { 
        headers : {
          'Content-Type': 'multipart/form-data',
          'access-token': token
        }
      }).then(res => {
        this.fileForUpload = null
        // 비동기 처리되므로 then 블럭 밖에서 getFileList()하면 upload가 완료되기 전에 수행되므로 최신 dir을 조회하려면 then 블럭안에서 getFileList() 수행
        this.getFileList(this.currentDir)
      }).catch(err => {
        console.log(err)
        this.catchStatus(err)
      });      
    },
    downloadFile(filename) {
      let token = localStorage.getItem('access-token')
      let formData = new FormData()
      let upPath = ''

      // root 를 ''로 초기화해서 하위 dir로 내려가면 최초 의미없는 '/'가 붙어서 substring 해준다
      if(this.currentDir !== '') {
        this.updirContents.forEach(a => upPath = upPath + a.name + '/')
        formData.append('filePath', `${upPath}${this.currentDir}/${filename}`.substring(1))
      } else {
        formData.append('filePath', filename)
      }  

      axios.post(target + '/download', formData, { 
        headers : {
          'access-token': token
        },
        responseType: 'blob'
      }).then(res => {
        // 파일 다운로드
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename); 
        document.body.appendChild(link);
        link.click();
      }).catch(err => {
        console.log(err)
        this.catchStatus(err)
      }).finally(() => {
        // always executed
      });
    }
  },
  mixins: [catchStatus]
}
</script>