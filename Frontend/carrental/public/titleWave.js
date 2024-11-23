function waveTitleEffect() {
    var baseTitle = "ABC Rentals ";
    var waveText = "✈️";
    var title = baseTitle + waveText;
    var waveTitle = title;
    var i = 0;
    var forward = true;
  
    function updateTitle() {
        if (forward) {
            if (i < title.length) {
                document.title = waveTitle.substring(0, i + 1);
                i++;
            } else {
                forward = false;
                i--;
            }
        } else {
            if (i >= baseTitle.length) {
                document.title = waveTitle.substring(0, i);
                i--;
            } else {
                forward = true;
                i++;
            }
        }
    }
  
    setInterval(updateTitle, 400);
}

waveTitleEffect();
