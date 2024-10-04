var key = "apikey=3695b132";
var link = "https://www.omdbapi.com/?";
var page = 1;
var name;
var blocking = false;

$(window).scroll(checkLock);
$('#close').on('click', function() {
    $('#modalCenter').fadeOut();
    clearModal();
});

function showCovers() {
    $('#movies').empty();
    page = 1;
    name = $('#name').val();
    addCovers();
}

function checkLock() {
    if (!blocking) {
        addCovers();
    }
}

function addCovers() {
    if (($(window).scrollTop() + $(window).height() >= $(document).height() - 100)) {
        $('#load').show();
        blocking = true;
        var api = link + "s=" + encodeURIComponent(name) + "&page=" + page + "&" + key;

        $.ajax({
            url: api,
            success: function(answer) {
                layoutCovers(answer);
            },
            error: function() {
                console.log("Information could not be obtained");
            }
        });
        page++;
    }
}

function layoutCovers(films) {
    if (films.Search) {
        $.each(films.Search, function(indice, element) {
            var film = $('<div>');
            film.attr('id', element.imdbID);
            $(film).on("click", () => searchFilm(element.imdbID));
            $(film).attr('class', 'card col-12 col-sm-6 col-lg-3');
            var containerCover = $("<div>");
            $(containerCover).attr('id', 'imgFilm');
            var cover = $('<img>');
            $(cover).attr("src", element.Poster !== "N/A" ? element.Poster : 'assets/img/notFound.jpg');
            $(cover).attr("class", "card-img-top");

            var body = $("<div>").attr("class", "card-img-overlay d-flex align-items-center justify-content-center titlefilm");
            body.mouseenter(function() {
                $(containerCover).css({ "opacity": "0.3", "transition": "1s" });
            }).mouseleave(function() {
                $(containerCover).css({ "opacity": "1", "transition": "1s" });
            });

            var title = $("<h5>").attr("class", "card-title").text(element.Title);
            $(containerCover).append(cover);
            $(film).append(containerCover);
            $(body).append(title);
            $(film).append(body);
            $('#movies').append(film);
        });
    }
    $('#load').hide();
    blocking = false;
}

function searchFilm(id) {
    var api = link + 'i=' + id + "&" + key;
    $('#load').show();
    $.ajax({
        url: api,
        success: function(answer) {
            layoutModal(answer);
        },
        error: function() {
            console.log("Could not get information");
        }
    });
    $('#load').hide();
}

function clearModal() {
    $('i').attr('class', 'far fa-star');
    $('#genre, #release, #director, #writer, #actors, #plot').text("");
}

function putStars(imdbRating) {
    var rating = parseInt(imdbRating.split(".")[0]);
    let star = parseInt(rating / 2);
    $('i:lt(' + star + ')').attr("class", "fas fa-star");
    if (rating % 2 === 1) {
        $('i:eq(' + star + ')').attr("class", "fas fa-star-half-alt");
    }
}

function layoutModal(data) {
    $('#modalTitle').text(data.Title);
    $('#img').attr("src", data.Poster !== "N/A" ? data.Poster : 'assets/img/notFound.jpg');
    $('#genre').text(data.Genre);
    $('#release').text(data.Released);
    $('#director').text(data.Director);
    $('#writer').text(data.Writer);
    $('#actors').text(data.Actors);
    $('#plot').text(data.Plot);
    $('#numPuntuacion').text(data.imdbRating);
    putStars(data.imdbRating);
    $('#modalCenter').fadeIn();
}
