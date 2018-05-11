axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

new Vue({
    el: '#app',
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
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 89);
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
            let planParams = new URLSearchParams();
            planParams.append('param','{"startDate":"'+startDate+'","endDate":"'+endDate+'","status":"0","page":1,"size":1000,"pageIndex":1,"pageSize":1000}');
            axios.post(Api.planList, planParams).then(function (res) {
                let value = res.object;
                if (1 == res.code) {
                    let data = value.list
                    /** @type {number} */
                    let itemIndex = 0;
                    /** @type {Array} */
                    let arr = [];
                    /** @type {number} */
                    let completed = 0;
                    let diffDays = moment(endDate).diff(moment(startDate),'d')+1;
                    data.forEach(function (item) {
                        for(let i = 0;i<diffDays;i++){
                            let today = moment(startDate).add(i,'d').format('YYYY-MM-DD');
                            let adParams = new URLSearchParams();
                            adParams.append('param','{"startDate":"'+today+'","endDate":"'+today+'","status":8,"page":1,"size":1000,"uuid":"{0}","pageIndex":1,"pageSize":1000}'.format(item.uuid));
                            axios.post(Api.adList,adParams).then(function (pc) {
                                pc.object.list.forEach(function (obj) {
                                    console.debug(obj);
                                    obj.plan = item.name;
                                    obj.date = today;
                                    obj.ad = obj.name;
                                    arr.push(obj);
                                });
                                itemIndex++;
                            });
                        }
                    });
                    /** @type {number} */
                    let poll = setInterval(function () {
                        if (itemIndex >= data.length*diffDays) {
                            arr.forEach(function (d) {
                                let viewParams = new URLSearchParams();
                                viewParams.append('param','{"uuid":"{0}"}'.format(d.uuid));
                                axios.post(Api.adView, viewParams).then(function (obj) {
                                    let images = [];
                                    obj.object.materialFileUrl.split(",").forEach(function (json) {
                                        images.push("https://swsdl.vivo.com.cn" + json);
                                    });
                                    /** @type {Array} */
                                    d.images = images;
                                    d.title = obj.object.materialTitle;
                                    /** @type {string} */
                                    d.spent = d.spent;
                                    /** @type {string} */
                                    d.clickRate = (100 * (d.clickCount / d.showCount || 0)).toFixed(2);
                                    if (d.clickCount || d.showCount ||d.downloadCount) {
                                        filterData.push(d);
                                    }
                                    console.debug(d)
                                    allData.push(d);
                                    completed++;

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
});
