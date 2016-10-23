$('#datepicker1').daterangepicker({
    "showWeekNumbers": true,
    "startDate": "09/05/2016",
    "endDate": "10/10/2016",
    "minDate": "09/05/2016",
    "maxDate": "10/10/2016",
    "drops": "down",
    "opens": "left"
}, function(start, end, label) {

});

$('#datepicker2').daterangepicker({
    "showWeekNumbers": true,
    "startDate": "09/05/2016",
    "endDate": "10/10/2016",
    "minDate": "09/05/2016",
    "maxDate": "10/10/2016",
    "drops": "down",
    "opens": "right"
}, function(start, end, label) {

});

var steps = [{
    content: '<p>Kies welke waarden moeten worden getoond in de grafiek</p>',
    highlightTarget: true,
    nextButton: true,
    target: $('#alcohol-btn'),
    my: 'top center',
    at: 'bottom center'
}, {
    content: '<p>Kies hier een datumrange, bijvoorbeeld een overzicht van 7 dagen in plaats van een maandoverzicht</p>',
    highlightTarget: true,
    nextButton: true,
    target: $('#datepicker1'),
    my: 'top center',
    at: 'bottom center'
}, {
    content: '<p>Verander hier de lijn interpolatie, bijvoorbeeld stapsgewijze lijnen</p>',
    highlightTarget: true,
    nextButton: true,
    target: $('#step'),
    my: 'top center',
    at: 'bottom center'
}, {
    content: '<p>Klik op een punt in de grafiek om meer data over die dag te zien</p>',
    highlightTarget: true,
    nextButton: true,
    target: $('#pointer-circle'),
    my: 'top center',
    at: 'bottom center'
}]

var tour = new Tourist.Tour({
    steps: steps,
    tipClass: 'Bootstrap',
    tipOptions: {
        showEffect: 'slidein'
    }
});

tour.start();

document.getElementsByClassName('applyBtn')[0].id = 'apply1';
document.getElementsByClassName('applyBtn')[1].id = 'apply2';
