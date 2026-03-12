/**
 * Description: 通用Ukey的js接口
 * Author: liuzx
 * Version: V1.0
 * Create: 2024/3/22 13:56
 */
import axios from "axios";
import $ from 'jquery'

// Global variables

var m_retryCount = 0;
var m_retryMax = 100; // 100x500ms = 50s
var m_strSessId = "";

// Page functions (originally done in pages)

var _baseURL = "http://" + window.location.host + "/api/ubs";
var _baseURL = "http://127.0.0.1:11480/api/ubs";

var dataType = 'json'; // 'jsonp' support short message

if (window.location.host == '127.0.0.1') {
    dataType = 'json';
}
export var usbKey = {

    callRemote00: function(func, args, cb) {
        axios({
            url: _baseURL + "/" + func,//接口链接
            method: 'post',
            data:{
            params: JSON.stringify(args)
            },
            headers:{
                "Content-Type":"application/json",
                'Cache-Control': 'no-cache'
            },
            async:false,
            timeout:50000
        }).then(res => {
            console.log(res)
            if(typeof (res) == 'string'){
                res = JSON.parse(res)
            }
            cb(res);
        }).catch(err =>{
            console.log(err)
            cb({
                success: false,
                code: err.code,
                message:err.message
            })
        })
    },
    callRemote: function(func, args, cb) {
        $.ajax({
            type: "POST",
            url: _baseURL + "/" + func, //添加自己的接口链接
            data: {
                params: JSON.stringify(args)
            },
            timeOut: 50000,
            dataType: dataType,
            success: function(dat) {
                if (typeof(dat) == 'string') {
                    dat = JSON.parse(dat);
                }
                cb(dat);
            },
            error: function(code, message) {
                cb({
                    success: false,
                    code: code,
                    message: message
                })
            }
        });
    },

    CheckPIN: function(cb, cert, password) {
        this.callRemote("CheckPIN", [cert, password], cb);
    },

    ChangePIN: function(cb, cert, opin, spin) {
        this.callRemote("ChangePIN", [cert, opin, spin], cb);
    },

    Lookup: function(cb, which) {
        this.callRemote("Lookup", [which], cb);
    },

    GetDeviceState: function(cb, which) {
        this.callRemote("GetDeviceState", [which], cb);
    },

    FindCertificates: function(cb, filter) {
        this.callRemote("FindCertificates", [filter], cb);
    },

    SelectCertificate: function(cb, filter) {
        this.callRemote("SelectCertificate", [filter], cb);
    },

    FreeCertificate: function(cb, hCert) {
        this.callRemote("FreeCertificate", [hCert], cb);
    },

    GetCertInfo: function(cb, hCert, sign) {
        this.callRemote('GetCertInfo', [hCert, sign], cb)
    },

    ExportCertificate: function(cb, hCert, sign) {
        this.callRemote("ExportCertificate", [hCert, sign], cb);
    },

    Digest: function(cb, handle, msg, alg) {
        this.callRemote("Digest", [handle, msg, alg], cb);
    },

    SignData: function(cb, hCert, msg, alg) {
        this.callRemote("SignData", [hCert, msg, alg], cb);
    },

    VerifySignature: function(cb, hCert, msg, sig, alg) {
        this.callRemote("VerifySignature", [hCert, msg, sig, alg], cb);
    },

    PKCS7Sign: function(cb, hCert, msg, flags) {
        this.callRemote("PKCS7Sign", [hCert, msg, flags], cb);
    },

    PKCS7Verify: function(cb, p7, msg, cert, flags) {
        this.callRemote("PKCS7Verify", [p7, msg, cert, flags], cb);
    },


    //多型号设备支持接口
    EnumProvider: function(cb, vpid) {
        this.callRemote("EnumProvider", [vpid], cb);
    },

    EnumDevice: function(cb, prov) {
        this.callRemote("EnumDevice", [prov], cb);
    },

    //Low and CA API
    GetDeviceInfo: function(cb, sn) {
        this.callRemote("GetDeviceInfo", [sn], cb);
    },

    EnumApplication: function(cb, sn) {
        this.callRemote("EnumApplication", [sn], cb);
    },

    EnumContainer : function(cb, sn, app) {
        this.callRemote("EnumContainer", [sn, app], cb);
    },

    OpenContainer : function(cb, sn, app, cont) {
        this.callRemote("OpenContainer", [sn, app, cont], cb);
    },

    CloseContainer: function(cb, handle)
    {
        this.callRemote("CloseContainer", [handle], cb);
    },

    GetContainerType: function(cb, handle)
    {
        this.callRemote("GetContainerType", [handle], cb);
    },

    GetContainerInfo: function(cb, handle)
    {
        this.callRemote("GetContainerInfo", [handle], cb);
    },

    GenerateRandom: function(cb, handle, len)
    {
        this.callRemote("GenerateRandom", [handle, len], cb);
    },

    WriteFile: function(cb, sn, app, fname, data, pin)
    {
        this.callRemote("WriteFile", [sn, app, fname, data, pin], cb);
    },
    ReadFile: function(cb, sn, app, fname, pin)
    {
        this.callRemote("ReadFile", [sn, app, fname, pin], cb);
    },
    DeleteFile: function(cb, sn, app, fname, pin)
    {
        this.callRemote("DeleteFile", [sn, app, fname, pin], cb);
    },

    GetPINInfo: function(cb, handle, admin)
    {
        this.callRemote("GetPINInfo", [handle, admin], cb);
    },

    RemoveAll: function(cb, device)
    {
        this.callRemote("RemoveAll", [device], cb);
    },


    GenerateKeyPair: function(cb, handle, sm2) {
        this.callRemote("GenerateKeyPair", [handle, sm2], cb);
    },

    CreatePKCS10: function(cb, handle, subject, keyType, keyLength) {
        this.callRemote("CreatePKCS10", [handle, subject, keyType, keyLength], cb);
    },

    ImportCertificate: function(cb, handle, cert, sign) {
        this.callRemote("ImportCertificate", [handle, cert, sign], cb);
    },

    ImportKeyPair: function(cb, handle, encKeyPair, wrapKey, alg) {
        this.callRemote("ImportKeyPair", [handle, encKeyPair, wrapKey, alg], cb);
    },

    UnblockPIN: function(cb, sn, app, adminPin, userPin)
    {
        this.callRemote("UnblockPIN", [sn, app, adminPin, userPin], cb);
    },

    CreateApplication: function(cb, sn, app, adminPin, userPin, fileRights)
    {
        this.callRemote("CreateApplication", [sn, app, adminPin, userPin, fileRights], cb);
    },

    DeleteApplication: function(cb, sn, app)
    {
        this.callRemote("DeleteApplication", [sn, app], cb);
    },

    CreateContainer: function(cb, sn, app, cont, pin)
    {
        this.callRemote("CreateContainer", [sn, app, cont, pin], cb);
    },

    DeleteContainer: function(cb, sn, app, cont, pin)
    {
        this.callRemote("DeleteContainer", [sn, app, cont, pin], cb);
    },
}