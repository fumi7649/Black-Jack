"use strict";
exports.__esModule = true;
exports.View = void 0;
var View = /** @class */ (function () {
    function View() {
        this.target = document.getElementById("#target");
    }
    View.prototype.renderLandingPage = function () {
        var container = document.createElement("div");
        container.innerHTML =
            "\n      <div id=\"landingPage\">\n        <div class=\"bg-green vh-100 d-flex justify-content-center align-items-center flex-column\">\n            <h5 class=\"text-white\">Welcom to Card Game!</h5>\n            <div class=\"form-group\">\n                <input type=\"text\" placeholder=\"name\" class=\"form-control\">\n                <select class=\"form-select\">\n                    <option value=\"blackjack\">Blackjack</option>\n                    <option value=\"porker\">Poker</option>           \n                </select>\n                <button class=\"btn btn-success form-control my-2\">Start Game</button>\n            </div>\n        </div>\n    </div>\n      ";
        this.target.append(container);
    };
    return View;
}());
exports.View = View;
