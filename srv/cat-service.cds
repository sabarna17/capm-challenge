using { golf } from '../db/schema';
using { remoteService as external } from './external/remoteService';

service CatalogService @(path:'/golfRounds') {
  entity Players as projection on external.Players;
  entity Rounds as projection on golf.Rounds;
  entity Holes as projection on golf.Holes;
  entity Shots as projection on golf.Shots;
} 
