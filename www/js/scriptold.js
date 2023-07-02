
var ws_base_url = "https://itvws.lyceum.one/index.php/";

var fullscreen = false;
var networkerrorshown = false;
var detailsScreenShown = false;


function School(data) {
    var self = this;
    self.schoolid = data.schoolid;
    self.schoolname = data.schoolname;
    self.schoolnamelarge = data.schoolnamelarge;
    self.place = data.place;
    self.district = data.district;
    self.logourl = data.logourl;
}

function Message(data) {
    var self = this;
    self.message = data.message;
    self.author = data.author;
    self.date = data.date;
}

function Photo(data) {
    var self = this;
    self.caption = data.caption;
    self.url = data.url;
    self.date = data.date;
}

function Video(data) {
    var self = this;
    self.caption = data.caption;
    self.url = data.url;
    self.date = data.date;
    self.thumbnail = data.thumbnail;
}

function LiveVideo(data) {
    var self = this;
    self.caption = data.caption;
    self.liveurl = data.liveurl;
    self.date = data.date;
    self.thumbnail = data.thumbnail;

    //school info 
    self.schoolnamelarge = data.schoolnamelarge;
    self.description = data.description;
}


function LyceumViewModel() {

    var self = this;

    self.schoolname = ko.observable();

    self.schoolnamelarge = ko.observable();

    self.place = ko.observable();

    self.logourl = ko.observable();
    
    self.schools = ko.observableArray([]);

    self.selectedschool = ko.observable();


    self.selectschool = function (school) {
        self.selectedschool(school);
        console.log(self.selectedschool());

        self.schoolname(self.selectedschool().schoolname);
        self.schoolnamelarge(self.selectedschool().schoolnamelarge);
        self.place(self.selectedschool().place);
        
        self.logourl(self.selectedschool().logourl);

        $('#schoolListDiv').hide();
        $('#schoolDetailsDiv').show();
        detailsScreenShown = true;

        vm.messages([]);//reset
        vm.photos([]);
        vm.videos([]);
        vm.livevideo(null);

        // vm.gethomescreeninfo();
        vm.getlivevideo();
        vm.getmessagelist();
        vm.getphotolist();
        vm.getvideolist();



      //  window.location = 'school.html';
    };

    self.get_school_list = function (token) {
       
        $.ajax({
            type: "GET",
            url: ws_base_url + "API/schools/",
            headers: {
                'Authorization': token
            },
            dataType: 'JSON',
            data: {"groupid" : '1'},
            success: function (data) {

                $('#schoolListDiv').show();
                $('#noNetDiv').hide();

                $.each(data, function () {

                    var school = new School(this);
                    vm.schools.push(school);

                });

            }, error: function (err) {

                // alert(err);

            }
        });


    };


    //messages
    self.messages = ko.observableArray([]);

    self.selectedmessage = ko.observable();

    self.selectmessage = function (message) {

        self.selectedmessage(message);
        //  console.log(self.selectedmessage());
    };

    self.getmessagelist = function () {

     $.ajax({
        type: "GET",
        url: ws_base_url + "API/messages/?schoolid=" + self.selectedschool().schoolid,
        headers: {
            'Authorization': authToken
        },
        dataType: 'JSON',
        success: function (data) {

            $.each(data, function () {
                var message = new Message(this);
                message.message = replaceURLWithHTMLLinks(message.message);
                vm.messages.unshift(message);
            });
                         
            }, error: function (err) {
                    
                }
            });       

    };

    //photos
    self.photos = ko.observableArray([]);

    self.selectedphoto = ko.observable();

    self.selectphoto = function (photo) {
       // console.log(photo);
        self.selectedphoto(photo);
        fullscreen = true;
    };

    self.getphotolist = function () {

     $.ajax({
        type: "GET",
        url: ws_base_url + "API/photos/?schoolid=" + self.selectedschool().schoolid,
        headers: {
            'Authorization': authToken
        },
        dataType: 'JSON',
        success: function (data) {

		//alert('success');
                  $.each(data, function() {

                    var photo = new Photo(this);
                    vm.photos.unshift(photo);

                    });
                         
            }, error: function (err) {
                    
                  //  alert('perrr');
                }
            });  

    };

    //videos
    self.videos = ko.observableArray([]);

    self.selectedvideo = ko.observable();

    self.selectvideo = function (video) {

        self.selectedvideo(video);
        //  console.log(self.selectedphoto());
    };

    self.getvideolist = function () {

     $.ajax({
        type: "GET",
        url: ws_base_url + "API/videos/?schoolid=" + self.selectedschool().schoolid,
        headers: {
            'Authorization': authToken
        },
        dataType: 'JSON',
        success: function (data) {

		//alert('success');
                  $.each(data, function() {

                    var video = new Video(this);
                    vm.videos.unshift(video);

                    });
                         
            }, error: function (err) {
                    
                  //  alert('perrr');
                }
            });  

    };

    //live
    self.livevideo = ko.observable();
    self.getlivevideo = function () {

     $.ajax({
        type: "GET",
        url: ws_base_url + "API/live/?schoolid=" + self.selectedschool().schoolid,
        headers: {
            'Authorization': authToken
        },
        dataType: 'JSON',
        success: function (data) {

		//alert('success');
                  $.each(data, function() {

                    var livevideo = new LiveVideo(this);
                    vm.livevideo(livevideo);
                    $('#liveContainer').show();
                    $('#loaderImg').hide();
                    });
                         
            }, error: function (err) {
                    
                   // alert('perrr');
                }
            });  


    };


    self.playlivevideo = function (data) {

         var videoId = getParameterByName('v', data.liveurl);
      //   alert(videoId);
       // console.log("#########" + videoId);
        window.youtube.playVideo(videoId, 0, true, false);

    };

    self.playarchivedvideo = function (video) {
        var videoId = getParameterByName('v', video.url);
     //   alert(videoId);
      //  console.log("#########" + videoId);
        window.youtube.playVideo(videoId, 0, true, false);
    };
    
}

