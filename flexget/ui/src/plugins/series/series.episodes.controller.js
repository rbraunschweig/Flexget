(function () {
    'use strict';

    angular.module('flexget.plugins.series.episodes')
        .controller('episodesController', episodesController);

    function episodesController($http, $stateParams, $mdDialog) {
        var vm = this;

        var show = undefined;

        $http.get('/api/series/' + $stateParams.id + '/episodes')
            .success(function(data) {
                vm.episodes = data.episodes;
                show = data.show
            });

        vm.forgetEpisode = function(episode) {
            var confirm = $mdDialog.confirm()
                .title('Confirm forgetting episode.')
                .htmlContent("Are you sure you want to forget episode <b>" + episode.episode_identifier + "</b> from show " + show + "?")
                .ok("Forget")
                .cancel("No");

            $mdDialog.show(confirm).then(function() {
                $http.delete('/api/series/' + $stateParams.id + '/episodes/' + episode.episode_id)
                    .success(function(data) {
                        var index = vm.episodes.indexOf(episode);
                        vm.episodes.splice(index, 1);
                    })
                    .error(function(error) {
                        var errorDialog = $mdDialog.alert()
                            .title("Something went wrong")
                            .htmlContent("Oops, something went wrong when trying to forget <b>" + episode.episode_identifier + "</b> from show " + show + ":\n" + error.message)
                            .ok("Ok");

                        $mdDialog.show(errorDialog);
                    })
            });
        }
    }

})();