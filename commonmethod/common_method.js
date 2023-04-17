import { sleep } from 'k6';
import { check } from 'k6';


export function addition(a,b) {
    console.log('2+3 is equal to ');
    return a+b;
}