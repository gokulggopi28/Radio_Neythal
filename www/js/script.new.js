var config = {
    apiKey: "AIzaSyD54-bRb2wFwLtwiwSqdzrQb58nnWyXG7Q",
    authDomain: "theeradarsan-17fff.firebaseapp.com",
    databaseURL: "https://theeradarsan-17fff.firebaseio.com",
    projectId: "theeradarsan-17fff",
    storageBucket: "theeradarsan-17fff.appspot.com",
    messagingSenderId: "1070790025350"
};
firebase.initializeApp(config);

var ws_base_url = "https://guru.techgentsia.com/webservice/";

var liveVideoCounter = 0;
var fullscreen = false;
var messagescreen = false;
var networkerrorshown = false;
//var showMsgNotification = false;



function Message(data,key) {
    var self = this;
    self.message = data.message;
    self.author = data.author;
    self.date = data.date;
    self.key = key;
}

function Photo(data,key) {
    var self = this;
    self.caption = data.caption;
    self.url = data.url;
    self.date = data.date;
    self.key = key;
}

function Video(data,key) {
    var self = this;
    self.caption = data.caption;
    self.url = data.url;
    self.date = data.date;
    self.thumbnail = data.thumbnail;
    self.key = key;
}

function LiveVideo(data) {
    var self = this;
    self.caption = data.caption;
    self.liveurl = data.liveurl;
    self.date = data.date;
    self.thumbnail = data.thumbnail;
}


function HomeScreenInfo(data) {
    var self = this;
    self.title = data.title;
    self.description = data.description;
}

