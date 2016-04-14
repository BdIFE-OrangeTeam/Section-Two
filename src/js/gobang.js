/**
` * el: canvas
  */
function Chess(el) {
  this.canvas = document.querySelector(el);
  this.pieceColor = true; // 棋子颜色: true 为黑色, false 为白色
  this.chessBoard = [];
  // AI
  this.wins = []; // 赢法数组
  this.count = 0; // 赢法种类
  // AI 赢法的统计数组
  this.myWin = [];
  this.computerWin = [];
  // 下棋是否下完
  this.over = false;

  this.context = this.canvas.getContext('2d');
  this.canvas.onclick = this.onclick.bind(this);
}

Chess.prototype = {
  init: function (width, height) {
    for (var i=0; i<15; ++i) {
      this.chessBoard[i] = [];
      for (var j=0; j<15; j++) {
        this.chessBoard[i][j] = 0;
      }
    }

    // 赢法数组初始化
    for (var i=0; i<15; ++i) {
      this.wins[i] = [];
      for (var j=0; j<15; ++j) {
        this.wins[i][j] = [];
      }
    }

    // 横线
    for (var i=0; i<15; ++i) {
      for (var j=0; j<11; ++j) {
        // wins[0][0][0] = true
        // wins[0][1][0] = true
        // wins[0][2][0] = true
        // wins[0][3][0] = true
        // wins[0][4][0] = true

        // wins[0][1][1] = true
        // wins[0][2][1] = true
        // wins[0][3][1] = true
        // wins[0][4][1] = true
        // wins[0][5][1] = true
        for (var k=0; k<5; ++k) {
          this.wins[i][j+k][this.count] = true;
        }
        this.count ++;
      }
    }

    // 竖线
    for (var i=0; i<15; ++i) {
      for (var j=0; j<11; ++j) {
        for (var k=0; k<5; ++k) {
          this.wins[j+k][i][this.count] = true;
        }
        this.count ++;
      }
    }

    // 斜线
    for (var i=0; i<11; ++i) {
      for (var j=0; j<11; ++j) {
        for (var k=0; k<5; ++k) {
          this.wins[i+k][j+k][this.count] = true;
        }
        this.count ++;
      }
    }

    // 反斜线
    for (var i=0; i<11; ++i) {
      for (var j=14; j>3; j--) {
        for (var k=0; k<5; ++k) {
          this.wins[i+k][j-k][this.count] = true;
        }
        this.count ++;
      }
    }

    // 统计数组初始化
    for (var i=0; i<this.count; ++i) {
      this.myWin[i] = 0;
      this.computerWin[i] = 0;
    }

    this.draw();
  },

  drawLine: function () {
    for (var i=0; i<15; ++i) {
      // 横线
      this.context.moveTo(15, 15+30*i);
      this.context.lineTo(435, 15+30*i);
      this.context.stroke();

      // 纵线
      this.context.moveTo(15 + 30*i, 15);
      this.context.lineTo(15 + 30*i, 435);
      this.context.stroke();
    }
  },
  drawPiece: function (i, j, me) {
    this.context.beginPath();
    this.context.arc(15 + 30*i, 15 + 30*j, 13, 0, 2*Math.PI);
    this.context.closePath();
    var gradient = this.context.createRadialGradient(15 + 30*i+2, 15 + 30*j-2, 13, 15 + 30*i, 15 + 30*j, 0);
    if (me) {
      gradient.addColorStop(0, '#0A0A0A');
      gradient.addColorStop(1, '#636766');
    } else {
      gradient.addColorStop(0, '#D1D1D1');
      gradient.addColorStop(1, '#F9F9F9');
    }

    this.context.fillStyle = gradient;
    this.context.fill();
  },
  loadBackground: function (url) {
    var bg = new Image();
    bg.src = url || "images/bg.jpg";
    bg.style.opacity = "1";
    // bg.style.backgroundColor = "red";
    bg.onload = function () {
      this.context.drawImage(bg, 0, 0, 450, 450);

      this.drawLine();
      //
      // this.drawPiece(0, 0, true);
      // this.drawPiece(1, 1, false);
    }.bind(this);
  },
  draw: function (width, height) {
    width = width || 450;
    height = height || 450;

    this.context.strokeStyle = "#BFBFBF";

    // this.context.moveTo(0, 0);
    // this.context.lineTo(width, height);
    // this.context.stroke();

    // for (let i=0; i<15; ++i) {
    //   // 横线
    //   this.context.moveTo(15, 15+30*i);
    //   this.context.lineTo(435, 15+30*i);
    //   this.context.stroke();
    //
    //   // 纵线
    //   this.context.moveTo(15 + 30*i, 15);
    //   this.context.lineTo(15 + 30*i, 435);
    //   this.context.stroke();
    // }

    // load background image
    this.loadBackground();
  },
  // Event
  onclick: function (e) {
    // 下棋结束 或者 不是我方(黑棋)下棋
    if (this.over || !this.pieceColor) return ;

    var x = e.offsetX,
        y = e.offsetY;

    var i = Math.floor(x / 30),
        j = Math.floor(y / 30);

    if (this.chessBoard[i][j] !== 0) {
      alert("不能覆盖棋子!");
      return ;
    }

    // this.chessBoard[i][j] = this.pieceColor ? 1 : 2; // 黑棋为1, 白棋为2
    this.chessBoard[i][j] = 1;
    this.drawPiece(i, j, this.pieceColor);
    // this.pieceColor = ! this.pieceColor;

    this.judge(i, j);
  },
  // AI
  judge: function (i, j) {
    for (var k=0; k<this.count; ++k) {
       if (this.wins[i][j][k]) {
        this.myWin[k]++;
        this.computerWin[k] = 6; // 异常，computer不可能赢
        if (this.myWin[k] === 5) {
          window.alert("你赢了");
          this.over = true;
        }
      }
    }

    if (!this.over) {
      this.pieceColor = ! this.pieceColor;
      this.computerAI();
    }
  },
  //
  computerAI: function () {
    var myScore = [],
      computerScore = [];

    var max = 0;
    var u=0,
        v=0;

    for (var i=0; i<15; ++i) {
      myScore[i] = [];
      computerScore[i] = [];
      for (var j=0; j<15; j++) {
        myScore[i][j] = 0;
        computerScore[i][j] = 0;
      }
    }

    for (var i=0; i<15; ++i) {
      for (var j=0; j<15; j++) {
        if (this.chessBoard[i][j] == 0) {
          for (var k=0; k<this.count; k++) {
            if (this.wins[i][j][k]) {
              switch(this.myWin[k]) {
                case 1:
                  myScore[i][j] += 200;
                  break;
                case 2:
                  myScore[i][j] += 400;
                  break;
                case 3:
                  myScore[i][j] += 1000;
                  break;
                case 4:
                  myScore[i][j] += 10000;
                  break;
              }

              switch(this.computerWin[k]) {
                case 1:
                  computerScore[i][j] += 220;
                  break;
                case 2:
                  computerScore[i][j] += 420;
                  break;
                case 3:
                  computerScore[i][j] += 2000;
                  break;
                case 4:
                  computerScore[i][j] += 20000;
                  break;
              }
            }
          }

          if (myScore[i][j] > max) {
            max = myScore[i][j];
            u = i;
            v = j;
          } else if (myScore[i][j] == max) {
            if (computerScore[i][j] > computerScore[u][v]) {
              u = i;
              v = j;
            }
          }

          if (computerScore[i][j] > max) {
            max = computerScore[i][j];
            u = i;
            v = j;
          } else if (computerScore[i][j] == max) {
            if (myScore[i][j] > myScore[u][v]) {
              u = i;
              v = j;
            }
          }
        }
      }
    }

    this.drawPiece(u, v, false);
    this.chessBoard[u][v] = 2;

    for (var k=0; k<this.count; ++k) {
       if (this.wins[u][v][k]) {
        this.computerWin[k]++;
        this.myWin[k] = 6; // 异常，computer不可能赢
        if (this.computerWin[k] === 5) {
          window.alert("AI赢了");
          this.over = true;
        }
      }
    }

    if (!this.over) {
      this.pieceColor = ! this.pieceColor;
    }
  },
};


new Chess(".chess").init(450, 450);
