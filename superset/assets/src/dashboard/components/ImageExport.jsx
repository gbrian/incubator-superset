import domtoimage from 'dom-to-image';

export function downloadDashboardImage(target, autodownload){
    return new Promise((res, rej) => {
        var jtarget = $(target);
        window.setTimeout(() => {
          // fix transparent backgrounds
          var bgc = jtarget.css('background-color');
          var bgcs = [bgc].concat(
                        jtarget.parents().map((i, el) => $(el).css('background-color')).toArray()
                      )
                      .filter(c => c !== "rgba(0, 0, 0, 0)");    
          var node = jtarget.css('background-color', bgcs[0]||bgc);
          var title = jtarget.find('.dashboard-header .editable-title input').val();
          
          domtoimage.toJpeg(node[0], { quality: 0.95 })
            .then(function (dataUrl) {
                if(autodownload){
                    var link = document.createElement('a');
                    link.download = title + '.jpeg';
                    link.href = dataUrl;
                    link.click();
                }
                res(dataUrl);
            })
            .catch(err => {
                console.error(err);
                res(null);
            })
            .finally(function(){
              node.css('background-color', bgc);
            });
          },
          1000);
    });
  };

export function downloadChartImage(target, cb){
    //debugger;
    var jtarget = $(target)
                .parents('.dashboard-component-chart-holder');
    window.setTimeout(() => {
      // fix transparent backgrounds
    var bgc = jtarget.css('background-color');
    var bgcs = [bgc].concat(
                  jtarget.parents().map((i, el) => $(el).css('background-color')).toArray()
                )
                .filter(c => c !== "rgba(0, 0, 0, 0)");    
    var node = jtarget.css('background-color', bgcs[0]||bgc);
    var title = jtarget.find('.editable-title input').val();
    
      domtoimage.toJpeg(node[0], { quality: 0.95 })
        .then(function (dataUrl) {
            if(cb){
                cb(dataUrl);
            }else{
                var link = document.createElement('a');
                link.download = title + '.jpeg';
                link.href = dataUrl;
                link.click();
            }
        })
        .finally(function(){
          node.css('background-color', bgc);
        });
      },
      1000);
  }