var vm = new LyceumViewModel();

ko.applyBindings(vm);

var viewer;

var authToken = "";
var schoolId = "";
var schoolname = "";
var logourl = "";
$(document).ready(function () {

    $('#refreshButton').click(function () {
        authenticateWS();
    });

    authenticateWS();

    viewer = ImageViewer();
  

    $("#photos").on("click", ".img-view", function () {
        var imgSrc = this.src;
        viewer.show(imgSrc);
        fullscreen = true;
       // alert('sdsd');
    });

    $(".iv-close").on("click", function () {
        
        fullscreen = false;
    });


    $(".tab-content").swipe({
        swipeLeft: function () {
            showNextTab();
        } ,
         swipeRight: function () {
         showPrevTab();
        }

    });


   
    $('#btnMessageRefresh').click(function () {
        vm.messages([]);//reset
        vm.getmessagelist();
    });

    $('#btnVideoRefresh').click(function () {
        vm.videos([]);//reset
        vm.getvideolist();
    });

    $('#btnPhotoRefresh').click(function () {
        vm.photos([]);//reset
        vm.getphotolist();   
    });

    $('#btnLiveRefresh').click(function () {
        vm.livevideo(null);//reset
        vm.getlivevideo();
    });
    
   
});


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

          //   alert("auth err");
            // show retry
            $('#schoolListDiv').hide();
            $('#noNetDiv').show();

        }
    });
}

function showNextTab() {
    var $tab = $('#topMenu li .active').parent().next();
    $('#topMenu li .active').removeClass(':focus');
    $($tab).find('a').trigger('click');
}

function showPrevTab() {
    var $tab = $('#topMenu li .active').parent().prev();
    $('#topMenu li .active').removeClass(':focus');
    $($tab).find('a').trigger('click');
}

function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
}

function alertDismissed() {
    // do something
    networkerrorshown = false;
}




