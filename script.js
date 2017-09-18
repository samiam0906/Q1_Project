var contentLinks = [];
var contentTitles = [];
var contentID = [];

var collapsibleBody = document.querySelector('.collapsible-body');
var collapsibleHeader = document.querySelector('.collapsible-header');
// var redditData = {};

// checks if value in array is a string
// for (var i = 0; i < contentLinks.length; i++) {
//   if (typeof contentLinks[i] === "string") {
//     // checks if value is a link
//     if (contentLinks[i].includes("http")) {
//       console.log("Hello world");
//     }
//   }
// }

// returns all of the gif links in an array
$.get("https://www.reddit.com/r/soccer.json", function(data) {
  var submissions = data.data.children;
  for (var i = 0; i < submissions.length; i++) {
    // checks if submission to reddit is a video
    if (data.data.children[i].data.secure_media) {
      if (data.data.children[i].data.secure_media.oembed.type == "video") {
        // add the gif urls
        contentLinks.push(data.data.children[i].data.url);
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
    $('main ul li').each(function(index) {
      $(this).attr('id', contentID[index]);
    })

    // adds the gif urls to each collapsible body
    $('.collapsible-header').click(function(e) {
      $('.collapsible-body').each(function(index) {
        $(this).html('<iframe class="gif" src=' + contentLinks[index] + '>');
      })
    })

    // $(this).html('<iframe src=' + contentLinks[index] + '>');
  })
});
