var tagsToReplace = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
};

function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}

function safe_tags_replace(str) {
    return str.replace(/[&<>]/g, replaceTag);
}

var url = "leaderboardData";
var http = new XMLHttpRequest();
http.open("GET", url, true);
http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {
        $.getJSON("setups.json", function (data) {
            var topUsers = JSON.parse(http.responseText);
            var point_values = {
                easy: 1,
                medium: 3,
                hard: 5,
                test: 0,
            };
            var color_values = [
                "white",
                "white",
                "#ff8ff6",
                "#f1c40f",
                "#f1c40f",
            ];
            var d = new Date();
            var n = d.getTime();
            for (var i = 0; i < topUsers.length; i++) {
                user = topUsers[i];
                new_history = JSON.parse(user["history"]);
                topUsers[i]["diff"] = 0;
                for (var [key, value] of Object.entries(new_history)) {
                    if (value["completed"] != 0) {
                        if (!data[value["difficulty"]][key]) {
                            continue;
                        }
                        winrate =
                            data[value["difficulty"]][key]["completions"] /
                            data[value["difficulty"]][key]["plays"];
                        if (data[value["difficulty"]][key]["plays"] != 0) {
                            points =
                                parseFloat(topUsers[i]["points"]) +
                                parseFloat(
                                    point_values[value["difficulty"]] *
                                        (1 - winrate)
                                );
                            if (
                                data[value["difficulty"]][key]["season"] ==
                                data.global.season
                            ) {
                                topUsers[i]["points"] = points.toFixed(1);
                            }
                            if (value["completed"] > n - 1000 * 60 * 60 * 24) {
                                points =
                                    parseFloat(topUsers[i]["diff"]) +
                                    parseFloat(
                                        point_values[value["difficulty"]] *
                                            (2 - winrate)
                                    );
                                if (
                                    data[value["difficulty"]][key]["season"] ==
                                    data.global.season
                                ) {
                                    topUsers[i]["diff"] = points.toFixed(1);
                                }
                            }
                        }
                    }
                }
            }

            topUsers.sort(function (b, a) {
                return a["points"] - b["points"] || b["time"] - a["time"];
            });

            topUsersOld = JSON.parse(JSON.stringify(topUsers));
            topUsersOld.sort(function (b, a) {
                return a["points"] - a["diff"] - (a["points"] - a["diff"]);
            });
            html_str = "";
            for (var i = 0; i < topUsers.length; i++) {
                if (
                    !data["global"]["banned"].includes(topUsers[i]["userid"]) &&
                    topUsers[i]["points"] != 0
                ) {
                    color = color_values[topUsers[i]["supporter"]];
                    if (topUsers[i]["username"].replace(/\s+/g, "") == "") {
                        topUsers[i]["username"] = "???";
                    }
                    if (topUsers[i]["diff"] > 0) {
                        diff_str = `
            <div class="column diff">
              +${topUsers[i]["diff"]}
            </div>`;
                    } else {
                        diff_str = `
            <div class="column diff">
              &nbsp;
            </div>`;
                    }
                    var htmlData = `<a href="profile?userid=${
                        topUsers[i]["userid"]
                    }"><li class="leaderboard item">
            <div class="column name">
              <img class="leaderboard icon" src="https://cdn.discordapp.com/avatars/${
                  topUsers[i]["userid"]
              }/${
                        topUsers[i]["avatar"]
                    }.webp" height="50" width="50" onerror="this.onerror=null; this.src='https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png'">
              <span class="leaderboard name" style="color:${color}">${safe_tags_replace(
                        topUsers[i]["username"]
                    )}</span>
            </div>${diff_str}
            <div class="column points">
              <span class="leaderboardPoints">${topUsers[i]["points"]}</span>
            </div>
    			</li></a>`;
                    html_str += htmlData;
                }
            }
            document.getElementById("leaderboard").innerHTML += html_str;
        });
    }
};
http.send(null);
