//constructor for class Session
function Session(sessionMode) {

    this.sessionMode = sessionMode;

    //run initializeUI
    this.initializeUI();

    //start a new Timer or Clock session
    if (sessionMode == 0) {
        myTimerSession = new TimerSession(0, 0, 0, 0, 0, 0, 0);
    } else if (sessionMode == 1) {
        myClockSession = new ClockSession();
    }
    console.log("sessionMode = " + sessionMode)
}

//methods - 'class': Session

//initializeUI
Session.prototype.initializeUI = function(){

    console.log("initializeUI has run...");

    //initializeUI all listeners
    this.initializeListeners();

    console.log("initializeListeners has run...")

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
        myTimerSession = new TimerSession();
    });
    //CLOCK button
    $('#b_clock').click(function () {
        //create a new "clock" session
        myClockSession = new ClockSession();
    });
    //Total time UP button
    $("#b_t_up").click(function () {
        //increase total time
        myTimerSession.increaseTotalTime();
    });
    //Total time DOWN button
    $('#b_t_down').click(function () {
        //decrease total time
        myTimerSession.decreaseTotalTime();
    });
    /*//Sum-up time UP button
    $('#b_s_up').click(function () {
        //set sum-up time up
        if (myTimerSession.sumupTime < myTimerSession.totalTime) {
            myTimerSession.sumupTime += 1;
            $('#A2').text(myTimerSession.format(myTimerSession.sumupTime));
        }
    });
    //Sum-up time DOWN button
    $('#b_s_down').click(function () {
        //set sum-up time down
        if (myTimerSession.sumupTime > 0) {
            myTimerSession.sumupTime -= 1;
            $('#A2').text(myTimerSession.format(myTimerSession.sumupTime));
        }
    });*/
    //START button
    $('#b_start').click(function () {
        myTimerSession.startCountdown();
    });
    //PAUSE button
    $('#b_pause').attr({
        onclick: 'myTimerSession.pause()',
        disabled: 'disabled()'
    });
    //REPEAT button
    $('#b_repeat').click(function () {
        myTimerSession.repeat();
    });
    //CLEAR button
    $('#b_clear').click(function () {
        myTimerSession.clear();
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

//constructor for class TimerSession
function TimerSession(timerCurrentTime, timerTotalTime, timerSumupTime, timerCurrentTotalSeconds, timerSumupSeconds, intervalHandle,
                 pauseOn) {
    this.sTimer = timerCurrentTime;
    this.totalTime = timerTotalTime;
    this.sumupTime = timerSumupTime;
    this.currentTotalSeconds = timerCurrentTotalSeconds;
    this.sumupSeconds = timerSumupSeconds;
    this.intervalHandle = intervalHandle;
    this.pauseOn = pauseOn;

    //stop the Timer's intervalHandle
    clearInterval(myClockSession.intervalHandle);

    //Show timerControls buttons
    $( "#timerControls" ).show();

    //Display Tiimer
    $('#display').text("00:00");


}

//Increase total time (used by buttons' listeners)
TimerSession.prototype.increaseTotalTime = function() {

    if (myTimerSession.totalTime < 60) {
        myTimerSession.totalTime += 1;
        $('#A1').text(myTimerSession.format(myTimerSession.totalTime));
    }
};

//Decrease total time (used by buttons' listeners)
TimerSession.prototype.decreaseTotalTime = function() {

    if (myTimerSession.totalTime > 0 && myTimerSession.totalTime > myTimerSession.sumupTime) {
        myTimerSession.totalTime -= 1;
        $('#A1').text(myTimerSession.format(myTimerSession.totalTime));
    }
};

//update timer
TimerSession.prototype.updateTimer = function(){
    $('#display').text(mySession.sTimer);
};

//format display
TimerSession.prototype.formatDisplay = function(display, time) {

    if (time < 10) {
        $('#display').html("0" + time + ":" + "00");
    } else {
        $('#display').html(time + ":" + "00");
    }
};

//format to String
TimerSession.prototype.format = function(value) {
    if (value < 10) {
        return ("0" + value + ":" + "00");
    } else {
        return (value + ":" + "00");
    }
};

//reset timer
TimerSession.prototype.resetTimer = function () {
    return "00:00";
};

TimerSession.prototype.startClock = function() {

    myTimerSession.updateClock();
    myTimerSession.clockMode = 1;
};

//start the timer
TimerSession.prototype.startCountdown = function() {

    if (!myTimerSession.pauseOn) {

        if (myTimerSession.totalTime > 0) {

            //switch sessionMode from 0 to 1
            myTimerSession.sessionMode = 1;

            //get time in seconds
            myTimerSession.currentTotalSeconds = myTimerSession.totalTime * 60;
            myTimerSession.sumupSeconds = myTimerSession.sumupTime *60;
        }
    } else {

        //switch pauseOn from true to false
        myTimerSession.pauseOn = false;
    }
    //call the "tick" function every second
    myTimerSession.intervalHandle = setInterval(myTimerSession.tick, 1000);

    //enable/disable START and PAUSE buttons
    $('#b_start').attr('disabled','disabled');
    $('#b_pause').removeAttr("disabled");
};

//pause function
TimerSession.prototype.pause = function() {

    //stop counter
    clearInterval(myTimerSession.intervalHandle);

    //manipulate buttons
    $('#b_pause').attr('disabled','disabled');
    $('#b_start').removeAttr("disabled");

    myTimerSession.pauseOn = true;
};

//update displays in admin and public views
TimerSession.prototype.updateDisplays = function (currentTotalSeconds) {

    //turn the seconds into mm:ss
    var min = Math.floor(myTimerSession.currentTotalSeconds / 60);
    var sec = myTimerSession.currentTotalSeconds - (min * 60);

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
    document.getElementById("display").textContent = time_forDisplay;
};

//this is the core timer function
TimerSession.prototype.tick = function () {

    //if inside the time limit
    if (myTimerSession.currentTotalSeconds>0 && myTimerSession.sessionMode==1) {

        //subtract from seconds remaining
        myTimerSession.currentTotalSeconds--;

        //if outside the time limit (or if currentTotalSeconds<=0)
    } else {

        //switch sessionMode from 1 to 3
        myTimerSession.sessionMode = 3;

        //add to seconds remaining
        myTimerSession.currentTotalSeconds++;
    }

    //Do the following on each 'tick':
    //update the display digits
    myTimerSession.updateDisplays(myTimerSession.currentTotalSeconds);

    //update the display traffic light colors
    myTimerSession.paintTrafficLights();
};

//change public timer to the appropriate color
TimerSession.prototype.paintTrafficLights = function() {

    countMode_sec = myTimerSession.currentTotalSeconds - myTimerSession.sumupSeconds;

    //if on reset
    if (myTimerSession.sessionMode == 0 ) {
        //in public
        document.getElementById("display").style.color = 'white';

        //else if (TotalTime < 'currentTick' < Sum-upTime)
    } else if ((myTimerSession.currentTotalSeconds > 0) && (countMode_sec >= 0) && (myTimerSession.sessionMode != 3)) {
        //in public
        document.getElementById("display").style.color = 'white';

        //else if (Sum-upTime < 'currentTick' < 0)
    } else if ((myTimerSession.currentTotalSeconds > 0) && (countMode_sec < 0) && (myTimerSession.sessionMode != 3)) {
        //in public
        document.getElementById("display").style.color = 'white';

        //if (0 < 'currentTick')
    } else if (myTimerSession.sessionMode == 3) {
        //in public
        document.getElementById("display").style.color = '#fd030d';
    }
};

//repeat function
TimerSession.prototype.repeat = function() {

    //stop counter
    clearInterval(myTimerSession.intervalHandle);

    //reset flags to initial state
    myTimerSession.sessionMode = 0;
    myTimerSession.pauseOn = false;


    //get time in seconds
    myTimerSession.currentTotalSeconds = myTimerSession.totalTime * 60;
    myTimerSession.sumupSeconds = myTimerSession.sumupTime *60;

    myTimerSession.updateDisplays(myTimerSession.currentTotalSeconds);

    //update the display traffic light colors
    myTimerSession.paintTrafficLights();

    //manipulate buttons
    $('#b_pause').attr('disabled','disabled');
    $('#b_start').removeAttr("disabled");
};

//clear function
TimerSession.prototype.clear = function() {
    //ToDo
    //refresh/reset page
    location.reload();
};

//constructor for class ClockSession
function ClockSession() {

    //stop the Timer's intervalHandle
    clearInterval(myTimerSession.intervalHandle);

    //get updated time
    myDate = new Date();
    h = myDate.getHours();
    if (h < 10) {
        h = "0" + h;
    }
    m = myDate.getMinutes();
    if (m < 10) {
        m = "0" + m;
    }

    //Construct Clock string
    myClockString = h + ":" + m ;

    //Display Clock string
    $('#display').text(myClockString);

    //start animation
    myTimerSession.intervalHandle = setInterval(update, 1000);

    //Hide timerControls buttons
    $( "#timerControls" ).hide();
}

//Clock - update function
function update() {

    //get updated time
    myDate = new Date();
    h = myDate.getHours();
    if (h < 10) {
        h = "0" + h;
    }
    m = myDate.getMinutes();
    if (m < 10) {
        m = "0" + m;
    }

    //Construct Clock string
    myClockString = h + ":" + m ;

    //Display Clock string
    $('#display').text(myClockString);
}

//main - triggered when document ready
$(document).ready(function() {

    //create a new object of 'class' "Session"
    //sessionMode=0(Timer), sessionMode=1(Clock). Current default setting: Timer
    mySession = new Session(0);
});
