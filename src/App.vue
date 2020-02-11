<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item router :to="{name: 'home'}" exact>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-show="!isLogin" router :to="{name: 'login'}" exact>
          <v-list-item-action>
            <v-icon>mdi-login</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isLogin" router :to="{name: 'fexplorer'}" exact>
          <v-list-item-action>
            <v-icon>mdi-file-tree</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>File Explorer</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isLogin" router :to="{name: 'album'}" exact>
          <v-list-item-action>
            <v-icon>mdi-folder-image</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Album</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isLogin" router :to="{name: 'todo'}" exact>
          <v-list-item-action>
            <v-icon>mdi-playlist-check</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Todo List</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isLogin" router :to="{name: 'inputform'}" exact>
          <v-list-item-action>
            <v-icon>mdi-lead-pencil</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Input Form</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isLogin" router :to="{name: 'grid'}" exact>
          <v-list-item-action>
            <v-icon>mdi-view-list</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Data Grid (Bulk)</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isLogin" router :to="{name: 'mypage'}" exact>
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>My Page</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isLogin" router :to="{name: 'market'}" exact>
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Market</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="isLogin" v-show="isAdmin" router :to="{name: 'admin'}" exact>
          <v-list-item-action>
            <v-icon>mdi-shield-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Admin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dark fixed color="indigo">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu offset-y v-if="isLogin">
          <template v-slot:activator="{ on }">
            <v-btn text icon dark v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-list-item router :to="{name: 'mypage'}" exact v-on="on">
                  <v-icon dense>mdi-account</v-icon>
                </v-list-item>
              </template>
              <span>My Page</span>
            </v-tooltip>
            <v-divider />
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-list-item @click="$store.dispatch('logout')" v-on="on">
                  <v-icon dense>mdi-location-exit</v-icon>
                </v-list-item>
              </template>
              <span>Logout</span>
            </v-tooltip>            
          </v-list>
        </v-menu>
        <v-btn text icon dark v-else :to="{name:'login'}">
          <v-icon>mdi-login</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <router-view />
 
    </v-content>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from "vuex"

  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null
    }),
    computed: {
      ...mapState(['isLogin', 'isAdmin'])
    }
  }
</script>
