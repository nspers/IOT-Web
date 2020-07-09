<template>
  <div class="spon subMain">
    <ButtonGroup size="large">
      <Button v-if="apis[apiName].add" @click="addData()">
        <Icon type="primary" />新增
      </Button>
    </ButtonGroup>
    <Table :loading="tabLoading" border :columns="apis[apiName].columns" :data="dataList" height="520">
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
      title="设备信息"
      v-model="showModal"
      :loading="modalLoading"
      class-name="vertical-center-modal"
      @on-ok="submit"
      width="620"
    >
      <ul class="showUser">
        <li v-for="column in editColumns" :key="column.key">
          <div>
            <strong>{{column.title}}：</strong>
            <div class="editDiv">
              <Input size="large" clearable :type="column.ctype" v-model="dataModal[column.key]" />
            </div>
          </div>
        </li>
      </ul>
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
  data() {
    return {
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
        tecnon: {
          add: "/led/addLed",
          delete: "/led/removeLed/",
          update: "/led/updateLed",
          query: "/led/findLed",
          columns: [
            {
              key: "id",
              title: "id"
            },
            {
              key: "deviceName",
              title: "设备名称"
            },
            {
              key: "did",
              title: "平台设备ID"
            },
            {
              key: "url",
              title: "网页地址"
            },
            {
              key: "onoff",
              title: "屏幕开关"
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
      apiName: ""
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
    var self = this;

    self.apiName = "tecnon";

    self.updateList();
  },
  mounted: function() {
    this.$nextTick(function() {});
  },
  methods: {
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
          pageNum: self.currentPage
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
    },
    submit() {
      var self = this;

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
    }
  }
};
</script>

