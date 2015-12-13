'use strict';

var réciproque = {'anglais': 'francais', 'francais': 'anglais'};
var embelli = {'francais': 'Français', 'anglais': 'Anglais'};

function inverser(traductions) {
    var langue = $( "#mots" ).attr("data-langue");
    $( "#mots" ).attr("data-langue", réciproque[langue]);
    construitListe(traductions);
}

function mettreÀJourLienInversion(langue) {
    var langueSource = langue;
    var langueDestination = réciproque[langue];
    $( "#lienInversion" )
        .html(
                '<span class="mot-' + langueSource + '">'
                + embelli[langueSource]
                + '</span>'
                + ' &rarr; '
                + '<span class="mot-' + langueDestination + '">'
                + embelli[langueDestination]
                + '</span>'
          );
}

function htmlifier(mot, langue){
    var res = '<span class="mot-' + langue + '">' + mot[langue] + '</span>';
    if (langue == "francais") {
        if ("genre" in mot){
            var genre = 'N' + mot["genre"].enMajuscules();
            res += ' <span class="genre">' + genre + '</span>';
        }
        if ("classe" in mot){
            var classe = "";
            if (mot["classe"] == "groupe nominal") {
                classe = "GN";
            }
            if (mot["classe"] == "proposition") {
                classe = "Prop";
            }
            if (classe != ""){
                res += ' <span class="classe">' + classe + '</span>';
            }
        }
    }
    return res;
}

function construitListe(traductions) {
    var langue = $( "#mots" ).attr("data-langue");

    mettreÀJourLienInversion(langue);

    traductions = traductions["vrais mots"].concat(traductions["faux mots"]);
    // trier par ordre alphabétique de la langue de départ
    traductions.trier(function(traduction1, traduction2){
        var s1 = traduction1[langue].enMinuscules().sansAccents();
        var s2 = traduction2[langue].enMinuscules().sansAccents();
        if (s1 > s2) {
            return 1;
        }
        if (s2 > s1) {
            return -1;
        }
        return 0;
    });

    $( "#mots" ).html("");
    $( "#index" ).html("");

    var l = '';
    for (var i=0; i < traductions.longueur(); i++) {
        var mot = traductions[i];
        var c = mot[langue].caractereA(0).enMajuscules().sansAccents();


        if (c != l) {
            l = c;
            $( "#index" ).ajouter(
                    $("<a></a>")
                        .attr("href", "#" + l)
                        .html(l)
                    );
            $( "#mots" ).ajouter(
                    $("<div></div>")
                        .attr("class", "groupe-lettre")
                        .append($("<a></a>").attr("name", l))
                        .append($("<h3></h3>").html(l))
                    );
        }

        $( "#mots" )
            .enfants()
            .dernier()
            .ajouter(
                $("<div></div>")
                    .attr("class", "definition")
                    .html(
                        '· '
                        + htmlifier(mot, langue)
                        + ' : '
                        + htmlifier(mot, réciproque[langue])
                        )
            );
    }
}

$(function() {
    $.recupererJSON( "traductions.json", function( traductions ) {
        construitListe(traductions);
        $( "#lienInversion" ).clic( function() {inverser(traductions);} );
    });
});

