<template>
  <el-container style="height:100%">
    <el-header style="text-align: right;">
      <div class="side-logo"></div>
      <a href="https://afdian.net/@aliceliveman" class="patron" target="_black">
        <img src="./assets/mea.png" class="mea" width="60" height="60">
        <span>
          你好，
          <br>我很可爱！
        </span>
      </a>
      <a href="https://vtuber.magictea.cc/" class="patron" target="_black">
        <img src="./assets/magictea.png" height="54">
      </a>
      <!-- <a href="https://www.vultr.com/?ref=7654882" class="patron" target="_black" ><img src="./assets/vultr.png" height="54"></a> -->
      <el-progress v-for="(value, key) in account.billTimeMap" :key="key" type="circle" :width="54" :percentage="(60 - (account.timestamp - value) / (60 * 1000)) / 60 * 100" status="text">
        <span>
          {{account.serverPoints[key]}}AP<br/>
          00:{{(Array(2).join(0) + parseInt(60 - (account.timestamp - value) / (60 * 1000))).slice(-2)}}
        </span>
      </el-progress>
      <span>{{account.nickname}}</span>
      <span>
        &nbsp;AP:{{account.point}}
        <a
          href="javascript:"
          @click="charge"
          style="color:#409EFF"
          class="el-icon-circle-plus"
        ></a>&nbsp;
        <a href="javascript:" @click="billList">账单</a>
      </span>
      &nbsp;&nbsp;
      <a href="javascript:" title="登出" @click="logout" style="color:#333;" v-loading.fullscreen.lock="logoutLoading" element-loading-text="さようなら~">
        <svg class="svg-icon" viewBox="0 0 512 512" version="1.1" width="16" height="16" aria-hidden="true">
          <path
            fill="currentColor"
            d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"
          ></path>
        </svg>
      </a>
    </el-header>
    <el-dialog title="账单" :visible.sync="billListVisible">
      <PagedTable :tableData="tableData" :tableHeader="tableHeader" :loading="loading"></PagedTable>
    </el-dialog>
    <el-container style="background:#333;height: 100%;">
      <el-aside width="200px">
        <el-menu
          router
          :default-active="$route.path"
          background-color="#333"
          text-color="rgba(255, 255, 255, 0.65)"
          active-text-color="#fff"
        >
          <el-menu-item index="/main/broadcast">
            <svg class="svg-icon" aria-hidden="true" viewBox="0 0 640 512" version="1.1" width="16" height="16">
              <path
                fill="currentColor"
                d="M150.94 192h33.73c11.01 0 18.61-10.83 14.86-21.18-4.93-13.58-7.55-27.98-7.55-42.82s2.62-29.24 7.55-42.82C203.29 74.83 195.68 64 184.67 64h-33.73c-7.01 0-13.46 4.49-15.41 11.23C130.64 92.21 128 109.88 128 128c0 18.12 2.64 35.79 7.54 52.76 1.94 6.74 8.39 11.24 15.4 11.24zM89.92 23.34C95.56 12.72 87.97 0 75.96 0H40.63c-6.27 0-12.14 3.59-14.74 9.31C9.4 45.54 0 85.65 0 128c0 24.75 3.12 68.33 26.69 118.86 2.62 5.63 8.42 9.14 14.61 9.14h34.84c12.02 0 19.61-12.74 13.95-23.37-49.78-93.32-16.71-178.15-.17-209.29zM614.06 9.29C611.46 3.58 605.6 0 599.33 0h-35.42c-11.98 0-19.66 12.66-14.02 23.25 18.27 34.29 48.42 119.42.28 209.23-5.72 10.68 1.8 23.52 13.91 23.52h35.23c6.27 0 12.13-3.58 14.73-9.29C630.57 210.48 640 170.36 640 128s-9.42-82.48-25.94-118.71zM489.06 64h-33.73c-11.01 0-18.61 10.83-14.86 21.18 4.93 13.58 7.55 27.98 7.55 42.82s-2.62 29.24-7.55 42.82c-3.76 10.35 3.85 21.18 14.86 21.18h33.73c7.02 0 13.46-4.49 15.41-11.24 4.9-16.97 7.53-34.64 7.53-52.76 0-18.12-2.64-35.79-7.54-52.76-1.94-6.75-8.39-11.24-15.4-11.24zm-116.3 100.12c7.05-10.29 11.2-22.71 11.2-36.12 0-35.35-28.63-64-63.96-64-35.32 0-63.96 28.65-63.96 64 0 13.41 4.15 25.83 11.2 36.12l-130.5 313.41c-3.4 8.15.46 17.52 8.61 20.92l29.51 12.31c8.15 3.4 17.52-.46 20.91-8.61L244.96 384h150.07l49.2 118.15c3.4 8.16 12.76 12.01 20.91 8.61l29.51-12.31c8.15-3.4 12-12.77 8.61-20.92l-130.5-313.41zM271.62 320L320 203.81 368.38 320h-96.76z"
              ></path>
            </svg>
            <span>推流任务</span>
          </el-menu-item>
          <el-menu-item index="/main/channel">
            <svg class="svg-icon" aria-hidden="true" viewBox="0 0 576 512" version="1.1" width="16" height="16">
              <path
                fill="currentColor"
                d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
              ></path>
            </svg>
            <span>频道管理</span>
          </el-menu-item>
          <el-menu-item index="/main/account">
            <svg class="svg-icon" aria-hidden="true" viewBox="0 0 576 512" version="1.1" width="16" height="16">
              <path
                fill="currentColor"
                d="M528 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 400H48V80h480v352zM208 256c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm-89.6 128h179.2c12.4 0 22.4-8.6 22.4-19.2v-19.2c0-31.8-30.1-57.6-67.2-57.6-10.8 0-18.7 8-44.8 8-26.9 0-33.4-8-44.8-8-37.1 0-67.2 25.8-67.2 57.6v19.2c0 10.6 10 19.2 22.4 19.2zM360 320h112c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H360c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8zm0-64h112c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H360c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8zm0-64h112c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H360c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8z"
              ></path>
            </svg>
            <span>账号管理</span>
          </el-menu-item>
          <el-menu-item v-if="account.admin" index="/main/system">
            <svg class="svg-icon" aria-hidden="true" viewBox="0 0 640 512" version="1.1" width="16" height="16">
              <path
                fill="currentColor"
                d="M512.1 191l-8.2 14.3c-3 5.3-9.4 7.5-15.1 5.4-11.8-4.4-22.6-10.7-32.1-18.6-4.6-3.8-5.8-10.5-2.8-15.7l8.2-14.3c-6.9-8-12.3-17.3-15.9-27.4h-16.5c-6 0-11.2-4.3-12.2-10.3-2-12-2.1-24.6 0-37.1 1-6 6.2-10.4 12.2-10.4h16.5c3.6-10.1 9-19.4 15.9-27.4l-8.2-14.3c-3-5.2-1.9-11.9 2.8-15.7 9.5-7.9 20.4-14.2 32.1-18.6 5.7-2.1 12.1.1 15.1 5.4l8.2 14.3c10.5-1.9 21.2-1.9 31.7 0L552 6.3c3-5.3 9.4-7.5 15.1-5.4 11.8 4.4 22.6 10.7 32.1 18.6 4.6 3.8 5.8 10.5 2.8 15.7l-8.2 14.3c6.9 8 12.3 17.3 15.9 27.4h16.5c6 0 11.2 4.3 12.2 10.3 2 12 2.1 24.6 0 37.1-1 6-6.2 10.4-12.2 10.4h-16.5c-3.6 10.1-9 19.4-15.9 27.4l8.2 14.3c3 5.2 1.9 11.9-2.8 15.7-9.5 7.9-20.4 14.2-32.1 18.6-5.7 2.1-12.1-.1-15.1-5.4l-8.2-14.3c-10.4 1.9-21.2 1.9-31.7 0zm-10.5-58.8c38.5 29.6 82.4-14.3 52.8-52.8-38.5-29.7-82.4 14.3-52.8 52.8zM386.3 286.1l33.7 16.8c10.1 5.8 14.5 18.1 10.5 29.1-8.9 24.2-26.4 46.4-42.6 65.8-7.4 8.9-20.2 11.1-30.3 5.3l-29.1-16.8c-16 13.7-34.6 24.6-54.9 31.7v33.6c0 11.6-8.3 21.6-19.7 23.6-24.6 4.2-50.4 4.4-75.9 0-11.5-2-20-11.9-20-23.6V418c-20.3-7.2-38.9-18-54.9-31.7L74 403c-10 5.8-22.9 3.6-30.3-5.3-16.2-19.4-33.3-41.6-42.2-65.7-4-10.9.4-23.2 10.5-29.1l33.3-16.8c-3.9-20.9-3.9-42.4 0-63.4L12 205.8c-10.1-5.8-14.6-18.1-10.5-29 8.9-24.2 26-46.4 42.2-65.8 7.4-8.9 20.2-11.1 30.3-5.3l29.1 16.8c16-13.7 34.6-24.6 54.9-31.7V57.1c0-11.5 8.2-21.5 19.6-23.5 24.6-4.2 50.5-4.4 76-.1 11.5 2 20 11.9 20 23.6v33.6c20.3 7.2 38.9 18 54.9 31.7l29.1-16.8c10-5.8 22.9-3.6 30.3 5.3 16.2 19.4 33.2 41.6 42.1 65.8 4 10.9.1 23.2-10 29.1l-33.7 16.8c3.9 21 3.9 42.5 0 63.5zm-117.6 21.1c59.2-77-28.7-164.9-105.7-105.7-59.2 77 28.7 164.9 105.7 105.7zm243.4 182.7l-8.2 14.3c-3 5.3-9.4 7.5-15.1 5.4-11.8-4.4-22.6-10.7-32.1-18.6-4.6-3.8-5.8-10.5-2.8-15.7l8.2-14.3c-6.9-8-12.3-17.3-15.9-27.4h-16.5c-6 0-11.2-4.3-12.2-10.3-2-12-2.1-24.6 0-37.1 1-6 6.2-10.4 12.2-10.4h16.5c3.6-10.1 9-19.4 15.9-27.4l-8.2-14.3c-3-5.2-1.9-11.9 2.8-15.7 9.5-7.9 20.4-14.2 32.1-18.6 5.7-2.1 12.1.1 15.1 5.4l8.2 14.3c10.5-1.9 21.2-1.9 31.7 0l8.2-14.3c3-5.3 9.4-7.5 15.1-5.4 11.8 4.4 22.6 10.7 32.1 18.6 4.6 3.8 5.8 10.5 2.8 15.7l-8.2 14.3c6.9 8 12.3 17.3 15.9 27.4h16.5c6 0 11.2 4.3 12.2 10.3 2 12 2.1 24.6 0 37.1-1 6-6.2 10.4-12.2 10.4h-16.5c-3.6 10.1-9 19.4-15.9 27.4l8.2 14.3c3 5.2 1.9 11.9-2.8 15.7-9.5 7.9-20.4 14.2-32.1 18.6-5.7 2.1-12.1-.1-15.1-5.4l-8.2-14.3c-10.4 1.9-21.2 1.9-31.7 0zM501.6 431c38.5 29.6 82.4-14.3 52.8-52.8-38.5-29.6-82.4 14.3-52.8 52.8z"
              ></path>
            </svg>
            <span>系统设置</span>
          </el-menu-item>
          <el-menu-item v-if="account.admin" index="/main/server">
            <svg class="svg-icon" aria-hidden="true" viewBox="0 0 512 512" version="1.1" width="16" height="16">
              <path
                fill="currentColor"
                d="M480 160H32c-17.673 0-32-14.327-32-32V64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm112 248H32c-17.673 0-32-14.327-32-32v-64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm112 248H32c-17.673 0-32-14.327-32-32v-64c0-17.673 14.327-32 32-32h448c17.673 0 32 14.327 32 32v64c0 17.673-14.327 32-32 32zm-48-88c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24zm-64 0c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24z"
              ></path>
            </svg>
            <span>转播服务器管理</span>
          </el-menu-item>
          <el-menu-item v-if="account.admin" index="/main/externalApp">
            <svg class="svg-icon" aria-hidden="true" viewBox="0 0 512 512" version="1.1" width="16" height="16">
              <path
                fill="currentColor"
                d="M512 176.001C512 273.203 433.202 352 336 352c-11.22 0-22.19-1.062-32.827-3.069l-24.012 27.014A23.999 23.999 0 0 1 261.223 384H224v40c0 13.255-10.745 24-24 24h-40v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-78.059c0-6.365 2.529-12.47 7.029-16.971l161.802-161.802C163.108 213.814 160 195.271 160 176 160 78.798 238.797.001 335.999 0 433.488-.001 512 78.511 512 176.001zM336 128c0 26.51 21.49 48 48 48s48-21.49 48-48-21.49-48-48-48-48 21.49-48 48z"
              ></path>
            </svg>
            <span>外部服务授权管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container direction="vertical">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            <a :href="$route.path">{{$route.name}}</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <el-main>
          <div style="min-height:74vh;background-color:#fff;margin:25px 25px 0;padding:30px">
            <router-view></router-view>
          </div>
          <el-footer height="50px">
            <a target="_black" href="https://github.com/nekoteaparty/Alice-LiveMan">
              <span>Fork on</span>
              <img
                width="18"
                height="18"
                title
                alt
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFMTZCRDY3REIzRjAxMUUyQUQzREIxQzRENUFFNUM5NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFMTZCRDY3RUIzRjAxMUUyQUQzREIxQzRENUFFNUM5NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkUxNkJENjdCQjNGMDExRTJBRDNEQjFDNEQ1QUU1Qzk2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkUxNkJENjdDQjNGMDExRTJBRDNEQjFDNEQ1QUU1Qzk2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+SM9MCAAAA+5JREFUeNrEV11Ik1EY3s4+ddOp29Q5b0opCgKFsoKoi5Kg6CIhuwi6zLJLoYLopq4qsKKgi4i6CYIoU/q5iDAKs6syoS76IRWtyJ+p7cdt7sf1PGOD+e0c3dygAx/67ZzzPM95/877GYdHRg3ZjMXFxepQKNS6sLCwJxqNNuFpiMfjVs4ZjUa/pmmjeD6VlJS8NpvNT4QQ7mxwjSsJiEQim/1+/9lgMHgIr5ohuxG1WCw9Vqv1clFR0dCqBODElV6v90ogEDjGdYbVjXhpaendioqK07CIR7ZAqE49PT09BPL2PMgTByQGsYiZlQD4uMXtdr+JxWINhgINYhGT2MsKgMrm2dnZXgRXhaHAg5jEJodUAHxux4LudHJE9RdEdA+i3Juz7bGHe4mhE9FNrgwBCLirMFV9Okh5eflFh8PR5nK5nDabrR2BNJlKO0T35+Li4n4+/J+/JQCxhmu5h3uJoXNHPbmWZAHMshWB8l5/ipqammaAf0zPDDx1ONV3vurdidqwAQL+pEc8sLcAe1CCvQ3YHxIW8Pl85xSWNC1hADDIv0rIE/o4J0k3kww4xSlwIhcq3EFFOm7KN/hUGOQkt0CFa5WpNJlMvxBEz/IVQAxg/ZRZl9wiHA63yDYieM7DnLP5CiAGsC7I5sgtYKJGWe2A8seFqgFJrJjEPY1Cn3pJ8/9W1e5VWsFDTEmFrBcoDhZJEQkXuhICMyKpjhahqN21hRYATKfUOlDmkygrR4o4C0VOLGJKrOITKB4jijzdXygBKixyC5TDQdnk/Pz8qRw6oOWGlsTKGOQW6OH6FBWsyePxdOXLTgxiyebILZCjz+GLgMIKnXNzc49YMlcRdHXcSwxFVgTInQhC9G33UhNoJLuqq6t345p9y3eUy8OTk5PjAHuI9uo4b07FBaOhsu0A4Unc+T1TU1Nj3KsSSE5yJ65jqF2DDd8QqWYmAZrIM2VlZTdnZmb6AbpdV9V6ec9znf5Q7HjYumdRE0JOp3MjitO4SFa+cZz8Umqe3TCbSLvdfkR/kWDdNQl5InuTcysOcpFT35ZrbBxx4p3JAHlZVVW1D/634VRt+FvLBgK/v5LV9WS+10xMTEwtRw7XvqOL+e2Q8V3AYIOIAXQ26/heWVnZCVfcyKHg2CBgTpmPmjYM8l24GyaUHyaIh7XwfR9ErE8qHoDfn2LTNAVC0HX6MFcBIP8Bi+6F6cdW/DICkANRfx99fEYFQ7Nph5i/uQiA214gno7K+guhaiKg9gC62+M8eR7XsBsYJ4ilam60Fb7r7uAj8wFyuwM1oIOWgfmDy6RXEEQzJMPe23DXrVS7rtyD3Df8z/FPgAEAzWU5Ku59ZAUAAAAASUVORK5CYII="
              >
            </a>
            <div
              style="position: absolute; top: 17px; right: 26px;"
            >Alice Website © 2018 - 2019 nekoteaparty</div>
          </el-footer>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<style>
