'use strict';

(()=>{//returnは関数内でしか使えない
  class PuzzleRenderer{
     constructor(puzzle, canvas){
       this.puzzle =puzzle;
       this.canvas=canvas;
       this.ctx=this.canvas.getContext('2d');
       this.TILE_SIZE=70;   //マジックナンバーは大文字で
       this.img =document.createElement('img');
       this.img.src='img/15puzzle.png';
       this.img.addEventListener('load', ()=>{
         this.render();
       });
      this.canvas.addEventListener('click', e=>{
        // if(this.isCompleted===true){
        if(this.puzzle.getCompletedStatus()===true){ //条件式の ===true　は省略可
          return;
        }
        const rect =this.canvas.getBoundingClientRect();  //canvasの位置やサイズに関する情報のオブジェクトを返してくれる。
      // console.log(e.clientX-rect.left, e.clientY-rect.top)
      const col=Math.floor((e.clientX-rect.left)/this.TILE_SIZE);
      const row=Math.floor((e.clientY-rect.top)/this.TILE_SIZE);
      this.puzzle.swapTiles(col, row);
      this.render();
    
      if(this.puzzle.isComplete()===true){
        this.puzzle.setCompletedStatus(true);
        this.renderGameClear();
      }
    })
      }
      renderGameClear(){
        this.ctx.fillStyle='rgba(0, 0, 0, 0.4)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.font='28px Arial';
        this.ctx.fillStyle ='#fff';
        this.ctx.fillText('GAME CLEAR!', 40, 150)
      }
  
      render(){
      for(let row=0; row<this.puzzle.BOARD_SIZE; row++){
        for(let col=0; col<this.puzzle.BOARD_SIZE; col++){
          // this.renderTitle(this.tile[row][col], col, row)
          this.renderTitle(this.puzzle.getTile(row, col), col, row)
        };
      }
    }
    renderTitle(n, col, row){
      this.ctx.drawImage(
        this.img,
        (n%this.puzzle.getBoardSize())*this.TILE_SIZE, Math.floor(n/this.puzzle.getBoardSize())*this.TILE_SIZE, 
        this.TILE_SIZE, this.TILE_SIZE, //画像の切り出し
        col*this.TILE_SIZE, row*this.TILE_SIZE, 
        this.TILE_SIZE, this.TILE_SIZE// 画像貼り付け
        );
      }
    };
    const canvas=document.querySelector('canvas');
    if(typeof canvas.getContext('2d')==='undefined'){
      return;
      
  }
  class Puzzle{
    constructor(level){
      this.level=level;
      this.tile=[
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15]
      ]
      this.UDLR=[
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0]
      ]
      this.isCompleted=false;
      this.BOARD_SIZE=this.tile.length;
      this.BLANK_INDEX=this.tile.length**2 - 1;
      do{
        this.shuffle(level);
    }while(this.isComplete()===true) //this.isComplete()===trueである限りdoの処理を続ける。
  }
  
  getBoardSize(){
  return this.BOARD_SIZE;
  }
  getBlankIndex(){
  return this.BLANK_INDEX;
  }
 getCompletedStatus(){
  return this.isCompleted;
}

 setCompletedStatus(value){
  this.isCompleted=value;
}

 getTile(row, col){
  return this.tile[row][col];
}

  shuffle(level){
    let blankCol=this.BOARD_SIZE-1;
    let blankRow=this.BOARD_SIZE-1;
    
    for(let i=0; i<level; i++){
      let destCol;
      let destRow;
      
      do{
        const dir =Math.floor(Math.random()*this.UDLR.length)
        destCol=blankCol+this.UDLR[dir][0];
        destRow=blankRow+this.UDLR[dir][1];
      }
      while(this.isOutSide(destCol, destRow)===true)
      [this.tile[blankRow][blankCol],
      this.tile[destRow][destCol]]=[
        this.tile[destRow][destCol],
        this.tile[blankRow][blankCol]
      ];
      [blankCol, blankRow]=[destCol, destRow]
    }
  }
  
  swapTiles(col, row){
    if(this.tile[row][col]===this.BLANK_INDEX){
      return;
    }
    for(let i=0; i<4; i++){
      const destCol=col+this.UDLR[i][0];
      const destRow=row+this.UDLR[i][1];
      if(this.isOutSide(destCol, destRow)===true){
        continue;
      }
      
      if(this.tile[destRow][destCol]===this.BLANK_INDEX){
        [this.tile[row][col],
        this.tile[destRow][destCol]]=[
          this.tile[destRow][destCol],
          this.tile[row][col]
        ]
      }
    }
  }
  
  isOutSide(destCol, destRow){
    return( destCol<0||destCol>this.BOARD_SIZE-1||destRow<0||destRow>this.BOARD_SIZE-1);
  }
  
  isComplete(){
    let i=0;
    for(let row=0; row<this.BOARD_SIZE; row++){
      for(let col=0; col<this.BOARD_SIZE; col++){
        if(this.tile[row][col]!==i++){
          return false;
        }
      }
    }
    return true;
  }
  
  }
  new PuzzleRenderer(new Puzzle(2), canvas)
})();