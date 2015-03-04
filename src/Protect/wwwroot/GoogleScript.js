
var UserID = "";
var GroupData="";
// AJAX 物件
var ajax;
var GetMessageString = "";
var GetGroupID = "0";
var GroupItemString = "";


window.onload = function () {
    var mapOptions = {
        center: new google.maps.LatLng(25.040282, 121.511901),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
        //  marker:true
    };
    var infoWindow = new google.maps.InfoWindow();
    var map = new google.maps.Map(document.getElementById("map_canvas_custom_238233"), mapOptions);
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
}

function Getdirections() {
    GetGoogledirections(document.getElementById("FromText").value, document.getElementById("ToText").value);
}

function GetGoogledirections(FromString, ToString) {
    var mapOptions = {
        center: new google.maps.LatLng(23.744329, 120.971664),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var infoWindow = new google.maps.InfoWindow();
    var map = new google.maps.Map(document.getElementById("map_canvas_custom_238233"), mapOptions);
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
    var oldDirections = [];
    var currentDirections = null;
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();//路線資訊回傳
    directionsDisplay = new google.maps.DirectionsRenderer({
        polylineOptions: {
            strokeColor: "black"
        }
    });
    directionsDisplay.setMap(map);

    var request = {
        origin: FromString,
        destination: ToString,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var myRoute = response.routes[0].legs[0];

            for (var i = 0; i < myRoute.steps.length; i++) {
                var RouteData = myRoute.steps[i];
                var marker = new google.maps.Marker({
                    position: RouteData.start_location,
                    map: map
                });
                (function (marker, RouteData) {
                    google.maps.event.addListener(marker, "click", function (e) {
                        infoWindow.setContent(RouteData.instructions);
                        infoWindow.open(map, marker);
                    });
                })(marker, RouteData);
            }
        }
    })
}

function GetGoogleMap(jsonData) {
    var obj = JSON.parse(jsonData);
    if (obj.length != 0) {
        var mapOptions = {
            center: new google.maps.LatLng(obj[0].lat, obj[0].lng),
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            //  marker:true
        };
        var infoWindow = new google.maps.InfoWindow();
        var map = new google.maps.Map(document.getElementById("map_canvas_custom_238233"), mapOptions);
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);
        for (i = 0; i < obj.length; i++) {
            var DataItem = obj[i];
            var myLatlng = new google.maps.LatLng(DataItem.lat, DataItem.lng);
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: DataItem.title,
                icon: DataItem.icon,
                //animation: google.maps.Animation.BOUNCE
            });
            (function (marker, DataItem) {
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent(DataItem.description);

                    //map.center =  new google.maps.LatLng(markers[0].lat,markers[0].lng),
                    infoWindow.open(map, marker);
                });
            })(marker, DataItem);
        }
    }
}



function showMessage(Type) {
    ajax = createAJAX();
    if (!ajax) {
        alert('使用不相容 XMLHttpRequest 的瀏覽器');
        return 0;
    }

    ajax.onreadystatechange = onMessageRcvData;
    ajax.open("GET", "OpenDataGet/" + Type, true);
    ajax.send("");
}

// 非同步傳輸的回應函式，用來處理伺服器回傳的資料
function onMessageRcvData() {
    if (ajax.readyState == 4) {
        if (ajax.status == 200) {
            GetGoogleMap(ajax.responseText);
        } else {
            alert("伺服器處理錯誤");
        }
    }
}

function GetGoogleMap(jsonData) {
    var obj = JSON.parse(jsonData);
    if (obj.length != 0) {
        var mapOptions = {
            center: new google.maps.LatLng(obj[0].lat, obj[0].lng),
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            //  marker:true
        };
        var infoWindow = new google.maps.InfoWindow();
        var map = new google.maps.Map(document.getElementById("map_canvas_custom_238233"), mapOptions);
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);
        for (i = 0; i < obj.length; i++) {
            var DataItem = obj[i];
            var myLatlng = new google.maps.LatLng(DataItem.lat, DataItem.lng);
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: DataItem.title,
                icon: DataItem.icon,
                //animation: google.maps.Animation.BOUNCE
            });
            (function (marker, DataItem) {
                google.maps.event.addListener(marker, "click", function (e) {
                    infoWindow.setContent(DataItem.description);

                    //map.center =  new google.maps.LatLng(markers[0].lat,markers[0].lng),
                    infoWindow.open(map, marker);
                });
            })(marker, DataItem);
        }
    }
}


