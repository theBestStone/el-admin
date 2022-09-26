<template>
  <div>
    <el-card>
      <div class="welcomeWrapper">
        <div>
          <img src="@/assets/img/u34.png" style="width: 130px;" alt="u34" />
        </div>
        <div>
          <p><span>用户姓名：</span> {{ userinfo.sysUserName }}</p>
          <p><span>账户：</span> {{ userinfo.sysAccount }}</p>
          <p><span>个人邀请码：</span> <el-tag>{{ userinfo.inviteCode }}</el-tag></p>
        </div>
        <div>
          <p><span>所属企业：</span> {{ userinfo.sysEntName }}</p>
          <p><span>所属部门：</span> {{ userinfo.sysOrgName }}</p>
          <p>
            <span>用户角色：</span>
            <el-select v-model="value" placeholder="请选择" @change="valueChange">
              <el-option v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
            </el-select>
          </p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import crudRoles from '@/api/system/role'
export default {
  data() {
    return {
      userinfo: {},
      options: [],
      value: ''
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.userinfo = this.user.user
    this.options = this.userinfo.roleList
    this.value = this.userinfo.defaultRoleId
  },
  methods: {
    valueChange(val) {
      crudRoles.chooseRole({ roleId: val + '' }).then(res => {
        location.reload()
      })
    }
  }
}
</script>

<style scoped>
.welcomeWrapper {
  display: flex;
  justify-content: space-between;
  padding: 20px 20px;
  box-sizing: border-box;
}
.welcomeWrapper > div {
  width: 33.3333%;
}
.welcomeWrapper > div p {
  margin-bottom: 20px;
}
.welcomeWrapper > div:nth-child(1) {
  text-align: right;
  padding-right: 150px;
  box-sizing: border-box;
}
.welcomeWrapper > div:not(:nth-child(1)) {
  margin-top: 18px;
}
.welcomeWrapper > div:not(:nth-child(1)) span:not(.el-tag) {
  color: #aaa;
}
</style>
