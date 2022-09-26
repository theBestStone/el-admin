<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.children">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <svg-icon :icon-class="item.icon" :class-name="`card-${item.icon}-icon`" />
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-submenu v-if="subItem.children" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.children" :key="i" :index="threeItem.index">{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                <svg-icon :icon-class="subItem.icon" :class-name="`card-${subItem.icon}-icon`" />
                <span slot="title">{{ subItem.title }}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <svg-icon :icon-class="item.icon" :class-name="`card-${item.icon}-icon`" />
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bus from '../common/bus'
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-lx-home',
          index: 'dashboard',
          title: '系统首页'
        },
        {
          icon: 'el-icon-lx-calendar',
          index: 'sys',
          title: '系统管理',
          children: [
            {
              index: 'userManage',
              title: '用户管理'
            },

            {
              index: 'roleManage',
              title: '角色管理'
            },
            {
              index: 'menuManage',
              title: '菜单管理'
            },
            {
              index: 'enterManage',
              title: '企业管理'
            },
            {
              index: 'deptManage',
              title: '部门管理'
            }
          ]
        },
        {
          icon: 'el-icon-lx-calendar',
          index: '1',
          title: '客资管理',
          children: [
            {
              index: 'enterprise',
              title: '企业客户'
            },
            {
              index: 'contacts',
              title: '联系人'
            },
            {
              index: 'todolist',
              title: '待办管理'
            }
          ]
        },
        {
          icon: 'el-icon-lx-calendar',
          index: '2',
          title: '配置管理',
          children: [
            {
              index: 'config',
              title: '公共设置'
            },
            {
              index: 'notice',
              title: '公告设置'
            },
            {
              index: 'download',
              title: '下载管理'
            },
            {
              index: 'problem',
              title: '常见问题'
            }
          ]
        },
        {
          icon: 'el-icon-lx-calendar',
          index: '3',
          title: '运维管理',
          children: [
            {
              index: 'data',
              title: '数据管理'
            },
            {
              index: 'resources',
              title: '资源管理'
            }
          ]
        },
        {
          icon: 'el-icon-lx-calendar',
          index: '4',
          title: '运营管理',
          children: [
            {
              index: 'userStatistics',
              title: '运营管理'
            }
          ]
        },
        {
          icon: 'el-icon-lx-calendar',
          index: '5',
          title: '能力开放平台管理',
          children: [
            {
              index: 'application',
              title: '应用管理'
            },
            {
              index: 'applicationApp',
              title: '应用管理审批'
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState(['user']),
    onRoutes() {
      return this.$route.path.replace('', '')
    }
  },
  created() {
    this.items = JSON.parse(JSON.stringify(this.user.user.menuList))
    this.items.unshift({
      icon: 'app',
      id: 1,
      menuName: '系统首页',
      menuUrl: '/dashboard'
    })
    this.filterMenu(this.items)

    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
      bus.$emit('collapse-content', msg)
    })
  },
  methods: {
    filterMenu(menuData) {
      menuData.forEach((item, index) => {
        let tempobj = {
          icon: item.icon,
          index: item.menuUrl || item.icon,
          title: item.menuName,
          children: item.childList
        }
        menuData[index] = tempobj
        if (item.childList && item.childList.length) {
          this.filterMenu(item.childList)
        } else {
          tempobj.children = null
        }
      })
    }
  }
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
.sidebar .svg-icon {
  margin-right: 6px;
}
</style>
