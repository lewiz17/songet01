/** Enable voice search **/
// set up

var language = 'es-CO';
showInfo('info_start');

var final_transcript = '';
var recognizing = false;
var ignore_onend;

var recognition;

setUp();

function setUp() {
  if (!('webkitSpeechRecognition' in window)) {
    upgrade();
  } else {
    start_button.style.display = 'inline-block';
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
      recognizing = true;
      showInfo('info_speak_now');
      document.querySelectorAll(".btn-mic i")[0].innerHTML = "";
      document.querySelectorAll(".btn-mic i")[0].innerHTML = "mic";
      document.querySelectorAll(".btn-mic i")[0].style.color = "#f00";
      document.querySelectorAll(".btn-mic i")[0].className += " mic_active"
    };

    recognition.onerror = function(event) {
      if (event.error == 'no-speech') {
        document.querySelectorAll(".btn-mic i")[0].innerHTML = "";
        document.querySelectorAll(".btn-mic i")[0].innerHTML = "mic";
        document.querySelectorAll(".btn-mic i")[0].style.color = "#616161";
        document.querySelectorAll(".btn-mic i")[0].classList.remove("mic_active");
        showInfo('info_no_speech');
        ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        document.querySelectorAll(".btn-mic i")[0].innerHTML = "";
        document.querySelectorAll(".btn-mic i")[0].innerHTML = "mic";
        document.querySelectorAll(".btn-mic i")[0].style.color = "#616161";
        document.querySelectorAll(".btn-mic i")[0].classList.remove("mic_active");
        showInfo('info_no_microphone');
        ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
          showInfo('info_blocked');
        } else {
          showInfo('info_denied');
        }
        ignore_onend = true;
      }
    };

    recognition.onend = function() {
      recognizing = false;
      if (ignore_onend) {
        return;
      }
      document.querySelectorAll(".btn-mic i")[0].innerHTML = "";
      document.querySelectorAll(".btn-mic i")[0].innerHTML = "mic";
      document.querySelectorAll(".btn-mic i")[0].style.color = "#616161";
      document.querySelectorAll(".btn-mic i")[0].classList.remove("mic_active");
      if (!final_transcript) {
        showInfo('info_start');
        return;
      }
      showInfo('');
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(document.getElementById('final_span'));
        window.getSelection().addRange(range);
      }
    };

    recognition.onresult = function(event) {
      var interim_transcript = '';
      if (typeof(event.results) == 'undefined') {
        recognition.onend = null;
        recognition.stop();
        upgrade();
        return;
      }
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      // final_transcript = capitalize(final_transcript);
      // final_span.innerHTML = linebreak(final_transcript);
      // interim_span.innerHTML = linebreak(interim_transcript);
      final_span.innerHTML = final_transcript;
      interim_span.innerHTML = interim_transcript;
    };
  }
}

function upgrade() { // tell user to upgrade &/or use Chrome
  start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');
}

// var two_line = /\n\n/g;
// var one_line = /\n/g;
// function linebreak(s) {
//   return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
// }

// var first_char = /\S/;
// function capitalize(s) {
//   return s.replace(first_char, function(m) { return m.toUpperCase(); });
// }

// start listening right away, so it's completely hands-free

function startButton(event) {
  if (recognizing) {
    recognition.stop();
    txt_final = document.querySelectorAll('#final_span')[0].textContent;
    document.querySelectorAll('#sh-input')[0].value = txt_final;
    return;
  }
  final_transcript = '';
  recognition.lang = language;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  document.querySelectorAll(".btn-mic i")[0].innerHTML = "";
    document.querySelectorAll(".btn-mic i")[0].innerHTML = "mic_off";
    document.querySelectorAll(".btn-mic i")[0].style.color = "#616161";
    document.querySelectorAll(".btn-mic i")[0].classList.remove("mic_active");
  showInfo('info_allow');
  
  start_timestamp = event.timeStamp;
}

function showInfo(info_id) {
  
  // try: comment out the contents of this function
  
  if (info_id) {
    for (var child = info.firstChild; child; child = child.nextSibling) {
      if (child.style) {
        child.style.display = child.id == info_id ? 'inline' : 'none';
      }
    }
    info.style.visibility = 'visible';
  } else {
    info.style.visibility = 'hidden';
  }
}
