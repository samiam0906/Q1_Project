var contentLinks = [];
var contentTitles = [];
var contentID = [];

$(document).ready(function(){

  $('select').material_select();

  var collapsibleBody = document.querySelector('.collapsible-body');
  var collapsibleHeader = document.querySelector('.collapsible-header');

  var selectForm = document.querySelector('#category');

  $('#category').on('change', function(e) {
    e.preventDefault();
    //$(".popout").html("")
    // stores the input text of the user dropdown selection
    var optionSelectedValue = selectForm.options[selectForm.selectedIndex].text;
    var submissions;
    if (optionSelectedValue === "basketball") {
      optionSelectedValue = "nba";
    }
    if (optionSelectedValue === "football") {
      optionSelectedValue = "nfl";
    }
    // returns all of the gif links, titles, and reddit ids in arrays
    $.get("https://www.reddit.com/r/" + optionSelectedValue + ".json", function(data) {

      submissions = data.data.children;
      contentLinks = [];
      contentTitles = [];
      contentID = [];
      for (var i = 0; i < submissions.length; i++) {
        // checks if submission to reddit is a video
        if (data.data.children[i].data.secure_media) {
          if (data.data.children[i].data.secure_media.oembed.type == "video") {
            // add the youtube embed urls
            if (data.data.children[i].data.domain === "youtube.com") {
              var youTubeLink = data.data.children[i].data.url.replace("watch?v=", "embed/");
              contentLinks.push(youTubeLink);
            } else if (data.data.children[i].data.domain === "youtu.be") {
              var altYouTubeLink = data.data.children[i].data.url.replace("youtu.be/", "youtube.com/embed/");
              contentLinks.push(altYouTubeLink);
            } else {
              // add the gif urls
              contentLinks.push(data.data.children[i].data.url);
            }
            // add the submission titles
            contentTitles.push(data.data.children[i].data.title);
            // add the reddit id of the submissions
            contentID.push(data.data.children[i].data.id);
          }
        }
      }
      console.log(contentLinks);




    // create an object out of the data parsed from reddit
    // redditData.id = contentID.valueOf();
    // redditData.links = contentLinks.valueOf();
    // redditData.titles = contentTitles.valueOf();



      $('.collapsible').collapsible();
      $('main').html('');
      $('main').append('<ul data-collapsible="accordion"></ul>');

      $('main ul').addClass('collapsible popout');

      for (var j = 0; j < contentTitles.length; j++) {
        $('main ul').append('<li></li>');
        // start the creation of the collapsible
        $('.collapsible').collapsible({
          accordion: false, // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
      };

      // create the collapsible
      $('.collapsible li').append('<div><i></i></div>');
      $('.collapsible li').append('<div><span></span></div>');
      $('i').addClass('material-icons');
      $('i').parent().addClass("collapsible-header hoverable");
      $('span').parent().addClass("collapsible-body");

      // adds the titles to each collapsible header
      $('.collapsible-header').each(function(index) {
        $(this).html(contentTitles[index]);
        // changes the icon next to the headers based on sport selection
        if (optionSelectedValue === "soccer") {
          $(this).prepend('<img class="bodyLogo" src="images/logo/soccer_icon2.png">');
        } else if (optionSelectedValue === "nfl") {
          $(this).prepend('<img class="bodyLogo" src="images/logo/football_icon2.png">');
        } else if (optionSelectedValue === "nba") {
          $(this).prepend('<img class="bodyLogo" src="images/logo/basketball_icon2.png">');
        } else if (optionSelectedValue === "baseball") {
          $(this).prepend('<img class="bodyLogo" src="images/logo/baseball_icon.png">');
        } else if (optionSelectedValue === "hockey") {
          $(this).prepend('<img class="bodyLogo" src="images/logo/hockey_icon.png">');
        }
      })

      // add id to the collapsible-body
      $('main ul li .collapsible-body').each(function(index) {
        $(this).attr('id', contentID[index]);
      })

      // adds the gif urls to each collapsible body
      $('.collapsible-header').click(function(e) {
        $('.collapsible-body').html("");
        var clicked = $(this).data('clicked');
        if (clicked) {
          $(this).next().html('');
        } else {
          var elementIndex = contentID.indexOf($(this).next().attr('id'));
          // $(this).next().html('<div style="width: 100%; height: 0px; position: relative; padding-bottom: 56.250%;"><iframe src=' + contentLinks[elementIndex] + '/ylhkwh '+ 'frameborder="0" width="100%" height="100%" allowfullscreen style="width: 100%; height: 100%; position: absolute;"></iframe></div>')
          $(this).next().html('<div style="width: 100%; height: 0px; position: relative; padding-bottom: 52.50%;"><iframe class="gif" src=' + contentLinks[elementIndex] + '></div>');
        }
        $(this).data("clicked", !clicked);
      })
      $('select').material_select();
    })
  });
});
