<template>
  <div>
    <div style="padding: 20px 250px 0 250px">
      <a-steps :current="currentIndex">
        <a-step title="上传" description="上传Excel文件"/>
        <a-step title="完成" description="完成学生信息录入"/>
      </a-steps>
    </div>
    <div style="margin-top: 20px;padding: 20px 200px 0 200px" v-if="currentIndex===0">
      <a-upload-dragger
        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :customRequest="customRequest"
        :beforeUpload="beforeUpload"
        name="file"
        :multiple="false">
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox"/>
        </p>
        <p class="ant-upload-text">单击或拖动文件到该区域以上传</p>
        <p class="ant-upload-hint">
          支持单次上传。请选择Excel文件（.xls/.xlsx）
        </p>
      </a-upload-dragger>
    </div>
    <div v-if="currentIndex===1" style="margin-top: 50px;padding-left: 150px">
      <a-row style="margin-bottom: 20px">
        <a-col :span="8"></a-col>
        <a-col :span="8">
          <a-statistic title="新增学生数量" :value="20" style=""/>
        </a-col>
        <a-col :span="8"></a-col>
      </a-row>
      <a-row>
        <a-col :span="8"></a-col>
        <a-col :span="8">
          <a-statistic title="总共学生数量" :value="1250" style=""/>
        </a-col>
        <a-col :span="8"></a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
    import {Post} from "../http";
    import {API} from "../api";

    export default {
        name: "NewStudent",
        data() {
            return {
                currentIndex: 0
            }
        },
        methods: {
            beforeUpload(file, fileList) {
                let exName = file.name.slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
                if (exName === 'xls' || exName === 'xlsx') {
                    return true;
                } else {
                    this.$notification['error']({
                        message: '文件不正确，请重新选择',
                        description: `文件${file.name}不是正确的Excel文件，支持的扩展名：xls或xlsx`,
                    });
                    return false;
                }
            },
            customRequest(data) {
                let progress = {percent: 0};
                Post(API.upload_user_file)
                    .withSuccessCode(201)
                    .withErrorStartMsg("上传失败：")
                    .withFormData({file: data.file}, true, p => {
                        progress.percent = p;
                        if (progress.percent < 100) {
                            data.onProgress(progress)
                        } else {
                            data.onSuccess();
                        }
                    })
                    .do(response => {
                        this.$message.success('上传成功');
                        this.currentIndex = 1;
                    })
            }
        }
    }
</script>

<style scoped>

</style>
