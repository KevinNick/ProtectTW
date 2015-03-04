
var UserID;
var GroupData;

loadScript("GoogleScript.js", ClickGroupUser);

//頁簽切換
function ChangeTabAction(idShow)
{
    //close All div
    document.getElementById("Cloud").style.display = 'none';
    document.getElementById("MyGroup").style.display = 'none';
    document.getElementById("Disaster").style.display = 'none';
    document.getElementById("Weather").style.display = 'none';
    document.getElementById("Chartroom").style.display = 'none';

    var Show = document.getElementById(idShow);
    if (Show.style.display == 'none') {
        Show.style.display = '';
    }
    else {
        Show.style.display = 'none';
    }
}

function LogOutRequest() {
    UserID = "";

}

// AJAX 物件
var ajax;

// 依據不同的瀏覽器，取得 XMLHttpRequest 物件
function createAJAX() {
    if (window.ActiveXObject) {
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e2) {
                return null;
            }
        }
    } else if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else {
        return null;
    }
}

// 非同步傳輸的回應函式，用來處理伺服器回傳的資料
function onRcvData() {
    if (ajax.readyState == 4) {
        if (ajax.status == 200) {
            UserID = ajax.responseText;
            if (UserID.length > 0) {
                document.getElementById("LogoutState").style.display = "none";
                document.getElementById("LoginState").style.display = "block";

                GetGroupData(UserID);
            }
            else {
                document.getElementById("LogoutState").style.display = "block";
                document.getElementById("LoginState").style.display = "none";
            }
            //alert(ajax.responseText)
            //var content = document.getElementById('content');
            //content.innerHTML = ajax.responseText;
        } else {
            alert("伺服器處理錯誤");
        }
    }
}

// 非同步送出資料
function CheckUserRight(uri) {
    if (uri == "Login") {
        ajax = createAJAX();
        if (!ajax) {
            alert('使用不相容 XMLHttpRequest 的瀏覽器');
            return 0;
        }
        var UserNameTest = document.getElementById("UserName").value;
        var UserPassword = document.getElementById("Password").value

        ajax.onreadystatechange = onRcvData;
        ajax.open("GET", "Login/" + UserNameTest + "/" + UserPassword, true);
        ajax.send("");

    }
    else if (uri == "Register") {
        ajax = createAJAX();
        if (!ajax) {
            alert('使用不相容 XMLHttpRequest 的瀏覽器');
            return 0;
        }
        var UserNameTest = document.getElementById("UserName").value;
        var UserPassword = document.getElementById("Password").value

        ajax.onreadystatechange = onRcvData;
        ajax.open("GET", "UserRegister/" + UserNameTest + "/" + UserPassword, true);
        ajax.send("");
    }
}

function ajaxMessageRequest(uri) {
    ajax = createAJAX();
    if (!ajax) {
        alert('使用不相容 XMLHttpRequest 的瀏覽器');
        return 0;
    }
    var UserNameTest = document.getElementById("UserName").value;
    var UserPassword = document.getElementById("Password").value

    ajax.onreadystatechange = onRcvData;
    ajax.open("GET", "Login/" + UserNameTest + "/" + UserPassword, true);
    ajax.send("");
}

function GetGroupData(user)
{
    ajax = createAJAX();
    if (!ajax) {
        alert('使用不相容 XMLHttpRequest 的瀏覽器');
        return 0;
    }

    ajax.onreadystatechange = GetGroupData_Finish;
    ajax.open("GET", "GetTreeView/" + user, true);
    ajax.send("");

}

function GetGroupData_Finish()
{
    if (ajax.readyState == 4) {
        if (ajax.status == 200) {
            GroupData = JSON.parse(ajax.responseText);
           
            if (GroupData != undefined || GroupData == '') {
                //Grow tree view
                BindingTreeData(GroupData);
            }

        } else {
            alert("伺服器處理錯誤");
        }
    }
}

function BindingTreeData(data)
{

    var ul = document.getElementById("tree");

    for (i = 0; i < data.length; i++) {
      //  var li = document.createElement("li");
      //  li.appendChild(document.createTextNode("Four"));
        //ul.append(
        //            '<li><a href="javascript:;">' +
        //            '<span class="check">' + data[i].GroupName +
        //            '</span></a></li>'
        //         );

        var nodeView = '';

        for (node = 0; node < data[i].GroupUser.length ; node++)
        {
            nodeView += '<li onclick="ClickGroupUser()"><a href="javascript:;">' +
                    '<span class="check"></span>' +                
                    '<img src="/css/images/green.jpg" title="' + data[i].GroupUser[node].UserName + '" width="58" height="58" />' +
                    '</a></li>';
        }

        $(document).ready( function(){
            $('ul#tree').append(
                    '<li><a href="javascript:;">' + data[i].GroupName +'</a>' +  
                        '<ul>' + nodeView +
                        '</ul>' +                   
                    '</li>'
                 );
        })

    }
}

function ClickGroupUser()
{

    //$.getScript("GoogleScript.js", function () {
    //    GetGoogleMap(GroupData[0].GroupUser[0]);


    //    // Use anything defined in the loaded script...
    //});


    GetGoogleMap(GroupData[0].GroupUser[0]);

}

//function showMessage(Type) {
//    ajax = createAJAX();
//    if (!ajax) {
//        alert('使用不相容 XMLHttpRequest 的瀏覽器');
//        return 0;
//    }

//    ajax.onreadystatechange = onMessageRcvData;
//    ajax.open("GET", "OpenDataGet/" + Type, true);
//    ajax.send("");
//}

//// 非同步傳輸的回應函式，用來處理伺服器回傳的資料
//function onMessageRcvData() {
//    if (ajax.readyState == 4) {
//        if (ajax.status == 200) {
//            GetGoogleMap(ajax.responseText);
//        } else {
//            alert("伺服器處理錯誤");
//        }
//    }
//}