<template>
  <v-container fluid>
    <div>       
      <h2><font color="darkgray">{{ displayCurrent }}</font></h2>
    </div>
      <v-container class="d-inline-block mx-auto">
        <v-row >
          <v-col cols="auto"
            v-for="item in fileList"
            :key="item">
            <v-card
              v-if="item.charAt(0)!=='C'"
              :img="require('../assets/folder.jpg')"
              height="70"
              width="140"
              @click="selectFolder(item.charAt(0), item.substring(1))"
            >
              <v-card-title 
                v-text="item.substring(1)">
              </v-card-title>
            </v-card>
            <v-img
              v-if="item.charAt(0)==='C'"
              height="200"
              width="300"
              lazy-src="require('../assets/loading.gif')"
              :src="displayImage(item.substring(1))"
            ></v-img>
          </v-col>
        </v-row>
      </v-container>
      <v-container style="max-width:300px;">
        <v-file-input
          v-model="fileForUpload"
          accept="image/png, image/jpeg, image/bmp"
          placeholder="Upload your picture"
          prepend-icon="mdi-file-find-outline"
          dense
        ></v-file-input>
        <div class="text-center">
          <v-icon large @click="uploadFile">mdi-cloud-upload</v-icon>
        </div>
      </v-container>
  </v-container>
</template>

<script>
import axios from "axios"
import { catchStatus } from "../mixins/catchStatus"
const target = 'http://127.0.0.1:8082/album'

export default {
  name: "AlbumExplorer",
  data() {
    return {
      // 현재 directory 이름
      currentDir: '',
      // 현재 directory 파일 리스트(폴더포함)
      fileList: [],
      // 상위 directory 파일 리스트(폴더포함)
      updirContents: [],
      // 업로드용 파일 객체
      fileForUpload: null
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
        if(dir !== '') {
          // 배열 제일 앞에 상위(..) 디렉토리 추가
          this.fileList.unshift('A..')
          this.currentDir = dir
        } 
      }).catch(err => {
        console.log(err);
        this.catchStatus(err)
      });
    },
    selectFolder(type, dir) {
      // 상위폴더 선택시
      if(type === 'A') {        
        let last = this.updirContents.length-1
        this.currentDir = this.updirContents[last].name
        this.fileList = this.updirContents[last].fileList
        this.updirContents.splice(last)
      // 폴더 선택시
      } else if(type === 'B'){
        this.updirContents.push({
          name: this.currentDir,
          fileList: this.fileList
        })
        // getFileList가 비동기 처리되므로 현재 list를 clear해줘야 함.
        // 그렇지 않으면 displayImage가 getFileList보다 먼저 처리될 수 있음
        this.fileList = ''
        this.getFileList(dir)      
      }
    },
    // 약간 꼼수 방식으로 lazy-src에 의해서 displayImage를 실행시킴
    // 정수는 폴더를 선택할때마다 해당 폴더의 image들을 가져와서 display하는 것이 맞음.
    displayImage(image) {
      let upPath = ''
      let filePath = ''

      this.updirContents.forEach(a => upPath = upPath + a.name + '/')
      if(this.currentDir !== '') {        
        filePath = `${upPath}${this.currentDir}/${image}`.substring(1)
      } else {
        filePath = image
      }

      /*
      // 1. (Asynch 호출) token 인증이 필요하여 axios로 이미지 display (가능한가 ??)
      await axios.get(`${target}/display?name=${filePath}`, {
        responseType: 'arraybuffer',
        headers: {
          'access-token': token
        }
      }).then(res => {
        let b64encoded = btoa([].reduce.call(new Uint8Array(res.data), 
          function(p,c) {
            return p + String.fromCharCode(c)
          }, ''))
        let mimetype="image/jpeg"
        this.tempImg[index] = `data:${mimetype};base64,${b64encoded}`    
      })
      */
      // 2. (Synch 호출) token 인증 필요없이, 특정 경로에 있는 image를 byte[]로 display (단, token이 노출되므로 https 통신을 할 필요가 있음)
      let token = localStorage.getItem('access-token')
      return `${target}/displayImg?name=${filePath}&access-token=${token}`
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
      
      this.updirContents.forEach(a => upPath = upPath + a.name + '/')
      if(this.currentDir !== '') {       
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
        console.log(err);
        this.catchStatus(err)
      });      
    }
  },
  mixins: [catchStatus]
}
</script>