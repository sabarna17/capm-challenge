using { managed, cuid  } from '@sap/cds/common';

namespace golf;

entity Rounds : cuid, managed{
  @cds.search: { title }
  title  : String(111);
  holes  : Composition of many Holes on holes.round.ID = $self.ID;
  
}

entity Holes : cuid{
  par    : Integer @assert.range: [3,5];
  @Core.Computed
  @readonly  
  score  : Integer @assert.range: [1, 30];

  @Core.Computed
  @readonly
  result : String;

  @assert.notNull
  round  : Association to Rounds;
  shots  : Composition of many Shots on shots.hole.ID = $self.ID;

}

entity Shots : cuid  {
  hole          : Association to Holes;
  timeStart     : Timestamp @cds.on.insert : $now;
  timeEnd       : Timestamp @cds.on.insert : $now @cds.on.update : $now;
}