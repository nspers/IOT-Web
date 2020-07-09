<style scoped>
    .expand-row{
        height: 40px;
        line-height: 40px;
        font-size: 13px;
        padding:0;
    }
    td.ivu-table-expanded-cell{padding:0 !important;}
</style>
<template>
    <div>
        <Row class="expand-row" v-for="(item, index) in row.childList" :key="index">
            <Col span="5">
                <!-- <span class="expand-key">菜单ID: </span> -->
                <span class="expand-value">{{ item.id }}</span>
            </Col>
            <Col span="5">
                <!-- <span class="expand-key">菜单名称: </span> -->
                <span class="expand-value">{{ item.name }}</span>
            </Col>
            <Col span="5">
                <!-- <span class="expand-key">父级ID: </span> -->
                <span class="expand-value">{{ item.pid }}</span>
            </Col>
            <Col span="5">
                <!-- <span class="expand-key">访问路径: </span> -->
                <span class="expand-value">{{ item.url }}</span>
            </Col>
            <Col span="4" style="">
                <Button type="info" size="small" style="margin-right: 5px" @click="editRole(index)">编辑</Button>
                <Button type="error" size="small" @click="openDelete(index)">删除</Button>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        },
        methods:{
        updataList(){
            var self = this
            this.loading = true
            this.$api.get('sysMenu/selectMenuList').then(function(res){
                self.data1 = res.data
                self.loading = false
            })
        },

        openDelete(index){
            this.deleteModel = true
            this.deleteIndex = index
        },
        remove(){
            var self = this
            var index = this.deleteIndex
            this.$api.delete('sysMenu/deleteMenu/' + this.data1[index].id).then(function(res){
                self.updataList()
                self.deleteModel = false
            })                
        },
        editRole(index){
            console.log(this.data1[index])
            this.edit = true
            this.showData = true
            this.useData = this.data1[index]
            var self = this
            // this.$api.get('sysDevice/selectSponList/' + this.data1[index].id).then(function(res){
            //     console.log(res);
            //     self.showData = true
            //     self.useData = res.data
            // })
        },
        submitUser(){
            var self = this
            if(this.edit){
                this.$api.put('sysMenu/updateMenu',this.useData).then(function(res){
                    console.log(res);
                    self.edit = false
                    self.showData = false
                    self.updataList()
                })
            }else{
                this.$api.post('sysMenu/insertMenu',this.useData).then(function(res){
                    self.showData = false
                    self.updataList()
                })                
            }
        }
    }
    };
</script>
