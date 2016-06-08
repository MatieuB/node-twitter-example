var twitterStream = angular.module('myApp', ['chart.js'])

twitterStream.controller("mainCtrl", ['$scope', 'socket',
function ($scope, socket) {
  //chart labels
  $scope.labels = ["Trump", "Bernie", "Hillary"];
  //chart colors
  $scope.colors = ['#6c6a6c','#000000','#7FFD1F'];
  //intial data values
  $scope.pplData = {trump: {numTallied:0, totalFollowers:0}, bernie: {numTallied:0, totalFollowers:0}, hillary: {numTallied:0, totalFollowers:0}};


  function sortByFollowers(a,b){
    return b.followers - a.followers;
  }

  $scope.mostPopular = {
    trump: [],
    bernie: [],
    hillary: []
  }

  $scope.followersData = [0,0,0]

  socket.on('newTweet', function (tweet) {
    $scope.tweet = tweet.text
    $scope.user = tweet.user.screen_name
    //parse followers from payload
    var followers = tweet.user.followers_count;
    //all hashtags in the tweet
    var hashtags = tweet.entities.hashtags.map(function(el){
      return el.text.toLowerCase()
    })

    //check followers and increment for #trump tweets
    if (hashtags.includes('trump')){
      var trump = $scope.pplData.trump;
      trump.numTallied++;
      trump.totalFollowers += +followers;
      $scope.followersData[0] = trump.totalFollowers / trump.numTallied;
      var popularTrump = $scope.mostPopular.trump
      console.log(tweet.text);
      var newPost = {message: $scope.tweet, followers: +followers, user: tweet.user.screen_name}
      if(popularTrump.length === 0){
        popularTrump.push(newPost)
      }else if (popularTrump.length >= 5 && popularTrump[4].followers < followers){
        popularTrump.pop();
        popularTrump.push(newPost);
        popularTrump.sort(sortByFollowers);
      }else if (popularTrump.length < 5){
        popularTrump.push(newPost);
        popularTrump.sort(sortByFollowers);
      }
      console.log(popularTrump);
    }

    //check followers and increment for #feelthebern tweets
    else if (hashtags.includes('feelthebern')) {
      var bernie = $scope.pplData.bernie;
      bernie.numTallied++;
      bernie.totalFollowers += +followers;
      $scope.followersData[1] = bernie.totalFollowers / bernie.numTallied;

      var popularBernie = $scope.mostPopular.bernie
      console.log(tweet.text);
      var newPost = {message: $scope.tweet, followers: +followers, user: tweet.user.screen_name}
      if(popularBernie.length === 0){
        popularBernie.push(newPost)
      }else if (popularBernie.length >= 5 && popularBernie[4].followers < followers){
        popularBernie.pop();
        popularBernie.push(newPost);
        popularBernie.sort(sortByFollowers);
      }else if (popularBernie.length < 5){
        popularBernie.push(newPost);
        popularBernie.sort(sortByFollowers);
      }
      console.log(popularBernie);
    }

    else if (hashtags.includes('hillaryclinton')) {
      var hillary = $scope.pplData.hillary;
      hillary.numTallied++;
      hillary.totalFollowers += +followers;
      $scope.followersData[2] = hillary.totalFollowers / hillary.numTallied;


      var popularHillary = $scope.mostPopular.hillary;
      console.log(tweet.text);
      var newPost = {message: $scope.tweet, followers: +followers, user: tweet.user.screen_name}
      if(popularHillary.length === 0){
        popularHillary.push(newPost)
      }else if (popularHillary.length >= 5 && popularHillary[4].followers < followers){
        popularHillary.pop();
        popularHillary.push(newPost);
        popularHillary.sort(sortByFollowers);
      }else if (popularHillary.length < 5){
        popularHillary.push(newPost);
        popularHillary.sort(sortByFollowers);
      }
      console.log(popularHillary);
    }
  });
}
]);


/*---------SOCKET IO METHODS (careful)---------*/

twitterStream.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
