//Get params
var params = new URLSearchParams(window.location.search);

var name = params.get('name');
var room = params.get('room');

//JQuery References
var usersDiv = $('#divUsuarios');
var sendForm = $('#sendForm');
var txtMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');
var roomTitle = $('#roomTitle');
var findContact = $('#findContact');


//Setup
roomTitle.html(room);

//Rendering users Functions
function renderUsers(users) {
    var html = '';
    
    html +='<li>';
    html +='    <a href="javascript:void(0)" class="active">Room: <span> '+ params.get('room') +'</span></a>';
    html +='</li>';

    for( var i = 0; i < users.length; i++){
        html +='<li class="filt">';
        html +='    <a data-id="'+ users[i].id +'" href="javascript:void(0)"><img src="assets/images/users/1.webp" alt="user-img" class="img-circle"> <span>'+ users[i].name +' <small class="text-success">online</small></span></a>';
        html +='</li>';
    }

    usersDiv.html(html);
}

function renderMessages(message, me){
    var html = '';
    var date = new Date(message.date);
    var time = date.getHours()  + ':' + date.getMinutes();

    var adminClass = 'info';
    if(message.name === 'Admin'){
        adminClass = 'danger';
    }

    if(me){
        html +='<li class="reverse animated fadeIn">';
        html +='    <div class="chat-content">';
        html +='        <h5>'+ message.name +'</h5>';
        html +='        <div class="box bg-light-inverse">'+  message.message +'</div>';
        html +='    </div>';
        html +='    <div class="chat-img"><img src="assets/images/users/1.webp" alt="user" /></div>';
        html +='    <div class="chat-time">'+ time +'</div>';
        html +='</li>';
    }else{
        html +='<li class="animated fadeIn">';
        if(message.name !== 'Admin'){
            html +='    <div class="chat-img"><img src="assets/images/users/1.webp" alt="user" /></div>';
        }
        html +='        <div class="chat-content">';
        html +='            <h5>'+ message.name +'</h5>';
        html +='            <div class="box bg-light-'+ adminClass +'">'+ message.message +'</div>';
        html += '       </div>';
        html += '   <div class="chat-time">'+ time +'</div>';
        html +='</li>';
    }
    

    divChatbox.append(html);
}

function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}


//Listeners
usersDiv.on('click','a', function(){
    var id = $(this).data('id');
    if(id){
        console.log(id);
    }
    
});

sendForm.on('submit', function(e){
    e.preventDefault();
    if(txtMessage.val().trim().length === 0){
        return;
    }

    // Send info
    socket.emit('makeMessage', {
        message: txtMessage.val()
    }, function(resp) {
        txtMessage.val('').focus();
        renderMessages(resp, true);
        scrollBottom();
    });

});

//Filter users
findContact.on('change paste keyup', function(){
    console.log($(this).val());
    //var searchText = $(this).val();
    var filterTxt = this;
    $allListElements = $('.filt');

    var $matchingListElements = $allListElements.filter(function(i, li){
        var listItemText = $(li).text().toUpperCase(), 
            searchText = filterTxt.value.toUpperCase();
        return ~listItemText.indexOf(searchText);
    });

    $allListElements.hide();
    $matchingListElements.show();

})