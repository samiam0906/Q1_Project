var contentLinks = [];
var contentTitles = [];
var contentID = [];

var collapsibleBody = document.querySelector('.collapsible-body');
var collapsibleHeader = document.querySelector('.collapsible-header');
// var redditData = {};

// stores the value of the user dropdown selection ***DOES NOT WORK***
var userInput = $('.select-dropdown').val();
console.log(userInput);

// checks if value in array is a string
// for (var i = 0; i < contentLinks.length; i++) {
//   if (typeof contentLinks[i] === "string") {
//     // checks if value is a link
//     if (contentLinks[i].includes("http")) {
//       console.log("Hello world");
//     }
//   }
// }

// function that grabs the array index of the select-dropdown options
$(document).ready(function () {
    $('select').material_select();
    $('select').change(function(){
        var newValuesArr = [],
            select = $(this),
            ul = select.prev();
        ul.children('li').toArray().forEach(function (li, i) {
            if ($(li).hasClass('active')) {
                newValuesArr.push(select.children('option').toArray()[i].value - 1);
            }
        });
        select.val(newValuesArr);
        console.log(newValuesArr);
    });
});

// $('.input-field').on('change', 'select', function(){
//
// });
//
// var userInput = $('#category').value;
// console.log(userInput);

// returns all of the gif links in an array
$.get("https://www.reddit.com/r/soccer.json", function(data) {
  var submissions = data.data.children;
  for (var i = 0; i < submissions.length; i++) {
    // checks if submission to reddit is a video
    if (data.data.children[i].data.secure_media) {
      if (data.data.children[i].data.secure_media.oembed.type == "video") {
        // add the youtube embed urls
        if (data.data.children[i].data.domain === "youtube.com") {
          var youtubeLink = data.data.children[i].data.url.replace("watch?v=", "embed/");
          contentLinks.push(youtubeLink);
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
  // create an object out of the data parsed from reddit
  // redditData.id = contentID.valueOf();
  // redditData.links = contentLinks.valueOf();
  // redditData.titles = contentTitles.valueOf();

  $(document).ready(function() {
    $('.collapsible').collapsible();
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
      $(this).prepend('<i class="fa fa-futbol-o fa-5x" aria-hidden="true"></i>');
    })

    // add id to the collapsible-body
    $('main ul li .collapsible-body').each(function(index) {
      $(this).attr('id', contentID[index]);
    })

    // adds the gif urls to each collapsible body
    $('.collapsible-header').click('iframe', function(e) {
      if ($(e.target).parent().hasClass('active')) {
        $(this).next().next().html("");
      }
      // if (e.target.next().contains('iframe')) {
      //   $('.collapsible-body').html("");
      // }
      // if ($(e.target).parent().hasClass('active')) {
      //   $(e.target).next().innerHTML = "";
      // }
      $('.collapsible-body').html("");
      var elementIndex = contentID.indexOf($(this).next().attr('id'));
      // $(this).next().html('<div style="width: 100%; height: 0px; position: relative; padding-bottom: 56.250%;"><iframe src=' + contentLinks[elementIndex] + '/ylhkwh '+ 'frameborder="0" width="100%" height="100%" allowfullscreen style="width: 100%; height: 100%; position: absolute;"></iframe></div>')
      $(this).next().html('<iframe class="gif" src=' + contentLinks[elementIndex] + '>');
    })

    // initialize our selector form and inputs
    $('select').material_select()
  })
});
