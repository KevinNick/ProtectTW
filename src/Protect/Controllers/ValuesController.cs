using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Mvc;
using System.Net;
using System.IO;
using System.Runtime.Serialization.Json;
using System.Text;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Protect.Controllers.Controllers
{
    //[Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // GET: api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/UserName/Password
        [HttpGet("Login/{UserName}/{Password}")]
        public string Login(string UserName,string Password)
        {
            string Result = "";
            string webAddr = "http://protecttw.cloudapp.net/Service1.svc/Login/" + UserName + "/" + Password + "/" + Guid.NewGuid();
            HttpWebRequest httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(webAddr);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "GET";
            HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
            Stream resStream = response.GetResponseStream();
            DataContractJsonSerializer obj = new DataContractJsonSerializer(typeof(string));
            string GetData = obj.ReadObject(resStream) as string;

            int InsertValue;
            if (int.TryParse(GetData, out InsertValue) == true)
            {
                Result = InsertValue.ToString();
            }
            else
            {
                Result = GetData;
            }
            return Result;
        }

        [HttpGet("UserRegister/{UserName}/{Password}")]
        public  string UserRegister(string UserName, string Password)
        {
            UserInformation UserInformationItem = new UserInformation();
            UserInformationItem.UserName = UserName;
            UserInformationItem.UserPassword = Password;

            string webAddr = "http://protecttw.cloudapp.net/Service1.svc/UserRegister";
            HttpWebRequest httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(webAddr);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";

            var json = Newtonsoft.Json.JsonConvert.SerializeObject(UserInformationItem);
            byte[] postBytes = Encoding.UTF8.GetBytes(json);
            httpWebRequest.ContentLength = postBytes.Length;
            using (Stream postStream = httpWebRequest.GetRequestStream())
            {
                postStream.Write(postBytes, 0, postBytes.Length);
            }

            HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
            Stream resStream = response.GetResponseStream();
            DataContractJsonSerializer obj = new DataContractJsonSerializer(typeof(string));
            string GetData = obj.ReadObject(resStream) as string;
            return GetData;
        }

        [HttpGet("OpenDataGet/{inputValue}")]
        public string OpenDataGet(string inputValue)
        {
            FunctionLib FunctionList = new FunctionLib();
            string Result = "";
            if (inputValue == "weather")
            {
                Result = FunctionList.WeatherDataParse();
            }
            else if (inputValue == "radiation")
            {
                Result = FunctionList.radiationInformation();
            }
            else if (inputValue == "uv")
            {
                Result = FunctionList.UVInformation();
            }
            else if (inputValue == "ocean")
            {
                Result = FunctionList.OceanDataParse();
            }
            else if (inputValue == "air")
            {
                Result = FunctionList.AQXInformation();
            }
            else
            {
                List<MarkerLocation> MarkerLocationItemList = new List<MarkerLocation>();
                string webAddr = "http://protecttw.cloudapp.net/Service1.svc/GetOpenData/" + inputValue + "/" + Guid.NewGuid();
                HttpWebRequest httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(webAddr);
                httpWebRequest.ContentType = "application/json";
                httpWebRequest.Method = "GET";
                HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
                Stream resStream = response.GetResponseStream();
                DataContractJsonSerializer obj = new DataContractJsonSerializer(typeof(List<GetSitedata>));
                List<GetSitedata> GetData = obj.ReadObject(resStream) as List<GetSitedata>;
                foreach (var item in GetData)
                {
                    MarkerLocation MarkerLocationItem = new MarkerLocation();
                    if (string.IsNullOrEmpty(item.SiteName) == false)
                    {
                        MarkerLocationItem.title = item.SiteName.Replace(@"""", "");
                    }
                    else
                    {
                        MarkerLocationItem.title = item.SiteType.Replace(@"""", "");
                    }
                    MarkerLocationItem.lat = double.Parse(item.SiteLatitude);
                    MarkerLocationItem.lng = double.Parse(item.SiteLongitude);
                    MarkerLocationItem.description = item.SiteAddress.Replace(@"""", "");
                    MarkerLocationItem.icon = "";
                    MarkerLocationItemList.Add(MarkerLocationItem);
                }

                string json = Newtonsoft.Json.JsonConvert.SerializeObject(MarkerLocationItemList);
                
                return json;
            }
            return Result;
        }

        //取得群組
        [HttpGet("GetTreeView/{UserID}")]
        public string GetTreeView(string UserID)
        {
            string webAddr = "http://protecttw.cloudapp.net/Service1.svc/GetGroupInfo/" + UserID + "/" + Guid.NewGuid();
            HttpWebRequest httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(webAddr);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "GET";
            HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
            Stream resStream = response.GetResponseStream();
            DataContractJsonSerializer obj = new DataContractJsonSerializer(typeof(List<GroupInfo>));
            List<GroupInfo> GetDataItemInfo = obj.ReadObject(resStream) as List<GroupInfo>;
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(GetDataItemInfo);
            return json;
        }

        //取得群組
        [HttpGet("GetTreeView/{UserID}/{guid}")]
        public string GetTreeView(string UserID, string guid)
        {
            string webAddr = "http://protecttw.cloudapp.net/Service1.svc/GetGroupInfo/" + UserID + "/" + Guid.NewGuid();
            HttpWebRequest httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(webAddr);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "GET";
            HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
            Stream resStream = response.GetResponseStream();
            DataContractJsonSerializer obj = new DataContractJsonSerializer(typeof(List<GroupInfo>));
            List<GroupInfo> GetDataItemInfo = obj.ReadObject(resStream) as List<GroupInfo>;
            var json = Newtonsoft.Json.JsonConvert.SerializeObject(GetDataItemInfo);
            return json;
        }

        [HttpGet("GetTreeViewItem/{UserID}/{GroupID}/{TreeUserID}")]
        public string GetTreeViewItem(string UserID, string GroupID, string TreeUserID)
        {
            List<MarkerLocation> MarkerLocationItemList = new List<MarkerLocation>();

            string webAddr = "http://protecttw.cloudapp.net/Service1.svc/GetGroupInfo/" + UserID + "/" + Guid.NewGuid();
            HttpWebRequest httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(webAddr);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "GET";
            HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
            Stream resStream = response.GetResponseStream();
            DataContractJsonSerializer obj = new DataContractJsonSerializer(typeof(List<GroupInfo>));
            List<GroupInfo> GetDataItemInfo = obj.ReadObject(resStream) as List<GroupInfo>;

            
            var GetLocation =
            from LocationInfo in GetDataItemInfo
            where LocationInfo.GroupID == GroupID
            select LocationInfo;
            if(GetLocation.Any() == true)
            {
                if (string.IsNullOrEmpty(TreeUserID) == true)
                {
                    var GetTreeUserLocation =
                        from TreeUserLocation in GetLocation.First().GroupUser
                        where TreeUserLocation.UserID == TreeUserID
                        select TreeUserLocation;
                    foreach(var items in GetTreeUserLocation)
                    {
                        MarkerLocation MarkerLocationItem = new MarkerLocation();
                        MarkerLocationItem.title = items.UserName;
                        MarkerLocationItem.lat = double.Parse(items.UserLatitude);
                        MarkerLocationItem.lng = double.Parse(items.UserLongitude);
                        if(items.alarm.Any() == true)
                        {
                            foreach(var AlarmMessageText in items.alarm)
                            {
                                MarkerLocationItem.description = "(" + AlarmMessageText.AlarmTime + ")" + AlarmMessageText.AlarmMessage;
                            }
                        }
                        else
                        {
                            MarkerLocationItem.description = items.UserName;
                        }
                        MarkerLocationItemList.Add(MarkerLocationItem);
                    }
                }
                else
                {
                    foreach (var items in GetLocation.First().GroupUser)
                    {
                        MarkerLocation MarkerLocationItem = new MarkerLocation();
                        MarkerLocationItem.title = items.UserName;
                        MarkerLocationItem.lat = double.Parse(items.UserLatitude);
                        MarkerLocationItem.lng = double.Parse(items.UserLongitude);
                        if (items.alarm.Any() == true)
                        {
                            foreach (var AlarmMessageText in items.alarm)
                            {
                                MarkerLocationItem.description = "(" + AlarmMessageText.AlarmTime + ")" + AlarmMessageText.AlarmMessage;
                            }
                        }
                        else
                        {
                            MarkerLocationItem.description = items.UserName;
                        }
                        MarkerLocationItemList.Add(MarkerLocationItem);
                    }
                }
            }
            string json = Newtonsoft.Json.JsonConvert.SerializeObject(MarkerLocationItemList);
            return json;
        }

        [HttpGet("CreateGroup/{UserID}/{GroupName}")]
        public string CreateGroup(string UserID, string GroupName)
        {
            string webAddr = "http://protecttw.cloudapp.net/Service1.svc/CreateGroup/" + UserID + "/" + GroupName + "/" + Guid.NewGuid();
            HttpWebRequest httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(webAddr);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "GET";
            HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
            Stream resStream = response.GetResponseStream();
            DataContractJsonSerializer obj = new DataContractJsonSerializer(typeof(string));
            string GetData = obj.ReadObject(resStream) as string;
            return GetData;
        }


        [HttpGet("AddGroup/{UserID}/{GroupID}")]
        public string AddGroup(string UserID,string GroupID)
        {
            string webAddr = "http://protecttw.cloudapp.net/Service1.svc/JoinGroup/" + UserID + "/" + GroupID + "/" + Guid.NewGuid();
            HttpWebRequest httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(webAddr);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "GET";
            HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
            Stream resStream = response.GetResponseStream();
            DataContractJsonSerializer obj = new DataContractJsonSerializer(typeof(string));
            string GetData = obj.ReadObject(resStream) as string;
            return GetData;
        }

        [HttpGet("SendMessage/{UserID}/{GroupID}/{MessageString}")]
        public string SendMessage(string UserID,string GroupID, string MessageString)
        {
            MessageManagment MessageManagmentItem = new MessageManagment();
            string webAddr = "http://protecttw.cloudapp.net/Service1.svc/message_add/" + UserID + "/" + MessageString + "/0/0/" + GroupID + "/" + Guid.NewGuid();
            HttpWebRequest httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(webAddr);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "GET";

            HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
            Stream resStream = response.GetResponseStream();
            DataContractJsonSerializer obj = new DataContractJsonSerializer(typeof(string));
            string GetData = obj.ReadObject(resStream) as string;
            return GetData;
        }

        [HttpGet("GetMessage/{UserID}/{guid}")]
        public string GetMessage(string UserID, string guid)
        {
            //string result = "";
            //result = 

            //return result;
            List<UserMessage> UserMessageList = new List<UserMessage>();
            string webAddr = "http://protecttw.cloudapp.net/Service1.svc/GetMessageInfo/" + UserID + "/0/" + Guid.NewGuid();
            HttpWebRequest httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(webAddr);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "GET";
            HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
            Stream resStream = response.GetResponseStream();
            DataContractJsonSerializer obj = new DataContractJsonSerializer(typeof(List<MessageInfo>));
            List<MessageInfo> GetDataItem = obj.ReadObject(resStream) as List<MessageInfo>;

            string json = Newtonsoft.Json.JsonConvert.SerializeObject(GetDataItem);
            return json;
        }

        [HttpGet("UserAlarmMessage/{UserID}")]
        public string UserAlarmMessage(string UserID)
        {
            string webAddr = "http://protecttw.cloudapp.net/Service1.svc/UpdateAlarmMessage/" + UserID + "/" + Guid.NewGuid();
            HttpWebRequest httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(webAddr);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "GET";
            HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
            Stream resStream = response.GetResponseStream();
            DataContractJsonSerializer obj = new DataContractJsonSerializer(typeof(List<UpdateAlarmInfo>));
            List<UpdateAlarmInfo> GetData = obj.ReadObject(resStream) as List<UpdateAlarmInfo>;

            string json = Newtonsoft.Json.JsonConvert.SerializeObject(GetData);
            return json;
        }

        [HttpGet("AlarmWeather")]
        public string AlarmWeather()
        {
            FunctionLib FunctionList = new FunctionLib();
            return FunctionList.AlarmWearher();
        }

        [HttpGet("Get_OpenData/{MessageType}")]
        public string Get_OpenData(string MessageType)
        {
            string webAddr = "http://protecttw.cloudapp.net/Service1.svc/Get_OpenData/" + MessageType + "/30/" + Guid.NewGuid();
            HttpWebRequest httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(webAddr);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "GET";

            HttpWebResponse response = (HttpWebResponse)httpWebRequest.GetResponse();
            Stream resStream = response.GetResponseStream();
            DataContractJsonSerializer obj = new DataContractJsonSerializer(typeof(List<OpenDataInfo>));
            List<OpenDataInfo> GetData = obj.ReadObject(resStream) as List<OpenDataInfo>;

            string json = Newtonsoft.Json.JsonConvert.SerializeObject(GetData);
            return json;
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