.el-header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  position: relative;
  z-index: 1000;
  padding-left: 0px;
}

.side-logo {
  float: left;
  width: 200px;
  height: 100%;
  background-color: #545c64;
  background-image: url("./assets/logo-mini.png");
  background-repeat: no-repeat;
}

.patron {
  margin-left: 12px;
  float: left;
}

.patron:hover .mea {
  animation: rotating 0.5s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.patron * {
  display: inline-block;
  vertical-align: middle;
  line-height: 1.5;
  text-align: left;
  letter-spacing: 1px;
  color: #787878;
}

.el-aside {
  color: #333;
  height: 100%;
  padding: 10px 0;
  background: url(./assets/alice.png) no-repeat center bottom;
}

.el-menu {
  border: none;
  background-color: transparent !important;
}

.el-menu-item {
  height: 40px;
  line-height: 40px;
  margin: 13px 0;
  background-color: transparent !important;
}

.el-menu-item:hover {
  background-color: rgb(31, 31, 31, 0.7) !important;
}

.el-menu-item.is-active {
  background-color: #44a2ffee !important;
}

.el-breadcrumb {
  border-top: 1px #ccc solid;
  background: #fff;
  padding: 16px;
}

.el-main {
  background-color: #f4f4f5;
  box-shadow: 3px 3px 5px #e0e0e0 inset;
  padding: 0;
}

.el-footer {
  text-align: center;
  background-color: transparent;
  padding: 15px 25px;
  color: #c3c3c3;
  position: relative;
}

.el-footer * {
  vertical-align: middle;
}

.el-footer a {
  color: #c3c3c3;
}

svg.svg-icon {
  vertical-align: text-bottom;
  margin-left: 5px;
  margin-right: 5px;
}

.el-progress {
  vertical-align: middle;
  margin: 0 5px;
}
</style>

<script>
import PagedTable from "./PagedTable.vue";
export default {
  data() {
    return {
      account: JSON.parse(sessionStorage.getItem("account")),
      tableData: [],
      tableHeader: [
        { prop: "recordDate", label: "记录时间", width: "250px" },
        { prop: "pointChange", label: "AP点数变动", width: "150px" },
        { prop: "remark", label: "描述" }
      ],
      billListVisible: false,
      loading: false,
      logoutLoading: false,
      breadcrumb: "",
      cards: ""
    };
  },
  methods: {
    logout() {
      this.logoutLoading = true
      this.$http.get("/api/login/logout.json").then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            sessionStorage.clear();
            window.clearInterval(interval);
            this.$router.push({ path: "/login" });
          } else {
            this.$message.error(response.data.message);
          }
        },
        function(response) {
          this.$message.error("请求失败");
        }
      );
    },
    charge() {
      this.$prompt(
        <div>
          请将卡号直接复制到输入框中，多个卡号请换行分隔
          <a
            style="position:absolute;bottom:-28px;left:15px;"
            target="_blank"
            href="/api/system/apShop"
          >
            点击此处购买卡密
          </a>
        </div>,
        "AP点数充值",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputType: "textarea"
        }
      ).then(({ value }) => {
        let formData = new FormData();
        formData.append("cards", value);
        this.$http.post("/api/account/useCard.json", formData).then(
          function(response) {
            // 这里是处理正确的回调
            if (response.data.code === 0) {
              this.$confirm(
                "你已成功充值" + response.data.data + "点AP！",
                "提示",
                {
                  showCancelButton: false,
                  type: "success"
                }
              );
            } else {
              this.$confirm(response.data.message, "操作失败", {
                showCancelButton: false,
                type: "error"
              });
            }
          },
          function(response) {
            this.$message.error("请求失败");
          }
        );
      });
    },
    billList() {
      this.loading = true;
      this.billListVisible = true;
      this.$http.get("/api/account/billList.json").then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            this.tableData = [];
            this.tableData = response.data.data;
          } else {
            this.$message.error(response.data.message);
          }
          this.loading = false;
        },
        function(response) {
          if (response.status === 401) {
            this.$router.push({ path: "/login" });
          }
          this.$message.error("请求失败");
          this.loading = false;
        }
      );
    }
  },
  components: { PagedTable },
  created() {
    window.clearInterval(window.interval);
    let $ = this;
    let isShowingErrorTip = false;
    window.interval = setInterval(function() {
      $.$http.get("/api/account/info.json").then(
        function(response) {
          // 这里是处理正确的回调
          if (response.data.code === 0) {
            sessionStorage.setItem(
              "account",
              JSON.stringify(response.data.data)
            );
            this.account = response.data.data;
            if(this.account.broadcastError) {
              let showErrorTip = false;
              let lastError = localStorage.getItem("lastError");
              if(lastError != null) {
                try {
                  lastError = JSON.parse(lastError);
                } catch(e) {
                  lastError = {};
                }
                if(!lastError.isRead || lastError.errTime != this.account.broadcastError.errTime) {
                  showErrorTip = true;
                }
              } else {
                showErrorTip = true;
              }
              if(showErrorTip && !isShowingErrorTip) {
                lastError = this.account.broadcastError;
                localStorage.setItem("lastError", JSON.stringify(lastError));
                isShowingErrorTip = true;
                this.$alert(
                  <div>
                    您的转播任务因为以下原因，已于{lastError.errTime}(GMT+8)停止:
                    <br/>
                    {lastError.errMsg.substring(0, 200)}
                  </div>, 
                  "系统通知", 
                  {
                    showClose: false,
                    showCancelButton: false,
                    type: "info"
                  }
                ).then(() => {
                  isShowingErrorTip = false;
                  lastError.isRead = true;
                  localStorage.setItem("lastError", JSON.stringify(lastError));
                });
              }
            }
          } else {
            this.$message.error(response.data.message);
          }
        },
        function(response) {
          if (response.status === 401) {
            this.$router.push({ path: "/login" });
            this.$confirm("您的登录已失效，请重新登录！", "提示", {
              showCancelButton: false,
              type: "info"
            });
            window.clearInterval(interval);
          }
        }
      );
    }, 2000);
  }
};
</script>
