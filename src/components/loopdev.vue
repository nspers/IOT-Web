<template>
  <div class="spon subMain" :class="{isChild}">
    <ButtonGroup size="large" v-if="!isChild">
      <Button v-if="apis[apiName].add" @click="addData()">
        <Icon type="primary" />新增
      </Button>
    </ButtonGroup>
    <Table
      :loading="tabLoading"
      border
      :columns="apis[apiName].columns"
      :data="dataList"
      :height="tabHeight"
      ref="dataTable"
    >
      <template slot-scope="{ row }" slot="action">
        <Button type="info" size="small" style="margin-right: 5px" @click="editData(row)">编辑</Button>
        <Button v-if="apis[apiName].delete" type="error" size="small" @click="openDelete(row)">删除</Button>
      </template>
    </Table>
    <template>
      <Page
        :total="totalSize"
        :current="currentPage"
        :page-size="pageSize"
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
        show-total
        show-elevator
        show-sizer
      />
    </template>
    <Modal
      :title="modalEdit?'编辑':'新增'"
      v-model="showModal"
      :loading="modalLoading"
      class-name="vertical-center-modal"
      @on-ok="submit"
      width="620"
    >
      <Form
        class="showUser"
        ref="formValidate"
        :model="dataModal"
        :rules="ruleValidate"
        :label-width="130"
      >
        <FormItem
          v-for="column in editColumns"
          :key="column.key"
          :label="column.title+'：'"
          :prop="column.key"
        >
          <div class="editDiv">
            <Select v-if="column.ctype === 'select'" v-model.number="dataModal[column.key]">
              <Option
                v-for="item in selectDatas(column.data)"
                :value="item.id"
                :key="item.id"
              >{{ item.name }}</Option>
            </Select>
            <InputNumber
              v-else-if="column.ctype === 'number'"
              v-model.number="dataModal[column.key]"
              size="large"
              :placeholder="'请输入'+column.title"
            />
            <Input
              v-else
              v-model="dataModal[column.key]"
              size="large"
              :placeholder="'请输入'+column.title"
            />
          </div>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="modalDelete" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否确认删除此设备?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="remove">删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "App",
  props: {
    api: Object,
    params: Object
  },
  data() {
    return {
      tabHeight: 530,
      pageSize: 10,
      currentPage: 1,
      totalSize: 0,
      isChild: false, // 是否为子组件
      showModal: false,
      modalLoading: true,
      tabLoading: false,
      modalEdit: false,
      modalDelete: false,
      dataList: [],
      dataModal: {},
      datas: {
        types: {
          1: "顶棚照明",
          3: "灯箱照明"
        }
      },
      apis: {
        shuncom: {
          add: "/loop/addDevice",
          delete: "/loop/removeDevice/",
          update: "/loop/updateDevice",
          query: "/loop/findDevice",
          columns: [
            {
              key: "id",
              title: "id"
            },
            {
              key: "name",
              title: "设备名称"
            },
            {
              key: "type",
              title: "类型",
              ctype: "select",
              data: "types",
              render: (h, params) => {
                return h(
                  "span",
                  this.datas.types[params.row.type] || params.row.type
                );
              }
            },
            {
              title: "操作",
              slot: "action",
              align: "center",
              width: 130
            }
          ]
        }
      },
      apiName: "",
      ruleValidate: {}
    };
  },
  computed: {
    editColumns: function() {
      return this.apis[this.apiName].columns.filter(
        c => c.key !== "id" && !c.slot && !c.noEdit
      );
    }
  },
  created: function() {
    this.init();
  },
  mounted: function() {
    this.$nextTick(function() {});

    var self = this;

    window.onresize = function() {
      self.tabHeight =
        window.innerHeight - self.$refs.dataTable.$el.offsetTop - 110;
    };
    window.onresize();
  },
  methods: {
    init() {
      var self = this;
      var routePath = this.$route.path;
      var menu;
      var parent;

      this.currentPage = 1;
      // 是集中控制器下面的组件还是独立页面
      if (self.params) {
        self.isChild = true;

        parent = this.$parent.$parent.$parent.$parent;

        if (self.params._isAddLoop) {
          self.addByGatGateway(self.params);
          // 父页面数据行的标记设为false
          this.$parent.$parent.$parent.dataList.find(
            d => d.id == self.params.id
          )._isAddLoop = false;
        }
      } else {
        parent = this.$parent;
      }

      menu = parent.menuMapper.find(m => m.url && routePath.includes(m.url));

      if (menu) {
        self.menuCode = menu.thingId;
        self.apiName = menu.url;

        self.updateList();

        // 表单验证
        self.editColumns.forEach(col => {
          var rv = {
            required: true,
            message: `${col.title} 不能为空`,
            trigger: "blur"
          };

          // 可为空的字段
          if (col.key === "describe") {
            rv.required = false;
          }
          if (["number", "select"].includes(col.ctype)) {
            rv.type = "number";
          }

          self.ruleValidate[col.key] = [rv];
        });
      } else {
        console.error("未找到menu");
      }
    },
    pageChange(page) {
      this.currentPage = page;
      this.updateList();
    },
    pageSizeChange(pageSize) {
      this.pageSize = pageSize;

      if (this.currentPage === 1) {
        this.updateList();
      } else {
        this.currentPage = 1;
      }
    },
    selectDatas(k) {
      var self = this;
      var arr = [];

      arr = Object.keys(self.datas[k]).map(key => {
        return { id: ~~key, name: self.datas[k][key] };
      });

      return arr;
    },
    updateList() {
      var self = this;

      this.tabLoading = true;
      var param;

      if (self.isChild) {
        param = {
          id: self.params.id,
          pageSize: 999,
          pageNum: 1
        };
      } else {
        param = {
          pageSize: self.pageSize,
          pageNum: self.currentPage
        };
      }
      this.$api.post(self.apis[self.apiName].query, param).then(function(res) {
        self.dataList = res.result.list;
        self.totalSize = res.result.total;
        self.tabLoading = false;
      });
    },
    addByGatGateway(gateway) {
      var self = this;

      self.addData();

      this.dataModal.gatewayId = gateway.id;
      this.dataModal.ccuUid = gateway.ccuId;
      this.dataModal.ccuName = gateway.name;
    },
    addData() {
      this.showModal = true;
      this.modalEdit = false;
      this.dataModal = {};
      // number类型默认值
      this.editColumns.forEach(col => {
        if (col.ctype === "number") {
          this.dataModal[col.key] = null;
        }
      });
      this.$refs.formValidate.resetFields();
    },
    openDelete(data) {
      this.dataModal = data;
      this.modalDelete = true;
    },
    remove() {
      var self = this;

      this.$api
        .delete(self.apis[self.apiName].delete + this.dataModal.id)
        .then(function(res) {
          if (self.dataList.length === 1) {
            self.currentPage = 1;
          }
          self.updateList();
          self.modalDelete = false;
        });
    },
    editData(data) {
      this.modalEdit = true;
      this.showModal = true;
      this.dataModal = Object.assign({}, data);
      this.$refs.formValidate.resetFields();
    },
    submit() {
      var self = this;

      this.$refs.formValidate.validate(valid => {
        if (valid) {
          if (this.modalEdit) {
            this.$api
              .put(self.apis[self.apiName].update, this.dataModal)
              .then(function(res) {
                self.modalEdit = false;
                self.showModal = false;
                self.updateList();
              });
          } else {
            this.$api
              .post(self.apis[self.apiName].add, this.dataModal)
              .then(function(res) {
                self.showModal = false;
                self.updateList();
              });
          }
        } else {
          self.modalLoading = false;
          self.$nextTick(() => {
            self.modalLoading = true;
          });
        }
      });
    }
  }
};
</script>

<style >
.subMain.isChild {
  margin: 0;
  padding: 0;
  border: none;
  min-height: auto;
}
.subMain.isChild .ivu-page {
  display: none;
}
</style>