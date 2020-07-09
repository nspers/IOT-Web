<template>
  <div class="spon subMain">
    <ButtonGroup size="large">
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
            <InputNumber
              v-if="column.ctype === 'number'"
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
        <Button type="error" size="large" long @click="remove()">删除</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      tabHeight: 530,
      pageSize: 10,
      currentPage: 1,
      totalSize: 0,
      showModal: false,
      modalLoading: true,
      tabLoading: false,
      modalEdit: false,
      modalDelete: false,
      dataList: [],
      dataModal: {},
      apis: {
        iotcomm: {
          add: false,
          delete: false,
          update: "/config/updateMsgCode",
          query: "/config/findMsgCode",
          columns: [
            {
              key: "id",
              title: "id"
            },
            {
              key: "msgType",
              title: "消息类型",
              ctype: "number"
            },
            {
              key: "msgCode",
              title: "消息编码"
            },
            {
              key: "thingsId",
              title: "设备id",
              ctype: "number"
            },
            {
              key: "thingsMsgKey",
              title: "设备消息key",
              noEdit: true
            },
            {
              key: "describe",
              title: "描述",
              ctype: "textarea"
            },
            {
              title: "操作",
              slot: "action",
              align: "center",
              width: 130
            }
          ]
        },
        tecnon: {
          add: false,
          delete: false,
          update: "/config/updateMsgCode",
          query: "/config/findMsgCode",
          columns: [
            {
              key: "id",
              title: "id"
            },
            {
              key: "msgType",
              title: "消息类型",
              ctype: "number"
            },
            {
              key: "msgCode",
              title: "消息编码"
            },
            {
              key: "thingsId",
              title: "设备id",
              ctype: "number"
            },
            {
              key: "thingsMsgKey",
              title: "设备消息key",
              noEdit: true
            },
            {
              key: "describe",
              title: "描述",
              ctype: "textarea"
            },
            {
              title: "操作",
              slot: "action",
              align: "center",
              width: 130
            }
          ]
        },
        shuncom: {
          add: false,
          delete: false,
          update: "/config/updateMsgCode",
          query: "/config/findMsgCode",
          columns: [
            {
              key: "id",
              title: "id"
            },
            {
              key: "msgType",
              title: "消息类型",
              ctype: "number"
            },
            {
              key: "msgCode",
              title: "消息编码"
            },
            {
              key: "thingsId",
              title: "设备id",
              ctype: "number"
            },
            {
              key: "thingsMsgKey",
              title: "设备消息key",
              noEdit: true
            },
            {
              key: "describe",
              title: "描述",
              ctype: "textarea"
            },
            {
              title: "操作",
              slot: "action",
              align: "center",
              width: 130
            }
          ]
        },
        frt: {
          add: false,
          delete: false,
          update: "/config/updateMsgCode",
          query: "/config/findMsgCode",
          columns: [
            {
              key: "id",
              title: "id"
            },
            {
              key: "msgType",
              title: "消息类型",
              ctype: "number"
            },
            {
              key: "msgCode",
              title: "消息编码"
            },
            {
              key: "thingsId",
              title: "设备id",
              ctype: "number"
            },
            {
              key: "thingsMsgKey",
              title: "设备消息key",
              noEdit: true
            },
            {
              key: "describe",
              title: "描述",
              ctype: "textarea"
            },
            {
              title: "操作",
              slot: "action",
              align: "center",
              width: 130
            }
          ]
        },
        led: {
          add: false,
          delete: false,
          update: "/config/updateMsgCode",
          query: "/config/findMsgCode",
          columns: [
            {
              key: "id",
              title: "id"
            },
            {
              key: "msgType",
              title: "消息类型",
              ctype: "number"
            },
            {
              key: "msgCode",
              title: "消息编码"
            },
            {
              key: "thingsId",
              title: "设备id",
              ctype: "number"
            },
            {
              key: "thingsMsgKey",
              title: "设备消息key",
              noEdit: true
            },
            {
              key: "describe",
              title: "描述",
              ctype: "textarea"
            },
            {
              title: "操作",
              slot: "action",
              align: "center",
              width: 130
            }
          ]
        },
        lcd: {
          add: false,
          delete: false,
          update: "/config/updateMsgCode",
          query: "/config/findMsgCode",
          columns: [
            {
              key: "id",
              title: "id"
            },
            {
              key: "msgType",
              title: "消息类型",
              ctype: "number"
            },
            {
              key: "msgCode",
              title: "消息编码"
            },
            {
              key: "thingsId",
              title: "设备id",
              ctype: "number"
            },
            {
              key: "thingsMsgKey",
              title: "设备消息key",
              noEdit: true
            },
            {
              key: "describe",
              title: "描述",
              ctype: "textarea"
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
      menuCode: "",
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
  watch: {
    $route: function(newValue, oldValue) {
      this.init();
    }
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
      var menu = this.$parent.menuMapper.find(
        m => m.url && routePath.includes(m.url)
      );

      this.currentPage = 1;
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
    updateList() {
      var self = this;

      this.tabLoading = true;
      this.$api
        .post(self.apis[self.apiName].query, {
          pageSize: self.pageSize,
          pageNum: self.currentPage,
          type: self.menuCode
        })
        .then(function(res) {
          self.dataList = res.result.list;
          self.totalSize = res.result.total;
          self.tabLoading = false;
        });
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

