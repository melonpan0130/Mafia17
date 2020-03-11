var startTime;
var jobs = ['마피아', '의사', '경찰', '시민', '영매', '정치인', '스파이'];
var statusMsg = ['밤이 되었습니다.', '아침이 밝았습니다.', '투표 시간입니다.', '최후의 반론'];
var statusTime = [30, 120, 20, 10];
// var statusTime = [5, 5, 5, 5];
var status = 0;
var playerJobs = new Array;
var playerNames;

// team
var mafia = 1;
var citizen = 2;

socket.on('gamestart', (players)=> {
    startTime = Date();

    playerNames = players;
    
    $('#guess>div:last-child>div').removeClass('buttons').addClass('gameGuess').toggleClass('hidden');
    $('#messages').empty();
    $('#messages').append($('<li>').text(statusMsg[status]).addClass('notice'));
    MixedJobs(); // return player's id
    $('#messages').append($('<li>').text('당신의 직업은 '+jobs[0]+'입니다.').addClass('notice'));
    console.log(jobs);
    timer();
    // alert('Game start!');
    alert(players.length)
});

function timer() {
    time = statusTime[status];
    setInterval(()=> {
        if(time < 0) {
            status = (Number(status)+1)%4;
            time = statusTime[status];
            $('#messages').append($('<li>').text(statusMsg[status]).addClass('notice'));

            if(status == 0) {
                $('form').submit(() => {
                    socket.emit('chat at night', Roomcode, name, $('#m').val());
                    $('#m').val('');
                });
                // night();
            }
            else if(status == 1) morning();
            else if(status == 2) vote();
            else if(status == 3) will();
        }
        
        $('#status').text(statusMsg[status]+' ('+time+')');
        time--;
    }, 1000);
}

function night() {
    // 같은 직업끼리 대화 가능
    $('#chatting>form').removeClass('willChat');
    $('#chatting>form').addClass('nightChat');
    $('.nightChat').submit( () => {
        socket.emit('chat at night', Roomcode, name, $('#m').val());
        $('#m').val('');
    });

    socket.on('chat at night', (name, msg) => {
        $('#messages').append($('<li>').text(name + '(night) :  ' +
        msg));
    });
}

function morning() {
    // 모두와 대화 가능
    $('#chatting>form').removeClass('nightChat');
    $('#chatting>form').addClass('normal');
    
}

function vote() {
    // 모두와 대화 가능
    // 투표
}

function will() {
    // 지목 당한 사람만 대화 가능
    $('#chatting>form').removeClass('normal');
    $('#chatting>form').addClass('willChat');
}


function gameStart() {
    if(false) // $('.gameGuess>div').length < 2)
        alert('4명 이상이어야 합니다.');
    else {
        socket.emit('starting', Roomcode);
    }
}

function MixedJobs() {
    var people;// = $('#guess>.gameGuess:first-child>div').length;
    console.log("mix");
    people = playerNames;
    for(var i=0; i<people; i++){
        playerJobs[i] = i;
    }
    var temp;
    for(var i=0; i<10; i++) {
        temp = playerJobs[0];
        playerJobs[0] = playerJobs[Math.random()%people];
        playerJobs[Math.random()%people] = temp;
    }
    console.log(playerJobs);
}
