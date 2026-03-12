import Vue from "vue";
import Router from "vue-router";
import Home from "../components/Home.vue";
import GetStatistics from "../components/Home/GetStatistics.vue"; // 首页
import GetLogin from "../components/Home/GetLogin.vue"; // 登陆
import GetTypeLogin from "../components/Home/GetTypeLogin.vue"; // 选择系统登录页面
import UpdatePassword from "../components/Home/UpdatePassword.vue"; // 修改密码
import Personal from "../components/Home/Personal.vue"; // 个人中心
import userInformationList from "../components/userInformation/userInformationList.vue"; // 用户列表
import userInformationDetail from "../components/userInformation/userInformationDetail.vue"; // 用户详情
import rolesList from "../components/roles/rolesList.vue"; // 角色列表
import rolesDetail from "../components/roles/rolesDetail.vue"; // 角色详情
import paramsConfigurationList from "../components/paramsConfiguration/paramsConfigurationList.vue"; // 参数配置列表
import paramsConfigurationDetail from "../components/paramsConfiguration/paramsConfigurationDetail.vue"; // 参数配置详情
import operationLogList from "../components/operationLog/operationLogList.vue"; // 操作日志列表
import operationLogDetail from "../components/operationLog/operationLogDetail.vue"; // 操作日志详情
import menuList from "../components/menu/menuList.vue"; // 菜单列表
import menuDetail from "../components/menu/menuDetail.vue"; // 菜单详情
import certificateList from "../components/certificate/certificateList.vue"; // 证书列表
import certificateDetail from "../components/certificate/certificateDetail.vue"; // 证书列表
import organizationList from "../components/organization/organizationList.vue"; // 组织机构详情
import organizationDetail from "../components/organization/organizationDetail.vue"; // 组织机构详情
import addOrg from "../components/organization/addOrg.vue"; // 选择组织机构
import ipConfig from "../components/ip/ipConfig.vue"; // 网卡配置
import ipDiagnose from "../components/ip/ipDiagnose.vue"; // 网络诊断
import initInstallList from "../components/initInstall/initInstallList.vue"; // 安装向导
import initUserList from "../components/initInstall/initUserList.vue"; // 初始化管理员列表显示插件
import symmetricKeyList from "../components/symmetric/symmetricKeyList"; // 对称密钥管理
import quantumKeyList from "../components/Keys/quantumKeyList.vue"; // 量子密钥管理
import RSAkeyList from "../components/Keys/RSAkeyList.vue"; // RSA密钥管理
import SM2KeyList from "../components/Keys/SM2KeyList.vue"; // SM2密钥管理
import EDDSAKeyList from "../components/Keys/EDDSAKeyList.vue"; // EDDSA密钥管理
import ECDSAKeyList from "../components/Keys/ECDSAKeyList.vue"; // ECDSA密钥管理
import SM9ParentKeyList from "../components/Keys/SM9ParentKeyList.vue"; // SM9主密钥管理
import SM9ChildKeyList from "../components/Keys/SM9ChildKeyList.vue"; // SM9子密钥管理
import DSAKeyList from "../components/Keys/DSAKeyList.vue"; // DSA密钥管理
import ServiceList from "../components/Keys/ServiceList.vue"; // 服务配置管理
import keyLogo from "../components/Keys/keyLogo.vue"; // key页面提示
import selfInspectionList from "../components/selfInspection/selfInspectionList.vue"; // 设备自检
import selfUpList from "../components/selfInspection/selfUpList.vue"; // 设备升级
import userLoginList from "../components/selfInspection/userLoginList.vue"; // 用户登录
import modifyPINList from "../components/selfInspection/modifyPINList.vue"; // 修改PIN
import copyKeyList from "../components/Keys/copyKeyList.vue"; // 备注密钥信息
import recoveryKeyList from "../components/Keys/recoveryKeyList.vue"; // 恢复密钥信息
import whiteMenuList from "../components/Keys/whiteMenuList.vue"; // 白名单
import serviceStatusList from "../components/Keys/serviceStatusList.vue"; // 服务状态
import svsStatusList from "../components/Keys/svsStatusList.vue"; // 签名验签服务状态
import nullList from "../components/null/null.vue"; // 空白
import timeSourceList from "../components/timeSource/timeSourceList.vue"; // 时间源
import syncLogList from "../components/operationLog/syncLogList.vue"; // ntp时间同步
import jobLogList from "../components/operationLog/jobLogList.vue"; // ntp时间同步 详情
import dataDictionaryList from "../components/dataDictionary/dataDictionaryList.vue"; // 数据字典
import dataDictionaryDetail from "../components/dataDictionary/dataDictionaryDetail.vue"; // 数据字典
import scheduledTaskDetail from "../components/scheduledTask/scheduledTaskDetail.vue"; // 定时任务详情
import scheduledTaskList from "../components/scheduledTask/scheduledTaskList.vue"; // 定时任务列表
import machineDetail from "../components/machine/machineDetail.vue"; // 定时任务详情
import machineList from "../components/machine/machineList.vue"; // 定时任务列表
import systemResourceList from "../components/SystemResource/systemResourceList.vue"; // 系统资源
import addSystemResource from "../components/SystemResource/addSystemResource.vue"; // 系统添加

