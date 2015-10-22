//constructor for class Session
function Session(timerCurrentTime, timerTotalTime, timerSumupTime, timerCurrentTotalSeconds, timerSumupSeconds, intervalHandle,
                 sessionMode, pauseOn) {
    this.sTimer = timerCurrentTime;
    this.totalTime = timerTotalTime;
    this.sumupTime = timerSumupTime;
    this.currentTotalSeconds = timerCurrentTotalSeconds;
    this.sumupSeconds = timerSumupSeconds;
    this.intervalHandle = intervalHandle;
    this.sessionMode = sessionMode;
    this.pauseOn = pauseOn;

    //run initializeUI
    this.initializeUI();
}

//methods - 'class': Session

//initializeUI
Session.prototype.initializeUI = function(){

    console.log("initializeUI has run...");

    //initializeUI all listeners
    this.initializeListeners();

    console.log("initializeListeners has run...")

    //if in Clock Mode:
    if (this.sessionMode == 1) {
        //then, show system time
        this.updateClock();
        console.log("...in Clock Mode:")
    }

    //hide the controlsArea, speakerArea and logoArea DIVs
    $( "#controlsArea" ).hide();
    $( "#speakerArea" ).hide();
    $( "#logoArea" ).hide();

    /*//test - check for the document window size
    var a = $(document).width();
    var b = $(document).height();
    var c = $(window).width();
    var d = $(window).height();
    console.log('//check this in 100% zoom:');
    console.log('-document width: ' + a +', document height: ' + b + '.');
    console.log('-window width: ' + c + ', window height: ' + d + '.');*/
};

//initializeListeners
Session.prototype.initializeListeners = function(){

    //create onclick() event handlers for all buttons:
    //TIMER button
    $('#b_timer').click(function () {
        //create a new "timer" session
        mySession = new Session(0, 0, 0, 0, 0, 1);
    });
    //CLOCK button
    $('#b_clock').click(function () {
        //create a new "clock" session
        mySession = new Session(0, 0, 0, 0, 1, 1);
    });
    //Total time UP button
    $("#b_t_up").click(function () {
        //set total time up
        if (mySession.totalTime < 60) {
            mySession.totalTime += 1;
            $('#A1').text(mySession.format(mySession.totalTime));
        }
    });
    //Total time DOWN button
    $('#b_t_down').click(function () {
        //set total time down
        if (mySession.totalTime > 0 && mySession.totalTime > mySession.sumupTime) {
            mySession.totalTime -= 1;
            $('#A1').text(mySession.format(mySession.totalTime));
        }
    });
    //Sum-up time UP button
    $('#b_s_up').click(function () {
        //set sum-up time up
        if (mySession.sumupTime < mySession.totalTime) {
            mySession.sumupTime += 1;
            $('#A2').text(mySession.format(mySession.sumupTime));
        }
    });
    //Sum-up time DOWN button
    $('#b_s_down').click(function () {
        //set sum-up time down
        if (mySession.sumupTime > 0) {
            mySession.sumupTime -= 1;
            $('#A2').text(mySession.format(mySession.sumupTime));
        }
    });
    //START button
    $('#b_start').click(function () {
        mySession.startCountdown();
    });
    //PAUSE button
    $('#b_pause').attr({
        onclick: 'mySession.pause()',
        disabled: 'disabled()'
    });
    //REPEAT button
    $('#b_repeat').click(function () {
        mySession.repeat();
    });
    //CLEAR button
    $('#b_clear').click(function () {
        mySession.clear();
    });
    /*//L (=Logo) button
    $('#b_L').click(function () {
        $('#logoArea').toggle();
    });
    //S (=Speaker) button
    $('#b_S').click(function () {
        $('#speakerArea').toggle();
    });*/

    //create the "show" & "hide" listeners to the controlAreaPod DIV
    $( "#controlsAreaPod" ).mouseover(function() {
        $( "#controlsArea" ).show();
    });
    $( "#controlsAreaPod" ).mouseout(function() {
        $( "#controlsArea" ).hide();
    });

    //add keyboard listeners
    $(document).keydown(function(event) {
        console.log(event.keyCode);
        //if "space" key pressed
        if (event.keyCode == 32) {
            if (mySession.pauseOn) {
                mySession.startCountdown();
            } else {
                mySession.pause();
            }
            //else if "left-arrow" key pressed
        } else if (event.keyCode == 37) {
            mySession.repeat();
        }
    });
};

//update timer
Session.prototype.updateTimer = function(){
    $('#timer_public').text(mySession.sTimer);
};

//format display
Session.prototype.formatDisplay = function(display, time) {

    if (time < 10) {
        $('#'+display).html("0" + time + ":" + "00");
    } else {
        $('#'+display).html(time + ":" + "00");
    }
};

//format to String
Session.prototype.format = function(value) {
    if (value < 10) {
        return ("0" + value + ":" + "00");
    } else {
        return (value + ":" + "00");
    }
};

//reset timer
Session.prototype.resetTimer = function () {
    return "00:00";
};

