//JKunitrust v1.0.9
var JKunitrust = (function () {

	var ws = null;
	var hasConnect = false;
	var connecting = false;
	var count = 0;
	var port = 50000;

	var devHotplugCallback = null;
	var sof_getVersionCallBack = null;
	var sof_getDeviceInfoCallBack = null;
	var sof_getPinRetryCountCallBack = null;
	var sof_loginCallBack = null;
	var sof_changePassWdCallBack = null;
	var sof_enumDevCallBack = null;
	var sof_getUserListCallBack = null;
	var sof_exportUserCertCallBack = null;
	var sof_getCertInfoCallBack = null;
	var sof_signDataCallBack = null;
	var sof_verifySignedDataCallBack = null;
	var sof_signFileCallBack = null;
	var sof_verifySignedFileCallBack = null;
	var sof_encryptDataCallBack = null;
	var sof_decryptDataCallBack = null;
	var sof_encryptFileCallBack = null;
	var sof_decryptFileCallBack = null;
	var sof_signMessageCallBack = null;
	var sof_verifySignedMessageCallBack = null;
	var sof_getRandomCallBack = null;
	var sof_getDevListCallBack = null;
	var sof_getAppListCallBack = null;
	var sof_createAppCallBack = null;
	var sof_getFileListCallBack = null;
	var sof_fileReadCallBack = null;
	var sof_fileWriteCallBack = null;
	var sof_fileDeleteCallBack = null;
	var sof_createContainerCallBack = null;
	var sof_createFileCallBack = null;
	var sof_patchFileDeleteCallBack = null;
	var sof_patchFileWriteCallBack = null;
	var sof_decryptAndWriteDataCallBack = null;
	var sof_encryptWithCipherKeyAndReadDataCallBack = null;
	var sof_GetChallengeCallBack = null;
	var sof_VerifyResponseCallBack = null;
	var sof_SymmKeyStorageCallBack = null;
	var sof_GetEncryptedRandomCallBack = null;
	var sof_SetLabelCallBack = null;
	var sof_ImportSymmCallBack = null;
	var sof_ExportSymmCallBack = null;
	var sof_SymmCryptoCallBack = null;
	var sof_ImportSymmKeyCallBack = null;
	var sof_SinoPacUnblockPIN = null;

	function parsingMsg(msg) {
		var jsonobj = JSON.parse(msg);
		if ("SOF_DevicePlugMessage" == jsonobj.cmd) {
			devHotplugCallback(jsonobj);
		} else if ("SOF_GetVersion" == jsonobj.cmd) {
			sof_getVersionCallBack(jsonobj);
		} else if ("SOF_GetDeviceInfo" == jsonobj.cmd) {
			sof_getDeviceInfoCallBack(jsonobj);
		} else if ("SOF_GetPinRetryCount" == jsonobj.cmd) {
			sof_getPinRetryCountCallBack(jsonobj);
		} else if ("SOF_Login" == jsonobj.cmd) {
			sof_loginCallBack(jsonobj);
		} else if ("SOF_ChangePassWd" == jsonobj.cmd) {
			sof_changePassWdCallBack(jsonobj);
		} else if ("SOF_EnumDev" == jsonobj.cmd) {
			sof_enumDevCallBack(jsonobj);
		} else if ("SOF_GetUserList" == jsonobj.cmd) {
			sof_getUserListCallBack(jsonobj);
		} else if ("SOF_ExportUserCert" == jsonobj.cmd) {
			sof_exportUserCertCallBack(jsonobj);
		} else if ("SOF_GetCertInfo" == jsonobj.cmd) {
			sof_getCertInfoCallBack(jsonobj);
		} else if ("SOF_SignData" == jsonobj.cmd) {
			sof_signDataCallBack(jsonobj);
		} else if ("SOF_VerifySignedData" == jsonobj.cmd) {
			sof_verifySignedDataCallBack(jsonobj);
		} else if ("SOF_SignFile" == jsonobj.cmd) {
			sof_signFileCallBack(jsonobj);
		} else if ("SOF_VerifySignedFile" == jsonobj.cmd) {
			sof_verifySignedFileCallBack(jsonobj);
		} else if ("SOF_EncryptData" == jsonobj.cmd) {
			sof_encryptDataCallBack(jsonobj);
		} else if ("SOF_DecryptData" == jsonobj.cmd) {
			sof_decryptDataCallBack(jsonobj);
		} else if ("SOF_EncryptFile" == jsonobj.cmd) {
			sof_encryptFileCallBack(jsonobj);
		} else if ("SOF_DecryptFile" == jsonobj.cmd) {
			sof_decryptFileCallBack(jsonobj);
		} else if ("SOF_SignMessage" == jsonobj.cmd) {
			sof_signMessageCallBack(jsonobj);
		} else if ("SOF_VerifySignedMessage" == jsonobj.cmd) {
			sof_verifySignedMessageCallBack(jsonobj);
		} else if ("SOF_GetRandom" == jsonobj.cmd) {
			sof_getRandomCallBack(jsonobj);
		} else if ("SOF_GetDevList" == jsonobj.cmd) {
			sof_getDevListCallBack(jsonobj);
		} else if ("SOF_GetAppList" == jsonobj.cmd) {
			sof_getAppListCallBack(jsonobj);
		} else if ("SOF_CreateApp" == jsonobj.cmd) {
			sof_createAppCallBack(jsonobj);
		} else if ("SOF_GetFileList" == jsonobj.cmd) {
			sof_getFileListCallBack(jsonobj);
		} else if ("SOF_FileRead" == jsonobj.cmd) {
			sof_fileReadCallBack(jsonobj);
		} else if ("SOF_FileWrite" == jsonobj.cmd) {
			sof_fileWriteCallBack(jsonobj);
		} else if ("SOF_FileDelete" == jsonobj.cmd) {
			sof_fileDeleteCallBack(jsonobj);
		} else if ("SOF_CreateContainer" == jsonobj.cmd) {
			sof_createContainerCallBack(jsonobj);
		} else if ("SOF_CreateFile" == jsonobj.cmd) {
			sof_createFileCallBack(jsonobj);
		} else if ("SOF_PatchFileDelete" == jsonobj.cmd) {
			sof_patchFileDeleteCallBack(jsonobj);
		} else if ("SOF_PatchFileWrite" == jsonobj.cmd) {
			sof_patchFileWriteCallBack(jsonobj);
		} else if ("SOF_DecryptAndWriteData" == jsonobj.cmd) {
			sof_decryptAndWriteDataCallBack(jsonobj);
		} else if ("SOF_EncryptWithCipherKeyAndReadData" == jsonobj.cmd) {
			sof_encryptWithCipherKeyAndReadDataCallBack(jsonobj);
		} else if ("SOF_GetChallenge" == jsonobj.cmd) {
      sof_GetChallenge(jsonobj);
		} else if ("SOF_VerifyResponse" == jsonobj.cmd) {
      sof_VerifyResponse(jsonobj);
		} else if ("SOF_SymmKeyStorage" == jsonobj.cmd) {
			sof_SymmKeyStorageCallBack(jsonobj);
		} else if ("SOF_GetEncryptedRandom" == jsonobj.cmd) {
			sof_GetEncryptedRandomCallBack(jsonobj);
		} else if ("SOF_SetLabel" == jsonobj.cmd) {
			sof_SetLabelCallBack(jsonobj);
		} else if ("SOF_ImportSymm" == jsonobj.cmd) {
			sof_ImportSymmCallBack(jsonobj);
		} else if ("SOF_ExportSymm" == jsonobj.cmd) {
			sof_ExportSymmCallBack(jsonobj);
		} else if ("SOF_ImportSymmKey" == jsonobj.cmd) {
			sof_ImportSymmKeyCallBack(jsonobj);
		} else if ("SOF_SymmCrypto" == jsonobj.cmd) {
			sof_SymmCryptoCallBack(jsonobj);
		} else if ("SOF_SinoPacUnblockPIN" == jsonobj.cmd) {
			sof_SinoPacUnblockPIN(jsonobj);
		}
		else {
			console.log(msg);
		}
	}

	function checkConnection() {
		return hasConnect;
	}

	function onClose() {
		if (hasConnect) {
			ws.close();
			ws = null;
			hasConnect = false;
		}
	}

	function onMessages(evt) {
		parsingMsg(evt.data);
	}

	function connectService(mySuccess, myError, myClose) {
		count++;
		var weburl = "ws://127.0.0.1:" + port + "/wsocket";
		if (typeof MozWebSocket != "undefined") {
			ws = new MozWebSocket(weburl);
		} else {
			ws = new WebSocket(weburl);
		}
		ws.onopen = function onOpenSuccess() {
			hasConnect = true;
			connecting = false;
			if(mySuccess != undefined && mySuccess != null)
				mySuccess();
		};
		ws.onmessage = onMessages;
		ws.onclose = function onClose() {
			if (hasConnect) {
				ws.close();
				ws = null;
				hasConnect = false;
				connecting = false;
				myClose();
			}
		};
		ws.onerror = function onError(evt) {
			if (hasConnect) {
				myError("error", evt);
				hasConnect = false;
				connecting = false;
				return;
			}
			ws = null;

			if (count >= 5) {
				console.log("cannot connect local service");
				hasConnect = false;
				connecting = false;
				myError("fail");
				return;
			}

			//尝试更换端口进行连接
			port += 13;
			connectService(mySuccess, myError, myClose);
		};
	}

	return {
		oninit: function (onSuccess, onError, onClose) {
			if (connecting || hasConnect) {
				onError("已初始化");
				return;
			}
			connecting = true;
			port = 50000;
			connectService(onSuccess, onError, onClose);
		},
		listenHotplug: function (callback) {
			devHotplugCallback = callback;
		},
		SOF_GetVersion: function (callback) {
			if (!checkConnection()) return;
			sof_getVersionCallBack = callback;
			var json = {};
			json['cmd'] = "SOF_GetVersion";
			ws.send(JSON.stringify(json));
		},
		SOF_GetDeviceInfo: function (devpath, callback) {
			if (!checkConnection()) return;
			sof_getDeviceInfoCallBack = callback;
			var json = {};
			var param = {};
			json['cmd'] = "SOF_GetDeviceInfo";
			param['containername'] = devpath;
			json['param'] = param;
			ws.send(JSON.stringify(json));
		},
		SOF_GetPinRetryCount: function (appath, callback) {
			if (!checkConnection()) return;
			sof_getPinRetryCountCallBack = callback;
			var json = {};
			var param = {};
			json['cmd'] = "SOF_GetPinRetryCount";
			param['containername'] = appath;
			json['param'] = param;
			ws.send(JSON.stringify(json));
		},
		SOF_Login: function (appath, pin, callback) {
			if (!checkConnection()) return;
			sof_loginCallBack = callback;
			var json = {};
			var param = {};
			json['cmd'] = "SOF_Login";
			param['containername'] = appath;
			param['pin'] = pin;
			json['param'] = param;
			ws.send(JSON.stringify(json));
		},
		SOF_ChangePassWd: function (appath, oldpin, newpin, callback) {
			if (!checkConnection()) return;
			sof_changePassWdCallBack = callback;
			var json = {};
			var param = {};
			json['cmd'] = "SOF_ChangePassWd";
			param['containername'] = appath;
			param['oldpasswd'] = oldpin;
			param['newpasswd'] = newpin;
			json['param'] = param;
			ws.send(JSON.stringify(json));
		},
		SOF_GetUserList: function (callback) {
			if (!checkConnection()) return;
			sof_getUserListCallBack = callback;
			var json = {};
			json['cmd'] = "SOF_GetUserList";
			ws.send(JSON.stringify(json));
		},
		SOF_ExportUserCert: function (containername, callback) {
			if (!checkConnection()) return;
			sof_exportUserCertCallBack = callback;
			var json = {};
			var param = {};
			param['containername'] = containername;
			param['type'] = "1";
			json['param'] = param;
			json['cmd'] = "SOF_ExportUserCert";
			ws.send(JSON.stringify(json));
		},
		SOF_ExportExChangeUserCert: function (containername, callback) {
			if (!checkConnection()) return;
			sof_exportUserCertCallBack = callback;
			var json = {};
			var param = {};
			param['containername'] = containername;
			param['type'] = "2";
			json['param'] = param;
			json['cmd'] = "SOF_ExportUserCert";
			ws.send(JSON.stringify(json));
		},
		SOF_GetCertInfo: function (cert, callback) {
			if (!checkConnection()) return;
			sof_getCertInfoCallBack = callback;
			var json = {};
			var param = {};
			param['cert'] = cert;
			json['param'] = param;
			json['cmd'] = "SOF_GetCertInfo";
			ws.send(JSON.stringify(json));
		},
		SOF_SignData: function (containername, indata, pin, callback) {
			if (!checkConnection()) return;
			sof_signDataCallBack = callback;
			var json = {};
			var param = {};
			param['containername'] = containername;
			param['indata'] = indata;
			param['pin'] = pin;
			json['param'] = param;
			json['cmd'] = "SOF_SignData";
			ws.send(JSON.stringify(json));
		},
		SOF_VerifySignedData: function (cert, indata, signature, callback) {
			if (!checkConnection()) return;
			sof_verifySignedDataCallBack = callback;
			var json = {};
			var param = {};
			param['cert'] = cert;
			param['indata'] = indata;
			param['signature'] = signature;
			json['param'] = param;
			json['cmd'] = "SOF_VerifySignedData";
			ws.send(JSON.stringify(json));
		},
		SOF_SignFile: function (containername, infile, pin, callback) {
			if (!checkConnection()) return;
			sof_signFileCallBack = callback;
			var json = {};
			var param = {};
			param['containername'] = containername;
			param['infile'] = infile;
			param['pin'] = pin;
			json['param'] = param;
			json['cmd'] = "SOF_SignFile";
			ws.send(JSON.stringify(json));
		},
		SOF_VerifySignedFile: function (cert, infile, signature, callback) {
			if (!checkConnection()) return;
			sof_verifySignedFileCallBack = callback;
			var json = {};
			var param = {};
			param['cert'] = cert;
			param['infile'] = infile;
			param['signature'] = signature;
			json['param'] = param;
			json['cmd'] = "SOF_VerifySignedFile";
			ws.send(JSON.stringify(json));
		},
		SOF_EncryptData: function (cert, indata, callback) {
			if (!checkConnection()) return;
			sof_encryptDataCallBack = callback;
			var json = {};
			var param = {};
			param['cert'] = cert;
			param['indata'] = indata;
			json['param'] = param;
			json['cmd'] = "SOF_EncryptData";
			ws.send(JSON.stringify(json));
		},
		SOF_DecryptData: function (containername, indata, pin, callback) {
			if (!checkConnection()) return;
			sof_decryptDataCallBack = callback;
			var json = {};
			var param = {};
			param['containername'] = containername;
			param['indata'] = indata;
			param['pin'] = pin;
			json['param'] = param;
			json['cmd'] = "SOF_DecryptData";
			ws.send(JSON.stringify(json));
		},
		SOF_EncryptFile: function (cert, infile, outfile, callback) {
			if (!checkConnection()) return;
			sof_encryptFileCallBack = callback;
			var json = {};
			var param = {};
			param['cert'] = cert;
			param['infile'] = infile;
			param['outfile'] = outfile;
			json['param'] = param;
			json['cmd'] = "SOF_EncryptFile";
			ws.send(JSON.stringify(json));
		},
		SOF_DecryptFile: function (containername, infile, outfile, pin, callback) {
			if (!checkConnection()) return;
			sof_decryptFileCallBack = callback;
			var json = {};
			var param = {};
			param['containername'] = containername;
			param['infile'] = infile;
			param['outfile'] = outfile;
			param['pin'] = pin;
			json['param'] = param;
			json['cmd'] = "SOF_DecryptFile";
			ws.send(JSON.stringify(json));
		},
		SOF_SignMessage: function (containername, indata, type, pin, callback) {
			if (!checkConnection()) return;
			sof_signMessageCallBack = callback;
			var json = {};
			var param = {};
			param['containername'] = containername;
			param['indata'] = indata;
			param['type'] = type;
			param['pin'] = pin;
			json['param'] = param;
			json['cmd'] = "SOF_SignMessage";
			ws.send(JSON.stringify(json));
		},
		SOF_VerifySignedMessage: function (messagedata, indata, callback) {
			if (!checkConnection()) return;
			sof_verifySignedMessageCallBack = callback;
			var json = {};
			var param = {};
			param['messagedata'] = messagedata;
			if (indata != null) {
				param['indata'] = indata;
			}
			json['param'] = param;
			json['cmd'] = "SOF_VerifySignedMessage";
			ws.send(JSON.stringify(json));
		},
		SOF_GetRandom: function (len, callback) {
			if (!checkConnection()) return;
			sof_getRandomCallBack = callback;
			var json = {};
			var param = {};
			param['len'] = len;
			json['param'] = param;
			json['cmd'] = "SOF_GetRandom";
			ws.send(JSON.stringify(json));
		},
		SOF_GetDevList: function (callback) {
			if (!checkConnection()) return;
			sof_getDevListCallBack = callback;
			var json = {};
			json['cmd'] = "SOF_GetDevList";
			ws.send(JSON.stringify(json));
		},
		SOF_GetAppList: function (callback) {
			if (!checkConnection()) return;
			sof_getAppListCallBack = callback;
			var json = {};
			json['cmd'] = "SOF_GetAppList";
			ws.send(JSON.stringify(json));
		},
		SOF_CreateApp: function (devpath, appname, adminpin, admincount, userpin, usercount, callback) {
			if (!checkConnection()) return;
			sof_createAppCallBack = callback;
			var json = {};
			var param = {};
			param['devpath'] = devpath;
			param['appname'] = appname;
			param['adminpin'] = adminpin;
			param['admincount'] = admincount;
			param['userpin'] = userpin;
			param['usercount'] = usercount;
			json['param'] = param;
			json['cmd'] = "SOF_CreateApp";
			ws.send(JSON.stringify(json));
		},
		SOF_GetFileList: function (appath, callback) {
			if (!checkConnection()) return;
			sof_getFileListCallBack = callback;
			var json = {};
			var param = {};
			param['appath'] = appath;
			json['param'] = param;
			json['cmd'] = "SOF_GetFileList";
			ws.send(JSON.stringify(json));
		},
		SOF_FileRead: function (appath, filename, offset, size, callback) {
			if (!checkConnection()) return;
			sof_fileReadCallBack = callback;
			var json = {};
			var param = {};
			param['appath'] = appath;
			param['filename'] = filename;
			param['offset'] = offset;
			param['size'] = size;
			json['param'] = param;
			json['cmd'] = "SOF_FileRead";
			ws.send(JSON.stringify(json));
		},
		SOF_FileWrite: function (appath, filename, offset, content, pin, callback) {
			if (!checkConnection()) return;
			sof_fileWriteCallBack = callback;
			var json = {};
			var param = {};
			param['appath'] = appath;
			param['filename'] = filename;
			param['offset'] = offset;
			param['content'] = content;
			param['pin'] = pin;
			json['param'] = param;
			json['cmd'] = "SOF_FileWrite";
			ws.send(JSON.stringify(json));
		},
		SOF_FileDelete: function (appath, filename, pin, callback) {
			if (!checkConnection()) return;
			sof_fileDeleteCallBack = callback;
			var json = {};
			var param = {};
			param['appath'] = appath;
			param['filename'] = filename;
			param['pin'] = pin;
			json['param'] = param;
			json['cmd'] = "SOF_FileDelete";
			ws.send(JSON.stringify(json));
		},
		SOF_CreateContainer: function (appath, containername, pin, callback) {
			if (!checkConnection()) return;
			sof_createContainerCallBack = callback;
			var json = {};
			var param = {};
			param['appath'] = appath;
			param['containername'] = containername;
			param['pin'] = pin;
			json['param'] = param;
			json['cmd'] = "SOF_CreateContainer";
			ws.send(JSON.stringify(json));
		},
		SOF_CreateFile: function (appath, filename, size, pin, callback) {
			if (!checkConnection()) return;
			sof_createFileCallBack = callback;
			var json = {};
			var param = {};
			param['appath'] = appath;
			param['filename'] = filename;
			param['size'] = size;
			param['pin'] = pin;
			json['param'] = param;
			json['cmd'] = "SOF_CreateFile";
			ws.send(JSON.stringify(json));
		},
		SOF_PatchFileDelete: function (appath, pin, filenames, callback) {
			if (!checkConnection()) return;
			sof_patchFileDeleteCallBack = callback;
			var json = {};
			var param = {};
			param['appath'] = appath;
			param['filenames'] = filenames;
			param['pin'] = pin;
			json['param'] = param;
			json['cmd'] = "SOF_PatchFileDelete";
			ws.send(JSON.stringify(json));
		},
		SOF_PatchFileWrite: function (appath, pin, filelist, callback) {
			if (!checkConnection()) return;
			sof_patchFileWriteCallBack = callback;
			var json = {};
			var param = {};
			param['appath'] = appath;
			param['pin'] = pin;
			param['filelist'] = filelist;
			json['param'] = param;
			json['cmd'] = "SOF_PatchFileWrite";
			ws.send(JSON.stringify(json));
		},
		SOF_DecryptAndWriteData: function (containername, filename, pin, encdata, callback) {
			if (!checkConnection()) return;
			sof_decryptAndWriteDataCallBack = callback;
			var json = {};
			var param = {};
			param['containername'] = containername;
			param['filename'] = filename;
			param['pin'] = pin;
			param['encdata'] = encdata;
			json['param'] = param;
			json['cmd'] = "SOF_DecryptAndWriteData";
			ws.send(JSON.stringify(json));
		},
		SOF_EncryptWithCipherKeyAndReadData: function (containername, filename, pin, enckey, callback) {
			if (!checkConnection()) return;
			sof_encryptWithCipherKeyAndReadDataCallBack = callback;
			var json = {};
			var param = {};
			param['containername'] = containername;
			param['filename'] = filename;
			param['pin'] = pin;
			param['enckey'] = enckey;
			json['param'] = param;
			json['cmd'] = "SOF_EncryptWithCipherKeyAndReadData";
			ws.send(JSON.stringify(json));
		},
		SOF_GetChallenge: function (containername, callback) {
			if (!checkConnection()) return;
      sof_GetChallenge = callback;
			var json = {};
			var param = {};
			param['containername'] = containername;
			json['param'] = param;
			json['cmd'] = "SOF_GetChallenge";
			ws.send(JSON.stringify(json));
		},
		SOF_VerifyResponse: function (devpath, response, callback) {
			if (!checkConnection()) return;
      sof_VerifyResponse = callback;
			var json = {};
			var param = {};
			param['response'] = response;
			param['devpath'] = devpath;
			json['param'] = param;
			json['cmd'] = "SOF_VerifyResponse";
			ws.send(JSON.stringify(json));
		},
		SOF_SymmKeyStorage: function (appath, pin, symkey, callback) {
			if (!checkConnection()) return;
			sof_SymmKeyStorageCallBack = callback;
			var json = {};
			var param = {};
			param['symkey'] = symkey;
			param['pin'] = pin;
			param['appath'] = appath;
			json['param'] = param;
			json['cmd'] = "SOF_SymmKeyStorage";
			ws.send(JSON.stringify(json));
		},
		SOF_GetEncryptedRandom: function (appath, pin, random, callback) {
			if (!checkConnection()) return;
			sof_GetEncryptedRandomCallBack = callback;
			var json = {};
			var param = {};
			param['appath'] = appath;
			param['pin'] = pin;
			param['random'] = random;
			json['param'] = param;
			json['cmd'] = "SOF_GetEncryptedRandom";
			ws.send(JSON.stringify(json));
		},
		SOF_SetLabel: function (devpath, label, callback) {
			if (!checkConnection()) return;
			sof_GetEncryptedRandomCallBack = callback;
			var json = {};
			var param = {};
			param['containername'] = devpath;
			param['label'] = label;
			json['param'] = param;
			json['cmd'] = "SOF_SetLabel";
			ws.send(JSON.stringify(json));
		},
		SOF_ImportSymm: function (appath, pin, symmkey, callback) {
			if (!checkConnection()) return;
			sof_ImportSymmCallBack = callback;
			var json = {};
			var param = {};
			param['appath'] = appath;
			param['pin'] = pin;
			param['symmkey'] = symmkey;
			json['param'] = param;
			json['cmd'] = "SOF_ImportSymm";
			ws.send(JSON.stringify(json));
		},
		SOF_ExportSymm: function (appath, pin, callback) {
			if (!checkConnection()) return;
			sof_ExportSymmCallBack = callback;
			var json = {};
			var param = {};
			param['appath'] = appath;
			param['pin'] = pin;
			json['param'] = param;
			json['cmd'] = "SOF_ExportSymm";
			ws.send(JSON.stringify(json));
		},
		SOF_ImportSymmKey: function (appath, pin, symmkey, callback) {
			if (!checkConnection()) return;
			sof_ImportSymmKeyCallBack = callback;
			var json = {};
			var param = {};
			param['appath'] = appath;
			param['pin'] = pin;
			param['symmkey'] = symmkey;
			json['param'] = param;
			json['cmd'] = "SOF_ImportSymmKey";
			ws.send(JSON.stringify(json));
		},
		SOF_SymmCrypto: function (appath, encflag, alg, iv, indata, callback) {
			if (!checkConnection()) return;
			sof_SymmCryptoCallBack = callback;
			var json = {};
			var param = {};
			param['appath'] = appath;
			param['encflag'] = encflag;
			param['alg'] = alg;
			param['iv'] = iv;
			param['indata'] = indata;
			json['param'] = param;
			json['cmd'] = "SOF_SymmCrypto";
			ws.send(JSON.stringify(json));
		},
		SOF_SinoPacUnblockPIN: function (appath, pin, callback) {
			if (!checkConnection()) return;
			sof_SinoPacUnblockPIN=callback;
			var json = {};
			var param = {};
			param['appath'] = appath;
			param['pin'] = pin;
			json['param'] = param;
			json['cmd'] = "SOF_SinoPacUnblockPIN";
			ws.send(JSON.stringify(json));
		}
	};
})();
export {
  // default
  JKunitrust
};
