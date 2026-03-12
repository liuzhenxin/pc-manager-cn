import $ from "jquery";
import url from "../../config/url.js";
var _baseURL = "http://127.0.0.1:11480/api/ubs";
function callRemote(func, args, cb) {
  $.ajax({
    type: "POST",
    url: _baseURL + "/" + func, //添加自己的接口链接
    // beforeSend: function(XMLHttpRequest) {
    //   XMLHttpRequest.setRequestHeader(
    //     "Authorization",
    //     sessionStorage.getItem("Authorization")
    //   );
    // },
    data: {
      params: JSON.stringify(args)
    },
    timeOut: 30000,
    dataType: "json",
    success: function(dat) {
      if (typeof dat == "string") {
        dat = JSON.parse(dat);
      }
      cb(dat);
    },
    error: function(code, message) {
      console.log("error");
      cb({
        success: false,
        code: code,
        message: message
      });
    }
  });
}
var UBSEncrollAsync = {
  GenerateKeyPair: function(cb, handle, sm2) {
    callRemote("GenerateKeyPair", [handle, sm2], cb);
  },

  CreatePKCS10: function(cb, handle, subject, keyType, keyLength) {
    callRemote("CreatePKCS10", [handle, subject, keyType, keyLength], cb);
  },

  ImportCertificate: function(cb, handle, cert, sign) {
    callRemote("ImportCertificate", [handle, cert, sign], cb);
  },

  ImportKeyPair: function(cb, handle, encKeyPair, wrapKey, alg) {
    callRemote("ImportKeyPair", [handle, encKeyPair, wrapKey, alg], cb);
  },

  UnblockPIN: function(cb, sn, app, adminPin, userPin) {
    callRemote("UnblockPIN", [sn, app, adminPin, userPin], cb);
  },

  // fileRights: 255
  CreateApplication: function(cb, sn, app, adminPin, userPin, fileRights) {
    callRemote(
      "CreateApplication",
      [sn, app, adminPin, userPin, fileRights],
      cb
    );
  },

  DeleteApplication: function(cb, sn, app) {
    callRemote("DeleteApplication", [sn, app], cb);
  },

  CreateContainer: function(cb, sn, app, cont, pin) {
    callRemote("CreateContainer", [sn, app, cont, pin], cb);
  },

  DeleteContainer: function(cb, sn, app, cont, pin) {
    callRemote("DeleteContainer", [sn, app, cont, pin], cb);
  },
  CheckPIN: function(cb, cert, password) {
    callRemote("CheckPIN", [cert, password], cb);
  },

  ChangePIN: function(cb, cert, opin, spin) {
    callRemote("ChangePIN", [cert, opin, spin], cb);
  },

  Lookup: function(cb, which) {
    callRemote("Lookup", [which], cb);
  },

  GetDeviceState: function(cb, which) {
    callRemote("GetDeviceState", [which], cb);
  },

  FindCertificates: function(cb, filter) {
    callRemote("FindCertificates", [filter], cb);
  },

  SelectCertificate: function(cb, filter) {
    callRemote("SelectCertificate", [filter], cb);
  },

  FreeCertificate: function(cb, hCert) {
    callRemote("FreeCertificate", [hCert], cb);
  },

  GetCertInfo: function(cb, hCert, sign) {
    callRemote("GetCertInfo", [hCert, sign], cb);
  },

  ExportCertificate: function(cb, hCert, sign) {
    callRemote("ExportCertificate", [hCert, sign], cb);
  },

  Digest: function(cb, handle, msg, alg) {
    callRemote("Digest", [handle, msg, alg], cb);
  },

  SignData: function(cb, hCert, msg, alg) {
    callRemote("SignData", [hCert, msg, alg], cb);
  },

  VerifySignature: function(cb, hCert, msg, sig, alg) {
    callRemote("VerifySignature", [hCert, msg, sig, alg], cb);
  },

  PKCS7Sign: function(cb, hCert, msg, flags) {
    callRemote("PKCS7Sign", [hCert, msg, flags], cb);
  },

  PKCS7Verify: function(cb, p7, msg, cert, flags) {
    callRemote("PKCS7Verify", [p7, msg, cert, flags], cb);
  },

  //Low and CA API
  GetDeviceInfo: function(cb, sn) {
    callRemote("GetDeviceInfo", [sn], cb);
  },

  EnumApplication: function(cb, sn) {
    callRemote("EnumApplication", [sn], cb);
  },

  EnumContainer: function(cb, sn, app) {
    callRemote("EnumContainer", [sn, app], cb);
  },

  OpenContainer: function(cb, sn, app, cont) {
    callRemote("OpenContainer", [sn, app, cont], cb);
  },

  CloseContainer: function(cb, handle) {
    callRemote("CloseContainer", [handle], cb);
  },

  GetContainerType: function(cb, handle) {
    callRemote("GetContainerType", [handle], cb);
  },

  GetContainerInfo: function(cb, handle) {
    callRemote("GetContainerInfo", [handle], cb);
  },

  GenerateRandom: function(cb, handle, len) {
    callRemote("GenerateRandom", [handle, len], cb);
  },

  WriteFile: function(cb, sn, app, fname, data, pin) {
    callRemote("WriteFile", [sn, app, fname, data, pin], cb);
  },
  ReadFile: function(cb, sn, app, fname, pin) {
    callRemote("ReadFile", [sn, app, fname, pin], cb);
  },
  DeleteFile: function(cb, sn, app, fname, pin) {
    callRemote("DeleteFile", [sn, app, fname, pin], cb);
  },

  GetPINInfo: function(cb, admin) {
    if (typeof admin == "boolean") callRemote("GetPINInfo", [admin], cb);
    else callRemote("GetPINInfo", [], cb);
  },

  RemoveAll: function(cb, device) {
    callRemote("RemoveAll", [device], cb);
  }
  //接下来
};
export { UBSEncrollAsync };
