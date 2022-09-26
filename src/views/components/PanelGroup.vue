<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis', 1)" :class="{ active: activeNum == 1 }">
        <div class="card-panel-icon-wrapper icon-person">
          <svg-icon icon-class="person" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            用户注册量
          </div>
          <count-to :start-val="0" :end-val="totalData.userTotal" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages', 2)" :class="{ active: activeNum == 2 }">
        <div class="card-panel-icon-wrapper icon-cert">
          <svg-icon icon-class="cert" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            证书申请量
          </div>
          <count-to :start-val="0" :end-val="totalData.certTotal" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases', 3)" :class="{ active: activeNum == 3 }">
        <div class="card-panel-icon-wrapper icon-business">
          <svg-icon icon-class="business" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            企业注册量
          </div>
          <count-to :start-val="0" :end-val="totalData.enterTotal" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings', 4)" :class="{ active: activeNum == 4 }">
        <div class="card-panel-icon-wrapper icon-contract">
          <svg-icon icon-class="contract" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            合同签署量
          </div>
          <count-to :start-val="0" :end-val="totalData.contTotal" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    active: {
      type: String,
      default: '1'
    },
    totalData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeNum: '1'
    }
  },
  created() {
    this.activeNum = this.active
  },
  methods: {
    handleSetLineChartData(type, num) {
      this.activeNum = num
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-person {
        background: #40c9c6;
      }

      .icon-cert {
        background: #36a3f7;
      }

      .icon-business {
        background: #f4516c;
      }

      .icon-contract {
        background: #34bfa3;
      }
    }

    .icon-person {
      color: #40c9c6;
    }

    .icon-cert {
      color: #36a3f7;
    }

    .icon-business {
      color: #f4516c;
    }

    .icon-contract {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
.active {
  box-shadow: 0px 0px 20px rgba(67, 162, 240, 0.76) !important;
}
</style>