//頁簽切換
function ChangeTabAction(idShow) {
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

    if (idShow == 'Weather')
    {
        GetWeatherData();
    }
}



function GetWeatherData()
{
    ajax = createAJAX();

    if (!ajax) {
        alert('使用不相容 XMLHttpRequest 的瀏覽器');
        return 0;
    }

    ajax.onreadystatechange = GetWeatherData_Finish;
    ajax.open("GET", "AlarmWeather", true);
    ajax.send("");
}

function GetWeatherData_Finish()
{
    if (ajax.readyState == 4) {
        if (ajax.status == 200) {

            var result =JSON.parse(ajax.responseText);

            BindingWeatherData(result);

        } else {
            alert("伺服器處理錯誤");
        }
    }

}

function BindingWeatherData(result)
{
    if (result == undefined)
    {
        return 0;
    }

    var table = document.getElementById("weatherData");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    var itemData = '<tr>' +
                        '<td class="weather" >地區</td>' +
                        '<td class="weather">資訊</td>' +
                    '</tr>';

    for (i = 0; i < result.length ; i++) {
        itemData += '<tr>'+ 
                        '<td class="weather" >' + result[i].Location + '</td>' +
                        '<td class="weather">' + result[i].Summary + '</td>' +
                    '</tr>';
    }



    $(document).ready(function () {
        $('table#weatherData').append(itemData);
    })
}

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
            if (ajax.responseText != "success")
            {
                if (ajax.responseText.length > 0 && ajax.responseText.length < 4) {
                    UserID = ajax.responseText;
                    document.getElementById("LogoutState").style.display = "none";
                    document.getElementById("LoginState").style.display = "block";

                    GetGroupData(UserID);
                    GetGroup();
                }
                else {
                    document.getElementById("LogoutState").style.display = "block";
                    document.getElementById("LoginState").style.display = "none";
                    alert(ajax.responseText);
                }
            }
            else
            {
                alert("註冊成功");
            }
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

function GetGroupData(user) {
    ajax = createAJAX();
    if (!ajax) {
        alert('使用不相容 XMLHttpRequest 的瀏覽器');
        return 0;
    }

    ajax.onreadystatechange = GetGroupData_Finish;
    ajax.open("GET", "GetTreeView/" + user, true);
    ajax.send("");

}

function GetGroupData_Finish() {
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

function BindingTreeData(data) {

    var ul = document.getElementById("tree");

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }


    for (i = 0; i < data.length; i++) {
        //  var li = document.createElement("li");
        //  li.appendChild(document.createTextNode("Four"));
        //ul.append(
        //            '<li><a href="javascript:;">' +
        //            '<span class="check">' + data[i].GroupName +
        //            '</span></a></li>'
        //         );

        var nodeView = '';

        for (node = 0; node < data[i].GroupUser.length ; node++) {
            nodeView += '<li onclick="GetUserLocation(' + data[i].GroupID + ',' + data[i].GroupUser[node].UserID + ')"><a href="javascript:;">' +
                    '<span class="check"></span>' +
                    '<img src="/css/images/green.jpg" title="' + data[i].GroupUser[node].UserName + '" width="58" height="58" />' +
                    '</a></li>';
        }

        $(document).ready(function () {
            $('ul#tree').append(
                    '<li><a href="javascript:;">' + data[i].GroupName + '(' + data[i].GroupID + ')' + '</a>' +
                        '<ul>' + nodeView +
                        '</ul>' +
                    '</li>'
                 );
        })

    }
}

function GetUserLocation(groupID, treeUserID) {

    //$.getScript("GoogleScript.js", function () {
    //    GetGoogleMap(GroupData[0].GroupUser[0]);


    //    // Use anything defined in the loaded script...
    //});

   var data = JSON.stringify(GroupData[0].GroupUser[0]);

   ajax = createAJAX();
   if (!ajax) {
       alert('使用不相容 XMLHttpRequest 的瀏覽器');
       return 0;
   }

   ajax.onreadystatechange = GetUserLocation_Finish;
   ajax.open("GET", "GetTreeViewItem/" + UserID + "/" + groupID +"/"+ treeUserID, true);
   ajax.send("");

}

