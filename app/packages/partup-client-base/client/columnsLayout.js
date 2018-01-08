Partup.client.columnsLayout = {
  getAmountOfColumnsThatFitInElement: function(selector, minWidth) {
    let element = $(selector)[0];
    let offsetWidth = element ? element.offsetWidth : 0;
    let layoutWidth = Math.min(window.innerWidth, offsetWidth);
    return Math.max(Math.min(Math.floor(layoutWidth / minWidth), 4), 1);
  },
};
