/********JS for Product Detail page **************/

var detailMainImg = document.getElementById('detailMainImg');
var smallImg = document.getElementsByClassName('small-img');

detailMainImg.src = smallImg[0].src;

smallImg[0] .onclick = function() {
    detailMainImg.src = smallImg[0].src;
}
smallImg[1] .onclick = function() {
    detailMainImg.src = smallImg[1].src;
}
smallImg[2] .onclick = function() {
    detailMainImg.src = smallImg[2].src;
}
smallImg[3] .onclick = function() {
    detailMainImg.src = smallImg[3].src;
}


// $(function ($) {
//     $(detailMainImg, smallImg).xzoom({
//         zoomWidth: 500,
//         tint: "#333",
//         Xoffset: "10",
//     });
// });