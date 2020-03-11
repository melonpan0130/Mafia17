var socket = io();
var name, Roomcode;


$("#popup>table input").keyup(() => {
    if(window.event.keyCode == 13) {
        validation();
    }
})

function validation() {
    var name = document.getElementById('name');
    var room = document.getElementById('room');

    if(name.value == ''){
        alert('Please Write on your name.');
        name.focus();
    }
    else if(room.value == ''){
        alert('Please Write on your room code.');
        room.focus();
    }
    else
        enter();
}

function enter(){
    name = document.getElementById('name').value;
    Roomcode = document.getElementById('room').value;
    
    $("#popup").css('display', 'none');


    socket.emit('joinRoom', Roomcode, name);

    $('.normal').submit( () => {
        if($('#m').val() != '') {
            socket.emit('chat message', Roomcode, name, $('#m').val());
            $('#m').val('');
        }
        else ;
        return false;
    });

    socket.on('chat message', (name, msg) => {
        if(this.name == name)
            $('#messages').append($('<li>').text(msg).addClass('me'));
        else $('#messages').append($('<li>').text(name + '  :  ' +msg));

        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    });

    socket.on('joined', (Roomcode, name, players) => {
        $('#messages').append($('<li>').text(name + ' joined '+Roomcode + ':)').addClass('notice'));

        $('#guess>div:first-child').empty();
        playerJobs.push();

        countingPeople(players)
    });
    
};

function exit() {
    var exit = confirm('Are you sure to exit?');
    if(exit){
        alert('Exited');
        socket.emit('leave', Roomcode, name);
        countingPeople(players)
        window.location.reload();
    }
}

$(window).bind("beforeunload", function() {
    socket.emit('leave', Roomcode, name);
    countingPeople(players)
    window.location.reload();
    // return ;
})

function countingPeople(players) {
    for(var i=0; i<players.length; i++)
        $('#guess>div:first-child').append($('<div class="people">').append('<div class="face">').append('<p>'+players[i].name+'</p>'));
}