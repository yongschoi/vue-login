import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store"

Vue.use(VueRouter);

const rejectAuthUser = (to, from, next) => {
  if(store.state.isLogin === true) {
    // 로그인 된 사용자는 로그인 페이지는 막아야 함.
    alert('이미 로그인 상태입니다.')
    next('/')
  } else {
    next()
  }
}
const onlyAuthUser = (to, from, next) => {
  if(store.state.isLogin === false && localStorage.getItem('access-token') === null) {
    // 로그인 안된 사용자는 My Page는 막아야 함.
    alert('로그인이 필요합니다.')
    next({name: 'login'})
  } else {
    next()
  }
}
const onlyAdminUser = (to, from, next) => {
  if(store.state.isLogin === false && localStorage.getItem('access-token') === null) {
    alert('로그인이 필요합니다.')
    next({name: 'login'})
  } else if(!store.state.isAdmin) {
    // F5를 누르면 브라우저 clear되므로 store.state.isAdmin 체크는 의미가 없다.
    alert('Admin권한이 필요합니다.')
    next('/')
  } else {
    next()
  }
}
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue")
  },
  {
    path: "/login",
    name: "login",
    beforeEnter: rejectAuthUser,
    component: () => import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/logout",
    name: "logout",
    component: () => import(/* webpackChunkName: "logout" */ "../views/Logout.vue")
  },
  {
    path: "/mypage",
    name: "mypage",
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "mypage" */ "../views/Mypage.vue")
  },
  {
    path: "/fexplorer",
    name: "fexplorer",
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "fexplorer" */ "../views/Fexplorer.vue")
  },
  {
    path: "/album",
    name: "album",
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "album" */ "../views/Album.vue")
  },
  {
    path: "/todo",
    name: "todo",
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "todo" */ "../views/Todo.vue")
  },
  {
    path: "/grid",
    name: "grid",
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "grid" */ "../views/Grid.vue")
  },
  {
    path: "/inputform",
    name: "inputform",
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "inputform" */ "../views/InputForm.vue")
  },
  {
    path: "/registrationform",
    name: "registrationform",
    component: () => import(/* webpackChunkName: "registrationform" */ "../views/RegistrationForm.vue")
  },
  {
    path: "/admin",
    name: "admin",
    beforeEnter: onlyAdminUser,
    component: () => import(/* webpackChunkName: "admin" */ "../views/Admin.vue")
  },
  {
    path: "/market",
    name: "market",
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "market" */ "../views/Market.vue")
  },
  {
    path: "/selectproduct",
    name: "selectproduct",
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "selectproduct" */ "../views/Selectproduct.vue")
  },
  {
    path: "/orderstatus",
    name: "orderstatus",
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "orderstatus" */ "../views/Orderstatus.vue")
  },
  {
    path: "/orderprepareadmin",
    name: "orderprepareadmin",
    beforeEnter: onlyAdminUser,
    component: () => import(/* webpackChunkName: "orderprepareadmin" */ "../views/Orderprepareadmin.vue")
  },
  {
    path: "/deliveryadmin",
    name: "deliveryadmin",
    beforeEnter: onlyAdminUser,
    component: () => import(/* webpackChunkName: "deliveryadmin" */ "../views/Deliveryadmin.vue")
  },
  {
    path: "/ordercomplete",
    name: "ordercomplete",
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "ordercomplete" */ "../views/Ordercomplete.vue")
  },
  {
    path: "/orderhistory",
    name: "orderhistory",
    beforeEnter: onlyAuthUser,
    component: () => import(/* webpackChunkName: "orderhistory" */ "../views/Orderhistory.vue")
  },
  {
    path: "/productcontrol",
    name: "productcontrol",
    beforeEnter: onlyAdminUser,
    component: () => import(/* webpackChunkName: "productcontrol" */ "../views/ProductControl.vue")
  },
  {
    path: "/productnewform",
    name: "productnewform",
    beforeEnter: onlyAdminUser,
    component: () => import(/* webpackChunkName: "productnewform" */ "../views/ProductNewForm.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