import issuanceDetail from "../components/issuance/issuanceDetail.vue"; // 证书颁发机构详情
import issuanceList from "../components/issuance/issuanceList.vue"; // 证书颁发机构
import configCRL from "../components/issuance/configCRL.vue"; // 配置CRL验证
import verificationList from "../components/issuance/verificationList.vue"; // 签名验签服务
import managementList from "../components/management/managementList.vue"; // 应用管理
import svssymmetricKeyList from "../components/symmetric/symmetricKeyList.vue"; // 对称密钥管理[签名服务器使用】
import managementDetail from "../components/management/managementDetail.vue"; // 应用管理详情
import applicationCertList from "../components/ApplicationCert/applicationCertList.vue"; // 应用证书管理
import applicationCertDetail from "../components/ApplicationCert/applicationCertDetail.vue"; // 应用证书管理详情
import applicationCertExtList from "../components/ApplicationCertExt/applicationCertExtList.vue"; // 外部应用证书管理
import applicationCertExtDetail from "../components/ApplicationCertExt/applicationCertExtDetail.vue"; // 外部应用证书管理详情
import explainList from "../components/CAInit/explainList.vue"; // CA 系统初始化
import CAInitList from "../components/CAInit/CAInitList.vue"; // CA根证书
import certTemplateList from "../components/CAInit/certTemplateList.vue"; // 证书模板
import adminCertList from "../components/CAInit/adminCertList.vue"; // 超管证书
import auditAdminList from "../components/CAInit/auditAdminList.vue";
import InitOneList from "../components/InitOne/InitOneList.vue"; // 初始化一体机

import initList from "../components/InitOne/initList.vue"; // 初始化页面
import CaCertList from "../components/CaCert/CaCertList.vue"; // 业务管理
import CaCertDetail from "../components/CaCert/CaCertDetail.vue"; // 业务管理
import CrlList from "../components/CaCert/CrlList.vue"; // CRL管理
import CrlDetail from "../components/CaCert/CrlDetail.vue"; // CRL管理

import InitPassCard from "../components/InitOne/InitPassCard.vue"; // 初始化密码卡
import AdminList from "../components/Admin/AdminList.vue"; // 管理员管理
import AdminDetail from "../components/Admin/AdminDetail.vue"; // 管理员管理详情
import systemCfgList from "../components/systemCfg/systemCfgList.vue"; // CA系统配置
import RootCertList from "../components/RootCert/RootCertList.vue"; // 根证书管理详情
import RootCertDetail from "../components/RootCert/RootCertDetail.vue"; // 根证书管理详情
import RequestorList from "../components/Requestor/RequestorList.vue"; // CA请求者
import RequestorDetail from "../components/Requestor/RequestorDetail.vue"; // CA请求者详情
import PublisherList from "../components/Publisher/PublisherList.vue"; // CA发布者
import PublisherDetail from "../components/Publisher/PublisherDetail.vue"; // CA发布者详情
import CustomTemList from "../components/CustomTem/CustomTemList.vue"; // 自定义模板
import CustomTemDetail from "../components/CustomTem/CustomTemDetail.vue"; // 自定义模板详情
import TemManagementList from "../components/TemManagement/TemManagementList.vue"; // 模板生成
import TemManagementDetail from "../components/TemManagement/TemManagementDetail.vue"; // 模板生成详情
import FirstLogin from "../components/Home/FirstLogin.vue";
import userManagementList from "../components/userManagement/userManagementList.vue"; // 用户管理
import userManagementDetail from "../components/userManagement/userManagementDetail.vue"; // 用户管理详情
import userCertificateList from "../components/userManagement/userCertificateList.vue"; // 用户管理证书
import userCertificateDetail from "../components/userManagement/userCertificateDetail.vue"; // 用户管理证书详情
import SignerList from "../components/Signer/SignerList.vue"; // 签名者列表
import SignerDetail from "../components/Signer/SignerDetail.vue"; // 签名列表详情
import CARootCertList from "../components/CARootCert/CARootCertList.vue"; // CA根证书列表
import CARootCertDetail from "../components/CARootCert/CARootCertDetail.vue"; // CA根证书详情
import InitRoot from "../components/InitOne/InitRoot.vue"; // CA初始化
import BusinessAdminList from "../components/BusinessAdmin/BusinessAdminList.vue"; // 业务管理员
import AuditOperationList from "../components/AuditOperation/AuditOperationList.vue"; // 审计操作员
import BusinessOperationList from "../components/BusinessOperation/BusinessOperationList.vue"; // 业务操作员
import JudicialAdminList from "../components/JudicialAdmin/JudicialAdminList.vue"; // 司法取证员
import JudicialAdminDetail from "../components/JudicialAdmin/JudicialAdminDetail.vue"; // 司法取证员详情
import ExportCertList from "../components/ExportCert/ExportCertList.vue"; // 司法导出证书
import ExportCertDetail from "../components/ExportCert/ExportCertDetail.vue"; // 司法导出证书详情
import ExportLogin from "../components/ExportCert/ExportLogin.vue"; // 司法导出权限登录
import ExportKeyList from "../components/ExportKey/ExportKeyList.vue"; // 导出密钥
import CertSM2KeyList from "../components/EquipmentCert/CertSM2KeyList.vue"; // 设备证书SM2
import CertRSAKeyList from "../components/EquipmentCert/CertRSAKeyList.vue"; // 设备证书RSA
import CertKEKKeyList from "../components/EquipmentCert/CertKEKKeyList.vue"; // 设备证书对称密钥
import CertRecoveryKeyList from "../components/EquipmentCert/CertRecoveryKeyList.vue"; // 设备证书恢复密钥
import CertCopyKeyList from "../components/EquipmentCert/CertCopyKeyList.vue"; // 设备证书备份密钥
import CASelfList from "../components/CASelf/CASelfList.vue"; // CA设备自检
import RAAdminList from "../components/RAAdmin/RAAdminList.vue"; // RA管理
import PinList from "../components/CaCert/PinList.vue"; // 获取PIN
import IssueCert from "../components/CaCert/IssueCert.vue"; // 新增签发证书
import KMList from "../components/KMList/KMList.vue"; // RA接入
import KMDetail from "../components/KMList/KMDetail.vue"; // RA接入详情
import AuthorizaList from "../components/Authoriza/AuthorizaList.vue"; // 授权
import AuthorizaDetail from "../components/Authoriza/AuthorizaDetail.vue"; // 授权详情
import AuthorizedCAList from "../components/AuthorizedCA/AuthorizedCAList.vue"; // 授权CA
import DownUploadFile from "../components/AuthorizedCA/DownUploadFile.vue";
import CertReviewList from "../components/CertReview/CertReviewList.vue"; // 证书审核
import CertReviewDetail from "../components/CertReview/CertReviewDetail.vue"; // 证书审核详情
import CertRequestList from "../components/CertRequest/CertRequestList.vue"; // 证书申请
import CertRequestDetail from "../components/CertRequest/CertRequestDetail.vue"; // 证书申请详情
import RABusinessAdminList from "../components/RABusinessAdmin/RABusinessAdminList.vue"; // RA业务管理员
import RAApproverList from "../components/RAApprover/RAApproverList.vue"; // RA审核业务员
import RASafetyAuditorList from "../components/RASafetyAuditor/RASafetyAuditorList.vue"; // RA安全审计员
import RARegisteredSalesmanList from "../components/RARegisteredSalesman/RARegisteredSalesmanList.vue"; // RA注册业务员
import OcspList from "../components/Ocsp/OcspList.vue"; // ocsp管理
import LdapList from "../components/LDAP/LdapList"; // Ldap管理
import KeyGuiDangList from "../components/Keys/KeyGuiDangList.vue"; // 密钥归档
import KeyShenJiList from "../components/Keys/KeyShenJiList.vue"; // 密钥审计
import sysRoleList from "../components/sysRole/sysRoleList.vue";
import sysRoleDetail from "../components/sysRole/sysRoleDetail.vue";
import commonAdminList from "../components/commonAdmin/commonAdminList.vue"; // 共通管理员菜单
import commonAdminDetail from "../components/commonAdmin/commonAdminDetail.vue"; // 共通管理员菜单详情
import LicenceList from "../components/Licence/LicenceList.vue"; // 许可证
import CADeviceCertList from "../components/CADeviceCert/CADeviceCertList.vue"; // 设备证书
import CADeviceCertDetail from "../components/CADeviceCert/CADeviceCertDetail.vue"; // 设备证书详情
import hsmserverStatisticsList from "../components/HsmServerStatistics/hsmserverStatisticsList.vue"; // hsm统计列表