function GetUserLocation_Finish()
{
    if (ajax.readyState == 4) {
        if (ajax.status == 200) {
            GetGoogleMap(ajax.responseText);
        } else {
            alert("伺服器處理錯誤");
        }
    }
}

function AddGroup()
{
    var groupID = document.getElementById("GroupID").value;

    if (groupID == undefined || groupID == '')
    {
        alert('請輸入群組ID');
        return 0;
    }

    ajax = createAJAX();
    if (!ajax) {
        alert('使用不相容 XMLHttpRequest 的瀏覽器');
        return 0;
    }

    ajax.onreadystatechange = AddGroup_Finish;
    ajax.open("GET", "AddGroup/" + UserID + "/" + groupID, true);
    ajax.send("");
}

function AddGroup_Finish()
{
    if (ajax.readyState == 4) {
        if (ajax.status == 200) {

            var result = ajax.responseText;

            if (result != 'success') {
                alert(result);
            }
            else {
                alert('加入成功');

                GetGroupData(UserID);
            }

        } else {
            alert("伺服器處理錯誤");
        }
    }
}

function CreateGroup()
{
    var groupName = document.getElementById("GroupCreate").value;

    if (groupName == undefined || groupName == '') {
        alert('請輸入群組名稱');
        return 0;
    }

    ajax = createAJAX();
    if (!ajax) {
        alert('使用不相容 XMLHttpRequest 的瀏覽器');
        return 0;
    }

    ajax.onreadystatechange = CreateGroup_Finish;
    ajax.open("GET", "CreateGroup/" + UserID + "/" + groupName, true);
    ajax.send("");
}

function CreateGroup_Finish()
{
    if (ajax.readyState == 4) {
        if (ajax.status == 200) {

            var result = ajax.responseText;

            if (result != 'success') {
                alert(result);
            }
            else {
                alert('創立成功');

                GetGroupData(UserID);
            }

        } else {
            alert("伺服器處理錯誤");
        }
    }
}

function GetDisasterData()
{
    var type = document.getElementById("ddlType");
    var typeValue = type.options[type.selectedIndex].value;
    ajax = createAJAX();
    if (!ajax) {
        alert('使用不相容 XMLHttpRequest 的瀏覽器');
        return 0;
    }

    ajax.onreadystatechange = GetDisasterData_Finish;
    ajax.open("GET", "Get_OpenData/" + typeValue, true);
    ajax.send("");


}

function GetDisasterData_Finish()
{
    if (ajax.readyState == 4) {
        if (ajax.status == 200) {

            var result = JSON.parse(ajax.responseText);

            BindingDisasterData(result);

        } else {
            alert("伺服器處理錯誤");
        }
    }



}

function BindingDisasterData(result)
{
    var table = document.getElementById("table_Disaster");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    var itemData = '<tr>' +
                        '<td width="40%">時間</td>'+
                        '<td width="30%">事件</td>' +
                        '<td>訊息</td>'+
                    '</tr>';

    for (i = 0; i < result.length ; i++) {
        var type = 'blue';
        if (i % 2 == 0) {
            type = 'blue';
        }
        else
        {
            type = 'gray';
        }
        var res = result[i].OpenDataUpdate.split(" ");
        itemData += ' <tr class="' + type + '">' +
                            '<td>' + res[0] + '<br /><span class="time">'+res[1]+' '+res[2] + '</span></td>' +
                            '<td>' + result[i].OpenDataTitle + '</td>' +
                            '<td>' + result[i].OpenDataSummary + '</td>' +
                        '</tr>';
    }



    $(document).ready(function () {
        $('table#table_Disaster').append(itemData);
    })
}






function LogOutRequest() {
    GroupData = "";
    // AJAX 物件
    UserID = "";
    GetMessageString = "";
    GetGroupID = "0";
    GroupItemString = "";
    document.getElementById("LogoutState").style.display = "block";
    document.getElementById("LoginState").style.display = "none";

    var DeleteItem = document.getElementById("select")
    if (DeleteItem != null)
    {
        while (DeleteItem.hasChildNodes()) {
            DeleteItem.removeChild(DeleteItem.lastChild);
        }
    }
    
    var chat_areaSpaceDeleteItem = document.getElementById("chat_areaSpace")
    if (chat_areaSpaceDeleteItem != null) {
        while (chat_areaSpaceDeleteItem.hasChildNodes()) {
            chat_areaSpaceDeleteItem.removeChild(chat_areaSpaceDeleteItem.lastChild);
        }
    }


    var ul = document.getElementById("tree");
    if (ul != null)
    {
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    }

    document.getElementById("textarea").value = "";
    
}