function GHSSTViewModel() {

    var self = this;
    //messages
    self.messages = ko.observableArray([]);

    self.selectedmessage = ko.observable();

    self.selectmessage = function (message) {

        self.selectedmessage(message);
        //  console.log(self.selectedmessage());
    };

    self.getmessagelist = function () {

       // alert('getmessagelist');

        var messagesRef = firebase.database().ref('messages/');
        /*
        messagesRef.orderByChild("language").equalTo("english").on("child_added", function (snapshot) {

            if (snapshot.val() !== null) {
                var message = new Message(snapshot.val(), snapshot.key);
                vm.messages.unshift(message);
            }

        });

        */
        /*
        messagesRef.once('value', function (msgSnapshot) {
            showMsgNotification = true;
            msgSnapshot.forEach(function (snapshot) {         
                if (snapshot.val() !== null) {
                    var message = new Message(snapshot.val(), snapshot.key);
                    vm.messages.unshift(message);
                 
                }
            }
            )});

       

        messagesRef.on('child_added', function (snapshot) {

          //  if (!showMsgNotification) return;

            if (snapshot.val() !== null) {
                var message = new Message(snapshot.val(), snapshot.key);
                vm.messages.unshift(message);
                navigator.notification.beep(1);
                $('#messageNoti').show();
            }
        });
        */
        
        messagesRef.on('child_added', function (snapshot) {

            if (snapshot.val() !== null) {
                var message = new Message(snapshot.val(), snapshot.key);
                message.message = replaceURLWithHTMLLinks(message.message);
                vm.messages.unshift(message);
            }

        });
        
        messagesRef.on('child_removed', function (snapshot) {

            if (snapshot.val() !== null) {
                var removedmessage = new Message(snapshot.val(), snapshot.key);

                var matchedmessage = ko.utils.arrayFirst(self.messages(), function (message) {
                    return message.key === removedmessage.key;
                });

                if (matchedmessage) {
                    self.messages.remove(matchedmessage);
                }
            }

        });


    };

    //photos
    self.photos = ko.observableArray([]);

    self.selectedphoto = ko.observable();

    self.selectphoto = function (photo) {
       // console.log(photo);
        self.selectedphoto(photo);
        //  $('#selectedImgCaption').text(photo.caption);
       // $('#selectedImgCaption').text("Tap photo for zooming");

     //   $('#selectedImg').attr('src', photo.url);
        fullscreen = true;
        //  console.log(self.selectedphoto());
    };

    self.getphotolist = function () {
      
        var photosRef = firebase.database().ref('photos/');
        //  photosRef.orderByChild("reversetime");
        photosRef.on('child_added', function (snapshot) {

            if (snapshot.val() !== null) {
                var photo = new Photo(snapshot.val(), snapshot.key);
                vm.photos.unshift(photo);
            }

        });

        photosRef.on('child_removed', function (snapshot) {

            if (snapshot.val() !== null) {
                var removedphoto = new Photo(snapshot.val(), snapshot.key);

                var matchedphoto = ko.utils.arrayFirst(self.photos(), function (photo) {
                    return photo.key === removedphoto.key;
                });

                if (matchedphoto) {
                    self.photos.remove(matchedphoto);
                }
            }

        });


        photosRef.on('child_changed', function (snapshot) {

            if (snapshot.val() !== null) {
                var changedphoto = new Photo(snapshot.val(), snapshot.key);

                var matchedphoto = ko.utils.arrayFirst(self.photos(), function (photo) {
                    return photo.key === changedphoto.key;
                });
                if (matchedphoto) {

                    self.photos.replace(matchedphoto, changedphoto);

                }
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



        var videosRef = firebase.database().ref('videos/');
        videosRef.on('child_added', function (snapshot) {

            if (snapshot.val() !== null) {
                var video = new Video(snapshot.val(), snapshot.key);
                vm.videos.unshift(video);
            }

        });

        videosRef.on('child_removed', function (snapshot) {

            if (snapshot.val() !== null) {
                var removedvideo = new Video(snapshot.val(), snapshot.key);

                var matchedvideo = ko.utils.arrayFirst(self.videos(), function (video) {
                    return video.key === removedvideo.key;
                });
                if (matchedvideo) {

                    self.videos.remove(matchedvideo);
                }
            }

        });

        videosRef.on('child_changed', function (snapshot) {

            if (snapshot.val() !== null) {
                var changedvideo = new Video(snapshot.val(), snapshot.key);

                var matchedvideo = ko.utils.arrayFirst(self.videos(), function (video) {
                    return video.key === changedvideo.key;
                });
                if (matchedvideo) {

                    self.videos.replace(matchedvideo, changedvideo);

                }
            }

        });
    };

    //live
    self.livevideo = ko.observable();
    self.getlivevideo = function () {

       // alert('getlivevideo');
        var liveVideoRef = firebase.database().ref('livevideo/');
        liveVideoRef.on('value', function (snapshot) {
            if (liveVideoCounter === 0) { //onload 
                $('#liveContainer').show();
                $('#loaderImg').hide();
                vm.livevideo(snapshot.val());
                liveVideoCounter++;
               
            }
            else {// on live update
                $('#liveContainer').show();
                $('#loaderImg').hide();
                $('#liveDiv').show();
                $('#latestDiv').text("New Live Video!");
                vm.livevideo(snapshot.val());
                liveVideoCounter++;
              
            }

        });

    };

    //home screen info
    self.homescreeninfo = ko.observable();
    self.gethomescreeninfo = function () {

        var homescreeninfoRef = firebase.database().ref('homescreeninfo/');
        homescreeninfoRef.on('value', function (snapshot) {
            vm.homescreeninfo(snapshot.val());
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
    

    self.postmessage = function () {



        //call php WS to post new msg
        var author = $('#txtname').val();
        var message = $('#txtmessage').val();
        if (author === "" || message === "") {

        navigator.notification.alert(
        'Please enter the message and name',  // message
        alertDismissed,         // callback
        'Need more info',            // title
        'Done'                  // buttonName
         );

           // alert('Please enter the message and name');
            return false;
        }
        $.ajax({
            type: "POST",
            url: ws_base_url + "postmessage",
            data: {
                name: author,
                new_messages: message
            },
            dataType: 'JSON',
            success: function () {
                navigator.notification.alert(
                "Waiting for admin's approval",  // message
                alertDismissed,         // callback
                'Message posted',            // title
                'Done'                  // buttonName
                 );
                $('#newMessage').modal('close');
                $('#txtname').val('');
                $('#txtmessage').val('');
                messagescreen = false;
             
            }, error: function () {

                 navigator.notification.alert(
                'Could not post the message.Please try again',  // message
                alertDismissed,         // callback
                'Server is not reachable!',            // title
                'Done'                  // buttonName
                 );
                
            }
        });

    };

}

var vm = new GHSSTViewModel();

ko.applyBindings(vm);

var indexPage = 1;


var viewer;
$(document).ready(function () {

    viewer = ImageViewer();

    $("#photos").on("click", ".img-view", function () {
        var imgSrc = this.src;
        viewer.show(imgSrc);
        fullscreen = true;
       // alert('sdsd');
    });

    $('.modal').modal();

    $('#btnNewMsg').click(function () {
        messagescreen = true;
    });

    $('#btnMsgClose').click(function () {
        messagescreen = false;
        $('#newMessage').modal('close');
    });
    
    

    $(".tab-content").swipe({
        swipeLeft: function () {
            showNextTab();
        } ,
         swipeRight: function () {
         showPrevTab();
        }

    });

    $('#page4').click(function () {

        $('#addNewMsg').show();
        $('#messageNoti').hide();
    });
    $('#page3').click(function () {
        $('#addNewMsg').hide();
        $('#photoNoti').hide();
    });
    $('#page2').click(function () {
        $('#addNewMsg').hide();
        $('#videoNoti').hide();
    });
    $('#page1').click(function () {
        $('#addNewMsg').hide();
        $('#liveNoti').hide();
    });

    vm.gethomescreeninfo();
    vm.getlivevideo();
    vm.getmessagelist();
    vm.getphotolist();
    vm.getvideolist();


   
});


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



