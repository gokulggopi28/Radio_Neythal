
var networkerrorshown = false;
var ws_base_url = "https://tst.techgentsia.com/lyceumwebservice/index.php/";

function School(data) {
    var self = this;
    self.schoolid = data.schoolid;
    self.schoolname = data.schoolname;
    self.district = data.district;
    self.logourl = data.logourl;
}


function LyceumViewModel() {

    var self = this;

    self.schools = ko.observableArray([]);

    self.selectedschool = ko.observable();

    self.selectschool = function (school) {
        self.selectedschool(school);
        console.log(self.selectedschool());
      //  alert('school.html?schoolId=' + self.selectedschool().schoolid);
        window.localStorage.setItem('token', authToken);
        window.localStorage.setItem('schoolid', self.selectedschool().schoolid);
        window.localStorage.setItem('schoolname', self.selectedschool().schoolname);
        window.localStorage.setItem('logourl', self.selectedschool().logourl);

        window.location = 'school.html';
    };

    self.get_school_list = function (token) {

        $.ajax({
        type: "GET",
        url: ws_base_url + "API/schools",
        headers: {
            'Authorization': token
        },
        dataType: 'JSON',
        success: function (data) {

           $('#schoolListDiv').show();
           $('#noNetDiv').hide();

                  $.each(data, function() {

                    var school = new School(this);
                    vm.schools.push(school);

                    });
                         
            }, error: function (err) {

                // alert(err);
                    
                }
            });

        
    };


}

var vm = new LyceumViewModel();

ko.applyBindings(vm);

$(document).ready(function () {
    
 $('#refreshButton').click(function(){
    authenticateWS();
 });

authenticateWS();

});

var authToken = "";
function authenticateWS() {
          $.ajax({
            type: "POST",
            url: ws_base_url + "auth/login",
            data: {
                username: 'mobileclient@lyceum.net',
                password: 'password'
            },
            dataType: 'JSON',
            success: function (data) {

             authToken = data.token;
             vm.get_school_list(authToken);//get school list

            }, error: function () {

          //  alert("auth err");
            // show retry
            $('#schoolListDiv').hide();
            $('#noNetDiv').show();
               
            }
        });
}


function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function alertDismissed() {
    // do something
    networkerrorshown = false;
}