var ajaxTree;
function GetGroup() {
    if (UserID.length > 0) {
        ajaxTree = createAJAX();
        if (!ajaxTree) {
            alert('使用不相容 XMLHttpRequest 的瀏覽器');
            return 0;
        }

        ajaxTree.onreadystatechange = onTreeRcvData;
        ajaxTree.open("GET", "GetTreeView/" + UserID + "/" + guid(), true);
        ajaxTree.send("");
    }
}

// 非同步傳輸的回應函式，用來處理伺服器回傳的資料

function onTreeRcvData() {
    if (ajaxTree.readyState == 4) {
        if (ajaxTree.status == 200) {

            if (GroupItemString.length != ajaxTree.responseText.length) {
                var DeleteItem = document.getElementById("select")
                while (DeleteItem.hasChildNodes()) {
                    DeleteItem.removeChild(DeleteItem.lastChild);
                }
                var obj = JSON.parse(ajaxTree.responseText);
                if (obj.length != 0) {
                    $(document).ready(function () {
                        $('select#select').append(
                                '<option value="0" onclick="ShowData(\'0\');">ALL</option>'
                             );
                    })
                    for (i = 0; i < obj.length; i++) {

                        $(document).ready(function () {
                            $('select#select').append(
                                    '<option value="' + obj[i].GroupID + '" onclick="ShowData(\'' + obj[i].GroupID + '\');">' + obj[i].GroupName + '</option>'
                                 );
                        })
                    }
                }
                GroupItemString = ajaxTree.responseText;
            }

        } else {
            alert("伺服器處理錯誤");
        }
    }
}

function GetMessageFromServer() {
    if (UserID.length > 0) {
        ajaxMessage = createAJAX();
        if (!ajaxMessage) {
            alert('使用不相容 XMLHttpRequest 的瀏覽器');
            return 0;
        }

        ajaxMessage.onreadystatechange = GetMessageFromServerHandle;
        ajaxMessage.open("GET", "GetMessage/" + UserID + "/" + guid(), true);
        ajaxMessage.send("");
    }
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

// 非同步傳輸的回應函式，用來處理伺服器回傳的資料
function GetMessageFromServerHandle() {
    if (ajaxMessage.readyState == 4) {
        if (ajaxMessage.status == 200) {
            if (GetMessageString.length != ajaxMessage.responseText.length) {
                var DeleteItem = document.getElementById("chat_areaSpace")
                while (DeleteItem.hasChildNodes()) {
                    DeleteItem.removeChild(DeleteItem.lastChild);
                }
                GetMessageString = ajaxMessage.responseText;
                var obj = JSON.parse(ajaxMessage.responseText);
                if (obj.length != 0) {
                    for (i = 0; i < obj.length; i++) {
                        $(document).ready(function () {
                            $('div#chat_areaSpace').append(
                                    '<li>(' + obj[i].Time + ")" + obj[i].UserName + ":" + obj[i].Content + '</li>'
                                 );
                        })
                    }
                }
            }


        } else {
            alert("伺服器處理錯誤");
        }
    }
}




function SendMessageToServer() {
    if (UserID.length > 0) {
        ajax = createAJAX();
        if (!ajax) {
            alert('使用不相容 XMLHttpRequest 的瀏覽器');
            return 0;
        }
        var SendString = document.getElementById("textarea").value;
        //alert(SendString);

        ajax.onreadystatechange = SendMessageToServerHandle;
        ajax.open("GET", "SendMessage/" + UserID + "/" + GetGroupID + "/" + SendString, true);
        ajax.send("");
    }
}

// 非同步傳輸的回應函式，用來處理伺服器回傳的資料
function SendMessageToServerHandle() {
    if (ajax.readyState == 4) {
        if (ajax.status == 200) {
        }
        //alert(ajax.responseText);
        document.getElementById("textarea").value = "";

    } else {
        // alert("伺服器處理錯誤");
    }
}

function ShowData(DataValue) {
    GetGroupID = DataValue;

}

function TreeViewItemShow() {

}

var myTimerVar = setInterval(function () { myTimer() }, 3000);

function myTimer() {
    if (UserID.length > 0) {
        GetMessageFromServer();
    }
}