Session.prototype.startClock = function() {

    mySession.updateClock();
    mySession.clockMode = 1;
};

//update timer to a normal clock
Session.prototype.updateClock = function () {

    myDate = new Date();

    h = myDate.getHours();
    if (h < 10) {
        h = "0" + h;
    }

    m = myDate.getMinutes();
    if (m < 10) {
        m = "0" + m;
    }
    //mySession.intervalHandle = setInterval($('#timer_public').text(h + ":" + m), 1000);
};

//start the timer
Session.prototype.startCountdown = function() {

    if (!mySession.pauseOn) {

        if (mySession.totalTime > 0) {

            //switch sessionMode from 0 to 1
            mySession.sessionMode = 1;

            //get time in seconds
            mySession.currentTotalSeconds = mySession.totalTime * 60;
            mySession.sumupSeconds = mySession.sumupTime *60;
        }
    } else {

        //switch pauseOn from true to false
        mySession.pauseOn = false;
    }
    //call the "tick" function every second
    mySession.intervalHandle = setInterval(mySession.tick, 1000);

    //enable/disable START and PAUSE buttons
    $('#b_start').attr('disabled','disabled');
    $('#b_pause').removeAttr("disabled");
};

//pause function
Session.prototype.pause = function() {

    //stop counter
    clearInterval(mySession.intervalHandle);

    //manipulate buttons
    $('#b_pause').attr('disabled','disabled');
    $('#b_start').removeAttr("disabled");

    mySession.pauseOn = true;
};

//update displays in admin and public views
Session.prototype.updateDisplays = function (currentTotalSeconds) {

    //turn the seconds into mm:ss
    var min = Math.floor(mySession.currentTotalSeconds / 60);
    var sec = mySession.currentTotalSeconds - (min * 60);

    //add a leading zero for minutes
    if (min < 10) {
        min = "0" + min;
    }

    //add a leading zero for seconds
    if (sec < 10) {
        sec = "0" + sec;
    }

    //create "time_forDisplay"
    var time_forDisplay = min.toString() + ":" + sec;

    //update displays
    //- in timer admin
    $('#A').html(time_forDisplay);

    //- in timer public
    document.getElementById("timer_public").textContent = time_forDisplay;
};

//this is the core timer function
Session.prototype.tick = function () {

    //if inside the time limit
    if (mySession.currentTotalSeconds>0 && mySession.sessionMode==1) {

        //subtract from seconds remaining
        mySession.currentTotalSeconds--;

        //if outside the time limit (or if currentTotalSeconds<=0)
    } else {

        //switch sessionMode from 1 to 3
        mySession.sessionMode = 3;

        //add to seconds remaining
        mySession.currentTotalSeconds++;
    }

    //Do the following on each 'tick':
    //update the display digits
    mySession.updateDisplays(mySession.currentTotalSeconds);

    //update the display traffic light colors
    mySession.paintTrafficLights();
};

//change public timer to the appropriate color
Session.prototype.paintTrafficLights = function() {

    countMode_sec = mySession.currentTotalSeconds - mySession.sumupSeconds;

    //if on reset
    if (mySession.sessionMode == 0 ) {
        //in public
        document.getElementById("timer_public").style.color = 'white';

        //else if (TotalTime < 'currentTick' < Sum-upTime)
    } else if ((mySession.currentTotalSeconds > 0) && (countMode_sec >= 0) && (mySession.sessionMode != 3)) {
        //in public
        document.getElementById("timer_public").style.color = 'white';

        //else if (Sum-upTime < 'currentTick' < 0)
    } else if ((mySession.currentTotalSeconds > 0) && (countMode_sec < 0) && (mySession.sessionMode != 3)) {
        //in public
        document.getElementById("timer_public").style.color = 'white';

        //if (0 < 'currentTick')
    } else if (mySession.sessionMode == 3) {
        //in public
        document.getElementById("timer_public").style.color = '#fd030d';
    }
};

//repeat function
Session.prototype.repeat = function() {

    //stop counter
    clearInterval(mySession.intervalHandle);

    //reset flags to initial state
    mySession.sessionMode = 0;
    mySession.pauseOn = false;


    //get time in seconds
    mySession.currentTotalSeconds = mySession.totalTime * 60;
    mySession.sumupSeconds = mySession.sumupTime *60;

    mySession.updateDisplays(mySession.currentTotalSeconds);

    //update the display traffic light colors
    mySession.paintTrafficLights();

    //manipulate buttons
    $('#b_pause').attr('disabled','disabled');
    $('#b_start').removeAttr("disabled");
};

//clear function
Session.prototype.clear = function() {
    //ToDo
    //refresh/reset page
    location.reload();
};

//main - triggered when document ready
$(document).ready(function() {

    //create a new object of 'class' "Session"
        //timerCurrentTime=0, timerTotalTime=0, timerSumupTime=0,
        //intervalHandle=0, sessionMode=0(timer), pauseOn=1.
    mySession = new Session(0, 0, 0, 0, 0, 1);

/*    //initializeUI
    mySession.initializeUI();*/
});
