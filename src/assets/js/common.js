import CryptoJS from 'crypto-js'
let Base64 = require('js-base64').Base64;
let common = {
    
    decodeArr:[
       { url:'C182C79695C9C7CFB488A8A292AC4DB1',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['account','idNumber','userName','legalPerson']}]},//'findSysAuditAll'
       { url:'95461700FDE4C25D79630D515F13D59779DF7B730DBCCE7EFB867BB1B85D1082',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['account','userName']}]},//'operate/findAllUser'
       { url:'7C28889A7A72534A907658B1FC15A69B0D54FABB6F3CF6E548E39C00AB5F07F3',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['sysAccount','sysUserName']}]},//'operate/findAllSysOrgInfoDto'
        
       { url:'7C28889A7A72534A907658B1FC15A69BC05A0C8D4A0FC2F1661184D102C69686',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['mobilePhone','userName']}]},//'operate/findAllSysCert'
       { url:'7C28889A7A72534A907658B1FC15A69B820C65AE7F9FCF393975D61C2851CF81',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['initiatorName','contractPlayers']}]},//'operate/findAllSysContractDto'
       { url:'755678BF43A0D7A63BDF8F2AEB9BC59203421FF6F639A93CF5D2775459E7CD7E',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['followPeople']}]},//'findSysCustomerList'
       { url:'8E0848CB6E53D132C45C5A1FABC62D24',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['entMobile','entEmail']}]},//'findEntList'
       { url:'857A1D1CC5929AB6E0D0121D9C065842DD0AAC9A6DD444A9848C5617EB1E8BFA',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['sysUserName','sysAccount','sysEntEmail']}]},//'sys-user/findAllUser'
       { url:'ECA4468C4D7959390E416E1F64CCB358',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['oprUserName','oprUserPhone']}]},//'findDataLogList'
    //    { url:'A23448E63FA3FCC2F8F37C241E1FA102CEA512A566AA390475F81EDAAE323A68',type:'1',deNameArr:['account','email','userName']},//'sysCustomer/findSysContact'
       { url:'A23448E63FA3FCC2F8F37C241E1FA102CEA512A566AA390475F81EDAAE323A68',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['account','email','userName']}]},//'sysCustomer/findSysContact'
       { url:'84BA3BA0A50F9C5474D739F630868CBCB89A73F2C10376E0021D243FD37B23C5',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['account']}]},//'openApiAuditList'
       { url:'EF07EB09EC0BF0EA9410486899943461',type:'4',deNameArr:['sysAccount','sysUserName','sysEntEmail']},//'flushUserInfo'
       { url:'BBA9D80E98F286E63EC9A8563F4124D53F26FE84FE2E0DF8DC1CD99423750DB2',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['publicAccount','publicName']}]},//'/open/problem/page'
       { url:'F1D0FCD6D1D01A7828262B50D729697CC74E4835AFF598DB18A9D3EEC66A6C3F',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['publicAccount','publicName']}]},//'open/notice/page'
       { url:'332772BE8AB7292D3A5F1DD51E3BEF0B',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['publicAccount','publicName']}]},//'/open/file/page'
       { url:'9236C4D0C09F9CE47C636AD96EC9459DEAA2479E889987FFFCE9CF644F05F059',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['email','userName','userAccount']}]},//'/personContactList'
       { url:'38AB23F328BB871E617B94C2BCEC12CF',type:'2',deNameArr:[{'dename':'list',type:2,deNameArr:['email','userName','userAccount']}]},//'/entContactList'
       { url:'4812E49AFD18A593DCD0D14DBCCFAF0A12D0EF020BEBCC92DC61318FEE5D75E9',type:'3',deNameArr:[{'dename':'list',type:2,deNameArr:['entMobile','entEmail']}]},//'/sys-ent/findParentEntList'
        
        
        

    ],
        Encrypt(word) {
            let key = CryptoJS.enc.Base64.parse('HwAjAv7trJl0AP/+5yAVCg==');  //十六位十六进制数作为密钥
            let iv = CryptoJS.enc.Base64.parse('/xgA0AqJ7g0wmdyr/wgA3Q==');   //十六位十
            let srcs = CryptoJS.enc.Utf8.parse(word);
            let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
            return encrypted.ciphertext.toString().toUpperCase();
        },
         Decrypt(word) {
             if(!word){
                 return word;
             }
            let key = CryptoJS.enc.Base64.parse('HwAjAv7trJl0AP/+5yAVCg==');  //十六位十六进制数作为密钥
            let iv = CryptoJS.enc.Base64.parse('/xgA0AqJ7g0wmdyr/wgA3Q==');   //十六位十
            let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
            let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
            let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
            let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
            return decryptedStr.toString();
            
        },
        base64DeCode(val){
            return this.Decrypt(val);
            // return Base64.decode(val).replace("%3F","?");
        },
        IEVersion() {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if(isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if(fIEVersion == 7) {
                    return 7;
                } else if(fIEVersion == 8) {
                    return 8;
                } else if(fIEVersion == 9) {
                    return 9;
                } else if(fIEVersion == 10) {
                    return 10;
                } else {
                    return 6;//IE版本<=7
                }   
            } else if(isEdge) {
                return 'edge';//edge
            } else if(isIE11) {
                return 11; //IE11  
            }else{
                return -1;//不是ie浏览器
            }
        },
        forMyCount(response){
            let len = this.decodeArr.length
            for(let i = 0;i< len;i++){
                if(response.config.url.indexOf(this.Decrypt(this.decodeArr[i].url))!=-1){
                    this.decodeArr[i].deNameArr.forEach(item=>{

                        if(this.decodeArr[i].type==1){
                            response.data.data[item] = this.Decrypt(response.data.data[item] )
                        }else if(this.decodeArr[i].type==2){

                            item.deNameArr.forEach(element=>{
                                
                                if(item.type==1){
                                    // element
                                    
                                    response.data.data[element] = this.Decrypt(response.data.data[element] )
                                }else{
                                 
                                    response.data.data[item.dename].forEach(tname=>{
                                        tname[element] = this.Decrypt(tname[element] )
                                    })
                                }
                            })
                            // response.data.data[item]
                            // response.data.data
                        }else if(this.decodeArr[i].type==4){
                            response.data.data.user[item] = this.Decrypt(response.data.data.user[item])
                        }else if(this.decodeArr[i].type==3){
                            console.log(response.data.data,"response.data.data")
                            response.data.data.forEach(item2=>{
                                // this.decodeArr[i].deNameArr.forEach(element=>{
                                    item2[item] = this.Decrypt(item2[item] )
                                // })
                            })
                        }
                    })
                    // if(response.data.data.list){
                        
                    //     response.data.data.list.forEach(item=>{

                    //     })
                    // } 
                    return false;
                }
                 
            }
            // this.decodeArr.forEach(item=>{
                
            //     if(response.config.url.indexOf(item)!=-1){
            //         console.log( typeof response.data.data,"typeof response.data.data")
            //     }
            // })
            // response
        }

}
export default common