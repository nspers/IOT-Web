<template>
  <div class="spon subMain">
    <ButtonGroup size="large">
      <Button @click="addData()">
        <Icon type="ios-add-cprimaryircle-outline" />新增
      </Button>
    </ButtonGroup>
    <Table :loading="tabLoading" border :columns="apis[apiName].columns" :data="dataList" height="520">
      <template slot-scope="{ row }" slot="action">
        <Button type="info" size="small" style="margin-right: 5px" @click="editData(row)">编辑</Button>
        <Button type="error" size="small" @click="openDelete(row)">删除</Button>
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
      pageSize: 20,
      currentPage: 1,
      totalSize: 60,
      showModal: false,
      modalLoading: true,
      tabLoading: false,
      modalEdit: false,
      modalDelete: false,
      dataList: [],
      dataModal: {},
      apis: {
        tecnon: {
          add: "sysDevice/saveTecnon",
          delete: "sysDevice/delectTecnon/",
          update: "sysDevice/updateTecnon",
          query: "sysDevice/selectTecnonList/",
          columns: [
            {
              title: "厂商ID",
              key: "factory_id"
            },
            {
              title: "IP地址",
              key: "ip"
            },
            {
              title: "设备名称",
              key: "device_name"
            },
            {
              title: "设备方应用设备ID",
              key: "device_id"
            },
            {
              title: "平台设备ID",
              key: "did"
            },
            {
              title: "网页地址",
              key: "url"
            },
            {
              title: "描述",
              key: "describe",
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
        spon: {
          add: "sysDevice/saveSpon",
          delete: "sysDevice/delectSpon/",
          update: "sysDevice/updateSpon",
          query: "sysDevice/selectSponList/",
          columns: [
            {
              title: "主键ID",
              key: "id"
            },
            {
              title: "厂商ID",
              key: "factory_id"
            },
            {
              title: "IP地址",
              key: "ip"
            },
            {
              title: "设备名称",
              key: "device_name"
            },
            {
              title: "设备类型",
              key: "device_type"
            },
            {
              title: "设备方应用设备ID",
              key: "device_id"
            },
            {
              title: "平台设备ID",
              key: "did"
            },
            {
              title: "描述",
              key: "describe",
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
        lonbon: {
          add: "sysDevice/savelonbon",
          delete: "sysDevice/delectlonbon/",
          update: "sysDevice/updatelonbon",
          query: "sysDevice/selectlonbonList/",
          columns: [
            {
              title: "主键ID",
              key: "id"
            },
            {
              title: "厂商ID",
              key: "factory_id"
            },
            {
              title: "设备类型",
              key: "device_type"
            },
            {
              title: "IP地址",
              key: "ip"
            },
            {
              title: "设备名称",
              key: "device_name"
            },
            {
              title: "设备方应用设备ID",
              key: "device_id"
            },
            {
              title: "平台设备ID",
              key: "did"
            },
            {
              title: "描述",
              key: "describe",
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
        abloomy: {
          add: "sysDevice/saveAbloomy",
          delete: "sysDevice/delectAbloomy/",
          update: "sysDevice/updateAbloomy",
          query: "sysDevice/selectAbloomyList/",
          columns: [
            {
              title: "主键ID",
              key: "id"
            },
            {
              title: "厂商ID",
              key: "factory_id"
            },
            {
              title: "IP地址",
              key: "ip"
            },
            {
              title: "AP设备mac地址",
              key: "mac"
            },
            {
              title: "设备名称",
              key: "device_name"
            },
            {
              title: "设备方应用设备ID",
              key: "device_id"
            },
            {
              title: "平台设备ID",
              key: "did"
            },
            {
              title: "描述",
              key: "describe",
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
        c => c.key !== "id" && !c.slot
      );
    }
  },
  created: function() {
    var self = this;

    self.apiName = "tecnon"; // tecnon,spon,lonbon,abloomy

    this.updateList();
    window.thiz = this;
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
        .get(self.apis[self.apiName].query, {
          pageSize: self.pageSize,
          currentPage: self.currentPage
        })
        .then(function(res) {
          self.dataList = res.data;
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

