$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {

        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].link + "</p>");    }
});

$(document).on("click", "p", function() {
    $("#notes").empty();

    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function(data) {
        console.log(data);
        console.log("ID: " + thisId);

        $("#notes").append("<h4>" + data.headline + "</h4>");
        $("#notes").append("<h5> Title </h5>");
        $("#notes").append("<input id='titleinput' name='title' class='form-control' >");
        $("#notes").append("<h5> Note </h5>")
        $("#notes").append("<textarea id='bodyinput' name='body' class='form-control'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='save' class='btn btn-dark'>Save Note</button>");

        if (data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

$(document).on("click", "#save", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    }).then(function(data) {
        console.log(data);
        $("#notes").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});


