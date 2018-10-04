var url = "https://trainschedulerutgers.firebaseio.com/";
var dataRef = new Firebase(url);
var name = '';
var destination = '';
var firstTrainTime = '';
var frequency = '';
var nextTrain = '';
var nextTrainFormatted = '';
var minutesAway = '';
var firstTimeConverted = '';
var currentTime = '';
var diffTime = '';
var tRemainder = '';
var minutesTillTrain = '';
var keyHolder = '';
var getKey = '';


$(document).ready(function () {

  $("#add-train").on("click", function () {

    name = $('#name-input').val().trim();
    destination = $('#destination-input').val().trim();
    firstTrainTime = $('#first-train-time-input').val().trim();
    frequency = $('#frequency-input').val().trim();
    firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    currentTime = moment();
    diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    tRemainder = diffTime % frequency;
    minutesTillTrain = frequency - tRemainder;
    nextTrain = moment().add(minutesTillTrain, "minutes");
    nextTrainFormatted = moment(nextTrain).format("hh:mm");


    keyHolder = dataRef.push({
      name: name,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      nextTrainFormatted: nextTrainFormatted,
      minutesTillTrain: minutesTillTrain
    });


    $('#name-input').val('');
    $('#destination-input').val('');
    $('#first-train-time-input').val('');
    $('#frequency-input').val('');

    return false;
  });

  dataRef.on("child_added", function (childSnapshot) {
    
    $('.train-schedule').append("<tr class='table-row' id=" + "'" + childSnapshot.key() + "'" + ">" +
      "<td class='col-xs-3'>" + childSnapshot.val().name +
      "</td>" +
      "<td class='col-xs-2'>" + childSnapshot.val().destination +
      "</td>" +
      "<td class='col-xs-2'>" + childSnapshot.val().frequency +
      "</td>" +
      "<td class='col-xs-2'>" + childSnapshot.val().nextTrainFormatted +
      "</td>" +
      "<td class='col-xs-2'>" + childSnapshot.val().minutesTillTrain +
      "</td>" +
      "<td class='col-xs-1'>" + "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>" + "</td>" +
      "</tr>");
  });

  $("body").on("click", ".remove-train", function () {
    $(this).closest('tr').remove();
    getKey = $(this).parent().parent().attr('id');
    dataRef.child(getKey).remove();
  });

// I got below code from Alex, I couldn't figure out how to get mine to update the firebase over time, Alex showed me his but I coulldn't
// really figure out how to apply it to mine.
// I figured out what I need to do but don't have the time to fix it
// I am doing the math BEFORE pushing into firebase so firebase only has a static calculation
// I need to push everything in and do the calculation as I am appending it

  function timeUpdater() {
    dataRef.ref().child('trains').once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
        fbTime = moment().format('X');
        dataRef.ref('trains/' + childSnapshot.key).update({
          currentTime: fbTime,
          })
      })
    });
  }

  setInterval(timeUpdater, 30000);

  dataRef.on("child_updated", function (childSnapshot) {


    $('.train-schedule').append("<tr class='table-row' id=" + "'" + childSnapshot.key() + "'" + ">" +
      "<td class='col-xs-3'>" + childSnapshot.val().name +
      "</td>" +
      "<td class='col-xs-2'>" + childSnapshot.val().destination +
      "</td>" +
      "<td class='col-xs-2'>" + childSnapshot.val().frequency +
      "</td>" +
      "<td class='col-xs-2'>" + childSnapshot.val().nextTrainFormatted +
      "</td>" +
      "<td class='col-xs-2'>" + childSnapshot.val().minutesTillTrain +
      "</td>" +
      "<td class='col-xs-1'>" + "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>" + "</td>" +
      "</tr>");
  });


});
