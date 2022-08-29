import {score as scoreLR} from './lrModel' ;
import {score as scoreRF} from './rfModel' ;
// import * as scoreRf from './rfModel';
export const lrModel = (input)=>{return scoreLR(input)}
export const rfModel = (input)=>{return scoreRF(input)}