import deviceCertList from "../components/DeviceCert/DeviceCertList.vue"; //设备证书
import clientCertList from "../components/DeviceCert/ClientDeviceCertList.vue"; // 客户端设备证书
import clientCertDetail from "../components/DeviceCert/ClientDeviceCertDetail.vue"; // 客户端设备证书详情
import deviceInfoList from "../components/DeviceCert/DeviceInfoList.vue"; // 设备信息列表

Vue.use(Router);

const originalPush = Router.prototype.push;
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err);
// };
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => { });
};

const router = new Router({
  routes: [
    { path: "/", redirect: "/GetLogin" },
    { path: "/GetLogin", component: GetLogin },
    { path: "/GetTypeLogin", component: GetTypeLogin },

    {
      name: "InitOneList",
      path: "/InitOneList",
      component: InitOneList
    },
    {
      name: "FirstLogin",
      path: "/FirstLogin",
      component: FirstLogin
    },

    {
      name: "InitPassCard",
      path: "/InitPassCard",
      component: InitPassCard
    },
    {
      name: "InitRoot",
      path: "/InitRoot",
      component: InitRoot
    },
    {
      name: "LicenceList",
      path: "/LicenceList",
      component: LicenceList
    },
    {
      name: "AuthorizedCAList",
      path: "/AuthorizedCAList",
      component: AuthorizedCAList
    },

    {
      path: "/",
      component: Home,
      redirect: "/GetStatistics",
      meta: {
        keepalive: true
      },
      children: [
        {
          path: "/GetStatistics",
          name: "GetStatistics",
          component: GetStatistics
          //   meta: {
          //     keepalive: true,
          //     breadcrumb: ["首页"]
          //   }
        }, // 首页
        {
          path: "/null",
          name: "nullList",
          component: nullList
        },
        {
          path: "/UpdatePassword",
          name: "UpdatePassword",
          component: UpdatePassword
          //   meta: {
          //     keepalive: true,
          //     breadcrumb: ["个人信息",""]
          //   }
        }, // 修改密码
        {
          path: "/Personal",
          name: "Personal",
          component: Personal,
          meta: {
            keepalive: true,
            breadcrumb: ["个人信息"]
          }
        }, // 用户
        {
          name: "userInformationList",
          path: "/userInformationList",
          component: userInformationList,
          meta: {
            keepalive: true,
            breadcrumb: ["用户管理", "用户账户"]
          }
        },
        {
          name: "userInformationDetail",
          path: "/userInformationDetail",
          component: userInformationDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["个人信息", "用户信息详情"]
          }
        }, // 角色
        {
          name: "rolesList",
          path: "/rolesList",
          component: rolesList,
          meta: {
            keepalive: true,
            breadcrumb: ["权限管理", "角色管理"]
          }
        },
        {
          name: "rolesDetail",
          path: "/rolesDetail",
          component: rolesDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["权限管理", "角色信息详情"]
          }
        }, // 参数配置
        {
          name: "paramsConfigurationList",
          path: "/paramsConfigurationList",
          component: paramsConfigurationList,
          meta: {
            keepalive: true,
            breadcrumb: ["权限管理", "系统参数"]
          }
        },
        {
          name: "paramsConfigurationDetail",
          path: "/paramsConfigurationDetail",
          component: paramsConfigurationDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["权限管理", "系统参数"]
          }
        }, // 操作日志
        {
          name: "operationLogList",
          path: "/operationLogList",
          component: operationLogList,
          meta: {
            keepalive: true,
            breadcrumb: ["日志管理", "用户操作日志"]
          }
        },
        {
          name: "operationLogDetail",
          path: "/operationLogDetail",
          component: operationLogDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["首页", "操作日志详情"]
          }
        }, // 菜单
        {
          name: "menuList",
          path: "/menuList",
          component: menuList,
          meta: {
            keepalive: true,
            breadcrumb: ["权限管理", "菜单管理"]
          }
        },
        {
          name: "menuDetail",
          path: "/menuDetail",
          component: menuDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["权限管理", "菜单管理详情"]
          }
        },
        {
          name: "certificateList",
          path: "/certificateList",
          component: certificateList,
          meta: {
            keepalive: true,
            breadcrumb: ["用户管理", "用户证书管理"]
          }
        },
        {
          name: "certificateDetail",
          path: "/certificateDetail",
          component: certificateDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["用户管理", "用户证书管理详情"]
          }
        },
        {
          name: "organizationList",
          path: "/organizationList",
          component: organizationList,
          meta: {
            keepalive: true,
            breadcrumb: ["权限管理", "组织机构"]
          }
        },
        {
          name: "organizationDetail",
          path: "/organizationDetail",
          component: organizationDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["权限管理", "组织机构详情"]
          }
        },
        {
          name: "addOrg",
          path: "/addOrg",
          component: addOrg
          // meta: {
          //   keepalive: true,
          //   breadcrumb: ["权限管理", "组织机构详情"]
          // }
        }, //网卡配置
        {
          name: "ipConfig",
          path: "/ipConfig",
          component: ipConfig,
          meta: {
            keepalive: true,
            breadcrumb: ["网络管理", "配置网络"]
          }
        }, //网络诊断
        {
          name: "ipDiagnose",
          path: "/ipDiagnose",
          component: ipDiagnose,
          meta: {
            keepalive: true,
            breadcrumb: ["网络管理", "网络诊断"]
          }
        },
        {
          name: "initInstallList",
          path: "/initInstallList",
          component: initInstallList,
          meta: {
            keepalive: true,
            breadcrumb: ["设备管理", "初始化设备"]
          }
        },
        {
          name: "initUserList",
          path: "/initUserList",
          component: initUserList
          // meta: {
          //   keepalive: true,
          //   breadcrumb: ["设备管理", "初始化设备"]
          // }
        },
        {
          name: "svsSymmetricKeyList",
          path: "/svsSymmetricKeyList",
          component: svssymmetricKeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["密钥管理", "对称密钥管理"]
          }
        },
        {
          name: "quantumKeyList",
          path: "/quantumKeyList",
          component: quantumKeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["量子密钥管理"]
          }
        },
        {
          name: "RSAkeyList",
          path: "/RSAkeyList",
          component: RSAkeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["密钥管理", "RSA密钥管理"]
          }
        },
        {
          name: "SM2KeyList",
          path: "/SM2KeyList",
          component: SM2KeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["密钥管理", "SM2密钥管理"]
          }
        },
        {
          name: "EDDSAKeyList",
          path: "/EDDSAKeyList",
          component: EDDSAKeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["密钥管理", "EDDSA密钥管理"]
          }
        },
        {
          name: "ECDSAKeyList",
          path: "/ECDSAKeyList",
          component: ECDSAKeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["密钥管理", "ECDSA密钥管理"]
          }
        },
        {
          name: "DSAKeyList",
          path: "/DSAKeyList",
          component: DSAKeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["密钥管理", "DSA密钥管理"]
          }
        },
        {
          name: "SM9ParentKeyList",
          path: "/SM9ParentKeyList",
          component: SM9ParentKeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["密钥管理", "SM9主密钥管理"]
          }
        },
        {
          name: "SM9ChildKeyList",
          path: "/SM9ChildKeyList",
          component: SM9ChildKeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["密钥管理", "SM9子密钥管理"]
          }
        },
        {
          name: "ServiceList",
          path: "/ServiceList",
          component: ServiceList,
          meta: {
            keepalive: true,
            breadcrumb: ["服务管理", "服务配置管理"]
          }
        },
        {
          name: "keyLogo",
          path: "/keyLogo",
          component: keyLogo
          // meta: {
          //   keepalive: true,
          //   breadcrumb: ["服务管理", "服务配置管理"]
          // }
        },
        {
          name: "selfInspectionList",
          path: "/selfInspectionList",
          component: selfInspectionList,
          meta: {
            keepalive: true,
            breadcrumb: ["设备管理", "设备自检"]
          }
        },
        {
          name: "selfUpList",
          path: "/selfUpList",
          component: selfUpList,
          meta: {
            keepalive: true,
            breadcrumb: ["设备管理", "系统升级"]
          }
        },
        {
          name: "userLoginList",
          path: "/userLoginList",
          component: userLoginList,
          meta: {
            keepalive: true,
            breadcrumb: ["设备管理", "设备权限信息"]
          }
        },
        {
          name: "modifyPINList",
          path: "/modifyPINList",
          component: modifyPINList,
          meta: {
            keepalive: true,
            breadcrumb: ["设备权限信息", "修改PIN"]
          }
        },
        {
          name: "copyKeyList",
          path: "/copyKeyList",
          component: copyKeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["密钥管理", "备份密钥数据"]
          }
        },
        {
          name: "recoveryKeyList",
          path: "/recoveryKeyList",
          component: recoveryKeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["密钥管理", "恢复密钥数据"]
          }
        },
        {
          name: "whiteMenuList",
          path: "/whiteMenuList",
          component: whiteMenuList,
          meta: {
            keepalive: true,
            breadcrumb: ["网络管理", "白名单"]
          }
        },
        {
          name: "serviceStatusList",
          path: "/serviceStatusList",
          component: serviceStatusList,
          meta: {
            keepalive: true,
            breadcrumb: ["服务管理", "服务状态"]
          }
        },
        {
          name: "svsStatusList",
          path: "/svsStatusList",
          component: svsStatusList,
          meta: {
            keepalive: true,
            breadcrumb: ["服务管理", "服务状态"]
          }
        },

        {
          name: "timeSourceList",
          path: "/timeSourceList",
          component: timeSourceList,
          meta: {
            keepalive: true,
            breadcrumb: ["网络管理", "时间源"]
          }
        },
        {
          name: "syncLogList",
          path: "/syncLogList",
          component: syncLogList,
          meta: {
            keepalive: true,
            breadcrumb: ["日志管理", "时间同步日志"]
          }
        },
        {
          name: "jobLogList",
          path: "/jobLogList",
          component: jobLogList,
          meta: {
            keepalive: true,
            breadcrumb: ["日志管理", "任务调度日志"]
          }
        },
        {
          name: "dataDictionaryList",
          path: "/dataDictionaryList",
          component: dataDictionaryList,
          meta: {
            keepalive: true,
            breadcrumb: ["系统管理", "数据字典"]
          }
        },
        {
          name: "dataDictionaryDetail",
          path: "/dataDictionaryDetail",
          component: dataDictionaryDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["系统管理", "数据字典详情"]
          }
        },
        {
          name: "scheduledTaskList",
          path: "/scheduledTaskList",
          component: scheduledTaskList,
          meta: {
            keepalive: true,
            breadcrumb: ["系统管理", "定时任务"]
          }
        },
        {
          name: "scheduledTaskDetail",
          path: "/scheduledTaskDetail",
          component: scheduledTaskDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["系统管理", "定时任务详情"]
          }
        },
        {
          name: "machineList",
          path: "/machineList",
          component: machineList,
          meta: {
            keepalive: true,
            breadcrumb: ["系统管理", "初始化一体机"]
          }
        },
        {
          name: "systemResourceList",
          path: "/systemResourceList",
          component: systemResourceList,
          meta: {
            keepalive: true,
            breadcrumb: ["系统资源"]
          }
        },
        {
          name: "addSystemResource",
          path: "/addSystemResource",
          component: addSystemResource,
          meta: {
            keepalive: true,
            breadcrumb: ["新增资源"]
          }
        },
        {
          name: "machineDetail",
          path: "/machineDetail",
          component: machineDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["系统管理", "初始化一体机详情"]
          }
        },
        {
          name: "issuanceList",
          path: "/issuanceList",
          component: issuanceList,
          meta: {
            keepalive: true,
            breadcrumb: ["根证书管理", "证书颁发机构"]
          }
        },
        {
          name: "issuanceDetail",
          path: "/issuanceDetail",
          component: issuanceDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["根证书管理", "证书颁发机构详情"]
          }
        },
        {
          name: "configCRL",
          path: "/configCRL",
          component: configCRL,
          meta: {
            keepalive: true,
            breadcrumb: ["CRL配置"]
          }
        },
        {
          name: "verificationList",
          path: "/verificationList",
          component: verificationList,
          meta: {
            keepalive: true,
            breadcrumb: ["签名验签管理", "签名验签服务"]
          }
        },
        {
          name: "managementList",
          path: "/managementList",
          component: managementList,
          meta: {
            keepalive: true,
            breadcrumb: ["应用管理", "应用管理"]
          }
        },
        {
          name: "managementDetail",
          path: "/managementDetail",
          component: managementDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["应用管理", "应用管理详情"]
          }
        },
        {
          name: "applicationCertList",
          path: "/applicationCertList",
          component: applicationCertList,
          meta: {
            keepalive: true,
            breadcrumb: ["应用证书列表"]
          }
        },
        {
          name: "applicationCertDetail",
          path: "/applicationCertDetail",
          component: applicationCertDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["应用证书列表", "应用证书详情"]
          }
        }, {
          name: "applicationCertExtList",
          path: "/applicationCertExtList",
          component: applicationCertExtList,
          meta: {
            keepalive: true,
            breadcrumb: ["外部证书列表"]
          }
        },
        {
          name: "applicationCertExtDetail",
          path: "/applicationCertExtDetail",
          component: applicationCertExtDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["外部证书列表", "外部证书管理详情"]
          }
        },
        {
          name: "explainList",
          path: "/explainList",
          component: explainList,
          meta: {
            keepalive: true,
            breadcrumb: ["平台说明"]
          }
        },
        {
          name: "CAInitList",
          path: "/CAInitList",
          component: CAInitList,
          meta: {
            keepalive: true,
            breadcrumb: ["初始化管理", "根证书初始化"]
          }
        },
        {
          name: "certTemplateList",
          path: "/certTemplateList",
          component: certTemplateList,
          meta: {
            keepalive: true,
            breadcrumb: ["初始化管理", "证书模板"]
          }
        },
        {
          name: "adminCertList",
          path: "/adminCertList",
          component: adminCertList,
          meta: {
            keepalive: true,
            breadcrumb: ["初始化管理", "超级管理员证书"]
          }
        },
        {
          name: "auditAdminList",
          path: "/auditAdminList",
          component: auditAdminList,
          meta: {
            keepalive: true,
            breadcrumb: ["初始化管理", "审计管理员证书"]
          }
        },
        {
          name: "initList",
          path: "/initList",
          component: initList
          // meta: {
          //   keepalive: true,
          //   breadcrumb: ["初始化管理", "审计管理员证书"]
          // }
        },
        {
          name: "CaCertList",
          path: "/CaCertList",
          component: CaCertList,
          meta: {
            keepalive: true,
            breadcrumb: ["业务管理", "证书管理"]
          }
        },
        {
          name: "CaCertDetail",
          path: "/CaCertDetail",
          component: CaCertDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["业务管理", "证书管理详情"]
          }
        },
        {
          name: "CrlList",
          path: "/CrlList",
          component: CrlList,
          meta: {
            keepalive: true,
            breadcrumb: ["业务管理", "CRL管理"]
          }
        },
        {
          name: "CrlDetail",
          path: "/CrlDetail",
          component: CrlDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["业务管理", "CRL管理详情"]
          }
        },
        {
          name: "AdminList",
          path: "/AdminList",
          component: AdminList,
          meta: {
            keepalive: true,
            breadcrumb: ["管理员管理", "管理员"]
          }
        },
        {
          name: "AdminDetail",
          path: "/AdminDetail",
          component: AdminDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["管理员管理", "管理员详情"]
          }
        },
        {
          name: "systemCfgList",
          path: "/systemCfgList",
          component: systemCfgList,
          meta: {
            keepalive: true,
            breadcrumb: ["安全管理", "系统配置"]
          }
        },
        {
          name: "RootCertList",
          path: "/RootCertList",
          component: RootCertList,
          meta: {
            keepalive: true,
            breadcrumb: ["安全管理", "根证书管理"]
          }
        },
        {
          name: "RootCertDetail",
          path: "/RootCertDetail",
          component: RootCertDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["安全管理", "根证书管理详情"]
          }
        },
        {
          name: "RequestorList",
          path: "/RequestorList",
          component: RequestorList,
          meta: {
            keepalive: true,
            breadcrumb: ["管理员管理", "请求者"]
          }
        },
        {
          name: "RequestorDetail",
          path: "/RequestorDetail",
          component: RequestorDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["管理员管理", "请求者详情"]
          }
        },
        {
          name: "PublisherList",
          path: "/PublisherList",
          component: PublisherList,
          meta: {
            keepalive: true,
            breadcrumb: ["发布管理", "发布者"]
          }
        },
        {
          name: "PublisherDetail",
          path: "/PublisherDetail",
          component: PublisherDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["发布管理", "发布者详情"]
          }
        },
        {
          name: "CustomTemList",
          path: "/CustomTemList",
          component: CustomTemList,
          meta: {
            keepalive: true,
            breadcrumb: ["模板管理", "模板扩展项"]
          }
        },
        {
          name: "CustomTemDetail",
          path: "/CustomTemDetail",
          component: CustomTemDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["模板管理", "模板扩展项详情"]
          }
        },
        {
          name: "TemManagementList",
          path: "/TemManagementList",
          component: TemManagementList,
          meta: {
            keepalive: true,
            breadcrumb: ["模板管理", "证书模板"]
          }
        },
        {
          name: "TemManagementDetail",
          path: "/TemManagementDetail",
          component: TemManagementDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["模板管理", "证书模板详情"]
          }
        },
        {
          name: "userManagementList",
          path: "/userManagementList",
          component: userManagementList,
          meta: {
            keepalive: true,
            breadcrumb: ["用户管理", "用户管理"]
          }
        },
        {
          name: "userManagementDetail",
          path: "/userManagementDetail",
          component: userManagementDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["用户管理", "用户管理详情"]
          }
        },
        ,
        {
          name: "userCertificateList",
          path: "/userCertificateList",
          component: userCertificateList,
          meta: {
            keepalive: true,
            breadcrumb: ["用户管理", "用户证书管理"]
          }
        },
        {
          name: "userCertificateDetail",
          path: "/userCertificateDetail",
          component: userCertificateDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["用户管理", "用户证书管理详情"]
          }
        },
        {
          name: "SignerList",
          path: "/SignerList",
          component: SignerList,
          meta: {
            keepalive: true,
            breadcrumb: ["根证书管理", "签名者"]
          }
        },
        {
          name: "SignerDetail",
          path: "/SignerDetail",
          component: SignerDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["根证书管理", "签名者详情"]
          }
        },
        {
          name: "CARootCertList",
          path: "/CARootCertList",
          component: CARootCertList,
          meta: {
            keepalive: true,
            breadcrumb: ["根证书管理", "CA根证书"]
          }
        },
        {
          name: "CARootCertDetail",
          path: "/CARootCertDetail",
          component: CARootCertDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["根证书管理", "CA根证书详情"]
          }
        },
        {
          name: "BusinessAdminList",
          path: "/BusinessAdminList",
          component: BusinessAdminList,
          meta: {
            keepalive: true,
            breadcrumb: ["人员管理", "业务管理员"]
          }
        },

        {
          name: "AuditOperationList",
          path: "/AuditOperationList",
          component: AuditOperationList,
          meta: {
            keepalive: true,
            breadcrumb: ["人员管理", "审计操作员"]
          }
        },

        {
          name: "BusinessOperationList",
          path: "/BusinessOperationList",
          component: BusinessOperationList,
          meta: {
            keepalive: true,
            breadcrumb: ["人员管理", "业务操作员"]
          }
        },

        {
          name: "JudicialAdminList",
          path: "/JudicialAdminList",
          component: JudicialAdminList,
          meta: {
            keepalive: true,
            breadcrumb: ["人员管理", "司法取证员"]
          }
        },
        {
          name: "JudicialAdminDetail",
          path: "/JudicialAdminDetail",
          component: JudicialAdminDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["人员管理", "司法取证员详情"]
          }
        },
        {
          name: "ExportCertList",
          path: "/ExportCertList",
          component: ExportCertList,
          meta: {
            keepalive: true,
            breadcrumb: ["司法取证", "导出证书"]
          }
        },
        {
          name: "ExportCertDetail",
          path: "/ExportCertDetail",
          component: ExportCertDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["司法取证", "导出证书详情"]
          }
        },
        {
          name: "ExportLogin",
          path: "/ExportLogin",
          component: ExportLogin
        },
        {
          name: "ExportKeyList",
          path: "/ExportKeyList",
          component: ExportKeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["司法取证", "导出密钥"]
          }
        },
        {
          name: "CertSM2KeyList",
          path: "/CertSM2KeyList",
          component: CertSM2KeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["外部密钥管理", "SM2密钥管理"]
          }
        },
        {
          name: "CertRSAKeyList",
          path: "/CertRSAKeyList",
          component: CertRSAKeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["外部密钥管理", "RSA密钥管理"]
          }
        },
        {
          name: "CertKEKKeyList",
          path: "/CertKEKKeyList",
          component: CertKEKKeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["外部密钥管理", "对称密钥管理"]
          }
        },
        {
          name: "CertRecoveryKeyList",
          path: "/CertRecoveryKeyList",
          component: CertRecoveryKeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["外部密钥管理", "恢复密钥数据"]
          }
        },
        {
          name: "CertCopyKeyList",
          path: "/CertCopyKeyList",
          component: CertCopyKeyList,
          meta: {
            keepalive: true,
            breadcrumb: ["外部密钥管理", "备份密钥数据"]
          }
        },
        {
          name: "CASelfList",
          path: "/CASelfList",
          component: CASelfList,
          meta: {
            keepalive: true,
            breadcrumb: ["服务管理", "系统自检"]
          }
        },
        {
          name: "RAAdminList",
          path: "/RAAdminList",
          component: RAAdminList,
          meta: {
            keepalive: true,
            breadcrumb: ["服务管理", "RA管理"]
          }
        },
        {
          name: "PinList",
          path: "/PinList",
          component: PinList
        },
        {
          name: "IssueCert",
          path: "/IssueCert",
          component: IssueCert,
          meta: {
            keepalive: true,
            breadcrumb: ["业务管理", "证书管理详情"]
          }
        },
        ,
        {
          name: "KMList",
          path: "/KMList",
          component: KMList,
          meta: {
            keepalive: true,
            breadcrumb: ["服务管理", "KM接入"]
          }
        },
        {
          name: "KMDetail",
          path: "/KMDetail",
          component: KMDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["服务管理", "KM接入详情"]
          }
        },
        {
          name: "AuthorizaList",
          path: "/AuthorizaList",
          component: AuthorizaList,
          meta: {
            keepalive: true,
            breadcrumb: ["服务管理", "授权"]
          }
        },
        {
          name: "AuthorizaDetail",
          path: "/AuthorizaDetail",
          component: AuthorizaDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["服务管理", "授权详情"]
          }
        },
        {
          name: "DownUploadFile",
          path: "/DownUploadFile",
          component: DownUploadFile,
          meta: {
            keepalive: true,
            breadcrumb: ["服务管理", "生成授权文件"]
          }
        },
        {
          name: "CertReviewList",
          path: "/CertReviewList",
          component: CertReviewList,
          meta: {
            keepalive: true,
            breadcrumb: ["业务管理", "证书审核"]
          }
        },
        {
          name: "CertReviewDetail",
          path: "/CertReviewDetail",
          component: CertReviewDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["业务管理", "证书审核详情"]
          }
        },
        {
          name: "CertRequestList",
          path: "/CertRequestList",
          component: CertRequestList,
          meta: {
            keepalive: true,
            breadcrumb: ["业务管理", "证书申请"]
          }
        },
        {
          name: "CertRequestDetail",
          path: "/CertRequestDetail",
          component: CertRequestDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["业务管理", "证书申请详情"]
          }
        },
        {
          name: "RABusinessAdminList",
          path: "/RABusinessAdminList",
          component: RABusinessAdminList,
          meta: {
            keepalive: true,
            breadcrumb: ["人员管理", "RA业务管理员"]
          }
        },
        {
          name: "RASafetyAuditorList",
          path: "/RASafetyAuditorList",
          component: RASafetyAuditorList,
          meta: {
            keepalive: true,
            breadcrumb: ["人员管理", "RA安全审计员"]
          }
        },
        {
          name: "RARegisteredSalesmanList",
          path: "/RARegisteredSalesmanList",
          component: RARegisteredSalesmanList,
          meta: {
            keepalive: true,
            breadcrumb: ["人员管理", "RA注册业务员"]
          }
        },
        {
          name: "RAApproverList",
          path: "/RAApproverList",
          component: RAApproverList,
          meta: {
            keepalive: true,
            breadcrumb: ["人员管理", "RA审核业务员"]
          }
        },
        {
          name: "OcspList",
          path: "/OcspList",
          component: OcspList,
          meta: {
            keepalive: true,
            breadcrumb: ["发布管理", "OCSP管理"]
          }
        },
        {
          name: "LdapList",
          path: "/LdapList",
          component: LdapList,
          meta: {
            keepalive: true,
            breadcrumb: ["发布管理", "LDAP管理"]
          }
        },
        {
          name: "KeyGuiDangList",
          path: "/KeyGuiDangList",
          component: KeyGuiDangList,
          meta: {
            keepalive: true,
            breadcrumb: ["密钥管理", "密钥归档"]
          }
        },
        {
          name: "KeyShenJiList",
          path: "/KeyShenJiList",
          component: KeyShenJiList,
          meta: {
            keepalive: true,
            breadcrumb: ["密钥管理", "密钥审计"]
          }
        },
        {
          name: "sysRoleList",
          path: "/sysRoleList",
          component: sysRoleList,
          meta: {
            keepalive: true,
            breadcrumb: ["用户管理", "系统角色预置"]
          }
        },
        {
          name: "sysRoleDetail",
          path: "/sysRoleDetail",
          component: sysRoleDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["发布管理", "系统角色预置详情"]
          }
        },
        {
          name: "commonAdminList",
          path: "/commonAdminList",
          component: commonAdminList
        },
        {
          name: "commonAdminDetail",
          path: "/commonAdminDetail",
          component: commonAdminDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["人员管理", "用户详情"]
          }
        },
        {
          name: "CADeviceCertList",
          path: "/CADeviceCertList",
          component: CADeviceCertList,
          meta: {
            keepalive: true,
            breadcrumb: ["设备证书", "设备证书详情"]
          }
        },
        {
          name: "CADeviceCertDetail",
          path: "/CADeviceCertDetail",
          component: CADeviceCertDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["设备证书", "设备证书详情"]
          }
        },
        {
          name: "hsmserverStatisticsList",
          path: "/hsmserverStatisticsList",
          component: hsmserverStatisticsList,
          meta: {
            keepalive: true,
            breadcrumb: ["hsm统计"]
          }
        },
        {
          name: "deviceCertList",
          path: "/deviceCertList",
          component: deviceCertList,
          meta: {
            keepalive: true,
            breadcrumb: ["设备证书列表"]
          }
        },
        {
          name: "clientCertList",
          path: "/clientCertList",
          component: clientCertList,
          meta: {
            keepalive: true,
            breadcrumb: ["客户端证书列表"]
          }
        },
        {
          name: "clientCertDetail",
          path: "/clientCertDetail",
          component: clientCertDetail,
          meta: {
            keepalive: true,
            breadcrumb: ["客户端证书详情"]
          }
        },
        {
          name: "deviceInfoList",
          path: "/deviceInfoList",
          component: deviceInfoList,
          meta: {
            keepalive: true,
            breadcrumb: ["设备信息列表"]
          }
        }
      ]
    }
  ]
});
export default router;
//router.afterEach(async (to, from, next) => {
//   if (window.sessionStorage.getItem("webTitle") == null) {
//     window.document.title = "";
//   } else {
//     window.document.title = window.sessionStorage.getItem("webTitle");
//   }
//   window.document.title = window.sessionStorage.getItem("webTitle");
//});
// import Vuex from 'vuex'

// Vue.use(Vuex)

// const store = new Vuex.Store({
//     state: {

//     },
//     mutations: {

//     }
// })
