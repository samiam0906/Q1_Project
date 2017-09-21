var contentLinks = [];
var contentTitles = [];
var contentID = [];
var comments = [];

$(document).ready(function(){

  $('select').material_select();

  var anchor = document.createElement('a');

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
            } else if (data.data.children[i].data.domain === "m.youtube.com") {
              var mobileYouTubeLink = data.data.children[i].data.url.replace("m.youtube.com/watch?v=", "youtube.com/embed/");
              contentLinks.push(mobileYouTubeLink);
            } else if (data.data.children[i].data.domain === "imgur.com") {
              var imgurLink = data.data.children[i].data.url + '/embed';
              contentLinks.push(imgurLink);
            } else {
              // add the gif urls
              contentLinks.push(data.data.children[i].data.url);
            }
            // add the submission titles
            contentTitles.push(data.data.children[i].data.title);
            // add the reddit id of the submissions
            contentID.push(data.data.children[i].data.id);
            // create link paths to the reddit comments section for each video
            comments.push("https://www.reddit.com" + data.data.children[i].data.permalink);
          }
        }
      }
      console.log(contentLinks);
      console.log(comments);

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
          $(this).next().html('<div style="width: 100%; height: 0px; position: relative; padding-bottom: 50.00%;"><iframe class="gif" src=' + contentLinks[elementIndex] + '></div>');
        }
        $(this).data("clicked", !clicked);
        $(this).next().append('<div class="commentLink">View this post over at <a href="' + comments[elementIndex] + '">reddit.com</a></div>');
        // anchor.setAttribute('href', comments[elementIndex]);
        // $(this).next().append(anchor);

      })
      $('select').material_select();
    })
  });
});
