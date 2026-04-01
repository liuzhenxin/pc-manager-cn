// let URL = "http://10.10.11.99:8080/stage-api/"; //本地地址
// let URL = "http://10.10.11.30:8080/"; //本地地址
// let URL = "http://10.10.10.99:8000/stage-api/"; //本地地
//let URL = "http://10.10.10.200:8000/stage-api/"; //本地地址

//let URL = "http://10.10.10.136:8000/stage-api/"; //本地地址
//let URL = "https://10.10.10.136/stage-api/"; //本地地址
//let URL1 = "http://10.10.11.112:8111/"; //本地地址
// let URL = "http://10.10.11.28:8000/stage-api/";
// let URL = "http://10.10.10.74:8000/stage-api/";
// let URL = "https://10.10.10.61/stage-api/";

let URL = "stage-api/"; //本地地址

export default {
  ImageURL: URL,
  GetImageCode: URL + "code", // 获取验证码
  GetLogin: URL + "auth/login/username", // 获取验证码
  GetRoute: URL + "auth/route", // 获取路由菜单
  GetCertSnLoginc: URL + "auth/login/cert_sn", // 证书登录
  GetAioSteps: URL + "system/three_type/getAioSteps", // 获取初始化进程
  GetAioStep: URL + "system/init/aioStep", // 获取初始化进程
  AioServiceExist: URL + "system/init/aioServiceExist", // 获取一体机子服务
  GetInitAddUser: URL + "system/init/createUser", // 初始化添加用户
  InitDelOne: URL + "system/init/deleteUser", // 初始化删除用户
  InitGetById: URL + "system/init/getUserByOrgId", // 初始化获取用户列表
  InitUserAuth: URL + "system/init/initUserAuth", // 初始化权限
  InitGetAllByOrgId: URL + "system/init/getInitInfo", // 初始化详情
  SetAioSteps: URL + "system/three_type/setAioSteps", // 初始化状态值为3
  SetAioStep: URL + "system/init/setAioStep", // CA设置成8
  CheckCertBySN: URL + "system/three_type/checkCertBySN", // 检查证书是否与key重复

  GwLicenceTime: URL + "gw_licence_time", // 是否有许可证
  GwDeviceGet: URL + "gw_device_get", // 获取mac列表
  GwSNGet: URL + "gw_sn_get", // 获取服务器序列号
  GwLicenceImport: URL + "gw_licence_import", // 上传许可证
  GetRoles: URL + "system/init/getRolesAll", // 初始化获取角色
  PopUser: URL + "system/init/popUser", // 初始化判断用户是否够用
  // 用户
  GetUserList: URL + "system/user/list", // 获取用户列表
  GetAddUserList: URL + "system/user/add", // 新增用户列表
  GetUserDetail: URL + "system/user/getById", // 获取详情
  GetUserModify: URL + "system/user/upd", // 修改用户
  GetdelUser: URL + "system/user/delOne", // 删除用户
  GetUserResetPass: URL + "system/user/resetPass", // 重置密码
  GetbindOrganization: URL + "system/user/bindOrganization", // 绑定组织机构
  GetUnbindOrganization: URL + "system/user/unbindOrganization", // 解绑组织机构
  GetUserIdRole: URL + "system/userRole/getUserSystemType", // 通过用户id查询角色
  GetUserBindRole: URL + "system/userRole/bind", // 通过用户id绑定角色
  UpdatePassword: URL + "system/user/updPassword", // 修改密码
  AddUserByRoleOrg: URL + "system/user/addByRoleOrg", // 新增带组织机构
  GetUserByRoleOrgList: URL + "system/user/listByRoleOrg", // 获取列表 带组织机构
  GetByUserRoleId: URL + "system/user/getByUserRoleId", // 获取详情
  RoleUnbind: URL + "system/userRole/unbind", // 用户解绑角色
  GetUserRoleList: URL + "system/userRole/vlist", // 人员角色列表

  // 角色

  GetRolesList: URL + "system/role/vList", // 获取角色列表
  GetAddRolesList: URL + "system/role/add", // 新增角色列表
  GetRolesDetail: URL + "system/role/getById", // 获取角色详情
  GetRolesModify: URL + "system/role/upd", // 修改角色
  GetdelRoles: URL + "system/role/delOne", // 删除角色
  GetBindMenus: URL + "system/role/bindMenus", // 菜单绑定

  // 角色预置
  GetRolesPresetList: URL + "system/rolePreset/list", // 获取角色列表
  AddRolesPresetList: URL + "system/rolePreset/add", // 新增角色列表
  RolesPresetDetail: URL + "system/rolePreset/getById", // 获取角色详情
  RolesPresetModify: URL + "system/rolePreset/upd", // 修改角色
  DelRolesPreset: URL + "system/rolePreset/delOne", // 删除角色
  RolesPresetBindMenus: URL + "system/rolePreset/bindMenus", // 菜单绑定

  // 参数配置
  GetParamsList: URL + "system/parameter/list", // 获取角色列表
  GetAddParamsList: URL + "system/parameter/add", // 新增角色列表
  GetParamsDetail: URL + "system/parameter/getById", // 获取角色详情
  GetParamsModify: URL + "system/parameter/upd", // 修改角色
  GetdelParams: URL + "system/parameter/delOne", // 删除角色
  GetByCode: URL + "system/parameter/getByCode", // 查询首页配置

  // 操作日志
  GetOperationList: URL + "system/operationLog/vList", // 获取操作日志列表
  GetOperationDetail: URL + "system/operationLog/getById", // 获取操作日志详情
  GetUpdateOperation: URL + "system/operationLog/audit", // 审计
  OperationLogdelOne: URL + "system/operationLog/delOne", // 删除日志
  OperationLogExport: URL + "system/operationLog/export", // 日志导出

  // 菜单
  GetmenuList: URL + "system/menu/list", // 获取菜单列表
  GetMenuTreeList: URL + "system/menu/allTree", // 获取菜单树形结构
  GetmenuDetail: URL + "system/menu/getById", // 获取菜单详情
  GetAddMenuList: URL + "system/menu/add", // 新增菜单列表
  GetMenuModify: URL + "system/menu/upd", // 修改菜单
  GetdelMenu: URL + "system/menu/delOne", // 删除菜单
  GetTreeByRoleId: URL + "system/menu/getTreeByRoleId", //  查询权限

  //系统资源
  ResourceList: URL + "system/resource/list", // 资源列表
  ResourceDelOne: URL + "system/resource/delOne", // 资源删除
  ResourceAdd: URL + "system/resource/add", // 资源添加
  ResourceGetById: URL + "system/resource/getById", // 根据id资源
  ResourceUpd: URL + "system/resource/upd", // 资源修改
  ResourceGetByCode: URL + "system/direct/resource/getByCode", // 获取资源

  // 组织机构
  GetOrganizationList: URL + "system/organization/treeAll", // 获取组织机构列表
  GetOrganizationTreeList: URL + "system/organization/allTree", // 获取组织机构树形结构
  GetOrganizationDetail: URL + "system/organization/getById", // 获取组织机构详情
  GetAddOrganizationList: URL + "system/organization/add", // 新增组织机构列表
  GetOrganizationModify: URL + "system/organization/upd", // 修改组织机构
  GetdelOrganization: URL + "system/organization/delOne", // 删除组织机构
  AddOrg: URL + "system/init/addOrg", // 初始化添加组织机构
  GetOrg: URL + "system/init/getOrgFirst", // 获取初始化第一个组织机构
  //   GetOrg: URL + "system/init/getOrg", // 获取初始化第一个组织机构
  // 证书
  GetCertList: URL + "system/userCert/vList", // 查询证书列表
  //   GetCertList: URL + "system/user/list", // 获取证书列表
  GetCheckCert: URL + "system/three_type/checkCert", // 证书查重
  GetByCert: URL + "system/userCert/getBySerialNumber", // 证书详情
  BindCertByUserId: URL + "system/userCert/bind", // 通过用户绑定证书
  GetByUserId: URL + "system/userCert/getByUserId", // 通过用户id查证书
  UnbindById: URL + "system/userCert/unbindById", // 通过用户解绑证书

  // 密码卡
  deviceSelfTest: URL + "hsm/card/testDeviceSelf", // 设备自检
  DeviceFactoryReset: URL + "hsm/card/initialization", // 密码卡恢复出厂设置
  HsmGetUserinfo: URL + "hsm/card/hsmGetUserinfo", // 获取密码卡内管理员权限状态
  DeviceConfGet: URL + "hsm/card/getDeviceConf", // 获取设备配置信息
  GetDeviceStatus: URL + "hsm/card/getDeviceStatus", // 获取设备状态 (未用)

  //密码用户
  GetEnumUser: URL + "hsm/user/enumUser", // 枚举设备信息
  AddUser: URL + "hsm/user/addUser", //添加用户
  LoginUser: URL + "hsm/user/loginUser", //登录用户
  LogoutUser: URL + "hsm/user/logoutUser", // 登出用户
  DelUser: URL + "hsm/user/delUser", // 删除用户
  SetUserPIN: URL + "hsm/user/setUserPIN", // 设置用户口令

  //密码服务
  //IsServerInit: URL + "hsm/hsmServer/isServerInit", // 初始化状态
  //InitFile: URL + "hsm/hsmServer/initFile", // 密码卡文件系统初始化
  //InitDevice: URL + "hsm/hsmServer/initDevice", // 密码卡初始化
  IsServerOpen: URL + "hsm/server/isServerOpen", // 服务是否正常查询
  ServerInit: URL + "hsm/server/serverInit", // 初始化设备的进程状态 (未用)
  ServerGetinfo: URL + "hsm/server/getConfig", // 获取服务状态设置与状态
  ServerRestart: URL + "hsm/server/restart", //密码机重启服务
  ServerStart: URL + "hsm/server/start", // 密码机开启服务
  ServerStop: URL + "hsm/server/stop", // 密码机停止服务
  FilesImport: URL + "hsm/server/import", // 文件上传
  FilesExport: URL + "hsm/server/export", // 文件下载

  //设备证书
  GetDeviceCertByType: URL + "hsm/deviceCert/getByCertType", // 获取详情
  SignIssueDeviceRoot: URL + "hsm/deviceCert/signIssueRoot", // 签发自签根设备证书
  SignIssueDevice: URL + "hsm/deviceCert/signIssueDevice", // 签发设备证书
  ExportCertDevice: URL + "hsm/deviceCert/exportCert", // 下载设备证书

  ClientDeviceCertList: URL + "hsm/clientDeviceCert/list", // 客户端设备证书列表
  ClientDevCertGetDetail: URL + "hsm/clientDeviceCert/getById", // 通过ID查询
  ImportClientDevCert: URL + "hsm/clientDeviceCert/importCert", // 导入证书文件
  ClientDevCertDelete: URL + "hsm/clientDeviceCert/deleteById", // 通过ID删除
  ExportClientCert: URL + "hsm/clientDeviceCert/exportCert", // 下载客户端证书

  DeviceInfoList: URL + "hsmlink/deviceInfo/all", // 设备信息列表
  UpdDeviceInfo: URL + "hsmlink/deviceInfo/upd", // 修改设备信息
  AddDeviceInfo: URL + "hsmlink/deviceInfo/add", // 添加设备信息
  DelDeviceInfo: URL + "hsmlink/deviceInfo/deleteById", // 删除设备信息
  GetDeviceInfoByCode: URL + "hsmlink/deviceInfo/getByCode", // 获取设备信息

  //密钥管理
  //GetKeyState: URL + "hsm/key/getKEKKeyState", // 获取内部密钥状态
  //GetSM2KeyState: URL + "hsm/key/getSM2KeyState", // 获取SM2
  //GetRSAKeyState: URL + "hsm//key/getRSAKeyState", // 获取RSA
  GetKeyStateByType: URL + "hsm/key/getKeyStateByType", // 获取内部密钥状态
  GetKeyStateByDevType: URL + "hsm/key/getKeyStateByDevType", // 获取dev密钥状态
  //GenerateECCKeyPair: URL + "hsm/key/generateECCKeyPair", // 生成SM2
  //GenerateRsaPair: URL + "hsm/key/generateRsaPair", // 生成RSA
  //GenerateKEKKey: URL + "hsm/key/generateKEKKey", // 生成对称密钥
  GenerateKeyByType: URL + "hsm/key/generateKeyPairByType", // 生成密钥
  DelUserKey: URL + "hsm/key/delUserKey", // 删除密钥
  RestoryKey: URL + "hsm/key/restoryKey", // 恢复密钥
  RestoryKeyFile: URL + "hsm/key/restoryKeyFile", // 恢复内部密钥(文件)
  BackKey: URL + "hsm/key/backKey", // 备份密钥
  //SetShare: URL + "hsm/key/writeShare", // ukeyPIN口令
  //GetShare: URL + "hsm/key/readShare", // 获取ukeyPIN口令
  GetShares: URL + "hsm/key/getShares", // 获取已读取的分片数据
  WriteShare: URL + "hsm/key/writeshare",//分发密钥分片
  readShare: URL+ "hsm/key/readshare",// 获取ukeyPIN口令
  SvsBackKey: URL + "hsm/key/backKeyLiuzx", // 备份密钥
  SvsRestoryKey: URL+ "hsm/key/SvsrestoryKey", //恢复密钥

  SetUserPriKeyPIN: URL + "hsm/key/setUserKeyPIN", // 设置私钥访问控制码
  HsmGetLastBackupTime: URL + "hsm/key/lastKeyBackupTime", // 上次备份时间
  EncKeyRequest: URL + "hsm/key/encKeyRequest", // 加密密钥请求
  EncKeyGenerate: URL + "hsm/key/encKeyGenerate", // 加密密钥生成
  EncKeyImport: URL + "hsm/key/encKeyImport", // 加密密钥导入
  ExportECCPublicKey: URL + "hsm/key/exportECCPublicKey", // 导出ECC公钥
  ExportRSAPublicKey: URL + "hsm/key/exportRSAPublicKey", // 导出RSA公钥
  GenerateDevKey: URL + "hsm/key/generateDevKeyPair_ECC", // 生成设备密钥

  //扩展密钥
  DelECDSAKey: URL + "hsm/key/deleteKey_ECC_ECDSA", // 删除ECD密钥
  DelEDDSAKey: URL + "hsm/key/deleteKey_ECC_EDDSA", // 删除EDD密钥
  // DelSM9Key: URL + "hsm/key/deleteInternalKeyPair_SM9", // 删除SM9密钥
  DelMasterSM9Key: URL + "hsm/key/deleteMasterKeyPair_SM9", // 删除SM9主密钥
  DelUserSM9Key: URL + "hsm/key/deleteUserKeyPair_SM9", // 删除SM9用户密钥
  GetSM9MasterKeyState: URL + "hsm/key/getkeyState_SM9_MasterByType", // 获取SM9主密钥列表
  GetSM9UserKeyState: URL + "hsm/key/getkeyState_SM9_UserByType", // 获取SM9用户密钥列表
  GenerateSM9UserKeyPair: URL + "hsm/key/generateSM9UserKeyPair", // 批量生成SM9用户子密钥
  DelDSAKey: URL + "hsm/key/deleteKey_ECC_DSA", // 删除DSA密钥

  //hsmserver统计
  HSMServerFailure: URL + "hsm/serverCount/hsmserverFailure", // 首页用hsmserver是否故障
  HSMServerList: URL + "hsm/serverCount/list", // 列表
  HSMServerExport: URL + "hsm/serverCount/export", // 导出

  // 过销售许可用
  HSMListDangAn: URL + "hsm/hsmServer/listDangAn", // 获取档案
  HSMListShenJi: URL + "hsm/hsmServer/listShenJi", // 获取审计
  HSMUpdShenJi: URL + "hsm/hsmServer/updShenJi", // 修改审计
  HSMExportFileKey: URL + "hsm/hsmServer/exportFileKey", // 导出密钥
  HSMImportFileKey: URL + "hsm/hsmServer/importFileKey", // 导入密钥

  // 密码机初始化
  HSMInitAddUser: URL + "hsm/init/addUser", // 添加用户
  HSMInitDelUser: URL + "hsm/init/delUser", // 删除用户
  HSMInitLoginUser: URL + "hsm/init/loginUser", // 登录用户
  HSMInitLogoutUser: URL + "hsm/init/logoutUser", // 登出用户
  HSMInitDeviceConfGet: URL + "hsm/init/getDeviceConf", // 获取设备配置信息
  //HSMInitDeviceSelfTest: URL + "hsm/init/deviceSelfTest", // 设备自检
  HSMInitDeviceFactoryReset: URL + "hsm/init/initialization", // 密码卡恢复出厂设置
  HSMInitEnumUser: URL + "hsm/init/enumUser",
  //HSMInitGenerateECCKeyPair: URL + "hsm/init/generateECCKeyPair", // 生成内部SM2密钥
  //HSMInitGenerateRsaPair: URL + "hsm/init/generateRsaPair", // 生成内部RSA密钥
  //HSMInitGenerateKEKKey: URL + "hsm/init/generateKEKKey", // 生成KEK对称密钥
  HSMInitGenerateKeyByType: URL + "hsm/init/generateKeyPairByType", // 生成密钥
  HSMInitGetDeviceStatus: URL + "hsm/init/getDeviceStatus", // 获取设备状态
  //HSMInitHsmGetUserinfo: URL + "hsm/init/hsmGetUserinfo", // 获取密码卡内管理员权限状态
  //HSMInitInitDevice: URL + "hsm/init/initDevice", // 密码卡初始化
  //HSMInitInitFile: URL + "hsm/init/initFile", // 密码卡文件系统初始化
  //HSMInitIsServerInit: URL + "hsm/init/isServerInit", // 设备是否初始化完成
  HSMInitIsServerOpen: URL + "hsm/init/isServerOpen", // 服务是否正常查询（未用）
  HSMInitServerInit: URL + "hsm/init/hsmStep", // 设备初始化过程记录
  HSMInitGenerateDevKeyFinish: URL + "hsm/init/generateDevKeyFinish", // 初始化生成DEV密钥完成
  HSMInitSignIssueRootFinish: URL + "hsm/init/signIssueRootFinish", // 初始化签发自签根证书完成
  HSMInitSignIssueDeviceFinish: URL + "hsm/init/signIssueDeviceFinish", // 初始化签发设备证书完成
  HSMInitManagerFinish: URL + "hsm/init/managerFinish", // 完成初始化管理员
  HSMInitOperatorFinish: URL + "hsm/init/operatorFinish", // 完成初始化操作员
  HSMInitFinish: URL + "hsm/init/finish", // 初始化完成
  HSMInitSetUserPriKeyPIN: URL + "hsm/init/setUserPriKeyPIN", // 设置私钥访问控制码（未用）
  //HSMInitVerifySignECC: URL + "hsm/init/verifySignECC", // 登录即时验签
  //HSMInitGetKEKKeyState: URL + "hsm/init/getKEKKeyState", // 获取KEK内部密钥状态
  //HSMInitGetRSAKeyState: URL + "hsm/init/getRSAKeyState", // 获取RSA内部密钥状态
  //HSMInitGetSM2KeyState: URL + "hsm/init/getSM2KeyState", // 获取SM2内部密钥状态
  HSMInitGetKeyStateByType: URL + "hsm/init/getKeyStateByType", // 获取内部密钥状态
  HSMInitGetKeyStateByDevType: URL + "hsm/init/getKeyStateByDevType", // 获取dev密钥状态
  HSMInitGetListByCertType: URL + "hsm/init/getListByCertType", // 通过类型查询证书列表
  HSMInitGenerateDevKey: URL + "hsm/init/generateDevKeyPair_ECC", // 生成设备密钥
  HSMInitSignIssueRoot: URL + "hsm/init/signIssueRoot", // 生成自签根证书
  HSMInitSignIssueDevice: URL + "hsm/init/signIssueDevice", // 生成设备证书
  HSMInitExportDeviceCert: URL + "hsm/init/exportDeviceCert", // 下载设备证书

  InitFinish: URL + "system/init/finish", // 初始化完成

  GetDeviceInfo: URL + "info/serialnumber/get", // 获取序列号

  // 系统
  GetSysTime: URL + "info/so/getSysTime", // 获取系统时间

  // 首页
  GetSystemCpuLoad: URL + "info/monitor/getProcessCpuLoad", // 服务器cpu

  GetPhysicalMemoryData: URL + "info/monitor/getUsedPhysicalMemoryRate", // 内存

  GetDiskData: URL + "info/monitor/getDiskData", // 硬盘
  GetTraffic: URL + "info/monitor/getTraffic", // 网络
  GetMyself: URL + "info/hsm/self", // 获取自检状态

  // 网络诊断
  DiagnoseByPing: URL + "info/ip/diagnoseByPing", // ping诊断
  DiagnoseByTelnet: URL + "info/ip/diagnoseByTelnet", // Telnet诊断
  DiagnoseByTraceroute: URL + "info/ip/diagnoseByTraceroute", // Traceroute诊断
  GetIpByNic: URL + "info/ip/getIpByNic", // 根据网卡名查询
  ModifyIP: URL + "info/ip/modifyIP", // 根据网卡名修改
  ShowNic: URL + "info/ip/showNic", // 网卡列表

  // 时间源
  GetSystemTime: URL + "info/ntp/getSystemTime", // 获取系统时间
  SetSysTime: URL + "info/os/setSysTime", // 修改系统时间
  StartSysNtp: URL + "info/os/startSysNtp", // 开启系统NTP
  GetSysTimeZone: URL + "info/os/getSysTimeZone", // 获取系统时区
  SetSysTimeZone: URL + "info/os/setSysTimeZone", // 设定系统时区
  GetTimeSource: URL + "info/ntp/getTimeSource", // 获取时间源配置
  UpdTimeSource: URL + "info/ntp/updTimeSource", // 修改时间源配置
  GetNtpTime: URL + "info/ntp/getNtpTime", // 获取NTP服务时间
  SyncNtpTime: URL + "info/ntp/syncNtpTime", // 同步NTP服务时间
  SysClose: URL + "info/os/sysClose", // 关机
  SysReboot: URL + "info/os/sysReboot", // 重启
  SysGetSshStatus: URL + "info/os/getSshStatus", // 获取ssh服务状态
  SysStartSsh: URL + "info/os/startSsh", // 启动ssh服务
  SysStopSsh: URL + "info/os/stopSsh", // 启动ssh服务

  //   白名单
  GetAddWhiteList: URL + "system/ipAddress/add", // 添加白名单
  GetIPList: URL + "system/ipAddress/list", // 获取列表
  IPDelOne: URL + "system/ipAddress/delOne", // 删除
  GetUpdList: URL + "system/ipAddress/upd", // 修改
  GetIPById: URL + "system/ipAddress/getById", // 根据id查询
  HsmWriteIn: URL + "system/ipAddress/hsmWriteIn", // 密码机白名单写入文件
  // 服务状态
  ServiceRestart: URL + "info/hsm/restart", // 重启
  ServiceStart: URL + "info/hsm/start", // 开启
  ServiceStop: URL + "info/hsm/stop", // 停止
  SvsStart: URL + "svs/netty/start", // 签名验签开启
  SvsStop: URL + "svs/netty/stop", // 签名验签停止
  IsOpen: URL + "svs/netty/isOpen", // 签名验签是否开启
  GetRestart: URL + "svs/netty/restart", // // 签名验签是否重启(TCP)
  UpdPortTCP: URL + "svs/netty/updPort", // 修改端口(TCP)
  SyncDataBase: URL + "svs/direct/syncDataBase/syncAll", // 同步数据库-同步全部

  OpenPort: URL + "info/ip/openPort", //开启防火墙
  ClosePort: URL + "info/ip/closePort", //关闭防火墙

  //http端口和服务
  GetRestartHttp: URL + "info/aioServer/restart", // // 签名验签是否重启(HTTP)
  UpdPortHTTP: URL + "svs/serve/httpserver/upd", // 修改端口(HTTP)
  CheckPortHTTP: URL + "info/aioServer/checkPort", // 检测端口是否使用(HTTP)

  // 同步时间日志
  GetNtpSyncLoglist: URL + "system/ntpSyncLog/list", // 同步时间日志列表
  GetNtpSyncLogAdd: URL + "system/ntpSyncLog/add", // 添加同步时间日志
  GetNtpSyncLogDelOne: URL + "system/ntpSyncLog/delOne", // 删除同步时间日志
  GetNtpSyncLogById: URL + "system/ntpSyncLog/getById", // 获取同步时间日志详情
  GetNtpSyncLogUpd: URL + "system/ntpSyncLog/upd", // 同步时间日志列表

  // 定时任务
  GetJobList: URL + "job/job/list", // 定时任务列表
  GetJobDelOne: URL + "job/job/delOne", // 删除定时任务
  GetJobById: URL + "job/job/getById", // 获取定时任务详情
  GetJobUpd: URL + "job/job/upd", // 定时任务修改
  GetJobAdd: URL + "job/job/add", // 定时任务新增
  // 任务日志
  GetJobLogList: URL + "job/jobLog/list",
  // 字典项目
  DataAll: URL + "system/dictionaryItem/all", // 同步时间列表
  GetDictionaryItemList: URL + "system/dictionaryItem/list", // 字典项目列表
  GetDictionaryItemDelOne: URL + "system/dictionaryItem/delOne", // 删除字典项目
  GetDictionaryItemById: URL + "system/dictionaryItem/getById", // 获取字典项目详情
  GetDictionaryItemUpd: URL + "system/dictionaryItem/upd", // 字典项目修改
  GetDictionaryItemAdd: URL + "system/dictionaryItem/add", // 字典项目新增

  // 数据字典
  GetDictionaryList: URL + "system/dictionary/list", // 数据字典列表
  GetDictionaryDelOne: URL + "system/dictionary/delOne", // 删除数据字典
  GetDictionaryById: URL + "system/dictionary/getById", // 获取数据字典详情
  GetDictionaryUpd: URL + "system/dictionary/upd", // 数据字典修改
  GetDictionaryAdd: URL + "system/dictionary/add", // 数据字典新增
  GetinitHsm: URL + "system/three_type/initHsm", // 初始化一体机

  // 证书颁发机构
  GetrCertList: URL + "svs/cert/allCaCertTree", // 证书颁发机构列表
  DelOneCert: URL + "svs/cert/delOne", // 证书颁发机构删除
  UpdStatus: URL + "svs/cert/updStatus", // 启用禁用
  UploadCert: URL + "svs/cert/upload", // 上传证书
  GetCertById: URL + "svs/cert/getById", // 详情

  // 配置Ocsp
  GetAddOcsp: URL + "svs/ocsp/addOcsp", // 新增
  GetOcspById: URL + "svs/ocsp/getOcspById", // 详情
  UpdOcspStatus: URL + "svs/ocsp/updOcspStatus", // 启用或停用
  DelOneOcsp: URL + "svs/ocsp/delOneOcsp", // 删除
  GetOcspUrlBySN: URL + "svs/ocsp/getOcspUrlBySN", // 通过【根证书序列号】查询服务器地址
  GetOcspUrlBySNByUser: URL + "svs/ocsp/getOcspUrlBySNByUser", // 用户通过【根证书序列号】查询服务器地址
  GetAddOcspByUser: URL + "svs/ocsp/addOcspByUser", // 用户新增

  // 配置crl
  UpdCfgStatus: URL + "svs/crlCfg/upd", // 更新
  GetCrlUrlBySN: URL + "svs/crlCfg/getCrlUrlBySN", // 查找crl地址
  GetCrlCfgBySN: URL + "svs/crlCfg/getCrlCfgBySN", // 通过应用证书序列号查询
  GetCrlCfgById: URL + "svs/crlCfg/getCrlCfgById", // 详情(没用)
  AddCrlCfg: URL + "svs/crlCfg/add", // 新增(没用)

  crlSync: URL + "svs/crl/sync", // 同步,
  CRLList: URL + "svs/crl/list", // CRL列表,
  crlAdd: URL + "svs/crl/add", // CRL上传,
  checkCrlUpdCert: URL + "svs/crl/checkCrlUpdCert", // 证书校验crl
  crlExp: URL + "svs/crl/exp", // CRL下载,
  crlDelOne: URL + "svs/crl/delOne", // CRL删除,
  //GetCrlUrlBySNByUser: URL + "svs/crlCfg/getCrlUrlBySNByUser", // 用户证书查找crl地址
  //AddCrlCfggByUser: URL + "svs/crlCfg/addCrlCfgByUser", // 用户证书添加

  // 应用证书管理
  GetAppcertList: URL + "svs/appcert/appcertList", // 应用证书管理列表
  GetAppcertById: URL + "svs/appcert/getAppcertById", // 应用证书管理详情
  ImportCert: URL + "svs/appcert/importCert", // 证书导入
  GetCertdelOne: URL + "svs/appcert/delOne", // 删除应用证书管理
  GenCsr: URL + "svs/appcert/genCsr", // 生成证书请求文件
  UpdAppcertStatus: URL + "svs/appcert/updStatus", // 启用和停用应用证书
  AddForCsr: URL + "svs/appcert/addForCsr", // 证书请求文件添加数据库
  UpdateAppCert: URL + "svs/appcert/updateCert", //更新证书
  UpdAppCert: URL + "svs/appcert/upd", //修改证书
  ExportAppCert: URL + "svs/appcert/exportCert", // 导出证书
  GetKeyStore: URL + "svs/appcert/getKeyStore", // 下载KeyStore
  BackupAppCert: URL + "svs/appcert/backup", // 备份证书
  RestoreAppCert: URL + "svs/appcert/restore", // 恢复证书

  // 外部应用证书管理
  GetAppcertExtList: URL + "svs/appcertExt/appcertList", // 外部证书管理列表
  GetAppcertExtById: URL + "svs/appcertExt/getAppcertById", // 外部证书管理详情
  ImportCertExt: URL + "svs/appcertExt/importCert", // 证书导入
  DelCertExtOne: URL + "svs/appcertExt/delOne", // 删除外部证书
  UpdAppcertExtStatus: URL + "svs/appcertExt/updStatus", // 启用和停用外部证书
  ExportAppCertExt: URL + "svs/appcertExt/exportCert", // 导出外部证书
  UpdAppCertExt: URL + "svs/appcertExt/upd", //修改证书

  // 应用管理
  GetAddApp: URL + "svs/app/addApp", // 新增应用管理
  GetAppList: URL + "svs/app/appList", // 应用管理列表
  GetUpdApp: URL + "svs/app/updApp", // 修改
  DelOneApp: URL + "svs/app/delOneApp", // 应用管理删除
  GetAppById: URL + "svs/app/getAppById", // 详情
  GetList: URL + "svs/app/getList", // 列表查询

  //对称密钥管理
  GetAddSymmetricKey: URL + "svs/symmetric/addKey", // 新增对称密钥
  GetUpdSymmetricKey: URL + "svs/symmetric/updApp", // 修改
  DelKeySymmetricKey: URL + "svs/symmetric/delKey", // 对称密钥删除
  GetSymmetricKeyById: URL + "svs/symmetric/getAppById", // 详情
  GetSymmetricKeyList: URL + "svs/symmetric/getList", // 列表查询



  // 用户管理
  GetAddSvsUser: URL + "svs/user/addUser", // 新增
  GetDelOneSvsUser: URL + "svs/user/delOneUser", // 删除
  GetSvsUserList: URL + "svs/user/getList", // 列表
  GetSvsUserById: URL + "svs/user/getUserById", // 详情
  UpdSvsUser: URL + "svs/user/updUser", // 修改
  SvsUserList: URL + "svs/user/userList", // 分页查询

  // 用户证书
  AddSvsForCsr: URL + "svs/usercert/addForCsr", // 证书请求文件添加数据库
  //   CertSvsList: URL + "svs/usercert/certList", // 查询证书（列表）
  CertSvsList: URL + "svs/usercert/list", // 查询证书（列表）
  UserCertSvsDel: URL + "svs/usercert/delOne", // 删除
  UserCertGenCsr: URL + "svs/usercert/genCsr", // 生成证书请求文件
  UserCertGetById: URL + "svs/usercert/getById", // 通过ID查询
  UserCertGetBySN: URL + "svsusercert/getBySN", //通过证书序列号查询
  UserCertSvs: URL + "svs/usercert/getUsercert", //条件查询
  UserCertImportCert: URL + "svs/usercert/importCert", //导入证书文件
  UserCertUpdStatus: URL + "svs/usercert/updStatus", // 启用和停用用户证书
  UpdateUserCert: URL + "svs/usercert/updateCert", //更新证书
  ExportUserCert: URL + "svs/usercert/exportCert", // 导出证书
  BackupUserCert: URL + "svs/usercert/backup", // 备份证书
  RestoreUserCert: URL + "svs/usercert/restore", // 恢复证书

  // CA发布者
  PublisherAdd: URL + "ca/publisher/add", // 新增发布者
  PublisherDel: URL + "ca/publisher/delOne", // 删除
  PublisherById: URL + "ca/publisher/getById", // 查看详请
  PublisherList: URL + "ca/publisher/list", // 获取列表
  PublisherUpd: URL + "ca/publisher/upd", // 修改

  // CA请求者
  RequestorAdd: URL + "ca/requestor/add", // 新增发布者
  RequestorDel: URL + "ca/requestor/delOne", // 删除
  RequestorById: URL + "ca/requestor/getById", // 查看详请
  RequestorList: URL + "ca/requestor/list", // 获取列表
  RequestorUpd: URL + "ca/requestor/upd", // 修改

  // CA根证书
  CertUpload: URL + "ca/cert/upload", // 新增发布者
  CertDel: URL + "ca/cert/delOne", // 删除
  CertById: URL + "ca/cert/getById", // 查看详请
  CertList: URL + "ca/cert/list", // 获取列表
  CertUpd: URL + "ca/cert/upd", // 修改
  CertListAll: URL + "ca/cert/all", // 获取列表不分页
  CertAddForCsr: URL + "ca/cert/addForCsr", // 添加证书请求文件
  CertImportCert: URL + "ca/cert/importCert", // 导入证书文件
  CertGenCsr: URL + "ca/cert/downloadCsr", // 下载证书请求文件
  AddCertBySelf: URL + "ca/cert/signIssueCertSelf", // 自签证书
  ExportSingleCert: URL + "ca/cert/downloadCert", // 下载根证书
  CheckCaCertPublicKey: URL + "ca/cert/checkCaCertPublicKey", // 查看是否存在公钥
  ModifyPucPassword: URL + "ca/cert/modifyPucPassword", // 修改访问控制码

  //CA设备证书
  DeviceCertUpd: URL + "ca/certDevice/upd", // 修改
  AddDeviceCertBySelf: URL + "ca/certDevice/signIssueCertDevice", // 签发设备证书
  ModifyDevicePucPassword: URL + "ca/certDevice/modifyPucPassword", // 修改访问控制码
  DeviceCertList: URL + "ca/certDevice/list", // 获取列表
  DeviceCertById: URL + "ca/certDevice/getById", // 查看详请
  ExportDeviceSingleCert: URL + "ca/certDevice/downloadCert", // 下载设备证书
  DeviceCertDel: URL + "ca/certDevice/delOne", // 删除

  //CA请求文件
  CaRequestUpd: URL + "ca/request/upd", // 修改
  CaRequestList: URL + "ca/request/list", // 列表
  CaRequestGetById: URL + "ca/request/getById", // 通过id查询
  CaRequestDelOne: URL + "ca/request/delOne", // 删除
  CaRequestAdd: URL + "ca/request/add", // 添加

  //CA证书管理
  CertIssueList: URL + "ca/certIssue/list", // 列表
  SignIssueCert: URL + "ca/certIssue/signIssueCert", // 发证
  //SignIssueCertUK: URL1 + "ukey/issueCert", // 发证到UK
  SignIssueCertUK: URL + "ca/certIssue/signIssueCertUK", // 发证到UK
  CertIssueGetById: URL + "ca/certIssue/getById", // 详情
  CertIssuedelOne: URL + "ca/certIssue/delOne", //  删除
  CertDownCert: URL + "ca/certIssue/downloadCert", // 下载证书
  CADownloadEnc: URL + "ca/certIssue/downloadCertZip", // 下载密钥
  UpdateCert: URL + "ca/certIssue/updateIssueCert", // 更新证书
  RevokeCert: URL + "ca/certIssue/revokeCert", // 吊销证书
  CertIssueListByCertId: URL + "ca/certIssue/listByCaCertId", // 根据根证书id 查询
  UpdateStatus: URL + "ca/certIssue/updateStatus", //  启用，停用和修改到期时间

  // CA 发证
  CertListByPage: URL + "ca/certIssue/listByPage", // 列表分页
  CertIssueGenCert: URL + "ca/certIssue/genCert", // 发证
  GenCertUK: URL + "ca/certIssue/genCertUK", // UKey中发证
  BackupDB: URL + "ca/certIssue/backupDB", // 备份证书表
  RestoreDB: URL + "ca/certIssue/restoreDB", // 恢复证书表

  // CA扩展项
  ProfAdd: URL + "ca/profileExtension/add", // 新增模板
  ProfDel: URL + "ca/profileExtension/delOne", // 删除
  ProfById: URL + "ca/profileExtension/getById", // 查看详请
  ProfList: URL + "ca/profileExtension/list", // 获取列表
  ProfUpd: URL + "ca/profileExtension/upd", // 修改
  ProfAll: URL + "ca/profileExtension/all", // 全部
  ProfUpdStatus: URL + "ca/profileExtension/updStatus", // 修改状态

  //CA模板
  ProfileDel: URL + "ca/profile/delOne", // 删除
  ProfileList: URL + "ca/profile/list", // 获取列表
  ProfileListAll: URL + "ca/profile/listAll", // 列表不分页

  //   CA模板(新)
  ProfileAddNew: URL + "ca/profile/add", // 模板添加
  ProfileByIdNew: URL + "ca/profile/getById", // 查看详请
  ProfileUpdNew: URL + "ca/profile/upd", // 修改

  // CA签名者
  SignerAdd: URL + "ca/signer/add", // 新增模板
  SignerDel: URL + "ca/signer/delOne", // 删除
  SignerById: URL + "ca/signer/getById", // 查看详请
  SignerList: URL + "ca/signer/list", // 获取列表
  SignerUpd: URL + "ca/signer/upd", // 修改
  SignerListAll: URL + "ca/signer/listAll", // 获取列表不分页

  // CA CRL管理
  AddCrl: URL + "ca/crl/addCrl", // 添加证书Crl记录
  GetCrlList: URL + "ca/crl/crlList", // 查看吊销列表
  GetCrlById: URL + "ca/crl/getCrlById", // 通过ID查询
  UpdateCrl: URL + "ca/crl/updateCrl", // 吊销
  CrlDel: URL + "ca/crl/delOne", // 删除
  UpdateInfoCrl: URL + "ca/crl/updateInfoCrl", // 修改证书
  DownCrl: URL + "ca/crl/downCrl", // 下载CRL
  UpdateCrlTime: URL + "ca/crl/updateCrlTime", // 配置crl更新周期

  // CA根证书和模板关联
  CertProfileAdd: URL + "ca/certProfile/add", // 关联新增
  CertProfileDelOne: URL + "ca/certProfile/delOne", // 关联解除
  CertProfileList: URL + "ca/certProfile/certProfileList", // CA模板和根证书关联列表不分页

  // CA初始化
  InitAddCertBySelf: URL + "ca/init/addCertBySelf", //自签根证书
  InitAddForCsr: URL + "ca/init/addForCsr", //证书请求文件添加数据库
  InitGenCsr: URL + "ca/init/genCsr", //生成证书请求文件
  InitCertList: URL + "ca/init/certList", // 根证书列表不分页
  InitImportCert: URL + "ca/init/importCert", //导入证书文件
  InitSignerList: URL + "ca/init/signerList", // 签名者
  InitProfileList: URL + "ca/init/profileList", // 模板
  AddCertDevice: URL + "ca/init/addCertDevice", // 生成设备文件
  CheckNotAfter: URL + "system/direct/checkNotAfter", // 验证KEY是否过期

  InitGenCertUK: URL + "ca/init/genCertUK", // 往ukey中发证

  // 司法取证
  WorkUserAdd: URL + "ca/workUser/add", // 添加
  WorkUserDelOne: URL + "ca/workUser/delOne", // 删除
  WorkUserDownCert: URL + "ca/workUser/downCert", // 下载证书
  WorkUserDownPrivateKeyEnc: URL + "ca/workUser/downPrivateKeyEnc", // 下载加密证书密钥(加密过的)
  WorkUserExternalVerifyECC: URL + "ca/workUser/externalVerifyECC", // 登录验签
  WorkUserGetById: URL + "ca/workUser/getById", // 通过ID查询
  WorkUserGetList: URL + "ca/workUser/list", // CA工作人员列表(分页)
  WorkUserGetListAll: URL + "ca/workUser/listAll", // CA工作人员列表(不分页)
  WorkUserGetListCount: URL + "ca/workUser/listCount", // 查看CA工作人员登录人数
  GetSM2KeyStateforCA: URL + "hsm/hsmKey/getSM2KeyStateforCA", // CA导出密钥列表
  WorkUserUpd: URL + "ca/workUser/upd", // 修改

  // 软证书管理
  DownPfxCert: URL + "ca/certPfxIssue/downPfxCert", // 下载PFX证书
  GenPfxCert: URL + "ca/certPfxIssue/genPfxCert", // 发证

  // CA授权
  GetlicenseStr: URL + "ca/license/getlicenseStr", // 获取授权信息
  Importlic: URL + "ca/license/importlic", // 导入文件
  Setlicense: URL + "ca/license/setlicense", // 制作license文件

  // KM接入
  ImportCertKM: URL + "ca/certKM/importCertKM", // 导入KM证书
  KmInfo: URL + "ca/certKM/kmInfo", // 查询KM证书信息

  // RA
  RaCertDel: URL + "ca/raCert/delOne", // 删除
  RaCertGenCsrFile: URL + "ca/raCert/genCsrFile", // 申请注册
  RaCertGenCsrstr: URL + "ca/raCert/genCsrstr", // 申请注册
  RaCertIsCsrtoCert: URL + "ca/raCert/isCsrtoCert", // 审核结果
  RaCertListByPage: URL + "ca/raCert/listByPage", // CSR列表(分页)
  SaveCsrData: URL + "ca/raCert/saveCsrData", // RA审核通过存储数据
  RaCertOutCertCsr: URL + "ca/raCert/outCertCsr", // 获取csr
  RADownloadEnc: URL + "ca/raCert/downloadEnc", // 下载密钥

  // CA OCSP
  CAAddOcsp: URL + "ca/ocsp/addOcsp", // 新增ocsp
  CAGetOcspUrlById: URL + "ca/ocsp/getOcspUrlBySN" // 获取详情
};

