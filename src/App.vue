<template>
  <div id="app">
    <div class="layout">
      <div class="wrap" v-loading="loading" element-loading-text="越着急越慢越容易出错，等会就好~">
        <div class="toolbox">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            align="right"
            placeholder="选择日期范围"
            editable="false"
            clearable="false"
            @change="loadData"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-switch
            v-model="switchEmpty"
            on-text="过滤"
            off-text="不用"
            @change="filterEmpty"
            style="margin-left:15px;">
          </el-switch>
          <el-switch
            v-model="switchDetail"
            on-text="详情"
            off-text="基本"
            style="margin-left:15px;">
          </el-switch>
          <el-button type="info" style="float:right;" @click="exportData" :loading="exportLoading">导出</el-button>
        </div>
        <el-table
          :data="dataList"
          stripe
          style="width: 100%">
          <el-table-column
            prop="plan"
            label="所在计划">
          </el-table-column>
          <el-table-column
            prop="ad"
            label="广告">
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            v-if="switchDetail">
          </el-table-column>
          <el-table-column
            prop="images"
            label="图片"
            width="450"
            v-if="switchDetail">
            <template scope="scope">
              <div class="image-list">
                <img :src="img" v-for="img in scope.row.images"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            prop="date"
            label="日期">
          </el-table-column>
          <el-table-column
            sortable
            prop="showCount"
            label="曝光量">
          </el-table-column>
          <el-table-column
            sortable
            prop="clickCount"
            label="点击量">
          </el-table-column>
          <el-table-column
            sortable
            prop="clickRate"
            label="点击率（%）">
          </el-table-column>
          <el-table-column
            sortable
            prop="clickPrice"
            label="点击均价（￥）">
          </el-table-column>
          <el-table-column
            sortable
            prop="spent"
            label="花费（￥）">
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :current-page="currentPage"
          @current-change="page">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Api from './lib/api'
  import './lib/lib'
  export default {
    name: 'app',
    data(){
      return {
        currentPage: 1,
        pageSize: 20,
        total: 0,
        switchEmpty: true,
        exportLoading: false,
        switchDetail: false,
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              let yestoday = start.getTime() - 3600 * 1000 * 24 * 1
              start.setTime(yestoday);
              end.setTime(yestoday);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        dateRange: "",
        allData: [],
        filterData: [],
        dataList: [],
        loading: false
      }
    },
    methods: {
      /**
       * @return {undefined}
       */
      exportData: function () {
        let data = this;
        let config = this;
        /** @type {boolean} */
        config.exportLoading = true;
        let self = (config.switchEmpty ? config.filterData : config.allData).clone();
        if (!config.switchDetail) {
          self.forEach(function (vm) {
            delete vm.images;
            delete vm.title;
          });
        }
        config.$http.post(Api.exportData, self).then(function (error) {
          if (config.exportLoading = false, 0 == error.code) {
            let c = error.data;
            data.$message({
              message: error.msg,
              type: "success"
            });
            location.href = c;
          } else {
            data.$message.error(error.msg);
          }
        });
      },
      /**
       * @param {number} page
       * @return {undefined}
       */
      page: function (page) {
        let vm = this;
        /** @type {number} */
        vm.currentPage = page;
        /** @type {number} */
        let CLICK = (page - 1) * vm.pageSize;
        /** @type {number} */
        let spaceIdx = CLICK + vm.pageSize - 1;
        if (vm.switchEmpty) {
          vm.dataList = vm.filterData.slice(CLICK, spaceIdx);
          vm.total = vm.filterData.length;
        } else {
          vm.dataList = vm.allData.slice(CLICK, spaceIdx);
          vm.total = vm.allData.length;
        }
      },
      /**
       * @param {boolean} value
       * @return {undefined}
       */
      filterEmpty: function (value) {
        /** @type {boolean} */
        this.switchEmpty = value;
        this.page(1);
      },
      /**
       * @return {undefined}
       */
      loadData: function () {
        let vm = this;
        /** @type {boolean} */
        vm.loading = true;
        /** @type {Array} */
        let filterData = []
        let allData = []
        /** @type {Array} */
        let startDate = vm.dateRange[0].format("yyyy-MM-dd");
        let endDate = vm.dateRange[1].format("yyyy-MM-dd");
        vm.$http.get(Api.planList, {
          params: {
            param: '{"status":"0","page":1,"size":1000,"pageIndex":1,"pageSize":1000}'
          }
        }).then(function (res) {
          let value = res.object;
          if (1 == res.code) {
            let data = value.list
            /** @type {number} */
            let itemIndex = 0;
            /** @type {Array} */
            let arr = [];
            /** @type {number} */
            let completed = 0;
            data.forEach(function (item) {
              vm.$http.get(Api.adList, {
                params: {
                  param: '{"status":8,"page":1,"size":1000,"uuid":"{0}","pageIndex":1,"pageSize":1000}'.format(item.uuid)
                }
              }).then(function (pc) {
                pc.object.list.forEach(function (obj) {
                  obj.plan = item.name;
                  arr.push(obj);
                });
                itemIndex++;
              });
            });
            /** @type {number} */
            let poll = setInterval(function () {
              if (itemIndex >= data.length) {
                arr.forEach(function (d) {
                  vm.$http.get(Api.adView, {
                    params: {
                      param: '{"uuid":"{0}"}'.format(d.uuid)
                    }
                  }).then(function (obj) {
                    vm.$http.get(Api.listDayData, {
                      params: {
                        param: '{"uuid":"{0}","startDate":"{1}","endDate":"{2}"}'.format(d.uuid, startDate, endDate)
                      }
                    }).then(function (item) {
                      item.object.list.forEach(function (results) {
                        results.title = obj.object.materialTitle;
                        /** @type {Array} */
                        let string = [];
                        obj.object.materialFileUrl.split(",").forEach(function (json) {
                          string.push("https://swsdl.vivo.com.cn" + json);
                        });
                        /** @type {Array} */
                        results.images = string;
                        results.ad = d.name;
                        results.plan = d.plan;
                        /** @type {string} */
                        results.spent = (results.spent / 100000).toFixed(2);
                        /** @type {string} */
                        results.clickRate = (100 * (results.clickCount / results.showCount || 0)).toFixed(2);
                        /** @type {string} */
                        results.clickPrice = (results.spent / results.clickCount || 0).toFixed(2);
                        if (!(0 == results.clickCount && (0 == results.showCount && 0 == results.spent))) {
                          filterData.push(results);
                        }
                        allData.push(results);
                        completed++;
                      });
                    });

                  });

                });
                clearInterval(poll);
              }
            }, 100);
            /** @type {number} */
            let theAnimationID = setInterval(function () {
              if (completed >= arr.length) {
                if (0 != arr.length) {
                  /** @type {Array} */
                  vm.allData = allData;
                  /** @type {Array} */
                  vm.filterData = filterData;
                  if (vm.switchEmpty) {
                    /** @type {number} */
                    vm.total = filterData.length;
                  } else {
                    /** @type {number} */
                    vm.total = allData.length;
                  }
                  /** @type {boolean} */
                  vm.loading = false;
                  vm.page(1);
                  clearInterval(theAnimationID);
                }
              }
            }, 100);
          } else {
            /** @type {boolean} */
            vm.loading = false;
            vm.$message.error(res.errorCodeMsg.errorMsg);
          }
        });
      }
    }
  }
</script>

<style>

</style>
